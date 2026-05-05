export type DocumentViewerFileType = 'pdf' | 'txt' | 'unknown';

export interface DocumentViewerState {
  isOpen: boolean;
  isLoading: boolean;
  error: string | null;
  fileType: DocumentViewerFileType;
  blobUrl: string | null;
  textContent: string | null;
  documentTitle: string;
}
