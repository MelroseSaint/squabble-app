
import React, { useState, useEffect } from 'react';
import { ChevronLeft, Key, Save, Trash2, Eye, EyeOff, User, ShieldCheck, UserPlus, BadgeCheck, Upload, CreditCard, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { UserProfile, TrustedContact } from '../types';
import { getUserProfile, saveUserProfile } from '../services/db';

interface SettingsViewProps {
    onBack: () => void;
    onSaveKey: (key: string) => void;
    onTopUp: () => void;
    onLogout: () => void;
    notify: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onBack, onSaveKey, onTopUp, onLogout, notify }) => {
    // API Key State
    const [apiKey, setApiKey] = useState('');
    const [showKey, setShowKey] = useState(false);

    // Profile State
    const [profile, setProfile] = useState<UserProfile | null>(null);

    // Verification State
    const [verifying, setVerifying] = useState(false);
    const [newContactName, setNewContactName] = useState('');
    const [newContactPhone, setNewContactPhone] = useState('');

    useEffect(() => {
        // Load Key
        const storedKey = localStorage.getItem('gemini_api_key');
        if (storedKey) setApiKey(storedKey);

        // Load Profile
        const loadProfile = async () => {
            const p = await getUserProfile();
            // Ensure new fields exist
            const updatedP = {
                ...p,
                isVerified: p.isVerified || false,
                trustedContacts: p.trustedContacts || [],
                transactions: p.transactions || []
            };
            setProfile(updatedP);
        };
        loadProfile();
    }, []);

    const handleSaveKey = () => {
        if (apiKey.trim()) {
            localStorage.setItem('gemini_api_key', apiKey.trim());
            onSaveKey(apiKey.trim());
            notify('Gemini API Key saved successfully', 'success');
        }
    };

    const handleClearKey = () => {
        localStorage.removeItem('gemini_api_key');
        setApiKey('');
        onSaveKey('');
        notify('API Key removed', 'info');
    };

    const handleSaveProfile = async () => {
        if (profile) {
            await saveUserProfile(profile);
            notify('Profile updated successfully', 'success');
        }
    };

    const updateProfile = (field: keyof UserProfile, value: any) => {
        if (profile) {
            setProfile({ ...profile, [field]: value });
        }
    };

    const handleVerify = () => {
        setVerifying(true);
        // Simulate verification delay
        setTimeout(() => {
            if (profile) {
                const updated = { ...profile, isVerified: true };
                setProfile(updated);
                saveUserProfile(updated);
                setVerifying(false);
                notify('ID Verified! You are now a Verified Fighter.', 'success');
            }
        }, 2500);
    };

    const addContact = () => {
        if (profile && newContactName && newContactPhone) {
            const newContact: TrustedContact = {
                id: Date.now().toString(),
                name: newContactName,
                phone: newContactPhone
            };
            const updatedContacts = [...profile.trustedContacts, newContact];
            const updatedProfile = { ...profile, trustedContacts: updatedContacts };
            setProfile(updatedProfile);
            saveUserProfile(updatedProfile); // Auto save
            setNewContactName('');
            setNewContactPhone('');
            notify('Trusted contact added', 'success');
        } else {
            notify('Please enter name and phone', 'error');
        }
    };

    const removeContact = (id: string) => {
        if (profile) {
            const updatedContacts = profile.trustedContacts.filter(c => c.id !== id);
            const updatedProfile = { ...profile, trustedContacts: updatedContacts };
            setProfile(updatedProfile);
            saveUserProfile(updatedProfile); // Auto save
            notify('Contact removed', 'info');
        }
    };

    if (!profile) return <div className="bg-transparent text-fb-text h-full flex items-center justify-center">Loading...</div>;

    return (
        <div className="flex flex-col h-full bg-transparent text-fb-text">
            {/* Header */}
            <div className="flex items-center p-4 bg-fb-card border-b border-transparent rounded-t-lg">
                <button onClick={onBack} className="p-2 text-fb-text-secondary hover:text-fb-text mr-2">
                    <ChevronLeft size={24} />
                </button>
                <h1 className="text-xl font-bold tracking-wider uppercase">Settings & Profile</h1>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">

                {/* Verification Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-blue-500 mb-2">
                        <BadgeCheck size={24} />
                        <h2 className="text-2xl font-bold uppercase">Verification</h2>
                    </div>
                    <div className="bg-fb-card p-4 rounded-xl border border-transparent shadow-sm">
                        {profile.isVerified ? (
                            <div className="flex flex-col items-center justify-center p-4">
                                <div className="bg-blue-500/20 p-4 rounded-full mb-3">
                                    <ShieldCheck size={48} className="text-blue-500" />
                                </div>
                                <h3 className="text-fb-text font-bold uppercase tracking-widest">Verified Fighter</h3>
                                <p className="text-xs text-fb-text-secondary mt-1">Your ID has been confirmed.</p>
                            </div>
                        ) : (
                            <div>
                                <p className="text-sm text-fb-text-secondary mb-4">
                                    Get verified to earn the Blue Badge. Verified fighters get 40% more matches and look less like feds.
                                </p>
                                <button
                                    onClick={handleVerify}
                                    disabled={verifying}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors uppercase text-sm"
                                >
                                    {verifying ? (
                                        <>Verifying...</>
                                    ) : (
                                        <><Upload size={16} /> Upload Government ID</>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Wallet Section */}
                <div className="space-y-4 pt-4 border-t border-gray-700">
                    <div className="flex items-center gap-2 text-green-500 mb-2">
                        <CreditCard size={24} />
                        <h2 className="text-2xl font-bold uppercase">Wallet & Payments</h2>
                    </div>
                    <div className="bg-fb-card p-4 rounded-xl border border-transparent shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <p className="text-[10px] text-fb-text-secondary uppercase font-bold">Current Balance</p>
                                <p className="text-3xl font-bold text-fb-text">${profile.balance.toFixed(2)}</p>
                            </div>
                            <button
                                onClick={onTopUp}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-bold uppercase shadow-sm"
                            >
                                Add Funds
                            </button>
                        </div>

                        {/* Recent Transactions */}
                        <h4 className="text-[10px] text-fb-text-secondary uppercase font-bold mb-2">Recent Transactions</h4>
                        <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                            {profile.transactions && profile.transactions.length > 0 ? (
                                profile.transactions.slice(0, 5).map(tx => (
                                    <div key={tx.id} className="flex justify-between items-center bg-fb-bg p-2 rounded border border-transparent">
                                        <div className="flex items-center gap-2">
                                            <div className={`p-1.5 rounded-full ${tx.type === 'DEPOSIT' || tx.type === 'BET_WIN' ? 'bg-green-900/30 text-green-500' : 'bg-red-900/30 text-red-500'}`}>
                                                {tx.type === 'DEPOSIT' || tx.type === 'BET_WIN' ? <ArrowDownLeft size={12} /> : <ArrowUpRight size={12} />}
                                            </div>
                                            <div>
                                                <div className="text-xs font-bold text-fb-text uppercase">{tx.type.replace('_', ' ')}</div>
                                                <div className="text-[10px] text-fb-text-secondary">{new Date(tx.timestamp).toLocaleDateString()}</div>
                                            </div>
                                        </div>
                                        <span className={`font-mono text-xs font-bold ${tx.type === 'DEPOSIT' || tx.type === 'BET_WIN' ? 'text-green-500' : 'text-fb-text-secondary'}`}>
                                            {tx.type === 'DEPOSIT' || tx.type === 'BET_WIN' ? '+' : '-'}${tx.amount}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-xs text-fb-text-secondary italic">No transactions yet.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Safety / Trusted Contacts */}
                <div className="space-y-4 pt-4 border-t border-gray-700">
                    <div className="flex items-center gap-2 text-red-500 mb-2">
                        <ShieldCheck size={24} />
                        <h2 className="text-2xl font-bold uppercase">Safety & Contacts</h2>
                    </div>
                    <div className="bg-fb-card p-4 rounded-xl border border-transparent shadow-sm">
                        <p className="text-[10px] text-fb-text-secondary uppercase font-bold mb-4">
                            Trusted Contacts will receive your location if you hit the Panic Button.
                        </p>

                        <div className="space-y-2 mb-4">
                            {profile.trustedContacts.map(contact => (
                                <div key={contact.id} className="flex items-center justify-between bg-fb-bg p-3 rounded-lg border border-transparent">
                                    <div>
                                        <div className="font-bold text-sm text-fb-text">{contact.name}</div>
                                        <div className="text-xs text-fb-text-secondary">{contact.phone}</div>
                                    </div>
                                    <button onClick={() => removeContact(contact.id)} className="text-red-500 hover:text-red-400">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                            {profile.trustedContacts.length === 0 && (
                                <p className="text-xs text-fb-text-secondary italic text-center py-2">No trusted contacts added.</p>
                            )}
                        </div>

                        <div className="grid grid-cols-5 gap-2">
                            <input
                                placeholder="Name"
                                value={newContactName}
                                onChange={(e) => setNewContactName(e.target.value)}
                                className="col-span-2 bg-fb-bg border border-transparent rounded p-2 text-xs text-fb-text"
                            />
                            <input
                                placeholder="Phone"
                                value={newContactPhone}
                                onChange={(e) => setNewContactPhone(e.target.value)}
                                className="col-span-2 bg-fb-bg border border-transparent rounded p-2 text-xs text-fb-text"
                            />
                            <button
                                onClick={addContact}
                                className="col-span-1 bg-green-700 hover:bg-green-600 rounded flex items-center justify-center"
                            >
                                <UserPlus size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Profile Stats Section */}
                <div className="space-y-4 pt-4 border-t border-gray-700">
                    <div className="flex items-center gap-2 text-squabble-red mb-2">
                        <User size={24} />
                        <h2 className="text-2xl font-bold uppercase">Fighter Profile</h2>
                    </div>
                    <div className="bg-fb-card p-4 rounded-xl border border-transparent space-y-4 shadow-sm">

                        {/* Basic Info */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-bold uppercase text-fb-text-secondary mb-1">Fighter Name</label>
                                <input
                                    type="text"
                                    value={profile.name}
                                    onChange={(e) => updateProfile('name', e.target.value)}
                                    className="w-full bg-fb-bg border border-transparent rounded p-2 text-fb-text text-sm focus:border-squabble-red outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold uppercase text-fb-text-secondary mb-1">Age</label>
                                <input
                                    type="number"
                                    value={profile.age}
                                    onChange={(e) => updateProfile('age', parseInt(e.target.value))}
                                    className="w-full bg-fb-bg border border-transparent rounded p-2 text-fb-text text-sm focus:border-squabble-red outline-none"
                                />
                            </div>
                        </div>

                        {/* Physical Stats */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-bold uppercase text-fb-text-secondary mb-1">Height</label>
                                <input
                                    type="text"
                                    value={profile.height}
                                    onChange={(e) => updateProfile('height', e.target.value)}
                                    className="w-full bg-fb-bg border border-transparent rounded p-2 text-fb-text text-sm focus:border-squabble-red outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold uppercase text-fb-text-secondary mb-1">Weight</label>
                                <input
                                    type="text"
                                    value={profile.weight}
                                    onChange={(e) => updateProfile('weight', e.target.value)}
                                    className="w-full bg-fb-bg border border-transparent rounded p-2 text-fb-text text-sm focus:border-squabble-red outline-none"
                                />
                            </div>
                        </div>

                        {/* Fight Record */}
                        <div className="p-3 bg-fb-bg rounded-lg border border-transparent">
                            <label className="block text-[10px] font-bold uppercase text-squabble-red mb-2 text-center">Official Record (Wins - Losses)</label>
                            <div className="flex items-center gap-4">
                                <div className="flex-1 text-center">
                                    <label className="text-[10px] text-green-500 block">WINS</label>
                                    <input
                                        type="number"
                                        value={profile.wins}
                                        onChange={(e) => updateProfile('wins', parseInt(e.target.value))}
                                        className="w-full bg-fb-card border border-transparent rounded p-2 text-fb-text text-center font-bold focus:border-green-500 outline-none"
                                    />
                                </div>
                                <span className="text-fb-text-secondary font-bold">-</span>
                                <div className="flex-1 text-center">
                                    <label className="text-[10px] text-red-500 block">LOSSES</label>
                                    <input
                                        type="number"
                                        value={profile.losses}
                                        onChange={(e) => updateProfile('losses', parseInt(e.target.value))}
                                        className="w-full bg-fb-card border border-transparent rounded p-2 text-fb-text text-center font-bold focus:border-red-500 outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Dropdowns */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-bold uppercase text-fb-text-secondary mb-1">Stance</label>
                                <select
                                    value={profile.stance}
                                    onChange={(e) => updateProfile('stance', e.target.value)}
                                    className="w-full bg-fb-bg border border-transparent rounded p-2 text-fb-text text-sm focus:border-squabble-red outline-none"
                                >
                                    <option>Orthodox</option>
                                    <option>Southpaw</option>
                                    <option>Switch</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold uppercase text-fb-text-secondary mb-1">Experience</label>
                                <select
                                    value={profile.experience}
                                    onChange={(e) => updateProfile('experience', e.target.value)}
                                    className="w-full bg-fb-bg border border-transparent rounded p-2 text-fb-text text-sm focus:border-squabble-red outline-none"
                                >
                                    <option>Novice</option>
                                    <option>Amateur</option>
                                    <option>Pro</option>
                                    <option>Street</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold uppercase text-fb-text-secondary mb-1">Bio (Trash Talk)</label>
                            <textarea
                                value={profile.bio}
                                onChange={(e) => updateProfile('bio', e.target.value)}
                                rows={3}
                                className="w-full bg-fb-bg border border-transparent rounded p-2 text-fb-text text-sm focus:border-squabble-red outline-none resize-none"
                            />
                        </div>

                        <button
                            onClick={handleSaveProfile}
                            className="w-full bg-fb-hover hover:bg-gray-600 text-fb-text font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors uppercase text-sm"
                        >
                            <Save size={16} />
                            Update Profile
                        </button>
                    </div>
                </div>

                {/* AI Section */}
                <div className="space-y-4 pt-4 border-t border-gray-700">
                    <div className="flex items-center gap-2 text-fb-text-secondary mb-2">
                        <Key size={24} />
                        <h2 className="text-xl font-bold uppercase">AI Features (Optional)</h2>
                    </div>

                    <p className="text-fb-text-secondary text-xs">
                        Add a Google Gemini API Key to enhance the user experience with advanced features.
                        <br />
                        Without a key, the app works in <span className="text-fb-text font-bold">Standard Mode</span>.
                    </p>

                    <div className="bg-fb-card p-4 rounded-xl border border-transparent shadow-sm">
                        <label className="block text-[10px] font-bold uppercase text-fb-text-secondary mb-2">Gemini API Key</label>
                        <div className="relative">
                            <input
                                type={showKey ? "text" : "password"}
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                placeholder="AIzaSy..."
                                className="w-full bg-fb-bg border border-transparent rounded-lg p-3 pr-10 text-fb-text focus:border-squabble-red focus:outline-none font-mono text-xs"
                            />
                            <button
                                onClick={() => setShowKey(!showKey)}
                                className="absolute right-3 top-3 text-fb-text-secondary hover:text-fb-text"
                            >
                                {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>

                        <div className="flex gap-2 mt-4">
                            <button
                                onClick={handleSaveKey}
                                className="flex-1 bg-squabble-red hover:bg-red-700 text-white font-bold py-2 rounded-lg flex items-center justify-center gap-2 transition-colors uppercase text-xs"
                            >
                                <Save size={14} />
                                Save Key
                            </button>
                            <button
                                onClick={handleClearKey}
                                className="px-4 bg-fb-hover hover:bg-gray-600 text-fb-text-secondary hover:text-fb-text rounded-lg flex items-center justify-center transition-colors"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Logout Section */}
            <div className="pt-4 border-t border-gray-700 pb-8">
                <button
                    onClick={onLogout}
                    className="w-full bg-red-900/50 hover:bg-red-900 text-red-500 hover:text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all uppercase tracking-wider border border-red-900"
                >
                    <ArrowDownLeft className="rotate-45" size={20} />
                    Log Out
                </button>
            </div>
        </div>
    );
};
