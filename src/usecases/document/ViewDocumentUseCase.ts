import type { DocumentRepository } from "../../domain/repositories/DocumentRepository";
import type { DocumentViewerFileType } from "../../domain/models/DocumentViewer";

export interface ViewDocumentResult {
  fileType: DocumentViewerFileType;
  blobUrl: string;
  textContent: string | null;
}

export class ViewDocumentUseCase {
  constructor(private documentRepository: DocumentRepository) {}

  async execute(id: string): Promise<ViewDocumentResult> {
    const blob = await this.documentRepository.viewDocument(id);
    
    let fileType: DocumentViewerFileType = 'unknown';
    if (blob.type === 'application/pdf') {
      fileType = 'pdf';
    } else if (blob.type === 'text/plain') {
      fileType = 'txt';
    }

    const blobUrl = URL.createObjectURL(blob);
    let textContent: string | null = null;

    if (fileType === 'txt') {
      textContent = await blob.text();
    }

    return {
      fileType,
      blobUrl,
      textContent
    };
  }
}
