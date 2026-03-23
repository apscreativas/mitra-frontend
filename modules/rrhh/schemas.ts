import { z } from 'zod'

// Area
export const createAreaSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(255),
  max_positions: z.coerce.number().min(1, 'Debe ser al menos 1'),
})

export const updateAreaSchema = z.object({
  name: z.string().min(1).max(255),
  max_positions: z.coerce.number().min(1),
  status: z.enum(['active', 'inactive']).optional(),
})

export type CreateAreaFormValues = z.infer<typeof createAreaSchema>
export type UpdateAreaFormValues = z.infer<typeof updateAreaSchema>

// Document
export const createDocumentSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(255),
  description: z.string().max(1000).optional().nullable(),
  is_required_by_default: z.boolean(),
})

export const updateDocumentSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().max(1000).optional().nullable(),
  is_required_by_default: z.boolean(),
  status: z.enum(['active', 'inactive']).optional(),
})

export type CreateDocumentFormValues = z.infer<typeof createDocumentSchema>
export type UpdateDocumentFormValues = z.infer<typeof updateDocumentSchema>

// Position
export const positionDocumentSchema = z.object({
  document_id: z.string().min(1),
  is_required: z.boolean(),
})

export const createPositionSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(255),
  area_id: z.string().min(1, 'El área es requerida'),
  authorized_positions: z.coerce.number().min(1, 'Debe ser al menos 1'),
  reports_to_id: z.string().nullable().optional(),
  documents: z.array(positionDocumentSchema).optional().default([]),
})

export const updatePositionSchema = z.object({
  name: z.string().min(1).max(255),
  area_id: z.string().min(1),
  authorized_positions: z.coerce.number().min(1),
  reports_to_id: z.string().nullable().optional(),
  status: z.enum(['active', 'inactive']).optional(),
  documents: z.array(positionDocumentSchema).optional().default([]),
})

export type CreatePositionFormValues = z.infer<typeof createPositionSchema>
export type UpdatePositionFormValues = z.infer<typeof updatePositionSchema>
