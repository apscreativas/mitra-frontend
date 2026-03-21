'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { mapApiErrors } from '@/lib/forms'
import { labels } from '@/lib/labels'
import { useForgotPassword } from '../hooks'
import { forgotPasswordSchema, type ForgotPasswordFormValues } from '../schemas'

export function ForgotPasswordForm() {
  const forgotPassword = useForgotPassword()

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  })

  async function onSubmit(values: ForgotPasswordFormValues) {
    try {
      await forgotPassword.mutateAsync(values)
      toast.success(labels.auth.resetSent)
    } catch (error) {
      mapApiErrors(error, form.setError)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{labels.auth.forgotPassword}</CardTitle>
        <CardDescription>{labels.auth.resetSent}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{labels.auth.email}</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={forgotPassword.isPending}>
              {forgotPassword.isPending ? labels.common.loading : labels.auth.sendResetLink}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
