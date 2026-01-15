
import { useState } from "react";
import z from "zod";

interface IdentityVerificationProps {
  data: any;
  onChange: (data: any) => void;
}

const IdentityVerification = ({ data, onChange }: IdentityVerificationProps) => {
  const [files, setFiles] = useState({
    id: null as File | null,
    cac: null as File | null,
    selfie: null as File | null,
});
const [error, setError] = useState<string | null>(null);

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
  const ALLOWED_DOC_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];
  const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png'];

  const handleFileUpload = (type: string, file: File | null) => {
    setError(null);
    if (!file) {
      setFiles(prev => ({ ...prev, [type]: null }));
      onChange({ ...data, [type]: null });
      return;
    }

    // Validate file type depending on the field
    if (type === 'selfie') {
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        setError('Selfie must be a JPG or PNG image.');
        return;
      }
    } else {
      if (!ALLOWED_DOC_TYPES.includes(file.type)) {
        setError('Invalid file type. Allowed: PDF, JPG, PNG');
        return;
      }
    }

    if (file.size > MAX_FILE_SIZE) {
      setError('File too large. Max size is 10 MB');
      return;
    }

    setFiles(prev => ({ ...prev, [type]: file }));
    onChange({ ...data, [type]: file });
  };

  const FileUploadBox = ({ label, type, accept }: { label: string; type: string; accept: string }) => (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition-colors">
      <div className="flex items-center justify-center mb-3">
        <h3 className="text-sm font-semibold text-gray-800">{label}</h3>
        <span className="text-red-500 ml-1">*</span>
      </div>
      <input
        type="file"
        accept={accept}
        onChange={(e) => handleFileUpload(type, e.target.files?.[0] || null)}
        className="hidden"
        id={`file-${type}`}
        required
      />
      <label htmlFor={`file-${type}`} className="cursor-pointer">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        <div className="text-xs text-gray-500">Click to upload or drag and drop</div>
        {files[type as keyof typeof files] && (
          <div className="mt-2 text-xs text-green-600 font-medium">
            ✓ {files[type as keyof typeof files]?.name}
          </div>
        )}
      </label>
    </div>
  );

  const isComplete = files.id && files.cac && files.selfie;

  const handleNext = () => {
    if (!isComplete) {
      setError('Please upload all required documents to continue.');
      return false;
    }
    setError(null);
    onChange({ ...data, verificationComplete: true });
    return true;
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Identity Verification</h2>
        <p className="text-gray-600">Upload your identification documents to verify your identity. This helps build trust with potential clients.</p>
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
        <div className="rounded-md bg-red-50 border border-red-200 p-3 mt-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center mt-0.5">
            <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-medium text-amber-800">Verification Status: Pending Approval</h3>
            <p className="text-sm text-amber-700 mt-1">
              Your documents will be reviewed within 24-48 hours. You'll receive an email notification once approved.
            </p>
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-amber-700 mb-1">
                <span>Verification Progress</span>
                <span>{Object.values(files).filter(Boolean).length}/3 Complete</span>
              </div>
              <div className="w-full bg-amber-200 rounded-full h-2">
                <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${(Object.values(files).filter(Boolean).length / 3) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleNext}
          disabled={!isComplete}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
            isComplete
              ? 'bg-green-600 text-white hover:bg-green-700 cursor-pointer'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Continue to Next Step
        </button>
      </div>
    </div>
  );
};

export default IdentityVerification;
