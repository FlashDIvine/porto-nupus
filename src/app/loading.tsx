export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full animate-pulse space-y-16">
      {/* 2-Column Hero Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 pb-16 border-b border-[#E6E2D8]">
        <div className="lg:col-span-7 space-y-6">
          <div className="h-6 w-48 bg-[#E6E2D8]/60 rounded-full" />
          <div className="h-16 w-4/5 bg-[#E6E2D8]/70 rounded-2xl" />
          <div className="h-12 w-3/5 bg-[#E6E2D8]/50 rounded-2xl" />
        </div>
        <div className="lg:col-span-5 space-y-4 pt-4">
          <div className="h-4 w-full bg-[#E6E2D8]/50 rounded" />
          <div className="h-4 w-5/6 bg-[#E6E2D8]/50 rounded" />
          <div className="h-10 w-44 bg-[#E6E2D8]/70 rounded-full mt-6" />
        </div>
      </div>

      {/* Bento Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        <div className="md:col-span-2 lg:col-span-2 aspect-[16/10] rounded-xl bg-[#FFFFFF] border border-[#E6E2D8] shadow-xs" />
        <div className="md:col-span-1 lg:col-span-1 aspect-[3/4] rounded-xl bg-[#FFFFFF] border border-[#E6E2D8] shadow-xs" />
        <div className="md:col-span-1 lg:col-span-1 aspect-[3/4] rounded-xl bg-[#FFFFFF] border border-[#E6E2D8] shadow-xs" />
        <div className="md:col-span-1 lg:col-span-1 aspect-[1/1] rounded-xl bg-[#FFFFFF] border border-[#E6E2D8] shadow-xs" />
      </div>
    </div>
  )
}
