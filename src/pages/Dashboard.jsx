import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import axios from 'axios';
import { DollarSign, AlertCircle } from 'lucide-react';

const Dashboard = () => {
    const { selectedOrg } = useOutletContext();
    const [stats, setStats] = useState({
        totalIncome: 0,
        totalExpenses: 0,
        netBalance: 0,
        pendingApprovals: 0
    });

    useEffect(() => {
        if (selectedOrg) {
            fetchStats(selectedOrg._id);
        }
    }, [selectedOrg]);

    const fetchStats = async (orgId) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`http://localhost:5000/api/reports/stats?orgId=${orgId}`, {
                headers: { 'x-auth-token': token }
            });
            setStats(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <div className="mb-6 sm:mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                    Dashboard
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-gray-500">Overview of {selectedOrg?.name}</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6 mb-8 sm:mb-10">
                <div className="bg-white overflow-hidden shadow-lg rounded-2xl hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                    <div className="p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-green-100 rounded-xl p-3">
                                <DollarSign className="h-6 w-6 text-green-600" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate uppercase tracking-wider">Total Income</dt>
                                    <dd>
                                        <div className="text-2xl font-bold text-gray-900 mt-1">${stats.totalIncome.toLocaleString()}</div>
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                    <div className="bg-green-50 px-6 py-3">
                        <div className="text-xs font-medium text-green-700">
                            +12% from last month
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow-lg rounded-2xl hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                    <div className="p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-red-100 rounded-xl p-3">
                                <DollarSign className="h-6 w-6 text-red-600" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate uppercase tracking-wider">Total Expenses</dt>
                                    <dd>
                                        <div className="text-2xl font-bold text-gray-900 mt-1">${stats.totalExpenses.toLocaleString()}</div>
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                    <div className="bg-red-50 px-6 py-3">
                        <div className="text-xs font-medium text-red-700">
                            +5% from last month
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow-lg rounded-2xl hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                    <div className="p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-blue-100 rounded-xl p-3">
                                <DollarSign className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate uppercase tracking-wider">Net Balance</dt>
                                    <dd>
                                        <div className={`text-2xl font-bold mt-1 ${stats.netBalance >= 0 ? 'text-gray-900' : 'text-red-600'}`}>
                                            ${stats.netBalance.toLocaleString()}
                                        </div>
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                    <div className="bg-blue-50 px-6 py-3">
                        <div className="text-xs font-medium text-blue-700">
                            Healthy financial status
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow-lg rounded-2xl hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                    <div className="p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-yellow-100 rounded-xl p-3">
                                <AlertCircle className="h-6 w-6 text-yellow-600" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate uppercase tracking-wider">Pending</dt>
                                    <dd>
                                        <div className="text-2xl font-bold text-gray-900 mt-1">{stats.pendingApprovals}</div>
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                    <div className="bg-yellow-50 px-6 py-3">
                        <div className="text-xs font-medium text-yellow-700">
                            Actions required
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
