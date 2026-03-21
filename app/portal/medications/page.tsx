import { PatientService } from '@/lib/services/patient.service'
import { verifySession } from '@/lib/utils/session'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { generateRecurringInstances } from '@/lib/utils/recurring'
import { ChevronLeft, Pill } from 'lucide-react'

export default async function PortalMedications() {
  const session = await verifySession()
  if (!session?.isAuth) redirect('/')

  const patient = await PatientService.getPatientById(session.userId)
  if (!patient) redirect('/')

  const today = new Date()

  const activePrescriptions = patient.prescriptions.map(presc => {
    const instances = generateRecurringInstances(new Date(presc.refill_on), presc.refill_schedule as any, 3)
    const upcoming = instances.filter(d => d >= today).sort((a,b) => a.getTime() - b.getTime())
    return { ...presc, upcomingRefills: upcoming }
  })

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b1326] text-slate-900 dark:text-[#dae2fd] transition-colors duration-300">
      <header className="px-8 py-6 border-b border-slate-200 dark:border-white/5 sticky top-0 bg-white/80 dark:bg-[#131b2e]/80 backdrop-blur-xl z-20">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href={`/portal`} className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
              <ChevronLeft className="w-5 h-5 text-slate-500 dark:text-[#8392a6]" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold font-manrope text-slate-900 dark:text-white transition-colors">My Medications</h1>
              <p className="text-sm text-slate-500 dark:text-[#8392a6] mt-0.5 font-medium transition-colors">Active Prescriptions & Refill Schedule</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-8 py-8 space-y-6">
        {activePrescriptions.length === 0 ? (
          <div className="p-12 text-center text-slate-500 dark:text-[#8392a6] bg-white dark:bg-[#171f33] rounded-3xl border border-slate-200 dark:border-white/5 transition-all">
            <Pill className="w-12 h-12 mx-auto mb-4 opacity-30 text-purple-500 dark:text-[#d6e5ff]" />
            <p>No active prescriptions found.</p>
          </div>
        ) : (
          activePrescriptions.map((presc) => (
             <div key={presc.id} className="bg-white dark:bg-[#171f33] rounded-3xl border border-slate-200 dark:border-white/5 overflow-hidden shadow-sm dark:shadow-lg dark:shadow-black/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:dark:shadow-2xl hover:dark:shadow-black/40">
                <div className="p-6 border-b border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-[#1c2b3c]/30 transition-colors">
                   <h3 className="text-xl font-bold text-slate-900 dark:text-white font-manrope transition-colors">{presc.medication.name} <span className="text-slate-500 dark:text-[#8392a6] font-normal text-base ml-1">{presc.dosage.amount}</span></h3>
                   <div className="flex items-center gap-4 mt-3 text-sm">
                      <span className="px-3 py-1.5 rounded-lg bg-slate-200 text-slate-700 dark:bg-[#283044] dark:text-[#d6e5ff] font-semibold border border-slate-300 dark:border-[#d6e5ff]/10 transition-colors">Qty: {presc.quantity}</span>
                      <span className="text-slate-500 dark:text-[#8392a6] capitalize font-medium transition-colors">Cycle: {presc.refill_schedule}</span>
                   </div>
                </div>
                <div className="p-6">
                   <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-[#b9c8de] mb-4 transition-colors">Upcoming Refills (Next 3 Months)</h4>
                   {presc.upcomingRefills.length === 0 ? (
                     <p className="text-sm text-slate-400 dark:text-[#8392a6] transition-colors">No refills scheduled.</p>
                   ) : (
                     <div className="space-y-4">
                       {presc.upcomingRefills.map((date, idx) => (
                         <div key={idx} className="flex gap-4 items-center pl-2">
                           <div className="w-1.5 h-1.5 rounded-full bg-teal-500 dark:bg-[#3cddc7] shadow-[0_0_10px_rgba(20,184,166,0.8)] dark:shadow-[0_0_10px_rgba(60,221,199,0.8)] transition-all"></div>
                           <span className="text-sm font-medium text-slate-700 dark:text-white tracking-wide transition-colors">{date.toLocaleDateString('en-US', { weekday: 'long', year:'numeric', month: 'long', day: 'numeric'})}</span>
                         </div>
                       ))}
                     </div>
                   )}
                </div>
             </div>
          ))
        )}
      </main>
    </div>
  )
}
