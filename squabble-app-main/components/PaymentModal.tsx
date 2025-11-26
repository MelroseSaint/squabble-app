
import React, { useState } from 'react';
import { X, CreditCard, ShieldCheck, Lock, DollarSign, CheckCircle } from 'lucide-react';

interface PaymentModalProps {
  onClose: () => void;
  onSuccess: (amount: number) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ onClose, onSuccess }) => {
  const [step, setStep] = useState<'AMOUNT' | 'CARD' | 'PROCESSING' | 'SUCCESS'>('AMOUNT');
  const [amount, setAmount] = useState<number>(50);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');

  const handlePay = () => {
    if (cardNumber.length < 16 || expiry.length < 4 || cvc.length < 3) return;

    setStep('PROCESSING');
    
    // Simulate API delay
    setTimeout(() => {
        setStep('SUCCESS');
        setTimeout(() => {
            onSuccess(amount);
            onClose();
        }, 1500);
    }, 2000);
  };

  const formatCard = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  return (
    <div className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center animate-in fade-in">
        <div className="w-full max-w-md bg-white text-black rounded-t-3xl sm:rounded-2xl p-6 relative overflow-hidden">
            
            {/* Close */}
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-black">
                <X size={24} />
            </button>

            {/* Header */}
            <div className="flex items-center gap-2 mb-6">
                 {/* Mock Stripe Logo */}
                 <div className="font-bold text-xl text-[#635BFF] flex items-center gap-1">
                    <span className="bg-[#635BFF] text-white px-2 py-0.5 rounded text-sm">Stripe</span>
                    <span className="text-gray-800">Payments</span>
                 </div>
            </div>

            {step === 'AMOUNT' && (
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900">Add funds to Wallet</h2>
                    <p className="text-gray-500 text-sm">Select an amount to top up your Fade Duel balance.</p>

                    <div className="grid grid-cols-3 gap-3">
                        {[10, 50, 100].map(val => (
                            <button
                                key={val}
                                onClick={() => setAmount(val)}
                                className={`py-4 rounded-xl border-2 font-bold text-lg flex flex-col items-center justify-center transition-all ${
                                    amount === val 
                                    ? 'border-[#635BFF] bg-[#635BFF]/10 text-[#635BFF]' 
                                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                }`}
                            >
                                <DollarSign size={16} />
                                {val}
                            </button>
                        ))}
                    </div>

                    <button 
                        onClick={() => setStep('CARD')}
                        className="w-full bg-[#635BFF] hover:bg-[#5851df] text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
                    >
                        Continue
                    </button>
                </div>
            )}

            {step === 'CARD' && (
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <Lock size={18} className="text-gray-400" />
                        Secure Checkout
                    </h2>
                    
                    {/* Card Element Simulation */}
                    <div className="border border-gray-300 rounded-lg p-4 focus-within:ring-2 focus-within:ring-[#635BFF] focus-within:border-[#635BFF] transition-all">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Card Number</label>
                        <div className="flex items-center gap-2">
                            <CreditCard size={20} className="text-gray-400" />
                            <input 
                                type="text"
                                maxLength={19}
                                placeholder="0000 0000 0000 0000"
                                value={cardNumber}
                                onChange={e => setCardNumber(formatCard(e.target.value))}
                                className="w-full outline-none font-mono text-gray-700 text-lg"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="border border-gray-300 rounded-lg p-4 focus-within:ring-2 focus-within:ring-[#635BFF]">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Expiry</label>
                            <input 
                                type="text"
                                maxLength={5}
                                placeholder="MM/YY"
                                value={expiry}
                                onChange={e => {
                                    let v = e.target.value.replace(/\D/g,'');
                                    if(v.length >= 2) v = v.substring(0,2) + '/' + v.substring(2,4);
                                    setExpiry(v);
                                }}
                                className="w-full outline-none font-mono text-gray-700"
                            />
                        </div>
                        <div className="border border-gray-300 rounded-lg p-4 focus-within:ring-2 focus-within:ring-[#635BFF]">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">CVC</label>
                            <input 
                                type="password"
                                maxLength={3}
                                placeholder="123"
                                value={cvc}
                                onChange={e => setCvc(e.target.value.replace(/\D/g,''))}
                                className="w-full outline-none font-mono text-gray-700"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                        <ShieldCheck size={14} className="text-green-500" />
                        Encrypted by 256-bit SSL security.
                    </div>

                    <button 
                        onClick={handlePay}
                        className="w-full bg-[#0A2540] hover:bg-[#0A2540]/90 text-white font-bold py-4 rounded-xl mt-4 shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                        Pay ${amount}.00
                    </button>
                </div>
            )}

            {step === 'PROCESSING' && (
                <div className="flex flex-col items-center justify-center py-10 space-y-4">
                    <div className="w-16 h-16 border-4 border-[#635BFF]/30 border-t-[#635BFF] rounded-full animate-spin"></div>
                    <h3 className="text-lg font-bold text-gray-700">Processing Payment...</h3>
                    <p className="text-sm text-gray-500">Please do not close this window.</p>
                </div>
            )}

            {step === 'SUCCESS' && (
                <div className="flex flex-col items-center justify-center py-10 space-y-4 animate-in zoom-in">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle size={40} className="text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">Payment Successful!</h3>
                    <p className="text-gray-500">Your wallet has been topped up.</p>
                </div>
            )}

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-gray-100 flex justify-center grayscale opacity-50">
                 <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-6" />
            </div>
        </div>
    </div>
  );
};
