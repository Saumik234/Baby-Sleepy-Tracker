import React, { useState, useEffect, useMemo } from 'react';

// --- Data Types ---
interface Activity {
  id: string;
  eventTime: Date;
  type: 'sleep' | 'feeding' | 'diaper' | 'note';
  details: {
    startTime?: string;
    endTime?: string;
    duration?: string; // "Xh Ym"
    feedType?: 'nursing' | 'formula';
    amount?: string;
    diaperType?: 'wet' | 'dirty' | 'both';
    note?: string;
  };
}

interface DailyStats {
  date: string;
  totalSleepMinutes: number;
  sleepCount: number;
  feedCount: number;
  diaperCount: number;
  nightWakings: number; // New stat
}

// --- Helper Functions ---
const parseDurationToMinutes = (durationStr?: string): number => {
    if (!durationStr) return 0;
    const match = durationStr.match(/(\d+)h\s*(\d+)m/);
    if (match) {
        const hours = parseInt(match[1], 10) || 0;
        const minutes = parseInt(match[2], 10) || 0;
        return hours * 60 + minutes;
    }
    return 0;
};

const formatMinutesToHours = (minutes: number): string => {
    if (isNaN(minutes) || minutes <= 0) return '0h 0m';
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h ${mins}m`;
};

// --- UI Components ---
const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode; }> = ({ title, value, icon }) => (
    <div className="bg-gray-50 p-4 rounded-lg flex items-center">
        <div className="p-3 rounded-full bg-indigo-100 text-indigo-600 mr-4">
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-500 font-medium">{title}</p>
            <p className="text-xl md:text-2xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);

const Analytics: React.FC = () => {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [timeRange, setTimeRange] = useState(7);
    const activityStorageKey = 'babyActivities';
    
    useEffect(() => {
        try {
            const savedActivities = localStorage.getItem(activityStorageKey);
            if (savedActivities) {
                const parsed = JSON.parse(savedActivities).map((a: any) => ({
                    ...a,
                    eventTime: new Date(a.eventTime)
                }));
                setActivities(parsed);
            } else {
                setActivities([]);
            }
        } catch (error) {
            console.error("Failed to load activities:", error);
            setActivities([]);
        }
    }, [activityStorageKey]);
    
    const processedData = useMemo(() => {
        if (activities.length === 0) return null;
        
        const numDays = timeRange;
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - (numDays - 1));
        startDate.setHours(0, 0, 0, 0);

        const dailyData: { [key: string]: DailyStats } = {};

        for (let i = 0; i < numDays; i++) {
            const d = new Date(startDate);
            d.setDate(d.getDate() + i);
            const dateString = d.toISOString().split('T')[0];
            dailyData[dateString] = {
                date: dateString,
                totalSleepMinutes: 0,
                sleepCount: 0,
                feedCount: 0,
                diaperCount: 0,
                nightWakings: 0,
            };
        }
        
        const NIGHT_START_HOUR = 19; // 7 PM
        const NIGHT_END_HOUR = 7;   // 7 AM

        activities.forEach(activity => {
            const activityDate = new Date(activity.eventTime);
            if (activityDate >= startDate && activityDate <= endDate) {
                // Find the correct date bucket for the activity, especially for overnight sleep
                let dateString = activityDate.toISOString().split('T')[0];
                
                // If a sleep starts before midnight but ends after, attribute it to the start day
                if (activity.type === 'sleep' && activity.details.startTime) {
                    dateString = new Date(activity.details.startTime).toISOString().split('T')[0];
                }

                if (dailyData[dateString]) {
                    switch (activity.type) {
                        case 'sleep':
                            dailyData[dateString].totalSleepMinutes += parseDurationToMinutes(activity.details.duration);
                            dailyData[dateString].sleepCount += 1;
                            if (activity.details.startTime) {
                                const sleepStartTime = new Date(activity.details.startTime);
                                const startHour = sleepStartTime.getHours();
                                // A 'night waking' is simplified here as any sleep session starting during the night.
                                // A more complex calculation would analyze gaps between night sleep sessions.
                                if(startHour >= NIGHT_START_HOUR || startHour < NIGHT_END_HOUR) {
                                     // This logic counts the main bedtime as a "waking", so we adjust.
                                     // We only count wakings if there's more than one sleep session during the night period for that day.
                                     // A simple proxy: increment here and subtract 1 later if > 0.
                                     dailyData[dateString].nightWakings += 1;
                                }
                            }
                            break;
                        case 'feeding':
                            dailyData[dateString].feedCount += 1;
                            break;
                        case 'diaper':
                            dailyData[dateString].diaperCount += 1;
                            break;
                    }
                }
            }
        });

        // Adjust night wakings: if there were night sleeps, the first one was bedtime, not a waking.
         Object.keys(dailyData).forEach(date => {
            if (dailyData[date].nightWakings > 0) {
                dailyData[date].nightWakings -= 1;
            }
        });

        const dailyStatsArray = Object.values(dailyData);
        
        const totalDaysWithData = dailyStatsArray.filter(d => d.sleepCount > 0 || d.feedCount > 0 || d.diaperCount > 0).length || 1;
        const totalSleep = dailyStatsArray.reduce((sum, day) => sum + day.totalSleepMinutes, 0);
        const totalFeeds = dailyStatsArray.reduce((sum, day) => sum + day.feedCount, 0);
        const totalDiapers = dailyStatsArray.reduce((sum, day) => sum + day.diaperCount, 0);
        const totalNightWakings = dailyStatsArray.reduce((sum, day) => sum + day.nightWakings, 0);

        return {
            avgDailySleep: formatMinutesToHours(totalSleep / totalDaysWithData),
            avgDailyFeeds: (totalFeeds / totalDaysWithData).toFixed(1),
            avgNightWakings: (totalNightWakings / totalDaysWithData).toFixed(1),
            avgDailyDiapers: (totalDiapers / totalDaysWithData).toFixed(1),
        };

    }, [activities, timeRange]);

    const renderEmptyState = () => (
         <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Analytics & Trends</h2>
            <div className="text-center p-12 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                <p className="text-lg font-semibold mt-4">No Data to Analyze</p>
                <p className="mt-2">Start by logging your baby's activities in the 'Track Everything' section to see your trends here.</p>
            </div>
        </div>
    );
    
    if (!processedData) {
        return renderEmptyState();
    }

    return (
        <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Analytics & Trends</h2>
                        <p className="text-gray-500 mt-1">Showing data from the last {timeRange} days.</p>
                    </div>
                    <div className="flex bg-gray-100 p-1 rounded-full mt-4 sm:mt-0">
                        <button onClick={() => setTimeRange(7)} className={`px-4 py-1.5 text-sm font-semibold rounded-full ${timeRange === 7 ? 'bg-white shadow' : 'text-gray-600'}`}>7 Days</button>
                        <button onClick={() => setTimeRange(30)} className={`px-4 py-1.5 text-sm font-semibold rounded-full ${timeRange === 30 ? 'bg-white shadow' : 'text-gray-600'}`}>30 Days</button>
                    </div>
                </div>
            
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    <StatCard 
                        title="Avg. Daily Sleep" 
                        value={processedData.avgDailySleep}
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>}
                    />
                    <StatCard 
                        title="Avg. Daily Feedings" 
                        value={processedData.avgDailyFeeds}
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10v2a2 2 0 01-2 2h-1v-4h1a2 2 0 012 2zm0 0l-2-2m2 2l2-2m-2 2v2m0-6V6m0 0a2 2 0 00-2-2h-1a2 2 0 00-2 2v2m0 0h1a2 2 0 002-2z" /></svg>}
                    />
                    <StatCard 
                        title="Avg. Night Wakings" 
                        value={processedData.avgNightWakings}
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
                    />
                     <StatCard 
                        title="Avg. Daily Diapers" 
                        value={processedData.avgDailyDiapers}
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4M12 3c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8z" /></svg>}
                    />
                </div>
            </div>
        </div>
    );
};

export default Analytics;