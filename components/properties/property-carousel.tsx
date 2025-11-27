'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { PropertyImage } from '@/types/property';
import { cn } from '@/lib/utils';

interface PropertyCarouselProps {
  images: PropertyImage[];
  mainImageIndex?: number;
}

export function PropertyCarousel({
  images,
  mainImageIndex = 0,
}: PropertyCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(mainImageIndex);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlay || isFullScreen) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlay, images.length, isFullScreen]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'Escape' && isFullScreen) {
        setIsFullScreen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, isFullScreen]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setIsAutoPlay(false);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setIsAutoPlay(false);
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlay(false);
  };

  if (images.length === 0) {
    return (
      <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
        <p className="text-muted-foreground">No images available</p>
      </div>
    );
  }

  const currentImage = images[currentIndex];

  if (isFullScreen) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex flex-col">
        {/* Image Display */}
        <div className="flex-1 flex items-center justify-center overflow-hidden">
          <img
            src={currentImage.url}
            alt={currentImage.caption || 'Property image'}
            className="h-full w-full object-contain"
          />
        </div>

        {/* Controls */}
        <div className="bg-black/80 p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrevious}
              className="text-white hover:bg-white/20"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>

            <div className="text-white text-sm">
              {currentIndex + 1} / {images.length}
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleNext}
              className="text-white hover:bg-white/20"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsFullScreen(false)}
            className="text-white hover:bg-white/20"
          >
            <Minimize2 className="h-6 w-6" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-video rounded-lg overflow-hidden bg-muted group">
        <img
          src={currentImage.url}
          alt={currentImage.caption || 'Property image'}
          className="h-full w-full object-cover"
        />

        {/* Navigation Buttons */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handlePrevious}
          className={cn(
            'absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 text-white hover:bg-black/60 transition-all opacity-0 group-hover:opacity-100'
          )}
        >
          <ChevronLeft className="h-8 w-8" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleNext}
          className={cn(
            'absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 text-white hover:bg-black/60 transition-all opacity-0 group-hover:opacity-100'
          )}
        >
          <ChevronRight className="h-8 w-8" />
        </Button>

        {/* Image Counter */}
        <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
          {currentIndex + 1} / {images.length}
        </div>

        {/* Full Screen Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsFullScreen(true)}
          className={cn(
            'absolute top-4 right-4 bg-black/40 text-white hover:bg-black/60 transition-all opacity-0 group-hover:opacity-100'
          )}
        >
          <Maximize2 className="h-5 w-5" />
        </Button>

        {/* Auto Play Toggle */}
        <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsAutoPlay(!isAutoPlay)}
            className="bg-black/40 text-white hover:bg-black/60 gap-2"
          >
            {isAutoPlay ? '⏸' : '▶'}
            {isAutoPlay ? 'Pause' : 'Play'}
          </Button>
        </div>
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => handleThumbnailClick(index)}
              className={cn(
                'relative flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all',
                currentIndex === index
                  ? 'border-primary ring-2 ring-primary/50'
                  : 'border-border hover:border-primary'
              )}
            >
              <img
                src={image.url}
                alt={`Thumbnail ${index + 1}`}
                className="h-20 w-24 object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Caption */}
      {currentImage.caption && (
        <p className="text-center text-sm text-muted-foreground">
          {currentImage.caption}
        </p>
      )}
    </div>
  );
}
