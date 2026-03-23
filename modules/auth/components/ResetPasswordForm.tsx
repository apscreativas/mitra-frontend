'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { Lock, Eye, EyeOff, KeyRound } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupButton,
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
import { useResetPassword } from '../hooks'
import { resetPasswordSchema, type ResetPasswordFormValues } from '../schemas'

export function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const resetPassword = useResetPassword()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* New password */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-foreground/80 px-1">
                {labels.auth.newPassword}
              </FormLabel>
              <FormControl>
                <InputGroup className="h-14 rounded-xl">
                  <InputGroupAddon>
                    <Lock className="size-5 text-muted-foreground" />
                  </InputGroupAddon>
                  <InputGroupInput
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="••••••••"
                    className="h-14"
                    {...field}
                  />
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton
                      size="icon-xs"
                      variant="ghost"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    >
                      {showPassword ? (
                        <EyeOff className="size-5 text-muted-foreground" />
                      ) : (
                        <Eye className="size-5 text-muted-foreground" />
                      )}
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Confirm password */}
        <FormField
          control={form.control}
          name="password_confirmation"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-foreground/80 px-1">
                {labels.auth.confirmPassword}
              </FormLabel>
              <FormControl>
                <InputGroup className="h-14 rounded-xl">
                  <InputGroupAddon>
                    <Lock className="size-5 text-muted-foreground" />
                  </InputGroupAddon>
                  <InputGroupInput
                    type={showConfirm ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="••••••••"
                    className="h-14"
                    {...field}
                  />
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton
                      size="icon-xs"
                      variant="ghost"
                      onClick={() => setShowConfirm(!showConfirm)}
                      aria-label={showConfirm ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    >
                      {showConfirm ? (
                        <EyeOff className="size-5 text-muted-foreground" />
                      ) : (
                        <Eye className="size-5 text-muted-foreground" />
                      )}
                    </InputGroupButton>
                  </InputGroupAddon>
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
          disabled={resetPassword.isPending}
        >
          <span>{resetPassword.isPending ? labels.common.loading : labels.auth.resetPassword}</span>
          <KeyRound className="size-5" />
        </Button>
      </form>
    </Form>
  )
}
