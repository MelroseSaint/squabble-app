
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
        <div className="flex flex-col h-full bg-transparent text-fb-text">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-fb-card border-b border-transparent rounded-t-lg">
                <div className="flex items-center">
                    <button onClick={onBack} className="p-2 text-fb-text-secondary hover:text-fb-text mr-2">
                        <ChevronLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-fb-text">Watch</h1>
                        <p className="text-[10px] text-fb-text-secondary uppercase">Live Fights</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="bg-fb-hover px-3 py-1 rounded-full border border-transparent flex items-center gap-1">
                        <DollarSign size={14} className="text-green-500" />
                        <span className="font-mono font-bold text-lg text-fb-text">{userProfile.balance}</span>
                    </div>
                    <button
                        onClick={onTopUp}
                        className="bg-green-600 hover:bg-green-500 text-white rounded-full p-1.5 transition-colors shadow-sm"
                    >
                        <Plus size={16} />
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-700 bg-fb-card">
                <button
                    onClick={() => setActiveTab('UPCOMING')}
                    className={`flex-1 py-3 text-xs font-bold uppercase ${activeTab === 'UPCOMING' ? 'text-fb-blue border-b-2 border-fb-blue' : 'text-fb-text-secondary hover:bg-fb-hover'}`}
                >
                    Upcoming Beefs
                </button>
                <button
                    onClick={() => setActiveTab('MY_BETS')}
                    className={`flex-1 py-3 text-xs font-bold uppercase ${activeTab === 'MY_BETS' ? 'text-fb-blue border-b-2 border-fb-blue' : 'text-fb-text-secondary hover:bg-fb-hover'}`}
                >
                    My Slips
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {activeTab === 'UPCOMING' ? (
                    upcomingFights.map(fight => (
                        <div key={fight.id} className="bg-fb-card rounded-xl border border-transparent overflow-hidden relative shadow-sm">
                            <div className="bg-fb-hover p-2 text-center text-[10px] text-fb-text-secondary uppercase font-bold tracking-widest border-b border-transparent flex justify-between px-4">
                                <span>{fight.location}</span>
                                <span className="text-red-500 animate-pulse">LIVE SOON</span>
                            </div>

                            <div className="flex items-center justify-between p-4">
                                {/* Fighter 1 */}
                                <div className="flex flex-col items-center w-1/3">
                                    <img src={fight.fighter1.imageUrl} className="w-16 h-16 rounded-full object-cover border-2 border-fb-bg mb-2" alt="" />
                                    <span className="font-bold uppercase text-sm leading-none text-center text-fb-text">{fight.fighter1.name}</span>
                                    <span className="text-[10px] text-fb-text-secondary">{fight.fighter1.stats.strength} STR</span>
                                    <button
                                        onClick={() => handleBet(fight.fighter1.name, fight.fighter2.name, fight.odds1)}
                                        className="mt-2 bg-fb-hover hover:bg-gray-600 text-green-400 border border-transparent px-3 py-1 rounded text-xs font-bold w-full"
                                    >
                                        {fight.odds1} ($100)
                                    </button>
                                </div>

                                {/* VS */}
                                <div className="flex flex-col items-center justify-center w-1/3">
                                    <span className="font-bold text-2xl text-fb-text-secondary italic">VS</span>
                                    <div className="bg-squabble-red text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase mt-1">
                                        Fight Night
                                    </div>
                                </div>

                                {/* Fighter 2 */}
                                <div className="flex flex-col items-center w-1/3">
                                    <img src={fight.fighter2.imageUrl} className="w-16 h-16 rounded-full object-cover border-2 border-fb-bg mb-2" alt="" />
                                    <span className="font-bold uppercase text-sm leading-none text-center text-fb-text">{fight.fighter2.name}</span>
                                    <span className="text-[10px] text-fb-text-secondary">{fight.fighter2.stats.strength} STR</span>
                                    <button
                                        onClick={() => handleBet(fight.fighter2.name, fight.fighter1.name, fight.odds2)}
                                        className="mt-2 bg-fb-hover hover:bg-gray-600 text-green-400 border border-transparent px-3 py-1 rounded text-xs font-bold w-full"
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
                            <div className="flex flex-col items-center justify-center h-64 text-fb-text-secondary">
                                <Trophy size={48} className="mb-4 opacity-20" />
                                <p>No active bets.</p>
                                <button onClick={() => setActiveTab('UPCOMING')} className="text-fb-blue font-bold text-sm mt-2">Place a wager</button>
                            </div>
                        ) : (
                            betHistory.map(bet => (
                                <div key={bet.id} className="bg-fb-card p-4 rounded-xl border border-transparent flex items-center justify-between shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 bg-fb-hover rounded-lg">
                                            <Ticket size={24} className="text-green-500" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-fb-text text-sm uppercase">{bet.fighterName}</div>
                                            <div className="text-[10px] text-fb-text-secondary">vs {bet.opponentName}</div>
                                            <div className="text-[10px] text-green-500 font-bold">Odds: {bet.odds}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-fb-text">${bet.amount}</div>
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

            <div className="p-4 bg-fb-card border-t border-transparent text-center rounded-b-lg">
                <p className="text-[10px] text-fb-text-secondary">
                    <Users size={12} className="inline mr-1" />
                    1,402 Users watching live fights right now
                </p>
            </div>
        </div>
    );
};
