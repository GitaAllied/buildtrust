
import { useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { apiClient } from "@/lib/api";

interface IdentityVerificationProps {
  data: any;
  onChange: (data: any) => void;
}

interface FileData {
  name: string;
  size: number;
  type: string;
  uploadedUrl?: string;
  isUploading?: boolean;
}

const IdentityVerification = ({ data, onChange }: IdentityVerificationProps) => {
  const { user } = useAuth();
  const [uploadedFiles, setUploadedFiles] = useState<{
    id?: FileData;
    cac?: FileData;
    selfie?: FileData;
  }>({});
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

  const uploadFileToBackend = useCallback(
    async (file: File, documentType: string) => {
      if (!user?.id) {
        setError('User not authenticated');
        return null;
      }

      try {
        setUploadProgress(prev => ({ ...prev, [documentType]: 0 }));
        
        console.log(`📤 Uploading ${documentType} document:`, file.name);
        
        const result = await apiClient.uploadDocument(user.id, documentType, file);
        
        console.log(`✅ ${documentType} uploaded successfully:`, result);
        setUploadProgress(prev => ({ ...prev, [documentType]: 100 }));
        
        return result;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Upload failed';
        console.error(`❌ Failed to upload ${documentType}:`, errorMsg);
        setError(`Failed to upload ${documentType}: ${errorMsg}`);
        setUploadProgress(prev => ({ ...prev, [documentType]: 0 }));
        return null;
      }
    },
    [user?.id]
  );

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    console.log('handleFileChange called for:', type);
    
    const file = e.currentTarget.files?.[0];
    if (!file) {
      console.log('No file selected');
      return;
    }

    console.log('File selected:', file.name, file.type, file.size);
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

    // Mark as uploading
    setUploadedFiles(prev => ({
      ...prev,
      [type]: { 
        name: file.name, 
        size: file.size, 
        type: file.type,
        isUploading: true
      }
    }));

    // Upload to backend
    const uploadResult = await uploadFileToBackend(file, type);

    if (uploadResult) {
      // Update with successful upload
      setUploadedFiles(prev => ({
        ...prev,
        [type]: { 
          name: file.name, 
          size: file.size, 
          type: file.type,
          uploadedUrl: uploadResult.url || uploadResult.file_path,
          isUploading: false
        }
      }));

      // Pass uploaded file data to parent
      onChange({ 
        ...data, 
        [type]: {
          file,
          uploadedUrl: uploadResult.url || uploadResult.file_path,
          documentId: uploadResult.id
        }
      });
      console.log('File uploaded successfully:', type);
    } else {
      // Remove from state if upload failed
      setUploadedFiles(prev => {
        const updated = { ...prev };
        delete updated[type as keyof typeof updated];
        return updated;
      });
      onChange({ ...data, [type]: null });
    }
  };

  const removeFile = (type: string) => {
    setUploadedFiles(prev => {
      const updated = { ...prev };
      delete updated[type as keyof typeof updated];
      return updated;
    });
    setUploadProgress(prev => {
      const updated = { ...prev };
      delete updated[type];
      return updated;
    });
    onChange({ ...data, [type]: null });
  };

  const FileUploadBox = ({ label, type, accept, documentType }: { label: string; type: string; accept: string; documentType: string }) => {
    const file = uploadedFiles[type as keyof typeof uploadedFiles];
    const progress = uploadProgress[type] || 0;
    
    return (
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#253E44]/60 transition-colors">
        <div className="flex items-center justify-center mb-4">
          <h3 className="text-sm font-semibold text-gray-800">{label}</h3>
          <span className="text-red-500 ml-1">*</span>
        </div>

        {!file ? (
          // No file uploaded
          <label className="block cursor-pointer">
            <input
              type="file"
              accept={accept}
              onChange={(e) => handleFileChange(e, type)}
              className="hidden"
              disabled={!user}
            />
            <div className="flex flex-col items-center justify-center py-6">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <p className="text-xs text-gray-500">Click or drag file here</p>
            </div>
          </label>
        ) : file.isUploading ? (
          // Uploading
          <div className="py-4">
            <div className="flex items-center justify-center mb-4">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#253E44]"></div>
            </div>
            <p className="text-sm font-medium text-gray-800 mb-2">Uploading...</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-[#253E44] h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">{progress}%</p>
          </div>
        ) : (
          // File uploaded
          <div className="py-4">
            <div className="flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
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
                  disabled={!user}
                />
                <span className="block text-xs py-2 px-3 bg-blue-100 text-[#253E44] rounded hover:bg-blue-200 transition-colors">
                  Change
                </span>
              </label>
              <button
                type="button"
                onClick={() => removeFile(type)}
                className="flex-1 text-xs py-2 px-3 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const isComplete = uploadedFiles.id && uploadedFiles.cac && uploadedFiles.selfie && 
                     !uploadedFiles.id.isUploading && !uploadedFiles.cac.isUploading && !uploadedFiles.selfie.isUploading;

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
          documentType="identity"
        />
        <FileUploadBox 
          label="CAC Certificate" 
          type="cac" 
          accept="image/*,.pdf"
          documentType="license"
        />
      </div>

      <FileUploadBox 
        label="Selfie for Verification" 
        type="selfie" 
        accept="image/*"
        documentType="certification"
      />

      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">
          {error}
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
            <h3 className="text-sm font-medium text-[#253E44]">Upload Status</h3>
            <p className="text-sm text-[#253E44] mt-1">
              {isComplete 
                ? '✓ All documents uploaded and ready to submit' 
                : `${Object.keys(uploadedFiles).filter(k => !uploadedFiles[k as keyof typeof uploadedFiles]?.isUploading).length}/3 documents uploaded`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdentityVerification;
