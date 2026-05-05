import type { DocumentRepository } from "../../domain/repositories/DocumentRepository";

export class GetDocumentsUseCase {
  constructor(private documentRepository: DocumentRepository) {}

  async execute() {
    return await this.documentRepository.getDocuments();
  }
}
