'use client';

import { useState } from 'react';
import { GripVertical, Trash2, Star } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { PropertyImage } from '@/types/property';
import { cn } from '@/lib/utils';

interface ImagePreviewGridProps {
  images: PropertyImage[];
  mainImageIndex: number;
  onImagesChange: (images: PropertyImage[]) => void;
  onMainImageChange: (index: number) => void;
}

export function ImagePreviewGrid({
  images,
  mainImageIndex,
  onImagesChange,
  onMainImageChange,
}: ImagePreviewGridProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    // Reorder remaining images
    newImages.forEach((img, i) => {
      img.order = i;
    });
    // Adjust main image index if needed
    let newMainIndex = mainImageIndex;
    if (mainImageIndex === index) {
      newMainIndex = 0;
    } else if (mainImageIndex > index) {
      newMainIndex = mainImageIndex - 1;
    }
    onImagesChange(newImages);
    onMainImageChange(newMainIndex);
  };

  const handleCaptionChange = (index: number, caption: string) => {
    const newImages = [...images];
    newImages[index].caption = caption;
    onImagesChange(newImages);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (index: number) => {
    if (draggedIndex !== null && draggedIndex !== index) {
      const newImages = [...images];
      const draggedImage = newImages[draggedIndex];
      newImages.splice(draggedIndex, 1);
      newImages.splice(index, 0, draggedImage);

      // Update order
      newImages.forEach((img, i) => {
        img.order = i;
      });

      // Update main image index
      let newMainIndex = mainImageIndex;
      if (mainImageIndex === draggedIndex) {
        newMainIndex = index;
      } else if (draggedIndex < mainImageIndex && index >= mainImageIndex) {
        newMainIndex = mainImageIndex - 1;
      } else if (draggedIndex > mainImageIndex && index <= mainImageIndex) {
        newMainIndex = mainImageIndex + 1;
      }

      setDraggedIndex(index);
      onImagesChange(newImages);
      onMainImageChange(newMainIndex);
    }
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  if (images.length === 0) {
    return (
      <div className="rounded-lg border-2 border-dashed border-border p-8 text-center">
        <p className="text-sm text-muted-foreground">
          No images yet. Upload images above to see them here.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {images.map((image, index) => (
        <div
          key={image.id}
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragOver={() => handleDragOver(index)}
          onDragLeave={handleDragLeave}
          onDragEnd={handleDragEnd}
          className={cn(
            'group relative space-y-2 rounded-lg border transition-all duration-200',
            draggedIndex === index
              ? 'opacity-70 scale-95 cursor-grabbing'
              : dragOverIndex === index
                ? 'border-primary bg-primary/5'
                : 'border-border'
          )}
        >
          {/* Image Container */}
          <div className="relative h-40 overflow-hidden rounded-lg bg-muted">
            <img
              src={image.url}
              alt={image.caption || 'Property image'}
              className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
            />

            {/* Overlay Controls */}
            <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100 flex items-center justify-center gap-2">
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => handleRemoveImage(index)}
                className="gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Remove
              </Button>
            </div>

            {/* Main Image Indicator */}
            {mainImageIndex === index && (
              <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-1">
                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                <span className="text-xs font-medium text-white">Main</span>
              </div>
            )}

            {/* Drag Handle */}
            <div className="absolute top-2 left-2 rounded-md bg-black/60 p-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100 cursor-grab active:cursor-grabbing">
              <GripVertical className="h-4 w-4 text-white" />
            </div>

            {/* Image Order Badge */}
            <div className="absolute top-2 right-2 rounded-md bg-black/60 px-2 py-1">
              <span className="text-xs font-semibold text-white">
                {index + 1} / {images.length}
              </span>
            </div>
          </div>

          {/* Caption Input */}
          <Input
            type="text"
            placeholder="Image caption (optional)"
            value={image.caption || ''}
            onChange={(e) => handleCaptionChange(index, e.target.value)}
            className="h-8 text-xs"
          />

          {/* Set as Main Button */}
          {mainImageIndex !== index && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onMainImageChange(index)}
              className="w-full gap-2"
            >
              <Star className="h-4 w-4" />
              Set as Main
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}
