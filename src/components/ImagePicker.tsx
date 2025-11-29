/**
 * Image Picker Component
 * 
 * Displays generated images in a horizontal carousel/grid
 * Allows user to select an image for their LinkedIn post
 */

import { Image, Loader2, RefreshCw, AlertCircle } from 'lucide-react';
import type { GeneratedImage } from '../lib/asset-generator';

interface ImagePickerProps {
  images: GeneratedImage[];
  selectedImage: GeneratedImage | null;
  onSelect: (image: GeneratedImage) => void;
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
}

export default function ImagePicker({
  images,
  selectedImage,
  onSelect,
  isLoading,
  error,
  onRetry,
}: ImagePickerProps) {
  if (isLoading) {
    return (
      <div className="bg-gray-50 rounded-xl p-8 border border-gray-200 text-center">
        <Loader2 className="w-12 h-12 text-gray-400 mx-auto mb-3 animate-spin" />
        <p className="text-sm text-gray-600 mb-1">Foundi is generating your visuals...</p>
        <p className="text-xs text-gray-500">Creating brand-aware images (30-60 seconds)</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 rounded-xl p-6 border border-red-200 text-center">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
        <p className="text-sm text-red-800 mb-2">{error}</p>
        <p className="text-xs text-red-600 mb-4">Couldn't generate images. Try again.</p>
        <button
          onClick={onRetry}
          className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-all flex items-center gap-2 mx-auto"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 text-center">
        <Image className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p className="text-sm text-gray-600">No images generated yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h5 className="text-sm font-medium text-gray-700">Choose an Image</h5>
        <span className="text-xs text-gray-500">{images.length} options</span>
      </div>
      
      {/* Horizontal carousel/grid */}
      <div className="grid grid-cols-3 gap-4">
        {images.map((image) => (
          <div
            key={image.id}
            onClick={() => onSelect(image)}
            className={`relative group cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${
              selectedImage?.id === image.id
                ? 'border-[#1A1A1A] ring-2 ring-[#1A1A1A] ring-offset-2'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <img
              src={image.url}
              alt={image.variation}
              className="w-full h-32 object-cover"
              loading="lazy"
            />
            
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="absolute bottom-0 left-0 right-0 p-2 text-white">
                <p className="text-xs font-medium capitalize">{image.variation}</p>
              </div>
            </div>
            
            {/* Selected indicator */}
            {selectedImage?.id === image.id && (
              <div className="absolute top-2 right-2 bg-[#1A1A1A] text-white rounded-full p-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Selected image info */}
      {selectedImage && (
        <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
          <p className="text-xs font-medium text-blue-900 mb-1">
            Selected: {selectedImage.variation}
          </p>
          <p className="text-xs text-blue-700 line-clamp-2">
            {selectedImage.prompt.substring(0, 100)}...
          </p>
        </div>
      )}
    </div>
  );
}

