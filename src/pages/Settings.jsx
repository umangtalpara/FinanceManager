import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import api from '../api/axiosInstance';
import { useToast } from '../context/ToastContext';
import { User, Tag, Plus, Trash2, Save, Lock, Mail, Type } from 'lucide-react';

const Settings = () => {
    const { selectedOrg } = useOutletContext();
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState({ name: '', type: 'Expense' });
    const { showToast } = useToast();

    // User Profile State
    const [profileData, setProfileData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await api.get('/api/auth/me', {
                headers: { 'x-auth-token': token }
            });
            setProfileData(prev => ({
                ...prev,
                fullName: res.data.fullName,
                email: res.data.email
            }));
        } catch (err) {
            console.error(err);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        if (profileData.password !== profileData.confirmPassword) {
            showToast('Passwords do not match', 'error');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const updateData = {
                fullName: profileData.fullName,
                email: profileData.email
            };
            if (profileData.password) {
                updateData.password = profileData.password;
            }

            await api.put('/api/users/profile', updateData, {
                headers: { 'x-auth-token': token }
            });

            showToast('Profile updated successfully', 'success');
            setProfileData(prev => ({ ...prev, password: '', confirmPassword: '' }));
        } catch (err) {
            console.error(err);
            showToast(err.response?.data?.message || 'Error updating profile', 'error');
        }
    };

    useEffect(() => {
        if (selectedOrg) {
            fetchCategories();
        }
    }, [selectedOrg]);

    const fetchCategories = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await api.get(`/api/categories?orgId=${selectedOrg._id}`, {
                headers: { 'x-auth-token': token }
            });
            setCategories(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddCategory = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await api.post('/api/categories', {
                ...newCategory,
                orgId: selectedOrg._id
            }, {
                headers: { 'x-auth-token': token }
            });
            setNewCategory({ name: '', type: 'Expense' });
            fetchCategories();
            showToast('Category added successfully', 'success');
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteCategory = async (id) => {
        if (!window.confirm('Delete this category?')) return;
        try {
            const token = localStorage.getItem('token');
            await api.delete(`/api/categories/${id}`, {
                headers: { 'x-auth-token': token }
            });
            fetchCategories();
            showToast('Category deleted successfully', 'success');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-all duration-500 ease-in-out">
            <div className="mb-10 text-center sm:text-left">
                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">Settings</h2>
                <p className="mt-2 text-lg text-gray-500">Manage your profile and organize your finances.</p>
            </div>

            <div className="space-y-8">
                {/* Profile Settings */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 transition-shadow hover:shadow-2xl duration-300">
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
                        <div className="flex items-center text-white">
                            <User className="h-6 w-6 mr-3" />
                            <h3 className="text-xl font-bold">Profile Settings</h3>
                        </div>
                        <p className="text-indigo-100 text-sm mt-1 ml-9">Update your personal preferences and security.</p>
                    </div>

                    <div className="p-6 sm:p-8">
                        <form onSubmit={handleUpdateProfile} className="space-y-6">
                            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                                <div className="sm:col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                        <Type className="w-4 h-4 mr-1 text-gray-400" /> Full Name
                                    </label>
                                    <input
                                        type="text"
                                        value={profileData.fullName}
                                        onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors duration-200 ease-in-out py-2.5"
                                        required
                                    />
                                </div>

                                <div className="sm:col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                        <Mail className="w-4 h-4 mr-1 text-gray-400" /> Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={profileData.email}
                                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors duration-200 ease-in-out py-2.5"
                                        required
                                    />
                                </div>

                                <div className="sm:col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                        <Lock className="w-4 h-4 mr-1 text-gray-400" /> New Password
                                    </label>
                                    <input
                                        type="password"
                                        value={profileData.password}
                                        onChange={(e) => setProfileData({ ...profileData, password: e.target.value })}
                                        placeholder="Leave blank to keep current"
                                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors duration-200 ease-in-out py-2.5"
                                        autoComplete="new-password"
                                    />
                                </div>

                                <div className="sm:col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                        <Lock className="w-4 h-4 mr-1 text-gray-400" /> Confirm New Password
                                    </label>
                                    <input
                                        type="password"
                                        value={profileData.confirmPassword}
                                        onChange={(e) => setProfileData({ ...profileData, confirmPassword: e.target.value })}
                                        placeholder="Confirm new password"
                                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors duration-200 ease-in-out py-2.5"
                                        autoComplete="new-password"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end border-t border-gray-100">
                                <button
                                    type="submit"
                                    className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:scale-105 active:scale-95 duration-200"
                                >
                                    <Save className="h-4 w-4 mr-2" />
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Category Management */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 transition-shadow hover:shadow-2xl duration-300">
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-4">
                        <div className="flex items-center text-white">
                            <Tag className="h-6 w-6 mr-3" />
                            <h3 className="text-xl font-bold">Financial Categories</h3>
                        </div>
                        <p className="text-emerald-100 text-sm mt-1 ml-9">Manage income and expense categories for your organizations.</p>
                    </div>

                    <div className="p-6 sm:p-8">
                        <form onSubmit={handleAddCategory} className="mb-8">
                            <div className="flex flex-col sm:flex-row gap-4 items-end">
                                <div className="flex-grow w-full">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">New Category Name</label>
                                    <input
                                        type="text"
                                        placeholder="e.g., Office Supplies"
                                        required
                                        value={newCategory.name}
                                        onChange={e => setNewCategory({ ...newCategory, name: e.target.value })}
                                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm py-2.5"
                                    />
                                </div>
                                <div className="w-full sm:w-48">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                    <select
                                        value={newCategory.type}
                                        onChange={e => setNewCategory({ ...newCategory, type: e.target.value })}
                                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm py-2.5"
                                    >
                                        <option value="Expense">Expense</option>
                                        <option value="Income">Income</option>
                                    </select>
                                </div>
                                <div className="w-full sm:w-auto">
                                    <button
                                        type="submit"
                                        className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all transform hover:scale-105 active:scale-95 duration-200"
                                    >
                                        <Plus className="h-5 w-5 mr-2" />
                                        Add
                                    </button>
                                </div>
                            </div>
                        </form>

                        <div className="border-t border-gray-100 pt-6">
                            <h4 className="text-lg font-medium text-gray-900 mb-4">Existing Categories</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {categories.map(cat => (
                                    <div key={cat._id} className="group flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-transparent hover:border-gray-200 hover:bg-gray-100 transition-all duration-200 shadow-sm">
                                        <div className="flex items-center space-x-3 overflow-hidden">
                                            <span className={`flex-shrink-0 h-3 w-3 rounded-full ${cat.type === 'Income' ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                                            <span className="font-medium text-gray-900 truncate" title={cat.name}>{cat.name}</span>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteCategory(cat._id)}
                                            className="ml-2 text-gray-400 hover:text-red-600 p-1.5 rounded-full hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                                            title="Delete Category"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                                {categories.length === 0 && (
                                    <div className="col-span-full text-center text-gray-500 py-8 italic bg-gray-50 rounded-lg border border-dashed border-gray-300">
                                        No categories found. Add one above to get started!
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
