import React, { useState, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';

const MicIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
        <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
        <line x1="12" y1="19" x2="12" y2="23"></line>
        <line x1="8" y1="23" x2="16" y2="23"></line>
    </svg>
);

const StopIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0">
        <rect x="6" y="6" width="12" height="12" rx="2" ry="2" />
    </svg>
);

const BackArrowIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="19" y1="12" x2="5" y2="12"></line>
        <polyline points="12 19 5 12 12 5"></polyline>
    </svg>
);

interface AudioTranscriberProps {
    onBack: () => void;
}

const AudioTranscriber: React.FC<AudioTranscriberProps> = ({ onBack }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [transcription, setTranscription] = useState('');
    const [error, setError] = useState<string | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    const startRecording = async () => {
        setError(null);
        setTranscription('');
        
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            
            // Determine supported mime type
            let mimeType = 'audio/webm';
            if (MediaRecorder.isTypeSupported('audio/mp4')) {
                mimeType = 'audio/mp4'; // Safari often prefers this
            } else if (MediaRecorder.isTypeSupported('audio/webm')) {
                mimeType = 'audio/webm'; // Chrome/Firefox
            }
            
            const mediaRecorder = new MediaRecorder(stream, { mimeType });
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(chunksRef.current, { type: mimeType });
                await processAudio(audioBlob, mimeType);
                
                // Stop all audio tracks to release microphone
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch (err) {
            console.error('Error accessing microphone:', err);
            setError('Could not access microphone. Please ensure permissions are granted and try again.');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const processAudio = async (blob: Blob, mimeType: string) => {
        setIsProcessing(true);
        try {
            const base64Data = await blobToBase64(blob);
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: {
                    parts: [
                        { inlineData: { mimeType: mimeType, data: base64Data } },
                        { text: 'Transcribe the spoken content in this audio file clearly and accurately. If there is no speech, describe the sound.' }
                    ]
                }
            });

            setTranscription(response.text || 'No transcription available.');
        } catch (err) {
            console.error('Transcription failed:', err);
            setError('Failed to transcribe audio. Please check your connection and try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    const blobToBase64 = (blob: Blob): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                // Remove data URL prefix (e.g., "data:audio/webm;base64,")
                const base64 = result.split(',')[1];
                resolve(base64);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <div className="flex items-center mb-6">
                 <button onClick={onBack} className="mr-4 p-2 rounded-full hover:bg-gray-200 transition-colors" aria-label="Go back">
                     <BackArrowIcon className="w-6 h-6 text-gray-700" />
                 </button>
                 <h2 className="text-2xl font-bold text-gray-800">Audio Transcription</h2>
            </div>
            
            <p className="text-gray-600 mb-8">Record voice notes, baby sounds, or reminders, and let our AI transcribe them into text for you instantly.</p>

            <div className="flex flex-col items-center justify-center py-8 bg-gray-50 rounded-xl border border-gray-200">
                <div className="relative">
                    {isRecording && (
                        <div className="absolute inset-0 rounded-full bg-red-400 opacity-20 animate-ping"></div>
                    )}
                    <button
                        onClick={isRecording ? stopRecording : startRecording}
                        disabled={isProcessing}
                        className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
                            isProcessing 
                                ? 'bg-gray-300 cursor-not-allowed' 
                                : isRecording 
                                    ? 'bg-red-500 hover:bg-red-600' 
                                    : 'bg-[#A18AFF] hover:bg-[#8e7fde]'
                        }`}
                    >
                        {isProcessing ? (
                            <svg className="animate-spin h-10 w-10 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : isRecording ? (
                            <StopIcon className="w-10 h-10 text-white" />
                        ) : (
                            <MicIcon className="w-10 h-10 text-white" />
                        )}
                    </button>
                </div>

                <p className="mt-6 text-lg font-semibold text-gray-700">
                    {isProcessing ? 'Processing audio...' : isRecording ? 'Recording... Tap to stop' : 'Tap to Record'}
                </p>
                {error && <p className="mt-2 text-red-500 text-sm max-w-md text-center">{error}</p>}
            </div>

            {transcription && (
                <div className="mt-8 p-6 bg-indigo-50 border border-indigo-100 rounded-xl">
                    <h3 className="text-lg font-bold text-indigo-900 mb-2">Transcription Result:</h3>
                    <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{transcription}</p>
                    <button 
                        onClick={() => navigator.clipboard.writeText(transcription)}
                        className="mt-4 text-sm text-indigo-600 font-semibold hover:text-indigo-800 flex items-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copy Text
                    </button>
                </div>
            )}
        </div>
    );
};

export default AudioTranscriber;
