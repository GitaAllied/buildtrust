
import { useState } from "react";

interface LicensesCredentialsProps {
  data: any;
  onChange: (data: any) => void;
}

const LicensesCredentials = ({ data, onChange }: LicensesCredentialsProps) => {
  const [files, setFiles] = useState({
    licenses: [] as File[],
    certifications: [] as File[],
    testimonials: [] as File[],
    ...data
  });
  const [error, setError] = useState<string | null>(null);

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
  const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];

  const handleFileUpload = (type: string, fileList: FileList | null) => {
    setError(null);
    if (fileList) {
      const incoming = Array.from(fileList);
      const valid: File[] = [];
      for (const f of incoming) {
        if (!ALLOWED_TYPES.includes(f.type)) {
          setError('Invalid file type. Allowed: PDF, JPG, PNG');
          continue;
        }
        if (f.size > MAX_FILE_SIZE) {
          setError('File too large. Max size is 10 MB');
          continue;
        }
        valid.push(f);
      }
      if (valid.length > 0) {
        const updatedFiles = { ...files, [type]: [...files[type as keyof typeof files], ...valid] };
        setFiles(updatedFiles);
        onChange(updatedFiles);
      }
    }
  };

  const removeFile = (type: string, index: number) => {
    const updatedFiles = {
      ...files,
      [type]: files[type as keyof typeof files].filter((_: any, i: number) => i !== index)
    };
    setFiles(updatedFiles);
    onChange(updatedFiles);
  };

  const UploadSection = ({ 
    title, 
    description, 
    type, 
    accept = "image/*,.pdf",
    examples 
  }: { 
    title: string; 
    description: string; 
    type: string; 
    accept?: string;
    examples: string[];
  }) => (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-3">{description}</p>
        <div className="text-xs text-gray-500">
          Examples: {examples.join(", ")}
        </div>
      </div>

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition-colors">
        <input
          type="file"
          multiple
          accept={accept}
          onChange={(e) => handleFileUpload(type, e.target.files)}
          className="hidden"
          id={`upload-${type}`}
        />
        <label htmlFor={`upload-${type}`} className="cursor-pointer">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <div className="text-sm font-medium text-gray-900 mb-1">Upload Documents</div>
          <div className="text-xs text-gray-500">Click to upload or drag and drop</div>
          <div className="text-xs text-gray-400 mt-1">PDF, JPG, PNG up to 10MB each</div>
        </label>
      </div>

      {files[type as keyof typeof files].length > 0 && (
        <div className="space-y-2">
          {files[type as keyof typeof files].map((file: File, index: number) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">{file.name}</div>
                  <div className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                </div>
              </div>
              <button
                onClick={() => removeFile(type, index)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Licenses & Credentials</h2>
        <p className="text-gray-600">Upload your professional certifications and credentials to build trust with potential clients.</p>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <UploadSection
        title="Professional Licenses"
        description="Upload your development licenses, permits, and regulatory certifications"
        type="licenses"
        examples={["Building permits", "Development licenses", "Professional registrations"]}
      />

      <UploadSection
        title="Certifications & Awards"
        description="Showcase your professional certifications, industry awards, and achievements"
        type="certifications"
        examples={["Project management certifications", "Industry awards", "Training certificates"]}
      />

      <UploadSection
        title="Client Testimonials & Letters"
        description="Share testimonials, recommendation letters, and positive feedback from previous clients"
        type="testimonials"
        examples={["Client recommendation letters", "Project completion certificates", "Testimonial documents"]}
      />

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-medium text-blue-800">Verification Process</h3>
            <p className="text-sm text-blue-700 mt-1">
              All uploaded documents will be verified by our team. Verified credentials will be displayed with a badge on your profile.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LicensesCredentials;
