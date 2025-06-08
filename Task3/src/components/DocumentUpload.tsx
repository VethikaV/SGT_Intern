import React, { useState, useCallback } from 'react';
import { Upload, FileText, Image, AlertCircle } from 'lucide-react';

interface DocumentuploadProps {
  onFileUpload: (file: File) => void;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({ onFileUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setUploadError(null);

    const files = Array.from(e.dataTransfer.files);
    const file = files[0];

    if (file && (file.type.startsWith('image/') || file.type === 'application/pdf')) {
      onFileUpload(file);
    } else {
      setUploadError('Please upload an image (PNG, JPG, JPEG) or PDF file');
    }
  }, [onFileUpload]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  }, [onFileUpload]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
          isDragging
            ? 'border-blue-500 bg-blue-50 scale-105'
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept="image/*,.pdf"
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          id="file-upload"
        />
        
        <div className="flex flex-col items-center space-y-4">
          <div className="flex space-x-2">
            <div className={`p-3 rounded-full transition-colors ${isDragging ? 'bg-blue-100' : 'bg-gray-100'}`}>
              <Upload className={`w-6 h-6 ${isDragging ? 'text-blue-600' : 'text-gray-600'}`} />
            </div>
            <div className={`p-3 rounded-full transition-colors ${isDragging ? 'bg-blue-100' : 'bg-gray-100'}`}>
              <Image className={`w-6 h-6 ${isDragging ? 'text-blue-600' : 'text-gray-600'}`} />
            </div>
            <div className={`p-3 rounded-full transition-colors ${isDragging ? 'bg-blue-100' : 'bg-gray-100'}`}>
              <FileText className={`w-6 h-6 ${isDragging ? 'text-blue-600' : 'text-gray-600'}`} />
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Upload Historical Document
            </h3>
            <p className="text-gray-600 mb-4">
              Drag and drop your document here, or click to browse
            </p>
            <p className="text-sm text-gray-500">
              Supports: Images (PNG, JPG, JPEG) and PDF files up to 10MB
            </p>
          </div>

          <label
            htmlFor="file-upload"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all cursor-pointer shadow-lg hover:shadow-xl"
          >
            <Upload className="w-4 h-4 mr-2" />
            Choose File
          </label>
        </div>

        {uploadError && (
          <div className="mt-4 flex items-center justify-center text-red-600 bg-red-50 rounded-lg p-3">
            <AlertCircle className="w-4 h-4 mr-2" />
            <span className="text-sm">{uploadError}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentUpload;