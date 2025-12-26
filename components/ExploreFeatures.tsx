import React from 'react';

const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);


const featuresData = [
  {
    title: 'Track Everything',
    description: 'Go beyond just sleep. Our intuitive interface lets you log feedings, diaper changes, milestones, and custom notes in seconds. Gain a complete picture of your baby\'s day, making it easier to spot patterns and anticipate needs.',
    benefits: [
      'One-tap logging for quick entries.',
      'Track sleep, food, diapers, health, and more.',
      'View a clear, chronological daily log.',
      'Customizable notes for important details.'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1620325867563-6946a1b9c2b9?q=80&w=800&auto=format&fit=crop',
  },
  {
    title: 'Personalized Schedules',
    description: 'Say goodbye to guesswork. Our AI-powered scheduler analyzes your baby\'s logged data and age to generate a dynamic, personalized daily schedule. It adapts as your baby grows, always suggesting age-appropriate wake windows and nap times.',
    benefits: [
        'AI-generated based on your baby\'s data.',
        'Adapts to developmental changes.',
        'Helps establish a consistent routine.',
        'Reduces guesswork and parental stress.'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1486576839936-3e28ac9a8385?q=80&w=800&auto=format&fit=crop',
  },
   {
    title: 'Soothing Sounds & Guides',
    description: 'Create the perfect sleep-inducing environment with our library of calming sounds, from white noise to gentle lullabies. Plus, access a wealth of expert-written articles and guides on everything from sleep regressions to nap transitions.',
    benefits: [
        'Library of white noise, nature sounds, and lullabies.',
        'Adjustable timers and continuous loop option.',
        'Expert articles for every stage.',
        'AI-powered article generator for specific questions.'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1619531289053-47a32d1656d2?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3',
  },
  {
    title: 'Analytics & Trends',
    description: 'Become your own baby-sleep expert. Our beautiful, easy-to-read charts visualize your baby\'s patterns over time. Understand their total sleep, number of feedings, and night wakings to make informed decisions about their routine.',
    benefits: [
        'Clear graphs for daily, weekly, and monthly trends.',
        'Identify sleep patterns and correlations.',
        'Track progress over time.',
        'Make data-driven adjustments to routines.'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1611926653458-0929221b27cf?q=80&w=800&auto=format&fit=crop',
  },
   {
    title: 'Multi-Caregiver Support',
    description: 'Keep everyone on the same page. Securely invite your partner, grandparents, or a nanny to your baby\'s profile. Everyone can log activities and see the latest updates in real-time, ensuring consistent care no matter who is on duty.',
    benefits: [
        'Real-time data syncing across all devices.',
        'Invite caregivers with a simple email.',
        'Ensure consistency in routines and care.',
        'Perfect for co-parenting and teamwork.'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3',
  },
  {
    title: 'Community & Support',
    description: 'Connect with other parents, ask questions, and share your journey in a supportive community forum. You are not alone on this journey, and finding solidarity can make all the difference during those tough nights.',
    benefits: [
      'Ask questions and get real advice.',
      'Share your experiences and wins.',
      'Find solidarity with other parents.',
      'Safe and moderated environment.'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=800&auto=format&fit=crop'
  },
];


interface ExploreFeaturesProps {
    onGetStartedClick: () => void;
}

const ExploreFeatures: React.FC<ExploreFeaturesProps> = ({ onGetStartedClick }) => {
    return (
        <div className="bg-white">
            {/* Header */}
            <header className="py-20 bg-[#F7F2FF]">
                <div className="container mx-auto px-6 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">A Smarter Way to Track Sleep</h1>
                    <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                        Baby Sleepy Tracker is more than just a logbook. It's an intelligent partner designed to give you the insights and tools you need for more peaceful nights.
                    </p>
                </div>
            </header>

            {/* Features List */}
            <main className="py-20">
                <div className="container mx-auto px-6 space-y-20">
                    {featuresData.map((feature, index) => (
                        <section key={feature.title} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div className={`order-2 lg:order-${index % 2 === 0 ? 1 : 2}`}>
                                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">{feature.title}</h2>
                                <p className="text-gray-600 mb-8">{feature.description}</p>
                                <ul className="space-y-4">
                                    {feature.benefits.map((benefit, i) => (
                                        <li key={i} className="flex items-start">
                                            <CheckIcon className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-1" />
                                            <span className="text-gray-700">{benefit}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className={`order-1 lg:order-${index % 2 === 0 ? 2 : 1}`}>
                                <img
                                    src={feature.imageUrl}
                                    alt={`Illustration for ${feature.title}`}
                                    className="rounded-2xl shadow-2xl object-cover w-full h-auto aspect-video"
                                    loading="lazy"
                                />
                            </div>
                        </section>
                    ))}
                </div>
            </main>
            
            {/* CTA Section */}
            <section className="bg-[#F7F2FF] py-20">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Ready for More Restful Nights?</h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
                        Join thousands of happy parents who are getting the sleep they deserve. Start your free journey with Baby Sleepy Tracker today.
                    </p>
                    <button
                        onClick={onGetStartedClick}
                        className="bg-yellow-400 text-white font-bold text-lg px-10 py-5 rounded-full hover:bg-yellow-500 transition-transform duration-300 transform hover:scale-105 shadow-lg"
                        aria-label="Get started with Baby Sleepy Tracker for free"
                    >
                        Get Started for Free
                    </button>
                </div>
            </section>
        </div>
    );
};

export default ExploreFeatures;
