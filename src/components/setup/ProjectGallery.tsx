
import { useState, useRef, useEffect } from "react";

interface Project {
  id: string;
  title: string;
  type: string;
  location: string;
  budget: string;
  description: string;
  media: File[];
}

interface ProjectGalleryProps {
  data: Project[];
  onChange: (data: Project[]) => void;
}

const ProjectGallery = ({ data, onChange }: ProjectGalleryProps) => {
  const [projects, setProjects] = useState<Project[]>(data);
  const mediaInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      title: '',
      type: '',
      location: '',
      budget: '',
      description: '',
      media: []
    };
    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    onChange(updatedProjects);
  };

  const updateProject = (id: string, field: string, value: any) => {
    const updatedProjects = projects.map(project => 
      project.id === id ? { ...project, [field]: value } : project
    );
    setProjects(updatedProjects);
    onChange(updatedProjects);
  };

  const removeProject = (id: string) => {
    const updatedProjects = projects.filter(project => project.id !== id);
    setProjects(updatedProjects);
    onChange(updatedProjects);
  };

  const ProjectCard = ({ project }: { project: Project }) => (
    <div className="border border-gray-200 rounded-lg p-6 space-y-4">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-medium text-gray-900">Project Details</h3>
        <button
          onClick={() => removeProject(project.id)}
          className="text-gray-400 hover:text-red-500 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Project Title</label>
          <input
            type="text"
            value={project.title}
            onChange={(e) => updateProject(project.id, 'title', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#253E44]/50 focus:border-transparent"
            placeholder="e.g., Luxury Villa Development"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Project Type</label>
          <select
            value={project.type}
            onChange={(e) => updateProject(project.id, 'type', e.target.value)}
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <input
            type="text"
            value={project.location}
            onChange={(e) => updateProject(project.id, 'location', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#253E44]/50 focus:border-transparent"
            placeholder="e.g., Victoria Island, Lagos"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Budget Range</label>
          <select
            value={project.budget}
            onChange={(e) => updateProject(project.id, 'budget', e.target.value)}
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
        <label className="block text-sm font-medium text-gray-700 mb-1">Project Description</label>
        <textarea
          value={project.description}
          onChange={(e) => updateProject(project.id, 'description', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#253E44]/50 focus:border-transparent"
          placeholder="Describe the project scope, challenges overcome, and your role..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Media Upload</label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[#253E44]/50 transition-colors">
          <input
            ref={(el) => {
              if (el) mediaInputRefs.current[project.id] = el;
            }}
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={(e) => {
              console.log(`Media files selected for project ${project.id}:`, e.target.files);
              const files = Array.from(e.target.files || []);
              updateProject(project.id, 'media', files);
            }}
            className="hidden"
            id={`media-${project.id}`}
            aria-label="Upload media files"
          />
          <label htmlFor={`media-${project.id}`} className="cursor-pointer block">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div className="text-sm text-gray-600">Upload photos and videos</div>
            <div className="text-xs text-gray-400">JPG, PNG, MP4 up to 10MB each</div>
          </label>
        </div>
        {project.media && project.media.length > 0 && (
          <div className="mt-2">
            <div className="text-sm text-[#253E44]/60">
              {project.media.length} file(s) selected
            </div>
            <div className="mt-2 space-y-1">
              {project.media.map((file: any, idx: number) => (
                <div key={idx} className="text-xs text-gray-600">
                  {file instanceof File ? file.name : 'File'}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Project Portfolio</h2>
        <p className="text-gray-600">Showcase your best work to attract potential clients. Include photos, videos, and detailed descriptions.</p>
      </div>

      <div className="space-y-6">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

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
        <div className="text-sm text-gray-500">Showcase more of your work</div>
      </button>
    </div>
  );
};

export default ProjectGallery;
