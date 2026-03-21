'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { mapApiErrors } from '@/lib/forms'
import { labels } from '@/lib/labels'
import { useResetPassword } from '../hooks'
import { resetPasswordSchema, type ResetPasswordFormValues } from '../schemas'

export function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const resetPassword = useResetPassword()

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: searchParams.get('token') ?? '',
      email: searchParams.get('email') ?? '',
      password: '',
      password_confirmation: '',
    },
  })

  async function onSubmit(values: ResetPasswordFormValues) {
    try {
      await resetPassword.mutateAsync(values)
      toast.success(labels.auth.resetSuccess)
      router.push('/login')
    } catch (error) {
      mapApiErrors(error, form.setError)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{labels.auth.resetPassword}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{labels.auth.newPassword}</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password_confirmation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{labels.auth.confirmPassword}</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={resetPassword.isPending}>
              {resetPassword.isPending ? labels.common.loading : labels.auth.resetPassword}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
