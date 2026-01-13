import React, { useState, useRef, useEffect } from 'react';
import { ConversationSummary, Message } from '@/types';
import { StatusIndicator, TypingIndicator } from './StatusIndicator';
import { getAvatarColor, getInitials, formatTime } from '@/utils';

interface ChatWindowProps {
  conversation: ConversationSummary;
  messages: Message[];
  onSendMessage: (content: string) => void;
  isLoading?: boolean;
}

export function ChatWindow({ 
  conversation, 
  messages, 
  onSendMessage, 
  isLoading = false 
}: ChatWindowProps) {
  const [inputValue, setInputValue] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;

    container.scrollTo({
      top: container.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    onSendMessage(inputValue);
    setInputValue('');
  };

  const avatarColor =
    conversation.employee_avatar_color || getAvatarColor(conversation.employee_name);

  const canSendMessage = conversation.status === 'waiting_response' && !isLoading;
  const isCompleted = conversation.status === 'completed';

  return (
    <div className="chat-window">
      {/* Header */}
      <div className="chat-window-header">
        <div 
          className="chat-avatar"
            style={{ backgroundColor: avatarColor }}
        >
          {getInitials(conversation.employee_name)}
        </div>
        <div style={{ flex: 1 }}>
          <h3 className="chat-employee-name">
            {conversation.employee_name}
          </h3>
          <p className="chat-employee-role">{conversation.employee_role}</p>
        </div>
        <StatusIndicator status={conversation.status} />
      </div>

      {/* Messages */}
      <div 
        ref={chatContainerRef}
        className="chat-messages"
      >
        {messages.map((message) => (
          (() => {
            const isSystem = (message.sender || '').toLowerCase() === 'alia';
            return (
          <div
            key={message.message_key}
            style={{ display: 'flex', justifyContent: isSystem ? 'flex-start' : 'flex-end' }}
          >
            <div
              className={`chat-message-bubble ${
                isSystem
                  ? 'chat-message-bubble-alia'
                  : 'chat-message-bubble-employee'
              }`}
            >
              <p>{message.content}</p>
              <span className="chat-message-timestamp">
                {formatTime(message.timestamp)}
              </span>
            </div>
          </div>
            );
          })()
        ))}
        
        <TypingIndicator isVisible={conversation.status === 'typing'} />
      </div>

      {/* Input - some apenas quando a conversa estiver concluída */}
      {!isCompleted && (
        <form onSubmit={handleSendMessage} className="chat-input-area">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="chat-input"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!canSendMessage || !inputValue.trim() || isLoading}
            className="btn-primary"
          >
            Enviar
          </button>
        </form>
      )}

      {conversation.status === 'completed' && (
        <div style={{ padding: '0.75rem 1rem', background: '#ecfdf5', borderTop: '1px solid #bbf7d0' }}>
          <p style={{ fontSize: '0.8rem', color: '#166534', textAlign: 'center', margin: 0 }}>
            ✅ Conversa concluída
          </p>
        </div>
      )}
    </div>
  );
}