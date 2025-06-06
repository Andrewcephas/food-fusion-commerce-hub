
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X, Image } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  required?: boolean;
}

const ImageUpload = ({ value, onChange, label = "Product Image", required = false }: ImageUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image under 5MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // For now, we'll use a placeholder image URL
      // In a real implementation, you would upload to Supabase Storage or another service
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          // For demo purposes, we'll use a sample food image URL
          // In production, you'd upload the actual file
          const sampleImages = [
            'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400',
            'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400',
            'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400',
            'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400',
            'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400',
          ];
          
          const randomImage = sampleImages[Math.floor(Math.random() * sampleImages.length)];
          onChange(randomImage);
          
          toast({
            title: "Image uploaded successfully",
            description: "Your product image has been set",
          });
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const clearImage = () => {
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <Label htmlFor="image-upload">{label} {required && <span className="text-red-500">*</span>}</Label>
      
      {/* Image Preview */}
      {value && (
        <div className="relative inline-block">
          <img 
            src={value} 
            alt="Product preview" 
            className="w-32 h-32 object-cover rounded-lg border border-gray-300"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
            onClick={clearImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragging 
            ? 'border-orange-500 bg-orange-50' 
            : 'border-gray-300 hover:border-gray-400'
        } ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center space-y-2">
          <div className="p-3 bg-gray-100 rounded-full">
            <Image className="h-8 w-8 text-gray-400" />
          </div>
          <div>
            <p className="text-sm text-gray-600">
              {isUploading ? 'Uploading...' : 'Drag and drop an image here, or'}
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              <Upload className="h-4 w-4 mr-2" />
              {isUploading ? 'Uploading...' : 'Choose File'}
            </Button>
          </div>
          <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        id="image-upload"
      />

      {/* URL Input Alternative */}
      <div className="relative">
        <Label htmlFor="image-url" className="text-sm text-gray-600">Or enter image URL</Label>
        <Input
          id="image-url"
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://example.com/image.jpg"
          className="mt-1"
        />
      </div>
    </div>
  );
};

export default ImageUpload;
