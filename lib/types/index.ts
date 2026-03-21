// This file acts as the single source of truth for all foundational types in the application.
// We avoid declaring one-off interfaces inside separate TSX components to maintain code quality.
import { 
  User as PrismaUser, 
  Appointment as PrismaAppointment, 
  Prescription as PrismaPrescription, 
  Medication as PrismaMedication, 
  Dosage as PrismaDosage 
} from "@prisma/client"

export type User = PrismaUser
export type Appointment = PrismaAppointment
export type Prescription = PrismaPrescription
export type Medication = PrismaMedication
export type Dosage = PrismaDosage

// Aggregated UI Model Types
export type FullPrescription = Prescription & {
  medication: Medication
  dosage: Dosage
}

export type FullPatient = User & {
  appointments: Appointment[]
  prescriptions: FullPrescription[]
}

// Form Payload Types
export type LoginPayload = {
  email?: string
  password?: string
}

export type AppointmentPayload = {
  provider: string
  datetime: string
  repeat: "none" | "weekly" | "monthly"
}

export type PrescriptionPayload = {
  medicationId: number
  dosageId: number
  quantity: number
  refill_on: string
  refill_schedule: "none" | "monthly" | "weekly"
}
