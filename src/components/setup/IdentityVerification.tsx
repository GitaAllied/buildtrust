
import { useState } from "react";

interface IdentityVerificationProps {
  data: any;
  onChange: (data: any) => void;
}

interface FileData {
  file: File;
  name: string;
  size: number;
  type: string;
}

const IdentityVerification = ({ data, onChange }: IdentityVerificationProps) => {
  const [uploadedFiles, setUploadedFiles] = useState<{
    id?: FileData;
    cac?: FileData;
    selfie?: FileData;
  }>(data || {});
  const [error, setError] = useState<string | null>(null);

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const file = e.currentTarget.files?.[0];
    if (!file) {
      return;
    }

    setError(null);

    // Validate size
    if (file.size > MAX_FILE_SIZE) {
      setError('File too large. Max 10 MB.');
      return;
    }

    // Validate type
    if (type === 'selfie') {
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        setError('Selfie must be JPG or PNG');
        return;
      }
    } else {
      if (!['application/pdf', 'image/jpeg', 'image/png'].includes(file.type)) {
        setError('Invalid file type. Use PDF or image.');
        return;
      }
    }

    // Store file locally
    const newFiles = {
      ...uploadedFiles,
      [type]: {
        file,
        name: file.name,
        size: file.size,
        type: file.type
      }
    };

    setUploadedFiles(newFiles);
    onChange(newFiles);
    
    // Reset input
    e.currentTarget.value = '';
  };

  const removeFile = (type: string) => {
    const newFiles = { ...uploadedFiles };
    delete newFiles[type as keyof typeof newFiles];
    setUploadedFiles(newFiles);
    onChange(newFiles);
  };

  const FileUploadBox = ({ label, type, accept }: { label: string; type: string; accept: string }) => {
    const file = uploadedFiles[type as keyof typeof uploadedFiles];
    
    return (
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#253E44]/60 transition-colors">
        <div className="flex items-center justify-center mb-4">
          <h3 className="text-sm font-semibold text-gray-800">{label}</h3>
          <span className="text-red-500 ml-1">*</span>
        </div>

        {!file ? (
          // No file selected
          <label className="block cursor-pointer">
            <input
              type="file"
              accept={accept}
              onChange={(e) => handleFileChange(e, type)}
              className="hidden"
            />
            <div className="flex flex-col items-center justify-center py-6">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <p className="text-xs text-gray-500">Click to select {label.toLowerCase()}</p>
            </div>
          </label>
        ) : (
          // File selected
          <div className="py-4">
            <div className="flex items-center justify-center mb-4">
              <div className="relative">
                <svg className="w-12 h-12 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <p className="text-sm font-medium text-gray-800 mb-1 break-words">{file.name}</p>
            <p className="text-xs text-gray-500 mb-4">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            
            <div className="flex gap-2">
              <label className="flex-1 cursor-pointer">
                <input
                  type="file"
                  accept={accept}
                  onChange={(e) => handleFileChange(e, type)}
                  className="hidden"
                />
                <span className="block text-xs py-2 px-3 bg-blue-100 text-[#253E44] rounded hover:bg-blue-200 transition-colors font-medium">
                  Change
                </span>
              </label>
              <button
                type="button"
                onClick={() => removeFile(type)}
                className="flex-1 text-xs py-2 px-3 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors font-medium"
              >
                Remove
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const uploadedCount = Object.values(uploadedFiles).length;
  const isComplete = uploadedCount === 3;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Identity Verification</h2>
        <p className="text-gray-600">Upload your identification documents to verify your identity.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <FileUploadBox 
          label="Government ID" 
          type="id" 
          accept="image/*,.pdf"
        />
        <FileUploadBox 
          label="CAC Certificate" 
          type="cac" 
          accept="image/*,.pdf"
        />
      </div>

      <FileUploadBox 
        label="Selfie for Verification" 
        type="selfie" 
        accept="image/*"
      />

      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 p-4 text-sm text-red-700">
          <p className="font-medium">Error</p>
          <p>{error}</p>
        </div>
      )}

      <div className="bg-[#253E44]/5 border border-[#253E44]/20 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="w-6 h-6 bg-[#253E44]/10 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
            <svg className="w-4 h-4 text-[#253E44]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-medium text-[#253E44]">Document Status</h3>
            <p className="text-sm text-[#253E44] mt-1">
              {isComplete 
                ? '✓ All documents selected. Ready to submit!' 
                : `${uploadedCount}/3 documents selected`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdentityVerification;
