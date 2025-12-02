"use client";

import { useStore } from "@/lib/store";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";
import { useEffect } from "react";

export function ToastContainer() {
    const { toasts, removeToast } = useStore();

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`
                        pointer-events-auto
                        flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border backdrop-blur-md animate-slide-in-right
                        ${toast.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' : ''}
                        ${toast.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-400' : ''}
                        ${toast.type === 'info' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : ''}
                    `}
                >
                    {toast.type === 'success' && <CheckCircle className="w-5 h-5" />}
                    {toast.type === 'error' && <AlertCircle className="w-5 h-5" />}
                    {toast.type === 'info' && <Info className="w-5 h-5" />}

                    <p className="text-sm font-medium">{toast.message}</p>

                    <button
                        onClick={() => removeToast(toast.id)}
                        className="ml-2 hover:opacity-70"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            ))}
        </div>
    );
}
