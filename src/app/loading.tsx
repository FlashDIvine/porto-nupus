export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full animate-pulse">
      {/* Hero Skeleton */}
      <div className="max-w-2xl mx-auto text-center space-y-4 mb-12">
        <div className="h-6 w-48 bg-white/5 rounded-full mx-auto" />
        <div className="h-12 w-3/4 bg-white/10 rounded-xl mx-auto" />
        <div className="h-4 w-1/2 bg-white/5 rounded mx-auto" />
      </div>

      {/* Bento Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 auto-rows-fr">
        <div className="md:col-span-2 md:row-span-2 min-h-[420px] rounded-2xl bg-[#121212] border border-white/5" />
        <div className="min-h-[200px] rounded-2xl bg-[#121212] border border-white/5" />
        <div className="min-h-[200px] rounded-2xl bg-[#121212] border border-white/5" />
        <div className="md:col-span-1 md:row-span-2 min-h-[420px] rounded-2xl bg-[#121212] border border-white/5" />
        <div className="md:col-span-2 md:row-span-1 min-h-[200px] rounded-2xl bg-[#121212] border border-white/5" />
      </div>
    </div>
  )
}
