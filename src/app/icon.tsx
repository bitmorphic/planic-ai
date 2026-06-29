import { ImageResponse } from 'next/og';
import { LogoMarkGlyph } from '@/components/brand/logo-glyph';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

/**
 * Dynamic favicon — gradient tile + the Planic AI mark.
 * Matches the in-app logo so the browser tab reflects the brand.
 */
export default function Icon() {
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
          borderRadius: 8,
        }}
      >
        <LogoMarkGlyph />
      </div>
    ),
    { ...size }
  );
}
