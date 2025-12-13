import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosInstance';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const onSubmit = async e => {
        e.preventDefault();
        try {
            await api.post('/api/auth/forgot-password', { email });
            setMessage('OTP sent to your email');
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send OTP');
            setMessage('');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Forgot Password
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={onSubmit}>
                    {message && <div className="text-green-500 text-center">{message}</div>}
                    {error && <div className="text-red-500 text-center">{error}</div>}
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <input
                                type="email"
                                required
                                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Email address"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Send OTP
                        </button>
                    </div>
                    <div className="text-center">
                        <Link to="/reset-password" className="text-indigo-600 hover:text-indigo-500">
                            Have an OTP? Reset Password
                        </Link>
                    </div>
                    <div className="text-center">
                        <Link to="/login" className="text-indigo-600 hover:text-indigo-500">
                            Back to Login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
