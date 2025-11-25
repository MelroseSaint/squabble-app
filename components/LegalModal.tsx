import React, { useState } from 'react';
import { AlertTriangle, ShieldAlert, XCircle } from 'lucide-react';

interface LegalModalProps {
  onAccept: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ onAccept }) => {
  const [declined, setDeclined] = useState(false);

  if (declined) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-8 text-center animate-in fade-in">
        <XCircle size={64} className="text-gray-500 mb-4" />
        <h2 className="text-3xl font-heading text-white mb-2">ACCESS DENIED</h2>
        <p className="text-gray-400 mb-6">
          You cannot enter Squabble without accepting the risks. 
          <br />
          Maybe try a dating app instead?
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-3 border border-gray-700 rounded-full text-white hover:bg-gray-800 transition-colors"
        >
          Reload App
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black text-white flex flex-col">
      {/* Header */}
      <div className="p-6 bg-red-900/20 border-b border-red-900/50 flex flex-col items-center text-center">
        <AlertTriangle size={48} className="text-squabble-red mb-3 animate-pulse" />
        <h1 className="text-4xl font-heading font-bold text-squabble-red tracking-widest uppercase">
          WARNING
        </h1>
        <p className="text-xs text-red-400 font-bold uppercase tracking-widest">
          Liability Waiver & User Agreement
        </p>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm text-gray-300 leading-relaxed font-sans">
        <p className="font-bold text-white">
          PLEASE READ CAREFULLY. THIS IS A LEGALLY BINDING RELEASE OF LIABILITY.
        </p>

        <section>
          <h3 className="text-white font-bold uppercase mb-2">1. Assumption of Risk</h3>
          <p>
            By entering "Squabble" (the "App"), you acknowledge that meeting strangers from the internet for the purpose of "squabbling," "fighting," "throwing hands," or "beefing" is inherently dangerous, stupid, and ill-advised. You voluntarily assume all risks associated with using this App, including but not limited to: physical injury, emotional distress, loss of property, loss of dignity, and getting arrested at a Waffle House.
          </p>
        </section>

        <section>
          <h3 className="text-white font-bold uppercase mb-2">2. Release of Liability</h3>
          <p>
            You agree to hold harmless the creators, developers, and hosting providers of Squabble from any and all claims, demands, damages, rights of action, or causes of action, present or future, whether the same be known or unknown, anticipated, or unanticipated, resulting from or arising out of the use of this App.
          </p>
          <p className="mt-2 text-squabble-red font-bold">
            IN PLAIN ENGLISH: If you get beat up, it is not our fault. Do not sue us.
          </p>
        </section>

        <section>
          <h3 className="text-white font-bold uppercase mb-2">3. Zero Tolerance Policy</h3>
          <p>
            While this App is themed around combat, actual illegal acts, assault, battery, and organized violence are strictly prohibited by law. This App is for entertainment and satire purposes only. Any actual arranged combat is done at your own sole risk and legal peril.
          </p>
        </section>

        <section>
          <h3 className="text-white font-bold uppercase mb-2">4. User Content</h3>
          <p>
            You agree not to upload content that depicts real-world severe injury, death, or illegal acts. We reserve the right to ban your account if you are too intense even for us.
          </p>
        </section>
      </div>

      {/* Footer Actions */}
      <div className="p-6 bg-squabble-dark border-t border-gray-800 flex flex-col gap-3">
        <div className="flex items-start gap-3 mb-2">
            <ShieldAlert className="text-squabble-red shrink-0" size={20} />
            <p className="text-xs text-gray-500">
                By clicking "I AGREE", I confirm that I am 18 years of age or older and I have read and understood this waiver.
            </p>
        </div>
        
        <button 
          onClick={onAccept}
          className="w-full py-4 bg-squabble-red hover:bg-red-700 text-white font-heading font-bold text-xl uppercase tracking-wider rounded-xl transition-all active:scale-95 shadow-lg shadow-red-900/20"
        >
          I Agree & Accept Risk
        </button>
        
        <button 
          onClick={() => setDeclined(true)}
          className="w-full py-3 bg-transparent border border-gray-700 hover:bg-gray-800 text-gray-400 font-bold uppercase text-sm rounded-xl transition-colors"
        >
          I Do Not Agree
        </button>
      </div>
    </div>
  );
};