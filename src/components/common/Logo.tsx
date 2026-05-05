import React from 'react';

export const Logo: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizes = {
    sm: "w-8 h-8 p-1.5",
    md: "w-12 h-12 p-2",
    lg: "w-20 h-20 p-3"
  };

  return (
    <div className={`${sizes[size]} flex items-center justify-center`}>
      <img 
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuC_D-d0It9dxs0hFPk0fMi4Y_OziIHVXua_lFSZBr4pJxVB7NmSH1XFrEyuYuQa9kipGeEHvkec1xXUZlKVWn7RLZajcgWxvQ0FMzus-GVApH8yJI-YmNan9brOXaasi5NruloOCNBA3wg-e-uv4DH2NMBsAwUMUSs1aZvl03bXvG8nmXdoI_JKxEAU5ECPsky_eGGt_z1a5DuVncwngsgCO_QF-YPY67BcftPRCb5GFkVT8YkeWz9guR7v_TQVY1nJ5TBIlJQKYoqD" 
        alt="DocuMind AI Logo" 
        className="w-full h-full object-contain"
      />
    </div>
  );
};
