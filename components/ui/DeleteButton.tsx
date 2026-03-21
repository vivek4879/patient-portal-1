"use client"

import { Trash2, AlertTriangle } from 'lucide-react'
import { ComponentProps, useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'

interface DeleteButtonProps extends ComponentProps<'button'> {
  message?: string
  iconClassName?: string
}

export function DeleteButton({ message = "Are you sure you want to delete this record? This action cannot be undone.", iconClassName = "w-5 h-5", ...props }: DeleteButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Ensure portal only mounts on the client
  useEffect(() => {
    setMounted(true)
  }, [])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [isOpen])

  const modalContent = isOpen ? (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 dark:bg-[#060e20]/80 backdrop-blur-sm transition-all">
      <div 
        className="w-full max-w-sm bg-white dark:bg-[#171f33] rounded-3xl shadow-2xl dark:shadow-[0_20px_60px_rgba(0,0,0,0.6)] border border-slate-100 dark:border-white/10 p-8 animate-in zoom-in-95 fade-in duration-200"
      >
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-[#410002] flex items-center justify-center shrink-0 mb-5 border-4 border-white dark:border-[#171f33] shadow-sm">
            <AlertTriangle className="w-8 h-8 text-red-500 dark:text-[#ffb4ab]" />
          </div>
          
          <h4 className="text-xl font-bold font-manrope text-slate-900 dark:text-white mb-2">Confirm Deletion</h4>
          <p className="text-sm font-medium text-slate-500 dark:text-[#b9c8de] mb-8 leading-relaxed">{message}</p>
          
          <div className="flex w-full gap-3">
            <button 
              type="button"
              onClick={(e) => {
                e.preventDefault()
                setIsOpen(false)
              }}
              className="flex-1 px-4 py-3 text-sm font-semibold text-slate-700 dark:text-[#dae2fd] bg-slate-100 dark:bg-[#222a3d] hover:bg-slate-200 dark:hover:bg-[#2d3449] rounded-xl transition-colors border border-slate-200 dark:border-transparent"
            >
              Cancel
            </button>
            <button 
              type="button"
              onClick={(e) => {
                e.preventDefault()
                setIsOpen(false)
                if (buttonRef.current?.form) {
                  buttonRef.current.form.requestSubmit()
                }
              }}
              className="flex-1 px-4 py-3 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 dark:bg-[#aa2a2a] dark:text-[#ffdad6] dark:hover:bg-[#ff5449] dark:hover:text-[#410002] rounded-xl transition-colors shadow-sm"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : null

  return (
    <>
      <button 
        ref={buttonRef}
        type="button" 
        onClick={(e) => {
          e.preventDefault()
          setIsOpen(true)
        }}
        {...props}
      >
        <Trash2 className={iconClassName} />
      </button>

      {mounted && typeof document !== 'undefined' ? createPortal(modalContent, document.body) : null}
    </>
  )
}
