import React, { useState, useRef } from 'react';
import { Button } from '../../common/Button';
import { ApiDocumentRepository } from '../../../infrastructure/repositories/ApiDocumentRepository';
import { UploadDocumentUseCase } from '../../../usecases/document/UploadDocumentUseCase';

export const UploadDocumentForm: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setError(null);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
            setError(null);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleRemoveFile = () => {
        setFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) {
            setError("Please select a file first");
            return;
        }

        setIsLoading(true);
        setError(null);
        setProgress(10); // Start progress

        const repository = new ApiDocumentRepository();
        const uploadUseCase = new UploadDocumentUseCase(repository);

        try {
            // Simulate progress since axios standard upload doesn't give fine-grained progress without config
            const progressInterval = setInterval(() => {
                setProgress(prev => (prev < 90 ? prev + 10 : prev));
            }, 500);

            const response = await uploadUseCase.execute({ 
                file, 
                title: file.name, 
                category: "General" 
            });
            
            clearInterval(progressInterval);
            setProgress(100);

            if (response.success) {
                setTimeout(() => {
                    window.location.href = '/documents';
                }, 1000);
            } else {
                setError(response.message || "Upload failed");
                setIsLoading(false);
            }
        } catch (err: any) {
            setError(err.message || "An error occurred during upload");
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-surface surface-container-lowest w-full max-w-lg rounded-[28px] shadow-lg flex flex-col overflow-hidden relative">
            {/* Header */}
            <div className="px-6 pt-6 pb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center">
                         <span className="material-symbols-outlined text-on-primary-container text-xl">description</span>
                    </div>
                    <h2 className="text-xl font-medium text-on-surface">Upload Document</h2>
                </div>
                <button 
                    onClick={() => window.history.back()}
                    className="text-on-surface-variant hover:bg-surface-variant p-2 rounded-full transition-colors flex items-center justify-center"
                >
                    <span className="material-symbols-outlined">close</span>
                </button>
            </div>

            {/* Content Area */}
            <div className="px-6 py-2 flex-grow overflow-y-auto flex flex-col gap-6">
                {/* Dropzone */}
                <div 
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-outline-variant rounded-xl p-8 flex flex-col items-center justify-center bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer group text-center"
                >
                    <input 
                        type="file" 
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept=".pdf,.txt"
                    />
                    <div className="w-16 h-16 bg-secondary-container rounded-full flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                        <span className="material-symbols-outlined text-3xl text-on-secondary-container">cloud_upload</span>
                    </div>
                    <p className="text-base font-medium text-on-surface mb-1">
                        {file ? file.name : "Click to upload or drag and drop"}
                    </p>
                    <p className="text-sm text-on-surface-variant">Supports PDF, TXT (Max 10MB)</p>
                </div>

                {/* Selected File Preview Chip */}
                {file && (
                    <div className="flex items-center justify-between p-3 border border-outline-variant rounded-lg bg-surface animate-in fade-in slide-in-from-top-2">
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary">description</span>
                            <div className="flex flex-col overflow-hidden">
                                <span className="text-sm font-medium text-on-surface truncate max-w-[200px]">{file.name}</span>
                                <span className="text-xs text-on-surface-variant">{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
                            </div>
                        </div>
                        <button 
                            onClick={handleRemoveFile}
                            className="text-on-surface-variant hover:text-error transition-colors flex items-center justify-center p-1 rounded-full hover:bg-error-container"
                        >
                            <span className="material-symbols-outlined text-sm">delete</span>
                        </button>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="px-4 py-3 bg-error-container text-on-error-container rounded-lg text-sm flex items-center gap-2 animate-in fade-in">
                        <span className="material-symbols-outlined text-base">error</span>
                        {error}
                    </div>
                )}

                {/* Progress Section */}
                {isLoading && (
                    <div className="flex flex-col gap-2 mt-2">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-on-surface-variant">
                                {progress === 100 ? "Processing..." : "Uploading..."}
                            </span>
                            <span className="text-primary font-medium">{progress}%</span>
                        </div>
                        <div className="w-full bg-surface-variant rounded-full h-1.5 overflow-hidden">
                            <div 
                                className="bg-primary h-1.5 rounded-full transition-all duration-300" 
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer / Actions */}
            <div className="px-6 py-4 flex justify-end gap-3 border-t border-surface-variant">
                <Button 
                    variant="text" 
                    onClick={() => window.history.back()}
                    disabled={isLoading}
                >
                    Cancel
                </Button>
                <Button 
                    variant="primary"
                    onClick={handleSubmit}
                    disabled={isLoading || !file}
                    className="flex items-center gap-2"
                >
                    <span className="material-symbols-outlined text-sm">upload</span>
                    Upload & Process
                </Button>
            </div>
        </div>
    );
};
