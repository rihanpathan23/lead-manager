import React from 'react';

export function PageLoader({ message = 'Loading leads...', overlay = false }) {
  if (overlay) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/25 backdrop-blur-[2px] transition-opacity">
        <div className="flex flex-col items-center gap-3 rounded-2xl bg-white px-7 py-6 shadow-xl ring-1 ring-slate-200/80">
          <div className="relative flex h-12 w-12 items-center justify-center">
            <div className="absolute inset-0 rounded-full border-[3px] border-indigo-100" />
            <div className="absolute inset-0 animate-spin rounded-full border-[3px] border-transparent border-t-indigo-600 border-r-indigo-600" />
            <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-indigo-600" />
          </div>
          <p className="text-sm font-medium tracking-wide text-slate-700">
            {message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="relative flex h-11 w-11 items-center justify-center">
        <div className="absolute inset-0 rounded-full border-[3px] border-indigo-100" />
        <div className="absolute inset-0 animate-spin rounded-full border-[3px] border-transparent border-t-indigo-600 border-r-indigo-600" />
        <div className="h-2 w-2 animate-pulse rounded-full bg-indigo-600" />
      </div>
      <p className="mt-3.5 text-sm font-medium text-slate-500">{message}</p>
    </div>
  );
}

export function ButtonSpinner() {
  return (
    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
  );
}