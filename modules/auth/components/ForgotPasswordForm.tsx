'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Mail, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-foreground/80 px-1">
                {labels.auth.email}
              </FormLabel>
              <FormControl>
                <InputGroup className="h-14 rounded-xl">
                  <InputGroupAddon>
                    <Mail className="size-5 text-muted-foreground" />
                  </InputGroupAddon>
                  <InputGroupInput
                    type="email"
                    autoComplete="email"
                    placeholder={labels.auth.emailPlaceholder}
                    className="h-14"
                    {...field}
                  />
                </InputGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          size="lg"
          className="w-full h-14 font-headline font-bold rounded-xl shadow-lg shadow-primary/20 text-base gap-2"
          disabled={forgotPassword.isPending}
        >
          <span>{forgotPassword.isPending ? labels.common.loading : labels.auth.sendResetLink}</span>
          <Send className="size-5" />
        </Button>
      </form>
    </Form>
  )
}
