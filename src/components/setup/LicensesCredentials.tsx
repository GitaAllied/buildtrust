import { useState, useEffect, useRef } from "react";

interface FileMetadata {
  name: string;
  size: number;
  type: string;
}

interface CredentialsData {
  licenses: File[];
  certifications: File[];
  testimonials: File[];
  fileMetadata?: {
    licenses: FileMetadata[];
    certifications: FileMetadata[];
    testimonials: FileMetadata[];
  };
}

interface LicensesCredentialsProps {
  data: any;
  onChange: (data: any) => void;
}

const CREDENTIALS_STORAGE_KEY = 'buildtrust_licenses_credentials';

const LicensesCredentials = ({ data, onChange }: LicensesCredentialsProps) => {
  const fileStoreRef = useRef<{ [key: string]: File }>({});
  const lastSavedRef = useRef<string>('');
  const isInitializedRef = useRef(false);
  
  const [files, setFiles] = useState<CredentialsData>(() => {
    // First, try to use the data prop if provided
    if (data && typeof data === 'object') {
      isInitializedRef.current = true;
      return {
        licenses: data.licenses || [],
        certifications: data.certifications || [],
        testimonials: data.testimonials || [],
        fileMetadata: data.fileMetadata || {
          licenses: [],
          certifications: [],
          testimonials: []
        }
      };
    }

    // Fall back to localStorage
    const savedMetadata = localStorage.getItem(CREDENTIALS_STORAGE_KEY);
    if (savedMetadata) {
      try {
        const metadata = JSON.parse(savedMetadata);
        isInitializedRef.current = true;
        return {
          licenses: [],
          certifications: [],
          testimonials: [],
          fileMetadata: metadata
        };
      } catch (e) {
        console.error('Failed to load credentials data from localStorage');
      }
    }
    
    return {
      licenses: [],
      certifications: [],
      testimonials: [],
      fileMetadata: {
        licenses: [],
        certifications: [],
        testimonials: []
      }
    };
  });
  
  const [error, setError] = useState<string | null>(null);

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
  const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Notify parent immediately on mount if we have data
  useEffect(() => {
    if (isInitializedRef.current) {
      onChange(files);
      isInitializedRef.current = false; // Only notify once on mount
    }
  }, []);

  // Save metadata to localStorage whenever files change
  useEffect(() => {
    if (files.fileMetadata) {
      console.log('💾 [LicensesCredentials] Saving to localStorage:', {
        licenses: files.fileMetadata.licenses.map(f => ({ name: f.name, size: f.size })),
        certifications: files.fileMetadata.certifications.map(f => ({ name: f.name, size: f.size })),
        testimonials: files.fileMetadata.testimonials.map(f => ({ name: f.name, size: f.size }))
      });
      localStorage.setItem(CREDENTIALS_STORAGE_KEY, JSON.stringify(files.fileMetadata));
    }
  }, [files.fileMetadata]);

  // Notify parent of changes when data is modified
  useEffect(() => {
    const serialized = JSON.stringify(files);
    if (lastSavedRef.current !== serialized) {
      lastSavedRef.current = serialized;
      onChange(files);
    }
  }, [files, onChange]);

  const handleFileUpload = (type: string, fileList: FileList | null) => {
    setError(null);
    
    if (!fileList || fileList.length === 0) {
      return;
    }

    const incoming = Array.from(fileList);
    const valid: File[] = [];
    const newMetadata: FileMetadata[] = [];

    for (const f of incoming) {
      if (!ALLOWED_TYPES.includes(f.type)) {
        setError(`Invalid file type for ${f.name}. Allowed: PDF, JPG, PNG`);
        continue;
      }
      
      if (f.size > MAX_FILE_SIZE) {
        setError(`File ${f.name} is too large. Max size is 10 MB`);
        continue;
      }
      
      valid.push(f);
      newMetadata.push({
        name: f.name,
        size: f.size,
        type: f.type
      });
      
      // Store actual files in memory for backend upload
      const fileKey = `${type}-${f.name}-${f.lastModified}`;
      fileStoreRef.current[fileKey] = f;
    }

    if (valid.length > 0) {
      setFiles(prev => {
        const typeKey = type as keyof CredentialsData;
        const currentMetadata = prev.fileMetadata || { licenses: [], certifications: [], testimonials: [] };
        
        return {
          ...prev,
          [type]: [...(prev[typeKey] as File[]), ...valid],
          fileMetadata: {
            ...currentMetadata,
            [type]: [...(currentMetadata[typeKey as keyof typeof currentMetadata] || []), ...newMetadata]
          }
        };
      });
    }
  };

  const removeFile = (type: string, index: number) => {
    setFiles(prev => {
      const typeKey = type as keyof CredentialsData;
      const currentMetadata = prev.fileMetadata || { licenses: [], certifications: [], testimonials: [] };
      
      return {
        ...prev,
        [type]: (prev[typeKey] as File[]).filter((_: any, i: number) => i !== index),
        fileMetadata: {
          ...currentMetadata,
          [type]: (currentMetadata[typeKey as keyof typeof currentMetadata] || []).filter((_: any, i: number) => i !== index)
        }
      };
    });
  };

  // Render file upload section
  const renderUploadSection = (
    title: string,
    description: string,
    type: 'licenses' | 'certifications' | 'testimonials',
    examples: string[]
  ) => {
    const sectionFiles = files[type] as File[];
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
      handleFileUpload(type, e.dataTransfer.files);
    };

    return (
      <div key={type} className="space-y-4">
        <div>
          <div className="flex items-center mb-2">
            <h3 className="text-sm font-medium text-gray-900">{title}</h3>
            <span className="text-red-500 ml-1">*</span>
          </div>
          <p className="text-gray-600 text-xs mt-1">{description}</p>
        </div>

        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#253E44]/60 transition-colors cursor-pointer"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <label htmlFor={inputId} className="cursor-pointer block w-full">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <div className="text-sm font-medium text-gray-900 mb-1">Upload Documents</div>
            <div className="text-xs text-gray-500">Click to upload or drag and drop</div>
            <div className="text-xs text-gray-400 mt-1">PDF, JPG, PNG up to 10MB each</div>
          </label>
          <input
            id={inputId}
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => {
              handleFileUpload(type, e.target.files);
            }}
            className="hidden"
            aria-label={`Upload ${title}`}
          />
        </div>

        {sectionFiles.length > 0 && (
          <div className="space-y-2">
            {sectionFiles.map((file: File, index: number) => (
              <div key={`${type}-${index}`} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className="w-8 h-8 bg-[#253E44]/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-[#253E44]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-gray-900 truncate">{file.name}</div>
                    <div className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(type, index)}
                  type="button"
                  className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0 ml-2"
                  aria-label={`Remove ${file.name}`}
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
  };

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

      <div className="space-y-8 md:space-y-0 md:grid md:grid-cols-3 md:gap-6">
        {renderUploadSection(
          "Professional Licenses",
          "Upload your development licenses, permits, and regulatory certifications to verify your professional qualifications",
          "licenses",
          ["Building permits", "Development licenses", "Professional registrations"]
        )}

        {renderUploadSection(
          "Certifications & Awards",
          "Showcase your professional certifications, industry awards, and achievements",
          "certifications",
          ["Project management certifications", "Industry awards", "Training certificates"]
        )}

        {renderUploadSection(
          "Client Testimonials & Letters",
          "Share testimonials, recommendation letters, and positive feedback from previous clients",
          "testimonials",
          ["Client recommendation letters", "Project completion certificates", "Testimonial documents"]
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
            <h3 className="text-sm font-medium text-[#253E44]/80">Verification Process</h3>
            <p className="text-sm text-[#253E44]/70 mt-1">
              All uploaded documents will be verified by our team. Verified credentials will be displayed with a badge on your profile.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LicensesCredentials;