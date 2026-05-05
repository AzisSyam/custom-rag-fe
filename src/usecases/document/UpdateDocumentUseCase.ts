import type { DocumentRepository, UploadDocumentPayload } from "../../domain/repositories/DocumentRepository";

export class UpdateDocumentUseCase {
  constructor(private documentRepository: DocumentRepository) {}

  async execute(id: string, payload: Partial<UploadDocumentPayload>): Promise<any> {
    if (!id) {
      throw new Error("Document ID is required for update");
    }

    if (payload.title !== undefined && payload.title.trim() === "") {
      throw new Error("Title cannot be empty");
    }

    return await this.documentRepository.updateDocument(id, payload);
  }
}
