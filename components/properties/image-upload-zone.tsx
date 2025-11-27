'use client';

import { useRef, useState } from 'react';
import { Cloud, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { PropertyImage } from '@/types/property';

interface ImageUploadZoneProps {
  onImagesSelected: (images: PropertyImage[]) => void;
  maxImages?: number;
  maxFileSize?: number; // in MB
  currentImageCount?: number;
}

const ACCEPTED_FORMATS = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export function ImageUploadZone({
  onImagesSelected,
  maxImages = 20,
  maxFileSize = MAX_FILE_SIZE_MB,
  currentImageCount = 0,
}: ImageUploadZoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<
    Record<string, number>
  >({});
  const [errors, setErrors] = useState<string[]>([]);

  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_FORMATS.includes(file.type)) {
      return `Invalid format: ${file.name}. Only JPG, PNG, and WebP are supported.`;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return `File too large: ${file.name}. Max size is ${maxFileSize}MB.`;
    }
    return null;
  };

  const handleFileSelect = async (files: FileList | null) => {
    if (!files) return;

    const newErrors: string[] = [];
    const validFiles: File[] = [];
    const remainingSlots = maxImages - currentImageCount;

    Array.from(files).forEach((file, index) => {
      if (index >= remainingSlots) {
        newErrors.push(
          `Cannot upload more than ${maxImages} images total.`
        );
        return;
      }

      const error = validateFile(file);
      if (error) {
        newErrors.push(error);
      } else {
        validFiles.push(file);
      }
    });

    setErrors(newErrors);

    if (validFiles.length > 0) {
      // Simulate file reading and upload
      const newImages: PropertyImage[] = [];
      let completed = 0;

      validFiles.forEach((file, index) => {
        const fileId = `${Date.now()}-${index}`;
        setUploadProgress((prev) => ({ ...prev, [fileId]: 0 }));

        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => {
            const current = prev[fileId] || 0;
            const next = current + Math.random() * 50;
            return { ...next >= 100 ? prev : { ...prev, [fileId]: next } };
          });
        }, 200);

        // Read file as data URL
        const reader = new FileReader();
        reader.onload = (e) => {
          clearInterval(progressInterval);
          setUploadProgress((prev) => {
            const { [fileId]: _, ...rest } = prev;
            return rest;
          });

          if (e.target?.result) {
            newImages.push({
              id: fileId,
              url: e.target.result as string,
              caption: '',
              order: currentImageCount + newImages.length,
            });

            completed++;
            if (completed === validFiles.length) {
              onImagesSelected(newImages);
              if (fileInputRef.current) {
                fileInputRef.current.value = '';
              }
            }
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  const remainingSlots = maxImages - currentImageCount;
  const hasUploadError = errors.length > 0;

  return (
    <div className="space-y-4">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClickUpload}
        className={cn(
          'relative flex min-h-[200px] flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center transition-all duration-200 cursor-pointer',
          isDragging
            ? 'border-primary bg-primary/10'
            : hasUploadError
              ? 'border-destructive bg-destructive/5'
              : 'border-border bg-transparent hover:border-primary hover:bg-accent/50'
        )}
      >
        <Cloud
          className={cn(
            'mb-4 h-10 w-10 transition-colors',
            isDragging
              ? 'text-primary'
              : hasUploadError
                ? 'text-destructive'
                : 'text-muted-foreground'
          )}
        />

        <h3 className="mb-1 font-semibold text-foreground">
          Drag & drop images here
        </h3>
        <p className="mb-4 text-sm text-muted-foreground">
          or click to browse
        </p>

        <p className="text-xs text-muted-foreground">
          Max {maxImages} images, {maxFileSize}MB each. JPG, PNG, WebP supported.
        </p>

        {remainingSlots < maxImages && (
          <p className="mt-2 text-xs text-muted-foreground">
            {remainingSlots} slot{remainingSlots !== 1 ? 's' : ''} remaining
          </p>
        )}

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={ACCEPTED_FORMATS.join(',')}
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />
      </div>

      {/* Upload Progress */}
      {Object.entries(uploadProgress).length > 0 && (
        <div className="space-y-2">
          {Object.entries(uploadProgress).map(([fileId, progress]) => (
            <div key={fileId} className="space-y-1">
              <div className="h-2 rounded-full bg-secondary overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Uploading... {Math.round(progress)}%
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Errors */}
      {hasUploadError && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
          <div className="flex gap-3">
            <div className="flex-1 space-y-1">
              {errors.map((error, index) => (
                <p key={index} className="text-sm text-destructive">
                  {error}
                </p>
              ))}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setErrors([])}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
