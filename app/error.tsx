"use client"

import { AlertTriangle, RefreshCcw } from "lucide-react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b1326] flex flex-col items-center justify-center p-8">
      <div className="bg-white dark:bg-[#171f33] rounded-3xl shadow-xl border border-red-100 dark:border-red-500/20 p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-red-50 dark:bg-[#410002] rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-red-500 dark:text-[#ffb4ab]" />
        </div>
        <h2 className="text-2xl font-bold font-manrope text-slate-900 dark:text-white mb-2">Something went wrong!</h2>
        <p className="text-sm text-slate-500 dark:text-[#b9c8de] mb-8">
          {error.message || "An unexpected error occurred while processing your request."}
        </p>
        <button
          onClick={() => reset()}
          className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-[#222a3d] text-white font-semibold rounded-xl hover:bg-slate-800 dark:hover:bg-[#2d3449] transition-colors"
        >
          <RefreshCcw className="w-4 h-4" />
          Try Again
        </button>
      </div>
    </div>
  )
}
