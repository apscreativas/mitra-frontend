import { LoginForm } from '@/modules/auth/components/LoginForm'
import { AuthShell } from '@/modules/auth/components/AuthShell'
import { labels } from '@/lib/labels'

export default function LoginPage() {
  return (
    <AuthShell title={labels.auth.login} subtitle={labels.auth.loginSubtitle}>
      <LoginForm />
    </AuthShell>
  )
}
