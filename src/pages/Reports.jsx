import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import axios from 'axios';
import { PieChart, BarChart, Activity, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

const Reports = () => {
    const { selectedOrg } = useOutletContext();
    const [stats, setStats] = useState({
        totalIncome: 0,
        totalExpenses: 0,
        netBalance: 0,
        pendingApprovals: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (selectedOrg) {
            fetchStats(selectedOrg._id);
        }
    }, [selectedOrg]);

    const fetchStats = async (orgId) => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const res = await axios.get(`http://localhost:5000/api/reports/stats?orgId=${orgId}`, {
                headers: { 'x-auth-token': token }
            });
            setStats(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const expensePercentage = stats.totalIncome > 0
        ? Math.round((stats.totalExpenses / stats.totalIncome) * 100)
        : 0;

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-gray-500">Loading reports...</div>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-6 sm:mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Reports & Analytics</h2>
                <p className="mt-1 text-xs sm:text-sm text-gray-500">Deep dive into your organization's financial health.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                {/* Expense Distribution */}
                <div className="bg-white p-4 sm:p-6 rounded-lg sm:rounded-2xl shadow-lg border border-gray-100">
                    <div className="flex items-center mb-4">
                        <PieChart className="h-6 w-6 text-indigo-600 mr-2" />
                        <h3 className="text-lg font-semibold text-gray-900">Expense Distribution</h3>
                    </div>
                    <div className="space-y-4">
                        {/* Income */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <div className="flex items-center">
                                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                                    <span className="text-sm font-medium text-gray-700">Income</span>
                                </div>
                                <span className="text-sm font-bold text-green-600">${stats.totalIncome.toLocaleString()}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                            </div>
                        </div>

                        {/* Expenses */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <div className="flex items-center">
                                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                                    <span className="text-sm font-medium text-gray-700">Expenses</span>
                                </div>
                                <span className="text-sm font-bold text-red-600">${stats.totalExpenses.toLocaleString()}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-red-500 h-2 rounded-full" style={{ width: `${expensePercentage}%` }}></div>
                            </div>
                        </div>

                        {/* Net Balance */}
                        <div className="pt-4 border-t border-gray-200">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-700">Net Balance</span>
                                <span className={`text-lg font-bold ${stats.netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    ${stats.netBalance.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Financial Summary */}
                <div className="bg-white p-4 sm:p-6 rounded-lg sm:rounded-2xl shadow-lg border border-gray-100">
                    <div className="flex items-center mb-4">
                        <BarChart className="h-6 w-6 text-green-600 mr-2" />
                        <h3 className="text-lg font-semibold text-gray-900">Financial Summary</h3>
                    </div>
                    <div className="space-y-4">
                        {/* Total Income */}
                        <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                            <div className="flex items-center">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <TrendingUp className="h-5 w-5 text-green-600" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-xs text-gray-500">Total Income</p>
                                    <p className="text-xl font-bold text-green-600">${stats.totalIncome.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>

                        {/* Total Expenses */}
                        <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                            <div className="flex items-center">
                                <div className="p-2 bg-red-100 rounded-lg">
                                    <TrendingDown className="h-5 w-5 text-red-600" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-xs text-gray-500">Total Expenses</p>
                                    <p className="text-xl font-bold text-red-600">${stats.totalExpenses.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>

                        {/* Expense Ratio */}
                        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                            <div className="flex items-center">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <DollarSign className="h-5 w-5 text-blue-600" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-xs text-gray-500">Expense Ratio</p>
                                    <p className="text-xl font-bold text-blue-600">{expensePercentage}%</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Key Metrics */}
                <div className="bg-white p-4 sm:p-6 rounded-lg sm:rounded-2xl shadow-lg border border-gray-100 md:col-span-2">
                    <div className="flex items-center mb-4">
                        <Activity className="h-6 w-6 text-blue-600 mr-2" />
                        <h3 className="text-lg font-semibold text-gray-900">Key Metrics</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Net Balance */}
                        <div className="p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg">
                            <p className="text-xs text-indigo-600 font-medium uppercase tracking-wide">Net Balance</p>
                            <p className={`text-2xl font-bold mt-1 ${stats.netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                ${stats.netBalance.toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                {stats.netBalance >= 0 ? 'Positive cash flow' : 'Negative cash flow'}
                            </p>
                        </div>

                        {/* Pending Approvals */}
                        <div className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg">
                            <p className="text-xs text-yellow-600 font-medium uppercase tracking-wide">Pending</p>
                            <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.pendingApprovals}</p>
                            <p className="text-xs text-gray-500 mt-1">Awaiting approval</p>
                        </div>

                        {/* Income Growth */}
                        <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                            <p className="text-xs text-green-600 font-medium uppercase tracking-wide">Income</p>
                            <p className="text-2xl font-bold text-green-600 mt-1">${stats.totalIncome.toLocaleString()}</p>
                            <p className="text-xs text-gray-500 mt-1">Total revenue</p>
                        </div>

                        {/* Expense Control */}
                        <div className="p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-lg">
                            <p className="text-xs text-red-600 font-medium uppercase tracking-wide">Expenses</p>
                            <p className="text-2xl font-bold text-red-600 mt-1">${stats.totalExpenses.toLocaleString()}</p>
                            <p className="text-xs text-gray-500 mt-1">Total spending</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;
