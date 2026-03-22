"use client"

import { useActionState } from 'react'
import { KeyRound, AlertTriangle, Loader2 } from 'lucide-react'
import { loginAction } from '@/lib/actions/auth.actions'

export default function LoginPage() {
  const [state, action, isPending] = useActionState(loginAction, {})

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b1326] flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-300">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-500/10 dark:bg-teal-500/20 rounded-full blur-[120px] pointer-events-none z-0 transition-colors duration-300"></div>
      
      <div className="w-full max-w-[420px] z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-400 to-teal-600 shadow-[0_10px_40px_rgba(45,212,191,0.2)] dark:shadow-[0_0_40px_rgba(45,212,191,0.3)] mb-6 transition-all duration-300">
            <KeyRound className="w-8 h-8 text-white dark:text-[#00201c]" />
          </div>
          <h1 className="text-3xl font-bold font-manrope text-slate-900 dark:text-white tracking-tight transition-colors duration-300">Patient Portal</h1>
          <p className="text-slate-500 dark:text-[#8392a6] mt-3 font-medium text-sm px-4 transition-colors duration-300">Log in to safely view your health records and manage upcoming appointments.</p>
        </div>

        <form action={action} className="bg-white/90 dark:bg-[#131b2e]/90 backdrop-blur-2xl rounded-[2rem] p-8 shadow-xl dark:shadow-[0_20px_40px_rgba(0,0,0,0.4)] border border-slate-100 dark:border-white/5 space-y-6 transition-all duration-300">
          
          {state?.error && (
            <div className="p-4 rounded-2xl bg-red-50 dark:bg-[#410002] border border-red-100 dark:border-red-500/20 text-red-600 dark:text-[#ffb4ab] text-sm font-semibold flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              <p>{state.error}</p>
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-[#b9c8de] mb-2 px-1 transition-colors duration-300">Email Address</label>
              <input 
                type="email" 
                name="email"
                required
                className="w-full px-5 py-4 bg-slate-50 dark:bg-[#060e20] border border-slate-200 dark:border-white/5 rounded-2xl focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/50 outline-none transition-all duration-200 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-[#3d4947]"
                placeholder="patient@example.com"
                defaultValue="mark@some-email-provider.net"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-[#b9c8de] mb-2 px-1 transition-colors duration-300">Password</label>
              <input 
                type="password" 
                name="password"
                required
                className="w-full px-5 py-4 bg-slate-50 dark:bg-[#060e20] border border-slate-200 dark:border-white/5 rounded-2xl focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/50 outline-none transition-all duration-200 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-[#3d4947]"
                placeholder="••••••••"
                defaultValue="Password123!"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isPending}
            className="w-full flex items-center justify-center gap-2 py-4 text-sm font-bold text-white dark:text-[#003731] bg-gradient-to-r from-teal-500 to-teal-600 dark:from-teal-400 dark:to-teal-500 rounded-2xl hover:opacity-90 disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-0.5 transition-all shadow-[0_10px_20px_rgba(45,212,191,0.2)] mt-8 uppercase tracking-widest relative"
          >
            {isPending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Authenticating...
              </>
            ) : (
              "Access Portal"
            )}
          </button>
          
          <div className="text-center pt-6">
            <span className="text-slate-500 dark:text-[#8392a6] text-xs font-medium transition-colors duration-300">For admin access, visit the <a href="/admin" className="text-teal-600 dark:text-teal-400 hover:text-teal-500 dark:hover:text-teal-300 underline underline-offset-4 decoration-teal-500/30">EMR Dashboard</a>.</span>
          </div>
        </form>
      </div>
    </div>
  )
}
