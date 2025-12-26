import React from 'react';

const Disclaimer: React.FC = () => {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-6 max-w-4xl">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-8 text-center">Disclaimer</h1>
                <div className="prose lg:prose-lg max-w-none text-gray-600 space-y-6">
                    <p><strong>Last Updated:</strong> {new Date().toLocaleDateString()}</p>

                    <h2 className="text-2xl font-semibold text-gray-800">1. Medical Disclaimer</h2>
                    <p>
                        The Baby Sleepy Tracker application ("Service") provides information, schedules, and tracking tools related to baby sleep patterns. This content is for <strong>informational and educational purposes only</strong>.
                    </p>
                    <p>
                        <strong>We are not doctors, pediatricians, or medical professionals.</strong> The information provided by this Service is not intended to substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician, pediatrician, or other qualified health provider with any questions you may have regarding a medical condition or the health and well-being of your child.
                    </p>
                    <p>
                        Never disregard professional medical advice or delay in seeking it because of something you have read on this Service. If you think your child may have a medical emergency, call your doctor or emergency services immediately.
                    </p>

                    <h2 className="text-2xl font-semibold text-gray-800">2. No Guarantees</h2>
                    <p>
                        Every baby is unique. While our AI-powered schedules and insights are based on general pediatric sleep guidelines and the data you provide, we cannot guarantee specific results. Your baby's sleep patterns may vary due to illness, developmental leaps, or other factors.
                    </p>

                    <h2 className="text-2xl font-semibold text-gray-800">3. AI-Generated Content</h2>
                    <p>
                        Some features of this Service, such as the Sleep Scheduler and Article Generator, utilize Artificial Intelligence (AI). While we strive for accuracy, AI-generated content may occasionally be incorrect, incomplete, or biased. Please use your judgment and consult professionals when necessary.
                    </p>

                    <h2 className="text-2xl font-semibold text-gray-800">4. External Links</h2>
                    <p>
                        The Service may contain links to external websites that are not provided or maintained by or in any way affiliated with Baby Sleepy Tracker. Please note that we do not guarantee the accuracy, relevance, timeliness, or completeness of any information on these external websites.
                    </p>

                    <h2 className="text-2xl font-semibold text-gray-800">5. Contact Us</h2>
                    <p>
                        If you have any questions about this Disclaimer, please contact us via our Contact page.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Disclaimer;