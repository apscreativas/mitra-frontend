import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { ForgotPasswordForm } from '@/modules/auth/components/ForgotPasswordForm'
import { AuthShell } from '@/modules/auth/components/AuthShell'
import { labels } from '@/lib/labels'

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title={labels.auth.forgotPassword}
      subtitle={labels.auth.forgotPasswordSubtitle}
      footer={
        <div className="flex justify-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            <ArrowLeft className="size-4" />
            {labels.auth.backToLogin}
          </Link>
        </div>
      }
    >
      <ForgotPasswordForm />
    </AuthShell>
  )
}
