import React, { useState, useRef, useEffect } from 'react';
import { Button } from './common/Button';
import { Card } from './common/Card';
import { TextField } from './common/TextField';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isTyping?: boolean;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I am DocuMind AI. How can I help you analyze your documents today?'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Simulate AI response
    const aiTempId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { id: aiTempId, role: 'assistant', content: '', isTyping: true }]);

    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === aiTempId 
          ? { ...msg, content: `I've analyzed your request: "${userMessage.content}". Based on the indexed documents, I can provide detailed insights using the RAG pipeline.`, isTyping: false }
          : msg
      ));
    }, 1500);
  };

  return (
    <div className="flex flex-col h-screen bg-background text-on-background font-roboto">
      {/* Top App Bar */}
      <header className="flex items-center justify-between px-6 py-4 bg-surface elevation-1 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-white text-xs font-bold">DM</span>
          </div>
          <div>
            <h1 className="text-lg font-medium text-on-surface leading-tight">DocuMind AI</h1>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
              <span className="text-xs text-on-surface-variant">RAG Engine Online</span>
            </div>
          </div>
        </div>
        <Button variant="outline" size="sm">New Chat</Button>
      </header>

      {/* Main Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <Card 
                variant={msg.role === 'user' ? 'filled' : 'outlined'}
                className={`max-w-[85%] px-4 py-3 ${
                  msg.role === 'user' 
                    ? 'bg-primary-container text-on-primary-container rounded-tr-none' 
                    : 'bg-surface-container-low text-on-surface rounded-tl-none'
                }`}
              >
                {msg.isTyping ? (
                  <div className="flex gap-1 py-1 px-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></div>
                  </div>
                ) : (
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                )}
              </Card>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Area */}
      <footer className="p-4 bg-surface-container-low border-t border-outline-variant">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto flex gap-3 items-end">
          <div className="flex-1">
            <TextField
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about your documents..."
              autoComplete="off"
              className="!gap-0"
            />
          </div>
          <Button 
            type="submit" 
            disabled={!inputValue.trim()}
            className="mb-0.5"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </Button>
        </form>
        <p className="text-[10px] text-center text-on-surface-variant mt-3 uppercase tracking-widest opacity-60">
          Powered by Custom RAG Pipeline
        </p>
      </footer>
    </div>
  );
}
