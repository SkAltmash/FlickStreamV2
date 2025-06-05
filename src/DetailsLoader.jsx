import React from 'react'

function DetailsLoader() {
  return (
    <div>
        <div className="max-w-5xl mx-auto p-4 space-y-4">
  <div className="h-56 w-full rounded-md animate-shimmer" />
  <div className="h-8 w-2/3 rounded animate-shimmer" />
  <div className="h-4 w-full rounded animate-shimmer" />
  <div className="h-4 w-3/4 rounded animate-shimmer" />
  <div className="flex gap-2 mt-4">
    {Array.from({ length: 5 }).map((_, idx) => (
      <div key={idx} className="w-20 h-20 rounded-full animate-shimmer" />
    ))}
  </div>
</div>

    </div>
  )
}

export default DetailsLoader