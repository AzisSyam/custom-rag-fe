import axios from "axios";
import type { ChatRepository } from "../../domain/repositories/ChatRepository";
import type { ChatRequest, ChatResponse } from "../../domain/models/Chat";
import Cookies from "js-cookie";

const BASE_URL = import.meta.env.PUBLIC_BASE_URL;

export class ApiChatRepository implements ChatRepository {
  async askQuestion(request: ChatRequest): Promise<ChatResponse> {
    const token = Cookies.get("auth_token");

    const response = await axios.post<ChatResponse>(
      `${BASE_URL}/api/chat`,
      { question: request.question },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  }
}
