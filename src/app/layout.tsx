import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { GeistSans } from 'geist/font/sans';
import './globals.css';
import { Providers } from '@/components/providers';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});
const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Planic AI — The AI Accountability Operating System',
  description:
    'Planic AI is your AI executive assistant. It reads your inbox, plans your work, predicts failure, and intervenes before you miss what matters. Not another task manager — an AI accountability operating system.',
  keywords: [
    'AI productivity',
    'accountability app',
    'AI planner',
    'Gemini',
    'task manager',
    'deadline tracker',
    'student productivity',
  ],
  authors: [{ name: 'Planic AI' }],
  openGraph: {
    title: 'Planic AI — The AI Accountability Operating System',
    description:
      'Your AI executive assistant. It thinks, plans, prioritizes, schedules, predicts failure, and intervenes before you miss what matters.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0B1020' },
    { media: '(prefers-color-scheme: light)', color: '#F8FAFC' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${mono.variable} ${GeistSans.variable}`}>
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
