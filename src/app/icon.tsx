export const runtime = 'edge';

export const size = {
  width: 32,
  height: 32,
};

export const contentType = 'image/png';

// Generate multiple icon sizes
export function generateIcons() {
  const sizes = [32, 192];
  return sizes.map((size) => ({
    size: { width: size, height: size },
    contentType: 'image/png',
  }));
}

export default function Icon() {
  return new Response(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
      <defs>
        <linearGradient id="iconGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#2563eb;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#7c3aed;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" fill="url(#iconGrad)" rx="6"/>
      <text x="16" y="24" font-size="20" text-anchor="middle" fill="white">🚀</text>
    </svg>`,
    {
      headers: {
        'Content-Type': 'image/svg+xml',
      },
    }
  );
}
