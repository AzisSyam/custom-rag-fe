import React from 'react';

interface DocumentCardProps {
    id: string;
    title: string;
    date: string;
    type: string;
    size: string;
    category?: string | null;
    onDelete?: (id: string) => void;
    onEdit?: (id: string) => void;
    onView?: (id: string) => void;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({
    id,
    title,
    date,
    type,
    size,
    category,
    onDelete,
    onEdit,
    onView,
}) => {
    const getIcon = (fileType: string | undefined | null) => {
        if (!fileType) return 'draft';

        switch (fileType.toLowerCase()) {
            case 'pdf':
                return 'picture_as_pdf';
            case 'txt':
                return 'description';
            default:
                return 'draft';
        }
    };

    return (
        <div className="bg-surface-container-low border border-outline-variant rounded-2xl p-4 flex items-center gap-4 hover:bg-surface-container transition-all group elevation-1 hover:elevation-2">
            <div className="w-12 h-12 rounded-xl bg-secondary-container flex items-center justify-center text-on-secondary-container">
                <span className="material-symbols-outlined text-2xl">{getIcon(type)}</span>
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="text-base font-semibold text-on-surface truncate">{title}</h3>
                    {category && (
                        <span className="px-2 py-0.5 rounded-full bg-tertiary-container text-on-tertiary-container text-[10px] font-bold uppercase tracking-wider">
                            {category}
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-3 text-xs text-on-surface-variant font-medium">
                    <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                        {date}
                    </span>
                    {/* <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
                    <span className="flex items-center gap-1 uppercase">
                        {type}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
                    <span>{size}</span> */}
                </div>
            </div>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={() => onView?.(id)}
                    className="p-2 rounded-full text-on-surface-variant hover:bg-secondary-container hover:text-on-secondary-container transition-colors"
                    title="View"
                >
                    <span className="material-symbols-outlined text-xl">visibility</span>
                </button>
                <button
                    onClick={() => onEdit?.(id)}
                    className="p-2 rounded-full text-on-surface-variant hover:bg-primary-container hover:text-on-primary-container transition-colors"
                    title="Edit"
                >
                    <span className="material-symbols-outlined text-xl">edit</span>
                </button>
                <button
                    onClick={() => onDelete?.(id)}
                    className="p-2 rounded-full text-on-surface-variant hover:bg-error-container hover:text-on-error transition-colors"
                    title="Delete"
                >
                    <span className="material-symbols-outlined text-xl">delete</span>
                </button>
            </div>
        </div>
    );
};
