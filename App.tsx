import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import Auth from './components/Auth';
import ToolNavigator from './components/ToolNavigator';
import About from './components/About';
import Blog from './components/Blog';
import Contact from './components/Contact';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import Disclaimer from './components/Disclaimer';
import ExploreFeatures from './components/ExploreFeatures';
import Meta from './components/Meta';


export interface BabyProfile {
    id: string;
    name: string;
    birthDate: string;
    photoUrl: string;
}

// A single, static profile for the simplified app experience.
const singleProfile: BabyProfile = {
    id: 'default_profile',
    name: 'Baby',
    // Default to 4 months old for realistic schedule generation
    birthDate: new Date(new Date().setMonth(new Date().getMonth() - 4)).toISOString().split('T')[0], 
    photoUrl: 'https://images.unsplash.com/photo-1566004100631-35d015d6a491?q=80&w=100&h=100&auto=format&fit=crop'
};


// Icons for the authenticated view header
const LogoIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
);

const LogoutIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
        <polyline points="16 17 21 12 16 7"></polyline>
        <line x1="21" y1="12" x2="9" y2="12"></line>
    </svg>
);

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentPage, setCurrentPage] = useState('landing');

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage('landing'); // Reset to landing page on logout
  };
  
  const handleNavigation = (page: string) => {
    setCurrentPage(page);
    window.scrollTo(0, 0); // Scroll to top on page change
  };

  const openAuthModal = () => setShowAuthModal(true);
  const closeAuthModal = () => setShowAuthModal(false);

  // --- SEO Schemas ---
  const landingSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Baby Sleepy Tracker",
    "applicationCategory": "HealthApplication",
    "operatingSystem": "Web Browser",
    "description": "The ultimate Baby Sleepy Tracker app to help you log activities, get personalized schedules, and understand your baby's sleep patterns.",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "10000"
    }
  };

  const aboutSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Baby Sleepy Tracker",
    "url": "https://babysleepytracker.com",
    "logo": "https://babysleepytracker.com/logo.png",
    "sameAs": [
        "https://www.facebook.com/babysleepytracker",
        "https://twitter.com/babysleepytrack"
    ]
  };

  if (isAuthenticated) {
    return (
        <div className="min-h-screen bg-[#E6F7F5] flex flex-col text-gray-800">
            <Meta 
                title="Dashboard" 
                description="Your personalized dashboard for tracking baby sleep, schedules, and analytics." 
                canonical="/dashboard"
            />
            <header className="bg-white shadow-sm sticky top-0 z-20 flex-shrink-0">
              <div className="container mx-auto px-6 h-16 flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <LogoIcon className="w-12 h-12 text-purple-600" />
                  <span className="text-3xl font-bold">
                    <span className="font-extrabold text-red-700">Baby Sleepy</span> <span className="font-extrabold text-sky-500">Tracker</span>
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                    <button 
                        onClick={handleLogout} 
                        className="flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors duration-200"
                        aria-label="Logout"
                    >
                        <LogoutIcon className="w-6 h-6" />
                        <span className="font-medium hidden sm:inline">Logout</span>
                    </button>
                </div>
              </div>
            </header>
            <main className="flex-1 overflow-y-auto container mx-auto px-6 py-8">
              <ToolNavigator 
                activeProfile={singleProfile}
              />
            </main>
        </div>
    );
  }

  const renderPageContent = () => {
    switch (currentPage) {
        case 'about': return <><Meta title="About Us" description="Learn about the mission and story behind Baby Sleepy Tracker." schema={aboutSchema} canonical="/about" /><About /></>;
        case 'blog': return <><Meta title="Blog" description="Expert articles and tips on baby sleep science and parenting." canonical="/blog" /><Blog /></>;
        case 'contact': return <><Meta title="Contact Us" description="Get in touch with the Baby Sleepy Tracker support team." canonical="/contact" /><Contact /></>;
        case 'privacy': return <><Meta title="Privacy Policy" description="Read our commitment to protecting your family's data." canonical="/privacy-policy" /><PrivacyPolicy /></>;
        case 'terms': return <><Meta title="Terms of Service" description="Understand the terms and conditions for using our app." canonical="/terms-of-service" /><TermsOfService /></>;
        case 'disclaimer': return <><Meta title="Disclaimer" description="Medical and legal disclaimers for Baby Sleepy Tracker usage." canonical="/disclaimer" /><Disclaimer /></>;
        case 'explore': return <><Meta title="Explore Features" description="Discover all the tools Baby Sleepy Tracker offers, from AI schedules to analytics." canonical="/features" /><ExploreFeatures onGetStartedClick={openAuthModal} /></>;
        case 'landing':
        default: return (
            <>
                <Meta schema={landingSchema} canonical="/" />
                <Hero onStartTrackingClick={openAuthModal} onNavigate={handleNavigation} />
                <Features />
                <HowItWorks />
                <Testimonials />
            </>
        );
    }
  };


  // By default, show the landing page content and handle the login flow.
  return (
    <div className="bg-[#F4F4F6] text-gray-800 min-h-screen flex flex-col">
      <Header onGetStartedClick={openAuthModal} onNavigate={handleNavigation} />
      <main className="flex-grow">
        {renderPageContent()}
      </main>
      <Footer onNavigate={handleNavigation} />
      {showAuthModal && <Auth onClose={closeAuthModal} onLoginSuccess={handleLoginSuccess} />}
    </div>
  );
};

export default App;