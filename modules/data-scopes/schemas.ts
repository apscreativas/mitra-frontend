import { z } from 'zod'

export const dataScopeRuleSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  entity: z.string().min(1, 'La entidad es requerida'),
  entity_label: z.string().min(1, 'La etiqueta de entidad es requerida'),
  type: z.enum(['own', 'relation', 'field_value', 'all', 'custom']),
  configuration: z.record(z.string(), z.unknown()),
  description: z.string().nullable().optional(),
})

export type DataScopeRuleFormValues = z.infer<typeof dataScopeRuleSchema>
