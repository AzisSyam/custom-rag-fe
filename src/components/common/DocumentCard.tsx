import React from 'react';

interface DocumentCardProps {
    title: string;
    date: string;
    type: string;
    size: string;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({ title, date, type, size }) => {
    return (
        <div className="bg-surface-container-low border border-outline-variant p-4 rounded-2xl hover:bg-surface-container transition-colors cursor-pointer group elevation-1">
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary-container flex items-center justify-center text-on-primary-container">
                        <span className="material-symbols-outlined text-2xl">description</span>
                    </div>
                    <div>
                        <h3 className="text-base font-semibold text-on-surface group-hover:text-primary transition-colors">{title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-on-surface-variant font-medium">{type?.toUpperCase() ?? '—'}</span>
                            <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
                            <span className="text-xs text-on-surface-variant">{date}</span>
                            <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
                            <span className="text-xs text-on-surface-variant">{size}</span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-1">
                    <button className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-highest transition-colors">
                        <span className="material-symbols-outlined text-xl">visibility</span>
                    </button>
                    <button className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-highest transition-colors">
                        <span className="material-symbols-outlined text-xl">edit</span>
                    </button>
                    <button className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-highest transition-colors">
                        <span className="material-symbols-outlined text-xl">download</span>
                    </button>
                    <button className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-error-container hover:text-on-error-container transition-colors">
                        <span className="material-symbols-outlined text-xl">delete</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
