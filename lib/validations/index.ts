import { z } from 'zod'

export const PrescriptionSchema = z.object({
  medicationId: z.number().int().positive(),
  dosageId: z.number().int().positive(),
  quantity: z.number().int().min(1, "Quantity must be strictly greater than 0"),
  refill_on: z.string().min(1, "Refill date is required"),
  refill_schedule: z.enum(["none", "weekly", "monthly"])
})

export const AppointmentSchema = z.object({
  provider: z.string().min(1, "Provider name is required"),
  datetime: z.string().min(1, "Date and time are required"),
  repeat: z.enum(["none", "weekly", "monthly"])
})
