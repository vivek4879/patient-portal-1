"use client"

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useTransition } from 'react'

interface PaginationProps {
  currentPage: number
  totalPages: number
}

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return

    const params = new URLSearchParams(searchParams)
    params.set('page', newPage.toString())
    
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`)
    })
  }

  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white dark:bg-[#171f33] border-t border-slate-100 dark:border-white/5 rounded-b-2xl transition-colors">
      <p className="text-sm text-slate-500 dark:text-[#8392a6]">
        Showing page <span className="font-bold text-slate-900 dark:text-white">{currentPage}</span> of <span className="font-bold text-slate-900 dark:text-white">{totalPages}</span>
      </p>

      <div className="flex items-center gap-2">
        <button
          disabled={currentPage <= 1 || isPending}
          onClick={() => handlePageChange(currentPage - 1)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-slate-600 dark:text-[#dae2fd] bg-slate-100 dark:bg-[#222a3d] hover:bg-slate-200 dark:hover:bg-[#2d3449] disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors border border-transparent"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>
        <button
          disabled={currentPage >= totalPages || isPending}
          onClick={() => handlePageChange(currentPage + 1)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-slate-600 dark:text-[#dae2fd] bg-slate-100 dark:bg-[#222a3d] hover:bg-slate-200 dark:hover:bg-[#2d3449] disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors border border-transparent"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
