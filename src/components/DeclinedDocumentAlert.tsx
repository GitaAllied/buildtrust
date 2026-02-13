import { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription as DialogDesc,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api";

interface DeclinedDocumentAlertProps {
  declinedDocument: any | null;
  currentUserId?: number;
  onDocumentReuploaded?: (updatedDoc?: any) => void;
  onDismiss?: () => void;
}

export const DeclinedDocumentAlert = ({
  declinedDocument,
  currentUserId,
  onDocumentReuploaded,
  onDismiss,
}: DeclinedDocumentAlertProps) => {
  const [isOpen, setIsOpen] = useState(!!declinedDocument);
  const [showReuploadDialog, setShowReuploadDialog] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  // Open dialog when declinedDocument changes
  useEffect(() => {
    if (declinedDocument) {
      setIsOpen(true);
    }
  }, [declinedDocument]);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    // Only call onDismiss when the reupload dialog is NOT being shown.
    // This prevents the parent from clearing the selected document when
    // we programmatically close the alert to open the reupload dialog.
    if (!open && !showReuploadDialog && onDismiss) {
      onDismiss();
    }
  };

  const handleReuploadClick = () => {
    // Open reupload dialog first, then close the alert. This order ensures
    // handleOpenChange can detect showReuploadDialog=true and avoid calling onDismiss
    // which would otherwise clear the parent-selected document and unmount us.
    setShowReuploadDialog(true);
    setIsOpen(false);
  };

  const handleReuploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !declinedDocument) return;

    // determine user id to upload as
    const userIdToUse = currentUserId || declinedDocument.user_id;
    if (!userIdToUse) {
      toast({ title: 'Upload failed', description: 'Missing user id', variant: 'destructive' });
      return;
    }

    // normalize document type to backend-accepted values
    let docType = (declinedDocument.type || '').toString().toLowerCase();
    if (docType.includes('licen')) docType = 'license';
    else if (docType.includes('cert')) docType = 'certification';
    else if (docType.includes('test')) docType = 'testimonial';
    else if (docType.includes('selfie') || docType.includes('id') || docType.includes('identity') || docType.includes('gov')) docType = 'identity';

    console.log('Reupload: uploading file', { userId: userIdToUse, docType, fileName: file.name });

    try {
      setIsUploading(true);
      const result = await apiClient.uploadDocument(
        userIdToUse,
        docType,
        file
      );
      toast({
        title: "Uploaded",
        description: "Document resubmitted for verification",
      });
      setShowReuploadDialog(false);
      if (onDocumentReuploaded) {
        onDocumentReuploaded(result);
      }
    } catch (err) {
      console.error('Upload error:', err);
      const msg = (err as any)?.message || JSON.stringify((err as any)?.body) || 'Could not reupload document';
      toast({ title: "Upload failed", description: msg, variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  if (!declinedDocument) {
    return null;
  }

  return (
    <>
      {/* Declined Document Alert Dialog */}
      <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <AlertDialogTitle>Document Declined</AlertDialogTitle>
            </div>
            <div className="space-y-3 mt-2 text-sm text-muted-foreground">
              <div>
                <div className="font-medium text-gray-900 capitalize">
                  {declinedDocument.type?.replace(/_/g, " ")} Document
                </div>
                <div className="text-sm text-red-700 mt-2">
                  <strong>Reason for Decline:</strong>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {declinedDocument.decline_reason}
                </div>
              </div>
              <div className="text-sm text-gray-600">
                Please review the feedback and resubmit your document with the necessary corrections.
              </div>
            </div>
            <AlertDialogDescription className="sr-only">Declined document requires reupload</AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3">
            <AlertDialogCancel>Dismiss</AlertDialogCancel>
            <Button onClick={handleReuploadClick} className="bg-blue-600 hover:bg-blue-700">
              Reupload Document
            </Button>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reupload Document Dialog (separate Dialog to avoid AlertDialog dismissal side-effects) */}
      <Dialog open={showReuploadDialog} onOpenChange={(open) => {
        setShowReuploadDialog(open);
        // When the reupload dialog is closed, notify parent (dismiss)
        if (!open && onDismiss) onDismiss();
      }}>
        <DialogContent className="max-w-lg">
            <DialogTitle>Reupload {declinedDocument.type?.replace(/_/g, ' ')} Document</DialogTitle>
            <DialogDesc>Select a new file to resubmit for verification.</DialogDesc>
            <div className="py-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#253E44]/60 transition-colors cursor-pointer">
                <label
                  htmlFor={`file-${declinedDocument.id}`}
                  className="cursor-pointer block w-full"
                >
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Upload className="w-6 h-6 text-gray-400" />
                  </div>
                  <div className="text-sm font-medium text-gray-900 mb-1">
                    Choose a file
                  </div>
                  <div className="text-xs text-gray-500">
                    Click to upload or drag and drop
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    PDF, JPG, PNG up to 10MB
                  </div>
                </label>
                <input
                  id={`file-${declinedDocument.id}`}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  onChange={handleReuploadFile}
                  disabled={isUploading}
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Button onClick={() => setShowReuploadDialog(false)} disabled={isUploading}>Cancel</Button>
              {isUploading && (
                <p className="text-sm text-gray-500">Uploading...</p>
              )}
            </div>
          </DialogContent>
      </Dialog>
    </>
  );
};

export default DeclinedDocumentAlert;
