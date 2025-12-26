import React, { useState, useEffect, useMemo } from 'react';

type ActivityType = 'sleep' | 'feeding' | 'diaper' | 'note';

interface Activity {
  id: string;
  eventTime: Date;
  type: ActivityType;
  details: {
    startTime?: string;
    endTime?: string;
    duration?: string;
    feedType?: 'nursing' | 'formula';
    amount?: string;
    diaperType?: 'wet' | 'dirty' | 'both';
    note?: string;
  };
}

const ICONS: Record<ActivityType, React.ReactNode> = {
    sleep: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>,
    feeding: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10v2a2 2 0 01-2 2h-1v-4h1a2 2 0 012 2zm0 0l-2-2m2 2l2-2m-2 2v2m0-6V6m0 0a2 2 0 00-2-2h-1a2 2 0 00-2 2v2m0 0h1a2 2 0 002-2z" /></svg>,
    diaper: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4M12 3c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8z" /></svg>,
    note: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
};

const ICON_COLORS: Record<ActivityType, string> = {
    sleep: 'bg-indigo-400',
    feeding: 'bg-pink-400',
    diaper: 'bg-yellow-500',
    note: 'bg-green-400',
};

// --- Helper function to format date for input[type=datetime-local]
const toDateTimeLocal = (date: Date) => {
    const ten = (i: number) => (i < 10 ? '0' : '') + i;
    const YYYY = date.getFullYear();
    const MM = ten(date.getMonth() + 1);
    const DD = ten(date.getDate());
    const HH = ten(date.getHours());
    const II = ten(date.getMinutes());
    return `${YYYY}-${MM}-${DD}T${HH}:${II}`;
};

const LogActivityModal: React.FC<{
    config: { type: ActivityType; activity?: Activity } | null;
    onClose: () => void;
    onSave: (activity: Omit<Activity, 'eventTime'> & { id?: string; eventTime: string }) => void;
}> = ({ config, onClose, onSave }) => {
    if (!config) return null;

    const { type: activityType, activity: activityToEdit } = config;

    const [eventTime, setEventTime] = useState(toDateTimeLocal(new Date()));
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [feedType, setFeedType] = useState<'nursing' | 'formula'>('nursing');
    const [amount, setAmount] = useState('');
    const [diaperType, setDiaperType] = useState<'wet' | 'dirty' | 'both'>('wet');
    const [note, setNote] = useState('');

    useEffect(() => {
        if (activityToEdit) {
            setEventTime(toDateTimeLocal(activityToEdit.eventTime));
            setStartTime(activityToEdit.details.startTime || '');
            setEndTime(activityToEdit.details.endTime || '');
            setFeedType(activityToEdit.details.feedType || 'nursing');
            setAmount(activityToEdit.details.amount || '');
            setDiaperType(activityToEdit.details.diaperType || 'wet');
            setNote(activityToEdit.details.note || '');
        } else {
            // Reset form for new entry
            setEventTime(toDateTimeLocal(new Date()));
            setStartTime('');
            setEndTime('');
            setFeedType('nursing');
            setAmount('');
            setDiaperType('wet');
            setNote('');
        }
    }, [activityToEdit]);
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        let details: any = {};
        if (activityType === 'sleep') {
            const start = new Date(startTime);
            const end = new Date(endTime);
            if (!startTime || !endTime) {
                alert("Please enter both a start and end time.");
                return;
            }
            if (end <= start) {
                alert("End time must be after start time.");
                return;
            }
            const diffMs = end.getTime() - start.getTime();
            const diffHrs = Math.floor(diffMs / 3600000);
            const diffMins = Math.round((diffMs % 3600000) / 60000);
            details = { startTime, endTime, duration: `${diffHrs}h ${diffMins}m` };
        } else if (activityType === 'feeding') {
            details = { feedType, amount };
        } else if (activityType === 'diaper') {
            details = { diaperType };
        } else if (activityType === 'note') {
            details = { note };
        }
        onSave({ id: activityToEdit?.id, type: activityType, eventTime, details });
    };

    const renderForm = () => {
        switch (activityType) {
            case 'sleep':
                return (
                    <>
                        <div>
                            <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">Start Time</label>
                            <input type="datetime-local" id="startTime" value={startTime} onChange={e => setStartTime(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-gray-100 border-2 border-white rounded-md shadow-sm focus:outline-none focus:ring-0"/>
                        </div>
                        <div>
                            <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">End Time</label>
                            <input type="datetime-local" id="endTime" value={endTime} onChange={e => setEndTime(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-gray-100 border-2 border-white rounded-md shadow-sm focus:outline-none focus:ring-0"/>
                        </div>
                    </>
                );
            case 'feeding':
                return (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Feed Type</label>
                            <div className="flex gap-4 mt-1">
                                <label className="flex items-center"><input type="radio" name="feedType" value="nursing" checked={feedType === 'nursing'} onChange={() => setFeedType('nursing')} className="form-radio"/> <span className="ml-2">Nursing</span></label>
                                <label className="flex items-center"><input type="radio" name="feedType" value="formula" checked={feedType === 'formula'} onChange={() => setFeedType('formula')} className="form-radio"/> <span className="ml-2">Formula</span></label>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount (ml or oz)</label>
                            <input type="text" id="amount" value={amount} onChange={e => setAmount(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-gray-100 border-2 border-white rounded-md shadow-sm focus:outline-none focus:ring-0"/>
                        </div>
                    </>
                );
            case 'diaper':
                return (
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Diaper Status</label>
                        <div className="flex gap-4 mt-1">
                            <label className="flex items-center"><input type="radio" name="diaperType" value="wet" checked={diaperType === 'wet'} onChange={() => setDiaperType('wet')} className="form-radio"/> <span className="ml-2">Wet</span></label>
                            <label className="flex items-center"><input type="radio" name="diaperType" value="dirty" checked={diaperType === 'dirty'} onChange={() => setDiaperType('dirty')} className="form-radio"/> <span className="ml-2">Dirty</span></label>
                            <label className="flex items-center"><input type="radio" name="diaperType" value="both" checked={diaperType === 'both'} onChange={() => setDiaperType('both')} className="form-radio"/> <span className="ml-2">Both</span></label>
                        </div>
                    </div>
                );
            case 'note':
                return (
                    <div>
                        <label htmlFor="note" className="block text-sm font-medium text-gray-700">Note</label>
                        <textarea id="note" value={note} onChange={e => setNote(e.target.value)} rows={4} required className="mt-1 block w-full px-3 py-2 bg-gray-100 border-2 border-white rounded-md shadow-sm text-gray-800 focus:outline-none focus:ring-0"></textarea>
                    </div>
                );
            default:
                return null;
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-gray-800 capitalize">{activityToEdit ? 'Edit' : 'Log'} {activityType}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">&times;</button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="eventTime" className="block text-sm font-medium text-gray-700">Time of Activity</label>
                        <input type="datetime-local" id="eventTime" value={eventTime} onChange={e => setEventTime(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-gray-100 border-2 border-white rounded-md shadow-sm focus:outline-none focus:ring-0"/>
                    </div>
                    {renderForm()}
                    <div className="flex justify-end gap-4 mt-6">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-[#A18AFF] text-white rounded-md hover:bg-[#866de6]">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const DailySummaryModal: React.FC<{ date: Date | null; activities: Activity[]; onClose: () => void }> = ({ date, activities, onClose }) => {
    const dailyData = useMemo(() => {
        if (!date) return null;

        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const dailyActivities = activities.filter(act => {
            const actTime = new Date(act.eventTime);
            return actTime >= startOfDay && actTime <= endOfDay;
        });

        let totalSleepMinutes = 0;
        dailyActivities.filter(a => a.type === 'sleep' && a.details.duration).forEach(sleep => {
            const match = sleep.details.duration!.match(/(\d+)h\s*(\d+)m/);
            if(match) totalSleepMinutes += parseInt(match[1]) * 60 + parseInt(match[2]);
        });
        const totalSleep = `${Math.floor(totalSleepMinutes / 60)}h ${totalSleepMinutes % 60}m`;

        return {
            activities: dailyActivities,
            stats: {
                totalSleep,
                feeds: dailyActivities.filter(a => a.type === 'feeding').length,
                diapers: dailyActivities.filter(a => a.type === 'diaper').length,
            },
        };
    }, [date, activities]);

    if (!dailyData) return null;

    const renderTimeline = () => (
        <div className="mt-4">
            <h4 className="font-semibold text-gray-700 mb-2">24-Hour Timeline</h4>
            <div className="relative h-8 bg-gray-200 rounded-lg">
                {dailyData.activities.map(act => {
                    const eventTime = new Date(act.eventTime);
                    const minutesInDay = eventTime.getHours() * 60 + eventTime.getMinutes();
                    const leftPercent = (minutesInDay / (24 * 60)) * 100;

                    if (act.type === 'sleep' && act.details.startTime && act.details.endTime) {
                        const start = new Date(act.details.startTime);
                        const end = new Date(act.details.endTime);
                        const startMin = start.getHours() * 60 + start.getMinutes();
                        const endMin = end.getHours() * 60 + end.getMinutes();
                        const startPercent = (startMin / (24 * 60)) * 100;
                        const widthPercent = ((endMin - startMin) / (24 * 60)) * 100;
                        return (
                            <div key={act.id} title={`Sleep: ${act.details.duration}`} className="absolute h-full bg-indigo-400 rounded" style={{ left: `${startPercent}%`, width: `${widthPercent > 0 ? widthPercent : 0}%` }} />
                        );
                    }
                    
                    return (
                         <div key={act.id} title={`${act.type} at ${eventTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`} className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full ${ICON_COLORS[act.type]}`} style={{ left: `calc(${leftPercent}% - 6px)` }}/>
                    );
                })}
            </div>
             <div className="flex justify-between text-xs text-gray-500 mt-1 px-1">
                <span>12AM</span>
                <span className="hidden sm:inline">6AM</span>
                <span>12PM</span>
                <span className="hidden sm:inline">6PM</span>
                <span>12AM</span>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-gray-800">Daily Summary: {date?.toLocaleDateString()}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 font-bold text-2xl">&times;</button>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center mb-4">
                    <div className="bg-indigo-50 p-3 rounded-lg"><div className="font-bold text-indigo-700 text-xl">{dailyData.stats.totalSleep}</div><div className="text-sm text-indigo-600">Total Sleep</div></div>
                    <div className="bg-pink-50 p-3 rounded-lg"><div className="font-bold text-pink-700 text-xl">{dailyData.stats.feeds}</div><div className="text-sm text-pink-600">Feedings</div></div>
                    <div className="bg-yellow-50 p-3 rounded-lg"><div className="font-bold text-yellow-700 text-xl">{dailyData.stats.diapers}</div><div className="text-sm text-yellow-600">Diapers</div></div>
                </div>
                {renderTimeline()}
            </div>
        </div>
    );
};

const ActivityItem: React.FC<{ activity: Activity, onEdit: () => void, onDelete: (id: string) => void, onViewSummary: (date: Date) => void }> = ({ activity, onEdit, onDelete, onViewSummary }) => {
    const { id, type, details, eventTime } = activity;
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    const renderDetails = () => {
        switch (type) {
            case 'sleep':
                return <p>Slept for <strong>{details.duration}</strong>. From {new Date(details.startTime!).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} to {new Date(details.endTime!).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>;
            case 'feeding':
                return <p><strong>{details.feedType?.charAt(0).toUpperCase() + details.feedType!.slice(1)}</strong> feeding: <strong>{details.amount}</strong>.</p>;
            case 'diaper':
                return <p>Diaper change: <strong>{details.diaperType}</strong>.</p>;
            case 'note':
                return <p>Note: <strong>{details.note}</strong></p>;
            default:
                return null;
        }
    }

    return (
        <div className="flex items-start space-x-4 p-4 border-b border-gray-200 last:border-b-0">
            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${ICON_COLORS[type]}`}>
                {ICONS[type]}
            </div>
            <div className="flex-grow cursor-pointer" onClick={() => onViewSummary(eventTime)}>
                <div className="flex justify-between items-center">
                    <p className="font-semibold text-gray-800 capitalize">{type}</p>
                    <p className="text-sm text-gray-500">{eventTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                </div>
                <div className="text-gray-600 text-sm mt-1">{renderDetails()}</div>
            </div>
            <div className="relative">
                <button onClick={() => setIsMenuOpen(prev => !prev)} className="p-1 rounded-full hover:bg-gray-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" /></svg>
                </button>
                <div className={`absolute right-0 mt-2 w-28 bg-white rounded-md shadow-lg z-10 border border-gray-200 origin-top-right transition-all duration-150 ease-out ${isMenuOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                    <button onClick={() => { onEdit(); setIsMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-t-md">Edit</button>
                    <button onClick={() => { onDelete(id); setIsMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 rounded-b-md">Delete</button>
                </div>
            </div>
        </div>
    );
}

const SleepTracker: React.FC = () => {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalConfig, setModalConfig] = useState<{ type: ActivityType, activity?: Activity } | null>(null);
    const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
    const [selectedDateForSummary, setSelectedDateForSummary] = useState<Date | null>(null);
    const activityStorageKey = 'babyActivities';


    useEffect(() => {
        // REAL-TIME SYNC NOTE:
        // In a real multi-user application, this effect would be replaced
        // with a real-time listener to a backend database (like Firestore or Supabase).
        // It would subscribe to changes in the shared baby log and update the 'activities'
        // state automatically whenever another caregiver adds or modifies an entry.
        // For example: const unsubscribe = db.collection('logs').doc(profileId).onSnapshot(snapshot => ...);
        try {
            const savedActivities = localStorage.getItem(activityStorageKey);
            if (savedActivities) {
                const parsed = JSON.parse(savedActivities).map((a: any) => ({
                    ...a,
                    eventTime: new Date(a.eventTime)
                }));
                setActivities(parsed);
            } else {
                setActivities([]); // Clear activities
            }
        } catch (error) {
            console.error("Failed to load activities from localStorage", error);
        }
    }, [activityStorageKey]);

    useEffect(() => {
        // REAL-TIME SYNC NOTE:
        // Instead of writing to localStorage, a real application would write
        // this data to a shared backend database. The real-time listener
        // (mentioned above) would then distribute the change to all connected devices.
        try {
            localStorage.setItem(activityStorageKey, JSON.stringify(activities));
        } catch (error) {
            console.error("Failed to save activities to localStorage", error);
        }
    }, [activities, activityStorageKey]);

    const openModal = (type: ActivityType, activityToEdit?: Activity) => {
        setModalConfig({ type, activity: activityToEdit });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setModalConfig(null);
        setIsModalOpen(false);
    };

    const openSummaryModal = (date: Date) => {
        setSelectedDateForSummary(date);
        setIsSummaryModalOpen(true);
    };

    const closeSummaryModal = () => {
        setIsSummaryModalOpen(false);
        setSelectedDateForSummary(null);
    };

    const handleSaveActivity = (activityData: Omit<Activity, 'eventTime'> & { id?: string; eventTime: string }) => {
        let updatedActivities;
        const activityTime = new Date(activityData.eventTime);

        if (activityData.id) { // This is an update
            updatedActivities = activities.map(act =>
                act.id === activityData.id
                ? { ...act, type: activityData.type, details: activityData.details, eventTime: activityTime }
                : act
            );
        } else { // This is a new entry
            const newActivity: Activity = {
                id: crypto.randomUUID(),
                type: activityData.type,
                details: activityData.details,
                eventTime: activityTime,
            };
            updatedActivities = [newActivity, ...activities];
        }

        updatedActivities.sort((a, b) => b.eventTime.getTime() - a.eventTime.getTime());
        setActivities(updatedActivities);
        closeModal();
        openSummaryModal(activityTime); // Immediately show the summary for the day of the logged activity
    };

    const handleDeleteActivity = (id: string) => {
        if (window.confirm("Are you sure you want to delete this log?")) {
            setActivities(prev => prev.filter(act => act.id !== id));
        }
    };
    
    return (
        <>
            <div className="space-y-8">
                <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Daily Activity Log</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <button onClick={() => openModal('sleep')} className="p-4 bg-indigo-100 text-indigo-700 rounded-lg font-semibold hover:bg-indigo-200 transition-colors">Log Sleep</button>
                        <button onClick={() => openModal('feeding')} className="p-4 bg-pink-100 text-pink-700 rounded-lg font-semibold hover:bg-pink-200 transition-colors">Log Feeding</button>
                        <button onClick={() => openModal('diaper')} className="p-4 bg-yellow-100 text-yellow-700 rounded-lg font-semibold hover:bg-yellow-200 transition-colors">Log Diaper</button>
                        <button onClick={() => openModal('note')} className="p-4 bg-green-100 text-green-700 rounded-lg font-semibold hover:bg-green-200 transition-colors">Add Note</button>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold text-gray-700 mb-4">Recent Activity</h3>
                        <div className="border border-gray-200 rounded-lg max-h-[30rem] overflow-y-auto">
                            {activities.length > 0 ? (
                                activities.map(activity => (
                                    <ActivityItem 
                                        key={activity.id} 
                                        activity={activity} 
                                        onEdit={() => openModal(activity.type, activity)} 
                                        onDelete={handleDeleteActivity}
                                        onViewSummary={openSummaryModal}
                                    />
                                ))
                            ) : (
                                <div className="text-center p-12 text-gray-500">
                                    <p>No activities logged yet.</p>
                                    <p className="text-sm">Click a button above to get started!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {isModalOpen && <LogActivityModal config={modalConfig} onClose={closeModal} onSave={handleSaveActivity} />}
            {isSummaryModalOpen && <DailySummaryModal date={selectedDateForSummary} activities={activities} onClose={closeSummaryModal} />}
        </>
    );
};

export default SleepTracker;