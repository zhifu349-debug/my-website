export const runtime = 'edge';

export const size = {
  width: 180,
  height: 180,
};
export const contentType = 'image/png';

export default function AppleIcon() {
  return new Response(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180">
      <rect width="180" height="180" fill="#2563eb" rx="40"/>
      <text x="90" y="115" font-size="90" text-anchor="middle" fill="white">🚀</text>
    </svg>`,
    {
      headers: {
        'Content-Type': 'image/svg+xml',
      },
    }
  );
}
