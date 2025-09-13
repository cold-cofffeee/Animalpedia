import React, { useState, useEffect } from 'react';
import { getDailyFact } from '../services/geminiService';
import LightbulbIcon from './icons/LightbulbIcon';
import { animalpediaData } from '../data/animalpediaData';
import AnimalMap from './AnimalMap';
import PhotoIcon from './icons/PhotoIcon';
import QuestionMarkCircleIcon from './icons/QuestionMarkCircleIcon';
import ArrowsRightLeftIcon from './icons/ArrowsRightLeftIcon';

interface DashboardProps {
    onSearch: (term: string) => void;
    setCurrentPage: (page: string) => void;
}

const FunFactCard: React.FC = () => {
    const [fact, setFact] = useState<string>('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        getDailyFact().then(newFact => {
            setFact(newFact);
            setLoading(false);
        });
    }, []);

    return (
        <div className="bg-sky-50 border-2 border-sky-200 rounded-2xl p-6 flex items-start gap-4">
            <LightbulbIcon className="w-8 h-8 text-sky-500 flex-shrink-0 mt-1" />
            <div>
                <h3 className="font-bold text-sky-800 text-lg">Did You Know?</h3>
                {loading ? (
                    <div className="h-5 bg-slate-200 rounded-full w-3/4 animate-pulse mt-1"></div>
                ) : (
                    <p className="text-sky-700">{fact}</p>
                )}
            </div>
        </div>
    );
};

const ToolCard: React.FC<{ title: string; description: string; icon: React.ReactNode; onClick: () => void; }> = ({ title, description, icon, onClick }) => (
    <button onClick={onClick} className="bg-slate-50/50 text-left p-6 rounded-2xl shadow-md hover:shadow-lg backdrop-blur-lg border border-slate-200/50 w-full flex flex-col items-start transition-all duration-300 hover:border-sky-300/50 hover:-translate-y-1 hover:scale-[1.02]">
        <div className="bg-gradient-to-br from-sky-400 to-sky-600 text-white p-3 rounded-lg mb-4 shadow-md">{icon}</div>
        <h3 className="font-bold text-slate-800 mb-1">{title}</h3>
        <p className="text-sm text-slate-600 flex-grow">{description}</p>
    </button>
);


const Dashboard: React.FC<DashboardProps> = ({ onSearch, setCurrentPage }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(searchTerm.trim()) {
            onSearch(searchTerm);
        }
    };
    
    const featuredAnimal = animalpediaData[Math.floor(Math.random() * animalpediaData.length)];

    return (
        <div className="space-y-12 animate-fade-in">
            {/* Hero Section */}
            <section className="text-center py-10 px-6 bg-white/80 rounded-2xl shadow-lg backdrop-blur-lg border border-slate-200">
                 <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-sky-500 to-indigo-600">
                    Welcome to Animalpedia
                </h1>
                <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
                    Your interactive guide to the amazing animal kingdom. What would you like to discover?
                </p>
                <form onSubmit={handleSearchSubmit} className="mt-8 max-w-md mx-auto">
                     <input
                        type="search"
                        placeholder="Search for any animal..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-5 py-3 border border-slate-300 rounded-full shadow-sm focus:ring-sky-500 focus:border-sky-500 transition text-base"
                        aria-label="Search for an animal"
                        autoFocus
                    />
                </form>
            </section>

            {/* Quick Tools */}
            <section>
                 <h2 className="text-2xl font-bold text-center text-slate-900 mb-6">Quick Tools</h2>
                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <ToolCard title="Image Identifier" description="Have a photo? Let our AI identify the animal for you." icon={<PhotoIcon className="w-6 h-6"/>} onClick={() => setCurrentPage('image-id')} />
                    <ToolCard title="Animal Quiz" description="Test your knowledge with fun trivia questions about the animal kingdom." icon={<QuestionMarkCircleIcon className="w-6 h-6"/>} onClick={() => setCurrentPage('quiz')} />
                    <ToolCard title="Compare Species" description="See two animals side-by-side to compare their unique traits." icon={<ArrowsRightLeftIcon className="w-6 h-6"/>} onClick={() => setCurrentPage('compare')} />
                 </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Featured Animal */}
                <section>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Featured Animal</h2>
                    <div className="bg-white/80 rounded-2xl shadow-lg backdrop-blur-lg border border-slate-200 overflow-hidden group">
                        <img src={featuredAnimal.imageUrl} alt={featuredAnimal.name} className="w-full h-56 object-cover"/>
                        <div className="p-6">
                            <h3 className="text-2xl font-bold text-slate-800">{featuredAnimal.name}</h3>
                            <p className="text-sm font-mono text-sky-600 mb-2">{featuredAnimal.scientificName}</p>
                            <p className="text-slate-600 text-sm mb-4">{featuredAnimal.description}</p>
                            <button onClick={() => onSearch(featuredAnimal.name)} className="text-sm font-semibold text-sky-600 hover:text-sky-700">Learn More &rarr;</button>
                        </div>
                    </div>
                </section>
                {/* Did you know card */}
                 <section>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Daily Fact</h2>
                    <FunFactCard />
                </section>
            </div>

            {/* Animal Map */}
            <section>
                <AnimalMap onAnimalClick={onSearch} />
            </section>

        </div>
    );
};

export default Dashboard;