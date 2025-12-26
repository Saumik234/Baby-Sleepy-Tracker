import React, { useState, useEffect, useCallback } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { BabyProfile } from '../App';
import LoadingSpinner from './LoadingSpinner';

interface ScheduleItem {
    title: string;
    time: string;
    notes: string;
}

interface ScheduleResponse {
    schedule: ScheduleItem[];
    summary: string;
}

interface SleepSchedulerData {
    wakeTime: string;
    schedule: ScheduleResponse | null;
    lastGeneratedAgeInMonths: number;
    suggestionDismissedUntil: number | null;
}

interface SleepSchedulerProps {
    onBack: () => void;
    activeProfile: BabyProfile;
}

const calculateAgeInMonths = (birthDate: string): number => {
    const today = new Date();
    // Correctly parse the date string in the local timezone to avoid off-by-one errors
    const birth = new Date(birthDate + 'T00:00:00');
    let months = (today.getFullYear() - birth.getFullYear()) * 12;
    months -= birth.getMonth();
    months += today.getMonth();
    return months <= 0 ? 0 : months;
};

const summarizeSleepData = (): string => {
    try {
        const savedActivities = localStorage.getItem('babyActivities');
        if (!savedActivities) return "No sleep data available.";

        const activities = JSON.parse(savedActivities).map((a: any) => ({...a, eventTime: new Date(a.eventTime)}));
        const sleepActivities = activities.filter((a: any) => a.type === 'sleep' && a.details.duration);
        
        if (sleepActivities.length === 0) return "No sleep data has been logged recently.";

        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const recentSleeps = sleepActivities.filter((a: any) => a.eventTime > oneWeekAgo);

        if (recentSleeps.length < 3) return "Not enough recent sleep data to analyze. Keep tracking for better suggestions.";
        
        let totalSleepMinutes = 0;
        recentSleeps.forEach((sleep: any) => {
            const durationParts = sleep.details.duration.match(/(\d+)h\s*(\d+)m/);
            if (durationParts) {
                totalSleepMinutes += parseInt(durationParts[1]) * 60 + parseInt(durationParts[2]);
            }
        });

        const avgTotalSleepHours = (totalSleepMinutes / recentSleeps.length) / 60;

        return `Based on sleep data from the last 7 days, the baby is sleeping an average of ${avgTotalSleepHours.toFixed(1)} hours in logged sleep sessions. Please factor this into the schedule recommendations.`;

    } catch (e) {
        console.error("Could not parse sleep data", e);
        return "Could not analyze recent sleep data.";
    }
}


const SleepScheduler: React.FC<SleepSchedulerProps> = ({ onBack, activeProfile }) => {
    const [wakeTime, setWakeTime] = useState<string>('07:00');
    const [schedule, setSchedule] = useState<ScheduleResponse | null>(null);
    const [suggestedSchedule, setSuggestedSchedule] = useState<ScheduleResponse | null>(null);
    const [isReviewing, setIsReviewing] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const storageKey = 'sleepSchedulerData';

    const loadData = useCallback(() => {
        try {
            const dataString = localStorage.getItem(storageKey);
            if (dataString) {
                const data: SleepSchedulerData = JSON.parse(dataString);
                setWakeTime(data.wakeTime || '07:00');
                setSchedule(data.schedule || null);
                return data;
            } else {
                setWakeTime('07:00');
                setSchedule(null);
            }
        } catch (err) {
            console.error("Failed to load data from localStorage", err);
        }
        return null;
    }, [storageKey]);

    const saveData = useCallback((data: Partial<SleepSchedulerData>) => {
        try {
            const existingDataString = localStorage.getItem(storageKey);
            const existingData = existingDataString ? JSON.parse(existingDataString) : {};
            const newData = { ...existingData, ...data };
            localStorage.setItem(storageKey, JSON.stringify(newData));
        } catch (err) {
            console.error("Failed to save data to localStorage", err);
        }
    }, [storageKey]);
    
    const generateSchedule = useCallback(async (isSuggestion: boolean) => {
        if (!activeProfile.birthDate || !wakeTime) {
            setError('Please provide a birth date and wake time.');
            return;
        }

        setIsLoading(true);
        setError(null);
        if(!isSuggestion) setSchedule(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const currentAgeInMonths = calculateAgeInMonths(activeProfile.birthDate);
            const sleepSummary = summarizeSleepData();
            
            const responseSchema = {
                type: Type.OBJECT, properties: {
                    schedule: { type: Type.ARRAY, description: "A list of timed events for the baby's day.", items: { type: Type.OBJECT, properties: { title: { type: Type.STRING, description: "Title of the schedule event (e.g., 'Morning Nap', 'Bedtime')." }, time: { type: Type.STRING, description: "Suggested time for the event (e.g., '9:00 AM - 10:30 AM')." }, notes: { type: Type.STRING, description: "Helpful tips or context for this schedule item." } }, required: ["title", "time", "notes"] } },
                    summary: { type: Type.STRING, description: "A brief summary of the schedule and general advice based on the baby's age." }
                }, required: ["schedule", "summary"]
            };
            
            const prompt = `You are an expert pediatric sleep consultant. Generate a personalized daily sleep schedule for a baby named ${activeProfile.name} with the following details. The schedule must be based on biologically appropriate wake windows for the baby's age.
            - Baby's Age: ${currentAgeInMonths} months old
            - Typical Morning Wake Time: ${wakeTime}
            - Recent Sleep Patterns: ${sleepSummary}
            Provide the response as a JSON object that adheres to the specified schema.`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash', contents: prompt, config: { responseMimeType: 'application/json', responseSchema: responseSchema },
            });
            
            const scheduleData = JSON.parse(response.text);
            
            if (isSuggestion) {
                setSuggestedSchedule(scheduleData);
            } else {
                setSchedule(scheduleData);
                saveData({ wakeTime, schedule: scheduleData, lastGeneratedAgeInMonths: currentAgeInMonths });
            }

        } catch (err) {
            console.error("Error generating schedule:", err);
            setError("Sorry, we couldn't generate a schedule at this time. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    }, [activeProfile, wakeTime, saveData]);

    useEffect(() => {
        const data = loadData();
        if (data && activeProfile.birthDate && data.schedule) {
            const currentAge = calculateAgeInMonths(activeProfile.birthDate);
            const lastAge = data.lastGeneratedAgeInMonths || 0;
            const suggestionDismissed = data.suggestionDismissedUntil && data.suggestionDismissedUntil > Date.now();
            
            if (currentAge > lastAge && !suggestionDismissed) {
                generateSchedule(true); // Generate a suggestion
            }
        }
    }, [activeProfile, loadData, generateSchedule]);
    
    const handleAcceptSuggestion = () => {
        if (suggestedSchedule) {
            setSchedule(suggestedSchedule);
            const currentAgeInMonths = calculateAgeInMonths(activeProfile.birthDate);
            saveData({ schedule: suggestedSchedule, lastGeneratedAgeInMonths: currentAgeInMonths, suggestionDismissedUntil: null });
            setSuggestedSchedule(null);
            setIsReviewing(false);
        }
    };
    
    const handleDismissSuggestion = () => {
        const fourWeeks = Date.now() + (4 * 7 * 24 * 60 * 60 * 1000);
        saveData({ suggestionDismissedUntil: fourWeeks });
        setSuggestedSchedule(null);
        setIsReviewing(false);
    };

    const renderSchedule = (s: ScheduleResponse) => (
         <div>
            <div className="mb-6 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                 <h4 className="font-semibold text-indigo-800">Summary & Advice for {activeProfile.name}</h4>
                 <p className="text-indigo-700 mt-1">{s.summary}</p>
            </div>
            <div className="space-y-4">
                {s.schedule.map((item, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg">
                        <p className="font-bold text-gray-800">{item.title}</p>
                        <p className="text-lg text-[#A18AFF] font-semibold">{item.time}</p>
                        <p className="text-gray-600 mt-1">{item.notes}</p>
                    </div>
                ))}
            </div>
        </div>
    );
    
    const renderContent = () => {
        if (isLoading && !schedule && !suggestedSchedule) return <LoadingSpinner message="Generating your personalized schedule..." />;
        if (error) return (
            <div className="text-center p-8">
                <p className="text-red-500 font-semibold">{error}</p>
                <button onClick={() => { setError(null); generateSchedule(false); }} className="mt-4 bg-[#A18AFF] text-white px-4 py-2 rounded-lg">Try Again</button>
            </div>
        );

        if (isReviewing && suggestedSchedule) {
            return (
                <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Suggested Schedule Update</h3>
                    {renderSchedule(suggestedSchedule)}
                     <div className="flex flex-col sm:flex-row gap-4 mt-8">
                        <button onClick={handleAcceptSuggestion} className="w-full bg-green-500 text-white font-semibold px-6 py-3 rounded-lg hover:bg-green-600 transition-colors">Approve & Update</button>
                        <button onClick={() => setIsReviewing(false)} className="w-full bg-gray-200 text-gray-800 font-semibold px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors">Keep Current Schedule</button>
                    </div>
                </div>
            )
        }
        
        if (schedule) {
            return (
                <div>
                    {suggestedSchedule && !isReviewing && (
                         <div className="p-4 mb-6 bg-yellow-50 border border-yellow-300 rounded-lg text-center">
                            <h4 className="font-bold text-yellow-800">A Schedule Update is Available!</h4>
                            <p className="text-yellow-700 mt-1">{activeProfile.name} is growing! We have a new suggestion based on their age.</p>
                            <div className="flex gap-4 justify-center mt-4">
                                <button onClick={() => setIsReviewing(true)} className="px-4 py-2 text-sm bg-yellow-400 text-yellow-900 rounded-md hover:bg-yellow-500">Review</button>
                                <button onClick={handleDismissSuggestion} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-200 rounded-md">Dismiss</button>
                            </div>
                        </div>
                    )}
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Personalized Sleep Schedule for {activeProfile.name}</h3>
                    {renderSchedule(schedule)}
                    <button onClick={() => { if(window.confirm("This will clear your current schedule. Are you sure?")) { setSchedule(null); saveData({ schedule: null }) } }} className="mt-8 w-full bg-gray-200 text-gray-800 font-semibold px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors">
                        Create a New Schedule
                    </button>
                </div>
            );
        }

        return (
            <form onSubmit={(e) => {e.preventDefault(); generateSchedule(false)}} className="space-y-6">
                 <div>
                    <p className="block text-sm font-medium text-gray-700 mb-1">Generating schedule for: <span className="font-bold">{activeProfile.name}</span></p>
                    <p className="text-xs text-gray-500">Birth date is set to a default. You can track activities for your baby.</p>
                </div>
                <div>
                    <label htmlFor="wakeTime" className="block text-sm font-medium text-gray-700 mb-1">Typical Morning Wake Time</label>
                    <input type="time" id="wakeTime" value={wakeTime} onChange={(e) => setWakeTime(e.target.value)} required className="mt-1 block w-full px-4 py-2 bg-gray-100 border-2 border-white rounded-md shadow-sm focus:outline-none focus:ring-0"/>
                </div>
                <button 
                    type="submit" 
                    className="w-full bg-[#FFB3C1] text-gray-800 font-semibold px-8 py-3 rounded-full hover:bg-[#ff9cb0] transition-transform duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center disabled:bg-[#f8c6d1] disabled:cursor-not-allowed"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Generating...
                        </>
                    ) : (
                        'Generate Schedule'
                    )}
                </button>
            </form>
        );
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            {renderContent()}
        </div>
    );
};

export default SleepScheduler;