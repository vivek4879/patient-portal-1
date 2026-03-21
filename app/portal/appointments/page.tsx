import { PatientService } from '@/lib/services/patient.service'
import { verifySession } from '@/lib/utils/session'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { generateRecurringInstances } from '@/lib/utils/recurring'
import { ChevronLeft, Calendar } from 'lucide-react'

export default async function PortalAppointments() {
  const session = await verifySession()
  if (!session?.isAuth) redirect('/')

  const patient = await PatientService.getPatientById(session.userId)
  if (!patient) redirect('/')

  const today = new Date()

  const upcomingAppointments = patient.appointments.flatMap(appt => {
    const instances = generateRecurringInstances(new Date(appt.datetime), appt.repeat as any, 3)
    return instances
      .filter(date => date >= today)
      .map(date => ({ provider: appt.provider, date, original: appt }))
  }).sort((a, b) => a.date.getTime() - b.date.getTime())

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b1326] text-slate-900 dark:text-[#dae2fd] transition-colors duration-300">
      <header className="px-8 py-6 border-b border-slate-200 dark:border-white/5 sticky top-0 bg-white/80 dark:bg-[#131b2e]/80 backdrop-blur-xl z-20">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href={`/portal`} className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
              <ChevronLeft className="w-5 h-5 text-slate-500 dark:text-[#8392a6]" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold font-manrope text-slate-900 dark:text-white transition-colors">My Appointments</h1>
              <p className="text-sm text-slate-500 dark:text-[#8392a6] mt-0.5 font-medium transition-colors">Next 3 Months Schedule</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-8 py-8">
         <div className="bg-white dark:bg-[#171f33] rounded-3xl border border-slate-200 dark:border-white/5 overflow-hidden divide-y divide-slate-100 dark:divide-white/5 shadow-sm dark:shadow-lg dark:shadow-black/20 transition-all">
            {upcomingAppointments.length === 0 ? (
              <div className="p-12 text-center text-slate-500 dark:text-[#8392a6] transition-colors">
                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-30 text-blue-500 dark:text-[#a4c9ff]" />
                <p>No upcoming appointments found for the next 3 months.</p>
              </div>
            ) : (
              upcomingAppointments.map((appt, i) => (
                <div key={i} className="p-6 flex justify-between items-center hover:bg-slate-50 dark:hover:bg-[#222a3d] transition-colors">
                  <div className="flex gap-4 items-center">
                     <div className="w-12 h-12 shrink-0 bg-blue-50 dark:bg-[#1c2b3c] rounded-2xl flex flex-col justify-center items-center text-blue-700 dark:text-[#a4c9ff] shadow-inner transition-colors">
                        <span className="text-[10px] font-bold uppercase tracking-widest">{appt.date.toLocaleDateString('en-US', { month: 'short' })}</span>
                        <span className="text-xl font-manrope font-bold leading-none mt-0.5">{appt.date.getDate()}</span>
                     </div>
                     <div>
                       <h4 className="font-semibold text-slate-900 dark:text-white text-lg transition-colors">Dr. {appt.provider}</h4>
                       <p className="text-sm text-slate-500 dark:text-[#8392a6] mt-0.5 flex items-center gap-2 transition-colors">
                         {appt.date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                         {appt.original.repeat !== 'none' && (
                           <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 dark:bg-[#283044] dark:text-[#d6e5ff] transition-colors">
                             {appt.original.repeat}
                           </span>
                         )}
                       </p>
                     </div>
                  </div>
                </div>
              ))
            )}
         </div>
      </main>
    </div>
  )
}
