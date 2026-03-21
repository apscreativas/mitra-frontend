'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
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
import { useCreateRole, useUpdateRole } from '../hooks'
import { roleSchema, type RoleFormValues } from '../schemas'
import type { RoleFormProps } from '../types'

export function RoleForm({ defaultValues, roleId, mode }: RoleFormProps) {
  const router = useRouter()
  const createRole = useCreateRole()
  const updateRole = useUpdateRole()

  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema),
    defaultValues: defaultValues ?? { name: '', description: '' },
  })

  async function onSubmit(values: RoleFormValues) {
    try {
      if (mode === 'edit' && roleId) {
        await updateRole.mutateAsync({
          id: roleId,
          data: { ...values, description: values.description ?? null },
        })
        toast.success(labels.roles.updated)
      } else {
        await createRole.mutateAsync({
          name: values.name,
          description: values.description ?? undefined,
        })
        toast.success(labels.roles.created)
      }
      router.push('/roles')
    } catch (error) {
      mapApiErrors(error, form.setError)
    }
  }

  const isPending = createRole.isPending || updateRole.isPending

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{labels.roles.fields.name}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{labels.roles.fields.description}</FormLabel>
              <FormControl>
                <Textarea {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-2">
          <Button type="submit" disabled={isPending}>
            {isPending ? labels.common.loading : labels.common.save}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            {labels.common.cancel}
          </Button>
        </div>
      </form>
    </Form>
  )
}
