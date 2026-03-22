'use server'

import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'
import { redirect } from 'next/navigation'

const prisma = new PrismaClient()

export type ActionState = {
  error?: string
}

export async function createPatientAction(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!name || !email || !password) {
    return { error: "Please fill out all required fields." }
  }

  if (password.length < 8) {
    return { error: "Portal password must be at least 8 characters." }
  }

  let newPatientId: number;

  try {
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return { error: "A patient with this email address is already enrolled." }
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    
    const newPatient = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    })

    newPatientId = newPatient.id
  } catch (error) {
    return { error: "Failed to enroll patient. Database error occurred." }
  }
  
  redirect(`/admin/patient/${newPatientId}`)
}
