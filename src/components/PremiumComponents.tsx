"use client";

import React from 'react';
import { Loader2, AlertCircle, Shield, CheckCircle2 } from 'lucide-react';

// 1. Luxury Card
export const PremiumCard = ({ children, className = "", hover = true }: { children: React.ReactNode, className?: string, hover?: boolean }) => (
    <div className={`premium-card rounded-sm p-8 ${className}`}>
        {children}
    </div>
);

// 2. Glass Card (Simple)
export const GlassCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
    <div className={`bg-[#0A0A0A]/80 backdrop-blur-md border border-white/5 rounded-sm p-6 ${className}`}>
        {children}
    </div>
);

// 3. Luxury Button
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    icon?: React.ReactNode;
}

export const PremiumButton = ({
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    icon,
    className = "",
    ...props
}: ButtonProps) => {
    const baseStyles = "relative inline-flex items-center justify-center rounded-none font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group tracking-widest uppercase";

    const variants = {
        primary: "btn-luxury-filled",
        secondary: "btn-luxury",
        outline: "bg-transparent border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black",
        ghost: "bg-transparent text-gray-400 hover:text-[#D4AF37]"
    };

    const sizes = {
        sm: "px-4 py-2 text-xs",
        md: "px-8 py-3 text-xs",
        lg: "px-10 py-4 text-sm"
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            disabled={loading || props.disabled}
            {...props}
        >
            {loading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : icon ? (
                <span className="mr-2 group-hover:translate-x-1 transition-transform duration-300">{icon}</span>
            ) : null}
            <span className="relative z-10">{children}</span>
        </button>
    );
};

// 4. Tier Badge (Luxury)
export const TierBadge = ({ tier }: { tier: string }) => {
    return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] tracking-widest uppercase bg-[#D4AF37]/5">
            <span className="w-1 h-1 rounded-full bg-[#D4AF37]" />
            {tier}
        </span>
    );
};

// 5. Alert
export const PremiumAlert = ({ type, message }: { type: 'success' | 'error' | 'info' | 'warning', message: string }) => {
    const styles = {
        success: "border-green-900/30 text-green-400 bg-green-900/10",
        error: "border-red-900/30 text-red-400 bg-red-900/10",
        info: "border-[#D4AF37]/30 text-[#D4AF37] bg-[#D4AF37]/5",
        warning: "border-yellow-900/30 text-yellow-400 bg-yellow-900/10"
    };

    return (
        <div className={`flex items-center gap-3 p-4 border ${styles[type]}`}>
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <p className="text-xs tracking-wide uppercase">{message}</p>
        </div>
    );
};

// 6. Stat Card (Minimalist)
export const StatCard = ({ icon, label, value, change, trend }: { icon: React.ReactNode, label: string, value: string, change?: string, trend?: 'up' | 'down' }) => (
    <PremiumCard className="relative overflow-hidden group hover:border-[#D4AF37] transition-colors">
        <div className="absolute right-4 top-4 opacity-20 group-hover:opacity-100 transition-opacity text-[#D4AF37]">
            {icon}
        </div>
        <div className="relative z-10">
            <div className="text-gray-500 text-[10px] uppercase tracking-widest mb-2">{label}</div>
            <div className="text-3xl font-serif-display text-white mb-2">{value}</div>
            {change && (
                <div className={`text-xs flex items-center gap-1 ${trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                    <span>{change}</span>
                </div>
            )}
        </div>
    </PremiumCard>
);

// 7. Verified Badge (Luxury)
export const VerifiedBadge = ({ level = 1 }: { level?: number }) => (
    <div className="inline-flex items-center gap-1 px-2 py-0.5 border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] uppercase tracking-wider">
        <Shield className="w-3 h-3" />
        VERIFIED
    </div>
);
