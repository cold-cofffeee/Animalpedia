import React, { useState, useRef, useEffect } from 'react';
import { identifyAnimalSound } from '../services/geminiService';
import { AnimalSoundIdentification } from '../types';
import MicrophoneIcon from './icons/MicrophoneIcon';
import Spinner from './Spinner';
import LightbulbIcon from './icons/LightbulbIcon';
import PawIcon from './icons/PawIcon';

const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = (reader.result as string).split(',')[1];
            resolve(base64String);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

const ResultCard: React.FC<{ result: AnimalSoundIdentification }> = ({ result }) => {
    const confidenceColor = {
        'High': 'text-green-600 bg-green-100',
        'Medium': 'text-yellow-600 bg-yellow-100',
        'Low': 'text-orange-600 bg-orange-100',
        'Uncertain': 'text-red-600 bg-red-100',
    }[result.confidence];
    
    return (
        <div className="bg-white rounded-xl shadow-lg p-6 mt-8 animate-fade-in border border-slate-200">
             <div className="flex justify-between items-start">
                 <div>
                    <h3 className="text-2xl font-bold text-slate-800">{result.animalName}</h3>
                    <p className="font-mono text-sm text-sky-600">{result.scientificName}</p>
                 </div>
                 <span className={`px-3 py-1 text-sm font-semibold rounded-full ${confidenceColor}`}>
                     {result.confidence} Confidence
                 </span>
            </div>
            <div className="flex items-start gap-4 mt-4 p-4 bg-slate-50 rounded-lg">
                <LightbulbIcon className="w-6 h-6 text-sky-500 flex-shrink-0 mt-1" />
                <p className="text-slate-700">{result.interestingFact}</p>
            </div>
        </div>
    )
}

const SoundIdentifier: React.FC = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<AnimalSoundIdentification | null>(null);
    const [error, setError] = useState<string | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const streamRef = useRef<MediaStream | null>(null);
    
    useEffect(() => {
        // Cleanup function to stop media stream when component unmounts
        return () => {
             streamRef.current?.getTracks().forEach(track => track.stop());
        }
    }, []);

    const handleStartRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;
            const options = { mimeType: 'audio/webm' };
            const mediaRecorder = new MediaRecorder(stream, options);

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) audioChunksRef.current.push(event.data);
            };

            mediaRecorder.onstop = async () => {
                const mimeType = mediaRecorder.mimeType;
                const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
                audioChunksRef.current = [];

                if (audioBlob.size === 0) {
                    setError("No audio was recorded. Please try again.");
                    setIsLoading(false);
                    return;
                }

                const base64Audio = await blobToBase64(audioBlob);
                const identificationResult = await identifyAnimalSound(base64Audio, mimeType);
                setResult(identificationResult);
                setIsLoading(false);
            };

            mediaRecorderRef.current = mediaRecorder;
            mediaRecorder.start();
            setIsRecording(true);
            setError(null);
            setResult(null);
        } catch (err) {
            console.error("Error accessing microphone:", err);
            setError("Could not access microphone. Please ensure permissions are granted.");
        }
    };

    const handleStopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
             streamRef.current?.getTracks().forEach(track => track.stop());
            setIsRecording(false);
            setIsLoading(true);
        }
    };

    const RecordButton = () => (
        <button
            onClick={isRecording ? handleStopRecording : handleStartRecording}
            className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${
                isRecording ? 'bg-red-500 hover:bg-red-600 animate-pulse-slow' : 'bg-sky-500 hover:bg-sky-600'
            }`}
            aria-label={isRecording ? 'Stop recording' : 'Start recording'}
        >
            <MicrophoneIcon className="w-10 h-10 text-white" />
        </button>
    );

    return (
        <div className="bg-white/80 rounded-2xl shadow-xl p-6 sm:p-8 backdrop-blur-lg border border-slate-200 animate-fade-in">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-slate-900">Animal Sound Identifier</h2>
                <p className="mt-2 text-slate-600 max-w-xl mx-auto">
                    Record an animal sound and let our AI try to identify it for you. For best results, use a clear recording with minimal background noise.
                </p>
            </div>

            <div className="my-10 flex flex-col items-center justify-center">
                {isLoading ? (
                     <div className="text-center">
                         <Spinner className="w-12 h-12 text-sky-500 mx-auto" />
                         <p className="mt-4 text-slate-600">Analyzing sound...</p>
                     </div>
                ) : (
                    <RecordButton />
                )}
                 <p className="mt-4 font-semibold text-slate-700 h-6">
                    {isRecording ? "Recording..." : (isLoading ? "" : "Tap to record")}
                 </p>
            </div>

            {error && (
                <div className="text-center text-red-600 bg-red-100 p-3 rounded-lg">{error}</div>
            )}

            {result && <ResultCard result={result} />}
        </div>
    );
};

export default SoundIdentifier;