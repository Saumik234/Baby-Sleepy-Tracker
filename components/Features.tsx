import React from 'react';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  colorClass: string;
  bgClass: string;
  hoverClass: string;
}

const FeatureCard: React.FC<Feature> = ({ icon, title, description, colorClass, bgClass, hoverClass }) => (
  <article className={`bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent ${hoverClass} group h-full`}>
    <div className={`flex items-center justify-center h-16 w-16 rounded-full ${bgClass} mb-6 transition-transform duration-300 group-hover:scale-110`}>
      <div className={colorClass}>
        {icon}
      </div>
    </div>
    <h3 className="text-2xl font-semibold text-gray-800 mb-3 group-hover:text-gray-900">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </article>
);

const features: Feature[] = [
  {
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>,
    title: 'Track Everything',
    description: 'Easily log sleeps, feeds, diaper changes, and more with just a few taps. See all your baby\'s activities in one place.',
    colorClass: 'text-blue-600',
    bgClass: 'bg-blue-100',
    hoverClass: 'hover:border-blue-200'
  },
  {
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    title: 'Personalized Schedules',
    description: 'Get smart, personalized sleep schedules based on your baby\'s unique patterns and developmental stage.',
    colorClass: 'text-amber-500',
    bgClass: 'bg-amber-100',
    hoverClass: 'hover:border-amber-200'
  },
  {
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 6l12-3" /></svg>,
    title: 'Sounds & Guides',
    description: 'Access a library of soothing sounds, white noise, and expert-written guides to help your baby fall asleep faster.',
    colorClass: 'text-emerald-500',
    bgClass: 'bg-emerald-100',
    hoverClass: 'hover:border-emerald-200'
  },
  {
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
    title: 'Multi-Caregiver Support',
    description: 'Invite your partner, grandparents, or nanny to track and view your baby\'s data, keeping everyone in sync.',
    colorClass: 'text-rose-500',
    bgClass: 'bg-rose-100',
    hoverClass: 'hover:border-rose-200'
  },
  {
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
    title: 'Analytics',
    description: 'Visualize your baby\'s sleep trends with beautiful charts and gain insights to improve their sleep patterns over time.',
    colorClass: 'text-violet-500',
    bgClass: 'bg-violet-100',
    hoverClass: 'hover:border-violet-200'
  },
];


const Features: React.FC = () => {
  return (
    <section id="features" className="py-20 bg-[#F7F2FF]">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Everything you need for better sleep.</h2>
          <p className="text-lg text-gray-600">Our features are designed with new parents in mind, making sleep tracking simple, intuitive, and effective.</p>
        </div>
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {features.map((feature, index) => (
            <li key={index}>
                <FeatureCard {...feature} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Features;