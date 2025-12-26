import React from 'react';

const PrivacyPolicy: React.FC = () => {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-6 max-w-4xl">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-8 text-center">Privacy Policy</h1>
                <div className="prose lg:prose-lg max-w-none text-gray-600 space-y-6">
                    <p><strong>Last Updated:</strong> {new Date().toLocaleDateString()}</p>

                    <p>
                        Welcome to Baby Sleepy Tracker. Your family's privacy is a responsibility we take very seriously. This policy outlines how we handle your information to provide you with a secure and trustworthy experience.
                    </p>

                    <h2 className="text-2xl font-semibold text-gray-800">Information We Collect</h2>
                    <p>
                        To power the app's features, we collect information you provide directly. This includes your account details (name, email) and the activity logs you create for your baby (e.g., sleep durations, feeding times, diaper changes). For features like our AI-powered schedule generator, we process this data to create personalized insights. All your personal and baby activity data is stored securely. When using optional features like Multi-Caregiver Support, this data is synchronized across authorized devices to ensure consistency.
                    </p>

                    <h2 className="text-2xl font-semibold text-gray-800">How We Use Your Information</h2>
                    <p>
                        We use your data exclusively to operate and improve the app. This includes personalizing sleep schedules, visualizing trends in the analytics dashboard, and providing a seamless experience across shared accounts. We do not sell your personal data to third parties. Anonymized, aggregated data may be used for analytical purposes to enhance our service, but it will never be traceable back to you or your child.
                    </p>

                    <h2 className="text-2xl font-semibold text-gray-800">Your Control and Data Security</h2>
                    <p>
                        You have full control over the data you enter and can manage it within the app. We employ robust security measures to protect your information from unauthorized access. By using Baby Sleepy Tracker, you consent to the practices described in this policy.
                    </p>

                    <h2 className="text-2xl font-semibold text-gray-800">Contact Us</h2>
                    <p>
                        If you have questions or comments about this Privacy Policy, please contact us through the contact page.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default PrivacyPolicy;