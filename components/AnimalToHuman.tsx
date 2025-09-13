import React, { useState } from 'react';
import { animalpediaData } from '../data/animalpediaData';
import { generateHumanPersona } from '../services/geminiService';
import Spinner from './Spinner';
import MarkdownRenderer from './MarkdownRenderer';

const AnimalToHuman: React.FC = () => {
    const [selectedAnimal, setSelectedAnimal] = useState('');
    const [persona, setPersona] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedAnimal) return;
        
        setIsLoading(true);
        setPersona(null);
        const result = await generateHumanPersona(selectedAnimal);
        setPersona(result);
        setIsLoading(false);
    };

    return (
        <div className="animate-fade-in">
            <form onSubmit={handleSubmit} className="max-w-md mx-auto flex items-center gap-4">
                <label htmlFor="animal-select" className="sr-only">Select an animal</label>
                <select
                    id="animal-select"
                    value={selectedAnimal}
                    onChange={e => setSelectedAnimal(e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-full bg-white shadow-sm focus:ring-sky-500 focus:border-sky-500 transition"
                >
                    <option value="">-- Choose an animal --</option>
                    {animalpediaData.map(animal => (
                        <option key={animal.id} value={animal.name}>{animal.name}</option>
                    ))}
                </select>
                <button
                    type="submit"
                    disabled={!selectedAnimal || isLoading}
                    className="px-6 py-3 bg-sky-500 text-white font-semibold rounded-full hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transition disabled:bg-slate-400 disabled:cursor-not-allowed"
                >
                    Generate
                </button>
            </form>

            <div className="mt-8 min-h-[200px] max-w-lg mx-auto">
                 {isLoading && (
                    <div className="text-center py-12">
                        <Spinner className="w-12 h-12 text-sky-500 mx-auto" />
                        <p className="mt-4 text-slate-600 font-semibold">Imagining a human {selectedAnimal}...</p>
                    </div>
                )}
                {persona && (
                    <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 animate-fade-in">
                         <h3 className="text-2xl font-bold text-slate-800 mb-4 text-center">The {selectedAnimal} as a Human</h3>
                         <div className="prose prose-slate max-w-none">
                            <MarkdownRenderer content={persona} />
                         </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AnimalToHuman;