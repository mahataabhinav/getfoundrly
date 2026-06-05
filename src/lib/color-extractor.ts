// @ts-expect-error - colorthief types are CommonJS but it works in ESM
import ColorThief from 'colorthief';

export interface ExtractedColor {
  hex: string;
  rgb: [number, number, number];
  weight: number;
}

/**
 * Extracts a meaningful color palette from an array of image URLs using ColorThief.
 * Prioritizes logo images, applies frequency-based ranking, and filters out grayscale colors.
 */
export async function extractBrandColors(
  images: Array<{ url: string; isLogo?: boolean }>,
  maxColors: number = 5
): Promise<ExtractedColor[]> {
  const colorThief = new ColorThief();
  const colorMap = new Map<string, ExtractedColor>();

  // Helper to check if a color is too gray/close to black or white
  const isGrayscale = (rgb: [number, number, number]): boolean => {
    const [r, g, b] = rgb;
    // Check if color is too close to black or white
    if ((r < 30 && g < 30 && b < 30) || (r > 240 && g > 240 && b > 240)) return true;
    
    // Check if color is too gray (low saturation)
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    return max - min < 20; 
  };

  const rgbToHex = (r: number, g: number, b: number) => 
    '#' + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');

  for (const img of images) {
    try {
      const imgElement = new Image();
      imgElement.crossOrigin = 'Anonymous';
      
      await new Promise((resolve, reject) => {
        imgElement.onload = resolve;
        imgElement.onerror = reject;
        imgElement.src = img.url;
      });

      // Provide image element to colorthief
      const palette = colorThief.getPalette(imgElement, 10);
      
      const weightMultiplier = img.isLogo ? 3 : 1;

      palette.forEach((rgb: [number, number, number], index: number) => {
        if (isGrayscale(rgb)) return;

        const hex = rgbToHex(rgb[0], rgb[1], rgb[2]);
        // Weight is higher for primary colors in palette and for logos
        const weight = (10 - index) * weightMultiplier;
        
        if (colorMap.has(hex)) {
          colorMap.get(hex)!.weight += weight;
        } else {
          colorMap.set(hex, { hex, rgb, weight });
        }
      });
    } catch (e) {
      console.warn('Failed to extract colors from image:', img.url);
    }
  }

  // Sort by weight (frequency/priority)
  return Array.from(colorMap.values())
    .sort((a, b) => b.weight - a.weight)
    .slice(0, maxColors);
}
