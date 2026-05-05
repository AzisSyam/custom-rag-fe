// Domain Model for Document
// Matches the response shape from GET /api/documents
export interface Document {
  id: string;
  title: string;
  category: string | null;
  file_path: string;
  file_size: number; // in bytes
  file_type: string; // e.g. "pdf", "txt"
  created_at: string; // ISO 8601 date string
  updated_at: string;
}

// API list response wrapper
export interface DocumentListResponse {
  success: boolean;
  message: string;
  data: {
    documents: Document[];
  };
}

// API upload response wrapper
export interface UploadDocumentResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    name: string;
    type: string;
    size: number;
    url: string;
  };
}
