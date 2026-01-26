import { useState, useEffect, useRef } from "react";

interface FileData {
  file: File;
  name: string;
  size: number;
  type: string;
}

interface StoredFileMetadata {
  name: string;
  size: number;
  type: string;
}

interface IdentityVerificationProps {
  data: {
    id?: FileData;
    cac?: FileData;
    selfie?: FileData;
  };
  onChange: (data: any) => void;
}

const IdentityVerification = ({ data, onChange }: IdentityVerificationProps) => {
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [currentData, setCurrentData] = useState(data);
  
  // Refs for file inputs
  const idInputRef = useRef<HTMLInputElement>(null);
  const cacInputRef = useRef<HTMLInputElement>(null);
  const selfieInputRef = useRef<HTMLInputElement>(null);

  // Sync internal state with external props
  useEffect(() => {
    setCurrentData(data);
  }, [data]);

  // Load files from localStorage on mount
  useEffect(() => {
    const loadFromStorage = () => {
      try {
        const stored = localStorage.getItem('identityVerificationFiles');
        if (stored) {
          const metadata = JSON.parse(stored);
          console.log('Found stored file metadata:', metadata);
        }
      } catch (err) {
        console.error('Failed to load from localStorage:', err);
      }
    };
    loadFromStorage();
  }, []);

  // Save file metadata to localStorage when data changes
  useEffect(() => {
    const saveToStorage = () => {
      try {
        const metadata: Record<string, StoredFileMetadata> = {};
        if (currentData.id) {
          metadata.id = { name: currentData.id.name, size: currentData.id.size, type: currentData.id.type };
        }
        if (currentData.cac) {
          metadata.cac = { name: currentData.cac.name, size: currentData.cac.size, type: currentData.cac.type };
        }
        if (currentData.selfie) {
          metadata.selfie = { name: currentData.selfie.name, size: currentData.selfie.size, type: currentData.selfie.type };
        }
        
        if (Object.keys(metadata).length > 0) {
          localStorage.setItem('identityVerificationFiles', JSON.stringify(metadata));
        }
      } catch (err) {
        console.error('Failed to save to localStorage:', err);
      }
    };
    saveToStorage();
  }, [currentData]);

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const file = e.target.files?.[0];
    if (!file) {
      console.log(`No file selected for ${type}`);
      return;
    }

    console.log(`File selected for ${type}:`, file.name, file.size);
    setError(null);

    // Validation
    if (file.size > MAX_FILE_SIZE) {
      setError('File too large. Max 10 MB.');
      e.target.value = '';
      return;
    }

    // File type validation
    if (type === 'selfie') {
      if (!file.type.startsWith('image/')) {
        setError('Selfie should be an image file (JPG, PNG, etc)');
        e.target.value = '';
        return;
      }
    } else if (type === 'id' || type === 'cac') {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type) && !file.name.match(/\.(jpg|jpeg|png|pdf|doc|docx)$/i)) {
        setError(`Invalid file type for ${type}. Allowed: images, PDF, DOC, DOCX`);
        e.target.value = '';
        return;
      }
    }

    // Update state with the actual File object
    const updatedData = {
      ...currentData,
      [type]: {
        file,
        name: file.name,
        size: file.size,
        type: file.type
      }
    };

    console.log(`Updated data for ${type}:`, updatedData);
    setCurrentData(updatedData);
    onChange(updatedData);
    e.target.value = ''; // Reset input so same file can be re-selected if removed
  };

  const removeFile = (type: string) => {
    const updatedData = { ...currentData };
    delete updatedData[type as keyof typeof updatedData];
    setCurrentData(updatedData);
    onChange(updatedData);
    
    // Reset the file input
    const inputRef = type === 'id' ? idInputRef : type === 'cac' ? cacInputRef : selfieInputRef;
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    
    // Also remove from localStorage
    try {
      const stored = localStorage.getItem('identityVerificationFiles');
      if (stored) {
        const metadata = JSON.parse(stored);
        delete metadata[type];
        if (Object.keys(metadata).length > 0) {
          localStorage.setItem('identityVerificationFiles', JSON.stringify(metadata));
        } else {
          localStorage.removeItem('identityVerificationFiles');
        }
      }
    } catch (err) {
      console.error('Failed to update localStorage:', err);
    }
  };

  // ACTUAL UPLOAD LOGIC
  const handleSubmit = async () => {
    // Final validation
    if (!currentData.id?.file || !currentData.cac?.file || !currentData.selfie?.file) {
      setError('All three documents are required.');
      return;
    }

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    
    // Append files with proper validation
    try {
      if (currentData.id?.file instanceof File) {
        formData.append('id_document', currentData.id.file);
        console.log('Appended ID document');
      }
      if (currentData.cac?.file instanceof File) {
        formData.append('cac_document', currentData.cac.file);
        console.log('Appended CAC document');
      }
      if (currentData.selfie?.file instanceof File) {
        formData.append('selfie_image', currentData.selfie.file);
        console.log('Appended selfie image');
      }

      // Make the API call to backend
      const response = await fetch('/api/upload-identity', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Upload failed');
      }

      const result = await response.json();
      console.log('Upload successful:', result);
      
      // Clear localStorage on successful upload
      try {
        localStorage.removeItem('identityVerificationFiles');
      } catch (err) {
        console.error('Failed to clear localStorage:', err);
      }
      
      alert('Files uploaded successfully!');
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload files to the server.');
    } finally {
      setIsUploading(false);
    }
  };

  const FileUploadBox = ({ 
    label, 
    type, 
    accept,
    fileData,
    onFileChange,
    onRemove
  }: { 
    label: string; 
    type: string; 
    accept: string;
    fileData: FileData | undefined;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>, type: string) => void;
    onRemove: (type: string) => void;
  }) => {
    const inputId = `file-input-${type}`;
    const inputRef = type === 'id' ? idInputRef : type === 'cac' ? cacInputRef : selfieInputRef;

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.currentTarget.classList.add('border-blue-500', 'bg-blue-50');
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50');
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50');
      
      const droppedFiles = e.dataTransfer.files;
      if (droppedFiles.length > 0 && inputRef.current) {
        inputRef.current.files = droppedFiles;
        const file = droppedFiles[0];
        const syntheticEvent = {
          target: {
            files: droppedFiles,
            value: ''
          }
        } as React.ChangeEvent<HTMLInputElement>;
        onFileChange(syntheticEvent, type);
      }
    };

    return (
      <div 
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#253E44]/60 transition-colors"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex items-center justify-center mb-4">
          <h3 className="text-sm font-semibold text-gray-800">{label}</h3>
          <span className="text-red-500 ml-1">*</span>
        </div>

        {!fileData ? (
          <label 
            htmlFor={inputId} 
            className="block cursor-pointer"
          >
            <input
              ref={inputRef}
              id={inputId}
              type="file"
              accept={accept}
              onChange={(e) => onFileChange(e, type)}
              className="hidden"
              aria-label={`Upload ${label}`}
            />
            <div className="flex flex-col items-center justify-center py-6">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <p className="text-xs text-gray-500 mb-1">Click to select or drag file here</p>
              <p className="text-xs text-gray-400">(Max 10 MB)</p>
            </div>
          </label>
        ) : (
          <div className="py-4">
            <div className="flex items-center justify-center mb-3">
              <svg className="w-10 h-10 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-800 mb-1 break-words">{fileData.name}</p>
            <p className="text-xs text-gray-500 mb-4">{(fileData.size / 1024 / 1024).toFixed(2)} MB</p>
            
            <div className="flex gap-2 justify-center">
              <label className="cursor-pointer">
                <input
                  ref={inputRef}
                  type="file"
                  accept={accept}
                  onChange={(e) => onFileChange(e, type)}
                  className="hidden"
                  aria-label={`Change ${label}`}
                />
                <span className="text-xs px-3 py-2 bg-blue-100 text-[#253E44] rounded hover:bg-blue-200 transition-colors font-medium inline-block cursor-pointer">
                  Change
                </span>
              </label>
              <button 
                onClick={() => onRemove(type)}
                type="button"
                className="text-xs px-3 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors border border-red-200 font-medium"
              >
                Remove
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const uploadedCount = Object.keys(currentData).length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Identity Verification</h2>
        <p className="text-sm text-gray-600">Upload your identification documents to verify your identity</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <FileUploadBox 
          label="Government ID" 
          type="id" 
          accept="image/*,.pdf,.doc,.docx"
          fileData={currentData.id}
          onFileChange={handleFileChange}
          onRemove={removeFile}
        />
        <FileUploadBox 
          label="CAC Certificate" 
          type="cac" 
          accept="image/*,.pdf,.doc,.docx"
          fileData={currentData.cac}
          onFileChange={handleFileChange}
          onRemove={removeFile}
        />
        <FileUploadBox 
          label="Selfie" 
          type="selfie" 
          accept="image/*"
          fileData={currentData.selfie}
          onFileChange={handleFileChange}
          onRemove={removeFile}
        />
      </div>

      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="bg-[#253E44]/5 border border-[#253E44]/20 rounded-lg p-4">
        <p className="text-sm text-[#253E44]">
          <span className="font-semibold">{Object.keys(currentData).length}/3</span> documents selected
          {Object.keys(currentData).length === 3 && ' - Ready to submit!'}
        </p>
      </div>

      <button
        onClick={handleSubmit}
        disabled={Object.keys(currentData).length < 3 || isUploading}
        className={`w-full py-3 rounded-lg font-semibold text-white transition-all ${
          Object.keys(currentData).length < 3 || isUploading 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-[#253E44] hover:bg-[#253E44]/90'
        }`}
      >
        {isUploading ? 'Uploading...' : 'Verify Identity'}
      </button>
    </div>
  );
};

export default IdentityVerification;
