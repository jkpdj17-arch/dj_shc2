'use client';

import React from 'react';
import { ToastMessage } from '@/types/schedule';
import { CheckCircle2, AlertTriangle, Info, XCircle } from 'lucide-react';

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[2000] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isWarning = toast.type === 'warning';
        const isError = toast.type === 'error';

        const borderColor = isSuccess
          ? 'border-emerald-500/80 bg-emerald-950/90 text-emerald-100'
          : isWarning
          ? 'border-amber-500/80 bg-amber-950/90 text-amber-100'
          : isError
          ? 'border-rose-500/80 bg-rose-950/90 text-rose-100'
          : 'border-cyan-500/80 bg-slate-900/95 text-slate-100';

        const Icon = isSuccess
          ? CheckCircle2
          : isWarning
          ? AlertTriangle
          : isError
          ? XCircle
          : Info;

        return (
          <div
            key={toast.id}
            onClick={() => onDismiss(toast.id)}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border backdrop-blur-md shadow-2xl transition-all duration-200 cursor-pointer ${borderColor}`}
          >
            <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="flex-1 text-sm font-medium leading-snug">
              {toast.text}
            </div>
          </div>
        );
      })}
    </div>
  );
}
