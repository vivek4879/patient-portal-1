import { createSession } from '@/lib/utils/session'
import { PatientService } from '@/lib/services/patient.service'
import { redirect } from 'next/navigation'
import { KeyRound } from 'lucide-react'
import * as bcrypt from 'bcrypt'

export default function LoginPage() {
  async function login(formData: FormData) {
    'use server'
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const user = await PatientService.getPatientByEmail(email)
    
    if (user && await bcrypt.compare(password, user.password)) {
      await createSession(user.id)
      redirect('/portal')
    } else {
      redirect('/?error=invalid')
    }
  }

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

        <form action={login} className="bg-white/90 dark:bg-[#131b2e]/90 backdrop-blur-2xl rounded-[2rem] p-8 shadow-xl dark:shadow-[0_20px_40px_rgba(0,0,0,0.4)] border border-slate-100 dark:border-white/5 space-y-6 transition-all duration-300">
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
            className="w-full py-4 text-sm font-bold text-white dark:text-[#003731] bg-gradient-to-r from-teal-500 to-teal-600 dark:from-teal-400 dark:to-teal-500 rounded-2xl hover:opacity-90 hover:-translate-y-0.5 transition-all shadow-[0_10px_20px_rgba(45,212,191,0.2)] mt-8 uppercase tracking-widest"
          >
            Access Portal
          </button>
          
          <div className="text-center pt-6">
            <span className="text-slate-500 dark:text-[#8392a6] text-xs font-medium transition-colors duration-300">For admin access, visit the <a href="/admin" className="text-teal-600 dark:text-teal-400 hover:text-teal-500 dark:hover:text-teal-300 underline underline-offset-4 decoration-teal-500/30">EMR Dashboard</a>.</span>
          </div>
        </form>
      </div>
    </div>
  )
}
