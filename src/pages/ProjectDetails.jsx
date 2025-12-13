import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';

import api from '../api/axiosInstance';
import { useToast } from '../context/ToastContext';
import { ArrowLeft, Plus, DollarSign, Trash2, Edit2, X, CheckCircle } from 'lucide-react';

const ProjectDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { selectedOrg, user } = useOutletContext(); // Get user from context
    const { showToast } = useToast();
    const [project, setProject] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [formData, setFormData] = useState({
        type: 'Debit',
        amount: '',
        description: '',
        categoryId: ''
    });

    // Check if user is Admin
    const isAdmin = selectedOrg && user; // Simplified check, ideally check role from members list

    useEffect(() => {
        fetchProject();
        fetchTransactions();
        if (selectedOrg) fetchCategories();
    }, [id, selectedOrg]);

    const fetchProject = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await api.get(`/api/projects/${id}`, {
                headers: { 'x-auth-token': token }
            });
            setProject(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchTransactions = async () => {
        try {
            console.log('Fetching transactions for project:', id);
            const token = localStorage.getItem('token');
            const res = await api.get(`/api/transactions?projectId=${id}`, {
                headers: { 'x-auth-token': token }
            });
            console.log('Fetched transactions:', res.data);
            setTransactions(res.data);
        } catch (err) {
            console.error('Error fetching transactions:', err);
        }
    };

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

    console.log('ProjectDetails rendered. User:', user, 'Org:', selectedOrg);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Submitting transaction...', formData);
        try {
            const token = localStorage.getItem('token');
            let res;
            if (editingTransaction) {
                res = await api.put(`/api/transactions/${editingTransaction._id}`, {
                    ...formData
                }, {
                    headers: { 'x-auth-token': token }
                });
            } else {
                console.log('Sending POST to create transaction with projectId:', id);
                res = await api.post('/api/transactions', {
                    ...formData,
                    projectId: id
                }, {
                    headers: { 'x-auth-token': token }
                });
            }
            console.log('Transaction submit response:', res.data);

            resetForm();
            fetchTransactions();
            showToast(editingTransaction ? 'Transaction updated' : 'Transaction created', 'success');
        } catch (err) {
            console.error('Submit error:', err);
            // Error toast handled strictly by interceptor
        }
    };

    const handleDelete = async (transactionId) => {
        if (!window.confirm('Are you sure you want to delete this transaction?')) return;
        try {
            const token = localStorage.getItem('token');
            await api.delete(`/api/transactions/${transactionId}`, {
                headers: { 'x-auth-token': token }
            });
            fetchTransactions();
            showToast('Transaction deleted', 'success');
        } catch (err) {
            console.error(err);
            // Error managed by interceptor
        }
    };

    const handleSettle = async (transactionId) => {
        if (!window.confirm('Mark this transaction as Settled?')) return;
        try {
            const token = localStorage.getItem('token');
            await api.put(`/api/transactions/${transactionId}/settle`, {}, {
                headers: { 'x-auth-token': token }
            });
            fetchTransactions();
            showToast('Transaction settled', 'success');
        } catch (err) {
            console.error(err);
            // Error managed by interceptor
        }
    };

    const handleEdit = (transaction) => {
        setEditingTransaction(transaction);
        setFormData({
            type: transaction.type,
            amount: transaction.amount,
            description: transaction.description,
            categoryId: transaction.categoryId || ''
        });
        setShowForm(true);
    };

    const resetForm = () => {
        setShowForm(false);
        setEditingTransaction(null);
        setFormData({ type: 'Debit', amount: '', description: '', categoryId: '' });
    };

    const handleStatusUpdate = async (transactionId, status) => {
        try {
            const token = localStorage.getItem('token');
            await api.put(`/api/approvals/${transactionId}/status`, { status }, {
                headers: { 'x-auth-token': token }
            });
            fetchTransactions();
            showToast(`Transaction ${status}`, 'success');
        } catch (err) {
            console.error(err);
            // Error managed by interceptor
        }
    };

    return (
        <div>
            <div className="mb-4 sm:mb-6 flex items-center justify-between">
                <button onClick={() => navigate('/projects')} className="flex items-center text-sm sm:text-base text-gray-600 hover:text-gray-900 transition-colors">
                    <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Back to Projects</span>
                    <span className="sm:hidden">Back</span>
                </button>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 break-words">{project ? project.name : 'Project'} - Transactions</h1>
                <button
                    onClick={() => {
                        resetForm();
                        setShowForm(!showForm);
                    }}
                    className="inline-flex items-center px-3 sm:px-4 py-2 border border-transparent rounded-md shadow-sm text-xs sm:text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors whitespace-nowrap"
                >
                    {showForm ? <X className="-ml-1 mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" /> : <Plus className="-ml-1 mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />}
                    <span className="hidden sm:inline">{showForm ? 'Cancel' : 'Add Transaction'}</span>
                    <span className="sm:hidden">{showForm ? 'Cancel' : 'Add'}</span>
                </button>
            </div>

            {showForm && (
                <div className="bg-white shadow-lg rounded-xl mb-6 sm:mb-8 p-4 sm:p-6 border border-gray-100">
                    <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">{editingTransaction ? 'Edit Transaction' : 'New Transaction'}</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Type</label>
                                <select
                                    value={formData.type}
                                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                >
                                    <option value="Debit">Debit (Expense)</option>
                                    <option value="Credit">Credit (Income)</option>
                                    <option value="Expectation">Expectation (Request)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Category</label>
                                <select
                                    value={formData.categoryId}
                                    onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                >
                                    <option value="">Select Category</option>
                                    {categories.filter(c => c.type === (formData.type === 'Credit' ? 'Income' : 'Expense')).map(cat => (
                                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Amount</label>
                                <input
                                    type="number"
                                    required
                                    value={formData.amount}
                                    onChange={e => setFormData({ ...formData, amount: e.target.value })}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <input
                                    type="text"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end mt-4 sm:mt-0">
                            <button
                                type="submit"
                                className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                {editingTransaction ? 'Update' : 'Submit'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white shadow-lg rounded-lg sm:rounded-xl overflow-hidden border border-gray-100">
                <ul className="divide-y divide-gray-200">
                    {transactions.map((transaction) => (
                        <li key={transaction._id} className="hover:bg-gray-50 transition-colors">
                            <div className="px-3 sm:px-4 md:px-6 py-4 sm:py-5">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                                    <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1 min-w-0">
                                        <div className={`flex-shrink-0 h-10 w-10 sm:h-10 sm:w-10 rounded-full flex items-center justify-center ${transaction.type === 'Credit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                            <DollarSign className="h-5 w-5 sm:h-6 sm:w-6" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm sm:text-sm font-medium text-indigo-600 truncate">{transaction.description || 'No description'}</p>
                                            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1">
                                                <span className="text-xs text-gray-500">{transaction.type}</span>
                                                {transaction.categoryId && <span className="hidden sm:inline text-xs text-gray-500">• {transaction.categoryId.name}</span>}
                                                {transaction.createdByMemberId?.userId && <span className="hidden md:inline text-xs text-gray-500">• Added by {transaction.createdByMemberId.userId.fullName}</span>}
                                                <span className="text-xs text-gray-400">{new Date(transaction.date).toLocaleDateString()}</span>
                                            </div>
                                            {/* Mobile: Amount and Status below description */}
                                            <div className="flex sm:hidden items-center gap-2 mt-2">
                                                <p className={`text-base font-bold ${transaction.type === 'Credit' ? 'text-green-600' : 'text-red-600'}`}>
                                                    {transaction.type === 'Credit' ? '+' : '-'}${transaction.amount}
                                                </p>
                                                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${transaction.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                                    transaction.status === 'Settled' ? 'bg-blue-100 text-blue-800' :
                                                        transaction.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                            'bg-red-100 text-red-800'
                                                    }`}>
                                                    {transaction.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Desktop: Amount and Status on the right */}
                                    <div className="hidden sm:flex items-center gap-4 md:gap-6 flex-shrink-0">
                                        <div className="flex flex-col items-end">
                                            <p className={`text-base font-bold whitespace-nowrap ${transaction.type === 'Credit' ? 'text-green-600' : 'text-red-600'}`}>
                                                {transaction.type === 'Credit' ? '+' : '-'}${transaction.amount}
                                            </p>
                                            <p className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${transaction.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                                transaction.status === 'Settled' ? 'bg-blue-100 text-blue-800' :
                                                    transaction.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-red-100 text-red-800'
                                                }`}>
                                                {transaction.status}
                                            </p>
                                        </div>

                                        {/* Action buttons - better spacing on mobile */}
                                        <div className="flex items-center gap-2 sm:gap-2">
                                            {/* Approval Actions */}
                                            {transaction.status === 'Pending' && (
                                                <div className="flex gap-2 sm:gap-2 mr-2 sm:mr-4 border-r border-gray-200 pr-2 sm:pr-4">
                                                    <button
                                                        onClick={() => handleStatusUpdate(transaction._id, 'Approved')}
                                                        className="text-xs sm:text-xs text-green-600 hover:text-green-900 font-medium bg-green-50 hover:bg-green-100 px-2 sm:px-2 py-1 sm:py-1 rounded transition-colors"
                                                    >
                                                        <span className="hidden sm:inline">Approve</span>
                                                        <span className="sm:hidden">✓</span>
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusUpdate(transaction._id, 'Rejected')}
                                                        className="text-xs sm:text-xs text-red-600 hover:text-red-900 font-medium bg-red-50 hover:bg-red-100 px-2 sm:px-2 py-1 sm:py-1 rounded transition-colors"
                                                    >
                                                        <span className="hidden sm:inline">Reject</span>
                                                        <span className="sm:hidden">✗</span>
                                                    </button>
                                                </div>
                                            )}

                                            {/* Settlement Action */}
                                            {transaction.status === 'Approved' && (
                                                <button
                                                    onClick={() => handleSettle(transaction._id)}
                                                    className="text-blue-600 hover:text-blue-900"
                                                    title="Mark as Settled"
                                                >
                                                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                                                </button>
                                            )}

                                            {/* CRUD Actions - better spacing */}
                                            <button
                                                onClick={() => handleEdit(transaction)}
                                                className="text-gray-400 hover:text-indigo-600 transition-colors p-1"
                                            >
                                                <Edit2 className="h-5 w-5 sm:h-5 sm:w-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(transaction._id)}
                                                className="text-gray-400 hover:text-red-600 transition-colors p-1"
                                            >
                                                <Trash2 className="h-5 w-5 sm:h-5 sm:w-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ProjectDetails;
