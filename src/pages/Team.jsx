import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import api from '../api/axiosInstance';
import { Lock, Plus, UserPlus, X } from 'lucide-react';
import AdminChangePasswordModal from '../components/AdminChangePasswordModal';

const Team = () => {
    const { selectedOrg, user } = useOutletContext();
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);

    // Add Member Form State
    const [newMemberData, setNewMemberData] = useState({
        email: '',
        fullName: '',
        password: '',
        role: 'Employee'
    });

    useEffect(() => {
        if (selectedOrg) {
            fetchMembers(selectedOrg._id);
        }
    }, [selectedOrg]);

    const fetchMembers = async (orgId) => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const res = await api.get(`/api/orgs/${orgId}/members`, {
                headers: { 'x-auth-token': token }
            });
            setMembers(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    // Check if current user is Admin of the selected org
    const isAdmin = members.find(m => m.userId._id === user.id && m.role === 'Admin');

    const openPasswordModal = (member) => {
        setSelectedMember(member);
        setIsPasswordModalOpen(true);
    };

    const handleAddMember = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await api.post(`/api/orgs/${selectedOrg._id}/members`, newMemberData, {
                headers: { 'x-auth-token': token }
            });
            setIsAddMemberModalOpen(false);
            setNewMemberData({ email: '', fullName: '', password: '', role: 'Employee' });
            fetchMembers(selectedOrg._id);
            alert('Member added successfully!');
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || 'Failed to add member');
        }
    };

    if (loading) return <div className="text-center py-10">Loading team members...</div>;

    return (
        <div>
            <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                        Team Members
                    </h2>
                    <p className="mt-1 text-xs sm:text-sm text-gray-500">People with access to this organization.</p>
                </div>
                {isAdmin && (
                    <button
                        onClick={() => setIsAddMemberModalOpen(true)}
                        className="inline-flex items-center px-3 sm:px-4 py-2 border border-transparent rounded-md shadow-sm text-xs sm:text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 whitespace-nowrap"
                    >
                        <UserPlus className="-ml-1 mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                        <span className="hidden sm:inline">Add Member</span>
                        <span className="sm:hidden">Add</span>
                    </button>
                )}
            </div>

            <div className="bg-white shadow-lg rounded-lg sm:rounded-2xl overflow-hidden border border-gray-100">
                <ul className="divide-y divide-gray-100">
                    {members.map((member) => (
                        <li key={member._id} className="hover:bg-gray-50 transition-colors duration-150">
                            <div className="px-3 sm:px-4 md:px-6 py-4 sm:py-5">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                                                {member.userId.fullName.charAt(0)}
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-base font-semibold text-gray-900">{member.userId.fullName}</div>
                                            <div className="text-sm text-gray-500">{member.userId.email}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full shadow-sm ${member.role === 'Admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                                            }`}>
                                            {member.role}
                                        </span>
                                        {isAdmin && (
                                            <button
                                                onClick={() => openPasswordModal(member)}
                                                className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all duration-200"
                                                title="Change Password"
                                            >
                                                <Lock className="h-5 w-5" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Add Member Modal */}
            {isAddMemberModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={() => setIsAddMemberModalOpen(false)}>
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full relative z-10">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">Add New Member</h3>
                                    <button onClick={() => setIsAddMemberModalOpen(false)} className="text-gray-400 hover:text-gray-500">
                                        <X className="h-6 w-6" />
                                    </button>
                                </div>
                                <form onSubmit={handleAddMember}>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Email</label>
                                            <input
                                                type="email"
                                                required
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                value={newMemberData.email}
                                                onChange={e => setNewMemberData({ ...newMemberData, email: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Full Name (Required for new users)</label>
                                            <input
                                                type="text"
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                value={newMemberData.fullName}
                                                onChange={e => setNewMemberData({ ...newMemberData, fullName: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Password (Required for new users)</label>
                                            <input
                                                type="text"
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                value={newMemberData.password}
                                                onChange={e => setNewMemberData({ ...newMemberData, password: e.target.value })}
                                                placeholder="Set a password for them"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Role</label>
                                            <select
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                value={newMemberData.role}
                                                onChange={e => setNewMemberData({ ...newMemberData, role: e.target.value })}
                                            >
                                                <option value="Employee">Employee</option>
                                                <option value="Lead">Project Lead</option>
                                                <option value="Admin">Admin</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="mt-5 sm:mt-6">
                                        <button
                                            type="submit"
                                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                                        >
                                            Add Member
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {selectedMember && selectedOrg && (
                <AdminChangePasswordModal
                    isOpen={isPasswordModalOpen}
                    onClose={() => setIsPasswordModalOpen(false)}
                    userId={selectedMember.userId._id}
                    orgId={selectedOrg._id}
                    userName={selectedMember.userId.fullName}
                />
            )}
        </div>
    );
};

export default Team;
