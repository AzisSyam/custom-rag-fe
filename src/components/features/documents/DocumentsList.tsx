import React, { useEffect, useState } from 'react';
import { DocumentCard } from './DocumentCard';
import { DocumentModal } from './DocumentModal';
import { DocumentViewerModal } from './DocumentViewerModal';
import { ApiDocumentRepository } from '../../../infrastructure/repositories/ApiDocumentRepository';
import { GetDocumentsUseCase } from '../../../usecases/document/GetDocumentsUseCase';
import { ViewDocumentUseCase } from '../../../usecases/document/ViewDocumentUseCase';
import type { Document } from '../../../domain/models/Document';
import type { DocumentViewerState } from '../../../domain/models/DocumentViewer';
import { Button } from '../../common/Button';

// Format file size from bytes to human-readable
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

// Format ISO date string to readable date
function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export const DocumentsList: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [documentToEdit, setDocumentToEdit] = useState<Document | null>(null);

  // Viewer states
  const [viewerState, setViewerState] = useState<DocumentViewerState>({
    isOpen: false,
    isLoading: false,
    error: null,
    fileType: 'unknown',
    blobUrl: null,
    textContent: null,
    documentTitle: '',
  });

  const fetchDocuments = async () => {
    setIsLoading(true);
    const repository = new ApiDocumentRepository();
    const useCase = new GetDocumentsUseCase(repository);

    try {
      const data = await useCase.execute();
      console.log("[DocumentsList] Fetched documents:", data);
      
      if (Array.isArray(data)) {
        setDocuments(data);
      } else {
        console.warn("[DocumentsList] API returned non-array data:", data);
        setDocuments([]);
      }
      setError(null);
    } catch (err: any) {
      console.error("[DocumentsList] Error fetching documents:", err);
      setError(err.message || 'Failed to load documents');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleUploadNew = () => {
    setDocumentToEdit(null);
    setIsModalOpen(true);
  };

  const handleEdit = (id: string) => {
    const doc = documents.find(d => d.id === id);
    if (doc) {
      setDocumentToEdit(doc);
      setIsModalOpen(true);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
      return;
    }

    const repository = new ApiDocumentRepository();
    try {
      await repository.deleteDocument(id);
      setDocuments(prev => prev.filter(doc => doc.id !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to delete document');
    }
  };

  const handleView = async (id: string) => {
    const doc = documents.find(d => d.id === id);
    if (!doc) return;

    setViewerState(prev => ({
      ...prev,
      isOpen: true,
      isLoading: true,
      error: null,
      documentTitle: doc.title,
      blobUrl: null,
      textContent: null
    }));

    const repository = new ApiDocumentRepository();
    const useCase = new ViewDocumentUseCase(repository);

    try {
      const result = await useCase.execute(id);
      setViewerState(prev => ({
        ...prev,
        isLoading: false,
        fileType: result.fileType,
        blobUrl: result.blobUrl,
        textContent: result.textContent
      }));
    } catch (err: any) {
      console.error("[DocumentsList] View Error:", err);
      setViewerState(prev => ({
        ...prev,
        isLoading: false,
        error: err.message || 'Failed to load document content'
      }));
    }
  };

  const handleCloseViewer = () => {
    if (viewerState.blobUrl) {
      URL.revokeObjectURL(viewerState.blobUrl);
    }
    setViewerState(prev => ({
      ...prev,
      isOpen: false,
      blobUrl: null,
      textContent: null
    }));
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-black text-on-surface tracking-tight">Documents</h1>
          <p className="text-on-surface-variant mt-1.5 font-medium">
            Manage your knowledge base for context-aware AI analysis.
          </p>
        </div>
        <button 
          onClick={handleUploadNew}
          className="flex items-center gap-2 bg-primary text-on-primary px-7 py-3.5 rounded-2xl font-bold elevation-2 hover:elevation-4 active:elevation-0 hover:bg-primary-container hover:text-on-primary-container transition-all"
        >
          <span className="material-symbols-outlined">add_circle</span>
          Upload New
        </button>
      </div>

      {/* Loading state */}
      {isLoading && (!Array.isArray(documents) || documents.length === 0) && (
        <div className="flex flex-col items-center justify-center py-24 text-on-surface-variant">
          <div className="relative w-16 h-16 mb-4">
             <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
             <div className="absolute inset-0 border-4 border-t-primary rounded-full animate-spin"></div>
          </div>
          <p className="font-bold uppercase tracking-widest text-xs">Syncing Knowledge Base...</p>
        </div>
      )}

      {/* Error state */}
      {!isLoading && error && (
        <div className="flex items-center gap-4 p-6 rounded-[28px] bg-error-container text-on-error-container elevation-1 animate-in shake-1">
          <div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">error</span>
          </div>
          <div>
            <p className="font-bold">Connection Error</p>
            <p className="text-sm opacity-90">{error}</p>
          </div>
          <button 
            onClick={fetchDocuments}
            className="ml-auto px-4 py-2 bg-error text-on-error rounded-xl text-xs font-bold hover:bg-error/90 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !error && (!Array.isArray(documents) || documents.length === 0) && (
        <div className="flex flex-col items-center justify-center py-32 bg-surface-container-lowest rounded-[40px] border-2 border-dashed border-outline-variant text-on-surface-variant animate-in fade-in zoom-in-95">
          <div className="w-24 h-24 bg-surface-container rounded-full flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-6xl text-outline">folder_open</span>
          </div>
          <h2 className="text-2xl font-bold text-on-surface mb-2">No documents found</h2>
          <p className="text-on-surface-variant max-w-xs text-center mb-8 font-medium">
            Your knowledge base is currently empty. Start by uploading PDF or TXT files.
          </p>
          <Button variant="primary" onClick={handleUploadNew} className="px-8 py-4 rounded-2xl elevation-2">
            <span className="material-symbols-outlined mr-2">upload</span>
            Upload First Document
          </Button>
        </div>
      )}

      {/* Document grid */}
      {!isLoading && !error && Array.isArray(documents) && documents.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
          {documents.map((doc) => (
            <DocumentCard
              key={doc.id}
              id={doc.id}
              title={doc.title}
              category={doc.category}
              date={formatDate(doc.created_at)}
              type={doc.file_type}
              size={formatFileSize(doc.file_size)}
              onDelete={handleDelete}
              onEdit={handleEdit}
              onView={handleView}
            />
          ))}
        </div>
      )}

      {/* Upload/Edit Modal */}
      <DocumentModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchDocuments}
        documentToEdit={documentToEdit}
      />

      {/* Document Viewer Modal */}
      <DocumentViewerModal 
        {...viewerState}
        onClose={handleCloseViewer}
      />
    </div>
  );
};
