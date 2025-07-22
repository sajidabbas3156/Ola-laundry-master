
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface ImageUploadSectionProps {
  image: string | null;
  onImageChange: (image: string | null) => void;
}

export function ImageUploadSection({ image, onImageChange }: ImageUploadSectionProps) {
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      onImageChange(imageUrl);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="image">Item Image</Label>
      <div className="flex items-center gap-4">
        <Input
          id="image"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => document.getElementById('image')?.click()}
          className="w-full"
        >
          <Upload className="mr-2 h-4 w-4" />
          Upload Image
        </Button>
      </div>
      {image && (
        <div className="mt-2">
          <img
            src={image}
            alt="Preview"
            className="w-20 h-20 object-cover rounded-lg border"
          />
        </div>
      )}
    </div>
  );
}
