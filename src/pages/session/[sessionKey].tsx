import React from 'react';
import { useRouter } from 'next/router';
import { useSession, useConversations } from '@/hooks/useConversations';
import { MultiChatGrid } from '@/components/MultiChatGrid';
import { ProgressSummary } from '@/components/ProgressSummary';

export default function SessionPage() {
  const router = useRouter();
  const { sessionKey } = router.query;

  const {
    session,
    ontology,
    loading: sessionLoading,
    error: sessionError,
    refetch: refetchSession,
  } = useSession(typeof sessionKey === 'string' ? sessionKey : null);

  const { conversations, sendMessage } = useConversations(session, refetchSession);

  if (sessionLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando sessão de verificação...</p>
        </div>
      </div>
    );
  }

  if (sessionError) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-500 mb-4">
            <svg
              className="w-12 h-12 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Erro ao carregar sessão
          </h2>
          <p className="text-gray-600 mb-4">{sessionError}</p>
          <button
            onClick={refetchSession}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="app-shell">
      {/* Botão de voltar no canto superior esquerdo */}
      <div
        style={{
          position: 'fixed',
          top: '1.5rem',
          left: '1.5rem',
          zIndex: 50,
        }}
      >
        <button
          type="button"
          onClick={() => router.push('/')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '2.25rem',
            height: '2.25rem',
            borderRadius: '9999px',
            border: '1px solid rgba(15, 23, 42, 0.2)',
            background: 'rgba(255, 255, 255, 0.85)',
            color: '#0f172a',
            cursor: 'pointer',
            boxShadow: '0 1px 3px rgba(15, 23, 42, 0.08)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <span style={{ fontSize: '1.25rem', fontWeight: 200, lineHeight: 1 }}>
            {"<"}
          </span>
        </button>
      </div>

      <div className="app-container">
        {/* Header */}
        <div>
          <h1 className="app-header-title">
            Sistema de Verificação de Habilidades - Alia
          </h1>
          <p className="app-header-subtitle">
            Verificação automática de competências através de conversas com múltiplos stakeholders
          </p>
        </div>

        <div className="app-main-grid">
          {/* Chat Grid */}
          <div className="chat-column">
            <div style={{ marginBottom: '0.75rem' }}>
              <h2 className="chat-column-header-title">Conversas Ativas</h2>
              <p className="chat-column-header-subtitle">
                Acompanhe as conversas simultâneas da Alia com os stakeholders
              </p>
            </div>
            <MultiChatGrid
              conversations={conversations}
              onSendMessage={sendMessage}
            />
          </div>

          {/* Progress Summary */}
          <div className="summary-column">
            <ProgressSummary
              session={session}
              ontology={ontology ?? undefined}
              conversationsUI={conversations}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
