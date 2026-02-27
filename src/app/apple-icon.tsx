export const runtime = 'edge';

export const size = {
  width: 180,
  height: 180,
};

export const contentType = 'image/png';

export default function AppleIcon() {
  return new Response(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#2563eb;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#7c3aed;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="180" height="180" fill="url(#grad)" rx="40"/>
      <text x="90" y="130" font-size="100" text-anchor="middle" fill="white">🚀</text>
    </svg>`,
    {
      headers: {
        'Content-Type': 'image/svg+xml',
      },
    }
  );
}
