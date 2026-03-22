"use client"

import { Search } from 'lucide-react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useTransition } from 'react'

export function PatientSearch() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams)
    if (term) {
      params.set('q', term)
    } else {
      params.delete('q')
    }
    
    // We use startTransition so the typing remains fluid while Next.js fetches data in the background
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`)
    })
  }

  return (
    <div className="relative group">
      <Search 
        className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-all duration-300 ${
          isPending ? 'text-teal-500 animate-pulse' : 'text-slate-400 group-focus-within:text-teal-500 dark:text-[#8392a6] dark:group-focus-within:text-[#3cddc7]'
        }`} 
      />
      <input 
        type="text" 
        placeholder="Search patients..." 
        defaultValue={searchParams.get('q')?.toString()}
        onChange={(e) => handleSearch(e.target.value)}
        className="pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-[#060e20] border-none rounded-xl focus:ring-2 focus:ring-teal-500/50 outline-none w-64 transition-all duration-200 shadow-inner dark:shadow-none placeholder:text-slate-400 dark:placeholder:text-[#8392a6] text-slate-900 dark:text-white"
      />
    </div>
  )
}
