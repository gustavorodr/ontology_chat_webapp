import React from 'react';
import { ConversationState } from '@/hooks/useConversations';
import { ChatWindow } from './ChatWindow';

interface MultiChatGridProps {
  conversations: ConversationState[];
  onSendMessage: (conversationKey: string, content: string) => void;
}

export function MultiChatGrid({ conversations, onSendMessage }: MultiChatGridProps) {
  if (conversations.length === 0) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="text-gray-400 mb-2">
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
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <p className="text-gray-600">Carregando conversas...</p>
        </div>
      </div>
    );
  }

  // Determine grid layout based on number of conversations
  const getGridClasses = (count: number) => {
    if (count === 1) return 'grid-cols-1';
    if (count === 2) return 'grid-cols-1 lg:grid-cols-2';
    if (count === 3) return 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3';
    if (count === 4) return 'grid-cols-1 lg:grid-cols-2';
    return 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3';
  };

  const gridClasses = getGridClasses(conversations.length);

  return (
    <div className="multi-chat-grid">
      {conversations.map((conversationState) => (
        <div key={conversationState.conversation.conversation_key} className="min-h-0">
          <ChatWindow
            conversation={conversationState.conversation}
            messages={conversationState.messages}
            onSendMessage={(content) =>
              onSendMessage(conversationState.conversation.conversation_key, content)
            }
            isLoading={conversationState.isLoading}
          />
          {conversationState.error && (
            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">
                ⚠️ {conversationState.error}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}