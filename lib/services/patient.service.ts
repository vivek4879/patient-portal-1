import { PrismaClient } from '@prisma/client'
import { FullPatient, User } from '../types'

const prisma = new PrismaClient()

export class PatientService {
  static async getAllPatients(query?: string, page: number = 1, limit: number = 25) {
    const skip = (page - 1) * limit
    const where = query ? {
      OR: [
        { name: { contains: query, mode: 'insensitive' as const } },
        { email: { contains: query, mode: 'insensitive' as const } }
      ]
    } : undefined

    const [data, total] = await prisma.$transaction([
      prisma.user.findMany({
        where,
        orderBy: { name: 'asc' },
        skip,
        take: limit
      }),
      prisma.user.count({ where })
    ])

    return {
      data,
      meta: {
        total,
        page,
        totalPages: Math.ceil(total / limit)
      }
    }
  }

  static async getPatientById(id: number): Promise<FullPatient | null> {
    return prisma.user.findUnique({
      where: { id },
      include: {
        appointments: {
          orderBy: { datetime: 'asc' }
        },
        prescriptions: {
          include: {
            medication: true,
            dosage: true
          }
        }
      }
    })
  }

  static async getPatientByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email }
    })
  }

  static async updatePatient(id: number, data: Partial<User>): Promise<User> {
    return prisma.user.update({
      where: { id },
      data
    })
  }

  static async deletePatient(id: number): Promise<void> {
    await prisma.appointment.deleteMany({ where: { patientId: id } })
    await prisma.prescription.deleteMany({ where: { patientId: id } })
    await prisma.user.delete({
      where: { id }
    })
  }
}
