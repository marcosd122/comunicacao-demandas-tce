
import { useState, ChangeEvent, useRef } from 'react';
import { X, Upload, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileUploadProps {
  onFilesChange: (files: File[]) => void;
  existingFiles?: { name: string; size: number }[];
  onRemoveExisting?: (index: number) => void;
}

const FileUpload = ({ onFilesChange, existingFiles = [], onRemoveExisting }: FileUploadProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => {
        const updatedFiles = [...prev, ...newFiles];
        onFilesChange(updatedFiles);
        return updatedFiles;
      });
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      setFiles((prev) => {
        const updatedFiles = [...prev, ...droppedFiles];
        onFilesChange(updatedFiles);
        return updatedFiles;
      });
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const removeFile = (index: number) => {
    setFiles((prev) => {
      const updatedFiles = prev.filter((_, i) => i !== index);
      onFilesChange(updatedFiles);
      return updatedFiles;
    });
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <div className="space-y-4">
      <div 
        className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={handleButtonClick}
      >
        <div className="flex flex-col items-center">
          <Upload className="h-10 w-10 text-gray-400 mb-2" />
          <div className="text-gray-500 mb-2">Arraste e solte alguns arquivos aqui ou clique para selecionar</div>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
            ref={fileInputRef}
          />
          <Button 
            variant="outline" 
            type="button" 
            className="mt-2"
            onClick={(e) => {
              e.stopPropagation();
              handleButtonClick();
            }}
          >
            Selecionar Arquivos
          </Button>
          <div className="text-xs text-gray-500 mt-2">
            Tipos de arquivos permitidos: imagem, áudio, zip, pdf, doc, xls, txt e zip
          </div>
        </div>
      </div>

      {/* Lista de arquivos existentes */}
      {existingFiles.length > 0 && (
        <div>
          <h4 className="font-medium text-sm mb-2">Arquivos anexados:</h4>
          <div className="space-y-2">
            {existingFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-2 border rounded bg-gray-50">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded">
                    <FileText className="h-4 w-4 text-blue-500" />
                  </div>
                  <div className="ml-2">
                    <div className="text-sm font-medium">{file.name}</div>
                    <div className="text-xs text-gray-500">{formatFileSize(file.size)}</div>
                  </div>
                </div>
                {onRemoveExisting && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveExisting(index)}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lista de arquivos novos */}
      {files.length > 0 && (
        <div>
          <h4 className="font-medium text-sm mb-2">Novos arquivos:</h4>
          <div className="space-y-2">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-2 border rounded bg-gray-50">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded">
                    <FileText className="h-4 w-4 text-blue-500" />
                  </div>
                  <div className="ml-2">
                    <div className="text-sm font-medium">{file.name}</div>
                    <div className="text-xs text-gray-500">{formatFileSize(file.size)}</div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                  className="text-gray-500 hover:text-red-500"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
