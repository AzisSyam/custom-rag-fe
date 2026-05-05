// Domain Model for Chat
// Matches the response from POST /api/chat

export interface ChatRequest {
  question: string;
}

export interface ChatAnswer {
  answer: string;
}

export interface ChatResponse {
  success: boolean;
  message: string;
  data: ChatAnswer | null;
}
