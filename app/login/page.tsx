import { LoginForm } from '@/modules/auth/components/LoginForm'
import Link from 'next/link'
import { labels } from '@/lib/labels'

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center gap-4">
      <LoginForm />
      <Link href="/forgot-password" className="text-sm text-muted-foreground hover:underline">
        {labels.auth.forgotPassword}
      </Link>
    </div>
  )
}
