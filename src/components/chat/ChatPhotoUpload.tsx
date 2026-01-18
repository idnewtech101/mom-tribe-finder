import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ImagePlus, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB

interface ChatPhotoUploadProps {
  onUploadComplete: (imageUrl: string) => void;
  disabled?: boolean;
}

export default function ChatPhotoUpload({ onUploadComplete, disabled }: ChatPhotoUploadProps) {
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [hasSeenDisclaimer, setHasSeenDisclaimer] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (!hasSeenDisclaimer) {
      setShowDisclaimer(true);
    } else {
      fileInputRef.current?.click();
    }
  };

  const handleAcceptDisclaimer = () => {
    setHasSeenDisclaimer(true);
    setShowDisclaimer(false);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input for same file selection
    e.target.value = '';

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Επιτρέπονται μόνο εικόνες");
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      toast.error("Το αρχείο είναι πολύ μεγάλο (μέγιστο 3MB)");
      return;
    }

    await uploadPhoto(file);
  };

  const uploadPhoto = async (file: File) => {
    setIsUploading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Πρέπει να είσαι συνδεδεμένη");
        return;
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `chat_${user.id}_${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      // Upload to profile-photos bucket (or we could create a chat-photos bucket)
      const { error: uploadError } = await supabase.storage
        .from('profile-photos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        toast.error("Σφάλμα κατά την αποστολή της φωτογραφίας");
        return;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profile-photos')
        .getPublicUrl(filePath);

      onUploadComplete(publicUrl);
      toast.success("Φωτογραφία εστάλη! 📸");
      
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Σφάλμα κατά την αποστολή");
    } finally {
      setIsUploading(false);
      setPendingFile(null);
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 flex-shrink-0"
        onClick={handleClick}
        disabled={disabled || isUploading}
      >
        {isUploading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <ImagePlus className="w-4 h-4" />
        )}
      </Button>

      <AlertDialog open={showDisclaimer} onOpenChange={setShowDisclaimer}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              📸 Αποστολή Φωτογραφίας
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3 text-left">
              <p>
                Πριν στείλεις φωτογραφίες, θυμήσου:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Μην στέλνεις φωτογραφίες παιδιών ή τρίτων χωρίς άδεια</li>
                <li>Αποφεύγει ακατάλληλο ή προσβλητικό περιεχόμενο</li>
                <li>Η αποστολή γίνεται <strong>με δική σου ευθύνη</strong></li>
              </ul>
              <p className="text-xs text-muted-foreground mt-2">
                Μέγιστο μέγεθος: 3MB
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Ακύρωση</AlertDialogCancel>
            <AlertDialogAction onClick={handleAcceptDisclaimer}>
              Κατάλαβα, συνέχισε
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
