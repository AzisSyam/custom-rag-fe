import React, { useEffect } from 'react';
import type { DocumentViewerFileType } from '../../../domain/models/DocumentViewer';

interface DocumentViewerModalProps {
  isOpen: boolean;
  isLoading: boolean;
  error: string | null;
  fileType: DocumentViewerFileType;
  blobUrl: string | null;
  textContent: string | null;
  documentTitle: string;
  onClose: () => void;
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  isOpen,
  isLoading,
  error,
  fileType,
  blobUrl,
  textContent,
  documentTitle,
  onClose,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-scrim/40 backdrop-blur-sm" 
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-5xl h-[85vh] bg-surface-container-high rounded-[32px] elevation-5 flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-outline-variant bg-surface-container-highest">
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-secondary-container flex items-center justify-center text-on-secondary-container">
              <span className="material-symbols-outlined">
                {fileType === 'pdf' ? 'picture_as_pdf' : fileType === 'txt' ? 'description' : 'draft'}
              </span>
            </div>
            <h2 className="text-xl font-bold text-on-surface truncate">{documentTitle}</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-surface-variant text-on-surface-variant transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto bg-surface-container-low p-2">
          {isLoading && (
            <div className="w-full h-full flex flex-col items-center justify-center text-on-surface-variant">
              <div className="relative w-12 h-12 mb-4">
                <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-t-primary rounded-full animate-spin"></div>
              </div>
              <p className="font-bold text-sm tracking-widest uppercase">Fetching Document...</p>
            </div>
          )}

          {error && (
            <div className="w-full h-full flex flex-col items-center justify-center text-center p-8">
              <div className="w-20 h-20 rounded-full bg-error-container text-on-error-container flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-4xl">error</span>
              </div>
              <h3 className="text-xl font-bold text-on-surface mb-2">Failed to load document</h3>
              <p className="text-on-surface-variant max-w-md mb-8">{error}</p>
              <button 
                onClick={onClose}
                className="bg-primary text-on-primary px-8 py-3 rounded-2xl font-bold transition-all hover:elevation-2"
              >
                Go Back
              </button>
            </div>
          )}

          {!isLoading && !error && (
            <div className="w-full h-full rounded-2xl overflow-hidden bg-white">
              {fileType === 'pdf' && blobUrl && (
                <iframe 
                  src={blobUrl} 
                  className="w-full h-full border-none"
                  title={documentTitle}
                />
              )}

              {fileType === 'txt' && textContent && (
                <div className="p-8 font-mono text-sm text-slate-800 whitespace-pre-wrap leading-relaxed select-text">
                  {textContent}
                </div>
              )}

              {fileType === 'unknown' && (
                <div className="w-full h-full flex flex-col items-center justify-center text-on-surface-variant">
                  <span className="material-symbols-outlined text-6xl mb-4">unfold_less</span>
                  <p className="font-bold">Preview not available for this file type</p>
                  <p className="text-sm">You can still download the file to view it.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer / Actions */}
        <div className="px-8 py-4 bg-surface-container-highest border-t border-outline-variant flex justify-end">
            <button 
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl font-bold text-primary hover:bg-primary/5 transition-colors"
            >
              Close Preview
            </button>
        </div>
      </div>
    </div>
  );
};
