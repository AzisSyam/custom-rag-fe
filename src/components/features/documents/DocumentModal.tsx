import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../../common/Button';
import { ApiDocumentRepository } from '../../../infrastructure/repositories/ApiDocumentRepository';
import { UploadDocumentUseCase } from '../../../usecases/document/UploadDocumentUseCase';
import { UpdateDocumentUseCase } from '../../../usecases/document/UpdateDocumentUseCase';
import type { Document } from '../../../domain/models/Document';

interface DocumentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    documentToEdit?: Document | null;
}

export const DocumentModal: React.FC<DocumentModalProps> = ({ 
    isOpen, 
    onClose, 
    onSuccess,
    documentToEdit 
}) => {
    const [file, setFile] = useState<File | null>(null);
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);
    const [showGuidelines, setShowGuidelines] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const isEditMode = !!documentToEdit;

    useEffect(() => {
        if (isOpen) {
            if (documentToEdit) {
                setTitle(documentToEdit.title);
                setCategory(documentToEdit.category || '');
                setFile(null); // Can't edit file content directly in this flow usually, or we just update metadata
            } else {
                setTitle('');
                setCategory('');
                setFile(null);
            }
            setError(null);
            setProgress(0);
            setIsLoading(false);
        }
    }, [isOpen, documentToEdit]);

    if (!isOpen) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            
            // Auto-fill title if empty
            if (!title) {
                const fileName = selectedFile.name.split('.').slice(0, -1).join('.');
                setTitle(fileName);
            }
            setError(null);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const selectedFile = e.dataTransfer.files[0];
            setFile(selectedFile);
            if (!title) {
                const fileName = selectedFile.name.split('.').slice(0, -1).join('.');
                setTitle(fileName);
            }
            setError(null);
        }
    };

    const handleRemoveFile = (e: React.MouseEvent) => {
        e.stopPropagation();
        setFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!isEditMode && !file) {
            setError("Please select a file first");
            return;
        }

        if (!title.trim()) {
            setError("Title is required");
            return;
        }

        setIsLoading(true);
        setError(null);
        setProgress(10);

        const repository = new ApiDocumentRepository();
        
        try {
            if (isEditMode) {
                const updateUseCase = new UpdateDocumentUseCase(repository);
                
                // If a new file is provided, we use the upload use case instead 
                // (or handle file replacement in update - but backend might prefer upload for content)
                if (file) {
                    const uploadUseCase = new UploadDocumentUseCase(repository);
                    // Usually we might want an 'overwrite' or separate flow, 
                    // but for now let's use the requested upload logic if file is present.
                    const response = await uploadUseCase.execute({ file, title, category });
                    if (!response.success) throw new Error(response.message || "Upload failed");
                } else {
                    const response = await updateUseCase.execute(documentToEdit!.id, { 
                        title, 
                        category: category || undefined 
                    });
                    if (!response.success) throw new Error(response.message || "Update failed");
                }
            } else {
                const uploadUseCase = new UploadDocumentUseCase(repository);
                
                const progressInterval = setInterval(() => {
                    setProgress(prev => (prev < 90 ? prev + 10 : prev));
                }, 400);

                const response = await uploadUseCase.execute({ file: file!, title, category });
                
                clearInterval(progressInterval);
                setProgress(100);

                if (!response.success) {
                    throw new Error(response.message || "Upload failed");
                }
            }

            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.message || "An error occurred");
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div 
                className="bg-surface surface-container-lowest w-full max-w-lg rounded-[28px] shadow-2xl flex flex-col overflow-hidden relative animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="px-6 pt-6 pb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center elevation-1">
                            <span className="material-symbols-outlined text-on-primary-container text-2xl">
                                {isEditMode ? 'edit_note' : 'upload_file'}
                            </span>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-on-surface">
                                {isEditMode ? 'Edit Document' : 'Upload New Document'}
                            </h2>
                            <p className="text-xs text-on-surface-variant font-medium uppercase tracking-wider">
                                {isEditMode ? 'Modify Metadata' : 'Add to Knowledge Base'}
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="text-on-surface-variant hover:bg-surface-variant p-2 rounded-full transition-colors flex items-center justify-center"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Content Area */}
                <form onSubmit={handleSubmit} className="px-6 py-2 flex-grow overflow-y-auto flex flex-col gap-6 mb-4">
                    {/* Title Input */}
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="doc-title" className="text-sm font-semibold text-on-surface-variant ml-1">Document Title</label>
                        <div className="relative group">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant group-focus-within:text-primary transition-colors">title</span>
                            <input 
                                id="doc-title"
                                type="text" 
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter document title"
                                className="w-full bg-surface-container-low border border-outline-variant rounded-2xl py-3 pl-12 pr-4 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                required
                            />
                        </div>
                    </div>

                    {/* Category Input */}
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="doc-category" className="text-sm font-semibold text-on-surface-variant ml-1">Category</label>
                        <div className="relative group">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant group-focus-within:text-primary transition-colors">category</span>
                            <input 
                                id="doc-category"
                                type="text" 
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                placeholder="e.g. Legal, Technical, Financial"
                                className="w-full bg-surface-container-low border border-outline-variant rounded-2xl py-3 pl-12 pr-4 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                            />
                        </div>
                    </div>

                    {/* File Requirements Collapsible */}
                    <div className="border border-outline-variant rounded-2xl overflow-hidden bg-surface-container-low">
                        <button 
                            type="button"
                            onClick={() => setShowGuidelines(!showGuidelines)}
                            className="w-full px-5 py-3.5 flex items-center justify-between hover:bg-surface-container transition-colors group"
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${showGuidelines ? 'bg-primary text-on-primary' : 'bg-primary/10 text-primary group-hover:bg-primary/20'}`}>
                                    <span className="material-symbols-outlined text-xl">info</span>
                                </div>
                                <span className={`text-sm font-bold transition-colors ${showGuidelines ? 'text-on-surface' : 'text-on-surface-variant'}`}>
                                    Panduan & Persyaratan File
                                </span>
                            </div>
                            <span className={`material-symbols-outlined text-on-surface-variant transition-transform duration-300 ${showGuidelines ? 'rotate-180' : ''}`}>
                                expand_more
                            </span>
                        </button>

                        {showGuidelines && (
                            <div className="px-5 pb-6 pt-2 text-[11px] leading-relaxed text-on-surface-variant space-y-4 animate-in slide-in-from-top-2 duration-300">
                                <div className="h-px bg-outline-variant/30 mb-4" />
                                
                                {/* Group 1: Dasar */}
                                <section className="grid grid-cols-1 gap-3">
                                    <div className="space-y-1.5">
                                        <h4 className="font-black text-on-surface uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-primary text-[14px]">check_circle</span> 
                                            Persyaratan Dasar
                                        </h4>
                                        <ul className="grid grid-cols-2 gap-x-4 gap-y-1 ml-5 list-disc">
                                            <li>Format: <b>.pdf, .txt</b></li>
                                            <li>Ukuran: <b>Maks 10 MB</b></li>
                                            <li>Judul: <b>Maks 255 Karakter</b></li>
                                        </ul>
                                    </div>
                                </section>

                                {/* Group 2: Elemen Tak Terbaca */}
                                <section className="space-y-1.5">
                                    <h4 className="font-black text-error uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                                        <span className="material-symbols-outlined text-[14px]">block</span> 
                                        Elemen yang Tidak Terbaca
                                    </h4>
                                    <p className="ml-5">Foto, diagram, ilustrasi, PDF hasil scan (tanpa OCR), anotasi/catatan pinggir, dan formulir interaktif.</p>
                                </section>

                                {/* Group 3: Keterbatasan Layout */}
                                <section className="space-y-1.5">
                                    <h4 className="font-black text-amber-600 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                                        <span className="material-symbols-outlined text-[14px]">warning</span> 
                                        Keterbatasan Layout
                                    </h4>
                                    <p className="ml-5">
                                        Struktur tabel mungkin berantakan, urutan baca multi-kolom jurnal bisa tidak konsisten, rumus matematika kompleks seringkali gagal diekstrak, dan data header/footer akan digabung ke teks utama.
                                    </p>
                                </section>

                                {/* Group 4: Tips */}
                                <div className="bg-primary/10 p-3.5 rounded-xl border border-primary/20">
                                    <h4 className="font-black text-primary uppercase tracking-wider text-[10px] mb-1.5 flex items-center gap-1.5">
                                        <span className="material-symbols-outlined text-[14px]">lightbulb</span> 
                                        Tips Hasil Maksimal
                                    </h4>
                                    <ul className="space-y-1 text-on-surface font-medium">
                                        <li className="flex gap-2">
                                            <span className="text-primary">•</span>
                                            Gunakan PDF berbasis teks (copy-able).
                                        </li>
                                        <li className="flex gap-2">
                                            <span className="text-primary">•</span>
                                            Prioritaskan format <b>.txt</b> untuk akurasi 100%.
                                        </li>
                                        <li className="flex gap-2">
                                            <span className="text-primary">•</span>
                                            Pastikan urutan baca linear (atas ke bawah).
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Dropzone / File Selection */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-on-surface-variant ml-1">
                            {isEditMode ? 'Replace File (Optional)' : 'File Attachment'}
                        </label>
                        <div 
                            onDrop={handleDrop}
                            onDragOver={(e) => e.preventDefault()}
                            onClick={() => fileInputRef.current?.click()}
                            className={`
                                border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center transition-all cursor-pointer group text-center
                                ${file 
                                    ? 'border-primary bg-primary/5' 
                                    : 'border-outline-variant bg-surface-container-low hover:bg-surface-container hover:border-outline'
                                }
                            `}
                        >
                            <input 
                                type="file" 
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                accept=".pdf,.txt"
                            />
                            
                            {file ? (
                                <div className="flex flex-col items-center animate-in zoom-in-95">
                                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-3">
                                        <span className="material-symbols-outlined text-3xl text-primary">description</span>
                                    </div>
                                    <p className="text-sm font-bold text-on-surface truncate max-w-[280px]">{file.name}</p>
                                    <p className="text-xs text-on-surface-variant mt-0.5">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                                    <button 
                                        onClick={handleRemoveFile}
                                        className="mt-3 text-xs font-bold text-error hover:bg-error/10 px-3 py-1 rounded-full transition-colors"
                                    >
                                        Remove File
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="w-14 h-14 bg-secondary-container rounded-2xl flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                                        <span className="material-symbols-outlined text-3xl text-on-secondary-container">cloud_upload</span>
                                    </div>
                                    <p className="text-sm font-bold text-on-surface mb-1">
                                        Click or drag file to {isEditMode ? 'replace' : 'upload'}
                                    </p>
                                    <p className="text-xs text-on-surface-variant font-medium uppercase tracking-tighter">Supports PDF, TXT (Max 10MB)</p>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Error & Progress */}
                    {error && (
                        <div className="p-4 bg-error-container text-on-error-container rounded-2xl text-sm flex items-center gap-3 animate-in shake-1">
                            <span className="material-symbols-outlined text-xl">error</span>
                            <span className="font-medium">{error}</span>
                        </div>
                    )}

                    {isLoading && (
                        <div className="flex flex-col gap-2 mt-2 animate-in fade-in">
                            <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                                <span>{progress === 100 ? 'Processing...' : 'Uploading...'}</span>
                                <span className="text-primary">{progress}%</span>
                            </div>
                            <div className="w-full bg-surface-container-high rounded-full h-2 overflow-hidden shadow-inner">
                                <div 
                                    className="bg-primary h-2 rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(var(--primary-rgb),0.5)]" 
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                        </div>
                    )}
                </form>

                {/* Footer */}
                <div className="px-6 py-5 flex justify-end gap-3 border-t border-outline-variant bg-surface-container-lowest">
                    <Button 
                        variant="text" 
                        onClick={onClose}
                        disabled={isLoading}
                        className="px-6"
                    >
                        Cancel
                    </Button>
                    <Button 
                        variant="primary"
                        onClick={handleSubmit}
                        disabled={isLoading || (!isEditMode && !file) || !title.trim()}
                        className="flex items-center gap-2 px-8 elevation-2 hover:elevation-4 active:elevation-0"
                    >
                        {isLoading ? (
                            <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
                        ) : (
                            <span className="material-symbols-outlined text-sm">{isEditMode ? 'save' : 'upload'}</span>
                        )}
                        {isEditMode ? 'Save Changes' : 'Start Processing'}
                    </Button>
                </div>
            </div>
        </div>
    );
};
