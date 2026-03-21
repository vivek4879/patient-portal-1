import { PatientService } from '@/lib/services/patient.service'
import { AppointmentService } from '@/lib/services/appointment.service'
import { AppointmentSchema } from '@/lib/validations'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, CalendarPlus } from 'lucide-react'

export default async function NewAppointment({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const patientId = parseInt(resolvedParams.id)
  if (isNaN(patientId)) return notFound()

  const patient = await PatientService.getPatientById(patientId)
  if (!patient) return notFound()

  async function createAppointment(formData: FormData) {
    'use server'
    const provider = formData.get('provider') as string
    const datetime = formData.get('datetime') as string
    const repeat = formData.get('repeat') as "none" | "weekly" | "monthly"

    // Strict Zod Validation
    const parsed = AppointmentSchema.parse({
      provider,
      datetime,
      repeat
    })

    await AppointmentService.createAppointment(patientId, parsed)
    redirect(`/admin/patient/${patientId}`)
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b1326] text-slate-900 dark:text-[#dae2fd] transition-colors duration-300">
      <header className="px-8 py-6 border-b border-slate-200 dark:border-white/5 sticky top-0 bg-white/80 dark:bg-[#131b2e]/80 backdrop-blur-xl z-20">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href={`/admin/patient/${patientId}`} className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
              <ChevronLeft className="w-5 h-5 text-slate-500 dark:text-[#8392a6]" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-manrope">Schedule Appointment</h1>
              <p className="text-sm text-slate-500 dark:text-[#8392a6] mt-0.5">For {patient.name}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-8 py-8">
        <form action={createAppointment} className="bg-white dark:bg-[#171f33] rounded-2xl shadow-sm dark:shadow-[0_20px_40px_rgba(6,14,32,0.4)] border border-slate-100 dark:border-white/5 p-8 space-y-6">
          <div className="flex items-center gap-3 mb-6 text-blue-600 dark:text-[#a4c9ff]">
            <div className="p-3 bg-blue-50 dark:bg-[#1c2b3c] rounded-xl">
              <CalendarPlus className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold font-manrope text-slate-900 dark:text-white">Appointment Details</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="provider" className="block text-sm font-medium text-slate-700 dark:text-[#b9c8de] mb-1.5">Provider Name</label>
              <input 
                type="text" 
                id="provider" 
                name="provider" 
                required
                className="w-full px-4 py-3 bg-slate-50 dark:bg-[#060e20] border border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-teal-500/50 outline-none transition-all duration-200 text-slate-900 dark:text-white placeholder:text-slate-400"
                placeholder="e.g. Dr. Smith"
              />
            </div>

            <div>
              <label htmlFor="datetime" className="block text-sm font-medium text-slate-700 dark:text-[#b9c8de] mb-1.5">Date & Time</label>
              <input 
                type="datetime-local" 
                id="datetime" 
                name="datetime" 
                required
                className="w-full px-4 py-3 bg-slate-50 dark:bg-[#060e20] border border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-teal-500/50 outline-none transition-all duration-200 text-slate-900 dark:text-white [color-scheme:light] dark:[color-scheme:dark]"
              />
            </div>

            <div>
              <label htmlFor="repeat" className="block text-sm font-medium text-slate-700 dark:text-[#b9c8de] mb-1.5">Repeat Cycle</label>
              <select 
                id="repeat" 
                name="repeat" 
                required
                className="w-full px-4 py-3 bg-slate-50 dark:bg-[#060e20] border border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-teal-500/50 outline-none transition-all duration-200 text-slate-900 dark:text-white"
              >
                <option value="none">Does not repeat (One-time)</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 dark:border-white/5 flex justify-end gap-3">
            <Link href={`/admin/patient/${patientId}`} className="px-5 py-2.5 text-sm font-semibold text-slate-700 dark:text-[#dae2fd] bg-slate-100 dark:bg-[#222a3d] hover:bg-slate-200 dark:hover:bg-[#2d3449] rounded-xl transition-colors">
              Cancel
            </Link>
            <button type="submit" className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-br from-teal-400 to-teal-600 dark:from-[#3cddc7] dark:to-[#00a392] dark:text-[#003731] rounded-xl hover:opacity-90 transition-opacity drop-shadow-sm">
              Schedule Appointment
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
