import React, { useState, useMemo } from 'react';
import { GoogleGenAI } from '@google/genai';

const ChevronDownIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
);

const articles = [
  {
    id: 1,
    title: "Understanding Newborn Sleep (0-3 Months)",
    summary: "Newborn sleep is erratic and unpredictable. Learn the science behind it and what to expect in these first few months.",
    content: `
      <p>In the first three months, your baby's sleep is governed by their basic needs: eating, growing, and feeling secure. They haven't developed a circadian rhythm yet, which means their internal clock doesn't distinguish between day and night. Expect them to sleep in short bursts, typically 1-3 hours at a time, totaling 14-17 hours over a 24-hour period.</p>
      <ul class="list-disc list-inside space-y-2 mt-4">
        <li><strong>Focus on Full Feeds:</strong> Ensure your baby gets full feedings during the day to reduce night wakings from hunger.</li>
        <li><strong>Watch for Sleep Cues:</strong> Yawning, rubbing eyes, or fussiness are signs your baby is tired. Try to put them down to sleep as soon as you see these cues to avoid them becoming overtired.</li>
        <li><strong>Day/Night Confusion:</strong> Keep daytime bright and active, and nighttime dark, quiet, and calm to help set their internal clock.</li>
      </ul>
    `,
    tags: ['0-3 Months', 'Sleep Science'],
  },
  {
    id: 2,
    title: "Creating the Perfect Sleep Environment",
    summary: "The right environment can make a huge difference. Discover the key elements of a sleep-conducive nursery.",
    content: `
      <p>A safe, calm, and consistent sleep environment signals to your baby that it's time to rest. The goal is to minimize distractions and maximize comfort. Here are the key components:</p>
      <ul class="list-disc list-inside space-y-2 mt-4">
        <li><strong>Darkness:</strong> Use blackout curtains to make the room as dark as possible. Darkness cues the brain to produce melatonin, the sleep hormone.</li>
        <li><strong>Cool Temperature:</strong> The ideal room temperature for a baby is between 68-72°F (20-22°C). Dress them in appropriate layers to avoid overheating.</li>
        <li><strong>White Noise:</strong> A continuous, low-rumble sound can mimic the womb environment and block out household noises.</li>
        <li><strong>Safety First:</strong> The crib should be completely empty except for a fitted sheet. No blankets, pillows, bumpers, or toys. Always place your baby on their back to sleep.</li>
      </ul>
    `,
    tags: ['All Ages', 'Environment'],
  },
  {
    id: 3,
    title: "Gentle Sleep Training Methods (4-6 Months)",
    summary: "Ready to encourage more independent sleep? Explore gentle, no-tears methods to guide your baby towards self-soothing.",
    content: `
      <p>Around 4-6 months, your baby's sleep patterns start to mature, making it a good time to introduce gentle sleep training if you choose. The goal is to help them learn to fall asleep on their own, without relying on rocking, feeding, or pacifiers. Here are some gentle approaches:</p>
      <ul class="list-disc list-inside space-y-2 mt-4">
        <li><strong>The Pick-Up/Put-Down Method:</strong> If your baby cries, you can pick them up to soothe them, but you must put them back in the crib awake. This can be repeated as many times as needed.</li>
        <li><strong>The Chair Method:</strong> Sit in a chair next to the crib until your baby falls asleep, offering verbal reassurance. Every few nights, move the chair further away until you're out of the room.</li>
        <li><strong>Fading (FIO):</strong> Gradually reduce your involvement in helping your baby fall asleep. If you rock them, rock them a little less each night until you're just holding them, and then just standing beside the crib.</li>
      </ul>
      <p class="mt-4">Consistency is the most important factor for success with any sleep training method. Choose a method that feels right for your family and stick with it.</p>
    `,
    tags: ['4-6 Months', 'Sleep Training'],
  },
  {
    id: 4,
    title: "Navigating Sleep Regressions",
    summary: "Just when you think you've got it figured out, a sleep regression hits. Learn why they happen and how to handle them.",
    content: `
      <p>A sleep regression is a period when a baby who was sleeping well suddenly starts waking frequently at night and/or refusing to nap. They are temporary and are usually tied to major developmental milestones.</p>
      <ul class="list-disc list-inside space-y-2 mt-4">
        <li><strong>Common Regressions:</strong> Occur around 4 months, 8-10 months, 12 months, and 18 months.</li>
        <li><strong>Why they happen:</strong> They are often caused by brain development, learning new skills (like rolling, crawling, or talking), teething, or separation anxiety.</li>
        <li><strong>How to cope:</strong> The key is not to create new, unsustainable sleep habits. Stick to your routine, offer extra comfort and reassurance, and know that it will pass. Avoid introducing new sleep crutches you'll have to wean off later.</li>
      </ul>
    `,
    tags: ['All Ages', 'Sleep Science'],
  },
];

const allTags = ['All', ...Array.from(new Set(articles.flatMap(a => a.tags)))];

const ArticleGenerator: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [generatedArticle, setGeneratedArticle] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState('');

    const handleGenerate = async () => {
        if (!prompt) {
            setError('Please enter a topic.');
            return;
        }
        setIsGenerating(true);
        setError('');
        setGeneratedArticle('');
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const fullPrompt = `As a pediatric sleep expert, write a helpful and reassuring article for new parents on the following topic: "${prompt}". Structure it with clear headings, bullet points, and actionable advice.`;
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: fullPrompt
            });
            setGeneratedArticle(response.text);
        } catch (e) {
            console.error(e);
            setError('Sorry, we couldn\'t generate an article right now. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="my-8 p-6 bg-indigo-50 border border-indigo-200 rounded-lg">
            <h3 className="text-xl font-bold text-gray-800">Generate Your Own Article</h3>
            <p className="text-gray-600 mt-1 mb-4">Have a specific question? Ask our AI sleep expert!</p>
            <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., Tips for transitioning from a swaddle"
                className="w-full p-2 bg-gray-100 border-2 border-white rounded-md text-gray-800 focus:outline-none focus:ring-0"
                rows={2}
                disabled={isGenerating}
            />
            <button 
                onClick={handleGenerate} 
                disabled={isGenerating} 
                className="mt-2 px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 transition-colors flex items-center justify-center"
            >
                {isGenerating ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Generating...
                    </>
                ) : (
                    'Generate Article'
                )}
            </button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
            {generatedArticle && (
                <div className="mt-4 p-4 bg-white rounded-md border">
                    <h4 className="font-bold text-lg mb-2">Your Generated Article:</h4>
                    <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">{generatedArticle}</div>
                </div>
            )}
        </div>
    );
};

interface GuidesProps {
    onBack: () => void;
}

const Guides: React.FC<GuidesProps> = ({ onBack }) => {
    const [activeTag, setActiveTag] = useState('All');
    const [expandedArticleId, setExpandedArticleId] = useState<number | null>(null);

    const filteredArticles = useMemo(() => {
        if (activeTag === 'All') return articles;
        return articles.filter(article => article.tags.includes(activeTag));
    }, [activeTag]);

    const toggleArticle = (id: number) => {
        setExpandedArticleId(prevId => (prevId === id ? null : id));
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <div className="mb-6 flex flex-wrap gap-2">
                {allTags.map(tag => (
                    <button
                        key={tag}
                        onClick={() => setActiveTag(tag)}
                        className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-colors ${
                            activeTag === tag
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        {tag}
                    </button>
                ))}
            </div>

            <div className="space-y-4">
                {filteredArticles.map(article => (
                    <div key={article.id} className="border border-gray-200 rounded-lg">
                        <button
                            onClick={() => toggleArticle(article.id)}
                            className="w-full flex justify-between items-center text-left p-4"
                        >
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">{article.title}</h3>
                                <p className="text-sm text-gray-500">{article.summary}</p>
                            </div>
                            <ChevronDownIcon
                                className={`w-6 h-6 text-gray-500 transition-transform duration-300 ${
                                    expandedArticleId === article.id ? 'rotate-180' : ''
                                }`}
                            />
                        </button>
                        <div
                            className={`overflow-hidden transition-all duration-500 ease-in-out ${
                                expandedArticleId === article.id ? 'max-h-[1000px]' : 'max-h-0'
                            }`}
                        >
                            <div
                                className="p-4 border-t border-gray-200 prose prose-sm max-w-none text-gray-700"
                                dangerouslySetInnerHTML={{ __html: article.content }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            <ArticleGenerator />
        </div>
    );
};

export default Guides;