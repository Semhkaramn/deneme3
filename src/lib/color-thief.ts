// Simple color thief implementation
export function extractDominantColor(imageData: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        resolve('#FF9900'); // fallback color
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      try {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Count color frequencies
        const colorCount: { [key: string]: number } = {};

        for (let i = 0; i < data.length; i += 16) { // Sample every 4th pixel for performance
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const a = data[i + 3];

          // Skip transparent pixels
          if (a < 125) continue;

          // Skip very light/dark colors
          const brightness = (r * 299 + g * 587 + b * 114) / 1000;
          if (brightness < 50 || brightness > 200) continue;

          // Round colors to reduce variants
          const roundedR = Math.round(r / 32) * 32;
          const roundedG = Math.round(g / 32) * 32;
          const roundedB = Math.round(b / 32) * 32;

          const colorKey = `${roundedR},${roundedG},${roundedB}`;
          colorCount[colorKey] = (colorCount[colorKey] || 0) + 1;
        }

        // Find most common color
        let maxCount = 0;
        let dominantColor = '255,153,0'; // fallback

        for (const [color, count] of Object.entries(colorCount)) {
          if (count > maxCount) {
            maxCount = count;
            dominantColor = color;
          }
        }

        const [r, g, b] = dominantColor.split(',').map(Number);
        const hexColor = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;

        resolve(hexColor);
      } catch (error) {
        console.error('Color extraction error:', error);
        resolve('#FF9900');
      }
    };

    img.onerror = () => {
      resolve('#FF9900');
    };

    img.src = imageData;
  });
}

// Gaming-themed color palette for fallbacks
export const GAMING_COLORS = [
  '#FF6B35', // Orange
  '#F7931E', // Amber
  '#FFD700', // Gold
  '#32CD32', // Lime Green
  '#00CED1', // Dark Turquoise
  '#1E90FF', // Dodger Blue
  '#8A2BE2', // Blue Violet
  '#FF1493', // Deep Pink
  '#FF4500', // Orange Red
  '#00FF7F', // Spring Green
];

export function getRandomGamingColor(): string {
  return GAMING_COLORS[Math.floor(Math.random() * GAMING_COLORS.length)];
}
