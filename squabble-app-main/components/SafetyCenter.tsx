import React, { useState } from 'react';
import { Phone, MapPin, Bell, ShieldAlert, X, Lock, PhoneOff } from 'lucide-react';

interface SafetyCenterProps {
    onClose: () => void;
}

export const SafetyCenter: React.FC<SafetyCenterProps> = ({ onClose }) => {
    const [countdown, setCountdown] = useState<number | null>(null);
    const [fakeCallActive, setFakeCallActive] = useState(false);
    const [locationShared, setLocationShared] = useState(false);

    const handlePanic = () => {
        // Simulate a countdown to call authorities
        let count = 3;
        setCountdown(count);
        const interval = setInterval(() => {
            count--;
            if (count === 0) {
                clearInterval(interval);
                window.location.href = 'tel:911'; // In a real app, this would dial local emergency
                setCountdown(null);
            } else {
                setCountdown(count);
            }
        }, 1000);
    };

    const handleShareLocation = () => {
        // Mock location sharing
        setLocationShared(true);
        setTimeout(() => setLocationShared(false), 3000);
    };

    const triggerFakeCall = () => {
        // Immediate fake call for UX
        setFakeCallActive(true);
    };

    if (fakeCallActive) {
        return (
            <div className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-between py-12 px-8 animate-in slide-in-from-bottom duration-500">
                <div className="flex flex-col items-center mt-12">
                    <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mb-4">
                        <Phone size={48} className="text-white" />
                    </div>
                    <h1 className="text-3xl text-white font-sans font-normal">Mom</h1>
                    <p className="text-gray-400">Mobile</p>
                </div>

                <div className="w-full grid grid-cols-2 gap-x-8 gap-y-4">
                    <button
                        onClick={onClose}
                        className="flex flex-col items-center gap-2"
                    >
                        <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
                            <PhoneOff size={32} className="text-white" />
                        </div>
                        <span className="text-white text-sm">Decline</span>
                    </button>
                    <button
                        onClick={onClose}
                        className="flex flex-col items-center gap-2"
                    >
                        <div className="w-16 h-16 rounded-full bg-green-600 flex items-center justify-center shadow-lg animate-pulse hover:scale-105 transition-transform">
                            <Phone size={32} className="text-white" />
                        </div>
                        <span className="text-white text-sm">Accept</span>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center pointer-events-none">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto" onClick={onClose} />

            <div className="w-full max-w-md bg-fb-card border-t-2 border-transparent sm:border-2 sm:rounded-2xl p-6 pointer-events-auto animate-in slide-in-from-bottom duration-300 relative shadow-xl">

                <button onClick={onClose} className="absolute top-4 right-4 text-fb-text-secondary hover:text-fb-text">
                    <X size={24} />
                </button>

                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-red-900/30 p-3 rounded-full animate-pulse">
                        <ShieldAlert size={32} className="text-squabble-red" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-fb-text uppercase tracking-wider">Safety Center</h2>
                        <p className="text-xs text-fb-text-secondary">Secure tools for dangerous situations.</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    {/* Panic Button */}
                    <button
                        onClick={handlePanic}
                        className="col-span-2 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white p-6 rounded-xl flex items-center justify-between group shadow-lg shadow-red-900/40"
                    >
                        <div className="flex flex-col items-start">
                            <span className="text-2xl font-bold uppercase tracking-wider">{countdown ? `CALLING IN ${countdown}...` : 'PANIC BUTTON'}</span>
                            <span className="text-xs opacity-80">Call Emergency Services</span>
                        </div>
                        <Phone size={32} className="group-hover:scale-110 transition-transform" />
                    </button>

                    {/* Share Location */}
                    <button
                        onClick={handleShareLocation}
                        className="bg-fb-hover hover:bg-gray-600 text-fb-text p-4 rounded-xl flex flex-col items-center justify-center gap-2 border border-transparent"
                    >
                        <MapPin size={24} className={locationShared ? "text-green-500" : "text-blue-400"} />
                        <span className="text-xs font-bold uppercase">{locationShared ? "Sent!" : "Share Location"}</span>
                    </button>

                    {/* Fake Call */}
                    <button
                        onClick={triggerFakeCall}
                        className="bg-fb-hover hover:bg-gray-600 text-fb-text p-4 rounded-xl flex flex-col items-center justify-center gap-2 border border-transparent"
                    >
                        <Bell size={24} className="text-yellow-400" />
                        <span className="text-xs font-bold uppercase">Fake Call</span>
                    </button>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-fb-bg rounded-lg border border-transparent">
                        <Lock size={16} className="text-fb-text-secondary" />
                        <div>
                            <h3 className="text-sm font-bold text-fb-text uppercase">Meeting Safety</h3>
                            <p className="text-[10px] text-fb-text-secondary">Meet in public (Waffle House, Walmart). Do not go to private residences.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-fb-bg rounded-lg border border-transparent">
                        <ShieldAlert size={16} className="text-fb-text-secondary" />
                        <div>
                            <h3 className="text-sm font-bold text-fb-text uppercase">Identity Check</h3>
                            <p className="text-[10px] text-fb-text-secondary">Verify your opponent looks like their photos before engaging.</p>
                        </div>
                    </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-700 text-center">
                    <p className="text-[10px] text-fb-text-secondary">
                        Squabble Safety Shield is active 24/7.
                    </p>
                </div>
            </div>
        </div>
    );
};