import React, { useState } from 'react';
import { animalpediaData } from '../data/animalpediaData';
import { AnimalpediaEntry } from '../types';
import { generateSoundDescription } from '../services/geminiService';
import Spinner from './Spinner';
import MarkdownRenderer from './MarkdownRenderer';
import PlayIcon from './icons/PlayIcon';

const SoundLibrary: React.FC = () => {
    const [selectedAnimal, setSelectedAnimal] = useState<AnimalpediaEntry | null>(null);
    const [soundDescription, setSoundDescription] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);

    const handleAnimalSelect = async (animal: AnimalpediaEntry) => {
        setSelectedAnimal(animal);
        setIsLoading(true);
        setSoundDescription('');
        const description = await generateSoundDescription(animal.name);
        setSoundDescription(description);
        setIsLoading(false);
    };

    return (
        <div className="bg-white/80 rounded-2xl shadow-xl p-6 sm:p-8 backdrop-blur-lg border border-slate-200 animate-fade-in">
            <h2 className="text-3xl font-bold text-slate-900 mb-2 text-center">AI Sound Library</h2>
            <p className="text-slate-600 mb-6 text-center max-w-2xl mx-auto">
                Select an animal to learn about its unique sounds and what they mean, described by our AI.
            </p>

            <div className="flex flex-wrap justify-center gap-3 mb-8">
                {animalpediaData.map(animal => (
                    <button
                        key={animal.id}
                        onClick={() => handleAnimalSelect(animal)}
                        className={`px-4 py-2 text-sm font-semibold rounded-full border-2 transition-colors ${
                            selectedAnimal?.id === animal.id
                                ? 'bg-sky-500 text-white border-sky-500'
                                : 'bg-white text-slate-700 border-slate-300 hover:border-sky-500 hover:text-sky-600'
                        }`}
                    >
                        {animal.name}
                    </button>
                ))}
            </div>
            
            <div className="min-h-[300px] bg-slate-50 rounded-lg p-6 border border-slate-200">
                {!selectedAnimal && (
                    <div className="h-full flex flex-col justify-center items-center text-center">
                        <PlayIcon className="w-16 h-16 text-slate-300 mb-4" />
                        <p className="text-slate-500 font-medium">Please select an animal to begin.</p>
                    </div>
                )}
                
                {isLoading && (
                     <div className="h-full flex flex-col justify-center items-center text-center">
                         <Spinner className="w-10 h-10 text-sky-500" />
                         <p className="mt-4 text-slate-600">Generating sound description for the {selectedAnimal?.name}...</p>
                     </div>
                )}

                {selectedAnimal && !isLoading && soundDescription && (
                    <div className="animate-fade-in">
                        <div className="flex items-center gap-4 mb-4">
                             <img src={selectedAnimal.imageUrl} alt={selectedAnimal.name} className="w-20 h-20 object-cover rounded-full border-4 border-white shadow-md"/>
                             <div>
                                <h3 className="text-2xl font-bold text-slate-800">The Sounds of the {selectedAnimal.name}</h3>
                                <p className="font-mono text-sky-600">{selectedAnimal.scientificName}</p>
                             </div>
                        </div>
                        <div className="prose prose-slate max-w-none">
                             <MarkdownRenderer content={soundDescription} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SoundLibrary;