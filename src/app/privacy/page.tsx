import { MarketingHeader } from '@/components/marketing/header';
import { Footer } from '@/components/marketing/footer';

export default function PrivacyPolicy() {
  return (
    <>
      <MarketingHeader />
      <main className="min-h-screen pt-32 pb-24">
        <div className="container max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight mb-8">Privacy Policy</h1>
          <div className="space-y-6 text-muted-foreground leading-relaxed">
            <p>Last updated: June 30, 2026</p>
            
            <section className="space-y-4 text-foreground">
              <h2 className="text-2xl font-semibold mt-8">1. Introduction</h2>
              <p className="text-muted-foreground">
                Welcome to Planic AI. We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our web application and services.
              </p>
            </section>

            <section className="space-y-4 text-foreground">
              <h2 className="text-2xl font-semibold mt-8">2. Information We Collect</h2>
              <p className="text-muted-foreground">
                <strong>Google Account Information:</strong> When you connect your Google account, we access your basic profile information (name, email, avatar).
              </p>
              <p className="text-muted-foreground">
                <strong>Gmail Data:</strong> Our Gmail Intelligence agent requests read-only access to your inbox to scan for tasks, assignments, bills, and interviews. We only extract task-relevant metadata. We do not store your entire email history or sell your personal data.
              </p>
            </section>

            <section className="space-y-4 text-foreground">
              <h2 className="text-2xl font-semibold mt-8">3. How We Use Your Information</h2>
              <p className="text-muted-foreground">
                We use the information we collect primarily to provide, maintain, and improve our services. Specifically, we use it to:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Automatically extract and manage your tasks and deadlines.</li>
                <li>Personalize the AI insights and suggestions in your dashboard.</li>
                <li>Ensure the security and functionality of the application.</li>
              </ul>
            </section>

            <section className="space-y-4 text-foreground">
              <h2 className="text-2xl font-semibold mt-8">4. Data Storage & Security</h2>
              <p className="text-muted-foreground">
                Your extracted tasks and application data are securely stored using Google Cloud and Firebase infrastructure. We implement standard security measures to protect your data. Authentication is handled securely via NextAuth and Google OAuth.
              </p>
            </section>

            <section className="space-y-4 text-foreground">
              <h2 className="text-2xl font-semibold mt-8">5. Contact Us</h2>
              <p className="text-muted-foreground">
                If you have questions or comments about this Privacy Policy, please contact us or the developer directly.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
