import React from 'react';

const TermsOfService: React.FC = () => {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-6 max-w-4xl">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-8 text-center">Terms of Service</h1>
                <div className="prose lg:prose-lg max-w-none text-gray-600 space-y-6">
                    <p><strong>Last Updated:</strong> {new Date().toLocaleDateString()}</p>

                    <p>
                        By creating an account and using the Baby Sleepy Tracker application ("Service"), you agree to these Terms of Service. Please read them carefully.
                    </p>

                    <h2 className="text-2xl font-semibold text-gray-800">Service Is for Informational Purposes Only</h2>
                    <p>
                        Baby Sleepy Tracker offers personalized suggestions, data tracking, and general information about baby sleep. This information is designed for educational purposes and is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified health provider or pediatrician with any questions regarding your child’s health and well-being. Never disregard professional medical advice because of something you have read in this application.
                    </p>

                    <h2 className="text-2xl font-semibold text-gray-800">Account Responsibility</h2>
                    <p>
                        You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.
                    </p>

                    <h2 className="text-2xl font-semibold text-gray-800">Changes and Termination</h2>
                    <p>
                        We reserve the right to modify these terms at any time. We may also suspend or terminate your account if you violate these terms. Your continued use of the Service after changes constitutes your acceptance of the new terms.
                    </p>
                    
                    <h2 className="text-2xl font-semibold text-gray-800">Contact Us</h2>
                    <p>
                        If you have any questions about these Terms, please contact us.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default TermsOfService;