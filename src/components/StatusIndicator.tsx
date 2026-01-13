import React from 'react';
import { ConversationStatusType } from '@/types';

interface StatusIndicatorProps {
  status: ConversationStatusType;
  className?: string;
}

export function StatusIndicator({ status, className = '' }: StatusIndicatorProps) {
  const getStatusConfig = (status: ConversationStatusType) => {
    switch (status) {
      case 'not_started':
        return {
          color: 'bg-gray-400',
          text: 'Não iniciada',
          pulse: false,
        };
      case 'active':
        return {
          color: 'bg-green-500',
          text: 'Ativa',
          pulse: true,
        };
      case 'waiting_response':
        return {
          color: 'bg-yellow-500',
          text: 'Aguardando resposta',
          pulse: true,
        };
      case 'typing':
        return {
          color: 'bg-blue-500',
          text: 'Digitando...',
          pulse: true,
        };
      case 'completed':
        return {
          color: 'bg-green-600',
          text: 'Concluída',
          pulse: false,
        };
      default:
        return {
          color: 'bg-gray-400',
          text: 'Desconhecido',
          pulse: false,
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <div className={`status-indicator ${className}`}>
      <div
        className="status-indicator-dot"
        style={{ backgroundColor: config.color.includes('#') ? config.color : undefined }}
      />
      <span>{config.text}</span>
    </div>
  );
}

interface TypingIndicatorProps {
  isVisible: boolean;
}

export function TypingIndicator({ isVisible }: TypingIndicatorProps) {
  if (!isVisible) return null;

  return (
    <div className="flex items-center gap-2 px-3 py-2 text-gray-500">
      <div className="flex gap-1">
        <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
        <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
        <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" />
      </div>
      <span className="text-xs">digitando...</span>
    </div>
  );
}