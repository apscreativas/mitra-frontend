import { ForgotPasswordForm } from '@/modules/auth/components/ForgotPasswordForm'
import Link from 'next/link'
import { labels } from '@/lib/labels'

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40">
      <div className="flex flex-col items-center gap-4">
        <ForgotPasswordForm />
        <Link href="/login" className="text-sm text-muted-foreground hover:underline">
          {labels.auth.login}
        </Link>
      </div>
    </div>
  )
}
