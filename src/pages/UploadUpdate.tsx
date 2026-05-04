import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { Upload, Camera, Video, FileText, Menu, X } from "lucide-react";
import Logo from "../assets/Logo.png";
import { apiClient } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import SignoutModal from "@/components/ui/signoutModal";
import DeveloperSidebar from "@/components/DeveloperSidebar";
import { useDispatch, useSelector } from "react-redux";
import { openDeveloperSidebar, openSignoutModal } from "@/redux/action";

const UploadUpdate = () => {
  const [selectedProject, setSelectedProject] = useState("");
  const [milestone, setMilestone] = useState("");
  const [description, setDescription] = useState("");
  const [projects, setProjects] = useState<any[]>([]);
  const [drafts, setDrafts] = useState<any[]>([]);
  const [projectUploads, setProjectUploads] = useState<any[]>([]);
  const [isLoadingUploads, setIsLoadingUploads] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isOpen = useSelector((state: any) => state.sidebar.developerSidebar);
  const signOutModal = useSelector((state: any) => state.signout);
  const { toast } = useToast();

  const API_BASE = import.meta.env.VITE_API_URL ?? '/api';
  const API_ORIGIN = API_BASE === '/api' ? window.location.origin : API_BASE.replace(/\/api$/, '');

  const resolveMediaUrl = (url: string) => {
    if (!url) return url;
    if (url.startsWith('http')) return url;
    return url.startsWith('/') ? `${API_ORIGIN}${url}` : `${API_ORIGIN}/${url}`;
  };

  const isSignatureMedia = (upload: any) => {
    const filename = String(upload.filename || '').toLowerCase();
    const type = String(upload.type || '').toLowerCase();
    return filename.includes('signature') || type.includes('signature');
  };

  const getUploadTypeLabel = (upload: any) => {
    const mime = String(upload.mime_type || upload.type || '').toLowerCase();
    const filename = String(upload.filename || upload.url || '').toLowerCase();

    if (mime.includes('image') || /\.(jpg|jpeg|png|gif)$/i.test(filename)) return 'Image';
    if (mime.includes('video') || /\.(mp4|mov|avi)$/i.test(filename)) return 'Video';
    if (mime.includes('pdf') || /\.pdf$/i.test(filename)) return 'PDF';
    if (mime.includes('word') || /\.(doc|docx)$/i.test(filename)) return 'Document';
    return 'File';
  };

  useEffect(() => {
    const loadDeveloperProjects = async () => {
      try {
        const response = await apiClient.getDeveloperActiveProjects();
        const projectsData = response?.projects || response || [];
        setProjects(Array.isArray(projectsData) ? projectsData : []);
      } catch (error) {
        console.error('Unable to load active projects', error);
        toast({
          title: 'Could not load active projects',
          description: 'Please refresh the page or try again later.',
          variant: 'destructive',
        });
      }
    };

    const loadDrafts = () => {
      const stored = localStorage.getItem('upload_update_drafts');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setDrafts(Array.isArray(parsed) ? parsed : []);
        } catch (error) {
          console.warn('Could not parse saved drafts', error);
        }
      }
    };

    loadDeveloperProjects();
    loadDrafts();
  }, []);

  useEffect(() => {
    const loadProjectUploads = async () => {
      if (!selectedProject) {
        setProjectUploads([]);
        return;
      }

      setIsLoadingUploads(true);

      try {
        const response = await apiClient.getProjectMedia(Number(selectedProject));
        const uploads = response?.media || response?.project_media || response || [];
        setProjectUploads(Array.isArray(uploads) ? uploads : []);
      } catch (error) {
        console.error('Unable to load project uploads', error);
        setProjectUploads([]);
      } finally {
        setIsLoadingUploads(false);
      }
    };

    loadProjectUploads();
  }, [selectedProject]);

  // File states
  const [photos, setPhotos] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);
  const [documents, setDocuments] = useState<File[]>([]);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "photos" | "videos" | "documents",
  ) => {
    const files = Array.from(e.target.files || []);

    if (type === "photos") {
      setPhotos((prev) => [...prev, ...files]);
    } else if (type === "videos") {
      setVideos((prev) => [...prev, ...files]);
    } else {
      setDocuments((prev) => [...prev, ...files]);
    }

    e.target.value = "";
  };

  const removeFile = (
    index: number,
    type: "photos" | "videos" | "documents",
  ) => {
    if (type === "photos") {
      setPhotos((prev) => prev.filter((_, i) => i !== index));
    } else if (type === "videos") {
      setVideos((prev) => prev.filter((_, i) => i !== index));
    } else {
      setDocuments((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleSaveDraft = () => {
    const projectId = Number(selectedProject);
    if (!projectId) {
      toast({
        title: 'Select a project',
        description: 'Choose a project before saving a draft.',
        variant: 'destructive',
      });
      return;
    }

    const projectName = projects.find((project) => String(project.id) === String(projectId))?.title || `Project #${projectId}`;
    const newDraft = {
      id: Date.now(),
      projectId,
      projectName,
      milestone,
      description,
      photoCount: photos.length,
      videoCount: videos.length,
      documentCount: documents.length,
      createdAt: new Date().toISOString(),
    };

    const updatedDrafts = [newDraft, ...drafts];
    setDrafts(updatedDrafts);
    localStorage.setItem('upload_update_drafts', JSON.stringify(updatedDrafts));

    toast({
      title: 'Draft saved',
      description: 'Your update draft was saved successfully.',
    });
  };

  const handleLoadDraft = (draft: any) => {
    setSelectedProject(String(draft.projectId));
    setMilestone(draft.milestone || '');
    setDescription(draft.description || '');
    toast({
      title: 'Draft loaded',
      description: 'Draft content has been loaded into the form.',
    });
  };

  const handleSubmit = async () => {
    const projectId = Number(selectedProject);
    if (!projectId) {
      toast({
        title: 'Select a project',
        description: 'Please choose an assigned project before submitting an update.',
        variant: 'destructive',
      });
      return;
    }

    if (!milestone.trim()) {
      toast({
        title: 'Add milestone details',
        description: 'Please enter the milestone or phase name for this update.',
        variant: 'destructive',
      });
      return;
    }

    if (!description.trim()) {
      toast({
        title: 'Add a description',
        description: 'Please describe the work completed and next steps.',
        variant: 'destructive',
      });
      return;
    }

    const files = [...photos, ...videos, ...documents];
    if (files.length === 0) {
      toast({
        title: 'Upload at least one file',
        description: 'Please attach photos, videos, or documents with your update.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      for (const file of files) {
        await apiClient.uploadProjectMedia(projectId, file);
      }

      toast({
        title: 'Update submitted',
        description: 'Your project media was uploaded successfully.',
      });
      setPhotos([]);
      setVideos([]);
      setDocuments([]);
      setMilestone('');
      setDescription('');
      setSelectedProject('');
    } catch (error) {
      console.error('Project update upload failed', error);
      toast({
        title: 'Upload failed',
        description: 'There was a problem uploading your files. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#226F75]/10 flex flex-col md:flex-row">
      {/* Mobile Menu Button */}
      <div className="md:hidden bg-white/95 backdrop-blur-md border-b border-white/20 px-3 py-2 sm:px-4 sm:py-3 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-2 w-[20%]">
          <Link to={"/"}>
            <img src={Logo} alt="" />
          </Link>
        </div>
        <button
          onClick={() => dispatch(openDeveloperSidebar(!isOpen))}
          className="p-1.5 sm:p-2 hover:bg-[#226F75]/10 rounded-lg transition-colors"
        >
          {isOpen ? (
            <X className="h-5 w-5 text-[#226F75]" />
          ) : (
            <Menu className="h-5 w-5 text-[#226F75]" />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <DeveloperSidebar active={"upload"} />

      <div className="flex-1 md:pl-64 w-full min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white/95 backdrop-blur-md border-b border-white/20 sticky top-12 md:top-0 z-30 shadow-sm p-3 sm:p-4 md:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
              <div className="min-w-0">
                <h1 className="text-base sm:text-lg md:text-2xl font-bold text-gray-900 truncate">
                  Upload Progress Update
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 truncate">
                  Share project progress with your clients
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-3 sm:p-4 md:p-6 max-w-4xl mx-auto">
          <Card>
            <CardHeader className="px-3 sm:px-4 md:px-6 pt-4 sm:pt-5 md:pt-6 pb-3">
              <CardTitle className="flex items-center text-xs sm:text-sm md:text-base gap-2">
                <Camera className="h-4 w-4 sm:h-5 sm:w-5" />
                Project Progress Update
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6 px-3 sm:px-4 md:px-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <Label htmlFor="project" className="text-xs sm:text-sm">
                    Select Project
                  </Label>
                  <select
                    id="project"
                    value={selectedProject}
                    onChange={(e) => setSelectedProject(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#226F75]/50 text-xs sm:text-sm h-9"
                  >
                    <option value="">Choose a project...</option>
                    {projects.map((project) => (
                      <option key={project.id} value={String(project.id)}>
                        {project.title || project.name || `Project #${project.id}`}
                      </option>
                    ))}
                  </select>
                  {projects.length === 0 && (
                    <p className="mt-2 text-xs text-red-600">
                      You currently have no active projects available for upload.
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="milestone" className="text-xs sm:text-sm">
                    Milestone/Phase
                  </Label>
                  <Input
                    id="milestone"
                    placeholder="e.g., Foundation Complete, Roofing Started"
                    value={milestone}
                    onChange={(e) => setMilestone(e.target.value)}
                    className="text-xs sm:text-sm h-9"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description" className="text-xs sm:text-sm">
                  Progress Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe the completed work, any challenges, and next steps..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="text-xs sm:text-sm"
                />
              </div>

              <div className="space-y-3 sm:space-y-4">
                <Label className="text-xs sm:text-sm">Upload Media</Label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
                  {/* Photos Upload */}
                  <Card
                    className="border-dashed border-2 border-gray-300 hover:border-[#253E44]/50 transition-colors cursor-pointer"
                    onClick={() =>
                      document.getElementById("photos-input")?.click()
                    }
                  >
                    <CardContent className="p-4 sm:p-6 text-center">
                      <Camera className="h-6 w-6 sm:h-8 sm:w-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-xs sm:text-sm text-gray-600">
                        Upload Photos
                      </p>
                      <p className="text-xs text-gray-400">
                        JPG, PNG up to 10MB
                      </p>
                      {photos.length > 0 && (
                        <p className="text-xs text-[#226F75] font-semibold mt-2">
                          {photos.length} file(s) selected
                        </p>
                      )}
                    </CardContent>
                  </Card>
                  <input
                    id="photos-input"
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/jpg"
                    onChange={(e) => handleFileChange(e, "photos")}
                    className="hidden"
                  />

                  {/* Videos Upload */}
                  <Card
                    className="border-dashed border-2 border-gray-300 hover:border-[#253E44]/50 transition-colors cursor-pointer"
                    onClick={() =>
                      document.getElementById("videos-input")?.click()
                    }
                  >
                    <CardContent className="p-4 sm:p-6 text-center">
                      <Video className="h-6 w-6 sm:h-8 sm:w-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-xs sm:text-sm text-gray-600">
                        Upload Videos
                      </p>
                      <p className="text-xs text-gray-400">
                        MP4, MOV up to 50MB
                      </p>
                      {videos.length > 0 && (
                        <p className="text-xs text-[#226F75] font-semibold mt-2">
                          {videos.length} file(s) selected
                        </p>
                      )}
                    </CardContent>
                  </Card>
                  <input
                    id="videos-input"
                    type="file"
                    multiple
                    accept="video/mp4,video/quicktime,video/x-msvideo"
                    onChange={(e) => handleFileChange(e, "videos")}
                    className="hidden"
                  />

                  {/* Documents Upload */}
                  <Card
                    className="border-dashed border-2 border-gray-300 hover:border-[#253E44]/50 transition-colors cursor-pointer"
                    onClick={() =>
                      document.getElementById("documents-input")?.click()
                    }
                  >
                    <CardContent className="p-4 sm:p-6 text-center">
                      <FileText className="h-6 w-6 sm:h-8 sm:w-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-xs sm:text-sm text-gray-600">
                        Upload Documents
                      </p>
                      <p className="text-xs text-gray-400">
                        PDF, DOC up to 5MB
                      </p>
                      {documents.length > 0 && (
                        <p className="text-xs text-[#226F75] font-semibold mt-2">
                          {documents.length} file(s) selected
                        </p>
                      )}
                    </CardContent>
                  </Card>
                  <input
                    id="documents-input"
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={(e) => handleFileChange(e, "documents")}
                    className="hidden"
                  />
                </div>

                {/* File Lists */}
                {(photos.length > 0 ||
                  videos.length > 0 ||
                  documents.length > 0) && (
                  <div className="space-y-3 pt-2">
                    {photos.length > 0 && (
                      <div className="bg-[#226F75]/10 rounded-lg p-3">
                        <p className="text-xs font-semibold text-gray-700 mb-2">
                          Photos ({photos.length})
                        </p>
                        <div className="space-y-1">
                          {photos.map((file, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between text-xs bg-white rounded px-2 py-1"
                            >
                              <span className="truncate flex-1">
                                {file.name}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeFile(idx, "photos");
                                }}
                                className="text-red-500 hover:text-red-700 ml-2"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {videos.length > 0 && (
                      <div className="bg-[#226F75]/10 rounded-lg p-3">
                        <p className="text-xs font-semibold text-gray-700 mb-2">
                          Videos ({videos.length})
                        </p>
                        <div className="space-y-1">
                          {videos.map((file, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between text-xs bg-white rounded px-2 py-1"
                            >
                              <span className="truncate flex-1">
                                {file.name}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeFile(idx, "videos");
                                }}
                                className="text-red-500 hover:text-red-700 ml-2"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {documents.length > 0 && (
                      <div className="bg-[#226F75]/10 rounded-lg p-3">
                        <p className="text-xs font-semibold text-gray-700 mb-2">
                          Documents ({documents.length})
                        </p>
                        <div className="space-y-1">
                          {documents.map((file, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between text-xs bg-white rounded px-2 py-1"
                            >
                              <span className="truncate flex-1">
                                {file.name}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeFile(idx, "documents");
                                }}
                                className="text-red-500 hover:text-red-700 ml-2"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-3 pt-4 sm:pt-6 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs sm:text-sm w-full sm:w-auto"
                  onClick={() => navigate('/project-requests')}
                >
                  Cancel
                </Button>
                <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs sm:text-sm w-full sm:w-auto"
                    onClick={handleSaveDraft}
                  >
                    Save as Draft
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="bg-[#253E44]/90 hover:bg-[#253E44] text-xs sm:text-sm w-full sm:w-auto"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {isSubmitting ? 'Uploading...' : 'Submit Update'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4 mt-6">
            <Card>
              <CardHeader className="px-3 sm:px-4 md:px-6 pt-4 pb-3">
                <CardTitle className="text-sm sm:text-base">
                  Saved Drafts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 px-3 sm:px-4 md:px-6 pb-4">
                {drafts.length > 0 ? (
                  drafts.map((draft) => (
                    <div
                      key={draft.id}
                      className="border rounded-lg bg-white p-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-gray-900">
                          {draft.projectName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {draft.milestone || 'No milestone specified'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {draft.photoCount} photos, {draft.videoCount} videos, {draft.documentCount} documents
                        </p>
                        <p className="text-xs text-gray-400">
                          Saved {new Date(draft.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleLoadDraft(draft)}
                        >
                          Load
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            const updatedDrafts = drafts.filter((item) => item.id !== draft.id);
                            setDrafts(updatedDrafts);
                            localStorage.setItem('upload_update_drafts', JSON.stringify(updatedDrafts));
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No saved drafts yet.</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="px-3 sm:px-4 md:px-6 pt-4 pb-3">
                <CardTitle className="text-sm sm:text-base">
                  Past Progress Uploads
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 px-3 sm:px-4 md:px-6 pb-4">
                {!selectedProject ? (
                  <p className="text-sm text-gray-500">
                    Select a project to view past uploads.
                  </p>
                ) : isLoadingUploads ? (
                  <p className="text-sm text-gray-500">Loading uploads...</p>
                ) : projectUploads.filter((upload: any) => !isSignatureMedia(upload)).length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                    {projectUploads.filter((upload: any) => !isSignatureMedia(upload)).map((upload: any) => {
                      const label = getUploadTypeLabel(upload);
                      const description = upload.description?.trim();
                      const url = resolveMediaUrl(upload.url || upload.filename || '');

                      return (
                        <div
                          key={upload.id}
                          className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:shadow-lg"
                        >
                          <div className="h-28 overflow-hidden bg-slate-50 text-center text-xs text-gray-500 flex items-center justify-center">
                            {label === 'Image' ? (
                              <img
                                src={url}
                                alt={upload.filename || 'Project media'}
                                className="h-full w-full object-cover"
                              />
                            ) : label === 'Video' ? (
                              <video className="h-full w-full object-cover" muted>
                                <source src={url} type={upload.mime_type || 'video/mp4'} />
                              </video>
                            ) : label === 'PDF' ? (
                              <iframe
                                src={url}
                                title={upload.filename || 'PDF preview'}
                                className="h-full w-full"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-slate-100 text-[10px] uppercase tracking-[0.18em] text-gray-500">
                                {label}
                              </div>
                            )}
                          </div>

                          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/70 px-3 text-center text-white opacity-0 transition-opacity group-hover:opacity-100">
                            <span className="rounded-full bg-white/10 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-white">
                              {label}
                            </span>
                            {description ? (
                              <p className="text-xs leading-5">{description}</p>
                            ) : null}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    This project has no previously uploaded progress files.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      {signOutModal && (
        <SignoutModal
          isOpen={signOutModal}
          onClose={() =>dispatch(openSignoutModal(false))}
        />
      )}
    </div>
  );
};

export default UploadUpdate;
