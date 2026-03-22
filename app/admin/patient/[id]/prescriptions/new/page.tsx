import { PatientService } from '@/lib/services/patient.service'
import { PrescriptionService } from '@/lib/services/prescription.service'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { PrescriptionForm } from './PrescriptionForm'

export default async function NewPrescription({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const patientId = parseInt(resolvedParams.id)
  if (isNaN(patientId)) return notFound()

  const patient = await PatientService.getPatientById(patientId)
  if (!patient) return notFound()

  const medications = await PrescriptionService.getAllMedications()
  const dosages = await PrescriptionService.getAllDosages()

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b1326] text-slate-900 dark:text-[#dae2fd] transition-colors duration-300">
      <header className="px-8 py-6 border-b border-slate-200 dark:border-white/5 sticky top-0 bg-white/80 dark:bg-[#131b2e]/80 backdrop-blur-xl z-20">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href={`/admin/patient/${patientId}`} className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
              <ChevronLeft className="w-5 h-5 text-slate-500 dark:text-[#8392a6]" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-manrope">Issue Prescription</h1>
              <p className="text-sm text-slate-500 dark:text-[#8392a6] mt-0.5">For {patient.name}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-8 py-8">
        <PrescriptionForm 
          patientId={patientId} 
          medications={medications} 
          dosages={dosages} 
        />
      </main>
    </div>
  )
}
