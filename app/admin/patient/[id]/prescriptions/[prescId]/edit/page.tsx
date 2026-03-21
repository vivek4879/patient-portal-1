import { PatientService } from '@/lib/services/patient.service'
import { PrescriptionService } from '@/lib/services/prescription.service'
import { PrescriptionSchema } from '@/lib/validations'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Pill } from 'lucide-react'

export default async function EditPrescription({ params }: { params: Promise<{ id: string, prescId: string }> }) {
  const resolvedParams = await params
  const patientId = parseInt(resolvedParams.id)
  const prescId = parseInt(resolvedParams.prescId)
  if (isNaN(patientId) || isNaN(prescId)) return notFound()

  const patient = await PatientService.getPatientById(patientId)
  const prescription = await PrescriptionService.getPrescriptionById(prescId)
  if (!patient || !prescription || prescription.patientId !== patientId) return notFound()

  const medications = await PrescriptionService.getAllMedications()
  const dosages = await PrescriptionService.getAllDosages()

  async function updatePrescription(formData: FormData) {
    'use server'
    const parsed = PrescriptionSchema.parse({
      medicationId: parseInt(formData.get('medicationId') as string),
      dosageId: parseInt(formData.get('dosageId') as string),
      quantity: parseInt(formData.get('quantity') as string),
      refill_on: formData.get('refill_on') as string,
      refill_schedule: formData.get('refill_schedule') as "none" | "monthly" | "weekly"
    })

    await PrescriptionService.updatePrescription(prescId, parsed)
    redirect(`/admin/patient/${patientId}`)
  }

  const refillOnISO = prescription.refill_on.toISOString().slice(0, 10);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b1326] text-slate-900 dark:text-[#dae2fd]">
      <header className="px-8 py-6 border-b border-slate-200 dark:border-white/5 sticky top-0 bg-white/80 dark:bg-[#131b2e]/80 backdrop-blur-xl z-20">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <Link href={`/admin/patient/${patientId}`} className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/5">
            <ChevronLeft className="w-5 h-5 text-slate-500" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold font-manrope">Edit Prescription</h1>
            <p className="text-sm text-slate-500 mt-0.5">For {patient.name}</p>
          </div>
        </div>
      </header>
      <main className="max-w-2xl mx-auto px-8 py-8">
        <form action={updatePrescription} className="bg-white dark:bg-[#171f33] rounded-2xl shadow-sm border border-slate-100 dark:border-white/5 p-8 space-y-6">
          <div className="flex items-center gap-3 mb-6 text-purple-600 dark:text-[#d6e5ff]">
            <Pill className="w-6 h-6" />
            <h2 className="text-xl font-bold font-manrope text-slate-900 dark:text-white">Prescription Details</h2>
          </div>
          <div className="gap-4 grid grid-cols-2">
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium mb-1.5 dark:text-[#b9c8de]">Medication Name</label>
              <select name="medicationId" defaultValue={prescription.medicationId} required className="w-full px-4 py-3 bg-slate-50 dark:bg-[#060e20] border border-slate-200 dark:border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-teal-500/50">
                {medications.map(med => <option key={med.id} value={med.id}>{med.name}</option>)}
              </select>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium mb-1.5 dark:text-[#b9c8de]">Dosage Amount</label>
              <select name="dosageId" defaultValue={prescription.dosageId} required className="w-full px-4 py-3 bg-slate-50 dark:bg-[#060e20] border border-slate-200 dark:border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-teal-500/50">
                {dosages.map(dose => <option key={dose.id} value={dose.id}>{dose.amount}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1.5 dark:text-[#b9c8de]">Quantity</label>
              <input type="number" name="quantity" defaultValue={prescription.quantity} min="1" required className="w-full px-4 py-3 bg-slate-50 dark:bg-[#060e20] border border-slate-200 dark:border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-teal-500/50" />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium mb-1.5 dark:text-[#b9c8de]">Refill Date</label>
              <input type="date" name="refill_on" defaultValue={refillOnISO} required className="w-full px-4 py-3 bg-slate-50 dark:bg-[#060e20] border border-slate-200 dark:border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-teal-500/50 [color-scheme:light] dark:[color-scheme:dark]" />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium mb-1.5 dark:text-[#b9c8de]">Refill Schedule</label>
              <select name="refill_schedule" defaultValue={prescription.refill_schedule} required className="w-full px-4 py-3 bg-slate-50 dark:bg-[#060e20] border border-slate-200 dark:border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-teal-500/50">
                <option value="none">No refills</option>
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
