import React, { useState } from 'react';

const LogoIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
);

const MenuIcon: React.FC<{ className: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

const CloseIcon: React.FC<{ className: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

interface HeaderProps {
    onGetStartedClick: () => void;
    onNavigate: (page: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onGetStartedClick, onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Features', action: () => onNavigate('explore') },
    { href: '#how-it-works', label: 'How It Works' },
    { href: '#testimonials', label: 'Testimonials' },
  ];
  
  const renderLink = (link: any, isMobile: boolean = false) => {
    const className = "text-gray-600 hover:text-[#A79AF3] transition-colors duration-300";
    const clickHandler = isMobile ? () => { link.action(); setIsMenuOpen(false); } : link.action;

    if(link.action) {
      return <button key={link.label} onClick={clickHandler} className={className}>{link.label}</button>
    }
    return <a key={link.href} href={link.href} className={className} onClick={isMobile ? () => setIsMenuOpen(false) : undefined}>{link.label}</a>
  }

  return (
    <header className="bg-[#F4F4F6] sticky top-0 z-40">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <button onClick={() => onNavigate('landing')} className="flex items-center space-x-3 text-left">
          <LogoIcon className="w-12 h-12 text-purple-600" />
          <div className="text-3xl font-bold">
            <span className="font-extrabold text-red-700">Baby Sleepy</span> <span className="font-extrabold text-sky-500">Tracker</span>
          </div>
        </button>
        <nav className="hidden md:flex space-x-8">
          {navLinks.map(link => renderLink(link))}
        </nav>
        <div className="flex items-center">
             <button onClick={onGetStartedClick} className="hidden md:inline-block bg-[#F4F4F6] text-gray-800 px-6 py-2 rounded-full hover:bg-gray-200 transition-colors duration-300">
                Login
            </button>
            <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <CloseIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <nav className="flex flex-col items-center space-y-4 py-4">
            {navLinks.map(link => renderLink(link, true))}
            <button onClick={() => { onGetStartedClick(); setIsMenuOpen(false); }} className="bg-[#A79AF3] text-white px-6 py-2 rounded-full hover:bg-[#8e7fde] transition-colors duration-300">
                Get Started
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;