import React, { useState } from 'react';
import HumanToAnimal from './HumanToAnimal';
import AnimalToHuman from './AnimalToHuman';

type PersonaTab = 'h2a' | 'a2h';

const AnimalPersona: React.FC = () => {
    const [activeTab, setActiveTab] = useState<PersonaTab>('h2a');

    const TabButton: React.FC<{ tabId: PersonaTab; children: React.ReactNode }> = ({ tabId, children }) => (
        <button
            onClick={() => setActiveTab(tabId)}
            className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${
                activeTab === tabId
                    ? 'bg-sky-500 text-white'
                    : 'bg-white text-slate-700 hover:bg-slate-100'
            }`}
        >
            {children}
        </button>
    );

    return (
        <div className="bg-white/80 rounded-2xl shadow-xl p-6 sm:p-8 backdrop-blur-lg border border-slate-200 animate-fade-in">
            <h2 className="text-3xl font-bold text-slate-900 mb-2 text-center">AI Personas</h2>
            <p className="text-slate-600 mb-6 text-center max-w-2xl mx-auto">
                Discover your inner animal or imagine your favorite animal as a human with these fun, creative AI tools.
            </p>

            <div className="flex justify-center gap-4 mb-8 p-2 bg-slate-200/50 rounded-full">
                <TabButton tabId="h2a">What's My Animal Spirit?</TabButton>
                <TabButton tabId="a2h">Animal as a Human</TabButton>
            </div>

            <div>
                {activeTab === 'h2a' ? <HumanToAnimal /> : <AnimalToHuman />}
            </div>
        </div>
    );
};

export default AnimalPersona;