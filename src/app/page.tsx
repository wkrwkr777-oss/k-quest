"use client";

import Link from 'next/link';
import { ArrowRight, Star, Shield, Globe } from 'lucide-react';
import { Header } from '@/components/Header';
import { useStore } from '@/lib/store';
import Image from 'next/image';

export default function Home() {
  const { t, language } = useStore();

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#D4AF37] selection:text-black font-sans font-light">
      <Header />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background - Clean Dark */}
        <div className="absolute inset-0 bg-[#050505]" />

        {/* Subtle Gradient */}
        <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-[#D4AF37]/5 to-transparent pointer-events-none" />

        <div className="relative z-10 text-center max-w-5xl mx-auto px-6 pt-20 flex flex-col items-center">

          {/* App Icon - Apple Style */}
          <div className="mb-16 animate-[fadeIn_1s_ease-out_forwards]">
            <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-[3rem] overflow-hidden shadow-2xl hover:shadow-[0_0_40px_rgba(255,215,0,0.3)] hover:scale-105 transition-all duration-500 cursor-default">
              <Image
                src="/icon-512x512.png"
                alt="K-Quest"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-[fadeIn_1s_ease-out_0.9s_forwards]">
            <Link href="/quests/create">
              <button className="btn-luxury-filled text-xl font-bold tracking-wide px-12 py-5 shadow-lg hover:scale-105 transition-transform">
                {t.hero.requestService}
              </button>
            </Link>
            <Link href="/quests">
              <button className="btn-luxury text-xl font-bold tracking-wide px-12 py-5 hover:scale-105 transition-transform">
                {t.hero.exploreCollection}
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-32 bg-[#0A0A0A] relative border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: Star,
                title: t.features.curated.title,
                desc: t.features.curated.desc
              },
              {
                icon: Shield,
                title: t.features.escrow.title,
                desc: t.features.escrow.desc
              },
              {
                icon: Globe,
                title: t.features.global.title,
                desc: t.features.global.desc
              }
            ].map((item, i) => (
              <div key={i} className="group p-8 border border-white/5 hover:border-[#D4AF37]/30 transition-all duration-500 bg-[#050505]">
                <item.icon className="w-8 h-8 text-[#D4AF37] mb-6 stroke-1" />
                <h3 className="text-xl font-normal text-white mb-4">{item.title}</h3>
                <p className="text-gray-500 font-light leading-relaxed group-hover:text-gray-300 transition-colors">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-32 relative overflow-hidden bg-[#050505]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <span className="text-[#D4AF37] text-xs tracking-[0.2em] uppercase mb-4 block font-medium">{t.philosophy.label}</span>
          <h2 className="text-4xl md:text-5xl font-light mb-8 leading-tight">
            {t.philosophy.title} <br />
            <span className="text-[#D4AF37] font-normal">{t.philosophy.titleHighlight}</span>
          </h2>
          <p className="text-gray-400 font-light leading-relaxed mb-8">
            {t.philosophy.desc}
          </p>
          <Link href="/company">
            <div className="inline-flex items-center gap-2 text-[#D4AF37] hover:text-white transition-colors cursor-pointer group">
              <span className="uppercase tracking-widest text-xs font-medium">{t.philosophy.readMore}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#020202] border-t border-white/5 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-light text-white mb-2">K-QUEST</h3>
              <p className="text-gray-400 text-xs tracking-widest uppercase font-medium">
                {language === 'en' ? "All Quests in Korea" : "한국의 모든 퀘스트"}
              </p>
            </div>
            <div className="flex gap-8">
              <Link href="/terms" className="text-gray-500 hover:text-[#D4AF37] text-xs uppercase tracking-widest transition-colors font-medium">{t.footer.terms}</Link>
              <Link href="/privacy" className="text-gray-500 hover:text-[#D4AF37] text-xs uppercase tracking-widest transition-colors font-medium">{t.footer.privacy}</Link>
              <Link href="/company" className="text-gray-500 hover:text-[#D4AF37] text-xs uppercase tracking-widest transition-colors font-medium">{t.nav.about}</Link>
            </div>
            <div className="text-gray-700 text-xs font-mono">
              © 2025 K-QUEST. {t.footer.rights}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
