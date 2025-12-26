import React, { useState } from 'react';

// --- Icons ---
const HeartIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
);

const CommentIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
);


// --- Data Types ---
interface Comment {
    id: string;
    authorName: string;
    authorAvatar: string;
    content: string;
    timestamp: string;
}

interface Post {
    id: string;
    authorName: string;
    authorAvatar: string;
    timestamp: string;
    content: string;
    likes: number;
    comments: Comment[];
}

// --- Mock Data ---
const mockPosts: Post[] = [
    {
        id: 'post1',
        authorName: 'Emily R.',
        authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&h=100&auto=format&fit=crop',
        timestamp: '2 hours ago',
        content: "Help! My 4-month-old was sleeping so well and now is up every 2 hours. Is this the dreaded sleep regression everyone talks about? Any survival tips are welcome! 😴",
        likes: 18,
        comments: [
            { id: 'c1-1', authorName: 'Sarah J.', authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&h=100&auto=format&fit=crop', content: "You are not alone! We went through this last month. Sticking to our routine was key. It passed in about 2 weeks. Hang in there!", timestamp: '1 hour ago' },
            { id: 'c1-2', authorName: 'Jessica M.', authorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=100&h=100&auto=format&fit=crop', content: "Yes! It's tough but it's a sign of a big developmental leap. Offer extra comfort but try not to create new sleep crutches. You've got this!", timestamp: '45 mins ago' },
        ],
    },
    {
        id: 'post2',
        authorName: 'Maria K.',
        authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=100&h=100&auto=format&fit=crop',
        timestamp: '8 hours ago',
        content: "Just wanted to share a little win! We used the personalized schedule from this app and for the first time ever, our 6-month-old connected his sleep cycles and took a 90-minute nap! Feeling so relieved.",
        likes: 42,
        comments: [
             { id: 'c2-1', authorName: 'Emily R.', authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&h=100&auto=format&fit=crop', content: "That's amazing! Gives me hope!", timestamp: '7 hours ago' }
        ],
    },
];

interface CommunityProps {
    onBack: () => void;
}

const Community: React.FC<CommunityProps> = ({ onBack }) => {
    const [posts, setPosts] = useState<Post[]>(mockPosts);
    const [newPostContent, setNewPostContent] = useState('');
    const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

    const handlePostSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newPostContent.trim() === '') return;

        const newPost: Post = {
            id: `post${Date.now()}`,
            authorName: 'You',
            authorAvatar: 'https://images.unsplash.com/photo-1529665253569-6d01c0eaf7b6?q=80&w=100&h=100&auto=format&fit=crop', // A generic user avatar
            timestamp: 'Just now',
            content: newPostContent,
            likes: 0,
            comments: [],
        };

        setPosts([newPost, ...posts]);
        setNewPostContent('');
    };
    
    const handleLike = (postId: string) => {
        setPosts(posts.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p));
    };

    const handleCommentChange = (postId: string, text: string) => {
        setCommentInputs({ ...commentInputs, [postId]: text });
    };

    const handleCommentSubmit = (e: React.FormEvent, postId: string) => {
        e.preventDefault();
        const commentContent = commentInputs[postId]?.trim();
        if (!commentContent) return;

        const newComment: Comment = {
            id: `comment${Date.now()}`,
            authorName: 'You',
            authorAvatar: 'https://images.unsplash.com/photo-1529665253569-6d01c0eaf7b6?q=80&w=100&h=100&auto=format&fit=crop',
            content: commentContent,
            timestamp: 'Just now',
        };

        setPosts(posts.map(p => p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p));
        setCommentInputs({ ...commentInputs, [postId]: '' });
    };


    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Community Forum</h2>
            <p className="text-gray-600 mb-6">Connect with other parents, ask questions, and share your journey.</p>

            {/* Create Post Form */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-8">
                <form onSubmit={handlePostSubmit}>
                    <textarea
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                        placeholder="Share your thoughts or ask a question..."
                        className="w-full p-3 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                        rows={3}
                    />
                    <div className="flex justify-end mt-2">
                        <button type="submit" disabled={!newPostContent.trim()} className="px-6 py-2 bg-[#A18AFF] text-white font-semibold rounded-md hover:bg-[#866de6] disabled:bg-gray-300 transition-colors">
                            Post
                        </button>
                    </div>
                </form>
            </div>

            {/* Posts Feed */}
            <div className="space-y-6">
                {posts.map(post => (
                    <div key={post.id} className="bg-white border border-gray-200 rounded-lg p-5">
                        {/* Post Header */}
                        <div className="flex items-center mb-4">
                            <img src={post.authorAvatar} alt={post.authorName} className="w-12 h-12 rounded-full object-cover" />
                            <div className="ml-4">
                                <p className="font-bold text-gray-800">{post.authorName}</p>
                                <p className="text-sm text-gray-500">{post.timestamp}</p>
                            </div>
                        </div>

                        {/* Post Content */}
                        <p className="text-gray-700 whitespace-pre-wrap mb-4">{post.content}</p>

                        {/* Post Actions */}
                        <div className="flex items-center text-gray-500 space-x-6 border-b border-gray-200 pb-2">
                            <button onClick={() => handleLike(post.id)} className="flex items-center space-x-1.5 hover:text-red-500 transition-colors group">
                                <HeartIcon className={`w-5 h-5 group-hover:fill-red-500 ${post.likes > 0 ? 'text-red-500' : ''}`} />
                                <span className="font-semibold">{post.likes}</span>
                            </button>
                            <div className="flex items-center space-x-1.5">
                                <CommentIcon className="w-5 h-5" />
                                <span className="font-semibold">{post.comments.length}</span>
                            </div>
                        </div>

                        {/* Comments Section */}
                        <div className="mt-4 space-y-4">
                            {post.comments.map(comment => (
                                <div key={comment.id} className="flex items-start">
                                    <img src={comment.authorAvatar} alt={comment.authorName} className="w-8 h-8 rounded-full object-cover mt-1" />
                                    <div className="ml-3 bg-gray-100 rounded-lg px-3 py-2 flex-1">
                                        <p className="font-bold text-sm text-gray-800">{comment.authorName} <span className="font-normal text-xs text-gray-500 ml-2">{comment.timestamp}</span></p>
                                        <p className="text-sm text-gray-700">{comment.content}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Add Comment Form */}
                        <form onSubmit={(e) => handleCommentSubmit(e, post.id)} className="mt-4 flex items-center space-x-2">
                            <img src="https://images.unsplash.com/photo-1529665253569-6d01c0eaf7b6?q=80&w=100&h=100&auto=format&fit=crop" alt="Your avatar" className="w-8 h-8 rounded-full object-cover"/>
                            <input
                                type="text"
                                value={commentInputs[post.id] || ''}
                                onChange={(e) => handleCommentChange(post.id, e.target.value)}
                                placeholder="Write a comment..."
                                className="flex-1 px-3 py-2 bg-gray-100 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            />
                            <button type="submit" className="px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-full hover:bg-gray-300 text-sm">Reply</button>
                        </form>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Community;