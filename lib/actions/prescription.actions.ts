'use server'

import { PrescriptionService } from '../services/prescription.service'
import { PrescriptionSchema } from '../validations'
import { redirect } from 'next/navigation'

export type ActionState = {
  error?: string
}

export async function createPrescriptionAction(patientId: number, prevState: ActionState, formData: FormData): Promise<ActionState> {
  const medicationId = parseInt(formData.get('medicationId') as string)
  const dosageId = parseInt(formData.get('dosageId') as string)
  const quantity = parseInt(formData.get('quantity') as string)
  const refill_on = formData.get('refill_on') as string
  const refill_schedule = formData.get('refill_schedule') as "none" | "weekly" | "monthly"

  try {
    const parsed = PrescriptionSchema.parse({
      medicationId,
      dosageId,
      quantity,
      refill_on,
      refill_schedule
    })

    await PrescriptionService.createPrescription(patientId, parsed)
  } catch (error: any) {
    if (error.errors && error.errors[0]) {
      return { error: error.errors[0].message }
    }
    return { error: "Failed to issue prescription. Database error occurred." }
  }
  
  redirect(`/admin/patient/${patientId}`)
}
