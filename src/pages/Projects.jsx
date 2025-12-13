import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import api from '../api/axiosInstance';
import { useToast } from '../context/ToastContext';
import { Folder, Plus, X, Edit2 } from 'lucide-react';

const Projects = () => {
    const navigate = useNavigate();
    const { selectedOrg } = useOutletContext();
    const { showToast } = useToast();
    const [projects, setProjects] = useState([]);
    // loading managed globally
    const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentProjectId, setCurrentProjectId] = useState(null);
    const [orgMembers, setOrgMembers] = useState([]);
    const [newProjectData, setNewProjectData] = useState({
        name: '',
        totalBudget: '',
        approvalRequired: false,
        projectLeadId: ''
    });

    useEffect(() => {
        if (selectedOrg) {
            fetchProjects(selectedOrg._id);
            fetchOrgMembers(selectedOrg._id);
        }
    }, [selectedOrg]);

    const fetchOrgMembers = async (orgId) => {
        try {
            const token = localStorage.getItem('token');
            const res = await api.get(`/api/orgs/${orgId}/members`, {
                headers: { 'x-auth-token': token }
            });
            setOrgMembers(res.data);
        } catch (err) {
            console.error('Failed to fetch members', err);
        }
    };

    const fetchProjects = async (orgId) => {
        try {
            const token = localStorage.getItem('token');
            const res = await api.get(`/api/projects?orgId=${orgId}`, {
                headers: { 'x-auth-token': token }
            });
            setProjects(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddProject = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (isEditing) {
                await api.put(`/api/projects/${currentProjectId}`, {
                    ...newProjectData
                }, {
                    headers: { 'x-auth-token': token }
                });
                showToast('Project updated successfully!', 'success');
            } else {
                await api.post('/api/projects', {
                    ...newProjectData,
                    orgId: selectedOrg._id
                }, {
                    headers: { 'x-auth-token': token }
                });
                showToast('Project created successfully!', 'success');
            }

            closeModal();
            fetchProjects(selectedOrg._id);
        } catch (err) {
            console.error(err);
            // Error toast handled by interceptor
        }
    };

    const openEditModal = (e, project) => {
        e.stopPropagation();
        setIsEditing(true);
        setCurrentProjectId(project._id);
        setNewProjectData({
            name: project.name,
            totalBudget: project.totalBudget,
            approvalRequired: project.approvalRequired,
            projectLeadId: project.projectLeadId?._id || ''
        });
        setIsAddProjectModalOpen(true);
    };

    const closeModal = () => {
        setIsAddProjectModalOpen(false);
        setIsEditing(false);
        setCurrentProjectId(null);
        setNewProjectData({
            name: '',
            totalBudget: '',
            approvalRequired: false,
            projectLeadId: ''
        });
    };



    // if (loading) return <div className="text-center py-10">Loading projects...</div>;

    return (
        <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                        Projects
                    </h2>
                    <p className="mt-1 text-xs sm:text-sm text-gray-500">Manage your organization's projects and budgets.</p>
                </div>
                <button
                    type="button"
                    onClick={() => setIsAddProjectModalOpen(true)}
                    className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 border border-transparent rounded-full shadow-md text-xs sm:text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:scale-105 whitespace-nowrap"
                >
                    <Plus className="-ml-1 mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                    <span className="hidden sm:inline">New Project</span>
                    <span className="sm:hidden">New</span>
                </button>
            </div>

            {/* Add Project Modal */}
            {isAddProjectModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={closeModal}>
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full relative z-10">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">{isEditing ? 'Edit Project' : 'Create New Project'}</h3>
                                    <button onClick={closeModal} className="text-gray-400 hover:text-gray-500">
                                        <X className="h-6 w-6" />
                                    </button>
                                </div>
                                <form onSubmit={handleAddProject}>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Project Name</label>
                                            <input
                                                type="text"
                                                required
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                value={newProjectData.name}
                                                onChange={e => setNewProjectData({ ...newProjectData, name: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Total Budget</label>
                                            <div className="mt-1 relative rounded-md shadow-sm">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <span className="text-gray-500 sm:text-sm">$</span>
                                                </div>
                                                <input
                                                    type="number"
                                                    required
                                                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md py-2"
                                                    placeholder="0.00"
                                                    value={newProjectData.totalBudget}
                                                    onChange={e => setNewProjectData({ ...newProjectData, totalBudget: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Project Lead</label>
                                            <select
                                                required
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                value={newProjectData.projectLeadId}
                                                onChange={e => setNewProjectData({ ...newProjectData, projectLeadId: e.target.value })}
                                            >
                                                <option value="">Select a lead</option>
                                                {orgMembers.map(member => (
                                                    <option key={member._id} value={member._id}>
                                                        {member.userId.fullName} ({member.role})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="flex items-center">
                                            <input
                                                id="approval-required"
                                                type="checkbox"
                                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                                checked={newProjectData.approvalRequired}
                                                onChange={e => setNewProjectData({ ...newProjectData, approvalRequired: e.target.checked })}
                                            />
                                            <label htmlFor="approval-required" className="ml-2 block text-sm text-gray-900">
                                                Approval required for expenses
                                            </label>
                                        </div>
                                    </div>
                                    <div className="mt-5 sm:mt-6">
                                        <button
                                            type="submit"
                                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                                        >
                                            {isEditing ? 'Save Changes' : 'Create Project'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:gap-8 sm:grid-cols-2 lg:grid-cols-3 mb-12 sm:mb-16">
                {projects.map((project) => (
                    <div
                        key={project._id}
                        onClick={() => navigate(`/project/${project._id}`)}
                        className="group bg-white overflow-hidden shadow-lg rounded-2xl hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-100 transform hover:-translate-y-1"
                    >
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-indigo-50 rounded-xl group-hover:bg-indigo-100 transition-colors duration-200">
                                    <Folder className="h-8 w-8 text-indigo-600" />
                                </div>
                                <span className="px-3 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full">Active</span>
                            </div>
                            <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <button
                                    onClick={(e) => openEditModal(e, project)}
                                    className="p-2 bg-gray-100 rounded-full hover:bg-indigo-100 hover:text-indigo-600 transition-colors"
                                >
                                    <Edit2 className="h-4 w-4" />
                                </button>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors duration-200">
                                {project.name}
                            </h3>
                            <div className="mt-4">
                                <div className="flex justify-between text-sm font-medium text-gray-500 mb-1">
                                    <span>Budget Used</span>
                                    <span>{Math.round((project.currentSpend / project.totalBudget) * 100)}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                                    <div
                                        className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500"
                                        style={{ width: `${Math.min((project.currentSpend / project.totalBudget) * 100, 100)}%` }}
                                    ></div>
                                </div>
                                <div className="flex justify-between mt-2 text-sm">
                                    <span className="font-semibold text-gray-900">${project.currentSpend.toLocaleString()}</span>
                                    <span className="text-gray-500">of ${project.totalBudget.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-between items-center">
                            <span className="text-sm text-gray-500">Last updated 2h ago</span>
                            <span className="text-sm font-medium text-indigo-600 group-hover:translate-x-1 transition-transform duration-200">View Details &rarr;</span>
                        </div>
                    </div>
                ))}
                {projects.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-300">
                        <div className="p-4 bg-gray-50 rounded-full mb-4">
                            <Folder className="h-10 w-10 text-gray-400" />
                        </div>
                        <h3 className="mt-2 text-lg font-medium text-gray-900">No projects found</h3>
                        <p className="mt-1 text-sm text-gray-500">Get started by creating a new project for your organization.</p>
                        <button
                            onClick={() => setIsAddProjectModalOpen(true)}
                            className="mt-6 text-indigo-600 font-medium hover:text-indigo-500"
                        >
                            Create your first project
                        </button>
                    </div>
                )}
            </div>
        </div >
    );
};

export default Projects;
