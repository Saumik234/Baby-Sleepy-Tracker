import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';

const PlayIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1">
        <path d="M8 5v14l11-7z" />
    </svg>
);

const PauseIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1">
        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
);

const SpinnerIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

// --- Audio Helper Functions ---
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const songData = [
    {
        id: 'good-morning',
        name: 'Good Morning',
        category: 'Wake Up',
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
        prompt: 'Generate a happy, gentle morning ringtone for a baby. Soft bells, light piano, and distant birds chirping. A gradually rising tempo to wake up the baby with a smile. Cheerful and sunny.',
        color: 'bg-yellow-100',
        textColor: 'text-yellow-900',
        borderColor: 'border-yellow-200',
        defaultLoop: true,
    },
    {
        id: 'good-afternoon',
        name: 'Good Afternoon',
        category: 'Nap Time',
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999A5.002 5.002 0 1012 5a4.475 4.475 0 00-4.225 3.125A4.002 4.002 0 003 15z" /></svg>,
        prompt: 'Generate a peaceful, calming afternoon lullaby ringtone. Slow acoustic guitar or soft flute. Relaxing and steady, perfect for settling down for a midday nap. Warm and cozy.',
        color: 'bg-teal-100',
        textColor: 'text-teal-900',
        borderColor: 'border-teal-200',
        defaultLoop: true,
    },
    {
        id: 'good-night',
        name: 'Good Night',
        category: 'Bedtime',
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>,
        prompt: 'Generate a deep sleep ringtone for nighttime. Very slow tempo, low-frequency white noise mixed with a soft, dreamy harp melody. Hypnotic and soothing to help a baby sleep through the night.',
        color: 'bg-indigo-100',
        textColor: 'text-indigo-900',
        borderColor: 'border-indigo-200',
        defaultLoop: true,
    }
];


const TIMER_OPTIONS = [0, 15, 30, 45, 60];

interface SoundsProps {
    onBack: () => void;
}

const Sounds: React.FC<SoundsProps> = ({ onBack }) => {
    const [playingSoundId, setPlayingSoundId] = useState<string | null>(null);
    const [soundSettings, setSoundSettings] = useState<Record<string, { isLooping: boolean; timerDuration: number }>>({});
    const [generatedSounds, setGeneratedSounds] = useState<Record<string, AudioBuffer>>({});
    const [loadingSoundId, setLoadingSoundId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    
    const audioContextRef = useRef<AudioContext | null>(null);
    const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const stopCurrentSound = useCallback(() => {
        if (sourceNodeRef.current) {
            sourceNodeRef.current.stop();
            sourceNodeRef.current.disconnect();
            sourceNodeRef.current = null;
        }
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
        setPlayingSoundId(null);
    }, []);

    useEffect(() => {
        try {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        } catch (e) {
            setError("Your browser does not support the Web Audio API.");
        }

        const initialSettings: Record<string, { isLooping: boolean; timerDuration: number }> = {};
        songData.forEach(song => {
            initialSettings[song.id] = { isLooping: song.defaultLoop, timerDuration: 0 };
        });
        setSoundSettings(initialSettings);

        return () => {
            stopCurrentSound();
            audioContextRef.current?.close();
        };
    }, [stopCurrentSound]);
    
    const playSound = (soundId: string, buffer: AudioBuffer) => {
        if (!audioContextRef.current) return;

        const audioContext = audioContextRef.current;
        const settings = soundSettings[soundId];
        
        const source = audioContext.createBufferSource();
        source.buffer = buffer;
        source.loop = settings.isLooping;
        source.connect(audioContext.destination);
        source.start();

        source.onended = () => {
            if (playingSoundId === soundId && !settings.isLooping) {
                 setPlayingSoundId(null);
                 sourceNodeRef.current = null;
            }
        };

        sourceNodeRef.current = source;
        setPlayingSoundId(soundId);

        if (settings.timerDuration > 0) {
            timerRef.current = setTimeout(() => {
                stopCurrentSound();
            }, settings.timerDuration * 60 * 1000);
        }
    };

    const handlePlayToggle = async (soundId: string, soundPrompt: string) => {
        const isCurrentlyPlaying = playingSoundId === soundId;
        setError(null);
        stopCurrentSound();

        if (isCurrentlyPlaying) return;

        if (generatedSounds[soundId]) {
            playSound(soundId, generatedSounds[soundId]);
            return;
        }

        setLoadingSoundId(soundId);
        try {
             if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
                 await audioContextRef.current.resume();
            }

            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash-preview-tts",
                contents: [{ parts: [{ text: soundPrompt }] }],
                config: { 
                    responseModalities: [Modality.AUDIO],
                    speechConfig: {
                        voiceConfig: {
                          prebuiltVoiceConfig: { voiceName: 'Kore' },
                        },
                    },
                },
            });
            const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

            if (base64Audio && audioContextRef.current) {
                const audioBytes = decode(base64Audio);
                const audioBuffer = await decodeAudioData(audioBytes, audioContextRef.current, 24000, 1);
                
                setGeneratedSounds(prev => ({ ...prev, [soundId]: audioBuffer }));
                playSound(soundId, audioBuffer);
            } else {
                throw new Error("No audio data was returned from the API.");
            }
        } catch (e) {
            console.error(e);
            setError("Sorry, we couldn't create that sound right now. Please try again.");
        } finally {
            setLoadingSoundId(null);
        }
    };
    
    const handleLoopToggle = (soundId: string) => {
        const newSettings = {
            ...soundSettings,
            [soundId]: {
                ...soundSettings[soundId],
                isLooping: !soundSettings[soundId].isLooping,
            },
        };
        setSoundSettings(newSettings);

        if (playingSoundId === soundId && sourceNodeRef.current) {
            sourceNodeRef.current.loop = newSettings[soundId].isLooping;
        }
    };
    
    const handleTimerChange = (soundId: string, duration: number) => {
        setSoundSettings(prevSettings => ({
            ...prevSettings,
            [soundId]: {
                ...prevSettings[soundId],
                timerDuration: duration,
            },
        }));
        
        if (playingSoundId === soundId) {
            if (timerRef.current) clearTimeout(timerRef.current);
            if (duration > 0) {
                timerRef.current = setTimeout(() => {
                    stopCurrentSound();
                }, duration * 60 * 1000);
            }
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <div className="flex items-center mb-6">
                 <button onClick={onBack} className="mr-4 p-2 rounded-full hover:bg-gray-200 transition-colors" aria-label="Go back">
                     <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                         <line x1="19" y1="12" x2="5" y2="12"></line>
                         <polyline points="12 19 5 12 12 5"></polyline>
                     </svg>
                 </button>
                 <h2 className="text-2xl font-bold text-gray-800">Baby Sleep Ringtones</h2>
            </div>
            
            <p className="text-gray-600 mb-8">Tap to generate the perfect ringtone for your baby's routine. Whether it's time to wake up, nap, or go to sleep for the night.</p>
            {error && <p className="text-red-500 mb-4 text-center font-semibold">{error}</p>}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {songData.map(song => {
                    const settings = soundSettings[song.id] || { isLooping: song.defaultLoop, timerDuration: 0 };
                    const isPlaying = playingSoundId === song.id;
                    const isLoading = loadingSoundId === song.id;

                    return (
                        <div key={song.id} className={`${song.color} ${song.textColor} border ${song.borderColor} rounded-2xl p-6 flex flex-col justify-between text-center transition-all duration-300 shadow-sm hover:shadow-lg relative overflow-hidden group h-full`}>
                            
                            <div className="absolute top-3 right-3">
                                <span className="bg-white/60 backdrop-blur-sm px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">{song.category}</span>
                            </div>

                            <div className="flex flex-col items-center pt-8">
                                <div className="p-4 bg-white/40 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                                    {song.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-1">{song.name}</h3>
                                <p className="text-xs opacity-75 mb-4">AI Generated</p>
                            </div>
                            
                            <button
                                onClick={() => handlePlayToggle(song.id, song.prompt)}
                                disabled={isLoading}
                                className={`w-20 h-20 mx-auto my-4 rounded-full flex items-center justify-center ${isPlaying ? 'bg-white shadow-inner' : 'bg-white shadow-lg hover:scale-105'} transition-all text-current disabled:opacity-50 disabled:cursor-not-allowed`}
                                aria-label={isPlaying ? `Pause ${song.name}` : `Play ${song.name}`}
                            >
                                {isLoading ? <SpinnerIcon className="w-10 h-10"/> : (isPlaying ? <PauseIcon className="w-10 h-10" /> : <PlayIcon className="w-10 h-10 ml-1" />)}
                            </button>

                            <div className="bg-white/50 backdrop-blur-sm rounded-xl p-3 text-xs space-y-3 mt-4">
                                <div className="flex items-center justify-between">
                                    <label htmlFor={`loop-${song.id}`} className="font-semibold">Loop Audio</label>
                                    <button
                                      id={`loop-${song.id}`}
                                      onClick={() => handleLoopToggle(song.id)}
                                      className={`${settings.isLooping ? 'bg-green-500' : 'bg-gray-300'} relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none`}
                                      aria-pressed={settings.isLooping}
                                    >
                                      <span className={`${settings.isLooping ? 'translate-x-4' : 'translate-x-1'} inline-block h-3 w-3 transform rounded-full bg-white transition-transform`}/>
                                    </button>
                                </div>
                                <div className="flex items-center justify-between">
                                    <label htmlFor={`timer-${song.id}`} className="font-semibold">Sleep Timer</label>
                                    <select
                                        id={`timer-${song.id}`}
                                        value={settings.timerDuration}
                                        onChange={(e) => handleTimerChange(song.id, parseInt(e.target.value))}
                                        className="bg-white/80 border-none rounded-md py-1 px-2 text-xs font-medium focus:ring-0 focus:outline-none cursor-pointer"
                                    >
                                        {TIMER_OPTIONS.map(opt => (
                                            <option key={opt} value={opt}>{opt === 0 ? 'Off' : `${opt} min`}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

export default Sounds;