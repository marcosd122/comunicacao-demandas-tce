
import { useState, ChangeEvent } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileUploadProps {
  onFilesChange: (files: File[]) => void;
  existingFiles?: { name: string; size: number }[];
  onRemoveExisting?: (index: number) => void;
}

const FileUpload = ({ onFilesChange, existingFiles = [], onRemoveExisting }: FileUploadProps) => {
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => {
        const updatedFiles = [...prev, ...newFiles];
        onFilesChange(updatedFiles);
        return updatedFiles;
      });
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => {
      const updatedFiles = prev.filter((_, i) => i !== index);
      onFilesChange(updatedFiles);
      return updatedFiles;
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center hover:bg-gray-50 transition-colors">
        <div className="text-gray-500 mb-2">Arraste e solte alguns arquivos aqui ou clique para selecionar</div>
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="hidden"
          id="file-upload"
        />
        <label htmlFor="file-upload">
          <Button variant="outline" type="button" className="mt-2">
            Selecionar Arquivos
          </Button>
        </label>
        <div className="text-xs text-gray-500 mt-2">
          Tipos de arquivos permitidos: imagem, áudio, zip, pdf, doc, xls, txt e zip
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
                    <FileIcon />
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
                    <FileIcon />
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

const FileIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-blue-500"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);

export default FileUpload;
