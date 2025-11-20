# Foundrly Logo & Favicon Assets

## Logo Design Concept
The new Foundrly logo features a modern, geometric "F" lettermark that incorporates upward momentum symbolism. The design uses clean, minimalist lines with a subtle growth indicator (arrow + dot) in the upper right, representing elevation and forward progress.

## Design Specifications

### Color Palette
- **Primary Gradient**: Blue to Cyan (#3B82F6 → #0EA5E9 → #06B6D4)
- **Dark Version**: #1A1A1A (near-black)
- **Light Version**: #FFFFFF (white)

### Logo Variants
The logo supports three variants through the Logo component:
- `variant="color"` - Full color gradient (premium look)
- `variant="dark"` - Black monochrome (light backgrounds)
- `variant="light"` - White monochrome (dark backgrounds)

## Created Assets

### Logo Component
- **File**: `src/components/Logo.tsx`
- **Features**: Scalable SVG-based logo with gradient support
- **Props**: 
  - `variant`: 'dark' | 'light' | 'color'
  - `iconSize`: number (default: 32)
  - `showWordmark`: boolean (default: true)

### SVG Files (public/)
- `favicon.svg` - Main favicon (color gradient)
- `logo-icon.svg` - Full-size logo icon (512x512 viewbox)
- `logo-dark.svg` - Black version for light backgrounds
- `logo-light.svg` - White version for dark backgrounds

### Web Assets
- `site.webmanifest` - PWA manifest for progressive web app support
- `README-FAVICON.md` - Instructions for generating PNG favicon files

## Usage in Components

### Header Component
```tsx
<Logo variant="dark" iconSize={32} showWordmark={true} />
```

### Dashboard TopNav
```tsx
<Logo variant="dark" iconSize={28} showWordmark={true} />
```

### Footer (suggested)
```tsx
<Logo variant="light" iconSize={28} showWordmark={true} />
```

## Browser Support
- Modern browsers: SVG favicon with gradient
- Legacy browsers: Will need PNG fallbacks (see README-FAVICON.md)
- iOS/Apple devices: SVG works as Apple touch icon
- Android: SVG works with PWA manifest

## Meta Tags
The index.html has been updated with:
- Modern SVG favicon references
- Apple touch icon support
- PWA manifest link
- Theme color metadata (#3B82F6)
- Enhanced Open Graph tags
- Twitter card metadata
- SEO-optimized title and description

## Next Steps (Optional)
To generate PNG favicon files for maximum browser compatibility:
1. Visit https://realfavicongenerator.net/
2. Upload `public/logo-icon.svg`
3. Generate all sizes: 16x16, 32x32, 48x48, 180x180, 192x192, 512x512
4. Download and place in public/ directory
5. Generate favicon.ico with multiple resolutions

For now, the SVG favicon provides excellent support for all modern browsers.

## Design Philosophy
The logo embodies:
- **Modern minimalism**: Clean geometric shapes
- **Premium feel**: Subtle gradient with refined color palette
- **Growth symbolism**: Upward arrow and accent dot suggest momentum
- **Scalability**: Works perfectly from 16px to large hero sections
- **Versatility**: Color and monochrome variants for any context
