import React from 'react';
import { useAppStore } from '../store/appStore';
import { FighterCard } from './FighterCard';
import { SafetyCenter } from './SafetyCenter';
import { PaymentModal } from './PaymentModal';
import { Toast } from './Toast';
import { X } from 'lucide-react';

export const GlobalModals: React.FC = () => {
  const { 
    notification, 
    showSafetyCenter, 
    showPayment, 
    selectedFighter,
    setNotification, 
    setShowSafetyCenter, 
    setShowPayment, 
    setSelectedFighter,
    handleSuperLike
  } = useAppStore();

  return (
    <>
      {/* Global Notifications */}
      {notification && (
        <Toast notification={notification} onClose={() => setNotification(null)} />
      )}

      {/* Map Selection Modal */}
      {selectedFighter && (
        <div className="absolute inset-0 z-[70] bg-black/80 backdrop-blur-sm p-8 flex items-center justify-center" onClick={() => setSelectedFighter(null)}>
          <div className="relative w-full aspect-[3/4] max-w-sm bg-gray-900 rounded-2xl overflow-hidden shadow-2xl border-2 border-squabble-red" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedFighter(null)} className="absolute top-2 right-2 z-20 text-white bg-black/50 rounded-full p-1"><X size={24} /></button>
            <FighterCard fighter={selectedFighter} active={true} onSuperLike={handleSuperLike} />
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPayment && (
        <PaymentModal
          onClose={() => setShowPayment(false)}
          onSuccess={(amount: number) => {
            // This will be handled by the parent component
            setShowPayment(false);
          }}
        />
      )}

      {/* Safety Modal */}
      {showSafetyCenter && <SafetyCenter onClose={() => setShowSafetyCenter(false)} />}
    </>
  );
};
