"use client"

import { useActionState } from 'react'
import Link from 'next/link'
import { CalendarPlus, AlertTriangle, Loader2 } from 'lucide-react'
import { createAppointmentAction } from '@/lib/actions/appointment.actions'

export function AppointmentForm({ patientId }: { patientId: number }) {
  const [state, action, isPending] = useActionState(createAppointmentAction.bind(null, patientId), {})

  return (
    <form action={action} className="bg-white dark:bg-[#171f33] rounded-2xl shadow-sm dark:shadow-[0_20px_40px_rgba(6,14,32,0.4)] border border-slate-100 dark:border-white/5 p-8 space-y-6">
      <div className="flex items-center gap-3 mb-6 text-blue-600 dark:text-[#a4c9ff]">
        <div className="p-3 bg-blue-50 dark:bg-[#1c2b3c] rounded-xl">
          <CalendarPlus className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold font-manrope text-slate-900 dark:text-white">Appointment Details</h2>
      </div>

      {state?.error && (
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-[#410002] border border-red-100 dark:border-red-500/20 text-red-600 dark:text-[#ffb4ab] text-sm font-semibold flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <p>{state.error}</p>
        </div>
      )}

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
        <button 
          type="submit" 
          disabled={isPending}
          className="px-5 py-2.5 flex items-center gap-2 text-sm font-semibold text-white bg-gradient-to-br from-teal-400 to-teal-600 dark:from-[#3cddc7] dark:to-[#00a392] dark:text-[#003731] rounded-xl hover:opacity-90 disabled:opacity-70 disabled:cursor-not-allowed transition-opacity drop-shadow-sm"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Scheduling...
            </>
          ) : (
            "Schedule Appointment"
          )}
        </button>
      </div>
    </form>
  )
}
