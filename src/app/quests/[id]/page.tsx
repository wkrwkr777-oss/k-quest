"use client";

import { Button } from "@/components/ui/Button";
import { ArrowLeft, MapPin, Clock, DollarSign, Shield, CheckCircle, XCircle, User } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useStore, Application } from "@/lib/store";
import { useState } from "react";

export default function QuestDetailPage() {
    const params = useParams();
    const { t, user, userId, applyForQuest, applications, acceptApplicant, rejectApplicant } = useStore();
    const id = params.id as string;

    // State for Apply Modal
    const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
    const [applyMessage, setApplyMessage] = useState("");

    // Mock data - in a real app, fetch based on ID
    // For demo purposes, we assume this quest belongs to 'demo-traveler-id'
    const quest = {
        id,
        title: t.demo.quest.title,
        description: t.demo.quest.description,
        reward: "$50.00",
        location: t.demo.quest.location,
        time: t.demo.quest.time,
        requester: "Sarah J.",
        requesterId: 'demo-traveler-id', // Hardcoded for demo logic
        category: t.demo.quest.category,
        image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=2574&auto=format&fit=crop",
        status: 'open' // open, in_progress, completed
    };

    // Check if current user is the owner of this quest
    // For demo: If user is 'foreigner', we treat them as the owner (Sarah J.)
    const isOwner = user === 'foreigner';

    // Check if current user has already applied
    const myApplication = applications.find(app => app.questId === id && app.applicantId === userId);
    const hasApplied = !!myApplication;

    // Get all applications for this quest (only visible to owner)
    const questApplications = applications.filter(app => app.questId === id);

    const handleApply = () => {
        if (!applyMessage.trim()) return;
        applyForQuest(id, applyMessage);
        setIsApplyModalOpen(false);
        setApplyMessage("");
    };

    return (
        <main className="min-h-screen bg-[#1A1A1A] flex flex-col lg:flex-row">
            {/* Left: Visual Hero */}
            <div className="w-full lg:w-1/2 h-[40vh] lg:h-screen relative lg:fixed lg:left-0 lg:top-0 overflow-hidden">
                <div className="absolute inset-0 bg-black/40 z-10" />
                <div
                    className="w-full h-full bg-cover bg-center scale-105"
                    style={{ backgroundImage: `url(${quest.image})` }}
                />
                <div className="absolute bottom-6 left-6 right-6 lg:bottom-12 lg:left-12 lg:right-12 z-20">
                    <Link href="/quests" className="inline-flex items-center text-white/80 hover:text-[#D4AF37] mb-4 lg:mb-6 transition-colors text-sm">
                        <ArrowLeft className="w-4 h-4 mr-2" /> {t.common.back}
                    </Link>
                    <p className="text-[#D4AF37] text-xs lg:text-sm uppercase tracking-[0.2em] mb-2">{quest.category}</p>
                    <h1 className="text-3xl lg:text-5xl font-serif text-white leading-tight mb-4 lg:mb-6">
                        {quest.title}
                    </h1>
                    <div className="flex flex-wrap gap-4 lg:gap-6 text-xs lg:text-sm text-gray-300">
                        <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2 text-[#D4AF37]" /> {quest.location}
                        </div>
                        <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2 text-[#D4AF37]" /> {quest.time}
                        </div>
                        <div className="flex items-center">
                            <DollarSign className="w-4 h-4 mr-2 text-[#D4AF37]" /> {quest.reward}
                        </div>
                    </div>
                </div>
            </div>

            {/* Right: Scrollable Content */}
            <div className="w-full lg:w-1/2 lg:ml-[50%] min-h-screen bg-[#1A1A1A] border-l border-[#333]">
                <div className="p-6 md:p-20 max-w-2xl mx-auto">
                    {/* Trust Badge */}
                    <div className="bg-[#262626] border border-[#333] p-4 mb-12 flex items-start gap-4">
                        <Shield className="w-6 h-6 text-[#D4AF37] flex-shrink-0" />
                        <div>
                            <h3 className="text-white font-medium mb-1">K-Quest Secure Escrow</h3>
                            <p className="text-gray-500 text-xs leading-relaxed">
                                {t.quest.safety}
                            </p>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mb-16">
                        <h2 className="text-2xl font-serif text-white mb-6">{t.quest.requestDetails}</h2>
                        <p className="text-gray-300 leading-relaxed font-light text-lg">
                            {quest.description}
                        </p>
                    </div>

                    {/* Financial Breakdown */}
                    <div className="mb-16">
                        <h2 className="text-2xl font-serif text-white mb-6">{t.quest.financialBreakdown}</h2>
                        <div className="bg-[#262626] border border-[#333] p-8">
                            <div className="flex justify-between items-center mb-4 pb-4 border-b border-[#333]">
                                <span className="text-gray-400">{t.quest.totalReward}</span>
                                <span className="text-2xl font-serif text-white">{quest.reward}</span>
                            </div>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between text-gray-500">
                                    <span>{t.quest.performerEarnings} (70%)</span>
                                    <span>$35.00</span>
                                </div>
                                <div className="flex justify-between text-[#D4AF37]">
                                    <span>{t.quest.platformFee} (30%)</span>
                                    <span>$15.00</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- DYNAMIC ACTION SECTION --- */}
                    <div className="sticky bottom-8 space-y-4">

                        {/* CASE 1: Requester (Owner) View - Manage Applicants */}
                        {isOwner && (
                            <div className="bg-[#222] border border-[#333] p-6 rounded-sm">
                                <h3 className="text-white font-serif text-xl mb-4 flex items-center">
                                    <User className="w-5 h-5 mr-2 text-[#D4AF37]" />
                                    Applicants ({questApplications.length})
                                </h3>

                                {questApplications.length === 0 ? (
                                    <p className="text-gray-500 text-sm">No applicants yet. Waiting for experts...</p>
                                ) : (
                                    <div className="space-y-4">
                                        {questApplications.map((app) => (
                                            <div key={app.id} className="bg-[#1A1A1A] p-4 border border-[#333] hover:border-[#D4AF37] transition-colors">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <span className="text-white font-bold">{app.applicantName}</span>
                                                        <span className={`ml-2 text-[10px] px-2 py-0.5 rounded-full ${app.status === 'accepted' ? 'bg-green-900 text-green-300' :
                                                                app.status === 'rejected' ? 'bg-red-900 text-red-300' :
                                                                    'bg-yellow-900 text-yellow-300'
                                                            }`}>
                                                            {app.status.toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <span className="text-gray-500 text-xs">{new Date(app.createdAt).toLocaleDateString()}</span>
                                                </div>
                                                <p className="text-gray-300 text-sm mb-4 italic">"{app.message}"</p>

                                                {app.status === 'pending' && (
                                                    <div className="flex gap-2">
                                                        <Button
                                                            onClick={() => acceptApplicant(id, app.id)}
                                                            size="sm"
                                                            className="flex-1 bg-[#D4AF37] text-black hover:bg-[#b5952f]"
                                                        >
                                                            <CheckCircle className="w-3 h-3 mr-1" /> Accept
                                                        </Button>
                                                        <Button
                                                            onClick={() => rejectApplicant(app.id)}
                                                            size="sm"
                                                            variant="outline"
                                                            className="flex-1 border-red-900 text-red-500 hover:bg-red-900/20"
                                                        >
                                                            <XCircle className="w-3 h-3 mr-1" /> Reject
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* CASE 2: Performer (Expert) View - Apply Button */}
                        {!isOwner && user === 'local' && (
                            <>
                                {hasApplied ? (
                                    <div className="bg-[#222] border border-[#D4AF37] p-6 text-center">
                                        <h3 className="text-[#D4AF37] font-serif text-xl mb-2">Application Submitted</h3>
                                        <p className="text-gray-400 text-sm">
                                            Status: <span className="text-white font-bold uppercase">{myApplication.status}</span>
                                        </p>
                                        <p className="text-gray-500 text-xs mt-2">Waiting for requester's response.</p>
                                    </div>
                                ) : (
                                    <Button
                                        onClick={() => setIsApplyModalOpen(true)}
                                        className="w-full py-6 text-lg bg-[#D4AF37] text-[#1A1A1A] hover:bg-[#b5952f] shadow-2xl"
                                    >
                                        Apply for Quest
                                    </Button>
                                )}
                            </>
                        )}

                        {/* CASE 3: Guest View */}
                        {!user && (
                            <Link href="/auth/login">
                                <Button className="w-full py-6 text-lg bg-[#333] text-white hover:bg-[#444]">
                                    Login to Apply
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Apply Modal */}
            {isApplyModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-[#1A1A1A] border border-[#333] w-full max-w-md p-6 shadow-2xl animate-fade-in">
                        <h3 className="text-2xl font-serif text-white mb-2">Apply for Quest</h3>
                        <p className="text-gray-400 text-sm mb-6">
                            Explain why you are the best fit for this task.
                        </p>

                        <textarea
                            value={applyMessage}
                            onChange={(e) => setApplyMessage(e.target.value)}
                            placeholder="e.g. I live nearby and have experience with..."
                            className="w-full h-32 bg-[#262626] border border-[#333] text-white p-4 mb-6 focus:outline-none focus:border-[#D4AF37] resize-none"
                        />

                        <div className="flex gap-4">
                            <Button
                                onClick={() => setIsApplyModalOpen(false)}
                                variant="outline"
                                className="flex-1 border-[#333] text-gray-400 hover:text-white"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleApply}
                                className="flex-1 bg-[#D4AF37] text-black hover:bg-[#b5952f]"
                            >
                                Submit Application
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
