import React from 'react';

const MoonIcon: React.FC<{ className: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
  </svg>
);

interface FooterProps {
    onNavigate: (page: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#F7F2FF] text-gray-600">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
             <div className="flex items-center space-x-2 mb-4">
                <MoonIcon className="w-10 h-10 text-purple-600" />
                 <button onClick={() => onNavigate('landing')} className="text-3xl font-bold text-left">
                    <span className="font-extrabold text-red-700">Baby Sleepy</span> <span className="font-extrabold text-sky-500">Tracker</span>
                </button>
            </div>
            <p className="text-sm">Helping families find their sleep, one night at a time.</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-4">Company</h4>
            <ul>
              <li className="mb-2"><button onClick={() => onNavigate('about')} className="hover:text-[#A18AFF]">About Us</button></li>
              <li className="mb-2"><button onClick={() => onNavigate('blog')} className="hover:text-[#A18AFF]">Blog</button></li>
              <li className="mb-2"><button onClick={() => onNavigate('contact')} className="hover:text-[#A18AFF]">Contact</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-4">Legal</h4>
            <ul>
              <li className="mb-2"><button onClick={() => onNavigate('privacy')} className="hover:text-[#A18AFF]">Privacy Policy</button></li>
              <li className="mb-2"><button onClick={() => onNavigate('terms')} className="hover:text-[#A18AFF]">Terms of Service</button></li>
              <li className="mb-2"><button onClick={() => onNavigate('disclaimer')} className="hover:text-[#A18AFF]">Disclaimer</button></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-300 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
          <p>&copy; {new Date().getFullYear()} Baby Sleepy Tracker. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            {/* Add social icons here if needed */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;