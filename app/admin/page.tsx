import { PatientService } from '@/lib/services/patient.service'
import Link from 'next/link'
import { Search, UserRound, Calendar, Pill, ChevronRight } from 'lucide-react'
import { revalidatePath } from 'next/cache'
import { DeleteButton } from '@/components/ui/DeleteButton'
import { PatientSearch } from '@/components/ui/PatientSearch'

export default async function AdminDashboard({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const resolvedParams = await searchParams
  const query = resolvedParams.q || ''
  const patients = await PatientService.getAllPatients(query)

  async function deletePatientAct(formData: FormData) {
    'use server'
    await PatientService.deletePatient(parseInt(formData.get('id') as string))
    revalidatePath('/admin')
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b1326] text-slate-900 dark:text-[#dae2fd] transition-colors duration-300">
      <header className="px-8 py-6 border-b border-slate-200 dark:border-white/5 sticky top-0 bg-white/80 dark:bg-[#131b2e]/80 backdrop-blur-xl z-20">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Admin Patient Dashboard</h1>
            <p className="text-sm text-slate-500 dark:text-[#8392a6] mt-1">Manage patient records, appointments, and prescriptions.</p>
          </div>
          <div className="flex items-center gap-4">
            <PatientSearch />
            <Link 
              href="/admin/patient/new"
              className="px-4 py-2.5 text-sm font-semibold text-white bg-slate-900 border border-slate-900 dark:bg-[#222a3d] dark:border-white/10 rounded-xl hover:bg-slate-800 dark:hover:bg-[#2d3449] transition-colors shadow-sm whitespace-nowrap"
            >
              Add Patient
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-8 py-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Summary Cards */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#171f33] shadow-sm dark:shadow-[0_20px_40px_rgba(6,14,32,0.4)] border border-slate-100 dark:border-white/5 flex items-center gap-5 hover:dark:bg-[#222a3d] transition-colors duration-300">
            <div className="p-4 bg-teal-50 dark:bg-[#00302a] rounded-xl text-teal-600 dark:text-[#3cddc7]">
              <UserRound className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-[#8392a6]">Total Enrolled Patients</p>
              <h3 className="text-2xl font-bold font-manrope">{patients.length}</h3>
            </div>
          </div>
          <div className="p-6 rounded-2xl bg-white dark:bg-[#171f33] shadow-sm dark:shadow-[0_20px_40px_rgba(6,14,32,0.4)] border border-slate-100 dark:border-white/5 flex items-center gap-5 hover:dark:bg-[#222a3d] transition-colors duration-300">
            <div className="p-4 bg-blue-50 dark:bg-[#1c2b3c] rounded-xl text-blue-600 dark:text-[#a4c9ff]">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-[#8392a6]">Appointments Today</p>
              <h3 className="text-2xl font-bold font-manrope">8</h3>
            </div>
          </div>
          <div className="p-6 rounded-2xl bg-white dark:bg-[#171f33] shadow-sm dark:shadow-[0_20px_40px_rgba(6,14,32,0.4)] border border-slate-100 dark:border-white/5 flex items-center gap-5 hover:dark:bg-[#222a3d] transition-colors duration-300">
            <div className="p-4 bg-purple-50 dark:bg-[#283044] rounded-xl text-purple-600 dark:text-[#d6e5ff]">
              <Pill className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-[#8392a6]">Pending Refill Requests</p>
              <h3 className="text-2xl font-bold font-manrope">2</h3>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-bold mb-4 font-manrope tracking-tight">Active Patient Directory</h2>
        
        <div className="bg-white dark:bg-[#171f33] rounded-2xl shadow-sm dark:shadow-[0_20px_40px_rgba(6,14,32,0.4)] border border-slate-100 dark:border-white/5 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-[#222a3d] text-sm text-slate-500 dark:text-[#8392a6]">
                <th className="px-6 py-4 font-semibold border-b border-slate-100 dark:border-white/5">Patient Name</th>
                <th className="px-6 py-4 font-semibold border-b border-slate-100 dark:border-white/5">Contact Info</th>
                <th className="px-6 py-4 font-semibold border-b border-slate-100 dark:border-white/5">Status</th>
                <th className="px-6 py-4 font-semibold text-right border-b border-slate-100 dark:border-white/5">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {patients.map(patient => (
                <tr key={patient.id} className="hover:bg-slate-50 dark:hover:bg-[#222a3d] transition-colors duration-150 group">
                  <td className="px-6 py-5">
                    <div className="font-semibold text-slate-900 dark:text-white text-base">{patient.name}</div>
                    <div className="text-sm text-slate-500 dark:text-[#8392a6] mt-1 font-mono">ID: OP-{patient.id.toString().padStart(4, '0')}</div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="text-slate-600 dark:text-[#b9c8de]">{patient.email}</div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-[#003731] dark:text-[#3cddc7]">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-[#3cddc7]"></span>
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link 
                        href={`/admin/patient/${patient.id}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-br from-teal-400 to-teal-600 dark:from-[#3cddc7] dark:to-[#00a392] dark:text-[#003731] rounded-xl hover:opacity-90 transition-opacity drop-shadow-sm"
                      >
                        View Record
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                      <form action={deletePatientAct}>
                        <input type="hidden" name="id" value={patient.id.toString()} />
                        <DeleteButton 
                          message="Are you sure you want to permanently delete this patient? All their appointments and prescriptions will be lost."
                          className="p-2.5 text-slate-400 hover:text-red-500 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors" 
                          title="Delete Patient" 
                        />
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
