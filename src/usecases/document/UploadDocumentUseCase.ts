import type { DocumentRepository, UploadDocumentPayload } from "../../domain/repositories/DocumentRepository";

export class UploadDocumentUseCase {
  constructor(private documentRepository: DocumentRepository) {}

  async execute(payload: UploadDocumentPayload): Promise<any> {
    const { file, title, category } = payload;

    if (!file) {
      throw new Error("No file provided");
    }

    if (!title || title.trim() === "") {
      throw new Error("Title is required");
    }

    // Validate file type
    const allowedTypes = ["application/pdf", "text/plain"];
    if (!allowedTypes.includes(file.type)) {
      throw new Error("Only PDF and TXT files are allowed");
    }

    // Max size 10MB
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new Error("File size exceeds 10MB limit");
    }

    return await this.documentRepository.uploadDocument({ file, title, category });
  }
}
