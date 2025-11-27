"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Crown,
  Shield,
  Zap,
  Star,
  Globe,
  BadgeCheck,
  Sparkles,
  Check,
  MessageCircle,
  CreditCard,
  Award,
} from 'lucide-react';

export default function Home() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white overflow-x-hidden">
      {/* Premium Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#D4AF37] to-[#C5A028] rounded-xl flex items-center justify-center">
                <Crown className="w-6 h-6 text-black" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-[#D4AF37] to-[#FFD700] bg-clip-text text-transparent">
                K-QUEST
              </span>
              <span className="text-xs px-2 py-1 bg-[#D4AF37]/20 text-[#D4AF37] rounded-full font-bold">
                PREMIUM
              </span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-gray-300 hover:text-[#D4AF37] transition-colors">
                Features
              </Link>
              <Link href="#pricing" className="text-gray-300 hover:text-[#D4AF37] transition-colors">
                Pricing
              </Link>
              <Link href="/auth/signin" className="px-6 py-2 bg-gradient-to-r from-[#D4AF37] to-[#C5A028] text-black font-bold rounded-xl hover:shadow-[0_0_25px_rgba(212,175,55,0.6)] transition-all">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-[#D4AF37]/10 rounded-full blur-3xl"
            style={{
              transform: `translateY(${scrollY * 0.2}px)`,
              animation: 'pulse 4s ease-in-out infinite'
            }}
          />
          <div
            className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-purple-500/10 rounded-full blur-3xl"
            style={{
              transform: `translateY(${scrollY * -0.2}px)`,
              animation: 'pulse 4s ease-in-out infinite 2s'
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* Premium Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-sm text-[#D4AF37] font-medium">
                Korea's First Luxury Concierge Platform
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-[#D4AF37] via-[#FFD700] to-[#D4AF37] bg-clip-text text-transparent">
                Experience Korea
              </span>
              <br />
              <span className="text-white">Like Never Before</span>
            </h1>

            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Connect with verified Korean experts for exclusive experiences.
              From Michelin reservations to private K-Pop access—your premium Korea journey starts here.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link
                href="/auth/signup"
                className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#D4AF37] to-[#C5A028] text-black font-bold rounded-xl hover:shadow-[0_0_30px_rgba(212,175,55,0.6)] transition-all text-lg"
              >
                <Crown className="w-5 h-5" />
                Start Your Journey
              </Link>
              <Link
                href="/contact"
                className="flex items-center gap-2 px-8 py-4 bg-transparent text-[#D4AF37] border-2 border-[#D4AF37] font-bold rounded-xl hover:bg-[#D4AF37]/10 transition-all text-lg"
              >
                <MessageCircle className="w-5 h-5" />
                Talk to Concierge
              </Link>
            </div>

            {/* Trust Indicators */}
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
          </div>
        </div>
      </section>

      {/* Premium Alert */}
      <section className="max-w-7xl mx-auto px-6 mb-20">
        <div className="bg-gradient-to-r from-[#D4AF37]/20 to-[#C5A028]/10 border border-[#D4AF37]/50 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Crown className="w-5 h-5 text-[#D4AF37]" />
            <div className="flex-1">
              <h4 className="font-bold mb-1 text-[#D4AF37]">🎉 VIP Platinum Launch Special</h4>
              <p className="text-gray-300 text-sm">First 100 members get lifetime 50% off on all premium features. Limited time offer!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Premium <span className="bg-gradient-to-r from-[#D4AF37] to-[#FFD700] bg-clip-text text-transparent">Features</span>
          </h2>
          <p className="text-xl text-gray-400">Experience luxury concierge service powered by AI</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: <BadgeCheck className="w-6 h-6" />,
              title: "Verified Experts",
              description: "Every expert is government-ID verified with 98%+ success rate. Your safety is guaranteed.",
              badge: "NEW"
            },
            {
              icon: <Shield className="w-6 h-6" />,
              title: "$1M Insurance",
              description: "All transactions protected by $1M insurance coverage. 100% money-back guarantee."
            },
            {
              icon: <Zap className="w-6 h-6" />,
              title: "AI Smart Matching",
              description: "Advanced AI matches you with the perfect expert in seconds. Success prediction included."
            },
            {
              icon: <Globe className="w-6 h-6" />,
              title: "Real-time Translation",
              description: "Communicate in 12+ languages with auto-translation. No language barriers."
            },
            {
              icon: <CreditCard className="w-6 h-6" />,
              title: "Secure Escrow",
              description: "Premium escrow system holds payment until quest completion. 100% secure."
            },
            {
              icon: <Award className="w-6 h-6" />,
              title: "24/7 VIP Support",
              description: "Dedicated concierge team available round-the-clock for Platinum members."
            }
          ].map((feature, index) => (
            <div
              key={index}
              className="relative group bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] border border-[#333] rounded-2xl p-6 transition-all duration-300 hover:border-[#D4AF37] hover:shadow-[0_0_30px_rgba(212,175,55,0.3)]"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#D4AF37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative z-10">
                <div className="mb-4 relative">
                  <div className="w-12 h-12 bg-[#D4AF37]/20 rounded-xl flex items-center justify-center text-[#D4AF37] group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  {feature.badge && (
                    <span className="absolute -top-2 -right-2 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                      {feature.badge}
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* VIP Tiers */}
      <section id="pricing" className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Choose Your <span className="bg-gradient-to-r from-[#D4AF37] to-[#FFD700] bg-clip-text text-transparent">Experience</span>
          </h2>
          <p className="text-xl text-gray-400">Unlock exclusive benefits with VIP membership</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              name: "Bronze",
              price: "Free",
              color: "from-amber-700 to-amber-900",
              features: ["Basic features", "5% platform fee", "Email support"]
            },
            {
              name: "Silver",
              price: "$10/mo",
              color: "from-gray-400 to-gray-600",
              features: ["Priority matching", "3% platform fee", "Priority support"]
            },
            {
              name: "Gold",
              price: "$50/mo",
              color: "from-yellow-400 to-yellow-600",
              popular: true,
              features: ["Premium experts only", "2% platform fee", "24/7 concierge", "Unlimited emergencies"]
            },
            {
              name: "Platinum",
              price: "$200/mo",
              color: "from-purple-400 to-purple-600",
              exclusive: true,
              features: ["Dedicated manager", "1% platform fee", "Private jet booking", "Exclusive events"]
            }
          ].map((tier, index) => (
            <div
              key={index}
              className={`relative bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] border ${tier.popular ? 'border-[#D4AF37] border-2' : 'border-[#333]'} rounded-2xl p-6`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-[#D4AF37] text-black text-xs font-bold rounded-full">
                  POPULAR
                </div>
              )}
              {tier.exclusive && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xs font-bold rounded-full">
                  EXCLUSIVE
                </div>
              )}

              <div className={`inline-flex items-center gap-2 px-4 py-2 shadow-[0_0_20px_rgba(180,83,9,0.5)] rounded-full bg-gradient-to-r ${tier.color} text-white font-bold text-sm mb-4`}>
                <Star className="w-4 h-4" />
                {tier.name}
              </div>

              <div className="text-3xl font-bold text-white mb-6">{tier.price}</div>

              <ul className="space-y-3 mb-6">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-300">
                    <Check className="w-5 h-5 text-green-400" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button className="w-full px-4 py-2 bg-gradient-to-r from-[#D4AF37] to-[#C5A028] text-black font-bold rounded-xl hover:shadow-[0_0_20px_rgba(212,175,55,0.6)] transition-all">
                {tier.price === "Free" ? "Get Started" : `Upgrade to ${tier.name}`}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Crown className="w-6 h-6 text-[#D4AF37]" />
                <span className="text-xl font-bold">K-QUEST</span>
              </div>
              <p className="text-gray-400 text-sm">
                Korea's premier luxury concierge platform
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="#features" className="hover:text-[#D4AF37]">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-[#D4AF37]">Pricing</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/company" className="hover:text-[#D4AF37]">About</Link></li>
                <li><Link href="/terms" className="hover:text-[#D4AF37]">Terms</Link></li>
                <li><Link href="/privacy" className="hover:text-[#D4AF37]">Privacy</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="mailto:support@quest-k.com" className="hover:text-[#D4AF37]">Contact</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 text-center text-gray-400 text-sm">
            <p>© 2025 K-Quest Premium. All rights reserved.</p>
            <p className="mt-2">포텐타로 | 사업자등록번호: 624-17-02651 | 통신판매업: 제2025-의정부송산-0387호</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.5;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05);
          }
        }
      `}</style>
    </div>
  );
}
