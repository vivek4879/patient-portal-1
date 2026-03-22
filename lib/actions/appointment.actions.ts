'use server'

import { AppointmentService } from '../services/appointment.service'
import { AppointmentSchema } from '../validations'
import { redirect } from 'next/navigation'

export type ActionState = {
  error?: string
}

export async function createAppointmentAction(patientId: number, prevState: ActionState, formData: FormData): Promise<ActionState> {
  const provider = formData.get('provider') as string
  const datetime = formData.get('datetime') as string
  const repeat = formData.get('repeat') as "none" | "weekly" | "monthly"

  try {
    const parsed = AppointmentSchema.parse({
      provider,
      datetime,
      repeat
    })

    await AppointmentService.createAppointment(patientId, parsed)
  } catch (error: any) {
    if (error.errors && error.errors[0]) {
      return { error: error.errors[0].message }
    }
    return { error: "Failed to schedule appointment. Database error occurred." }
  }
  
  redirect(`/admin/patient/${patientId}`)
}
