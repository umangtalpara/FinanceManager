import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';

const DashboardLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [orgs, setOrgs] = useState([]);
    const [selectedOrg, setSelectedOrg] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchOrgs();
    }, [user, navigate]);

    const fetchOrgs = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }
            const res = await axios.get('http://localhost:5000/api/orgs', {
                headers: { 'x-auth-token': token }
            });
            setOrgs(res.data);
            if (res.data.length > 0) {
                setSelectedOrg(res.data[0]);
            }
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
            if (err.response && err.response.status === 401) {
                handleLogout();
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

    return (
        <Layout
            user={user}
            orgs={orgs}
            selectedOrg={selectedOrg}
            setSelectedOrg={setSelectedOrg}
            handleLogout={handleLogout}
        >
            <Outlet context={{ selectedOrg, user, orgs }} />
        </Layout>
    );
};

export default DashboardLayout;
