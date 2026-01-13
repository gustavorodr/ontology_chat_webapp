import { useState, useEffect, useCallback, useRef } from 'react';
import { apiService } from '@/services/api';
import {
  Session,
  ConversationSummary,
  Message,
  ConversationStatusType,
  SkillOntology,
} from '@/types';

export interface ConversationState {
  conversation: ConversationSummary;
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

export function useSession(sessionKey: string | null) {
  const [session, setSession] = useState<Session | null>(null);
  const [ontology, setOntology] = useState<SkillOntology | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSession = useCallback(async () => {
    if (!sessionKey) return;

    setLoading(true);
    setError(null);

    try {
      const sessionData = await apiService.getSession(sessionKey);
      setSession(sessionData);

      // If session is completed, try to fetch ontology
      if (sessionData.status === 'completed') {
        try {
          const ontologyData = await apiService.getSessionOntology(sessionKey);
          setOntology(ontologyData);
        } catch (ontologyError) {
          // Ontology might not be ready yet, that's ok
          console.warn('Ontology not ready yet:', ontologyError);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch session');
    } finally {
      setLoading(false);
    }
  }, [sessionKey]);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  return {
    session,
    ontology,
    loading,
    error,
    refetch: fetchSession,
  };
}

export function useConversations(session: Session | null, onSessionUpdated?: () => void) {
  const [conversations, setConversations] = useState<Record<string, ConversationState>>({});
  const startedRef = useRef<Record<string, boolean>>({});

  const initializeConversation = useCallback(async (conversation: ConversationSummary) => {
    if (conversations[conversation.conversation_key]) {
      return; // Already initialized
    }

    setConversations(prev => ({
      ...prev,
      [conversation.conversation_key]: {
        conversation,
        messages: [],
        isLoading: false,
        error: null,
      },
    }));

    // Fetch existing messages
    try {
      const messagesData = await apiService.getConversationMessages(conversation.conversation_key);

      // Normaliza mensagens do backend para o formato esperado pelo front
      const normalizedMessages: Message[] = messagesData.messages.map((raw: any) => ({
        message_key: raw.message_key,
        conversation_key: conversation.conversation_key,
        sender: (raw.sender || '').toLowerCase() === 'alia' ? 'Alia' : 'Employee',
        content: raw.content,
        message_type: raw.message_type || 'text',
        timestamp: raw.sent_at || raw.timestamp,
      }));

      // Deriva o status de UI a partir da última mensagem ao recarregar:
      // - Se conversa já está concluída no backend, mantemos.
      // - Senão, se a última mensagem é da Alia, é a vez do usuário
      //   responder => status "waiting_response" (mostra input).
      // - Caso contrário, mantemos o status atual ou usamos "active".
      let derivedStatus = conversation.status;
      if (conversation.status !== 'completed' && normalizedMessages.length > 0) {
        const last = normalizedMessages[normalizedMessages.length - 1];
        if (last.sender === 'Alia') {
          derivedStatus = 'waiting_response';
        }
      }

      setConversations(prev => ({
        ...prev,
        [conversation.conversation_key]: {
          ...prev[conversation.conversation_key],
          conversation: {
            ...prev[conversation.conversation_key].conversation,
            status: derivedStatus,
          },
          messages: normalizedMessages,
        },
      }));
    } catch (error) {
      setConversations(prev => ({
        ...prev,
        [conversation.conversation_key]: {
          ...prev[conversation.conversation_key],
          error: 'Failed to load messages',
        },
      }));
    }
  }, [conversations]);

  const updateConversationStatus = useCallback(async (
    conversationKey: string,
    status: ConversationStatusType,
    durationMs?: number
  ) => {
    try {
      await apiService.updateConversationStatus(conversationKey, {
        status,
        duration_ms: durationMs,
      });

      setConversations(prev => ({
        ...prev,
        [conversationKey]: {
          ...prev[conversationKey],
          conversation: {
            ...prev[conversationKey].conversation,
            status,
          },
        },
      }));
    } catch (error) {
      console.error('Failed to update conversation status:', error);
    }
  }, []);

  const pollForNextMessage = useCallback(async (conversationKey: string) => {
    const state = conversations[conversationKey];
    if (!state || state.conversation.status === 'completed') {
      return;
    }

    try {
      setConversations(prev => ({
        ...prev,
        [conversationKey]: {
          ...prev[conversationKey],
          isLoading: true,
        },
      }));

      // Update status to typing before getting message
      await updateConversationStatus(conversationKey, 'typing', 2000);

      // Wait for typing animation
      await new Promise(resolve => setTimeout(resolve, 2000));

      const nextMessage = await apiService.getNextMessage(conversationKey);

      // 404 / sem próxima mensagem ou payload inválido:
      // apenas marca como concluída sem erro e não tenta
      // acessar propriedades de um objeto nulo/inesperado.
      if (!nextMessage || !(nextMessage as any).message_key) {
        await updateConversationStatus(conversationKey, 'completed');
        setConversations(prev => ({
          ...prev,
          [conversationKey]: {
            ...prev[conversationKey],
            conversation: {
              ...prev[conversationKey].conversation,
              status: 'completed',
            },
            isLoading: false,
          },
        }));

        // Sessão pode ter sido atualizada no backend (progresso /
        // status). Permite ao chamador refazer o fetch.
        if (onSessionUpdated) {
          onSessionUpdated();
        }
        return;
      }

      const normalized = {
        message_key: nextMessage.message_key,
        conversation_key: conversationKey,
        sender: (nextMessage.sender || '').toLowerCase() === 'alia' ? 'Alia' : 'Employee',
        content: nextMessage.content,
        message_type: 'text' as const,
        timestamp: (nextMessage as any).sent_at || (nextMessage as any).timestamp,
      };

      setConversations(prev => ({
        ...prev,
        [conversationKey]: {
          ...prev[conversationKey],
          messages: [...prev[conversationKey].messages, normalized],
          isLoading: false,
        },
      }));

      // Update status based on whether this is the final message.
      // If not final, esperamos a resposta do funcionário antes
      // de buscar a próxima mensagem.
      const newStatus: ConversationStatusType = nextMessage.is_final_message ? 'completed' : 'waiting_response';
      await updateConversationStatus(conversationKey, newStatus);

      if (newStatus === 'completed' && onSessionUpdated) {
        onSessionUpdated();
      }
    } catch (error) {
      setConversations(prev => ({
        ...prev,
        [conversationKey]: {
          ...prev[conversationKey],
          error: 'Failed to fetch next message',
          isLoading: false,
        },
      }));

      await updateConversationStatus(conversationKey, 'active');
    }
  }, [conversations, updateConversationStatus, onSessionUpdated]);

  const sendMessage = useCallback(async (conversationKey: string, content: string) => {
    try {
      const response = await apiService.sendMessage(conversationKey, {
        content,
        sender: 'Employee',
        message_type: 'text',
      });

      setConversations(prev => ({
        ...prev,
        [conversationKey]: {
          ...prev[conversationKey],
          messages: [...prev[conversationKey].messages, {
            message_key: response.message_key,
            conversation_key: conversationKey,
            sender: 'Employee',
            content,
            message_type: 'text',
            timestamp: (response as any).sent_at || (response as any).timestamp,
          }],
        },
      }));

      // After the employee responds, fetch the next scripted message.
      setTimeout(() => {
        pollForNextMessage(conversationKey);
      }, 1000);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  }, [pollForNextMessage]);

  // Initialize conversations when session changes
  useEffect(() => {
    if (!session?.conversations) return;

    session.conversations.forEach(conversation => {
      initializeConversation(conversation);
    });
  }, [session, initializeConversation]);

  // Kick off the initial scripted message for each conversation exactly once
  useEffect(() => {
    Object.values(conversations).forEach((state) => {
      const key = state.conversation.conversation_key;
      if (!startedRef.current[key] &&
          state.messages.length === 0 &&
          state.conversation.status !== 'completed' &&
          state.conversation.conversation_position === 0 &&
          !state.isLoading) {
        startedRef.current[key] = true;
        // Small delay for realism before the first message
        setTimeout(() => {
          pollForNextMessage(key);
        }, 800);
      }
    });
  }, [conversations, pollForNextMessage]);

  return {
    conversations: Object.values(conversations),
    sendMessage,
  };
}