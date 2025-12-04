import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Building, LayoutDashboard, Folder, Users, PieChart, Settings, LogOut, Menu, X } from 'lucide-react';

const Layout = ({ children, user, orgs, selectedOrg, setSelectedOrg, handleLogout }) => {
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const navigation = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Projects', href: '/projects', icon: Folder },
        { name: 'Team', href: '/team', icon: Users },
        { name: 'Reports', href: '/reports', icon: PieChart },
        { name: 'Settings', href: '/settings', icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center justify-center h-16 border-b border-gray-200 px-4">
                        <div className="bg-indigo-600 p-2 rounded-lg shadow-lg mr-3">
                            <Building className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-xl font-extrabold tracking-tight text-gray-900">Finance<span className="text-indigo-600">Manager</span></span>
                        <button
                            className="ml-auto md:hidden text-gray-500"
                            onClick={() => setIsSidebarOpen(false)}
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Org Switcher */}
                    <div className="p-4 border-b border-gray-200">
                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Organization</label>
                        <select
                            className="block w-full pl-3 pr-10 py-2 text-sm border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md bg-gray-50"
                            value={selectedOrg?._id || ''}
                            onChange={(e) => {
                                const org = orgs.find(o => o._id === e.target.value);
                                setSelectedOrg(org);
                            }}
                        >
                            {orgs.map(org => (
                                <option key={org._id} value={org._id}>{org.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
                        {navigation.map((item) => {
                            const isActive = location.pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150 ${isActive
                                            ? 'bg-indigo-50 text-indigo-600'
                                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                    onClick={() => setIsSidebarOpen(false)}
                                >
                                    <item.icon
                                        className={`mr-3 flex-shrink-0 h-5 w-5 ${isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-500'
                                            }`}
                                        aria-hidden="true"
                                    />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User Profile & Logout */}
                    <div className="border-t border-gray-200 p-4">
                        <div className="flex items-center mb-4">
                            <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
                                {user?.fullName?.charAt(0)}
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{user?.fullName}</p>
                                <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700 truncate w-32">{user?.email}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Mobile Header */}
                <div className="md:hidden bg-white shadow-sm border-b border-gray-200 p-4 flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="bg-indigo-600 p-1.5 rounded-lg shadow-sm mr-2">
                            <Building className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-lg font-bold text-gray-900">Finance<span className="text-indigo-600">Manager</span></span>
                    </div>
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                        <Menu className="h-6 w-6" />
                    </button>
                </div>

                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
