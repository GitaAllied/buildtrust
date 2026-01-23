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

    if (type === 'selfie' && !['image/jpeg', 'image/png'].includes(file.type)) {
      setError('Selfie must be JPG or PNG');
      return;
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
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
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
              <svg className="w-10 h-10 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-xs text-gray-500">Click to upload</p>
            </div>
          </label>
        ) : (
          <div className="py-2">
            <p className="text-sm font-medium text-green-600 mb-1">✓ {fileData.name}</p>
            <div className="flex gap-2 justify-center mt-3">
              <button 
                onClick={() => removeFile(type)}
                className="text-xs px-3 py-1 bg-red-50 text-red-600 rounded border border-red-200"
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
      <div className="grid md:grid-cols-3 gap-4">
        <FileUploadBox label="Gov ID" type="id" accept="image/*,application/pdf" />
        <FileUploadBox label="CAC Cert" type="cac" accept="image/*,application/pdf" />
        <FileUploadBox label="Selfie" type="selfie" accept="image/jpeg,image/png" />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={uploadedCount < 3 || isUploading}
        className={`w-full py-3 rounded-lg font-semibold text-white transition-all ${
          uploadedCount < 3 || isUploading 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-[#253E44] hover:bg-opacity-90'
        }`}
      >
        {isUploading ? 'Uploading...' : `Complete Verification (${uploadedCount}/3)`}
      </button>
    </div>
  );
};

export default IdentityVerification;
