import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, Camera, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PhotoUploadProps {
  onPhotoUploaded: (url: string) => void;
  currentPhotoUrl?: string;
}

export const PhotoUpload = ({ onPhotoUploaded, currentPhotoUrl }: PhotoUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentPhotoUrl || null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    // Validate files
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        toast.error("Please select image files only");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Each file must be less than 5MB");
        return;
      }
    }

    setUploading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Fetch existing photos to append
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('profile_photos_urls, profile_photo_url')
        .eq('id', user.id)
        .single();
      if (profileError) throw profileError;

      const uploadedUrls: string[] = [];

      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('profile-photos')
          .upload(filePath, file, { upsert: true });
        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('profile-photos')
          .getPublicUrl(filePath);

        uploadedUrls.push(publicUrl);
      }

      // Update profile photos array and primary photo
      const existingList: string[] = Array.isArray(profileData?.profile_photos_urls)
        ? (profileData!.profile_photos_urls as any)
        : [];
      const newList = [...existingList, ...uploadedUrls];
      const newPrimary = uploadedUrls[uploadedUrls.length - 1] || profileData?.profile_photo_url || null;

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ profile_photos_urls: newList, profile_photo_url: newPrimary })
        .eq('id', user.id);
      if (updateError) throw updateError;

      // Update preview with the last uploaded photo
      setPreview(newPrimary);
      onPhotoUploaded(newPrimary || "");
      toast.success(files.length > 1 ? "Photos uploaded!" : "Photo uploaded!");
    } catch (error) {
      console.error("Error uploading photo(s):", error);
      toast.error("Failed to upload photo(s)");
      setPreview(currentPhotoUrl || null);
    } finally {
      setUploading(false);
      // reset input value to allow re-uploading the same file if desired
      event.currentTarget.value = '';
    }
  };

  const handleRemove = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from('profiles')
        .update({ profile_photo_url: null })
        .eq('id', user.id);

      if (error) throw error;

      setPreview(null);
      onPhotoUploaded("");
      toast.success("Photo removed");
    } catch (error) {
      console.error("Error removing photo:", error);
      toast.error("Failed to remove photo");
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Profile Photo</h3>
          {preview && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemove}
              className="text-destructive hover:text-destructive"
            >
              <X className="w-4 h-4 mr-1" />
              Remove
            </Button>
          )}
        </div>

        {preview ? (
          <div className="relative w-48 h-48 mx-auto">
            <img
              src={preview}
              alt="Profile preview"
              className="w-full h-full object-cover rounded-full border-4 border-primary shadow-lg"
            />
          </div>
        ) : (
          <div className="w-48 h-48 mx-auto rounded-full border-4 border-dashed border-border bg-secondary/20 flex items-center justify-center">
            <Camera className="w-12 h-12 text-muted-foreground" />
          </div>
        )}

        <div className="flex flex-col gap-2">
          <label htmlFor="photo-upload">
            <Button
              variant="outline"
              disabled={uploading}
              className="w-full"
              asChild
            >
              <span className="cursor-pointer">
                <Upload className="w-4 h-4 mr-2" />
                {uploading ? "Uploading..." : preview ? "Add/Change Photos" : "Upload Photos"}
              </span>
            </Button>
          </label>
          <input
            id="photo-upload"
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileSelect}
            disabled={uploading}
          />
        </div>

        <p className="text-xs text-center text-muted-foreground">
          Maximum file size: 5MB. Supported formats: JPG, PNG, WebP
        </p>
      </div>
    </Card>
  );
};
