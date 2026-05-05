import React, { useState } from 'react';
import { AskQuestionUseCase } from '../../../usecases/chat/AskQuestionUseCase';
import { ApiChatRepository } from '../../../infrastructure/repositories/ApiChatRepository';

// Initialize infrastructure and use case
const chatRepository = new ApiChatRepository();
const askQuestionUseCase = new AskQuestionUseCase(chatRepository);

export const SingleQAChat: React.FC = () => {
  const [question, setQuestion] = useState('What were the key takeaways from the Q4 financial report regarding operational costs?');
  const [answer, setAnswer] = useState('Based on the Q4 Financial Report, operational costs increased by 4.2% overall. This was primarily driven by two factors: 1. A 7% increase in cloud infrastructure spending. 2. Initial onboarding costs for the new European logistics hub.');
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const newQuestion = inputValue;
    setInputValue('');
    setIsLoading(true);
    setQuestion(newQuestion);
    setAnswer(''); // Clear answer while fetching
    setError(null); // Reset error

    try {
      const aiAnswer = await askQuestionUseCase.execute(newQuestion);
      setAnswer(aiAnswer);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="px-8 py-6 bg-background">
        <h1 className="text-2xl font-bold text-on-surface">Chat with AI</h1>
        <p className="text-sm text-on-surface-variant">Ask questions about your documents</p>
      </div>

      {/* Chat Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Question Section */}
          {(question || isLoading) && (
            <div className="flex justify-end">
              <div className="bg-primary-container text-on-primary-container p-6 rounded-3xl rounded-tr-none max-w-[85%] elevation-1 border border-primary/10">
                <p className="text-base font-medium leading-relaxed">{question || 'Typing...'}</p>
              </div>
            </div>
          )}

          {/* Answer Section */}
          <div className="flex justify-start">
            <div className="bg-surface-container-low text-on-surface p-6 rounded-3xl rounded-tl-none max-w-[85%] elevation-1 border border-outline-variant">
              {isLoading ? (
                <div className="flex gap-2 py-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                </div>
              ) : error ? (
                <div className="flex items-center gap-3 text-error">
                  <span className="material-symbols-outlined text-xl">error</span>
                  <p className="text-base font-medium">{error}</p>
                </div>
              ) : (
                <p className="text-base leading-relaxed">{answer || 'Waiting for response...'}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Input Section */}
      <div className="p-8 bg-background ">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          <div className="relative group">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask a new question..."
              className="w-full bg-surface-container-low border border-outline px-6 py-4 pr-16 rounded-full focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface transition-all elevation-1 placeholder:text-on-surface-variant/50"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className={`
                absolute right-2 top-2 bottom-2 w-12 h-12 rounded-full flex items-center justify-center transition-all
                ${inputValue.trim() && !isLoading 
                  ? 'bg-primary text-on-primary elevation-2 scale-100 hover:scale-105 active:scale-95' 
                  : 'bg-surface-container-highest text-on-surface-variant scale-90 opacity-50 cursor-not-allowed'
                }
              `}
            >
              {isLoading ? (
                <span className="material-symbols-outlined animate-spin">sync</span>
              ) : (
                <span className="material-symbols-outlined">send</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

