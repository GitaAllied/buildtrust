import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Eye, Menu, X } from "lucide-react";
import Logo from "../assets/Logo.png";
import { Link } from "react-router-dom";
import { apiClient } from "@/lib/api";
import SignoutModal from "@/components/ui/signoutModal";
import ClientSidebar from "@/components/ClientSidebar";
import { useDispatch, useSelector } from "react-redux";
import { openClientSidebar, openSignoutModal } from "@/redux/action";
import { jsPDF } from 'jspdf';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Helper function to construct full image URL
const getImageUrl = (mediaUrl?: string): string => {
  if (!mediaUrl) {
    console.log('⚠️ No media URL provided, using placeholder');
    return "https://placehold.net/main.svg";
  }

  if (mediaUrl.startsWith('http')) {
    console.log('✅ Full URL detected:', mediaUrl);
    return mediaUrl;
  }

  const apiBase = (import.meta.env.VITE_API_URL ?? '/api').replace(/\/+$/, '');
  const backendOrigin = apiBase.startsWith('http')
    ? apiBase.replace(/\/api$/, '')
    : window.location.origin;

  let resolvedUrl = mediaUrl;
  if (!resolvedUrl.startsWith('/')) {
    resolvedUrl = `/${resolvedUrl}`;
  }

  const fullUrl = `${backendOrigin}${resolvedUrl}`;
  console.log('📸 Resolved media URL:', { original: mediaUrl, resolved: fullUrl });
  return fullUrl;
};

// Derive backend origin to resolve media URLs stored as "/uploads/...".
const API_BASE = (
  import.meta.env.VITE_API_URL ?? '/api'
).replace(/\/+$/, "");
const API_ORIGIN = API_BASE.replace(/\/api$/, "");

const Contracts = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state: any) => state.sidebar.clientSidebar);
  const signOutModal = useSelector((state: any) => state.signout);

  // Real data state
  const [contracts, setContracts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [contractTemplate, setContractTemplate] = useState<string>('');
  const [selectedContract, setSelectedContract] = useState<any>(null);
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);

  // Format date or show 'Pending' if null
  const formatDateOrPending = (date: any) => {
    if (!date) return "Pending";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "Pending";
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Resolve media URL helper (in case contract has file references)
  const resolveMediaUrl = (media: any) => {
    if (!media) return null;
    let url = media.url ?? media.filename ?? null;
    if (!url) return null;
    url = String(url);
    if (url.startsWith("http")) return url;
    if (!url.startsWith("/")) url = `/${url}`;
    return `${API_ORIGIN}${url}`;
  };

  // Generate contract PDF with jsPDF
  const generateContractPDF = async (contract: any) => {
    try {
      console.log('📥 Generating contract PDF with jsPDF');
      
      if (!contractTemplate || contractTemplate === 'No contract template available' || contractTemplate === 'Failed to load contract template') {
        console.warn('⚠️ Contract template not available:', { contractTemplate });
        alert('Contract template is not yet loaded. Please wait a moment and try again.');
        return;
      }

      console.log('✅ Using database contract template');

      // Fetch signature images as data URLs
      let devSigBase64 = null;
      let clientSigBase64 = null;

      console.log('🖼️ Fetching signature images...');

      if (contract.developer_signature_url) {
        try {
          const fullUrl = getImageUrl(contract.developer_signature_url);
          console.log('📸 Fetching developer signature from:', fullUrl);
          const devSigResponse = await fetch(fullUrl);
          
          if (devSigResponse.ok) {
            const devSigBlob = await devSigResponse.blob();
            devSigBase64 = await new Promise((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result);
              reader.readAsDataURL(devSigBlob);
            });
            console.log('✅ Developer signature fetched');
          }
        } catch (err) {
          console.warn('⚠️ Failed to fetch developer signature:', err);
        }
      }

      if (contract.client_signature_url) {
        try {
          const fullUrl = getImageUrl(contract.client_signature_url);
          console.log('📸 Fetching client signature from:', fullUrl);
          const clientSigResponse = await fetch(fullUrl);
          
          if (clientSigResponse.ok) {
            const clientSigBlob = await clientSigResponse.blob();
            clientSigBase64 = await new Promise((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result);
              reader.readAsDataURL(clientSigBlob);
            });
            console.log('✅ Client signature fetched');
          }
        } catch (err) {
          console.warn('⚠️ Failed to fetch client signature:', err);
        }
      }

      console.log('📄 Creating PDF with jsPDF...');

      // Create PDF directly with jsPDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;
      const contentWidth = pageWidth - 2 * margin;
      let yPosition = margin;

      // Helper function to add text with line wrapping
      const addWrappedText = (text: string, x: number, y: number, maxWidth: number, fontSize: number = 10) => {
        pdf.setFontSize(fontSize);
        const lines = pdf.splitTextToSize(text, maxWidth);
        pdf.text(lines, x, y);
        return y + (lines.length * fontSize * 0.35);
      };

      // Add title
      pdf.setFontSize(16);
      pdf.setTextColor(34, 111, 117); // #226F75
      pdf.text('SERVICE AGREEMENT & LEGAL CONTRACT', margin, yPosition);
      yPosition += 12;

      // Add contract template
      pdf.setFontSize(9);
      pdf.setTextColor(51, 51, 51); // #333
      
      // Properly decode HTML entities while preserving formatting
      const decodeHtmlEntities = (text: string) => {
        let decoded = text;
        
        // FIRST: Replace problematic Unicode characters to prevent jsPDF rendering issues
        decoded = decoded.replace(/þ/g, 'th'); // thorn U+00FE
        decoded = decoded.replace(/Þ/g, 'Th'); // THORN U+00DE
        decoded = decoded.replace(/ð/g, 'd'); // eth U+00F0
        decoded = decoded.replace(/Ð/g, 'D'); // ETH U+00D0
        
        // SECOND: Replace HTML entity references
        const entityMap: Record<string, string> = {
          '&nbsp;': ' ',
          '&lt;': '<',
          '&gt;': '>',
          '&quot;': '"',
          '&#39;': "'",
          '&apos;': "'",
          '&copy;': '©',
          '&reg;': '®',
          '&thorn;': 'th',
          '&Thorn;': 'Th',
          '&eth;': 'd',
          '&Eth;': 'D',
          '&#240;': 'd',
          '&#254;': 'th',
          '&#222;': 'Th',
          '&#208;': 'D',
          '&amp;': 'and',
        };
        
        for (const [entity, replacement] of Object.entries(entityMap)) {
          const regex = new RegExp(entity.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
          decoded = decoded.replace(regex, replacement);
        }
        
        // THIRD: Handle numeric character references
        decoded = decoded.replace(/&#(\d+);/g, (match, num) => {
          const code = parseInt(num);
          if (code === 254 || code === 222) return 'th';
          if (code === 240 || code === 208) return 'd';
          if (code === 160) return ' ';
          return String.fromCharCode(code);
        });
        
        // FOURTH: Replace ALL remaining bare ampersands with explicit patterns
        // This catches any & that isn't part of an HTML entity
        decoded = decoded.replace(/&(?![a-zA-Z0-9#])/g, 'and '); // & not followed by letter or # → "and "
        
        // FIFTH: Remove invisible formatting characters
        decoded = decoded.replace(/\u00AD/g, ''); // soft hyphen
        decoded = decoded.replace(/\u200B/g, ''); // zero-width space
        decoded = decoded.replace(/\u200C/g, ''); // zero-width non-joiner
        decoded = decoded.replace(/\u200D/g, ''); // zero-width joiner
        decoded = decoded.replace(/\u061C/g, ''); // Arabic letter mark
        decoded = decoded.replace(/[\u202A-\u202E]/g, ''); // bidirectional text control chars
        decoded = decoded.replace(/[\u2066-\u2069]/g, ''); // isolate characters
        
        return decoded;
      };
      
      const decodedTemplate = decodeHtmlEntities(contractTemplate);
      
      const templateLines = pdf.splitTextToSize(decodedTemplate, contentWidth);
      pdf.text(templateLines, margin, yPosition);
      yPosition += templateLines.length * 2.5 + 15;

      // Check if signature section will fit on current page
      // Estimate space needed: ~200mm for signatures + 50mm for status box
      if (yPosition > pageHeight - 270) {
        // Not enough space, add new page
        pdf.addPage();
        yPosition = margin;
      } else {
        // Add separator
        pdf.setDrawColor(34, 111, 117);
        pdf.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 10;
      }

      // Add signature section title
      pdf.setFontSize(14);
      pdf.setTextColor(34, 111, 117);
      const sigSectionText = 'SIGNATURE SECTION';
      const sigSectionWidth = pdf.getTextWidth(sigSectionText);
      pdf.text(sigSectionText, pageWidth / 2 - sigSectionWidth / 2, yPosition);
      yPosition += 12;

      // Calculate side-by-side layout
      const colWidth = (contentWidth - 5) / 2; // 5mm gap between columns
      const leftColX = margin;
      const rightColX = margin + colWidth + 5;
      let maxHeight = 0;
      let clientHeight = 0;
      let devHeight = 0;

      // CLIENT SIGNATURE SECTION (Left)
      let clientY = yPosition;
      pdf.setFontSize(11);
      pdf.setTextColor(37, 62, 68); // #253E44
      pdf.text('CLIENT SIGNATURE', leftColX, clientY);
      clientY += 7;
      clientHeight += 7;

      pdf.setFontSize(9);
      pdf.setTextColor(102, 102, 102); // #666
      pdf.text(`Status: ${contract.client_signed_at ? 'SIGNED' : 'PENDING'}`, leftColX, clientY);
      clientY += 6;
      clientHeight += 6;
      if (contract.client_signed_at && contract.client) {
        pdf.text(`Name: ${contract.client}`, leftColX, clientY);
        clientY += 6;
        clientHeight += 6;
      }
      pdf.text(`Date: ${contract.client_signed_at ? new Date(contract.client_signed_at).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Awaiting signature'}`, leftColX, clientY, { maxWidth: colWidth });
      clientY += 8;
      clientHeight += 8;

      // Add client signature image
      if (clientSigBase64) {
        try {
          console.log('🖼️ Adding client signature image to PDF');
          pdf.addImage(clientSigBase64, 'PNG', leftColX, clientY, colWidth - 5, 35);
          clientY += 38;
          clientHeight += 38;
        } catch (err) {
          console.warn('⚠️ Failed to add client signature image:', err);
        }
      }
      maxHeight = clientHeight;

      // DEVELOPER SIGNATURE SECTION (Right)
      let devY = yPosition;
      pdf.setFontSize(11);
      pdf.setTextColor(37, 62, 68);
      pdf.text('DEVELOPER SIGNATURE', rightColX, devY);
      devY += 7;
      devHeight += 7;

      pdf.setFontSize(9);
      pdf.setTextColor(102, 102, 102);
      pdf.text(`Status: ${contract.developer_signed_at ? 'SIGNED' : 'PENDING'}`, rightColX, devY);
      devY += 6;
      devHeight += 6;
      if (contract.developer_signed_at && contract.developer) {
        pdf.text(`Name: ${contract.developer}`, rightColX, devY);
        devY += 6;
        devHeight += 6;
      }
      pdf.text(`Date: ${contract.developer_signed_at ? new Date(contract.developer_signed_at).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Awaiting signature'}`, rightColX, devY, { maxWidth: colWidth });
      devY += 8;
      devHeight += 8;

      // Add developer signature image
      if (devSigBase64) {
        try {
          console.log('🖼️ Adding developer signature image to PDF');
          pdf.addImage(devSigBase64, 'PNG', rightColX, devY, colWidth - 5, 35);
          devY += 38;
          devHeight += 38;
        } catch (err) {
          console.warn('⚠️ Failed to add developer signature image:', err);
        }
      }
      maxHeight = Math.max(clientHeight, devHeight);
      yPosition += maxHeight + 10;

      // Add new page if needed for status section
      if (yPosition > pageHeight - 100) {
        pdf.addPage();
        yPosition = margin;
      } else {
        yPosition += 20;
      }

      // Contract Status Box
      const isSigned = contract.developer_signed_at && contract.client_signed_at;
      
      // PROJECT BRIEF SECTION
      // Set fill color
      pdf.setFillColor(34, 111, 117); // #226F75
      pdf.rect(margin, yPosition, contentWidth, 6, 'F'); // Header bar
      
      // Title
      pdf.setFontSize(11);
      pdf.setFont(undefined, 'bold');
      pdf.setTextColor(255, 255, 255); // White text
      pdf.text('PROJECT BRIEF', margin + 5, yPosition + 4);
      yPosition += 10;
      
      // Project details box
      pdf.setFillColor(245, 245, 245); // Light gray background
      pdf.rect(margin, yPosition, contentWidth, 70, 'F');
      pdf.setDrawColor(200, 200, 200);
      pdf.setLineWidth(0.5);
      pdf.rect(margin, yPosition, contentWidth, 70);
      
      pdf.setFont(undefined, 'normal');
      pdf.setFontSize(9);
      pdf.setTextColor(51, 51, 51);
      
      let detailY = yPosition + 5;
      
      // Project Name
      pdf.setFont(undefined, 'bold');
      pdf.text('Project Name:', margin + 5, detailY);
      pdf.setFont(undefined, 'normal');
      pdf.text(contract.title || 'N/A', margin + 55, detailY);
      detailY += 7;
      
      // Location (from contract data)
      pdf.setFont(undefined, 'bold');
      pdf.text('Location:', margin + 5, detailY);
      pdf.setFont(undefined, 'normal');
      pdf.text(contract.location || 'N/A', margin + 55, detailY);
      detailY += 7;
      
      // Budget Range
      pdf.setFont(undefined, 'bold');
      pdf.text('Budget Range:', margin + 5, detailY);
      pdf.setFont(undefined, 'normal');
      const minBudget = contract.budget_min || 'TBD';
      const maxBudget = contract.budget_max || 'TBD';
      pdf.text(`${minBudget} - ${maxBudget}`, margin + 55, detailY);
      detailY += 7;
      
      // Duration
      pdf.setFont(undefined, 'bold');
      pdf.text('Duration:', margin + 5, detailY);
      pdf.setFont(undefined, 'normal');
      const durationText = contract.duration ? `${contract.duration} months` : 'TBD';
      pdf.text(durationText, margin + 55, detailY);
      detailY += 7;
      
      // Description (truncated)
      pdf.setFont(undefined, 'bold');
      pdf.text('Description:', margin + 5, detailY);
      detailY += 5;
      pdf.setFont(undefined, 'normal');
      const descLines = pdf.splitTextToSize(contract.project || 'No description provided', contentWidth - 10);
      const truncatedDesc = descLines.slice(0, 3).join(' ');
      pdf.text(truncatedDesc, margin + 5, detailY, { maxWidth: contentWidth - 10 });
      detailY += 10;
      
      // Signing Status removed as per request
      
      yPosition += 80;

      // Add footer
      pdf.setFontSize(8);
      pdf.setTextColor(153, 153, 153); // #999
      const footerText1 = 'Generated by BuildTrust Africa Platform';
      const footerWidth1 = pdf.getTextWidth(footerText1);
      pdf.text(footerText1, pageWidth / 2 - footerWidth1 / 2, pageHeight - 15);
      
      const footerText2 = 'Copyright © 2026 BuildTrust Africa. All rights reserved.';
      const footerWidth2 = pdf.getTextWidth(footerText2);
      pdf.text(footerText2, pageWidth / 2 - footerWidth2 / 2, pageHeight - 10);

      // Save PDF
      const filename = `Contract_${contract.title.replace(/\s+/g, '_')}_${new Date().getTime()}.pdf`;
      pdf.save(filename);

      console.log('✅ Contract PDF generated and downloaded successfully');

    } catch (error) {
      console.error('❌ Error generating contract PDF:', error);
      alert('Failed to download contract. Please try again.');
    }
  };

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        setLoading(true);
        const response = await apiClient.getClientContracts();
        const rawContracts = response?.contracts ?? response?.data ?? response ?? [];

        const mapped = (Array.isArray(rawContracts) ? rawContracts : []).map((p: any) => ({
          id: p.id,
          title:
            p.project_title ||
            p.title ||
            p.contract_title ||
            `Contract for ${p.title || "Project"}`,
          developer: p.developer_name || p.developer || "Assigned Developer",
          client: p.client_name || p.client || "Client",
          project: p.project_title || p.title || "",
          value: p.budget ? `$${Number(p.budget).toLocaleString()}` : "—",
          budget_min: p.budget_min ? `$${Number(p.budget_min).toLocaleString()}` : null,
          budget_max: p.budget_max ? `$${Number(p.budget_max).toLocaleString()}` : null,
          location: p.project_location || 'N/A',
          status: p.status || p.contract_status || "Active",
          start_date: p.start_date || p.created_at || null,
          duration: p.duration || null,
          signed: p.client_signed_at || p.created_at || "",
          file: p.contract_file || p.file || null,
          developer_signature_url: p.developer_signature_url,
          client_signature_url: p.client_signature_url,
          developer_signed_at: p.developer_signed_at,
          client_signed_at: p.client_signed_at,
        }))
        .filter((contract) => {
          const status = String(contract.status || "").toLowerCase();
          return status === "active";
        });

        setContracts(mapped);

        // Fetch contract template
        try {
          console.log('📄 Fetching contract template...');
          const templateResponse = await apiClient.getContractTemplate();
          console.log('📄 Contract template response:', templateResponse);
          
          let contractTerms = null;
          
          if (templateResponse?.template?.contract_terms) {
            contractTerms = templateResponse.template.contract_terms;
            console.log('✅ Contract template loaded (nested structure)');
          } else if (templateResponse?.contract_terms) {
            contractTerms = templateResponse.contract_terms;
            console.log('✅ Contract template loaded (direct structure)');
          } else if (templateResponse?.data?.contract_terms) {
            contractTerms = templateResponse.data.contract_terms;
            console.log('✅ Contract template loaded (data structure)');
          }
          
          if (contractTerms) {
            setContractTemplate(contractTerms);
          } else {
            console.warn('⚠️ Contract template not found in response:', {
              hasNestedTemplate: !!templateResponse?.template?.contract_terms,
              hasDirectTerms: !!templateResponse?.contract_terms,
              hasDataTerms: !!templateResponse?.data?.contract_terms,
              responseKeys: Object.keys(templateResponse || {})
            });
            setContractTemplate('Contract template not available');
          }
        } catch (err) {
          console.error('❌ Failed to fetch contract template:', {
            error: err,
            message: (err as any)?.message,
            status: (err as any)?.status
          });
          setContractTemplate('Failed to load contract template');
        }
      } catch (err: any) {
        console.error("Error fetching contracts:", err);
        setError(err.message || "Failed to load contracts");
      } finally {
        setLoading(false);
      }
    };
    fetchContracts();
  }, []);

  return (
    <div className="min-h-screen bg-[#226F75]/10 flex flex-col md:flex-row">
      {/* Mobile Menu Button */}
      <div className="md:hidden bg-white/95 backdrop-blur-md border-b border-white/20 px-3 py-2 sm:px-4 sm:py-3 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center space-x-2 w-[20%]">
          <Link to={"/"}>
            <img src={Logo} alt="Build Trust Africa Logo" />
          </Link>
        </div>
        <button
          onClick={() => dispatch(openClientSidebar(!isOpen))}
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
      <ClientSidebar active={"contracts"} />
      <div className="w-full flex-1 md:pl-64 min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white/95 backdrop-blur-md border-b border-white/20 sticky top-12 md:top-0 z-30 shadow-sm p-3 sm:p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="md:text-2xl font-bold text-gray-900">
                  Contracts
                </h1>
                <p className="text-gray-500">Manage your project contracts</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                <p className="mt-4 text-gray-600">Loading contracts...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center text-red-600 py-12">
              <p className="text-lg font-semibold">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          ) : contracts.length === 0 ? (
            <div className="text-center py-12 text-gray-600">
              No active contracts found.
            </div>
          ) : (
            <div className="grid gap-6">
              {contracts.map((contract) => (
                <Card
                  key={contract.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-5 md:justify-between flex-col md:flex-row">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <FileText className="h-5 w-5 text-gray-600" />
                          <h3 className="font-semibold text-base md:text-lg">
                            {contract.title}
                          </h3>
                          <Badge
                            variant={
                              String(contract.status).toLowerCase() === "active"
                                ? "default"
                                : "secondary"
                            }
                            className={
                              String(contract.status).toLowerCase() === "active"
                                ? "bg-green-600"
                                : ""
                            }
                          >
                            {contract.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-4 text-sm text-gray-600">
                          <div>
                            <p>
                              <strong>Developer:</strong> {contract.developer}
                            </p>
                            <p>
                              <strong>Project:</strong> {contract.project}
                            </p>
                          </div>
                          <div>
                            <p>
                              <strong>Contract Value:</strong> {contract.value}
                            </p>
                            <p>
                              <strong>Start Date:</strong>{" "}
                              {formatDateOrPending(contract.start_date)}
                            </p>
                            <p>
                              <strong>Duration:</strong>{" "}
                              {contract.duration ? `${contract.duration} months` : "Pending"}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedContract(contract);
                            setIsContractModalOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        {contract.developer_signature_url && contract.client_signature_url && contract.developer_signed_at && contract.client_signed_at ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => generateContractPDF(contract)}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download PDF
                          </Button>
                        ) : (
                          <Button size="sm" variant="outline" disabled>
                            <Download className="h-4 w-4 mr-2" />
                            Signatures Incomplete
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Contract Details Modal */}
      <Dialog open={isContractModalOpen} onOpenChange={setIsContractModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-[#226F75]" />
              <span>{selectedContract?.title || 'Contract Details'}</span>
            </DialogTitle>
            <DialogDescription>
              Contract details and project information
            </DialogDescription>
          </DialogHeader>

          {selectedContract && (
            <div className="space-y-6">
              {/* Project Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-3 text-[#226F75]">Project Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600"><strong>Project Name:</strong></p>
                    <p>{selectedContract.title || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600"><strong>Location:</strong></p>
                    <p>{selectedContract.location || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600"><strong>Budget Range:</strong></p>
                    <p>{selectedContract.budget_min && selectedContract.budget_max 
                      ? `${selectedContract.budget_min} - ${selectedContract.budget_max}` 
                      : 'TBD'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600"><strong>Duration:</strong></p>
                    <p>{selectedContract.duration ? `${selectedContract.duration} months` : 'TBD'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600"><strong>Start Date:</strong></p>
                    <p>{formatDateOrPending(selectedContract.start_date)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600"><strong>Status:</strong></p>
                    <Badge variant={selectedContract.status?.toLowerCase() === 'active' ? 'default' : 'secondary'}>
                      {selectedContract.status || 'Active'}
                    </Badge>
                  </div>
                </div>
                {selectedContract.project && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600"><strong>Description:</strong></p>
                    <p className="text-sm">{selectedContract.project}</p>
                  </div>
                )}
              </div>

              {/* Contract Parties */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-3 text-[#226F75]">Contract Parties</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600"><strong>Client:</strong></p>
                    <p>{selectedContract.client || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600"><strong>Developer:</strong></p>
                    <p>{selectedContract.developer || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Signature Status */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-3 text-[#226F75]">Signature Status</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600"><strong>Client Signature:</strong></p>
                    <Badge variant={selectedContract.client_signed_at ? 'default' : 'secondary'}>
                      {selectedContract.client_signed_at ? 'Signed' : 'Pending'}
                    </Badge>
                    {selectedContract.client_signed_at && (
                      <p className="text-xs text-gray-500 mt-1">
                        Signed on {new Date(selectedContract.client_signed_at).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-600"><strong>Developer Signature:</strong></p>
                    <Badge variant={selectedContract.developer_signed_at ? 'default' : 'secondary'}>
                      {selectedContract.developer_signed_at ? 'Signed' : 'Pending'}
                    </Badge>
                    {selectedContract.developer_signed_at && (
                      <p className="text-xs text-gray-500 mt-1">
                        Signed on {new Date(selectedContract.developer_signed_at).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Contract Terms */}
              {contractTemplate && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-3 text-[#226F75]">Contract Terms</h3>
                  <div className="max-h-96 overflow-y-auto bg-white p-4 rounded border text-sm whitespace-pre-wrap">
                    {contractTemplate === 'No contract template available' || 
                     contractTemplate === 'Failed to load contract template' ? 
                      contractTemplate : 
                      contractTemplate}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setIsContractModalOpen(false)}>
                  Close
                </Button>
                {selectedContract.developer_signature_url && 
                 selectedContract.client_signature_url && 
                 selectedContract.developer_signed_at && 
                 selectedContract.client_signed_at && (
                  <Button 
                    onClick={() => {
                      generateContractPDF(selectedContract);
                      setIsContractModalOpen(false);
                    }}
                    className="bg-[#226F75] hover:bg-[#226F75]/90"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {signOutModal && (
        <SignoutModal
          isOpen={signOutModal}
          onClose={() => dispatch(openSignoutModal(false))}
        />
      )}
    </div>
  );
};

export default Contracts;
