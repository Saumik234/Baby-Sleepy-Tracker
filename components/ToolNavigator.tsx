import React, { useState, Suspense } from 'react';
import { BabyProfile } from '../App';
import LoadingSpinner from './LoadingSpinner';

// Lazy load components for code-splitting and better performance
const SleepTracker = React.lazy(() => import('./SleepTracker'));
const SleepScheduler = React.lazy(() => import('./SleepScheduler'));
const Analytics = React.lazy(() => import('./Analytics'));
const Sounds = React.lazy(() => import('./Sounds'));
const MultiCaregiverSupport = React.lazy(() => import('./MultiCaregiverSupport'));
const Community = React.lazy(() => import('./Community'));
const Guides = React.lazy(() => import('./Guides'));
const RealTimeAnalytics = React.lazy(() => import('./RealTimeAnalytics'));


const BackArrowIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="19" y1="12" x2="5" y2="12"></line>
        <polyline points="12 19 5 12 12 5"></polyline>
    </svg>
);

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string; iconBg: string; }> = ({ icon, title, description, iconBg }) => (
  <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-2 h-full text-left">
    <div className={`flex items-center justify-center h-16 w-16 rounded-full ${iconBg} mb-6`}>
      {icon}
    </div>
    <h3 className="text-2xl font-semibold text-gray-800 mb-3">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const allFeatures = [
  {
    id: 'tracker',
    iconBg: 'bg-teal-100',
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>,
    title: 'Track Everything',
    description: 'Easily log sleeps, feeds, diaper changes, and more with just a few taps. See all your baby\'s activities in one place.',
  },
  {
    id: 'scheduler',
    iconBg: 'bg-rose-100',
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    title: 'Personalized Schedules',
    description: 'Get smart, personalized sleep schedules based on your baby\'s unique patterns and developmental stage.',
  },
  {
    id: 'sounds',
    iconBg: 'bg-sky-100',
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 6l12-3" /></svg>,
    title: 'Baby Sleep Ringtones',
    description: 'Access specific ringtones for morning, afternoon naps, and deep night sleep to help your baby establish a routine.',
  },
  {
    id: 'realtime-analytics',
    iconBg: 'bg-cyan-100',
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
    title: 'Real-time Analytics',
    description: 'An advanced dashboard with live data, trend analysis, and in-depth sleep quality metrics.',
  },
  {
    id: 'support',
    iconBg: 'bg-lime-100',
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-lime-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
    title: 'Multi-Caregiver Support',
    description: 'Invite your partner, grandparents, or nanny to track and view your baby\'s data, keeping everyone in sync.',
  },
  {
    id: 'community',
    iconBg: 'bg-fuchsia-100',
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-fuchsia-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2V10a2 2 0 012-2h8z" /></svg>,
    title: 'Community & Support',
    description: 'Connect with other parents, ask questions, and share your journey in a supportive community forum.',
  },
];

const orderedFeatureIds = [
    'tracker', 
    'scheduler', 
    'sounds',
    'realtime-analytics', 
    'support', 
    'community'
];

const features = orderedFeatureIds.map(id => allFeatures.find(f => f.id === id)).filter((f): f is typeof allFeatures[0] => !!f);


interface ToolNavigatorProps {
    activeProfile: BabyProfile;
}


const ToolNavigator: React.FC<ToolNavigatorProps> = ({ activeProfile }) => {
    const [activeTool, setActiveTool] = useState<string | null>(null);

    const getToolComponent = () => {
        const handleBack = () => setActiveTool(null);

        switch(activeTool) {
            case 'tracker': return <SleepTracker />;
            case 'scheduler': return <SleepScheduler onBack={handleBack} activeProfile={activeProfile} />;
            case 'analytics': return <Analytics />;
            case 'realtime-analytics': return <RealTimeAnalytics />;
            case 'sounds': return <Sounds onBack={handleBack} />;
            case 'guides': return <Guides onBack={handleBack} />;
            case 'support': return <MultiCaregiverSupport onBack={handleBack} />;
            case 'community': return <Community onBack={handleBack} />;
            default: return null;
        }
    };
    
    const activeToolTitle = allFeatures.find(f => f.id === activeTool)?.title;

    if (activeTool) {
        return (
            <div>
                 <div className="flex items-center mb-6">
                    <button onClick={() => setActiveTool(null)} className="mr-4 p-2 rounded-full hover:bg-gray-200 transition-colors" aria-label="Go back">
                        <BackArrowIcon className="w-6 h-6 text-gray-700" />
                    </button>
                    <h1 className="text-2xl font-bold text-gray-800">{activeToolTitle}</h1>
                </div>
                <Suspense fallback={<LoadingSpinner message="Loading Tool..." />}>
                    {getToolComponent()}
                </Suspense>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <div className="text-center max-w-3xl mx-auto mb-10">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Welcome, {activeProfile.name}'s Family!</h1>
                <p className="text-lg text-gray-600">Select a tool below to get started.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {features.map((feature) => (
                <button key={feature.id} onClick={() => setActiveTool(feature.id)} className="text-left h-full">
                  <FeatureCard icon={feature.icon} title={feature.title} description={feature.description} iconBg={feature.iconBg} />
                </button>
              ))}
            </div>
        </div>
    );
};

export default ToolNavigator;