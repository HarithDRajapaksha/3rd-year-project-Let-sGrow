import { User, LayoutDashboard, FileText, Settings, LogOut, HomeIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './navigationBar.css';
import logo from '../../assets/logo.jpeg';

export default function NavigationBar({ profileOwner }) { // Accept profileOwner as a prop
    const navigate = useNavigate();

    const handleProfileClick = () => {
        if (profileOwner && profileOwner.role && profileOwner.id) {
            const roleRoutes = {
                startup: `/startup-profile/${profileOwner.id}`,
                investor: `/investor-profile/${profileOwner.id}`,
            };
    
            const route = roleRoutes[profileOwner.role.toLowerCase()];
            if (route) {
                navigate(route);
            } else {
                console.error('Unknown role:', profileOwner.role);
            }
        } else {
            console.error('Profile owner information is missing or incomplete.');
        }
    };
    const handleDashboardClick = () => {
        if (profileOwner && profileOwner.role) {
            const roleRoutes = {
                startup: '/startup-dashboard',
                investor: '/investor-dashbord',
            };
    
            const route = roleRoutes[profileOwner.role.toLowerCase()];
            if (route) {
                navigate(route);
            } else {
                console.error('Unknown role:', profileOwner.role);
            }
        } else {
            console.error('Profile owner information is missing or incomplete.');
        }
    };
    
    const handleBlogsClick = () => navigate('/blog-page');
    const handleHomeClick = () => navigate('/');
    const handleSettingsClick = () => navigate('/profile-settings');
    const handleLogoutClick = () => {
        if (window.confirm('Are you sure you want to log out?')) {
            // Clear authentication data
            localStorage.removeItem('authToken');
            sessionStorage.clear();
    
            // Redirect to the home page and replace history
            navigate('/', { replace: true });
        }
    };

    return (
        <div className="nav-content">
            <div className="nav-dashboard-left-section">
                <div className="nav-dashboard-left-section-logo-name">
                    <img src={logo} alt="logo" />
                    <h1>
                        {profileOwner && profileOwner.first_name
                            ? `Hello ${profileOwner.first_name.toUpperCase()}`
                            : 'Hello'}
                    </h1>
                </div>
                <div className="nav-dashboard-left-navigation">
                    <div className="nav-dashboard-left-top-section-profile">
                        <div className="nav-left-icon" onClick={handleProfileClick}>
                            <User size={30} />
                            <h3>Profile</h3>
                        </div>
                        <div className="nav-left-icon" onClick={handleDashboardClick}>
                            <LayoutDashboard size={30} />
                            <h3>Dashboard</h3>
                        </div>
                        <div className="nav-left-icon" onClick={handleBlogsClick}>
                            <FileText size={30} />
                            <h3>Blogs</h3>
                        </div>
                        <div className="nav-left-icon" onClick={handleHomeClick}>
                            <HomeIcon size={30} />
                            <h3>Home</h3>
                        </div>
                    </div>
                    <div className="nav-dashboard-left-bottom-section-profile">
                        <div className="nav-left-icon" onClick={handleSettingsClick}>
                            <Settings size={30} />
                            <h3>Settings</h3>
                        </div>
                        <div className="nav-left-icon" onClick={handleLogoutClick}>
                            <LogOut size={30} />
                            <h3>Log Out</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}