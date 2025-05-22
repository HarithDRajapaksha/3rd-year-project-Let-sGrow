import React, {useState} from 'react';
import './landingPage.css'
import { useNavigate } from 'react-router-dom';
import OurTeam from '../../Components/OurTeam/OurTeam';
import RatingPage from '../RatingPage/RatingPage';
import logo from '../../assets/logo.jpeg';

export default function Landingpage() {

    const [darkMode, setDarkMode] = useState(false);

    const navigate = useNavigate();

    const HandleJoinNow = () =>
        {
            navigate('/register');
        }

    const HandleLogin = () =>
        {
            navigate('/login');
        }

  return (
    <div className={`LandingPageContent ${darkMode ? 'dark-mode' : ''}`}>
    {/* header section */}
      <div id="LandingPageheaderpart">
        <div id="LandingPageheaderpart1">
            <div id="LandingPageheaderpart1a">
                <img src={logo} alt="logo" />
            </div>
            <div id="LandingPageheaderpart2">
                <button id="LangingpageLoginButton" onClick={HandleLogin}>LOGIN</button>
                <button id="LangingpageSignupButton" onClick={HandleJoinNow}>SIGNUP</button>
            </div>
        </div>
      </div>

    {/* header section */}
      <div id="bodypart">
        <div id="bodypart1">
            <div id="bodypart1a">
                <h2>WELCOME TO</h2>
                <h1>LET'S GROW</h1>
                <p><b id='topic'>About Us /</b> Where startups and investors meet to create the future. Our platform is designed to bridge the gap between innovative ideas and the funding needed to bring them to life. Whether you're a startup seeking investment or an investor looking for your next big opportunity, Innovate Connect offers the tools to connect, collaborate, and succeed. Join us and start building meaningful partnerships today!</p>
                <button id="LangingpageJoinNowButton" onClick={HandleJoinNow}>Join Now</button>
            </div>
            <div id="bodypart1b">
                <img src="02.jpeg" alt="LandingPagebodyImage" />
            </div>
        </div>
      </div>

    {/* About Us Section */}
        <div id="LandingPageaboutuspart">
            <div id="aboutuspart">
                <div id="LandingPageaboutuspart1">
                    <h2 className='aboutusTitle'>WHY CHOOSE US ?</h2>
                </div>
                <div id='LandingPageaboutuspartDetails'>
                    <div id="LandingPageaboutuspartDetails1">
                        <h3>Easy to Use</h3>
                        <p>Our platform is designed to be user-friendly and intuitive, making it easy for startups and investors to connect and collaborate.</p>
                    </div>
                    <div id="LandingPageaboutuspartDetails2">
                        <h3>Secure</h3>
                        <p>We take security seriously and use the latest technology to protect your data.</p>
                    </div>
                    <div id="LandingPageaboutuspartDetails3">
                        <h3>Global Reach</h3>
                        <p>Our platform connects startups and investors from around the world, giving you access to a diverse range of opportunities.</p>
                    </div>
                </div>
                <img id='aboutuspartimage' src="04.png" alt="aboutusPagebodyImage" />
            </div>
        </div>

    {/* Our Team Section */}
    <div>
        <OurTeam/>
    </div>

    {/* Rate for us */}
    <div id='landing-page-rating'>
        <RatingPage/>
    </div>

    {/* footer section */}
      <div id="footerpart">
        <div id="footerpartsection1">
            <div id="footerpartilogoimage">
                <img src="logo2.jpeg" alt="LandingPagecompanyLogo" />
            </div>
            <div id="socialMediaIcons">
                <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                    <img src="facebook-new.png" alt="Facebook" />
                </a>
                <a href="https://www.whatsapp.com" target="_blank" rel="noopener noreferrer">
                    <img src="facebook-new.png" alt="WhatsApp" />
                </a>
                <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer">
                    <img src="facebook-new.png" alt="YouTube" />
                </a>
                <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
                    <img src="facebook-new.png" alt="LinkedIn" />
                </a>
                <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                    <img src="facebook-new.png" alt="Instagram" />
                </a>
            </div>
        </div>
        <div id="footerpartsection2">
            <h3>PRODUCTS</h3>
            <p>Why Choose Us</p>
            <p>Our Team Member</p>
            <p>Blogs</p>
        </div>
        <div id="footerpartsection3">
            <h3>COMPANY</h3>
            <p>Terms of Service</p>
            <p>Privacy Policy</p>
            <p>Contact Us</p>
        </div>
        <div id="footerpartsection4">
            <h3>CONTACTS</h3>
            <p>+947123456789</p>
            <p>Let's@Grow.com</p>
            <p>Colombo, Sri Lanka</p>
        </div>
      </div>
    </div>
  )
}


