
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

interface FileUploadProps {
  accept?: string;
  onFileUpload: (file: File) => void;
  className?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({ 
  accept = '*', 
  onFileUpload, 
  className = '' 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
    // Reset the input value so the same file can be selected again
    if (event.target) {
      event.target.value = '';
    }
  };

  return (
    <div className={className}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={accept}
        style={{ display: 'none' }}
      />
      <Button
        type="button"
        variant="outline"
        onClick={handleClick}
        className="w-full"
      >
        <Upload className="w-4 h-4 mr-2" />
        Choose File
      </Button>
    </div>
  );
};
