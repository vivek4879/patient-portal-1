import { PatientService } from '@/lib/services/patient.service'
import { AppointmentService } from '@/lib/services/appointment.service'
import { PrescriptionService } from '@/lib/services/prescription.service'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Calendar, Pill, AlertCircle, Plus, Edit2, UserCog } from 'lucide-react'
import { revalidatePath } from 'next/cache'
import { DeleteButton } from '@/components/ui/DeleteButton'

export default async function PatientDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const patientId = parseInt(resolvedParams.id)
  if (isNaN(patientId)) return notFound()

  const patient = await PatientService.getPatientById(patientId)
  if (!patient) return notFound()

  async function deleteAppt(formData: FormData) {
    'use server'
    await AppointmentService.deleteAppointment(parseInt(formData.get('id') as string))
    revalidatePath(`/admin/patient/${patientId}`)
  }

  async function deletePresc(formData: FormData) {
    'use server'
    await PrescriptionService.deletePrescription(parseInt(formData.get('id') as string))
    revalidatePath(`/admin/patient/${patientId}`)
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b1326] text-slate-900 dark:text-[#dae2fd] transition-colors duration-300 pb-12">
      <header className="px-8 py-6 border-b border-slate-200 dark:border-white/5 sticky top-0 bg-white/80 dark:bg-[#131b2e]/80 backdrop-blur-xl z-20">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
              <ChevronLeft className="w-5 h-5 text-slate-500 dark:text-[#8392a6]" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-manrope">{patient.name}</h1>
              <p className="text-sm text-slate-500 dark:text-[#8392a6] mt-0.5 font-mono">ID: OP-{patient.id.toString().padStart(4, '0')} • {patient.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-[#003731] dark:text-[#3cddc7]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-[#3cddc7]"></span>
              Active Status
            </span>
            <Link href={`/admin/patient/${patientId}/edit`} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500 dark:text-[#8392a6] transition-colors" title="Edit Patient Info">
              <UserCog className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-8 py-8 space-y-8">
        
        {/* Appointments Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold font-manrope flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-500 dark:text-[#a4c9ff]" />
              Appointments
            </h2>
            <Link 
              href={`/admin/patient/${patient.id}/appointments/new`}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-[#dae2fd] bg-white dark:bg-[#222a3d] border border-slate-200 dark:border-white/10 rounded-lg hover:bg-slate-50 dark:hover:bg-[#2d3449] transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Schedule
            </Link>
          </div>
          
          <div className="bg-white dark:bg-[#171f33] rounded-2xl shadow-sm dark:shadow-[0_20px_40px_rgba(6,14,32,0.4)] border border-slate-100 dark:border-white/5 overflow-hidden">
            {patient.appointments.length === 0 ? (
              <div className="p-8 text-center flex flex-col items-center justify-center text-slate-500 dark:text-[#8392a6]">
                <AlertCircle className="w-8 h-8 mb-3 opacity-50" />
                <p>No upcoming appointments found.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-white/5">
                {patient.appointments.map(appt => (
                  <div key={appt.id} className="p-5 hover:bg-slate-50 dark:hover:bg-[#222a3d] transition-colors group">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white text-base">Dr. {appt.provider}</h4>
                        <p className="text-sm text-slate-500 dark:text-[#b9c8de] mt-1">
                          {new Date(appt.datetime).toLocaleString('en-US', { weekday: 'long', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-600 dark:bg-[#283044] dark:text-[#d6e5ff] capitalize border border-slate-200 dark:border-white/5">
                          {appt.repeat === 'none' ? 'One-time' : `${appt.repeat} Repeat`}
                        </span>
                        <div className="flex items-center gap-2">
                          <Link href={`/admin/patient/${patient.id}/appointments/${appt.id}/edit`} className="p-1.5 text-slate-400 hover:text-blue-500 dark:hover:text-[#a4c9ff]" title="Edit Appointment">
                            <Edit2 className="w-4 h-4" />
                          </Link>
                          <form action={deleteAppt}>
                            <input type="hidden" name="id" value={appt.id.toString()} />
                            <DeleteButton 
                              message="Delete this appointment?"
                              className="p-1.5 text-slate-400 hover:text-red-500 dark:hover:text-[#ffb4ab]" 
                              title="Delete Appointment" 
                              iconClassName="w-4 h-4"
                            />
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Prescriptions Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold font-manrope flex items-center gap-2">
              <Pill className="w-5 h-5 text-purple-500 dark:text-[#d6e5ff]" />
              Active Prescriptions
            </h2>
            <Link 
              href={`/admin/patient/${patient.id}/prescriptions/new`}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-[#dae2fd] bg-white dark:bg-[#222a3d] border border-slate-200 dark:border-white/10 rounded-lg hover:bg-slate-50 dark:hover:bg-[#2d3449] transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Prescribe
            </Link>
          </div>
          
          <div className="bg-white dark:bg-[#171f33] rounded-2xl shadow-sm dark:shadow-[0_20px_40px_rgba(6,14,32,0.4)] border border-slate-100 dark:border-white/5 overflow-hidden">
            {patient.prescriptions.length === 0 ? (
              <div className="p-8 text-center flex flex-col items-center justify-center text-slate-500 dark:text-[#8392a6]">
                <AlertCircle className="w-8 h-8 mb-3 opacity-50" />
                <p>No active prescriptions found.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-white/5">
                {patient.prescriptions.map(presc => (
                  <div key={presc.id} className="p-5 hover:bg-slate-50 dark:hover:bg-[#222a3d] transition-colors group">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white text-base">
                          {presc.medication.name} <span className="text-slate-400 dark:text-[#8392a6] font-normal">{presc.dosage.amount}</span>
                        </h4>
                        <div className="flex items-center gap-3 mt-2 text-sm text-slate-500 dark:text-[#b9c8de]">
                          <span>Qty: <strong className="text-slate-700 dark:text-white">{presc.quantity}</strong></span>
                          <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-[#3d4947]"></span>
                          <span>Refill Cycle: <strong className="text-slate-700 dark:text-white capitalize">{presc.refill_schedule}</strong></span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="text-right">
                          <p className="text-xs text-slate-400 dark:text-[#8392a6] uppercase tracking-wider font-medium mb-1">Next Refill</p>
                          <p className="text-sm font-semibold text-slate-900 dark:text-emerald-400">
                            {new Date(presc.refill_on).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Link href={`/admin/patient/${patient.id}/prescriptions/${presc.id}/edit`} className="p-1.5 text-slate-400 hover:text-purple-500 dark:hover:text-[#d6e5ff]" title="Edit Prescription">
                            <Edit2 className="w-4 h-4" />
                          </Link>
                          <form action={deletePresc}>
                            <input type="hidden" name="id" value={presc.id.toString()} />
                            <DeleteButton 
                              message="Delete this prescription?"
                              className="p-1.5 text-slate-400 hover:text-red-500 dark:hover:text-[#ffb4ab]" 
                              title="Delete Prescription" 
                              iconClassName="w-4 h-4"
                            />
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

      </main>
    </div>
  )
}
