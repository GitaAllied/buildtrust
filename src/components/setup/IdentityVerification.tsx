import { useState, useEffect, useRef } from "react";

interface FileData {
  file: File;
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

const IDENTITY_STORAGE_KEY = 'buildtrust_identity_verification';

const IdentityVerification = ({ data, onChange }: IdentityVerificationProps) => {
  const [files, setFiles] = useState(() => {
    // Try to load from localStorage first
    const savedData = localStorage.getItem(IDENTITY_STORAGE_KEY);
    if (savedData) {
      try {
        return JSON.parse(savedData);
      } catch (e) {
        console.error('Failed to load identity data from localStorage', e);
      }
    }
    
    // Fallback to props data or default values
    return {
      id: null as FileData | null,
      cac: null as FileData | null,
      selfie: null as FileData | null,
      ...data
    };
  });
  const [error, setError] = useState<string | null>(null);
  const lastEmittedRef = useRef<string | null>(null);

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
  const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Save to localStorage whenever files change
  useEffect(() => {
    localStorage.setItem(IDENTITY_STORAGE_KEY, JSON.stringify(files));
  }, [files]);

  // Sync internal state with parent (emit only when necessary to avoid loops)
  useEffect(() => {
    const serialized = JSON.stringify(files);
    if (lastEmittedRef.current !== serialized) {
      lastEmittedRef.current = serialized;
      onChange(files);
    }
  }, [files, onChange]);

  const handleFileUpload = (type: string, fileList: FileList | null) => {
    console.log(`File upload handler called for ${type}`, fileList);
    setError(null);

    if (!fileList || fileList.length === 0) {
      console.log('No files selected');
      return;
    }

    const file = fileList[0];
    console.log(`Processing file: ${file.name}, type: ${file.type}, size: ${file.size}`);

    // Validation
    if (file.size > MAX_FILE_SIZE) {
      console.warn(`File too large: ${file.name}`);
      setError(`File is too large. Max size is 10 MB`);
      return;
    }

    // File type validation based on document type
    if (type === 'selfie') {
      if (!file.type.startsWith('image/')) {
        console.warn(`Invalid type for selfie: ${file.type}`);
        setError(`Selfie must be an image file (JPG, PNG, etc)`);
        return;
      }
    } else if (type === 'id' || type === 'cac') {
      const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      const isValidType = validTypes.includes(file.type) || file.name.match(/\.(jpg|jpeg|png|webp|pdf|doc|docx)$/i);
      
      if (!isValidType) {
        console.warn(`Invalid type for ${type}: ${file.type}`);
        setError(`Invalid file type. Allowed: Images, PDF, DOC, DOCX`);
        return;
      }
    }

    const fileData: FileData = {
      file,
      name: file.name,
      size: file.size,
      type: file.type
    };

    const updatedFiles = {
      ...files,
      [type]: fileData
    };

    console.log(`Updated ${type} file:`, fileData);
    setFiles(updatedFiles);
    onChange(updatedFiles);
  };

  const removeFile = (type: string) => {
    const updatedFiles = {
      ...files,
      [type]: null
    };
    setFiles(updatedFiles);
    onChange(updatedFiles);
  };

  const isComplete = files.id !== null && files.cac !== null && files.selfie !== null;

  // Render file upload section
  const renderUploadSection = (
    label: string,
    type: 'id' | 'cac' | 'selfie',
    accept: string,
    description: string
  ) => {
    const fileData = files[type];
    const inputId = `upload-${type}`;

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      e.currentTarget.classList.add('border-blue-500', 'bg-blue-50');
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50');
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50');
      console.log('Files dropped:', e.dataTransfer.files);
      handleFileUpload(type, e.dataTransfer.files);
    };

    return (
      <div key={type} className="space-y-3">
        <div>
          <div className="flex items-center mb-2">
            <label className="text-sm font-semibold text-gray-900">{label}</label>
            <span className="text-red-500 ml-1">*</span>
          </div>
          <p className="text-xs text-gray-600">{description}</p>
        </div>

        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#253E44]/60 transition-colors cursor-pointer"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {!fileData ? (
            <label htmlFor={inputId} className="cursor-pointer block w-full">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div className="text-sm font-medium text-gray-900 mb-1">Upload Document</div>
              <div className="text-xs text-gray-500">Click to upload or drag and drop</div>
              <div className="text-xs text-gray-400 mt-1">
                {type === 'selfie' ? 'Image files up to 10MB' : 'PDF, JPG, PNG, DOC, DOCX up to 10MB'}
              </div>
            </label>
          ) : (
            <div className="py-4">
              <div className="flex items-center justify-center mb-3">
                <svg className="w-10 h-10 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="text-sm font-medium text-gray-900 mb-1 break-words max-w-xs mx-auto">{fileData.name}</div>
              <div className="text-xs text-gray-500 mb-4">{(fileData.size / 1024 / 1024).toFixed(2)} MB</div>

              <div className="flex gap-2 justify-center flex-wrap">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept={accept}
                    onChange={(e) => {
                      console.log(`Input changed for ${type}:`, e.target.files);
                      handleFileUpload(type, e.target.files);
                    }}
                    className="hidden"
                    aria-label={`Change ${label}`}
                  />
                  <span className="text-xs px-3 py-2 bg-blue-100 text-[#253E44] rounded hover:bg-blue-200 transition-colors font-medium inline-block cursor-pointer">
                    Change
                  </span>
                </label>
                <button
                  onClick={() => removeFile(type)}
                  type="button"
                  className="text-xs px-3 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors border border-red-200 font-medium"
                >
                  Remove
                </button>
              </div>
            </div>
          )}

          <input
            id={inputId}
            type="file"
            accept={accept}
            onChange={(e) => {
              console.log(`Input changed for ${type}:`, e.target.files);
              handleFileUpload(type, e.target.files);
            }}
            className="hidden"
            aria-label={`Upload ${label}`}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Identity Verification</h2>
        <p className="text-gray-600">Upload your identification documents to verify your identity. All documents must be clear and current.</p>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {renderUploadSection(
          "Government ID",
          "id",
          "image/*,.pdf,.doc,.docx",
          "Upload a valid government-issued ID (passport, driver's license, national ID)"
        )}

        {renderUploadSection(
          "CAC Certificate",
          "cac",
          "image/*,.pdf,.doc,.docx",
          "Upload your Corporate Affairs Commission certificate or equivalent business registration"
        )}

        {renderUploadSection(
          "Selfie",
          "selfie",
          "image/*",
          "Upload a clear selfie for facial recognition verification"
        )}
      </div>

      <div className="bg-[#253E44]/5 border border-[#253E44]/20 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="w-6 h-6 bg-[#253E44]/10 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
            <svg className="w-4 h-4 text-[#253E44]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-medium text-[#253E44]/80">Documents Status</h3>
            <p className="text-sm text-[#253E44]/70 mt-1">
              <span className="font-semibold">{[files.id, files.cac, files.selfie].filter(Boolean).length}/3</span> documents uploaded
              {isComplete && ' - Ready to continue!'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdentityVerification;
