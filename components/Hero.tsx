import React from 'react';

interface HeroProps {
    onStartTrackingClick: () => void;
    onNavigate: (page: string) => void;
}

const Hero: React.FC<HeroProps> = ({ onStartTrackingClick, onNavigate }) => {
  return (
    <section className="py-20 md:py-24 bg-[#F4F4F6]">
      <div className="container mx-auto px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6 leading-tight">
            The Ultimate Baby Sleep Tracker for Peaceful Nights
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-12">
            Baby Sleepy Tracker helps you understand your baby's sleep, so you can both get the rest you deserve.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button onClick={onStartTrackingClick} className="w-full sm:w-auto bg-yellow-400 text-white font-bold text-lg px-10 py-5 rounded-full hover:bg-yellow-500 transition-transform duration-300 transform hover:scale-105 shadow-lg" aria-label="Start tracking your baby's sleep for free">
              Start Tracking
            </button>
            <button onClick={() => onNavigate('explore')} className="w-full sm:w-auto bg-transparent border-2 border-[#CAC5F3] text-gray-800 font-semibold px-8 py-4 rounded-full hover:bg-[#CAC5F3] hover:text-white transition-all duration-300 shadow-lg" aria-label="Explore the features of Baby Sleepy Tracker">
              Explore Features
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;