import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import axios from 'axios';
import { User, Bell, Shield, CreditCard, Tag, Plus, Trash2 } from 'lucide-react';

const Settings = () => {
    const { selectedOrg } = useOutletContext();
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState({ name: '', type: 'Expense' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (selectedOrg) {
            fetchCategories();
        }
    }, [selectedOrg]);

    const fetchCategories = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`http://localhost:5000/api/categories?orgId=${selectedOrg._id}`, {
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
            await axios.post('http://localhost:5000/api/categories', {
                ...newCategory,
                orgId: selectedOrg._id
            }, {
                headers: { 'x-auth-token': token }
            });
            setNewCategory({ name: '', type: 'Expense' });
            fetchCategories();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteCategory = async (id) => {
        if (!window.confirm('Delete this category?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/categories/${id}`, {
                headers: { 'x-auth-token': token }
            });
            fetchCategories();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <div className="mb-6 sm:mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Settings</h2>
                <p className="mt-1 text-xs sm:text-sm text-gray-500">Manage your account and organization preferences.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                {/* Main Settings List */}
                <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                    <div className="bg-white shadow-lg rounded-lg sm:rounded-2xl overflow-hidden border border-gray-100">
                        <div className="divide-y divide-gray-200">
                            <div className="p-4 sm:p-6 hover:bg-gray-50 transition-colors cursor-pointer">
                                <div className="flex items-center">
                                    <div className="bg-indigo-100 p-3 rounded-full">
                                        <User className="h-6 w-6 text-indigo-600" />
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-medium text-gray-900">Profile Settings</h3>
                                        <p className="text-sm text-gray-500">Update your personal information.</p>
                                    </div>
                                </div>
                            </div>
                            {/* ... other settings ... */}
                        </div>
                    </div>

                    {/* Category Management */}
                    <div className="bg-white shadow-lg rounded-lg sm:rounded-2xl overflow-hidden border border-gray-100 p-4 sm:p-6">
                        <div className="flex items-center mb-6">
                            <div className="bg-green-100 p-3 rounded-full mr-4">
                                <Tag className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">Financial Categories</h3>
                                <p className="text-sm text-gray-500">Manage income and expense categories.</p>
                            </div>
                        </div>

                        <form onSubmit={handleAddCategory} className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-4 sm:mb-6">
                            <input
                                type="text"
                                placeholder="Category Name"
                                required
                                value={newCategory.name}
                                onChange={e => setNewCategory({ ...newCategory, name: e.target.value })}
                                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                            />
                            <select
                                value={newCategory.type}
                                onChange={e => setNewCategory({ ...newCategory, type: e.target.value })}
                                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                            >
                                <option value="Expense">Expense</option>
                                <option value="Income">Income</option>
                            </select>
                            <button
                                type="submit"
                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Add
                            </button>
                        </form>

                        <ul className="divide-y divide-gray-200">
                            {categories.map(cat => (
                                <li key={cat._id} className="py-3 flex justify-between items-center">
                                    <div>
                                        <span className="font-medium text-gray-900">{cat.name}</span>
                                        <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${cat.type === 'Income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                            {cat.type}
                                        </span>
                                    </div>
                                    <button onClick={() => handleDeleteCategory(cat._id)} className="text-gray-400 hover:text-red-600">
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
