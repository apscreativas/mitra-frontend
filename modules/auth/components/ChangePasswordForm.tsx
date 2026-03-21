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
import { mapApiErrors } from '@/lib/forms'
import { labels } from '@/lib/labels'
import { useChangePassword } from '../hooks'
import { changePasswordSchema, type ChangePasswordFormValues } from '../schemas'

export function ChangePasswordForm() {
  const changePassword = useChangePassword()

  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { current_password: '', password: '', password_confirmation: '' },
  })

  async function onSubmit(values: ChangePasswordFormValues) {
    try {
      await changePassword.mutateAsync(values)
      toast.success(labels.auth.passwordChanged)
      form.reset()
    } catch (error) {
      mapApiErrors(error, form.setError)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="current_password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{labels.auth.currentPassword}</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
        <Button type="submit" disabled={changePassword.isPending}>
          {changePassword.isPending ? labels.common.loading : labels.auth.changePassword}
        </Button>
      </form>
    </Form>
  )
}
