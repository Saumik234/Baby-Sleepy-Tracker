import React, { useState, useEffect, useMemo, useCallback } from 'react';

// --- TYPE DEFINITIONS ---
interface Activity {
  id: string;
  eventTime: Date;
  type: 'sleep' | 'feeding' | 'diaper' | 'note';
  details: {
    startTime?: string;
    endTime?: string;
    duration?: string; // "Xh Ym"
  };
}

type Language = 'en' | 'bn';

// --- TRANSLATIONS ---
const translations: Record<Language, Record<string, string>> = {
    en: {
        title: "Real-time Sleep Analytics",
        last24h: "Sleep (Last 24h)",
        avgDuration: "Avg. Duration",
        today: "Today's Sleep",
        thisWeek: "This Week",
        lastWeek: "Last Week",
        sleepQuality: "Sleep Quality",
        excellent: "Excellent",
        good: "Good",
        needsImprovement: "Needs Improvement",
        sleepTrend: "Sleep Trend",
        dailyHours: "Daily Hours",
        days7: "7 Days",
        days14: "14 Days",
        weeklyComparison: "Weekly Comparison",
        recentLogs: "Recent Sleep Logs",
        startTime: "Start Time",
        duration: "Duration",
        quality: "Quality",
        noData: "No sleep data available to analyze.",
        logMore: "Log sleep sessions in the 'Track Everything' tool to see your analytics.",
        syncStatus: "Sync Status",
        synced: "Synced",
        syncing: "Syncing",
        refresh: "Refresh",
    },
    bn: {
        title: "রিয়েল-টাইম ঘুম বিশ্লেষণ",
        last24h: "ঘুম (শেষ ২৪ ঘন্টা)",
        avgDuration: "গড় সময়কাল",
        today: "আজকের ঘুম",
        thisWeek: "এই সপ্তাহ",
        lastWeek: "গত সপ্তাহ",
        sleepQuality: "ঘুমের গুণমান",
        excellent: "চমৎকার",
        good: "ভাল",
        needsImprovement: "উন্নতি প্রয়োজন",
        sleepTrend: "ঘুমের প্রবণতা",
        dailyHours: "দৈনিক ঘন্টা",
        days7: "৭ দিন",
        days14: "১৪ দিন",
        weeklyComparison: "সাপ্তাহিক তুলনা",
        recentLogs: "সাম্প্রতিক ঘুমের লগ",
        startTime: "শুরুর সময়",
        duration: "সময়কাল",
        quality: "গুণমান",
        noData: "বিশ্লেষণ করার জন্য কোনো ঘুমের ডেটা উপলব্ধ নেই।",
        logMore: "'ট্র্যাক এভরিথিং' টুলে ঘুমের সেশন লগ করুন আপনার বিশ্লেষণ দেখতে।",
        syncStatus: "সিঙ্ক স্ট্যাটাস",
        synced: "সিঙ্ক হয়েছে",
        syncing: "সিঙ্ক হচ্ছে",
        refresh: "রিফ্রেশ",
    }
};

// --- HELPER FUNCTIONS ---
const generateMockSleepData = (): Activity[] => {
    const mockData: Activity[] = [];
    const now = new Date();
    for (let i = 0; i < 14; i++) { // Generate for the last 14 days
        const day = new Date(now);
        day.setDate(now.getDate() - i);
        
        const numNaps = Math.floor(Math.random() * 3) + 2; // 2-4 naps/sleeps per day
        for (let j = 0; j < numNaps; j++) {
            const isNightSleep = j === numNaps - 1 && Math.random() > 0.3;
            const durationMinutes = isNightSleep
                ? Math.floor(Math.random() * 120) + 180 // 3-5 hours for night sleep
                : Math.floor(Math.random() * 75) + 45; // 45-120 mins for naps

            const endHour = isNightSleep ? 22 - j * 3 : 18 - j * 2;
            const endMinute = Math.floor(Math.random() * 60);

            const endTime = new Date(day);
            endTime.setHours(endHour, endMinute, 0, 0);

            if (endTime > now) continue; // Don't generate future data

            const startTime = new Date(endTime.getTime() - durationMinutes * 60 * 1000);
            
            const durationH = Math.floor(durationMinutes / 60);
            const durationM = durationMinutes % 60;

            mockData.push({
                id: `mock-${i}-${j}`,
                eventTime: endTime,
                type: 'sleep',
                details: {
                    startTime: startTime.toISOString(),
                    endTime: endTime.toISOString(),
                    duration: `${durationH}h ${durationM}m`,
                },
            });
        }
    }
    return mockData;
};

const parseDurationToMinutes = (durationStr?: string): number => {
    if (!durationStr) return 0;
    const match = durationStr.match(/(\d+)h\s*(\d+)m/);
    return match ? (parseInt(match[1], 10) * 60) + parseInt(match[2], 10) : 0;
};

const formatMinutes = (minutes: number): string => {
    if (isNaN(minutes) || minutes < 0) return '0h 0m';
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h ${mins}m`;
};

const getSleepQuality = (minutes: number): 'Excellent' | 'Good' | 'Needs Improvement' => {
    if (minutes >= 180) return 'Excellent'; // 3h+
    if (minutes >= 120) return 'Good'; // 2-3h
    return 'Needs Improvement';
};

// --- UI COMPONENTS ---
const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-white p-4 rounded-xl shadow-md flex items-center">
        <div className="p-3 rounded-full bg-gray-100 mr-4">{icon}</div>
        <div>
            <p className="text-sm text-gray-500 font-medium">{title}</p>
            <p className="text-xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);

const DonutChart: React.FC<{ data: { name: string; value: number; color: string }[], t: (key: string) => string }> = ({ data, t }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    if (total === 0) return <div className="flex items-center justify-center h-full text-gray-400">{t('noData')}</div>;
    
    let cumulative = 0;
    const gradientParts = data.map(item => {
        const start = cumulative;
        const end = cumulative + (item.value / total) * 100;
        cumulative = end;
        return `${item.color} ${start}% ${end}%`;
    }).join(', ');

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="w-32 h-32 rounded-full relative" style={{ background: `conic-gradient(${gradientParts})` }}>
                <div className="absolute inset-2 bg-white rounded-full"></div>
            </div>
            <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs">
                {data.map(item => (
                    <div key={item.name} className="flex items-center">
                        <span className="w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: item.color }}></span>
                        <span>{t(item.name.toLowerCase().replace(' ', ''))}: {((item.value / total) * 100).toFixed(0)}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const LineChart: React.FC<{ data: { name: string; hours: number }[], t: (key: string) => string }> = ({ data, t }) => {
    const maxHours = Math.max(...data.map(d => d.hours), 5); // Ensure a minimum height
    const width = 300, height = 150, padding = 20;

    const points = data.map((d, i) => {
        const x = padding + (i / (data.length - 1)) * (width - 2 * padding);
        const y = height - padding - (d.hours / maxHours) * (height - 2 * padding);
        return { x, y };
    });

    const path = "M" + points.map(p => `${p.x},${p.y}`).join(" L ");

    return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
            {/* Y-Axis Labels */}
            {[...Array(5)].map((_, i) => {
                 const y = height - padding - ((maxHours / 4) * i / maxHours) * (height - 2 * padding);
                 const value = (maxHours / 4) * i;
                 return (
                     <g key={i}>
                        <text x={padding - 5} y={y + 3} textAnchor="end" fontSize="8" fill="gray">{value.toFixed(1)}</text>
                        <line x1={padding} y1={y} x2={width-padding} y2={y} stroke="#e5e7eb" strokeWidth="0.5" />
                     </g>
                 )
            })}
            {/* Path */}
            <path d={path} fill="none" stroke="#4f46e5" strokeWidth="2" />
            {/* Points */}
            {points.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="3" fill="#4f46e5" />)}
            {/* X-Axis Labels */}
            {data.map((d, i) => {
                 const x = padding + (i / (data.length - 1)) * (width - 2 * padding);
                 return <text key={i} x={x} y={height - padding/2} textAnchor="middle" fontSize="8" fill="gray">{d.name}</text>
            })}
        </svg>
    );
};

// --- MAIN COMPONENT ---
const RealTimeAnalytics: React.FC = () => {
    const [sleepData, setSleepData] = useState<Activity[]>([]);
    const [language, setLanguage] = useState<Language>('en');
    const [chartTimeRange, setChartTimeRange] = useState<7 | 14>(7);
    const [syncStatus, setSyncStatus] = useState<'Synced' | 'Syncing'>('Synced');
    const t = (key: string) => translations[language][key] || key;

    const loadData = useCallback(() => {
        setSyncStatus('Syncing');
        try {
            let saved = localStorage.getItem('babyActivities');
            if (!saved || JSON.parse(saved).filter((a:any) => a.type === 'sleep').length === 0) {
                const existingActivities = saved ? JSON.parse(saved).filter((a:any) => a.type !== 'sleep') : [];
                const mockSleep = generateMockSleepData();
                const combinedData = [...existingActivities, ...mockSleep];
                localStorage.setItem('babyActivities', JSON.stringify(combinedData));
                saved = JSON.stringify(combinedData);
            }
            
            const parsed = JSON.parse(saved).map((a: any) => ({
                ...a,
                eventTime: new Date(a.eventTime),
                details: {
                    ...a.details,
                    startTime: a.details.startTime ? new Date(a.details.startTime).toISOString() : new Date(a.eventTime).toISOString(),
                }
            }));
            const sortedSleepData = parsed
                .filter((a: any) => a.type === 'sleep' && a.details.startTime)
                .sort((a: any, b: any) => new Date(b.eventTime).getTime() - new Date(a.eventTime).getTime());
            setSleepData(sortedSleepData);
        } catch (error) { console.error("Failed to load or generate data:", error); }
        setTimeout(() => setSyncStatus('Synced'), 500);
    }, []);

    useEffect(() => {
        loadData();
        const intervalId = setInterval(loadData, 5000); // Poll for changes every 5 seconds
        return () => clearInterval(intervalId);
    }, [loadData]);

    const processedData = useMemo(() => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        const getStartOfWeek = (date: Date) => {
            const d = new Date(date);
            const day = d.getDay();
            const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
            return new Date(d.setDate(diff));
        };
        
        const thisWeekStart = getStartOfWeek(now);
        thisWeekStart.setHours(0,0,0,0);
        const lastWeekStart = new Date(thisWeekStart);
        lastWeekStart.setDate(thisWeekStart.getDate() - 7);
        const lastWeekEnd = new Date(thisWeekStart);
        lastWeekEnd.setMilliseconds(lastWeekEnd.getMilliseconds() - 1);
        
        let last24h = 0, avgDuration = 0, todaySleep = 0, thisWeekSleep = 0, lastWeekSleep = 0;
        const qualityCount = { Excellent: 0, Good: 0, 'Needs Improvement': 0 };

        sleepData.forEach(log => {
            const minutes = parseDurationToMinutes(log.details.duration);
            if (log.eventTime.getTime() > now.getTime() - 24 * 60 * 60 * 1000) last24h += minutes;
            if (log.eventTime >= today) todaySleep += minutes;
            if (log.eventTime >= thisWeekStart) thisWeekSleep += minutes;
            if (log.eventTime >= lastWeekStart && log.eventTime < thisWeekStart) lastWeekSleep += minutes;

            qualityCount[getSleepQuality(minutes)] += 1;
        });

        avgDuration = sleepData.length > 0 ? sleepData.reduce((sum, log) => sum + parseDurationToMinutes(log.details.duration), 0) / sleepData.length : 0;
        
        const lineChartData = [...Array(chartTimeRange)].map((_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (chartTimeRange - 1 - i));
            const dayStr = date.toLocaleDateString(language, { weekday: 'short' });
            const totalMinutes = sleepData
                .filter(log => log.details.startTime && new Date(log.details.startTime).toDateString() === date.toDateString())
                .reduce((sum, log) => sum + parseDurationToMinutes(log.details.duration), 0);
            return { name: dayStr, hours: totalMinutes / 60 };
        }).filter(d => d.name);

        return {
            last24h: formatMinutes(last24h),
            avgDuration: formatMinutes(avgDuration),
            todaySleep: formatMinutes(todaySleep),
            thisWeekSleep: formatMinutes(thisWeekSleep),
            lastWeekSleep: formatMinutes(lastWeekSleep),
            qualityDistribution: [
                { name: 'Excellent', value: qualityCount.Excellent, color: '#10b981' },
                { name: 'Good', value: qualityCount.Good, color: '#3b82f6' },
                { name: 'Needs Improvement', value: qualityCount['Needs Improvement'], color: '#f97316' },
            ],
            lineChartData,
        };
    }, [sleepData, chartTimeRange, language]);

    if (sleepData.length === 0) {
        return (
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 text-center">
                <h2 className="text-xl font-bold text-gray-700 mb-2">{t('noData')}</h2>
                <p className="text-gray-500">{t('logMore')}</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-800">{t('title')}</h1>
                <div className="flex items-center gap-4 text-sm">
                     <div className="flex items-center gap-2 text-gray-600">
                        <span className={`h-2 w-2 rounded-full ${syncStatus === 'Synced' ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                        <span>{t('syncStatus')}: {t(syncStatus.toLowerCase())}</span>
                    </div>
                     <div className="flex bg-gray-100 p-1 rounded-full">
                        <button onClick={() => setLanguage('en')} className={`px-3 py-1 text-xs rounded-full ${language === 'en' ? 'bg-white shadow' : ''}`}>EN</button>
                        <button onClick={() => setLanguage('bn')} className={`px-3 py-1 text-xs rounded-full ${language === 'bn' ? 'bg-white shadow' : ''}`}>BN</button>
                    </div>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                <StatCard title={t('last24h')} value={processedData.last24h} icon={'🌙'} />
                <StatCard title={t('avgDuration')} value={processedData.avgDuration} icon={'⏱️'} />
                <StatCard title={t('today')} value={processedData.todaySleep} icon={'☀️'} />
                <StatCard title={t('thisWeek')} value={processedData.thisWeekSleep} icon={'🗓️'} />
                <StatCard title={t('lastWeek')} value={processedData.lastWeekSleep} icon={'🔙'} />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-4 rounded-xl shadow-md">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold">{t('sleepTrend')} ({t('dailyHours')})</h3>
                        <div className="flex bg-gray-100 p-1 rounded-full text-xs">
                             <button onClick={() => setChartTimeRange(7)} className={`px-2 py-0.5 rounded-full ${chartTimeRange === 7 ? 'bg-white shadow' : ''}`}>{t('days7')}</button>
                             <button onClick={() => setChartTimeRange(14)} className={`px-2 py-0.5 rounded-full ${chartTimeRange === 14 ? 'bg-white shadow' : ''}`}>{t('days14')}</button>
                        </div>
                    </div>
                    {processedData.lineChartData.length > 1 && <LineChart data={processedData.lineChartData} t={t} />}
                </div>
                <div className="bg-white p-4 rounded-xl shadow-md">
                     <h3 className="font-semibold text-center mb-2">{t('sleepQuality')}</h3>
                     <DonutChart data={processedData.qualityDistribution} t={t} />
                </div>
            </div>

            {/* Recent Logs Table */}
             <div className="bg-white p-4 rounded-xl shadow-md">
                <h3 className="font-semibold mb-2">{t('recentLogs')}</h3>
                <div className="overflow-x-auto max-h-64">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0">
                            <tr>
                                <th className="px-4 py-2">{t('startTime')}</th>
                                <th className="px-4 py-2">{t('duration')}</th>
                                <th className="px-4 py-2">{t('quality')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sleepData.slice(0, 20).map(log => {
                                const minutes = parseDurationToMinutes(log.details.duration);
                                const quality = getSleepQuality(minutes);
                                const qualityColors = {
                                    'Excellent': 'bg-green-100 text-green-800',
                                    'Good': 'bg-blue-100 text-blue-800',
                                    'Needs Improvement': 'bg-orange-100 text-orange-800',
                                };
                                return (
                                <tr key={log.id} className="border-b">
                                    <td className="px-4 py-2">{log.details.startTime ? new Date(log.details.startTime).toLocaleString(language, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }) : 'N/A'}</td>
                                    <td className="px-4 py-2 font-medium">{log.details.duration}</td>
                                    <td className="px-4 py-2">
                                        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${qualityColors[quality]}`}>
                                            {t(quality.toLowerCase().replace(' ', ''))}
                                        </span>
                                    </td>
                                </tr>
                            )})}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
};

export default RealTimeAnalytics;