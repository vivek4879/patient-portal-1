import { PrismaClient } from '@prisma/client'
import { PrescriptionPayload, FullPrescription } from '../types'

const prisma = new PrismaClient()

export class PrescriptionService {
  static async createPrescription(patientId: number, data: PrescriptionPayload): Promise<FullPrescription> {
    if (data.quantity <= 0) throw new Error("Quantity must be greater than 0")
    
    return prisma.prescription.create({
      data: {
        patientId,
        medicationId: data.medicationId,
        dosageId: data.dosageId,
        quantity: data.quantity,
        refill_on: new Date(data.refill_on),
        refill_schedule: data.refill_schedule
      },
      include: { medication: true, dosage: true }
    })
  }

  static async getPrescriptionById(id: number): Promise<FullPrescription | null> {
    return prisma.prescription.findUnique({ where: { id }, include: { medication: true, dosage: true } })
  }
  
  static async updatePrescription(id: number, data: PrescriptionPayload): Promise<FullPrescription> {
    if (data.quantity <= 0) throw new Error("Quantity must be greater than 0")
    return prisma.prescription.update({
      where: { id },
      data: {
        medicationId: data.medicationId,
        dosageId: data.dosageId,
        quantity: data.quantity,
        refill_on: new Date(data.refill_on),
        refill_schedule: data.refill_schedule
      },
      include: { medication: true, dosage: true }
    })
  }

  static async deletePrescription(id: number): Promise<void> {
    await prisma.prescription.delete({
      where: { id }
    })
  }

  static async getAllMedications() {
    return prisma.medication.findMany({ orderBy: { name: 'asc' } })
  }

  static async getAllDosages() {
    return prisma.dosage.findMany({ orderBy: { amount: 'asc' } })
  }
}
