import { z } from 'zod'

export const createUserSchema = z
  .object({
    name: z.string().min(1, 'El nombre es requerido'),
    email: z.string().min(1, 'El correo es requerido').email('Correo inválido'),
    password: z.string().min(8, 'Mínimo 8 caracteres'),
    password_confirmation: z.string().min(8),
    phone: z.string().optional(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Las contraseñas no coinciden',
    path: ['password_confirmation'],
  })

export type CreateUserFormValues = z.infer<typeof createUserSchema>

export const updateUserSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  email: z.string().min(1).email('Correo inválido'),
  phone: z.string().optional().nullable(),
  status: z.enum(['active', 'inactive', 'blocked']).optional(),
})

export type UpdateUserFormValues = z.infer<typeof updateUserSchema>
