import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landingpage from './Pages/LandingPage/LandingPage';
import OurTeam from './Components/OurTeam/OurTeam';
import RatingPage from './Pages/RatingPage/RatingPage';
import RegistrationPage from './Pages/RegistrationPage/RegistrationPage';
import LoginPage from './Pages/LoginPage/LoginPage';
import ForgotPassword from './Pages/LoginPage/ForgotPassword';
import ChangePassword from './Pages/LoginPage/ChangePassword';
import OTPVerification from './Pages/LoginPage/OTPVerification';
import InvestorDashboard from './Pages/Dashboards/InvestorDashboard/InvestorDashboard';
import StartupDashboard from './Pages/Dashboards/StartupDashboard/StartupDashboard';
import StartupProfile from './Pages/UserProfilePage/StartupProfile/StartupProfile';
import ProfileSettings from './Pages/UserProfilePage/ProfileSettings/ProfileSettings';
import CreateNewGig from './Pages/UserProfilePage/StartupProfile/CreateNewGig/CreateNewGig';
import GigView from './Pages/GigView/GigView';
import Blogs from './Pages/Blogs/Blogs';
import InvestorProfile from './Pages/UserProfilePage/InvestorProfile/InvestorProfile';

function App() {
  return (
    <React.StrictMode>
      <div>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landingpage/>} />
            <Route path="/our-team" element={<OurTeam/>} />
            <Route path="/rating" element={<RatingPage/>} />
            <Route path="/register" element={<RegistrationPage/>} />
            <Route path="/login" element={<LoginPage/>} />
            <Route path="/forgot-password" element={<ForgotPassword/>} />
            <Route path="/change-password" element={<ChangePassword/>} />
            <Route path="/otp-verification" element={<OTPVerification/>} />
            <Route path="/investor-dashbord" element={<InvestorDashboard/>}/>
            <Route path="/investor-profile/:id" element={<InvestorProfile />} />
            <Route path="/startup-dashboard" element={<StartupDashboard/>}/>
            <Route path="/startup-profile/:id" element={<StartupProfile />} />
            <Route path="/profile-settings" element={<ProfileSettings/>} />
            <Route path="/create-new-gig" element={<CreateNewGig/>} />
            <Route path="/gig-view/:id" element={<GigView/>} />
            <Route path="/blog-page" element={<Blogs/>} />
          </Routes>
        </BrowserRouter>
      </div>
    </React.StrictMode>
  );
}

export default App;