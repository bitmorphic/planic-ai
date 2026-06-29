'use client';

import { signIn } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Sparkles, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { LogoMark } from '@/components/brand/logo-mark';
import { Wordmark } from '@/components/brand/wordmark';
import { GoogleLogo } from '@/components/brand/google-logo';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    signIn('google', { callbackUrl: '/app' });
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-elev-3"
      >
        <div className="flex flex-col items-center text-center">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-foreground text-background">
            <LogoMark size={24} className="text-background" />
          </div>
          <div className="mt-4">
            <Wordmark size="lg" />
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Sign in to access your AI accountability operating system.
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <Button
            onClick={handleLogin}
            disabled={loading}
            size="xl"
            className="w-full gap-2 bg-foreground text-background hover:bg-foreground/90"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <GoogleLogo className="h-4 w-4" />}
            Continue with Google
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
