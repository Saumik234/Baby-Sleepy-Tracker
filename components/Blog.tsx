import React from 'react';
import Meta from './Meta';

const blogPosts = [
    {
        imageUrl: 'https://images.unsplash.com/photo-1546015220-641a0491a682?q=80&w=600&auto=format&fit=crop',
        category: 'Sleep Science',
        title: 'The 4-Month Sleep Regression: A Survival Guide',
        excerpt: 'Just when you thought you had a routine, everything changes. Here\'s what the 4-month sleep regression is and how to navigate it with confidence.',
        author: {
            name: 'Dr. Laura Evans',
            avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=100&h=100&auto=format&fit=crop',
        },
        date: 'Oct 12, 2023',
        url: '/blog/4-month-sleep-regression'
    },
    {
        imageUrl: 'https://images.unsplash.com/photo-1519684351659-51314a5a5436?q=80&w=600&auto=format&fit=crop',
        category: 'Parenting Tips',
        title: 'Decoding Your Baby\'s Cries: Sleepy vs. Hungry',
        excerpt: 'Is that a tired cry or a hungry cry? Learning to distinguish your baby\'s cues is a game-changer for new parents. We break it down for you.',
        author: {
            name: 'Mark Johnson',
            avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=100&h=100&auto=format&fit=crop',
        },
        date: 'Sep 28, 2023',
        url: '/blog/decoding-cries'
    },
    {
        imageUrl: 'https://images.unsplash.com/photo-1484631321513-2b7a7082b5c0?q=80&w=600&auto=format&fit=crop',
        category: 'Routines',
        title: '5 Soothing Bedtime Rituals to Try Tonight',
        excerpt: 'A consistent bedtime routine is magical for baby sleep. Discover five simple, calming rituals that signal it\'s time for dreamland.',
        author: {
            name: 'Emily Carter',
            avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&h=100&auto=format&fit=crop',
        },
        date: 'Sep 15, 2023',
        url: '/blog/bedtime-rituals'
    },
];

const Blog: React.FC = () => {
    const blogSchema = {
        "@context": "https://schema.org",
        "@type": "Blog",
        "blogPost": blogPosts.map(post => ({
            "@type": "BlogPosting",
            "headline": post.title,
            "image": post.imageUrl,
            "author": {
                "@type": "Person",
                "name": post.author.name
            },
            "datePublished": new Date(post.date).toISOString().split('T')[0],
            "description": post.excerpt
        }))
    };

    return (
        <section className="py-20 bg-white">
            <Meta schema={blogSchema} />
            <div className="container mx-auto px-6">
                <header className="text-center max-w-3xl mx-auto mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">From Our Blog</h1>
                    <p className="text-lg text-gray-600">Expert tips, parent stories, and the latest in pediatric sleep science to guide you on your journey.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {blogPosts.map((post, index) => (
                        <article key={index} className="bg-gray-50 rounded-lg shadow-lg overflow-hidden flex flex-col transform hover:-translate-y-2 transition-transform duration-300 border border-gray-200">
                            <figure>
                                <img src={post.imageUrl} alt={`Blog post image for "${post.title}"`} className="w-full h-48 object-cover" loading="lazy" />
                            </figure>
                            <div className="p-6 flex flex-col flex-grow">
                                <p className="text-sm text-indigo-500 font-semibold">{post.category}</p>
                                <h2 className="text-xl font-bold text-gray-800 mt-2 mb-3 flex-grow">{post.title}</h2>
                                <p className="text-gray-600 text-sm mb-4">{post.excerpt}</p>
                                <footer className="mt-auto flex items-center pt-4 border-t border-gray-200">
                                    <img src={post.author.avatarUrl} alt={`Avatar of author ${post.author.name}`} className="w-10 h-10 rounded-full object-cover" loading="lazy" />
                                    <div className="ml-3">
                                        <address className="font-semibold text-gray-700 not-italic">{post.author.name}</address>
                                        <time dateTime={new Date(post.date).toISOString()} className="text-sm text-gray-500">{post.date}</time>
                                    </div>
                                </footer>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Blog;