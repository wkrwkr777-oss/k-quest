// 💎 프리미엄 UI 컴포넌트 라이브러리
import { Star, Shield, Award, Zap, Crown, CheckCircle2, TrendingUp, Users, Clock, BadgeCheck } from 'lucide-react';
import { ReactNode } from 'react';

/**
 * 프리미엄 그라데이션 카드
 */
interface PremiumCardProps {
    children: ReactNode;
    className?: string;
    glow?: boolean;
    onClick?: () => void;
}

export function PremiumCard({ children, className = '', glow = false, onClick }: PremiumCardProps) {
    return (
        <div
            onClick={onClick}
            className={`
                relative group
                bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A]
                border border-[#333]
                rounded-2xl p-6
                transition-all duration-300
                hover:border-[#D4AF37]
                ${glow ? 'hover:shadow-[0_0_30px_rgba(212,175,55,0.3)]' : ''}
                ${onClick ? 'cursor-pointer' : ''}
                ${className}
            `}
        >
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#D4AF37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
}

/**
 * 유리 모피즘 카드 (Glassmorphism)
 */
export function GlassCard({ children, className = '' }: { children: ReactNode; className?: string }) {
    return (
        <div
            className={`
                backdrop-blur-xl
                bg-white/5
                border border-white/10
                rounded-2xl p-6
                shadow-2xl
                ${className}
            `}
            style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
            }}
        >
            {children}
        </div>
    );
}

/**
 * VIP 티어 배지
 */
export function TierBadge({ tier }: { tier: 'bronze' | 'silver' | 'gold' | 'platinum' }) {
    const config = {
        bronze: {
            label: 'Bronze',
            icon: Award,
            gradient: 'from-amber-700 to-amber-900',
            glow: 'shadow-[0_0_20px_rgba(180,83,9,0.5)]',
        },
        silver: {
            label: 'Silver',
            icon: Star,
            gradient: 'from-gray-400 to-gray-600',
            glow: 'shadow-[0_0_20px_rgba(156,163,175,0.5)]',
        },
        gold: {
            label: 'Gold',
            icon: Crown,
            gradient: 'from-yellow-400 to-yellow-600',
            glow: 'shadow-[0_0_20px_rgba(212,175,55,0.7)]',
        },
        platinum: {
            label: 'Platinum',
            icon: Zap,
            gradient: 'from-purple-400 to-purple-600',
            glow: 'shadow-[0_0_30px_rgba(139,92,246,0.8)]',
        },
    };

    const { label, icon: Icon, gradient, glow } = config[tier];

    return (
        <div className={`inline-flex items-center gap-2 px-4 py-2 ${glow} rounded-full bg-gradient-to-r ${gradient} text-white font-bold text-sm`}>
            <Icon className="w-4 h-4" />
            {label}
        </div>
    );
}

/**
 * Verified Expert 배지
 */
export function VerifiedBadge({ type = 'expert' }: { type?: 'expert' | 'premium' | 'business' }) {
    const config = {
        expert: {
            label: 'Verified Expert',
            icon: BadgeCheck,
            color: 'text-blue-400',
            bg: 'bg-blue-500/20',
            border: 'border-blue-500/50',
        },
        premium: {
            label: 'Premium',
            icon: Crown,
            color: 'text-[#D4AF37]',
            bg: 'bg-[#D4AF37]/20',
            border: 'border-[#D4AF37]/50',
        },
        business: {
            label: 'Business Verified',
            icon: Shield,
            color: 'text-green-400',
            bg: 'bg-green-500/20',
            border: 'border-green-500/50',
        },
    };

    const { label, icon: Icon, color, bg, border } = config[type];

    return (
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 ${bg} ${border} border rounded-full`}>
            <Icon className={`w-4 h-4 ${color}`} />
            <span className={`text-xs font-semibold ${color}`}>{label}</span>
        </div>
    );
}

/**
 * 별점 표시 (Star Rating)
 */
export function StarRating({ rating, reviews }: { rating: number; reviews?: number }) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    return (
        <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        className={`w-4 h-4 ${i < fullStars
                                ? 'fill-[#D4AF37] text-[#D4AF37]'
                                : i === fullStars && hasHalfStar
                                    ? 'fill-[#D4AF37]/50 text-[#D4AF37]'
                                    : 'text-gray-600'
                            }`}
                    />
                ))}
            </div>
            <span className="text-sm text-gray-300 font-medium">{rating.toFixed(1)}</span>
            {reviews !== undefined && (
                <span className="text-sm text-gray-500">({reviews} reviews)</span>
            )}
        </div>
    );
}

/**
 * Achievement 배지
 */
interface AchievementBadgeProps {
    icon: ReactNode;
    label: string;
    color?: string;
    tooltip?: string;
}

export function AchievementBadge({ icon, label, color = 'gold', tooltip }: AchievementBadgeProps) {
    const colors = {
        gold: 'bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]/50',
        blue: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
        green: 'bg-green-500/20 text-green-400 border-green-500/50',
        purple: 'bg-purple-500/20 text-purple-400 border-purple-500/50',
    };

    return (
        <div
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 border rounded-lg ${colors[color as keyof typeof colors]}`}
            title={tooltip}
        >
            {icon}
            <span className="text-xs font-medium">{label}</span>
        </div>
    );
}

/**
 * Success Rate Indicator
 */
export function SuccessRate({ rate }: { rate: number }) {
    const getColor = (rate: number) => {
        if (rate >= 95) return { bg: 'bg-green-500', text: 'text-green-400', glow: 'shadow-[0_0_15px_rgba(34,197,94,0.5)]' };
        if (rate >= 85) return { bg: 'bg-blue-500', text: 'text-blue-400', glow: 'shadow-[0_0_15px_rgba(59,130,246,0.5)]' };
        if (rate >= 70) return { bg: 'bg-yellow-500', text: 'text-yellow-400', glow: 'shadow-[0_0_15px_rgba(234,179,8,0.5)]' };
        return { bg: 'bg-red-500', text: 'text-red-400', glow: 'shadow-[0_0_15px_rgba(239,68,68,0.5)]' };
    };

    const { bg, text, glow } = getColor(rate);

    return (
        <div className="flex items-center gap-3">
            <div className="relative w-16 h-16">
                <svg className="w-16 h-16 transform -rotate-90">
                    <circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                        className="text-gray-700"
                    />
                    <circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 28}`}
                        strokeDashoffset={`${2 * Math.PI * 28 * (1 - rate / 100)}`}
                        className={`${text} transition-all duration-500 ${glow}`}
                        strokeLinecap="round"
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`text-sm font-bold ${text}`}>{rate}%</span>
                </div>
            </div>
            <div>
                <div className="text-white font-semibold">Success Rate</div>
                <div className="text-gray-400 text-sm">Completed quests</div>
            </div>
        </div>
    );
}

/**
 * Premium Stat Card
 */
interface StatCardProps {
    icon: ReactNode;
    label: string;
    value: string | number;
    change?: string;
    trend?: 'up' | 'down' | 'neutral';
}

export function StatCard({ icon, label, value, change, trend }: StatCardProps) {
    const getTrendColor = () => {
        if (trend === 'up') return 'text-green-400';
        if (trend === 'down') return 'text-red-400';
        return 'text-gray-400';
    };

    return (
        <PremiumCard glow>
            <div className="flex items-start justify-between">
                <div>
                    <div className="text-gray-400 text-sm mb-2">{label}</div>
                    <div className="text-3xl font-bold text-white mb-1">{value}</div>
                    {change && (
                        <div className={`flex items-center gap-1 text-sm ${getTrendColor()}`}>
                            {trend === 'up' && <TrendingUp className="w-4 h-4" />}
                            {trend === 'down' && <TrendingUp className="w-4 h-4 rotate-180" />}
                            <span>{change}</span>
                        </div>
                    )}
                </div>
                <div className="p-3 bg-[#D4AF37]/20 rounded-xl">
                    {icon}
                </div>
            </div>
        </PremiumCard>
    );
}

/**
 * Premium Button
 */
interface PremiumButtonProps {
    children: ReactNode;
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    onClick?: () => void;
    disabled?: boolean;
    loading?: boolean;
    icon?: ReactNode;
}

export function PremiumButton({
    children,
    variant = 'primary',
    size = 'md',
    onClick,
    disabled = false,
    loading = false,
    icon,
}: PremiumButtonProps) {
    const variants = {
        primary: 'bg-gradient-to-r from-[#D4AF37] to-[#C5A028] text-black hover:shadow-[0_0_25px_rgba(212,175,55,0.6)]',
        secondary: 'bg-[#262626] text-white hover:bg-[#333] border border-[#333]',
        outline: 'bg-transparent text-[#D4AF37] border-2 border-[#D4AF37] hover:bg-[#D4AF37]/10',
    };

    const sizes = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg',
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled || loading}
            className={`
                ${variants[variant]}
                ${sizes[size]}
                rounded-xl font-bold
                transition-all duration-300
                disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center justify-center gap-2
                relative overflow-hidden
                group
            `}
        >
            {/* Shimmer effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            {loading ? (
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
                <>
                    {icon}
                    <span className="relative z-10">{children}</span>
                </>
            )}
        </button>
    );
}

/**
 * Trust Indicators (신뢰 지표)
 */
export function TrustIndicators() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
                <div className="text-3xl font-bold text-[#D4AF37] mb-1">98%</div>
                <div className="text-gray-400 text-sm">Success Rate</div>
            </div>
            <div className="text-center">
                <div className="text-3xl font-bold text-[#D4AF37] mb-1">10K+</div>
                <div className="text-gray-400 text-sm">Verified Experts</div>
            </div>
            <div className="text-center">
                <div className="text-3xl font-bold text-[#D4AF37] mb-1">$1M</div>
                <div className="text-gray-400 text-sm">Insurance Coverage</div>
            </div>
            <div className="text-center">
                <div className="text-3xl font-bold text-[#D4AF37] mb-1">24/7</div>
                <div className="text-gray-400 text-sm">VIP Support</div>
            </div>
        </div>
    );
}

/**
 * Premium Timeline
 */
interface TimelineItem {
    title: string;
    description: string;
    date: string;
    status: 'completed' | 'active' | 'pending';
}

export function PremiumTimeline({ items }: { items: TimelineItem[] }) {
    return (
        <div className="space-y-6">
            {items.map((item, index) => (
                <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                        <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${item.status === 'completed'
                                    ? 'bg-green-500/20 text-green-400 border-2 border-green-500'
                                    : item.status === 'active'
                                        ? 'bg-[#D4AF37]/20 text-[#D4AF37] border-2 border-[#D4AF37] animate-pulse'
                                        : 'bg-gray-700 text-gray-500 border-2 border-gray-600'
                                }`}
                        >
                            {item.status === 'completed' ? (
                                <CheckCircle2 className="w-5 h-5" />
                            ) : (
                                <span className="text-sm font-bold">{index + 1}</span>
                            )}
                        </div>
                        {index < items.length - 1 && (
                            <div className={`w-0.5 h-12 ${item.status === 'completed' ? 'bg-green-500' : 'bg-gray-700'}`} />
                        )}
                    </div>
                    <div className="flex-1 pb-8">
                        <div className="flex items-start justify-between mb-1">
                            <h4 className="text-white font-semibold">{item.title}</h4>
                            <span className="text-xs text-gray-500">{item.date}</span>
                        </div>
                        <p className="text-gray-400 text-sm">{item.description}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

/**
 * Feature Showcase Card
 */
interface FeatureCardProps {
    icon: ReactNode;
    title: string;
    description: string;
    badge?: string;
}

export function FeatureCard({ icon, title, description, badge }: FeatureCardProps) {
    return (
        <PremiumCard glow className="group">
            <div className="mb-4 relative">
                <div className="w-12 h-12 bg-[#D4AF37]/20 rounded-xl flex items-center justify-center text-[#D4AF37] group-hover:scale-110 transition-transform duration-300">
                    {icon}
                </div>
                {badge && (
                    <span className="absolute -top-2 -right-2 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                        {badge}
                    </span>
                )}
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
            <p className="text-gray-400 leading-relaxed">{description}</p>
        </PremiumCard>
    );
}

/**
 * Premium Alert/Notification
 */
interface PremiumAlertProps {
    type: 'success' | 'error' | 'warning' | 'info' | 'premium';
    title?: string;
    message: string;
    icon?: ReactNode;
}

export function PremiumAlert({ type, title, message, icon }: PremiumAlertProps) {
    const config = {
        success: {
            bg: 'from-green-500/20 to-green-600/10',
            border: 'border-green-500/50',
            text: 'text-green-400',
            icon: <CheckCircle2 className="w-5 h-5" />,
        },
        error: {
            bg: 'from-red-500/20 to-red-600/10',
            border: 'border-red-500/50',
            text: 'text-red-400',
            icon: <Clock className="w-5 h-5" />,
        },
        warning: {
            bg: 'from-yellow-500/20 to-yellow-600/10',
            border: 'border-yellow-500/50',
            text: 'text-yellow-400',
            icon: <Clock className="w-5 h-5" />,
        },
        info: {
            bg: 'from-blue-500/20 to-blue-600/10',
            border: 'border-blue-500/50',
            text: 'text-blue-400',
            icon: <Clock className="w-5 h-5" />,
        },
        premium: {
            bg: 'from-[#D4AF37]/20 to-[#C5A028]/10',
            border: 'border-[#D4AF37]/50',
            text: 'text-[#D4AF37]',
            icon: <Crown className="w-5 h-5" />,
        },
    };

    const { bg, border, text, icon: defaultIcon } = config[type];

    return (
        <div className={`bg-gradient-to-r ${bg} border ${border} rounded-xl p-4`}>
            <div className="flex items-start gap-3">
                <div className={text}>{icon || defaultIcon}</div>
                <div className="flex-1">
                    {title && <h4 className={`font-bold mb-1 ${text}`}>{title}</h4>}
                    <p className="text-gray-300 text-sm">{message}</p>
                </div>
            </div>
        </div>
    );
}
