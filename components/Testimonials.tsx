import React from 'react';

interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  avatarUrl: string;
}

const Star: React.FC<{ filled: boolean; half?: boolean }> = ({ filled, half }) => (
    <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
        <path
            fillRule="evenodd"
            d={
                half
                    ? "M10 12.585l-4.243 2.53.998-4.88L3.5 7.46l4.928-.428L10 2.5l1.572 4.532L16.5 7.46l-3.255 2.775.998 4.88L10 12.585zM10 15.32l-5.236 3.12 1.23-6.008L.5 8.01l6.058-.528L10 .5l3.442 7.002 6.058.528-5.494 4.424 1.23 6.008L10 15.32z"
                    : "M10 15.32l-5.236 3.12 1.23-6.008L.5 8.01l6.058-.528L10 .5l3.442 7.002 6.058.528-5.494 4.424 1.23 6.008L10 15.32z"
            }
            clipRule="evenodd"
            style={{
                clipPath: half ? 'inset(0 50% 0 0)' : 'none',
            }}
        />
        {half && ( // Render the outline for the other half
             <path
                fillRule="evenodd"
                d="M10 15.32l-5.236 3.12 1.23-6.008L.5 8.01l6.058-.528L10 .5l3.442 7.002 6.058.528-5.494 4.424 1.23 6.008L10 15.32z"
                clipRule="evenodd"
                className="text-gray-300"
                fill="currentColor"
                style={{
                    clipPath: 'inset(0 0 0 50%)',
                }}
            />
        )}
    </svg>
);


const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars.push(<Star key={i} filled={true} />);
        } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
            stars.push(<Star key={i} filled={true} half={true} />);
        } else {
            stars.push(<svg key={i} className="w-6 h-6 text-gray-300" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 15.32l-5.236 3.12 1.23-6.008L.5 8.01l6.058-.528L10 .5l3.442 7.002 6.058.528-5.494 4.424 1.23 6.008L10 15.32z"/></svg>);
        }
    }
    return <div className="flex items-center" role="img" aria-label={`Rating: ${rating} out of 5 stars`}>{stars}</div>;
};


const TestimonialCard: React.FC<TestimonialCardProps> = ({ quote, author, role, avatarUrl }) => (
  <div className="bg-white p-8 rounded-2xl shadow-lg flex flex-col h-full">
    <blockquote className="text-gray-600 italic mb-6 flex-grow">"{quote}"</blockquote>
    <div className="flex items-center">
      <img src={avatarUrl} alt={`Avatar of ${author}`} className="w-12 h-12 rounded-full mr-4 object-cover" loading="lazy" />
      <div>
        <p className="font-semibold text-gray-800">{author}</p>
        <cite className="text-gray-500 text-sm not-italic">{role}</cite>
      </div>
    </div>
  </div>
);


const testimonials = [
    {
        quote: "This app has been a lifesaver. The personalized schedules helped us finally get our 4-month-old to sleep through the night. I feel like a new person!",
        author: "Sarah J.",
        role: "Mom of a 4-month-old",
        avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&h=100&auto=format&fit=crop"
    },
    {
        quote: "The analytics are fantastic for spotting trends. It's so much easier to anticipate our son's needs now. This app gave me my sanity back!",
        author: "Jessica M.",
        role: "Mom of a 6-month-old",
        avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=100&h=100&auto=format&fit=crop"
    },
    {
        quote: "We love the multi-caregiver support. My husband and I are always on the same page, and even grandma can log naps when she babysits. Highly recommend!",
        author: "Emily R.",
        role: "Mom of twins",
        avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&h=100&auto=format&fit=crop"
    },
    {
        quote: "The data-driven approach of this app is impressive. It empowers parents with actionable insights, which I highly recommend to my clients for establishing healthy sleep habits.",
        author: "Maria K.",
        role: "Mom of a 7-month-old",
        avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=100&h=100&auto=format&fit=crop"
    }
]

const Testimonials: React.FC = () => {
  return (
    <section id="testimonials" className="py-20 bg-[#F7F2FF]">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Trusted by happy Parents</h2>
           <div className="flex justify-center items-center space-x-2 mt-4">
            <StarRating rating={4.9} />
            <span className="font-bold text-xl text-gray-700">4.9</span>
            <span className="text-gray-500">(based on 10,000+ reviews)</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {testimonials.map((testimonial, index) => (
                <TestimonialCard 
                    key={index}
                    quote={testimonial.quote.replace('Sleepy Tracker', 'This app')}
                    author={testimonial.author}
                    role={testimonial.role}
                    avatarUrl={testimonial.avatarUrl}
                />
            ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;