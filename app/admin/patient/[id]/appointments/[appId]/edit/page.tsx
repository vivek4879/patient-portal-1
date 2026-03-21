import { PatientService } from '@/lib/services/patient.service'
import { AppointmentService } from '@/lib/services/appointment.service'
import { AppointmentSchema } from '@/lib/validations'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, CalendarPlus } from 'lucide-react'

export default async function EditAppointment({ params }: { params: Promise<{ id: string, appId: string }> }) {
  const resolvedParams = await params
  const patientId = parseInt(resolvedParams.id)
  const appId = parseInt(resolvedParams.appId)
  if (isNaN(patientId) || isNaN(appId)) return notFound()

  const patient = await PatientService.getPatientById(patientId)
  const appointment = await AppointmentService.getAppointmentById(appId)
  if (!patient || !appointment || appointment.patientId !== patientId) return notFound()

  async function updateAppointment(formData: FormData) {
    'use server'
    const provider = formData.get('provider') as string
    const datetime = formData.get('datetime') as string
    const repeat = formData.get('repeat') as "none" | "weekly" | "monthly"

    const parsed = AppointmentSchema.parse({
      provider,
      datetime,
      repeat
    })

    await AppointmentService.updateAppointment(appId, parsed)
    redirect(`/admin/patient/${patientId}`)
  }

  // format ISO date to datetime-local expected string YYYY-MM-DDTHH:MM
  const tzOffset = (new Date()).getTimezoneOffset() * 60000; // offset in milliseconds
  const localISOTime = (new Date(appointment.datetime.getTime() - tzOffset)).toISOString().slice(0, 16);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b1326] text-slate-900 dark:text-[#dae2fd]">
      <header className="px-8 py-6 border-b border-slate-200 dark:border-white/5 sticky top-0 bg-white/80 dark:bg-[#131b2e]/80 backdrop-blur-xl z-20">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <Link href={`/admin/patient/${patientId}`} className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/5">
            <ChevronLeft className="w-5 h-5 text-slate-500" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold font-manrope">Edit Appointment</h1>
            <p className="text-sm text-slate-500 mt-0.5">For {patient.name}</p>
          </div>
        </div>
      </header>
      <main className="max-w-2xl mx-auto px-8 py-8">
        <form action={updateAppointment} className="bg-white dark:bg-[#171f33] rounded-2xl shadow-sm border border-slate-100 dark:border-white/5 p-8 space-y-6">
          <div className="flex items-center gap-3 mb-6 text-blue-600 dark:text-[#a4c9ff]">
            <CalendarPlus className="w-6 h-6" />
            <h2 className="text-xl font-bold font-manrope text-slate-900 dark:text-white">Appointment Details</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5 dark:text-[#b9c8de]">Provider Name</label>
              <input type="text" name="provider" defaultValue={appointment.provider} required className="w-full px-4 py-3 bg-slate-50 dark:bg-[#060e20] border border-slate-200 dark:border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-teal-500/50" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5 dark:text-[#b9c8de]">Date & Time</label>
              <input type="datetime-local" name="datetime" defaultValue={localISOTime} required className="w-full px-4 py-3 bg-slate-50 dark:bg-[#060e20] border border-slate-200 dark:border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-teal-500/50 [color-scheme:light] dark:[color-scheme:dark]" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5 dark:text-[#b9c8de]">Repeat Cycle</label>
              <select name="repeat" defaultValue={appointment.repeat} required className="w-full px-4 py-3 bg-slate-50 dark:bg-[#060e20] border border-slate-200 dark:border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-teal-500/50">
                <option value="none">Does not repeat (One-time)</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>
          <div className="pt-6 border-t border-slate-100 dark:border-white/5 flex gap-3 justify-end">
            <Link href={`/admin/patient/${patientId}`} className="px-5 py-2.5 bg-slate-100 dark:bg-[#222a3d] dark:text-[#dae2fd] rounded-xl hover:bg-slate-200 dark:hover:bg-[#2d3449]">Cancel</Link>
            <button type="submit" className="px-5 py-2.5 text-white bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl hover:opacity-90">Save Changes</button>
          </div>
        </form>
      </main>
    </div>
  )
}
