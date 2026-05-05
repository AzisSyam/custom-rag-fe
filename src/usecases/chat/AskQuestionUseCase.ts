import type { ChatRepository } from "../../domain/repositories/ChatRepository";

export class AskQuestionUseCase {
  constructor(private readonly chatRepository: ChatRepository) {}

  /**
   * Executes the chat interaction.
   * @param question The user's question.
   * @returns The AI's answer string.
   * @throws Error if the API request fails or returns an error.
   */
  async execute(question: string): Promise<string> {
    const response = await this.chatRepository.askQuestion({ question });

    if (!response.success || !response.data) {
      throw new Error(response.message || "Failed to get answer from AI.");
    }

    return response.data.answer;
  }
}
