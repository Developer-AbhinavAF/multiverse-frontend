import React from "react";

export const SkeletonCard = () => (
  <div className="relative flex h-full flex-col rounded-xl overflow-hidden border border-white/10 bg-white/5 animate-pulse" style={{ height: '520px' }}>
    <div className="flex-[9] min-h-0 w-full shimmer-container">
      <div className="w-full h-full bg-white/10 shimmer" />
    </div>
    <div className="flex-[1] min-h-0 w-full bg-black/30 px-3 py-6 flex flex-col justify-start gap-2">
      <div className="h-4 w-3/4 bg-white/10 rounded shimmer-container"><div className="shimmer" /></div>
      <div className="h-3 w-1/3 bg-white/10 rounded shimmer-container"><div className="shimmer" /></div>
    </div>
  </div>
);

export const MediatorSkeleton = () => (
  <div className="max-w-5xl mx-auto w-full animate-pulse">
    <div className="h-6 w-40 bg-white/10 rounded mb-6 shimmer-container"><div className="shimmer" /></div>
    <div className="flex flex-col md:flex-row gap-8 mb-8">
      <div className="flex-shrink-0 mx-auto md:mx-0">
        <div className="w-56 h-80 bg-white/10 rounded-2xl border border-white/10 shimmer-container"><div className="shimmer" /></div>
      </div>
      <div className="flex-grow w-full">
        <div className="h-7 w-2/3 bg-white/10 rounded mb-3 shimmer-container"><div className="shimmer" /></div>
        <div className="flex gap-2 mb-4">
          <div className="h-6 w-16 bg-white/10 rounded-full shimmer-container"><div className="shimmer" /></div>
          <div className="h-6 w-24 bg-white/10 rounded-full shimmer-container"><div className="shimmer" /></div>
        </div>
        <div className="h-10 w-60 bg-white/10 rounded-xl mb-4 shimmer-container"><div className="shimmer" /></div>
        <div className="h-4 w-full bg-white/10 rounded mb-2 shimmer-container"><div className="shimmer" /></div>
        <div className="h-4 w-5/6 bg-white/10 rounded shimmer-container"><div className="shimmer" /></div>
      </div>
    </div>
    <div className="flex gap-4 mb-6">
      <div className="h-9 w-32 bg-white/10 rounded-xl shimmer-container"><div className="shimmer" /></div>
      <div className="h-9 w-40 bg-white/10 rounded-xl shimmer-container"><div className="shimmer" /></div>
    </div>
    <div className="flex gap-6 border-b border-white/10 pb-2 mb-6">
      <div className="h-8 w-24 bg-white/10 rounded shimmer-container"><div className="shimmer" /></div>
      <div className="h-8 w-36 bg-white/10 rounded shimmer-container"><div className="shimmer" /></div>
      <div className="h-8 w-24 bg-white/10 rounded shimmer-container"><div className="shimmer" /></div>
      <div className="h-8 w-32 bg-white/10 rounded shimmer-container"><div className="shimmer" /></div>
    </div>
    <div className="grid md:grid-cols-2 gap-6">
      <div className="h-48 bg-white/5 border border-white/10 rounded-2xl shimmer-container"><div className="shimmer" /></div>
      <div className="h-48 bg-white/5 border border-white/10 rounded-2xl shimmer-container"><div className="shimmer" /></div>
    </div>
  </div>
);

export const StreamSkeleton = () => (
  <div className="max-w-6xl mx-auto w-full animate-pulse">
    <div className="flex justify-between items-center mb-6">
      <div className="h-6 w-36 bg-white/10 rounded shimmer-container"><div className="shimmer" /></div>
      <div className="h-7 w-64 bg-white/10 rounded shimmer-container"><div className="shimmer" /></div>
      <div className="w-10" />
    </div>
    <div className="flex flex-wrap justify-center gap-4 mb-4">
      <div className="h-9 w-20 bg-white/10 rounded-xl shimmer-container"><div className="shimmer" /></div>
      <div className="h-9 w-20 bg-white/10 rounded-xl shimmer-container"><div className="shimmer" /></div>
      <div className="h-9 w-20 bg-white/10 rounded-xl shimmer-container"><div className="shimmer" /></div>
      <div className="h-9 w-24 bg-white/10 rounded-xl shimmer-container"><div className="shimmer" /></div>
      <div className="h-9 w-24 bg-white/10 rounded-xl shimmer-container"><div className="shimmer" /></div>
    </div>
    <div className="mb-8 bg-black rounded-xl overflow-hidden relative border border-white/10">
      <div className="aspect-video bg-white/10 shimmer-container"><div className="shimmer" /></div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="md:col-span-2 h-40 bg-white/5 border border-white/10 rounded-2xl shimmer-container"><div className="shimmer" /></div>
      <div className="h-40 bg-white/5 border border-white/10 rounded-2xl shimmer-container"><div className="shimmer" /></div>
    </div>
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <div className="h-7 w-36 bg-white/10 rounded shimmer-container"><div className="shimmer" /></div>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-white/10 rounded-full shimmer-container"><div className="shimmer" /></div>
          <div className="h-4 w-28 bg-white/10 rounded shimmer-container"><div className="shimmer" /></div>
          <div className="h-8 w-8 bg-white/10 rounded-full shimmer-container"><div className="shimmer" /></div>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="rounded-xl p-3 border border-white/10 bg-white/5">
            <div className="aspect-video bg-white/10 rounded-lg mb-2 shimmer-container"><div className="shimmer" /></div>
            <div className="h-4 w-3/4 bg-white/10 rounded mb-1 shimmer-container"><div className="shimmer" /></div>
            <div className="h-3 w-1/2 bg-white/10 rounded shimmer-container"><div className="shimmer" /></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);
