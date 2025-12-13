import React, { useState } from 'react';
import api from '../api/axiosInstance';

const AdminChangePasswordModal = ({ isOpen, onClose, userId, orgId, userName }) => {
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await api.post('/api/users/admin/change-password',
                { userId, orgId, newPassword },
                { headers: { 'x-auth-token': token } }
            );
            setMessage('Password updated successfully');
            setError('');
            setNewPassword('');
            setTimeout(() => {
                setMessage('');
                onClose();
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update password');
            setMessage('');
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
            <div className="bg-white p-5 rounded-lg shadow-xl w-96">
                <h3 className="text-lg font-bold mb-4">Change Password for {userName}</h3>
                {message && <div className="text-green-500 mb-2 text-sm">{message}</div>}
                {error && <div className="text-red-500 mb-2 text-sm">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <input
                        type="password"
                        placeholder="New Password"
                        className="w-full p-2 border rounded mb-4"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                        >
                            Update
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminChangePasswordModal;
