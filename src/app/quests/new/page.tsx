"use client";

import { Button } from "@/components/ui/Button";
import { useStore } from "@/lib/store";
import { useState } from "react";
import { ArrowRight, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { PaymentMethodSelector } from "@/components/PaymentMethodSelector";
import { AntiFraud } from "@/lib/utils";

export default function PostQuestPage() {
    const { t, addToast, addQuest } = useStore();
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        title: '',
        category: 'Concierge Service',
        description: '',
        location: '',
        reward: '50.00'
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleNextStep = (nextStep: number) => {
        // Step 2 Validation (Description Check)
        if (step === 2 && nextStep === 3) {
            const fraudType = AntiFraud.detect(formData.description);
            if (fraudType) {
                const warning = AntiFraud.getWarningMessage(fraudType);
                addToast(warning, 'error');
                return;
            }
        }
        setStep(nextStep);
    };

    const handlePaymentSuccess = async () => {
        // Create the quest object
        const newQuest = {
            title: formData.title,
            category: formData.category,
            description: formData.description,
            location: formData.location,
            reward: formData.reward, // Store as string with $ or just number, store expects string usually or we adapt
            time: 'Flexible', // Default
            difficulty: 'Medium', // Default
        };

        await addQuest(newQuest);
        // addQuest already shows a toast, but we can add another or rely on it
        // router.push is handled here
        router.push('/quests');
    };

    return (
        <main className="min-h-screen bg-[#1A1A1A] pt-32 pb-20">
            <div className="container mx-auto px-6 max-w-[800px]">
                <div className="text-center mb-12">
                    <p className="text-[#D4AF37] text-sm uppercase tracking-[0.2em] mb-4">{t.nav.postQuest}</p>
                    <h1 className="text-4xl md:text-5xl font-serif text-white mb-6">
                        Create a Request
                    </h1>
                    <p className="text-gray-400 font-light">
                        Describe your needs and connect with verified local experts.
                    </p>
                </div>

                <div className="bg-[#262626] border border-[#333] p-8 md:p-12 rounded-sm shadow-2xl">
                    {/* Progress Bar */}
                    <div className="flex justify-between mb-12 relative">
                        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-[#333] -z-10" />
                        {[1, 2, 3].map((s) => (
                            <div key={s} className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-serif transition-colors duration-300 ${step >= s ? 'bg-[#D4AF37] text-[#1A1A1A]' : 'bg-[#1A1A1A] text-gray-500 border border-[#333]'
                                }`}>
                                {step > s ? <CheckCircle className="w-4 h-4" /> : s}
                            </div>
                        ))}
                    </div>

                    {step === 1 && (
                        <div className="space-y-8 animate-fade-in">
                            <div>
                                <label className="block text-[#D4AF37] text-xs uppercase tracking-widest mb-3">Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="e.g., Need a guide for Gyeongbokgung Palace"
                                    className="w-full bg-[#1A1A1A] border border-[#333] text-white px-4 py-4 focus:outline-none focus:border-[#D4AF37] transition-colors"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-[#D4AF37] text-xs uppercase tracking-widest mb-3">Category</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full bg-[#1A1A1A] border border-[#333] text-white px-4 py-4 focus:outline-none focus:border-[#D4AF37] transition-colors appearance-none"
                                >
                                    <option>Concierge Service</option>
                                    <option>Dining Reservation</option>
                                    <option>Translation</option>
                                    <option>Transport</option>
                                    <option>Photography</option>
                                </select>
                            </div>
                            <Button type="button" onClick={() => handleNextStep(2)} className="w-full py-6">
                                Next Step <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-8 animate-fade-in">
                            <div>
                                <label className="block text-[#D4AF37] text-xs uppercase tracking-widest mb-3">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={5}
                                    placeholder="Provide specific details about your request..."
                                    className="w-full bg-[#1A1A1A] border border-[#333] text-white px-4 py-4 focus:outline-none focus:border-[#D4AF37] transition-colors resize-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-[#D4AF37] text-xs uppercase tracking-widest mb-3">Location</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    placeholder="e.g., Seoul, Gangnam-gu"
                                    className="w-full bg-[#1A1A1A] border border-[#333] text-white px-4 py-4 focus:outline-none focus:border-[#D4AF37] transition-colors"
                                    required
                                />
                            </div>
                            <div className="flex gap-4">
                                <Button type="button" variant="outline" onClick={() => handleNextStep(1)} className="flex-1 py-6">
                                    Back
                                </Button>
                                <Button type="button" onClick={() => handleNextStep(3)} className="flex-1 py-6">
                                    Next Step <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-8 animate-fade-in">
                            <div>
                                <label className="block text-[#D4AF37] text-xs uppercase tracking-widest mb-3">Reward Offer (USD)</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                    <input
                                        type="number"
                                        name="reward"
                                        value={formData.reward}
                                        onChange={handleChange}
                                        placeholder="50.00"
                                        className="w-full bg-[#1A1A1A] border border-[#333] text-white pl-8 pr-4 py-4 focus:outline-none focus:border-[#D4AF37] transition-colors"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="p-4 bg-[#1A1A1A] border border-[#D4AF37]/30 text-sm text-gray-400">
                                <p className="mb-2 text-[#D4AF37] font-serif">Estimated Total</p>
                                <div className="flex justify-between mb-1">
                                    <span>Reward</span>
                                    <span>${parseFloat(formData.reward || '0').toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between border-t border-[#333] pt-2 mt-2">
                                    <span>Platform Fee (Included)</span>
                                    <span>${(parseFloat(formData.reward || '0') * 0.3).toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="mt-8">
                                <h3 className="text-white font-serif mb-4">Select Payment Method</h3>
                                <PaymentMethodSelector
                                    amount={parseFloat(formData.reward || '0')}
                                    questId="new-quest"
                                    onSuccess={handlePaymentSuccess}
                                />
                            </div>

                            <div className="flex gap-4 mt-8">
                                <Button type="button" variant="outline" onClick={() => handleNextStep(2)} className="flex-1 py-6">
                                    Back
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
