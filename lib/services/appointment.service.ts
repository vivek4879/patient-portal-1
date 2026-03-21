import { PrismaClient } from '@prisma/client'
import { AppointmentPayload, Appointment } from '../types'

const prisma = new PrismaClient()

export class AppointmentService {
  static async createAppointment(patientId: number, data: AppointmentPayload): Promise<Appointment> {
    return prisma.appointment.create({
      data: {
        patientId,
        provider: data.provider,
        datetime: new Date(data.datetime),
        repeat: data.repeat
      }
    })
  }

  static async getAppointmentsForPatient(patientId: number): Promise<Appointment[]> {
    return prisma.appointment.findMany({
      where: { patientId },
      orderBy: { datetime: 'asc' }
    })
  }

  static async getAppointmentById(id: number): Promise<Appointment | null> {
    return prisma.appointment.findUnique({ where: { id } })
  }
  
  static async updateAppointment(id: number, data: AppointmentPayload): Promise<Appointment> {
    return prisma.appointment.update({
      where: { id },
      data: {
        provider: data.provider,
        datetime: new Date(data.datetime),
        repeat: data.repeat
      }
    })
  }

  static async deleteAppointment(id: number): Promise<void> {
    await prisma.appointment.delete({
      where: { id }
    })
  }
}
