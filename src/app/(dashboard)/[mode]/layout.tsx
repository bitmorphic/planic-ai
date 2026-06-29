import { AppShell } from '@/components/app/app-shell';
import { DataProvider } from '@/contexts/data-context';

export default async function AppLayout({ children, params }: { children: React.ReactNode, params: Promise<{ mode: string }> }) {
  const { mode } = await params;
  const isLive = mode === 'app';

  return (
    <DataProvider mode={isLive ? 'live' : 'demo'}>
      <AppShell>{children}</AppShell>
    </DataProvider>
  );
}
