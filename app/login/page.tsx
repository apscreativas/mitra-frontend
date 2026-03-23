import { LoginForm } from '@/modules/auth/components/LoginForm'
import { labels } from '@/lib/labels'
import { Building2, ShieldCheck, ScrollText, Scale } from 'lucide-react'

export default function LoginPage() {
  return (
    <main className="flex min-h-screen">
      {/* Left Panel — Branding */}
      <section className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-16 overflow-hidden bg-gradient-to-br from-primary-dark to-primary">
        {/* Decorative blurred circles */}
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-80 h-80 rounded-full bg-primary/20 blur-2xl" />

        {/* Top: Logo + Headline */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
              <Building2 className="size-7 text-primary" />
            </div>
            <h1 className="font-headline font-extrabold text-3xl tracking-tight text-white">
              {labels.branding.appName}
            </h1>
          </div>
          <div className="mt-20">
            <h2 className="font-headline text-5xl font-bold text-white leading-tight max-w-md">
              {labels.branding.headline}
            </h2>
            <p className="mt-6 text-primary-foreground/80 text-lg max-w-sm">
              {labels.branding.tagline}
            </p>
          </div>
        </div>

        {/* Bottom: Features glass card */}
        <div className="relative z-10">
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-8 max-w-sm">
            <ul className="space-y-6">
              <li className="flex items-center gap-4 text-white">
                <ShieldCheck className="size-6 text-blue-200 shrink-0" />
                <span className="font-medium">{labels.branding.featureAccess}</span>
              </li>
              <li className="flex items-center gap-4 text-white">
                <ScrollText className="size-6 text-blue-200 shrink-0" />
                <span className="font-medium">{labels.branding.featureTraceability}</span>
              </li>
              <li className="flex items-center gap-4 text-white">
                <Scale className="size-6 text-blue-200 shrink-0" />
                <span className="font-medium">{labels.branding.featureAudit}</span>
              </li>
            </ul>
          </div>
        </div>

        <footer className="relative z-10 text-white/40 text-sm">
          {labels.branding.copyright}
        </footer>
      </section>

      {/* Right Panel — Login Form */}
      <section className="w-full lg:w-1/2 bg-background flex flex-col items-center justify-center px-8 sm:px-16 md:px-24">
        {/* Mobile-only logo */}
        <div className="lg:hidden mb-12 flex items-center gap-2">
          <Building2 className="size-8 text-primary" />
          <span className="font-headline font-extrabold text-2xl text-primary">
            {labels.branding.appName}
          </span>
        </div>

        <div className="w-full max-w-md space-y-10">
          {/* Header */}
          <div className="text-center lg:text-left">
            <h3 className="font-headline text-3xl font-bold text-foreground">
              {labels.auth.login}
            </h3>
            <p className="text-muted-foreground mt-2">
              {labels.auth.loginSubtitle}
            </p>
          </div>

          {/* Form */}
          <LoginForm />

          {/* Footer */}
          <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground uppercase tracking-widest">
            <span>{labels.branding.version}</span>
            <div className="flex gap-6">
              <a className="hover:text-primary transition-colors" href="#">
                {labels.branding.privacy}
              </a>
              <a className="hover:text-primary transition-colors" href="#">
                {labels.branding.support}
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
