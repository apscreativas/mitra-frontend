import { z } from 'zod'

export const roleSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  description: z.string().nullable().optional(),
})

export type RoleFormValues = z.infer<typeof roleSchema>

export const duplicateRoleSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
})

export type DuplicateRoleFormValues = z.infer<typeof duplicateRoleSchema>
