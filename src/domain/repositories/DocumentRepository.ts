import type { Document } from "../models/Document";

export interface UploadDocumentPayload {
  file: File;
  title: string;
  category?: string;
}

export interface DocumentRepository {
  getDocuments(): Promise<Document[]>;
  uploadDocument(payload: UploadDocumentPayload): Promise<any>;
  updateDocument(id: string, payload: Partial<UploadDocumentPayload>): Promise<any>;
  deleteDocument(id: string): Promise<any>;
  viewDocument(id: string): Promise<Blob>;
}
