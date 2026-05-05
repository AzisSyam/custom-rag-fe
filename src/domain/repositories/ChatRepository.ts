import type { ChatRequest, ChatResponse } from "../models/Chat";

export interface ChatRepository {
  /**
   * Sends a question to the RAG engine and returns the response.
   */
  askQuestion(request: ChatRequest): Promise<ChatResponse>;
}
