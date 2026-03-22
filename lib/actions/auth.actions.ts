'use server'

import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'
import { createSession } from '../utils/session'
import { redirect } from 'next/navigation'

const prisma = new PrismaClient()

export type AuthState = {
  error?: string
}

export async function loginAction(prevState: AuthState, formData: FormData): Promise<AuthState> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: "Please provide both an email and password." }
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return { error: "Invalid email or password." }
    }

    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      return { error: "Invalid email or password." }
    }

    await createSession(user.id)
  } catch (error) {
    return { error: "An unexpected error occurred during login. Please try again." }
  }

  // Redirect must happen outside try/catch
  redirect('/portal')
}
