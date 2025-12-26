import React from 'react';

const Step: React.FC<{ number: string; title: string; description: string }> = ({ number, title, description }) => (
  <div className="flex items-start space-x-6">
    <div className="flex-shrink-0 flex items-center justify-center w-16 h-16 rounded-full bg-[#FFB3C1] text-gray-800 text-3xl font-bold">
      {number}
    </div>
    <div>
      <h3 className="text-2xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  </div>
);

const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-20 bg-[#FFFBF5]">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Get started in 3 simple steps.</h2>
          <p className="text-lg text-gray-600">Start your journey to more restful nights today.</p>
        </div>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-1 gap-12">
            <Step 
                number="1"
                title="Track with a Tap"
                description="Effortlessly log your baby's sleep, feeding sessions, and diaper changes. Our intuitive interface makes it quick and easy, even when you're sleep-deprived."
            />
             <Step 
                number="2"
                title="Get Smart Insights"
                description="Our app analyzes the data to reveal patterns and provides personalized tips and sleep schedules. Understand your baby's needs like never before."
            />
             <Step 
                number="3"
                title="Improve & Rest"
                description="Use the insights and tools to build a consistent routine. Enjoy longer sleep stretches for your baby and more rest for you."
            />
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
