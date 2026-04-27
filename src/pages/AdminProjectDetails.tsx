import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  DollarSign,
  Calendar,
  User,
  Edit2,
  CheckCircle,
  Clock,
  AlertCircle,
  Loader2,
  Save,
  Trash2,
  Flag,
  CheckSquare,
  Square,
} from "lucide-react";
import { apiClient } from "@/lib/api";
import { FaCloudArrowDown, FaRetweet, FaShare } from "react-icons/fa6";

const AdminProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Format currency with proper locale and decimal places
  const formatCurrency = (amount: number | string) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num || 0);
  };

  // Format file size in human readable format
  const formatFileSize = (bytes: number | undefined) => {
    if (!bytes) return 'Unknown';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  // Handle document download
  const handleDownloadDocument = (doc: any) => {
    if (!doc.url) {
      toast({
        title: "Error",
        description: "Document URL not available",
        variant: "destructive",
      });
      return;
    }

    // Create a temporary link and trigger download
    const link = document.createElement('a');
    link.href = doc.url.startsWith('http') ? doc.url : `http://localhost:3001${doc.url}`;
    link.download = doc.filename || `document-${doc.id}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Success",
      description: `Downloading ${doc.filename || 'document'}...`,
    });
  };

  // Handle PDF export of the entire project details page
  const handleExportPDF = () => {
    try {
      // Load html2pdf library from CDN if not present
      if (!(window as any).html2pdf) {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
        script.async = true;
        script.onload = () => {
          generatePDF();
        };
        script.onerror = () => {
          toast({
            title: "Error",
            description: "Failed to load PDF library",
            variant: "destructive",
          });
        };
        document.head.appendChild(script);
      } else {
        generatePDF();
      }

      function generatePDF() {
        try {
          const html2pdfLib = (window as any).html2pdf;
          
          // Create professional PDF content
          const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="UTF-8">
              <style>
                * {
                  margin: 0;
                  padding: 0;
                  box-sizing: border-box;
                }
                
                body {
                  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                  color: #1f2937;
                  line-height: 1.4;
                  background: white;
                }
                
                .pdf-document {
                  width: 100%;
                  background: white;
                  padding: 20px;
                }
                
                .pdf-header {
                  border-bottom: 3px solid #253E44;
                  padding-bottom: 15px;
                  margin-bottom: 20px;
                  page-break-after: avoid;
                }
                
                .pdf-title {
                  font-size: 26px;
                  font-weight: 700;
                  color: #253E44;
                  margin-bottom: 3px;
                }
                
                .pdf-subtitle {
                  font-size: 10px;
                  color: #6b7280;
                }
                
                .pdf-section {
                  margin-bottom: 18px;
                  page-break-inside: avoid;
                }
                
                .pdf-section-title {
                  font-size: 13px;
                  font-weight: 700;
                  color: #253E44;
                  background: #f3f4f6;
                  padding: 8px 10px;
                  margin-bottom: 10px;
                  border-left: 4px solid #226F75;
                }
                
                .pdf-summary-grid {
                  display: grid;
                  grid-template-columns: 1fr 1fr 1fr;
                  gap: 10px;
                  margin-bottom: 15px;
                }
                
                .pdf-summary-card {
                  background: #f9fafb;
                  border: 1px solid #d1d5db;
                  padding: 10px;
                  border-radius: 4px;
                }
                
                .pdf-card-label {
                  font-size: 9px;
                  font-weight: 600;
                  color: #6b7280;
                  text-transform: uppercase;
                  margin-bottom: 3px;
                  letter-spacing: 0.3px;
                }
                
                .pdf-card-value {
                  font-size: 15px;
                  font-weight: 700;
                  color: #1f2937;
                }
                
                .pdf-info-grid {
                  display: grid;
                  grid-template-columns: 1fr 1fr;
                  gap: 12px;
                }
                
                .pdf-info-item {
                  page-break-inside: avoid;
                }
                
                .pdf-info-label {
                  font-size: 9px;
                  font-weight: 600;
                  color: #6b7280;
                  text-transform: uppercase;
                  margin-bottom: 2px;
                }
                
                .pdf-info-value {
                  font-size: 11px;
                  color: #1f2937;
                  font-weight: 500;
                }
                
                .pdf-description {
                  font-size: 11px;
                  line-height: 1.5;
                  color: #374151;
                  margin-bottom: 10px;
                }
                
                .pdf-progress-container {
                  margin-bottom: 8px;
                }
                
                .pdf-progress-bar {
                  width: 100%;
                  height: 6px;
                  background: #e5e7eb;
                  border-radius: 3px;
                  overflow: hidden;
                  margin-bottom: 3px;
                }
                
                .pdf-progress-fill {
                  height: 100%;
                  background: #226F75;
                }
                
                .pdf-progress-label {
                  font-size: 9px;
                  color: #6b7280;
                }
                
                .pdf-milestone-item {
                  background: #f9fafb;
                  border-left: 3px solid #226F75;
                  padding: 8px 10px;
                  margin-bottom: 8px;
                  page-break-inside: avoid;
                  border-radius: 2px;
                }
                
                .pdf-milestone-header {
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  margin-bottom: 3px;
                }
                
                .pdf-milestone-title {
                  font-size: 11px;
                  font-weight: 600;
                  color: #1f2937;
                }
                
                .pdf-badge {
                  display: inline-block;
                  font-size: 8px;
                  font-weight: 600;
                  padding: 2px 6px;
                  border-radius: 2px;
                  text-transform: capitalize;
                }
                
                .pdf-badge.completed {
                  background: #dcfce7;
                  color: #166534;
                }
                
                .pdf-badge.in_progress {
                  background: #dbeafe;
                  color: #1e40af;
                }
                
                .pdf-badge.pending {
                  background: #f3f4f6;
                  color: #374151;
                }
                
                .pdf-milestone-desc {
                  font-size: 10px;
                  color: #6b7280;
                  margin-bottom: 2px;
                }
                
                .pdf-milestone-date {
                  font-size: 9px;
                  color: #9ca3af;
                }
                
                .pdf-contract-box {
                  background: #f0fdf4;
                  border: 2px solid #86efac;
                  padding: 10px;
                  margin-bottom: 10px;
                  border-radius: 4px;
                  page-break-inside: avoid;
                }
                
                .pdf-contract-status {
                  font-size: 11px;
                  font-weight: 700;
                  color: #166534;
                  margin-bottom: 8px;
                }
                
                .pdf-contract-signatures {
                  display: grid;
                  grid-template-columns: 1fr 1fr;
                  gap: 8px;
                }
                
                .pdf-signature-item {
                  background: white;
                  border: 1px solid #dcfce7;
                  padding: 6px;
                  border-radius: 3px;
                  text-align: center;
                }
                
                .pdf-signature-label {
                  font-size: 9px;
                  font-weight: 600;
                  color: #6b7280;
                  margin-bottom: 3px;
                }
                
                .pdf-signature-date {
                  font-size: 8px;
                  color: #9ca3af;
                }
                
                .pdf-document-item {
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  background: #f9fafb;
                  border: 1px solid #e5e7eb;
                  padding: 8px 10px;
                  margin-bottom: 6px;
                  border-radius: 3px;
                  page-break-inside: avoid;
                }
                
                .pdf-document-info {
                  flex: 1;
                }
                
                .pdf-document-name {
                  font-size: 10px;
                  font-weight: 600;
                  color: #1f2937;
                  margin-bottom: 2px;
                }
                
                .pdf-document-meta {
                  font-size: 8px;
                  color: #9ca3af;
                }
                
                .pdf-footer {
                  border-top: 1px solid #e5e7eb;
                  padding-top: 10px;
                  margin-top: 20px;
                  font-size: 9px;
                  color: #9ca3af;
                  text-align: center;
                  page-break-before: avoid;
                }
                
                table {
                  width: 100%;
                  border-collapse: collapse;
                  margin-bottom: 10px;
                }
                
                td {
                  padding: 6px 8px;
                  font-size: 10px;
                }
                
                .table-label {
                  background: #f3f4f6;
                  font-weight: 600;
                  width: 30%;
                  border-right: 1px solid #d1d5db;
                }
              </style>
            </head>
            <body>
              <div class="pdf-document">
                <!-- Header -->
                <div class="pdf-header">
                  <div class="pdf-title">${project?.title || 'Project Details'}</div>
                  <div class="pdf-subtitle">Project Dashboard Report • Generated ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                </div>

                <!-- Summary Cards -->
                <div class="pdf-summary-grid">
                  <div class="pdf-summary-card">
                    <div class="pdf-card-label">Status</div>
                    <div class="pdf-card-value">${project?.status ? project.status.replace('_', ' ').toUpperCase() : 'N/A'}</div>
                  </div>
                  <div class="pdf-summary-card">
                    <div class="pdf-card-label">Budget</div>
                    <div class="pdf-card-value">${formatCurrency(project?.budget || 0)}</div>
                  </div>
                  <div class="pdf-summary-card">
                    <div class="pdf-card-label">Duration</div>
                    <div class="pdf-card-value">${project?.duration || 'N/A'}</div>
                  </div>
                </div>

                <!-- Project Description -->
                ${project?.message || project?.description ? `
                  <div class="pdf-section">
                    <div class="pdf-section-title">Project Description</div>
                    <div class="pdf-description">${project?.message || project?.description}</div>
                  </div>
                ` : ''}

                <!-- Project Information -->
                <div class="pdf-section">
                  <div class="pdf-section-title">Project Information</div>
                  <div class="pdf-info-grid">
                    <div class="pdf-info-item">
                      <div class="pdf-info-label">Client</div>
                      <div class="pdf-info-value">${project?.client?.name || 'Unknown'}</div>
                    </div>
                    <div class="pdf-info-item">
                      <div class="pdf-info-label">Developer</div>
                      <div class="pdf-info-value">${project?.developer?.name || 'Unassigned'}</div>
                    </div>
                    <div class="pdf-info-item">
                      <div class="pdf-info-label">Location</div>
                      <div class="pdf-info-value">${project?.location || 'Not specified'}</div>
                    </div>
                    <div class="pdf-info-item">
                      <div class="pdf-info-label">Building Type</div>
                      <div class="pdf-info-value">${project?.building_type || 'Not specified'}</div>
                    </div>
                    <div class="pdf-info-item">
                      <div class="pdf-info-label">Start Date</div>
                      <div class="pdf-info-value">${project?.start_date ? new Date(project.start_date).toLocaleDateString() : 'N/A'}</div>
                    </div>
                    <div class="pdf-info-item">
                      <div class="pdf-info-label">Min Budget</div>
                      <div class="pdf-info-value">${formatCurrency(project?.budget_min || 0)}</div>
                    </div>
                  </div>
                </div>

                <!-- Budget Progress -->
                ${project?.budget_max ? `
                  <div class="pdf-section">
                    <div class="pdf-section-title">Budget Progress</div>
                    <div class="pdf-progress-container">
                      <div class="pdf-progress-bar">
                        <div class="pdf-progress-fill" style="width: ${Math.min(100, ((project?.budget || 0) / project.budget_max) * 100)}%"></div>
                      </div>
                      <div class="pdf-progress-label">${Math.round(((project?.budget || 0) / project.budget_max) * 100)}% of ${formatCurrency(project.budget_max)} spent</div>
                    </div>
                  </div>
                ` : ''}

                <!-- Milestones -->
                ${milestones.length > 0 ? `
                  <div class="pdf-section">
                    <div class="pdf-section-title">Project Milestones</div>
                    ${milestones.map(m => `
                      <div class="pdf-milestone-item">
                        <div class="pdf-milestone-header">
                          <div class="pdf-milestone-title">${m.title}</div>
                          <div class="pdf-badge ${m.status}">${m.status.replace('_', ' ')}</div>
                        </div>
                        ${m.description ? `<div class="pdf-milestone-desc">${m.description}</div>` : ''}
                        ${m.due_date ? `<div class="pdf-milestone-date">Due: ${new Date(m.due_date).toLocaleDateString()}</div>` : ''}
                      </div>
                    `).join('')}
                  </div>
                ` : ''}

                <!-- Contracts -->
                ${contractDocuments.length > 0 ? `
                  <div class="pdf-section">
                    <div class="pdf-section-title">Contract Documents</div>
                    ${contractDocuments.filter(d => d.is_complete).map(d => `
                      <div class="pdf-contract-box">
                        <div class="pdf-contract-status">✓ Contract Fully Signed - Both Parties Executed</div>
                        <div class="pdf-contract-signatures">
                          ${d.developer_signed_at ? `
                            <div class="pdf-signature-item">
                              <div class="pdf-signature-label">Developer Signature</div>
                              <div class="pdf-signature-date">${new Date(d.developer_signed_at).toLocaleDateString()}</div>
                            </div>
                          ` : ''}
                          ${d.client_signed_at ? `
                            <div class="pdf-signature-item">
                              <div class="pdf-signature-label">Client Signature</div>
                              <div class="pdf-signature-date">${new Date(d.client_signed_at).toLocaleDateString()}</div>
                            </div>
                          ` : ''}
                        </div>
                      </div>
                    `).join('')}
                  </div>
                ` : ''}

                <!-- Project Documents -->
                ${projectDocuments.length > 0 ? `
                  <div class="pdf-section">
                    <div class="pdf-section-title">Project Documents</div>
                    ${projectDocuments.map(d => `
                      <div class="pdf-document-item">
                        <div class="pdf-document-info">
                          <div class="pdf-document-name">${d.filename || 'Document'}</div>
                          <div class="pdf-document-meta">${d.size ? formatFileSize(d.size) : 'Unknown'} • ${d.created_at ? new Date(d.created_at).toLocaleDateString() : 'Unknown date'}</div>
                        </div>
                      </div>
                    `).join('')}
                  </div>
                ` : ''}

                <!-- Footer -->
                <div class="pdf-footer">
                  <div>This document was automatically generated from BuildTrust Admin Dashboard</div>
                  <div>For verification or inquiries, contact the project administrator</div>
                </div>
              </div>
            </body>
            </html>
          `;

          const element = document.createElement('div');
          element.innerHTML = htmlContent;

          const opt = {
            margin: [10, 10, 10, 10],
            filename: `${project?.title || 'project'}-details-${new Date().toISOString().split('T')[0]}.pdf`,
            image: { type: 'jpeg', quality: 0.95 },
            html2canvas: {
              scale: 2,
              useCORS: true,
              allowTaint: true,
              backgroundColor: '#ffffff',
              logging: false
            },
            jsPDF: {
              orientation: 'portrait',
              unit: 'mm',
              format: 'a4',
              compress: true
            },
            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
          };

          html2pdfLib().set(opt).from(element).save();

          toast({
            title: "Success",
            description: `PDF exported: ${project?.title || 'project'}-details.pdf`,
          });
        } catch (err) {
          console.error("Error creating PDF:", err);
          toast({
            title: "Error",
            description: "Failed to create PDF. Please try again.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast({
        title: "Error",
        description: "Failed to export PDF",
        variant: "destructive",
      });
    }
  };

  // Handle share dashboard - copy link to clipboard
  const handleShareDashboard = async () => {
    try {
      const dashboardUrl = `${window.location.origin}${window.location.pathname}`;
      
      // Copy to clipboard
      await navigator.clipboard.writeText(dashboardUrl);

      toast({
        title: "Success",
        description: "Dashboard link copied to clipboard",
      });
    } catch (error) {
      console.error("Error sharing dashboard:", error);
      
      // Fallback: show the URL in an alert
      const dashboardUrl = `${window.location.origin}${window.location.pathname}`;
      alert(`Dashboard URL:\n${dashboardUrl}`);
      
      toast({
        title: "Info",
        description: "URL shown in alert - copy manually if needed",
      });
    }
  };

  // Calculate project progress based on contract signatures and duration
  const calculateProjectProgress = (durationStr: string | null, contract: any) => {
    if (!durationStr || !contract) {
      return { currentDay: 0, totalDays: 0, percentageComplete: 0, daysRemaining: 0, status: "no_contract" };
    }

    // Check if both parties have signed
    const clientSigned = contract?.client_signed_at;
    const developerSigned = contract?.developer_signed_at;

    if (!clientSigned || !developerSigned) {
      return { currentDay: 0, totalDays: 0, percentageComplete: 0, daysRemaining: 0, status: "awaiting_signatures" };
    }

    // Use the later of the two signing dates as the project start
    const clientSignTime = new Date(clientSigned).getTime();
    const devSignTime = new Date(developerSigned).getTime();
    const projectStartTime = Math.max(clientSignTime, devSignTime);

    // Parse duration string (e.g., "6 months", "200 days", "12 weeks")
    const durationMatch = durationStr.match(/(\d+)\s*(days?|weeks?|months?|years?)/i);
    if (!durationMatch) {
      return { currentDay: 0, totalDays: 0, percentageComplete: 0, daysRemaining: 0, status: "invalid_duration" };
    }

    const amount = parseInt(durationMatch[1]);
    const unit = durationMatch[2].toLowerCase();

    let totalDays = 0;
    if (unit.startsWith('day')) {
      totalDays = amount;
    } else if (unit.startsWith('week')) {
      totalDays = amount * 7;
    } else if (unit.startsWith('month')) {
      totalDays = amount * 30; // Approximate
    } else if (unit.startsWith('year')) {
      totalDays = amount * 365; // Approximate
    }

    const nowTime = new Date().getTime();
    const elapsedMs = nowTime - projectStartTime;
    const currentDay = Math.ceil(elapsedMs / (1000 * 60 * 60 * 24));
    const daysRemaining = Math.max(0, totalDays - currentDay);
    const percentageComplete = totalDays > 0 ? Math.round((currentDay / totalDays) * 100) : 0;

    return {
      currentDay: Math.max(1, currentDay),
      totalDays,
      percentageComplete: Math.min(100, percentageComplete),
      daysRemaining,
      status: "active"
    };
  };

  const [project, setProject] = useState<any | null>(null);
  const [developers, setDevelopers] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "",
    budget: "",
    budget_min: "",
    budget_max: "",
    developer_id: "",
    building_type: "",
    location: "",
    start_date: "",
    duration: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [documents, setDocuments] = useState<any[]>([]);

  // Mock milestones data
  const mockMilestones = [
    {
      id: 1,
      project_id: 17,
      title: "Design Phase Complete",
      description: "All design mockups and specifications completed and approved by client",
      due_date: "2026-05-15",
      status: "completed",
      created_at: "2026-04-01T10:00:00Z",
    },
    {
      id: 2,
      project_id: 17,
      title: "Development Started",
      description: "Backend and frontend development begins",
      due_date: "2026-06-30",
      status: "in_progress",
      created_at: "2026-04-10T10:00:00Z",
    },
    {
      id: 3,
      project_id: 17,
      title: "Testing & QA",
      description: "Quality assurance and bug fixing phase",
      due_date: "2026-07-30",
      status: "pending",
      created_at: "2026-04-10T10:00:00Z",
    },
    {
      id: 4,
      project_id: 17,
      title: "Client Review",
      description: "Client review and feedback collection",
      due_date: "2026-08-15",
      status: "pending",
      created_at: "2026-04-10T10:00:00Z",
    },
    {
      id: 5,
      project_id: 17,
      title: "Launch",
      description: "Final deployment and project launch",
      due_date: "2026-09-01",
      status: "pending",
      created_at: "2026-04-10T10:00:00Z",
    },
  ];

  const [milestones, setMilestones] = useState<any[]>(mockMilestones);
  const [projectDocuments, setProjectDocuments] = useState<any[]>([]);
  const [contractDocuments, setContractDocuments] = useState<any[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(false);

  useEffect(() => {
    const loadProject = async () => {
      try {
        const projectId = parseInt(id || "0");
        const response = await apiClient.getProjectById(projectId);

        // Extract project from response (backend returns { project: {...} })
        const foundProject = response?.project || response;

        if (foundProject) {
          setProject(foundProject);
          setFormData({
            title: foundProject.title || "",
            description: foundProject.description || "",
            status: foundProject.status || "",
            budget: (foundProject.budget || 0).toString(),
            budget_min: (foundProject.budget_min || 0).toString(),
            budget_max: (foundProject.budget_max || 0).toString(),
            developer_id: foundProject.developer_id?.toString() || "",
            building_type: foundProject.building_type || "",
            location: foundProject.location || "",
            start_date: foundProject.start_date ? new Date(foundProject.start_date).toISOString().split('T')[0] : "",
            duration: foundProject.duration || "",
          });
          
          // Load project documents and contract
          await loadProjectDocuments(projectId);
        } else {
          setError("Project not found");
          toast({
            title: "Error",
            description: "Project not found",
            variant: "destructive",
          });
        }
      } catch (err: any) {
        console.error("Error loading project:", err);
        setError(err.message || "Failed to load project");
        toast({
          title: "Error",
          description: err.message || "Failed to load project",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    const loadDevelopers = async () => {
      try {
        const devs = await apiClient.getDevelopers();
        setDevelopers(Array.isArray(devs) ? devs : devs?.developers || []);
      } catch (err) {
        console.error("Error loading developers:", err);
        setDevelopers([]);
      }
    };

    const loadProjectDocuments = async (projectId: number) => {
      setLoadingDocs(true);
      try {
        // Load project media (documents)
        try {
          const mediaResponse = await apiClient.getProjectMedia(projectId);
          const mediaArray = mediaResponse?.media || [];
          setProjectDocuments(Array.isArray(mediaArray) ? mediaArray : []);
        } catch (err) {
          console.warn("Could not load project media:", err);
          setProjectDocuments([]);
        }

        // Load contract documents
        try {
          const contractResponse = await apiClient.getProjectContract(projectId);
          const contractDocs = contractResponse?.documents || [];
          setContractDocuments(Array.isArray(contractDocs) ? contractDocs : []);
        } catch (err) {
          console.warn("Could not load contract documents:", err);
          setContractDocuments([]);
        }
      } catch (err) {
        console.error("Error loading documents:", err);
      } finally {
        setLoadingDocs(false);
      }
    };

    loadProject();
    loadDevelopers();
  }, [id, navigate, toast]);

  const handleSave = async () => {
    if (!project) return;

    // Validation
    const errors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      errors.title = "Title is required";
    }
    if (!formData.description.trim()) {
      errors.description = "Description is required";
    }
    if (!formData.status) {
      errors.status = "Status is required";
    }
    if (!formData.budget || parseFloat(formData.budget) <= 0) {
      errors.budget = "Budget must be greater than 0";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast({
        title: "Validation Error",
        description: "Please fix the errors below",
        variant: "destructive",
      });
      return;
    }

    setFormErrors({});
    setSaving(true);

    try {
      const updatedProject = await apiClient.updateProject(project.id, {
        title: formData.title.trim(),
        description: formData.description.trim(),
        message: formData.description.trim(),
        status: formData.status as any,
        budget: parseFloat(formData.budget),
        budget_min: parseFloat(formData.budget_min),
        budget_max: parseFloat(formData.budget_max),
        developer_id: formData.developer_id && formData.developer_id !== "0"
          ? parseInt(formData.developer_id)
          : null,
        building_type: formData.building_type.trim(),
        location: formData.location.trim(),
        start_date: formData.start_date,
        duration: formData.duration.trim(),
      });

      if (updatedProject) {
        const projectData = updatedProject?.project || updatedProject;
        setProject(projectData);
        // Update form data with new project data
        setFormData({
          title: projectData?.title || "",
          description: projectData?.message || projectData?.description || "",
          status: projectData?.status || "",
          budget: (projectData?.budget || 0).toString(),
          budget_min: (projectData?.budget_min || 0).toString(),
          budget_max: (projectData?.budget_max || 0).toString(),
          developer_id: projectData?.developer_id?.toString() || "",
          building_type: projectData?.building_type || "",
          location: projectData?.location || "",
          start_date: projectData?.start_date ? new Date(projectData.start_date).toISOString().split('T')[0] : "",
          duration: projectData?.duration || "",
        });
        setIsEditing(false);
        toast({
          title: "Success",
          description: "Project updated successfully",
        });
      } else {
        throw new Error("Failed to update project");
      }
    } catch (err: any) {
      console.error("Error updating project:", err);
      toast({
        title: "Error",
        description: err.message || "Failed to update project",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteMilestone = (milestoneId: number) => {
    setMilestones(milestones.filter((m) => m.id !== milestoneId));
    toast({
      title: "Success",
      description: "Milestone deleted successfully",
    });
  };

  const handleToggleMilestoneStatus = (milestoneId: number) => {
    setMilestones(
      milestones.map((m) =>
        m.id === milestoneId
          ? {
              ...m,
              status: m.status === "pending" ? "completed" : "pending",
            }
          : m
      )
    );
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      open: "secondary",
      in_progress: "default",
      completed: "default",
      cancelled: "destructive",
    };

    const statusLabels: Record<string, string> = {
      open: "Open",
      in_progress: "In Progress",
      completed: "Completed",
      cancelled: "Cancelled",
    };

    return (
      <Badge variant={variants[status] || "outline"}>
        {statusLabels[status] || status}
      </Badge>
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-6 w-6 text-green-600" />;
      case "in_progress":
        return <Clock className="h-6 w-6 text-blue-600" />;
      case "open":
        return <AlertCircle className="h-6 w-6 text-orange-600" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="animate-spin h-12 w-12 text-[#253E44]" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/admin/projects")}
            className="mb-4 flex items-center space-x-2"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Projects</span>
          </Button>
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-700 font-medium">{error || "Project not found"}</p>
              <p className="text-red-600 text-sm mt-2">The project you're looking for doesn't exist or couldn't be loaded.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-md border-b border-white/20 sticky top-0 z-30 shadow-sm p-4 md:p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center md:space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/admin/projects")}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="md:text-2xl font-bold text-gray-900">
                {project?.title || "Project Details"}
              </h1>
              <p className="text-sm text-gray-500">Project Details</p>
            </div>
          </div>
          <Button
            onClick={() => {
              if (!isEditing && project) {
                // Entering edit mode - sync form data from current project
                setFormData({
                  title: project?.title || "",
                  description: project?.message || project?.description || "",
                  status: project?.status || "",
                  budget: (project?.budget || 0).toString(),
                  budget_min: (project?.budget_min || 0).toString(),
                  budget_max: (project?.budget_max || 0).toString(),
                  developer_id: project?.developer_id?.toString() || "",
                  building_type: project?.building_type || "",
                  location: project?.location || "",
                  start_date: project?.start_date ? new Date(project.start_date).toISOString().split('T')[0] : "",
                  duration: project?.duration || "",
                });
                setFormErrors({});
              }
              setIsEditing(!isEditing);
            }}
            className="bg-[#253E44] hover:bg-[#253E44]/90"
          >
            <Edit2 className="h-4 w-4 md:mr-2" />
            <p className=" hidden md:block">{isEditing ? "Cancel" : "Edit"}</p>
          </Button>
        </div>
      </div>

      <div className=" px-2 sm:px-3 lg:px-8 py-2 sm:py-3 lg:py-8">
        {!isEditing ? (
          <div className=" px-6 py-8">
            {/* Calculate project progress once to avoid multiple calls */}
            {(() => {
              const progress = calculateProjectProgress(project?.duration, project?.contract);
              return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className=" p-6 flex flex-col">
                <span className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-2">
                  Status
                </span>
                <span className="font-bold text-3xl capitalize text-slate-900">
                  {project?.status ? project.status.replace("_", " ") : "N/A"}
                </span>
              </Card>
              <Card className=" p-6">
                <span className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1 block">
                  Budget
                </span>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-3xl font-bold text-slate-900">
                    {formatCurrency(project?.budget || 0)}
                  </span>
                  <span className="text-slate-400 text-sm">Spent</span>
                </div>
                <div className="space-y-2 text-sm text-slate-600 mb-4">
                  <div>
                    Min Budget: <span className="font-semibold">{formatCurrency(project?.budget_min || 0)}</span>
                  </div>
                  <div>
                    Max Budget: <span className="font-semibold">{formatCurrency(project?.budget_max || 0)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all"
                      style={{
                        width: `${project?.budget_max ? Math.min(100, (((project?.budget || 0) / project.budget_max) * 100)) : 0}%`
                      }}
                    ></div>
                  </div>
                  <span className="text-xs text-slate-400 whitespace-nowrap">
                    {project?.budget_max ? Math.round((((project?.budget || 0) / project.budget_max) * 100)) : 0}% spent
                  </span>
                </div>
              </Card>
              <Card className=" p-6 ">
                <span className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-2 block">
                  Timeline Progress
                </span>
                {progress.status === "awaiting_signatures" ? (
                  <div className="space-y-3">
                    <p className="text-sm text-amber-600 font-medium">Awaiting Contract Signatures</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500">
                          {project?.contract?.client_signed_at ? "✓ Client Signed" : "○ Client Signature Pending"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500">
                          {project?.contract?.developer_signed_at ? "✓ Developer Signed" : "○ Developer Signature Pending"}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl font-bold text-slate-900">
                        Day {progress.currentDay}{" "}
                        <span className="text-sm font-normal text-slate-400">
                          / {progress.totalDays}
                        </span>
                      </span>
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary transition-all"
                          style={{
                            width: `${progress.percentageComplete}%`
                          }}
                        ></div>
                      </div>
                      <span className="text-xs text-slate-400">{progress.percentageComplete}%</span>
                    </div>
                    <div className="mt-2 text-xs text-slate-500">
                      {progress.daysRemaining > 0 
                        ? `${progress.daysRemaining} days remaining`
                        : 'Project completed'}
                    </div>
                  </>
                )}
              </Card>
            </div>
              );
            })()}
            <Card className="overflow-hidden">
              <div className="px-8 py-6 border-b border-slate-100">
                <h3 className="text-xl font-bold text-slate-900">
                  Project Information
                </h3>
              </div>
              <div className="p-8">
                <div className="mb-10">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                    Description
                  </h4>
                  <p className="text-slate-700 leading-relaxed text-lg">
                    {project?.message || project?.description || "No description provided"}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                        Client
                      </h4>
                      <div className="flex items-center gap-3">
                        <img
                          alt="Client Avatar"
                          className="w-8 h-8 rounded-full object-cover"
                          src={
                            project?.client?.profile_image
                              ? `/uploads/profile_images/${project.client.profile_image}`
                              : "https://placehold.net/avatar-1.svg"
                          }
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://placehold.net/avatar-1.svg";
                          }}
                        />
                        <p className="text-slate-900 font-medium">
                          {project?.client?.name || project?.client_name || "Unknown"}
                        </p>
                      </div>
                    </div>
                    <hr className="border-slate-100" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                        Building Type
                      </h4>
                      <p className="text-slate-900 font-medium">
                        {project?.building_type || "Not specified"}
                      </p>
                    </div>
                    <hr className="border-slate-100" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                        Location
                      </h4>
                      <p className="text-slate-900 font-medium">
                        {project?.location || "Not specified"}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                        Assigned Developer
                      </h4>
                      <div className="flex items-center gap-3">
                        <img
                          alt="Developer Avatar"
                          className="w-8 h-8 rounded-full object-cover"
                          src={
                            project?.developer?.profile_image
                              ? `/uploads/profile_images/${project.developer.profile_image}`
                              : "https://placehold.net/avatar-4.svg"
                          }
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://placehold.net/avatar-4.svg";
                          }}
                        />
                        <div>
                          <p className="text-slate-900 font-medium">
                            {project?.developer?.name || project?.developer_name || "Unassigned"}
                          </p>
                          <p className="text-xs text-slate-400">
                            {project?.developer?.rating ? `Rating: ${project.developer.rating}` : "No rating"}
                          </p>
                        </div>
                      </div>
                    </div>
                    <hr className="border-slate-100" />
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                          Start Date
                        </h4>
                        <p className="text-slate-900 font-medium">
                          {project?.start_date ? new Date(project.start_date).toLocaleDateString("en-NG", {
                            day: "numeric",
                            month: "short",
                            year: "numeric"
                          }) : (project?.created_at ? new Date(project.created_at).toLocaleDateString("en-NG", {
                            day: "numeric",
                            month: "short",
                            year: "numeric"
                          }) : "N/A")}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                          Duration
                        </h4>
                        <p className="text-slate-900 font-medium">
                          {project?.duration || "Not specified"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 px-8 py-4 border-t border-slate-100 flex justify-between items-center flex-col md:flex-row gap-5 md:gap-0">
                <div className="flex gap-10 md:gap-4">
                  <div className="text-xs text-slate-400">
                    <span className="block">LAST UPDATED</span>
                    <span className="text-slate-600 font-medium">
                      {project?.updated_at ? new Date(project.updated_at).toLocaleDateString() : "N/A"}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400">
                    <span className="block">CREATED</span>
                    <span className="text-slate-600 font-medium">
                      {project?.created_at ? new Date(project.created_at).toLocaleDateString() : "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
            
            {/* Milestones Section */}
            <Card className="mt-8 overflow-hidden">
              <div className="px-8 py-6 border-b border-slate-100">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Project Milestones
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">Track project progress with milestones</p>
                </div>
              </div>

              <div className="p-8">
                {milestones.length === 0 ? (
                  <div className="text-center py-8">
                    <Flag className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500">No milestones yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {milestones.map((milestone) => (
                      <div
                        key={milestone.id}
                        className="border border-slate-200 rounded-lg p-4 hover:border-slate-300 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3 flex-1">
                            <button
                              onClick={() => handleToggleMilestoneStatus(milestone.id)}
                              className="mt-1 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                              {milestone.status === "completed" ? (
                                <CheckSquare className="h-5 w-5 text-green-600" />
                              ) : (
                                <Square className="h-5 w-5" />
                              )}
                            </button>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className={`font-semibold text-sm ${
                                  milestone.status === "completed"
                                    ? "text-slate-400 line-through"
                                    : "text-slate-900"
                                }`}>
                                  {milestone.title}
                                </h4>
                                <Badge variant={
                                  milestone.status === "completed" ? "default" :
                                  milestone.status === "in_progress" ? "secondary" :
                                  milestone.status === "at_risk" ? "destructive" :
                                  "outline"
                                }>
                                  {milestone.status.replace("_", " ")}
                                </Badge>
                              </div>
                              {milestone.description && (
                                <p className="text-xs text-slate-500 mt-1">{milestone.description}</p>
                              )}
                              {milestone.due_date && (
                                <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {new Date(milestone.due_date).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteMilestone(milestone.id)}
                            className="text-slate-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
            
            {/* Project Documents Section */}
            <Card className="mt-8 overflow-hidden">
              <div className="px-8 py-6 border-b border-slate-100">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Project Documents
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">All project-related documents and files</p>
                </div>
              </div>

              <div className="p-8 space-y-6">
                {loadingDocs ? (
                  <div className="text-center py-8">
                    <Loader2 className="h-8 w-8 text-slate-300 mx-auto mb-2 animate-spin" />
                    <p className="text-slate-500">Loading documents...</p>
                  </div>
                ) : (
                  <>
                    {/* Contract Documents */}
                    {contractDocuments.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Contract Documents
                        </h4>
                        <div className="space-y-2">
                          {contractDocuments.map((doc, idx) => {
                            // Check if this is a combined contract (both parties signed)
                            const isFullySigned = doc.type === 'contract_signed' && doc.is_complete;
                            
                            return (
                              <div
                                key={idx}
                                className={`border rounded-lg transition-all ${
                                  isFullySigned 
                                    ? 'border-green-300 bg-green-50 hover:border-green-400 hover:bg-green-100' 
                                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                } group`}
                              >
                                {isFullySigned ? (
                                  // Combined contract showing both signatures
                                  <div className="p-4">
                                    <div className="flex items-center justify-between mb-4">
                                      <div>
                                        <p className="text-sm font-semibold text-slate-900">
                                          ✓ Contract Fully Signed
                                        </p>
                                        <p className="text-xs text-slate-600 mt-1">
                                          Both parties have signed the contract
                                        </p>
                                      </div>
                                      <div className="px-3 py-1 bg-green-600 text-white text-xs font-medium rounded-full">
                                        Executed
                                      </div>
                                    </div>

                                    {/* Show both signatures side by side */}
                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                      {/* Developer Signature */}
                                      {doc.developer_signature_url && (
                                        <div className="border border-slate-200 rounded p-3 bg-white">
                                          <p className="text-xs font-medium text-slate-700 mb-2">Developer Signature</p>
                                          <img
                                            src={doc.developer_signature_url.startsWith('http') 
                                              ? doc.developer_signature_url 
                                              : `http://localhost:3001${doc.developer_signature_url}`}
                                            alt="Developer Signature"
                                            className="w-full h-20 object-contain border border-slate-100 rounded p-1 bg-slate-50"
                                            onError={(e) => {
                                              (e.target as HTMLImageElement).style.display = 'none';
                                            }}
                                          />
                                          <p className="text-xs text-slate-500 mt-2">
                                            Signed: {doc.developer_signed_at ? new Date(doc.developer_signed_at).toLocaleDateString() : 'Unknown'}
                                          </p>
                                        </div>
                                      )}

                                      {/* Client Signature */}
                                      {doc.client_signature_url && (
                                        <div className="border border-slate-200 rounded p-3 bg-white">
                                          <p className="text-xs font-medium text-slate-700 mb-2">Client Signature</p>
                                          <img
                                            src={doc.client_signature_url.startsWith('http') 
                                              ? doc.client_signature_url 
                                              : `http://localhost:3001${doc.client_signature_url}`}
                                            alt="Client Signature"
                                            className="w-full h-20 object-contain border border-slate-100 rounded p-1 bg-slate-50"
                                            onError={(e) => {
                                              (e.target as HTMLImageElement).style.display = 'none';
                                            }}
                                          />
                                          <p className="text-xs text-slate-500 mt-2">
                                            Signed: {doc.client_signed_at ? new Date(doc.client_signed_at).toLocaleDateString() : 'Unknown'}
                                          </p>
                                        </div>
                                      )}
                                    </div>

                                    <button
                                      onClick={() => handleDownloadDocument(doc)}
                                      className="w-full px-3 py-2 text-xs font-medium text-green-700 bg-white border border-green-300 rounded hover:bg-green-50 transition-colors"
                                    >
                                      Export Signed Contract
                                    </button>
                                  </div>
                                ) : (
                                  // Individual signatures
                                  <div className="flex items-center justify-between p-3 hover:bg-slate-50 transition-all">
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                      <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                                          <span className="text-xs font-bold text-blue-600">📝</span>
                                        </div>
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-slate-900 truncate">
                                          {doc.signed_by} Signature
                                        </p>
                                        <p className="text-xs text-slate-500">
                                          Signed: {doc.signed_at ? new Date(doc.signed_at).toLocaleDateString() : 'Date unknown'}
                                        </p>
                                      </div>
                                    </div>
                                    <button
                                      onClick={() => handleDownloadDocument(doc)}
                                      className="ml-2 flex-shrink-0 px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded hover:bg-slate-100 hover:text-slate-900 transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                      Download
                                    </button>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Project Media/Documents */}
                    {projectDocuments.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-slate-600" />
                          Project Media
                        </h4>
                        <div className="space-y-2">
                          {projectDocuments.map((doc, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:border-slate-300 hover:bg-slate-50 transition-all group"
                            >
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div className="flex-shrink-0">
                                  <div className="w-8 h-8 bg-slate-100 rounded flex items-center justify-center">
                                    <span className="text-xs font-semibold text-slate-600">
                                      {doc.filename?.split('.')?.pop()?.toUpperCase() || 'FILE'}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-slate-900 truncate">
                                    {doc.filename || 'Untitled Document'}
                                  </p>
                                  <p className="text-xs text-slate-500">
                                    {doc.size ? formatFileSize(doc.size) : 'Size unknown'} • {doc.created_at ? new Date(doc.created_at).toLocaleDateString() : 'Date unknown'}
                                  </p>
                                </div>
                              </div>
                              <button
                                onClick={() => handleDownloadDocument(doc)}
                                className="ml-2 flex-shrink-0 px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded hover:bg-slate-100 hover:text-slate-900 transition-colors opacity-0 group-hover:opacity-100"
                              >
                                Download
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Empty State */}
                    {contractDocuments.length === 0 && projectDocuments.length === 0 && (
                      <div className="text-center py-8">
                        <AlertCircle className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-500">No documents uploaded yet.</p>
                        <p className="text-xs text-slate-400 mt-1">Contract signatures and project media will appear here</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </Card>

            <div className="mt-8 flex gap-4 flex-col md:flex-row">
              <button 
                onClick={handleExportPDF}
                className="px-6 py-3 bg-white border border-slate-200 rounded-DEFAULT text-sm font-semibold flex items-center gap-2 hover:bg-slate-50 transition-colors justify-center"
              >
                <FaCloudArrowDown/>
                Export Project PDF
              </button>
              <button 
                onClick={handleShareDashboard}
                className="px-6 py-3 bg-white border border-slate-200 rounded-DEFAULT text-sm font-semibold flex items-center gap-2 hover:bg-slate-50 transition-colors justify-center"
              >
                <FaShare/>
                Share Dashboard
              </button>
            </div>
          </div>
        ) : (
          <div className="px-6 py-8">
            {/* Edit Mode */}
            <Card>
              <CardHeader>
                <CardTitle>Edit Project</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-gray-900">Project Title</label>
                  <Input
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="Enter project title"
                    className={`mt-2 ${formErrors.title ? "border-red-500" : ""}`}
                    disabled={saving}
                  />
                  {formErrors.title && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-900">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Enter project description"
                    className={`mt-2 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#226F75] ${
                      formErrors.description ? "border-red-500" : ""
                    }`}
                    rows={4}
                    disabled={saving}
                  />
                  {formErrors.description && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-900">Status</label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) =>
                        setFormData({ ...formData, status: value })
                      }
                      disabled={saving}
                    >
                      <SelectTrigger className={`mt-2 ${formErrors.status ? "border-red-500" : ""}`}>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    {formErrors.status && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.status}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-900">Budget (USD)</label>
                    <Input
                      type="number"
                      value={formData.budget}
                      onChange={(e) =>
                        setFormData({ ...formData, budget: e.target.value })
                      }
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      className={`mt-2 ${formErrors.budget ? "border-red-500" : ""}`}
                      disabled={saving}
                    />
                    {formErrors.budget && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.budget}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-900">Minimum Budget (USD)</label>
                    <Input
                      type="number"
                      value={formData.budget_min}
                      onChange={(e) =>
                        setFormData({ ...formData, budget_min: e.target.value })
                      }
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      className="mt-2"
                      disabled={saving}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-900">Maximum Budget (USD)</label>
                    <Input
                      type="number"
                      value={formData.budget_max}
                      onChange={(e) =>
                        setFormData({ ...formData, budget_max: e.target.value })
                      }
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      className="mt-2"
                      disabled={saving}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-900">Location</label>
                  <Input
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    placeholder="Enter project location"
                    className="mt-2"
                    disabled={saving}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-900">Building Type</label>
                    <Input
                      value={formData.building_type}
                      onChange={(e) =>
                        setFormData({ ...formData, building_type: e.target.value })
                      }
                      placeholder="e.g., Commercial, Residential"
                      className="mt-2"
                      disabled={saving}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-900">Duration</label>
                    <Input
                      value={formData.duration}
                      onChange={(e) =>
                        setFormData({ ...formData, duration: e.target.value })
                      }
                      placeholder="e.g., 6 months"
                      className="mt-2"
                      disabled={saving}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-900">Start Date</label>
                  <Input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) =>
                      setFormData({ ...formData, start_date: e.target.value })
                    }
                    className="mt-2"
                    disabled={saving}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-900">
                    Assign Developer
                  </label>
                  <Select
                    value={formData.developer_id}
                    onValueChange={(value) =>
                      setFormData({ ...formData, developer_id: value })
                    }
                    disabled={saving}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select developer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Unassigned</SelectItem>
                      {developers.map((dev) => (
                        <SelectItem key={dev.id} value={dev.id.toString()}>
                          {dev.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end space-x-4 pt-4 border-t">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsEditing(false);
                      setFormErrors({});
                    }}
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-[#253E44] hover:bg-[#253E44]/90"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="animate-spin h-4 w-4 mr-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProjectDetails;
