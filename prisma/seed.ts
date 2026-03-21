import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log(`Start seeding ...`)

  // Fetch the data from the gist
  const response = await fetch('https://gist.githubusercontent.com/sbraford/73f63d75bb995b6597754c1707e40cc2/raw')
  const data = await response.json()

  // 1. Seed Medications
  console.log('Seeding Medications...')
  for (const medName of data.medications) {
    await prisma.medication.upsert({
      where: { name: medName },
      update: {},
      create: { name: medName },
    })
  }

  // 2. Seed Dosages
  console.log('Seeding Dosages...')
  for (const dosageAmount of data.dosages) {
    await prisma.dosage.upsert({
      where: { amount: dosageAmount },
      update: {},
      create: { amount: dosageAmount },
    })
  }

  // 3. Seed Users
  console.log('Seeding Users...')
  for (const user of data.users) {
    const hashedPassword = await bcrypt.hash(user.password, 10)
    
    // Create User Document
    const dbUser = await prisma.user.upsert({
       where: { email: user.email },
       update: { password: hashedPassword },
       create: {
         name: user.name,
         email: user.email,
         password: hashedPassword,
       }
    })

    console.log(`Created user with email: ${dbUser.email}`)

    // Wipe existing related data for a clean re-seed
    await prisma.appointment.deleteMany({ where: { patientId: dbUser.id } })
    await prisma.prescription.deleteMany({ where: { patientId: dbUser.id } })

    for (const appt of user.appointments) {
      await prisma.appointment.create({
        data: {
          patientId: dbUser.id,
          provider: appt.provider,
          datetime: new Date(appt.datetime),
          repeat: appt.repeat
        }
      })
    }

    for (const presc of user.prescriptions) {
      // Find the corresponding Medication and Dosage IDs
      const med = await prisma.medication.findUnique({ where: { name: presc.medication } })
      const dos = await prisma.dosage.findUnique({ where: { amount: presc.dosage } })

      if (med && dos) {
        await prisma.prescription.create({
          data: {
            patientId: dbUser.id,
            medicationId: med.id,
            dosageId: dos.id,
            quantity: presc.quantity,
            refill_on: new Date(presc.refill_on),
            refill_schedule: presc.refill_schedule
          }
        })
      }
    }
  }
  
  console.log(`Seeding finished.`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
