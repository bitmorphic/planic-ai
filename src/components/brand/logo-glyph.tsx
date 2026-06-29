/**
 * Static glyph for OG/image rendering (favicon, app icon).
 * Uses hard-coded brand colors — NOT CSS variables — because
 * next/og ImageResponse renders in isolation (no browser CSS).
 */
export function LogoMarkGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="12" y="0" width="8" height="8" fill="white" />
      <rect x="4" y="8" width="8" height="8" fill="white" />
      <rect x="20" y="8" width="8" height="8" fill="white" />
      <rect x="12" y="16" width="8" height="8" fill="white" />
      <rect x="4" y="24" width="8" height="8" fill="white" />
    </svg>
  );
}
