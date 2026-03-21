import { PatientService } from '@/lib/services/patient.service'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, UserCog } from 'lucide-react'

export default async function EditPatient({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const patientId = parseInt(resolvedParams.id)
  if (isNaN(patientId)) return notFound()

  const patient = await PatientService.getPatientById(patientId)
  if (!patient) return notFound()

  async function updatePatient(formData: FormData) {
    'use server'
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    
    await PatientService.updatePatient(patientId, { name, email })
    redirect(`/admin/patient/${patientId}`)
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b1326] text-slate-900 dark:text-[#dae2fd]">
      <header className="px-8 py-6 border-b border-slate-200 dark:border-white/5 sticky top-0 bg-white/80 dark:bg-[#131b2e]/80 backdrop-blur-xl z-20">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <Link href={`/admin/patient/${patientId}`} className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/5">
            <ChevronLeft className="w-5 h-5 text-slate-500" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold font-manrope">Edit Patient Details</h1>
          </div>
        </div>
      </header>
      <main className="max-w-2xl mx-auto px-8 py-8">
        <form action={updatePatient} className="bg-white dark:bg-[#171f33] rounded-2xl shadow-sm border border-slate-100 dark:border-white/5 p-8 space-y-6">
          <div className="flex items-center gap-3 mb-6 text-teal-600 dark:text-[#3cddc7]">
            <UserCog className="w-6 h-6" />
            <h2 className="text-xl font-bold font-manrope text-slate-900 dark:text-white">Patient Information</h2>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5 dark:text-[#b9c8de]">Full Name</label>
            <input type="text" name="name" required defaultValue={patient.name} className="w-full px-4 py-3 bg-slate-50 dark:bg-[#060e20] border border-slate-200 dark:border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-teal-500/50" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5 dark:text-[#b9c8de]">Email Address</label>
            <input type="email" name="email" required defaultValue={patient.email} className="w-full px-4 py-3 bg-slate-50 dark:bg-[#060e20] border border-slate-200 dark:border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-teal-500/50" />
          </div>
          <div className="pt-6 border-t border-slate-100 dark:border-white/5 flex justify-end gap-3">
            <Link href={`/admin/patient/${patientId}`} className="px-5 py-2.5 bg-slate-100 dark:bg-[#222a3d] dark:text-[#dae2fd] rounded-xl hover:bg-slate-200 dark:hover:bg-[#2d3449]">Cancel</Link>
            <button type="submit" className="px-5 py-2.5 text-white bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl hover:opacity-90">Save Changes</button>
          </div>
        </form>
      </main>
    </div>
  )
}
