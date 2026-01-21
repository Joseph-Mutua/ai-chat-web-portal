'use client'

import { useChatSuggestions } from '@/hooks/api/use-chat'
import { Button } from '@/components/ui/button'
import { Loading } from '@/components/ui/loading'

interface ChatEntryProps {
  onSuggestionClick: (suggestion: string) => void
}

export function ChatEntry({ onSuggestionClick }: ChatEntryProps) {
  const { data: suggestions, isLoading } = useChatSuggestions()

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Logo/Icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
          </div>
        </div>

        {/* Welcome text */}
        <div>
          <h2 className="text-2xl font-semibold text-text mb-2">
            How can I help you today?
          </h2>
          <p className="text-text-secondary">
            Start a conversation or choose a suggestion below
          </p>
        </div>

        {/* Suggestions */}
        {isLoading ? (
          <Loading />
        ) : suggestions?.suggestions && suggestions.suggestions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {suggestions.suggestions.slice(0, 4).map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => onSuggestionClick(suggestion)}
                className="p-4 text-left bg-white border border-border-light rounded-lg hover:bg-background hover:border-primary transition-colors"
              >
                <p className="text-sm text-text">{suggestion}</p>
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )
}
