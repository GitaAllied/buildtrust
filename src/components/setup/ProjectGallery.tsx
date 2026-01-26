import { useState, useRef, useEffect } from "react";

interface FileMetadata {
  name: string;
  size: number;
  type: string;
}

interface Project {
  id: string;
  title: string;
  type: string;
  location: string;
  budget: string;
  description: string;
  media: File[];
  mediaMetadata?: FileMetadata[];
}

interface ProjectGalleryProps {
  data: Project[];
  onChange: (data: Project[]) => void;
}

const PROJECTS_STORAGE_KEY = 'buildtrust_projects_gallery';

const ProjectCard = ({ 
  project, 
  onUpdate, 
  onRemove,
  showRemoveButton = true
}: { 
  project: Project;
  onUpdate: (id: string, field: string, value: any) => void;
  onRemove: (id: string) => void;
  showRemoveButton?: boolean;
}) => {
  const mediaInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="border border-gray-200 rounded-lg p-6 space-y-4">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-medium text-gray-900">Project Details</h3>
        {showRemoveButton && (
          <button
            onClick={() => onRemove(project.id)}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Project Title *</label>
          <input
            type="text"
            value={project.title}
            onChange={(e) => onUpdate(project.id, 'title', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#253E44]/50 focus:border-transparent"
            placeholder="e.g., Luxury Villa Development"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Project Type *</label>
          <select
            value={project.type}
            onChange={(e) => onUpdate(project.id, 'type', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#253E44]/50 focus:border-transparent"
          >
            <option value="">Select type</option>
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
            <option value="mixed-use">Mixed Use</option>
            <option value="industrial">Industrial</option>
            <option value="renovation">Renovation</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
          <input
            type="text"
            value={project.location}
            onChange={(e) => onUpdate(project.id, 'location', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#253E44]/50 focus:border-transparent"
            placeholder="e.g., Victoria Island, Lagos"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Budget Range *</label>
          <select
            value={project.budget}
            onChange={(e) => onUpdate(project.id, 'budget', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#253E44]/50 focus:border-transparent"
          >
            <option value="">Select budget range</option>
            <option value="under-50m">Under ₦50M</option>
            <option value="50m-100m">₦50M - ₦100M</option>
            <option value="100m-500m">₦100M - ₦500M</option>
            <option value="500m-1b">₦500M - ₦1B</option>
            <option value="over-1b">Over ₦1B</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Project Description *</label>
        <textarea
          value={project.description}
          onChange={(e) => onUpdate(project.id, 'description', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#253E44]/50 focus:border-transparent"
          placeholder="Describe the project scope, challenges overcome, and your role..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Media Upload (Photos & Videos)</label>
        <div 
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#253E44]/50 transition-colors cursor-pointer"
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
            e.currentTarget.classList.add('border-[#253E44]/50', 'bg-[#253E44]/5');
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            e.stopPropagation();
            e.currentTarget.classList.remove('border-[#253E44]/50', 'bg-[#253E44]/5');
          }}
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
            e.currentTarget.classList.remove('border-[#253E44]/50', 'bg-[#253E44]/5');
            const files = Array.from(e.dataTransfer.files || []);
            onUpdate(project.id, 'media', files);
          }}
        >
          <input
            ref={mediaInputRef}
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={(e) => {
              const files = Array.from(e.target.files || []);
              onUpdate(project.id, 'media', files);
            }}
            className="hidden"
            id={`media-${project.id}`}
            aria-label="Upload media files"
          />
          <label htmlFor={`media-${project.id}`} className="cursor-pointer block">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div className="text-sm font-medium text-gray-900">Upload Project Media</div>
            <div className="text-xs text-gray-500 mt-1">Click to select or drag files - JPG, PNG, MP4 up to 10MB each</div>
          </label>
        </div>

        {project.media && project.media.length > 0 && (
          <div className="mt-4 p-4 bg-[#253E44]/5 rounded-lg">
            <div className="text-sm font-medium text-[#253E44] mb-2">
              ✓ {project.media.length} file(s) uploaded
            </div>
            <div className="space-y-1">
              {project.media.map((file: any, idx: number) => (
                <div key={idx} className="text-xs text-gray-600 flex items-center">
                  <svg className="w-3 h-3 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {file instanceof File ? file.name : 'File'}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ProjectGallery = ({ data, onChange }: ProjectGalleryProps) => {
  const fileStoreRef = useRef<{ [key: string]: File }>({});
  const lastSavedRef = useRef<string>('');
  const isInitializedRef = useRef(false);

  const [projects, setProjects] = useState<Project[]>(() => {
    // First, try to use the data prop if provided
    if (Array.isArray(data) && data.length > 0) {
      isInitializedRef.current = true;
      return data.map(p => ({
        ...p,
        media: p.media || [],
        mediaMetadata: p.mediaMetadata || []
      }));
    }

    // Fall back to localStorage
    const savedData = localStorage.getItem(PROJECTS_STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (Array.isArray(parsed) && parsed.length > 0) {
          isInitializedRef.current = true;
          return parsed.map(p => ({
            id: p.id,
            title: p.title,
            type: p.type,
            location: p.location,
            budget: p.budget,
            description: p.description,
            media: [], // File objects can't be persisted, will be re-uploaded if needed
            mediaMetadata: p.mediaMetadata || []
          }));
        }
      } catch (e) {
        console.error('Failed to load projects from localStorage');
      }
    }
    
    return [{
      id: Date.now().toString(),
      title: '',
      type: '',
      location: '',
      budget: '',
      description: '',
      media: [],
      mediaMetadata: []
    }];
  });

  // Save to localStorage whenever projects change
  useEffect(() => {
    const dataToSave = projects.map(p => ({
      id: p.id,
      title: p.title,
      type: p.type,
      location: p.location,
      budget: p.budget,
      description: p.description,
      mediaMetadata: p.mediaMetadata || []
    }));
    console.log('💾 [ProjectGallery] Saving to localStorage:', {
      projectCount: projects.length,
      projects: dataToSave.map(p => ({
        title: p.title,
        type: p.type,
        location: p.location,
        budget: p.budget,
        mediaCount: p.mediaMetadata?.length || 0
      }))
    });
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(dataToSave));
  }, [projects]);

  // Notify parent immediately on mount if we have data
  useEffect(() => {
    if (isInitializedRef.current) {
      onChange(projects);
      isInitializedRef.current = false; // Only notify once on mount
    }
  }, []);

  // Notify parent of changes when data is modified
  useEffect(() => {
    const serialized = JSON.stringify(projects);
    if (lastSavedRef.current !== serialized) {
      lastSavedRef.current = serialized;
      onChange(projects);
    }
  }, [projects, onChange]);

  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      title: '',
      type: '',
      location: '',
      budget: '',
      description: '',
      media: [],
      mediaMetadata: []
    };
    setProjects(prev => [...prev, newProject]);
  };

  const updateProject = (id: string, field: string, value: any) => {
    setProjects(prev => prev.map(project => {
      if (project.id === id) {
        const updated = { ...project, [field]: value };
        
        // Handle media files with metadata
        if (field === 'media' && Array.isArray(value)) {
          const mediaFiles = value as File[];
          const metadata: FileMetadata[] = mediaFiles.map(f => ({
            name: f.name,
            size: f.size,
            type: f.type
          }));
          
          // Store actual files in memory for backend upload
          mediaFiles.forEach(file => {
            const key = `${id}-${file.name}-${file.lastModified}`;
            fileStoreRef.current[key] = file;
          });
          
          updated.mediaMetadata = metadata;
        }
        
        return updated;
      }
      return project;
    }));
  };

  const removeProject = (id: string) => {
    setProjects(prev => prev.filter(project => project.id !== id));
  };

  // Check if at least one project has any data filled
  const isAtLeastOneProjectFilled = projects.some(project => 
    project.title?.trim().length > 0 ||
    project.type?.length > 0 ||
    project.location?.trim().length > 0 ||
    project.budget?.length > 0 ||
    project.description?.trim().length > 0 ||
    (project.media && project.media.length > 0)
  );

  const isContinueEnabled = isAtLeastOneProjectFilled;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Project Portfolio</h2>
        <p className="text-gray-600">Showcase your best work to attract potential clients. Include photos, videos, and detailed descriptions.</p>
      </div>

      {/* Default First Project - Always Show */}
      <div className="space-y-4">
        <ProjectCard 
          project={projects[0]}
          onUpdate={updateProject}
          onRemove={() => {}} 
          showRemoveButton={false}
        />
      </div>

      {/* Additional Projects */}
      {projects.length > 1 && (
        <div className="space-y-4 border-t pt-6">
          <h3 className="text-md font-medium text-gray-900">Additional Projects</h3>
          {projects.slice(1).map((project) => (
            <ProjectCard 
              key={project.id} 
              project={project}
              onUpdate={updateProject}
              onRemove={removeProject}
              showRemoveButton={true}
            />
          ))}
        </div>
      )}

      {/* Add Another Project Button */}
      <button
        onClick={addProject}
        className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#253E44]/50 hover:bg-[#253E44]/5 transition-colors group"
      >
        <div className="w-12 h-12 bg-gray-100 group-hover:bg-[#253E44]/10 rounded-full flex items-center justify-center mx-auto mb-3 transition-colors">
          <svg className="w-6 h-6 text-gray-400 group-hover:text-[#253E44]/60 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <div className="text-lg font-medium text-gray-900 group-hover:text-[#253E44]/60 transition-colors">Add Another Project</div>
        <div className="text-sm text-gray-500">Showcase more of your work (optional)</div>
      </button>


    </div>
  );
};

export default ProjectGallery;
