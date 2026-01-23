import { useState } from "react";

interface FileData {
  file: File;
  name: string;
  size: number;
  type: string;
}

interface IdentityVerificationProps {
  // Use a specific type instead of 'any' for better reliability
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

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    // Validation
    if (file.size > MAX_FILE_SIZE) {
      setError('File too large. Max 10 MB.');
      return;
    }

    // Allow any file type - just warn if unusual
    if (type === 'selfie') {
      if (!file.type.startsWith('image/')) {
        setError('Selfie should be an image file (JPG, PNG, etc)');
        return;
      }
    }

    // Update parent state directly
    const updatedData = {
      ...data,
      [type]: {
        file,
        name: file.name,
        size: file.size,
        type: file.type
      }
    };

    onChange(updatedData);
    e.target.value = ''; // Reset input so same file can be re-selected if removed
  };

  const removeFile = (type: string) => {
    const updatedData = { ...data };
    delete updatedData[type as keyof typeof data];
    onChange(updatedData);
  };

  // ACTUAL UPLOAD LOGIC
  const handleSubmit = async () => {
    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    if (data.id?.file) formData.append('id_document', data.id.file);
    if (data.cac?.file) formData.append('cac_document', data.cac.file);
    if (data.selfie?.file) formData.append('selfie_image', data.selfie.file);

    try {
      // Replace with your actual API endpoint
      const response = await fetch('/api/upload-identity', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');
      alert('Files uploaded successfully!');
    } catch (err) {
      setError('Failed to upload files to the server.');
    } finally {
      setIsUploading(false);
    }
  };

  const FileUploadBox = ({ label, type, accept }: { label: string; type: string; accept: string }) => {
    const fileData = data[type as keyof typeof data];
    const inputId = `file-input-${type}`;

    return (
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#253E44]/60 transition-colors cursor-pointer">
        <div className="flex items-center justify-center mb-4">
          <h3 className="text-sm font-semibold text-gray-800">{label}</h3>
          <span className="text-red-500 ml-1">*</span>
        </div>

        {!fileData ? (
          <label htmlFor={inputId} className="block cursor-pointer">
            <input
              id={inputId}
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
              <p className="text-xs text-gray-500 mb-1">Click to select or drag file</p>
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
                  type="file"
                  accept={accept}
                  onChange={(e) => handleFileChange(e, type)}
                  className="hidden"
                />
                <span className="text-xs px-3 py-2 bg-blue-100 text-[#253E44] rounded hover:bg-blue-200 transition-colors font-medium inline-block cursor-pointer">
                  Change
                </span>
              </label>
              <button 
                onClick={() => removeFile(type)}
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

  const uploadedCount = Object.keys(data).length;

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
        />
        <FileUploadBox 
          label="CAC Certificate" 
          type="cac" 
          accept="image/*,.pdf,.doc,.docx" 
        />
        <FileUploadBox 
          label="Selfie" 
          type="selfie" 
          accept="image/*" 
        />
      </div>

      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="bg-[#253E44]/5 border border-[#253E44]/20 rounded-lg p-4">
        <p className="text-sm text-[#253E44]">
          <span className="font-semibold">{Object.keys(data).length}/3</span> documents selected
          {Object.keys(data).length === 3 && ' - Ready to submit!'}
        </p>
      </div>

      <button
        onClick={handleSubmit}
        disabled={Object.keys(data).length < 3 || isUploading}
        className={`w-full py-3 rounded-lg font-semibold text-white transition-all ${
          Object.keys(data).length < 3 || isUploading 
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
