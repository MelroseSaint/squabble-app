
import React, { useState, useEffect } from 'react';
import { ChevronLeft, DollarSign, Users, Trophy, Ticket, Plus } from 'lucide-react';
import { MOCK_FIGHTERS } from '../constants';
import { createBet, createTransaction, updateUserBalance, getBetHistory } from '../services/db';
import { processWager } from '../services/wagerService';
import { UserProfile, Bet, Transaction } from '../types';

interface FadeDuelViewProps {
  userProfile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  onBack: () => void;
  onTopUp: () => void;
  notify: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export const FadeDuelView: React.FC<FadeDuelViewProps> = ({ userProfile, onUpdateProfile, onBack, onTopUp, notify }) => {
  const [activeTab, setActiveTab] = useState<'UPCOMING' | 'MY_BETS'>('UPCOMING');
  const [betHistory, setBetHistory] = useState<Bet[]>([]);

  useEffect(() => {
    if (activeTab === 'MY_BETS') {
      const fetchBetHistory = async () => {
        const history = await getBetHistory();
        setBetHistory(history);
      };
      fetchBetHistory();
    }
  }, [activeTab]);

  // Mock upcoming fights
  const upcomingFights = [
    {
        id: '1',
        fighter1: MOCK_FIGHTERS[0],
        fighter2: MOCK_FIGHTERS[3],
        odds1: '-150',
        odds2: '+120',
        location: 'Parking Lot B'
    },
    {
        id: '2',
        fighter1: MOCK_FIGHTERS[1],
        fighter2: MOCK_FIGHTERS[4],
        odds1: '-500',
        odds2: '+350',
        location: 'Waffle House'
    }
  ];

  const handleBet = async (fighterName: string, opponentName: string, odds: string) => {
      if (userProfile.balance >= 100) {
          const newBet: Bet = {
              id: Date.now().toString(),
              user: userProfile.id,
              fighterName,
              opponentName,
              amount: 100,
              odds,
              status: 'OPEN',
              timestamp: Date.now()
          };

          const newTransaction: Transaction = {
            id: Date.now().toString(),
            user: userProfile.id,
            type: 'BET_PLACED',
            amount: 100,
            status: 'COMPLETED',
            description: `Bet on ${fighterName}`,
            timestamp: Date.now(),
          };

          const newBalance = userProfile.balance - 100;

          await createBet(newBet);
          await createTransaction(newTransaction);
          await updateUserBalance(userProfile.id, newBalance);

          const updatedProfile: UserProfile = {
              ...userProfile,
              balance: newBalance,
              betHistory: [newBet, ...userProfile.betHistory],
              transactions: [newTransaction, ...userProfile.transactions],
          };

          onUpdateProfile(updatedProfile);
          notify(`Bet placed on ${fighterName}!`, 'success');

          setTimeout(() => {
            processWager(newBet, userProfile);
            notify(`Wager processed for ${fighterName}! Check your balance.`, 'info');
          }, 5000);
      } else {
          notify("Insufficient funds! Top up your wallet.", 'error');
      }
  };

  return (
    <div className="flex flex-col h-full bg-black text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-squabble-dark border-b border-gray-800">
        <div className="flex items-center">
            <button onClick={onBack} className="p-2 text-gray-400 hover:text-white mr-2">
            <ChevronLeft size={24} />
            </button>
            <div>
                <h1 className="text-xl font-heading font-bold tracking-wider uppercase text-green-500 italic">FADE DUEL</h1>
                <p className="text-[10px] text-gray-500 uppercase">Don't Fight. Just Profit.</p>
            </div>
        </div>
        <div className="flex items-center gap-2">
            <div className="bg-gray-900 px-3 py-1 rounded-full border border-green-900 flex items-center gap-1">
                <DollarSign size={14} className="text-green-500" />
                <span className="font-mono font-bold text-lg">{userProfile.balance}</span>
            </div>
            <button 
                onClick={onTopUp}
                className="bg-green-600 hover:bg-green-500 text-white rounded-full p-1.5 transition-colors shadow-lg shadow-green-900/40"
            >
                <Plus size={16} />
            </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-800">
          <button 
            onClick={() => setActiveTab('UPCOMING')}
            className={`flex-1 py-3 text-xs font-bold uppercase ${activeTab === 'UPCOMING' ? 'text-white border-b-2 border-green-500' : 'text-gray-500'}`}
          >
              Upcoming Beefs
          </button>
          <button 
            onClick={() => setActiveTab('MY_BETS')}
            className={`flex-1 py-3 text-xs font-bold uppercase ${activeTab === 'MY_BETS' ? 'text-white border-b-2 border-green-500' : 'text-gray-500'}`}
          >
              My Slips
          </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeTab === 'UPCOMING' ? (
            upcomingFights.map(fight => (
                <div key={fight.id} className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden relative">
                     <div className="bg-black/50 p-2 text-center text-[10px] text-gray-400 uppercase font-bold tracking-widest border-b border-gray-800 flex justify-between px-4">
                        <span>{fight.location}</span>
                        <span className="text-red-500 animate-pulse">LIVE SOON</span>
                     </div>
                     
                     <div className="flex items-center justify-between p-4">
                        {/* Fighter 1 */}
                        <div className="flex flex-col items-center w-1/3">
                            <img src={fight.fighter1.imageUrl} className="w-16 h-16 rounded-full object-cover border-2 border-gray-700 mb-2" alt="" />
                            <span className="font-heading font-bold uppercase text-sm leading-none text-center">{fight.fighter1.name}</span>
                            <span className="text-[10px] text-gray-500">{fight.fighter1.stats.strength} STR</span>
                            <button 
                                onClick={() => handleBet(fight.fighter1.name, fight.fighter2.name, fight.odds1)}
                                className="mt-2 bg-green-900/40 hover:bg-green-800 text-green-400 border border-green-800 px-3 py-1 rounded text-xs font-bold w-full"
                            >
                                {fight.odds1} ($100)
                            </button>
                        </div>

                        {/* VS */}
                        <div className="flex flex-col items-center justify-center w-1/3">
                            <span className="font-heading text-4xl text-gray-700 italic">VS</span>
                            <div className="bg-squabble-red text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase mt-1">
                                Fight Night
                            </div>
                        </div>

                        {/* Fighter 2 */}
                        <div className="flex flex-col items-center w-1/3">
                            <img src={fight.fighter2.imageUrl} className="w-16 h-16 rounded-full object-cover border-2 border-gray-700 mb-2" alt="" />
                            <span className="font-heading font-bold uppercase text-sm leading-none text-center">{fight.fighter2.name}</span>
                            <span className="text-[10px] text-gray-500">{fight.fighter2.stats.strength} STR</span>
                            <button 
                                onClick={() => handleBet(fight.fighter2.name, fight.fighter1.name, fight.odds2)}
                                className="mt-2 bg-green-900/40 hover:bg-green-800 text-green-400 border border-green-800 px-3 py-1 rounded text-xs font-bold w-full"
                            >
                                {fight.odds2} ($100)
                            </button>
                        </div>
                     </div>
                </div>
            ))
        ) : (
            <div className="space-y-3">
                {betHistory.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                        <Trophy size={48} className="mb-4 opacity-20" />
                        <p>No active bets.</p>
                        <button onClick={() => setActiveTab('UPCOMING')} className="text-green-500 font-bold text-sm mt-2">Place a wager</button>
                    </div>
                ) : (
                    betHistory.map(bet => (
                        <div key={bet.id} className="bg-gray-900 p-4 rounded-xl border border-gray-800 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-gray-800 rounded-lg">
                                    <Ticket size={24} className="text-green-500" />
                                </div>
                                <div>
                                    <div className="font-bold text-white text-sm uppercase">{bet.fighterName}</div>
                                    <div className="text-[10px] text-gray-500">vs {bet.opponentName}</div>
                                    <div className="text-[10px] text-green-500 font-bold">Odds: {bet.odds}</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="font-bold text-white">${bet.amount}</div>
                                <div className="text-[10px] bg-yellow-900/30 text-yellow-500 px-2 py-0.5 rounded border border-yellow-900 uppercase font-bold inline-block mt-1">
                                    {bet.status}
                                </div>
                                
                            </div>
                        </div>
                    ))
                )}
            </div>
        )}
      </div>
      
      <div className="p-4 bg-gray-900 border-t border-gray-800 text-center">
          <p className="text-[10px] text-gray-500">
              <Users size={12} className="inline mr-1" />
              1,402 Users watching live fights right now
          </p>
      </div>
    </div>
  );
};
