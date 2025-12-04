import { useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

interface ProfilePhotoCarouselProps {
  photos: string[];
  profileName: string;
  onImageClick?: () => void;
  className?: string;
}

export function ProfilePhotoCarousel({
  photos,
  profileName,
  onImageClick,
  className,
}: ProfilePhotoCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Ensure we have at least one photo
  const displayPhotos = photos.length > 0 ? photos : ["https://i.pravatar.cc/400"];

  return (
    <div className={cn("relative", className)}>
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
        setApi={(api) => {
          api?.on("select", () => {
            setCurrentIndex(api.selectedScrollSnap());
          });
        }}
      >
        <CarouselContent>
          {displayPhotos.map((photo, index) => (
            <CarouselItem key={index} className="basis-full">
              <img
                src={photo}
                alt={`${profileName} - Photo ${index + 1}`}
                className="w-full h-56 object-cover cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  onImageClick?.();
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://i.pravatar.cc/400";
                }}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {displayPhotos.length > 1 && (
          <>
            <CarouselPrevious 
              className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 bg-white/80 hover:bg-white border-0 shadow-md z-10"
              onClick={(e) => e.stopPropagation()}
            />
            <CarouselNext 
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 bg-white/80 hover:bg-white border-0 shadow-md z-10"
              onClick={(e) => e.stopPropagation()}
            />
          </>
        )}
      </Carousel>
      
      {/* Dot indicators */}
      {displayPhotos.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {displayPhotos.map((_, index) => (
            <div
              key={index}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-200",
                index === currentIndex
                  ? "bg-white w-4"
                  : "bg-white/50"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
