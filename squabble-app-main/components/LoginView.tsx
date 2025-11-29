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
        <div className="bg-gray-100 flex items-center justify-center min-h-screen">
            <div className="w-1/2">
                <h1 className="text-6xl font-bold text-blue-600">facebook</h1>
                <p className="text-2xl">Connect with friends and the world around you on Facebook.</p>
            </div>
            <div className="w-1/2 flex justify-center">
                <div className="bg-white p-8 rounded-lg shadow-md w-96">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:border-blue-500"
                            placeholder="Email or Phone Number"
                            required
                        />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:border-blue-500"
                            placeholder="Password"
                            required
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white font-bold py-3 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Logging in...' : 'Log In'}
                        </button>
                    </form>
                    <div className="text-center my-4">
                        <a href="#" className="text-blue-600 hover:underline">Forgot password?</a>
                    </div>
                    <hr />
                    <div className="text-center mt-4">
                        <button
                            onClick={() => setIsLogin(false)}
                            className="bg-green-500 text-white font-bold py-3 px-6 rounded-md hover:bg-green-600 transition-colors"
                        >
                            Create new account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
