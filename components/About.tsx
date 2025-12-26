import React from 'react';

const About: React.FC = () => {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-6 max-w-4xl">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-8 text-center">About Baby Sleepy Tracker</h1>
                <div className="prose lg:prose-lg max-w-none text-gray-600 space-y-6">
                   <p>
                        Baby Sleepy Tracker was born from our own late nights and early mornings as parents. We know the feeling of desperately wanting to understand your baby’s needs and the overwhelming exhaustion that comes with it. That's why our team of parents, pediatric sleep consultants, and tech experts created this app.
                    </p>
                    <p>
                        Our mission is simple: to transform confusion into confidence. We believe that by combining intuitive, easy-to-use tracking tools with smart, data-driven insights, we can empower you to create healthier sleep habits for your little one. We're not about rigid rules; we're about providing gentle, responsive guidance that honors the unique journey of every family.
                    </p>
                    <p>
                        We're here to help you navigate the challenges, celebrate the small victories, and find more rest along the way. Welcome to the family.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default About;