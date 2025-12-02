"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Upload, Sparkles, MapPin, Calendar, DollarSign, ShieldCheck, Lock, CreditCard } from 'lucide-react';
import { PremiumButton, GlassCard } from '@/components/PremiumComponents';
import { useStore } from '@/lib/store';
import { PaymentMethodSelector } from '@/components/PaymentMethodSelector';

export default function CreateQuest() {
    const router = useRouter();
    const { addQuest, addToast } = useStore();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        category: 'Dining Reservation',
        description: '',
        budget: '',
        date: '',
        location: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleNext = () => {
        if (step === 1) {
            if (!formData.title || !formData.description) {
                addToast('Please fill in all details', 'error');
                return;
            }
        }
        if (step === 2) {
            if (!formData.budget || !formData.location || !formData.date) {
                addToast('Please fill in budget and location', 'error');
                return;
            }
        }
        setStep(step + 1);
    };

    const handleBack = () => setStep(step - 1);

    const handlePaymentSuccess = async () => {
        setLoading(true);
        try {
            await addQuest({
                title: formData.title,
                category: formData.category,
                description: formData.description,
                reward: formData.budget,
                location: formData.location,
                time: formData.date,
                difficulty: 'Medium'
            });
            router.push('/quests');
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const budgetAmount = parseFloat(formData.budget || '0');
    const platformFee = budgetAmount * 0.05; // 5% fee
    const totalAmount = budgetAmount + platformFee;

    return (
        <div className="min-h-screen bg-[#050505] pt-28 pb-12 px-6">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </button>
                    <h1 className="text-3xl font-bold text-white mb-2">Post a New Quest</h1>
                    <p className="text-gray-400">Describe your request and set your budget</p>
                </div>

                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex justify-between text-sm font-medium text-gray-400 mb-2">
                        <span className={step >= 1 ? "text-[#D4AF37]" : ""}>1. Details</span>
                        <span className={step >= 2 ? "text-[#D4AF37]" : ""}>2. Budget & Location</span>
                        <span className={step >= 3 ? "text-[#D4AF37]" : ""}>3. Review & Payment</span>
                    </div>
                    <div className="h-2 bg-[#1A1A1A] rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-[#D4AF37] to-[#806921] transition-all duration-500"
                            style={{ width: `${(step / 3) * 100}%` }}
                        />
                    </div>
                </div>

                <GlassCard>
                    {step === 1 && (
                        <div className="space-y-6 animate-slide-in">
                            <div className="bg-[#D4AF37]/5 border border-[#D4AF37]/20 rounded-xl p-4 flex items-start gap-3">
                                <Sparkles className="w-5 h-5 text-[#D4AF37] mt-0.5" />
                                <div>
                                    <h4 className="font-bold text-[#D4AF37] text-sm">Local AI Assistant Active (Free)</h4>
                                    <p className="text-gray-400 text-sm">Optimizing your request using on-device processing. No server costs.</p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Quest Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="e.g., Private Michelin Dining Reservation for 2"
                                    className="w-full bg-[#121212] border border-[#333] rounded-xl py-3 px-4 text-white focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full bg-[#121212] border border-[#333] rounded-xl py-3 px-4 text-white focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-all"
                                >
                                    <option>Dining Reservation</option>
                                    <option>Private Tour</option>
                                    <option>Business Interpretation</option>
                                    <option>K-Pop Experience</option>
                                    <option>Shopping Assistant</option>
                                    <option>Medical Concierge</option>
                                    <option>Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Detailed Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={5}
                                    placeholder="Please describe your requirements in detail..."
                                    className="w-full bg-[#121212] border border-[#333] rounded-xl py-3 px-4 text-white focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-all resize-none"
                                />
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 animate-slide-in">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Estimated Budget (USD)</label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                        <input
                                            type="number"
                                            name="budget"
                                            value={formData.budget}
                                            onChange={handleChange}
                                            placeholder="500"
                                            className="w-full bg-[#121212] border border-[#333] rounded-xl py-3 pl-12 pr-4 text-white focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-all"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">This amount will be held in escrow.</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Date Required</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                        <input
                                            type="date"
                                            name="date"
                                            value={formData.date}
                                            onChange={handleChange}
                                            className="w-full bg-[#121212] border border-[#333] rounded-xl py-3 pl-12 pr-4 text-white focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        placeholder="e.g., Gangnam, Seoul"
                                        className="w-full bg-[#121212] border border-[#333] rounded-xl py-3 pl-12 pr-4 text-white focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Reference Images (Optional)</label>
                                <div className="border-2 border-dashed border-[#333] rounded-xl p-8 text-center hover:border-[#D4AF37] transition-colors cursor-pointer bg-[#121212]">
                                    <Upload className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                                    <p className="text-gray-400 text-sm">Click to upload or drag and drop</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6 animate-slide-in">
                            <div className="bg-[#121212] rounded-xl p-6 border border-[#333]">
                                <h3 className="text-xl font-bold text-white mb-4">Order Summary</h3>
                                <dl className="space-y-4">
                                    <div className="flex justify-between">
                                        <dt className="text-gray-400">Service</dt>
                                        <dd className="text-white font-medium">{formData.category}</dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-gray-400">Budget (Escrow)</dt>
                                        <dd className="text-white font-medium">${budgetAmount.toFixed(2)}</dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-gray-400">Platform Fee (5%)</dt>
                                        <dd className="text-white font-medium">${platformFee.toFixed(2)}</dd>
                                    </div>
                                    <div className="pt-4 border-t border-[#333] flex justify-between">
                                        <dt className="text-[#D4AF37] font-bold">Total to Pay</dt>
                                        <dd className="text-[#D4AF37] font-bold text-xl">${totalAmount.toFixed(2)}</dd>
                                    </div>
                                </dl>
                            </div>

                            <div className="flex items-start gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                                <ShieldCheck className="w-5 h-5 text-green-400 mt-0.5" />
                                <div>
                                    <h4 className="font-bold text-green-400 text-sm">Secure Escrow Payment</h4>
                                    <p className="text-gray-400 text-sm mt-1">
                                        Your payment will be held securely in escrow. It will only be released to the expert after you confirm the service is completed to your satisfaction.
                                    </p>
                                </div>
                            </div>

                            {/* Payment Method Selector */}
                            <div className="mt-8">
                                <h3 className="text-white font-bold mb-4">Select Payment Method</h3>
                                <PaymentMethodSelector
                                    amount={totalAmount}
                                    questId="new-quest"
                                    onSuccess={handlePaymentSuccess}
                                />
                            </div>

                            <div className="flex items-center gap-2 text-sm text-gray-500 justify-center mt-4">
                                <Lock className="w-4 h-4" />
                                <span>SSL Encrypted Secure Transaction</span>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-between mt-8 pt-6 border-t border-[#333]">
                        {step > 1 ? (
                            <button
                                onClick={handleBack}
                                className="px-6 py-3 text-gray-400 hover:text-white font-medium transition-colors"
                            >
                                Back
                            </button>
                        ) : (
                            <div></div>
                        )}

                        {step < 3 && (
                            <PremiumButton onClick={handleNext} icon={<ArrowRight className="w-5 h-5" />}>
                                Next Step
                            </PremiumButton>
                        )}
                    </div>
                </GlassCard>
            </div>
        </div>
    );
}
