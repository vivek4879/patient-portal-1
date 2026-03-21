import { PatientService } from '@/lib/services/patient.service'
import { verifySession, deleteSession } from '@/lib/utils/session'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { generateRecurringInstances } from '@/lib/utils/recurring'
import { LogOut, Calendar, Pill, Activity, ArrowRight } from 'lucide-react'
import { addDays, isAfter, isBefore } from 'date-fns'

export default async function PortalDashboard() {
  const session = await verifySession()
  if (!session?.isAuth) redirect('/')

  const patient = await PatientService.getPatientById(session.userId)
  if (!patient) redirect('/')

  const today = new Date()
  const nextWeek = addDays(today, 7)

  const upcomingAppointments = patient.appointments.flatMap(appt => {
    const instances = generateRecurringInstances(new Date(appt.datetime), appt.repeat as any, 1)
    return instances
      .filter(date => isAfter(date, today) && isBefore(date, nextWeek))
      .map(date => ({ provider: appt.provider, date }))
  }).sort((a, b) => a.date.getTime() - b.date.getTime())

  const upcomingRefills = patient.prescriptions.flatMap(presc => {
    const instances = generateRecurringInstances(new Date(presc.refill_on), presc.refill_schedule as any, 1)
    return instances
      .filter(date => isAfter(date, today) && isBefore(date, nextWeek))
      .map(date => ({ medication: presc.medication.name, dosage: presc.dosage.amount, date }))
  }).sort((a, b) => a.date.getTime() - b.date.getTime())

  async function logout() {
    'use server'
    await deleteSession()
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b1326] text-slate-900 dark:text-[#dae2fd] transition-colors duration-300">
      <header className="px-8 py-6 border-b border-slate-200 dark:border-white/5 sticky top-0 bg-white/80 dark:bg-[#131b2e]/80 backdrop-blur-xl z-20">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold font-manrope text-slate-900 dark:text-white transition-colors">Hello, {patient.name.split(' ')[0]}</h1>
            <p className="text-sm text-slate-500 dark:text-[#8392a6] mt-0.5 font-medium transition-colors">Your Health Summary</p>
          </div>
          <form action={logout}>
            <button type="submit" className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-slate-500 dark:text-[#8392a6] hover:text-red-500 dark:hover:text-[#ffb4ab]">
              <LogOut className="w-5 h-5" />
            </button>
          </form>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-8 py-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <Link href="/portal/appointments" className="p-6 rounded-3xl bg-blue-50 dark:bg-gradient-to-br dark:from-blue-500/10 dark:to-[#171f33] border border-blue-100 dark:border-blue-500/20 hover:border-blue-200 dark:hover:border-blue-500/40 transition-colors group">
             <Calendar className="w-8 h-8 text-blue-600 dark:text-[#a4c9ff] mb-4" />
             <h3 className="text-lg font-bold text-slate-900 dark:text-white font-manrope transition-colors">Appointments</h3>
             <p className="text-sm text-slate-600 dark:text-[#8392a6] mt-1 transition-colors">{patient.appointments.length} active schedules <ArrowRight className="inline w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform"/></p>
           </Link>
           <Link href="/portal/medications" className="p-6 rounded-3xl bg-purple-50 dark:bg-gradient-to-br dark:from-purple-500/10 dark:to-[#171f33] border border-purple-100 dark:border-purple-500/20 hover:border-purple-200 dark:hover:border-purple-500/40 transition-colors group">
             <Pill className="w-8 h-8 text-purple-600 dark:text-[#d6e5ff] mb-4" />
             <h3 className="text-lg font-bold text-slate-900 dark:text-white font-manrope transition-colors">Medications</h3>
             <p className="text-sm text-slate-600 dark:text-[#8392a6] mt-1 transition-colors">{patient.prescriptions.length} active prescriptions <ArrowRight className="inline w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform"/></p>
           </Link>
        </div>

        <section>
          <h2 className="text-xl font-bold font-manrope text-slate-900 dark:text-white mb-4 flex items-center gap-2 mt-8 transition-colors">
            <Activity className="w-5 h-5 text-teal-600 dark:text-[#3cddc7]" /> Next 7 Days
          </h2>
          <div className="bg-white dark:bg-[#171f33] rounded-3xl border border-slate-200 dark:border-white/5 overflow-hidden divide-y divide-slate-100 dark:divide-white/5 shadow-sm dark:shadow-lg dark:shadow-black/20 transition-all">
            {upcomingAppointments.length === 0 && upcomingRefills.length === 0 ? (
              <div className="p-8 text-center text-slate-500 dark:text-[#8392a6] transition-colors">
                <p>No appointments or refills scheduled for the next 7 days.</p>
              </div>
            ) : (
              <>
                {upcomingAppointments.map((appt, i) => (
                  <div key={`apt-${i}`} className="p-5 flex justify-between items-center hover:bg-slate-50 dark:hover:bg-[#222a3d] transition-colors">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-blue-600 dark:text-[#a4c9ff] font-bold mb-1 transition-colors">Appointment</p>
                      <h4 className="font-medium text-slate-900 dark:text-white text-base transition-colors">Dr. {appt.provider}</h4>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white transition-colors">
                        {appt.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-[#8392a6] mt-0.5 transition-colors">{appt.date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</p>
                    </div>
                  </div>
                ))}
                {upcomingRefills.map((refill, i) => (
                  <div key={`ref-${i}`} className="p-5 flex justify-between items-center hover:bg-slate-50 dark:hover:bg-[#222a3d] transition-colors border-t border-slate-100 dark:border-white/5">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-purple-600 dark:text-[#d6e5ff] font-bold mb-1 transition-colors">Medication Refill</p>
                      <h4 className="font-medium text-slate-900 dark:text-white text-base transition-colors">{refill.medication} <span className="text-slate-500 dark:text-[#8392a6] font-normal text-sm transition-colors">{refill.dosage}</span></h4>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white transition-colors">
                        {refill.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}
