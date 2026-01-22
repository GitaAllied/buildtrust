
import { useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";

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
  documentId?: number;
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
        setError('User not authenticated. Please refresh and try again.');
        return null;
      }

      return new Promise((resolve) => {
        try {
          setUploadProgress(prev => ({ ...prev, [documentType]: 0 }));
          
          console.log(`📤 Uploading ${documentType} document:`, file.name);
          
          const token = localStorage.getItem('auth_token');
          const xhr = new XMLHttpRequest();

          // Track upload progress
          xhr.upload.addEventListener('progress', (e) => {
            if (e.lengthComputable) {
              const percentComplete = Math.round((e.loaded / e.total) * 100);
              console.log(`⏳ ${documentType} upload progress: ${percentComplete}%`);
              setUploadProgress(prev => ({ ...prev, [documentType]: percentComplete }));
            }
          });

          xhr.addEventListener('load', () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              try {
                const result = JSON.parse(xhr.responseText);
                console.log(`✅ ${documentType} uploaded successfully:`, result);
                setUploadProgress(prev => ({ ...prev, [documentType]: 100 }));
                resolve(result);
              } catch (e) {
                console.error('Failed to parse response:', e);
                setError(`Failed to parse server response for ${documentType}`);
                resolve(null);
              }
            } else {
              const errorText = xhr.responseText;
              console.error(`❌ Upload failed (${xhr.status}):`, errorText);
              setError(`Failed to upload ${documentType}: Server error ${xhr.status}`);
              resolve(null);
            }
          });

          xhr.addEventListener('error', () => {
            console.error(`❌ Network error uploading ${documentType}`);
            setError(`Network error uploading ${documentType}`);
            resolve(null);
          });

          xhr.addEventListener('abort', () => {
            console.log(`⚠️ Upload cancelled for ${documentType}`);
            setError(`Upload cancelled for ${documentType}`);
            resolve(null);
          });

          const formData = new FormData();
          formData.append('type', documentType);
          formData.append('file', file);

          const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
          const url = `${baseUrl}/users/${user.id}/documents`;
          
          console.log(`🌐 Sending to: ${url}`);
          
          xhr.open('POST', url, true);
          if (token) {
            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
          }
          
          xhr.send(formData);
        } catch (err) {
          const errorMsg = err instanceof Error ? err.message : 'Upload failed';
          console.error(`❌ Error: ${errorMsg}`);
          setError(`Error uploading ${documentType}: ${errorMsg}`);
          resolve(null);
        }
      });
    },
    [user?.id]
  );

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
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
          documentId: uploadResult.id,
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
    
    // Reset input
    e.currentTarget.value = '';
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

  const FileUploadBox = ({ label, type, accept }: { label: string; type: string; accept: string }) => {
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
        ) : file.isUploading ? (
          // Uploading
          <div className="py-4">
            <div className="flex items-center justify-center mb-4">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-[#253E44]"></div>
            </div>
            <p className="text-sm font-medium text-gray-800 mb-2">Uploading...</p>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-[#226F75] to-[#253E44] h-3 transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-600 mt-2 font-semibold">{progress}% Complete</p>
          </div>
        ) : (
          // File uploaded
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

  const uploadedCount = Object.values(uploadedFiles).filter(f => f && !f.isUploading).length;
  const isComplete = uploadedCount === 3 && 
                     uploadedFiles.id && 
                     uploadedFiles.cac && 
                     uploadedFiles.selfie &&
                     !uploadedFiles.id.isUploading && 
                     !uploadedFiles.cac.isUploading && 
                     !uploadedFiles.selfie.isUploading;

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
          <p className="font-medium">Upload Error</p>
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
            <h3 className="text-sm font-medium text-[#253E44]">Upload Status</h3>
            <p className="text-sm text-[#253E44] mt-1">
              {isComplete 
                ? '✓ All documents uploaded successfully!' 
                : `${uploadedCount}/3 documents uploaded`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdentityVerification;
