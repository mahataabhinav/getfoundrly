import ColorThief from 'colorthief';

/**
 * Extract dominant colors from image URLs using ColorThief pixel analysis.
 * Prioritizes logo/brand images and ranks colors by frequency.
 */
export async function extractColorsFromImages(
  imageUrls: string[],
  options: {
    maxImages?: number;
    colorsPerImage?: number;
    quality?: number;
  } = {}
): Promise<{ colors: string[]; colorFrequency: Map<string, number> }> {
  const { maxImages = 5, colorsPerImage = 5, quality = 10 } = options;

  const colorThief = new ColorThief();
  const colorFrequency = new Map<string, number>();
  const allColors: string[] = [];

  // Prioritize logo/brand images first
  const logoImages = imageUrls.filter(url =>
    url.toLowerCase().includes('logo') ||
    url.toLowerCase().includes('brand')
  );
  const otherImages = imageUrls.filter(url =>
    !url.toLowerCase().includes('logo') &&
    !url.toLowerCase().includes('brand')
  );

  const prioritizedImages = [...logoImages, ...otherImages].slice(0, maxImages);

  for (const url of prioritizedImages) {
    try {
      const img = await loadImage(url);

      // Get dominant color (weighted 3x for ranking)
      const dominantRgb = colorThief.getColor(img, quality);
      const dominantHex = rgbToHex(dominantRgb);
      allColors.push(dominantHex);
      colorFrequency.set(dominantHex, (colorFrequency.get(dominantHex) || 0) + 3);

      // Get color palette
      const palette = colorThief.getPalette(img, colorsPerImage, quality);
      palette.forEach((rgb: number[]) => {
        const hex = rgbToHex(rgb);
        allColors.push(hex);
        colorFrequency.set(hex, (colorFrequency.get(hex) || 0) + 1);
      });
    } catch (err) {
      console.warn(`Failed to extract colors from image: ${url}`, err);
    }
  }

  // Sort unique colors by frequency (most frequent first)
  const sortedColors = Array.from(new Set(allColors)).sort((a, b) => {
    return (colorFrequency.get(b) || 0) - (colorFrequency.get(a) || 0);
  });

  return { colors: sortedColors, colorFrequency };
}

/**
 * Load image with CORS support for cross-origin pixel analysis.
 */
function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
    img.src = url;
  });
}

/**
 * Convert RGB array to hex color code.
 */
function rgbToHex(rgb: number[]): string {
  return '#' + rgb.map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

/**
 * Filter out near-grayscale colors to keep only brand-relevant colors.
 * Grayscale colors have similar R, G, B values (maxDiff <= 15).
 */
export function filterBrandColors(colors: string[]): string[] {
  return colors.filter(hex => {
    const rgb = hexToRgb(hex);
    if (!rgb) return false;
    const [r, g, b] = rgb;
    const maxDiff = Math.max(Math.abs(r - g), Math.abs(g - b), Math.abs(r - b));
    return maxDiff > 15;
  });
}

/**
 * Convert hex color code to RGB array.
 */
function hexToRgb(hex: string): number[] | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ] : null;
}
