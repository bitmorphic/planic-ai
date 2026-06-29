import { MarketingHeader } from '@/components/marketing/header';
import { Hero } from '@/components/marketing/hero';
import { TechLogos } from '@/components/marketing/tech-logos';
import { HowItWorks } from '@/components/marketing/how-it-works';
import { Bento } from '@/components/marketing/bento';
import { DashboardShowcase } from '@/components/marketing/dashboard-showcase';
import { PlanicShowcase } from '@/components/marketing/planic-showcase';
import { CtaFaq } from '@/components/marketing/cta-faq';
import { Footer } from '@/components/marketing/footer';

export default function Home() {
  return (
    <>
      <MarketingHeader />
      <main>
        {/* Section 1 — Hero */}
        <Hero />
        {/* Section 2 — Trusted Technology */}
        <TechLogos />
        {/* Section 3 — How It Works */}
        <HowItWorks />
        {/* Section 4 — Feature Bento Grid (10 agents absorbed) */}
        <Bento />
        {/* Section 5 — Dashboard Showcase */}
        <DashboardShowcase />
        {/* Section 6 — Planic AI Showcase */}
        <PlanicShowcase />
        {/* Section 7 — CTA + FAQ */}
        <CtaFaq />
      </main>
      <Footer />
    </>
  );
}
