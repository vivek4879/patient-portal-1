export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b1326] flex flex-col pt-24 items-center">
      <div className="w-12 h-12 border-4 border-teal-200 dark:border-[#003731] border-t-teal-500 dark:border-t-[#3cddc7] rounded-full animate-spin mb-4"></div>
      <p className="text-slate-500 dark:text-[#8392a6] font-medium animate-pulse">Loading dashboard records...</p>
    </div>
  )
}
