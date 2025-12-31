import React, { useState } from 'react';
import { User, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { signup, signin } from '../services/db';

interface LoginViewProps {
    onLoginSuccess: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                await signin(username, password);
            } else {
                await signup(username, password);
            }
            onLoginSuccess();
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Authentication failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-black text-white items-center justify-center p-8 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1544552866-d3ed42536cfd?q=80&w=2071&auto=format&fit=crop')] bg-cover bg-center opacity-20 pointer-events-none"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black pointer-events-none"></div>

            <div className="z-10 w-full max-w-sm space-y-8">
                <div className="text-center space-y-2">
                    <h1 className="text-5xl font-heading font-bold text-squabble-red tracking-tighter italic drop-shadow-lg">SQUABBLE</h1>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Fight Club for the Internet</p>
                </div>

                <div className="bg-gray-900/80 backdrop-blur-md p-8 rounded-2xl border border-gray-800 shadow-2xl">
                    <div className="flex justify-center mb-6">
                        <div className="bg-gray-800 p-1 rounded-full flex">
                            <button
                                onClick={() => setIsLogin(true)}
                                className={`px-6 py-2 rounded-full text-xs font-bold uppercase transition-all ${isLogin ? 'bg-squabble-red text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                            >
                                Login
                            </button>
                            <button
                                onClick={() => setIsLogin(false)}
                                className={`px-6 py-2 rounded-full text-xs font-bold uppercase transition-all ${!isLogin ? 'bg-squabble-red text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                            >
                                Sign Up
                            </button>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase text-gray-500 ml-1">Username</label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 text-gray-500" size={16} />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full bg-black/50 border border-gray-700 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:border-squabble-red focus:outline-none transition-colors"
                                    placeholder="Enter your username"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase text-gray-500 ml-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 text-gray-500" size={16} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-black/50 border border-gray-700 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:border-squabble-red focus:outline-none transition-colors"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 text-red-500 text-xs bg-red-900/20 p-3 rounded-lg border border-red-900/50">
                                <AlertCircle size={14} />
                                <span>{error}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-squabble-red hover:bg-red-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all uppercase tracking-wider shadow-lg shadow-red-900/30 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="animate-pulse">Processing...</span>
                            ) : (
                                <>
                                    {isLogin ? 'Enter the Ring' : 'Join the Fight'} <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center text-[10px] text-gray-600">
                    By entering, you agree to the <span className="text-gray-400 underline cursor-pointer">Rules of Engagement</span>.
                </p>
            </div>
        </div>
    );
};
