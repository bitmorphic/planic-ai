import { ImageResponse } from 'next/og';
import { LogoMarkGlyph } from '@/components/brand/logo-glyph';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

/**
 * Apple touch icon — gradient tile + centered brand mark.
 * Renders without browser CSS, so colors are hard-coded.
 */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#171717',
          borderRadius: 40,
        }}
      >
        <div style={{ display: 'flex', transform: 'scale(3.5)' }}>
          <LogoMarkGlyph />
        </div>
      </div>
    ),
    { ...size }
  );
}
