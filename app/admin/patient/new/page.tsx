"use client"

import { useActionState } from 'react'
import Link from 'next/link'
import { ChevronLeft, UserPlus, AlertTriangle, Loader2 } from 'lucide-react'
import { createPatientAction } from '@/lib/actions/patient.actions'

export default function NewPatient() {
  const [state, action, isPending] = useActionState(createPatientAction, {})

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b1326] text-slate-900 dark:text-[#dae2fd] transition-colors duration-300">
      <header className="px-8 py-6 border-b border-slate-200 dark:border-white/5 sticky top-0 bg-white/80 dark:bg-[#131b2e]/80 backdrop-blur-xl z-20">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href={`/admin`} className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
              <ChevronLeft className="w-5 h-5 text-slate-500 dark:text-[#8392a6]" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-manrope">Enroll New Patient</h1>
              <p className="text-sm text-slate-500 dark:text-[#8392a6] mt-0.5">Admin Registration</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-8 py-8">
        <form action={action} className="bg-white dark:bg-[#171f33] rounded-2xl shadow-sm dark:shadow-[0_20px_40px_rgba(6,14,32,0.4)] border border-slate-100 dark:border-white/5 p-8 space-y-6">
          <div className="flex items-center gap-3 mb-6 text-teal-600 dark:text-[#3cddc7]">
            <div className="p-3 bg-teal-50 dark:bg-[#00302a] rounded-xl">
              <UserPlus className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold font-manrope text-slate-900 dark:text-white">Patient Information</h2>
          </div>

          {state?.error && (
            <div className="p-4 rounded-2xl bg-red-50 dark:bg-[#410002] border border-red-100 dark:border-red-500/20 text-red-600 dark:text-[#ffb4ab] text-sm font-semibold flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              <p>{state.error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-[#b9c8de] mb-1.5">Full Name</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                required
                className="w-full px-4 py-3 bg-slate-50 dark:bg-[#060e20] border border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-teal-500/50 outline-none transition-all duration-200 text-slate-900 dark:text-white placeholder:text-slate-400"
                placeholder="e.g. John Doe"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-[#b9c8de] mb-1.5">Email Address</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                required
                className="w-full px-4 py-3 bg-slate-50 dark:bg-[#060e20] border border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-teal-500/50 outline-none transition-all duration-200 text-slate-900 dark:text-white placeholder:text-slate-400"
                placeholder="e.g. john@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-[#b9c8de] mb-1.5">Portal Password</label>
              <input 
                type="text" 
                id="password" 
                name="password" 
                required
                className="w-full px-4 py-3 bg-slate-50 dark:bg-[#060e20] border border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-teal-500/50 outline-none transition-all duration-200 text-slate-900 dark:text-white placeholder:text-slate-400"
                placeholder="Set initial password"
              />
              <p className="text-xs text-slate-500 dark:text-[#8392a6] mt-2">The patient will use this to log into the Patient Portal. Requires minimum 8 characters.</p>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 dark:border-white/5 flex justify-end gap-3">
            <Link href="/admin" className="px-5 py-2.5 text-sm font-semibold text-slate-700 dark:text-[#dae2fd] bg-slate-100 dark:bg-[#222a3d] hover:bg-slate-200 dark:hover:bg-[#2d3449] rounded-xl transition-colors">
              Cancel
            </Link>
            <button 
              type="submit" 
              disabled={isPending}
              className="px-5 py-2.5 text-sm flex items-center gap-2 font-semibold text-white bg-gradient-to-br from-teal-400 to-teal-600 dark:from-[#3cddc7] dark:to-[#00a392] dark:text-[#003731] rounded-xl hover:opacity-90 disabled:opacity-70 transition-opacity drop-shadow-sm"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Enrolling...
                </>
              ) : (
                "Enroll Patient"
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
