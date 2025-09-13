import React, { useState, useMemo, useEffect } from 'react';
import { animalpediaData } from '../data/animalpediaData';
import { AnimalpediaEntry, IUCNStatus } from '../types';
import BackIcon from './icons/BackIcon';
import AnimalChat from './AnimalChat';
import { fetchAnimalDataByName } from '../services/geminiService';
import IUCNStatusBadge from './IUCNStatusBadge';
import HumanComparison from './HumanComparison';
import SparklesIcon from './icons/SparklesIcon';
import Spinner from './Spinner';

const InfoCard: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className }) => (
    <div className={`border-t border-slate-200 pt-4 ${className}`}>
        <h3 className="font-semibold text-slate-800 mb-1">{title}</h3>
        <div className="text-slate-600 space-y-2">{children}</div>
    </div>
);

const RelatedAnimalCard: React.FC<{ animal: AnimalpediaEntry; onClick: () => void }> = ({ animal, onClick }) => (
    <button onClick={onClick} className="group text-left w-full">
        <div className="aspect-[4/3] rounded-lg overflow-hidden mb-2">
            <img src={animal.imageUrl} alt={animal.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
        </div>
        <h4 className="font-semibold text-slate-800 group-hover:text-sky-600">{animal.name}</h4>
        <p className="text-sm text-slate-500">{animal.scientificName}</p>
    </button>
);

const FilterSelect: React.FC<{ label: string; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; options: { value: string; label: string }[] }> = ({ label, value, onChange, options }) => (
    <div>
        <label htmlFor={`${label}-filter`} className="sr-only">{label}</label>
        <select
            id={`${label}-filter`}
            value={value}
            onChange={onChange}
            className="w-full px-3 py-2 border border-slate-300 rounded-full bg-white shadow-sm focus:ring-sky-500 focus:border-sky-500 transition text-sm text-slate-700"
        >
            {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
    </div>
);

interface AnimalpediaProps {
    initialSearchTerm: string;
    clearSearchTerm: () => void;
}

const Animalpedia: React.FC<AnimalpediaProps> = ({ initialSearchTerm, clearSearchTerm }) => {
    const [animals, setAnimals] = useState<AnimalpediaEntry[]>(animalpediaData);
    const [selectedAnimal, setSelectedAnimal] = useState<AnimalpediaEntry | null>(null);
    const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
    const [iucnFilter, setIucnFilter] = useState('all');
    const [dietFilter, setDietFilter] = useState('all');
    const [regionFilter, setRegionFilter] = useState('all');
    const [isAiSearching, setIsAiSearching] = useState(false);
    const [aiSearchError, setAiSearchError] = useState<string | null>(null);

    useEffect(() => {
        // When the component unmounts, clear the initial search term in the App state
        return () => {
            clearSearchTerm();
        };
    }, [clearSearchTerm]);

    const iucnOptions: IUCNStatus[] = ['Least Concern', 'Near Threatened', 'Vulnerable', 'Endangered', 'Critically Endangered'];
    const dietOptions = ['Carnivore', 'Herbivore', 'Omnivore'];
    const regionOptions = ['Africa', 'Asia', 'North America', 'South America', 'Antarctica', 'Europe', 'Australia', 'Oceans', 'Global'];

    const filteredAnimals = useMemo(() => {
        return animals.filter(animal =>
            animal.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (iucnFilter === 'all' || animal.iucnStatus === iucnFilter) &&
            (dietFilter === 'all' || animal.diet === dietFilter) &&
            (regionFilter === 'all' || animal.region === regionFilter)
        );
    }, [searchTerm, iucnFilter, dietFilter, regionFilter, animals]);
    
    const handleAiSearch = async () => {
        if (!searchTerm.trim()) return;
        setIsAiSearching(true);
        setAiSearchError(null);
        const newAnimal = await fetchAnimalDataByName(searchTerm);
        setIsAiSearching(false);

        if (newAnimal) {
            if (!animals.some(a => a.id.toLowerCase() === newAnimal.id.toLowerCase())) {
                 setAnimals(prev => [...prev, newAnimal]);
            }
            setSelectedAnimal(newAnimal);
            setSearchTerm('');
        } else {
            setAiSearchError(`Sorry, the AI could not find comprehensive data for "${searchTerm}". Please try a different name or check your spelling.`);
        }
    };

    const TaxonomyDisplay: React.FC<{ taxonomy: AnimalpediaEntry['taxonomy'] }> = ({ taxonomy }) => (
        <p className="flex flex-wrap text-xs text-slate-500">
            {Object.entries(taxonomy).map(([key, value], index, arr) => (
                <span key={key}>
                    <em>{key.charAt(0).toUpperCase() + key.slice(1)}:</em>&nbsp;{value}{index < arr.length - 1 && <>&nbsp;&nbsp;|&nbsp;&nbsp;</>}
                </span>
            ))}
        </p>
    );

    if (selectedAnimal) {
        const relatedSpecies = (selectedAnimal.related ?? [])
            .map(id => animals.find(animal => animal.id === id))
            .filter((animal): animal is AnimalpediaEntry => !!animal);

        return (
            <div className="animate-fade-in">
                <div className="bg-white/80 rounded-2xl shadow-lg p-6 sm:p-8 backdrop-blur-lg border border-slate-200 relative">
                    <button onClick={() => setSelectedAnimal(null)} className="absolute top-4 left-4 text-slate-500 hover:text-slate-800 transition-colors z-10" aria-label="Back to species list">
                        <BackIcon className="w-6 h-6" />
                    </button>
                    <div className="flex flex-col md:flex-row gap-8 pt-8 md:pt-0">
                        <div className="md:w-1/3">
                            <img src={selectedAnimal.imageUrl} alt={selectedAnimal.name} className="w-full h-auto object-cover rounded-lg shadow-lg sticky top-24" />
                        </div>
                        <div className="md:w-2/3 space-y-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-3xl font-bold text-slate-900">{selectedAnimal.name}</h2>
                                    <p className="text-sm font-mono text-sky-600">{selectedAnimal.scientificName}</p>
                                </div>
                                <IUCNStatusBadge status={selectedAnimal.iucnStatus} />
                            </div>
                            <p className="text-slate-700 leading-relaxed">{selectedAnimal.description}</p>

                            <div className="space-y-4 pt-2">
                                <InfoCard title="Taxonomy"><TaxonomyDisplay taxonomy={selectedAnimal.taxonomy} /></InfoCard>
                                <InfoCard title="Habitat">{selectedAnimal.habitat}</InfoCard>
                                <InfoCard title="Food Chain">
                                    <p><strong>Role:</strong> {selectedAnimal.foodChain.role}</p>
                                    <p><strong>Diet:</strong> {selectedAnimal.diet}</p>
                                    {selectedAnimal.foodChain.prey.length > 0 && <p><strong>Prey:</strong> {selectedAnimal.foodChain.prey.join(', ')}</p>}
                                    {selectedAnimal.foodChain.predators.length > 0 && <p><strong>Predators:</strong> {selectedAnimal.foodChain.predators.join(', ')}</p>}
                                </InfoCard>
                                <InfoCard title="Average Lifespan">{selectedAnimal.lifespan}</InfoCard>
                                <InfoCard title="Fun Fact"><span className="italic">{selectedAnimal.funFact}</span></InfoCard>
                                <InfoCard title="Evolutionary History"><p>{selectedAnimal.evolutionaryHistory}</p></InfoCard>
                            </div>
                        </div>
                    </div>
                    <HumanComparison animal={selectedAnimal} />
                    {relatedSpecies.length > 0 && (
                        <div className="mt-12 border-t border-slate-200 pt-8">
                            <h3 className="text-2xl font-bold text-slate-900 mb-4">Related Species</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                                {relatedSpecies.map(animal => (
                                    <RelatedAnimalCard key={animal.id} animal={animal} onClick={() => setSelectedAnimal(animal)} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <AnimalChat animal={selectedAnimal} />
            </div>
        )
    }

    return (
        <div className="bg-white/80 rounded-2xl shadow-lg p-6 sm:p-8 backdrop-blur-lg border border-slate-200 animate-fade-in">
            <div className="mb-8 max-w-lg mx-auto space-y-4">
                 <input
                    type="search"
                    placeholder="Search by name (e.g., Fennec Fox)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-full shadow-sm focus:ring-sky-500 focus:border-sky-500 transition text-base"
                    aria-label="Search for an animal"
                />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <FilterSelect label="Filter by IUCN Status" value={iucnFilter} onChange={e => setIucnFilter(e.target.value)} options={[{ value: 'all', label: 'All IUCN Statuses' }, ...iucnOptions.map(o => ({ value: o, label: o }))]} />
                    <FilterSelect label="Filter by Diet" value={dietFilter} onChange={e => setDietFilter(e.target.value)} options={[{ value: 'all', label: 'All Diets' }, ...dietOptions.map(o => ({ value: o, label: o }))]} />
                    <FilterSelect label="Filter by Region" value={regionFilter} onChange={e => setRegionFilter(e.target.value)} options={[{ value: 'all', label: 'All Regions' }, ...regionOptions.map(o => ({ value: o, label: o }))]} />
                </div>
            </div>

            <h2 className="text-2xl font-bold text-center text-slate-900 mb-6">Browse Species</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredAnimals.map(animal => (
                    <button key={animal.id} onClick={() => setSelectedAnimal(animal)} className="group aspect-square relative rounded-lg overflow-hidden focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-white transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-1">
                        <img src={animal.imageUrl} alt={animal.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent transition-opacity duration-300 flex items-end p-2">
                            <p className="font-bold text-white text-sm">{animal.name}</p>
                        </div>
                    </button>
                ))}
            </div>
            
            {isAiSearching && (
                <div className="text-center py-8">
                    <Spinner className="w-10 h-10 text-sky-500 mx-auto" />
                    <p className="mt-4 text-slate-600 font-semibold">Searching the web for "{searchTerm}"...</p>
                </div>
            )}

            {filteredAnimals.length === 0 && !isAiSearching && (
                <div className="text-center text-slate-500 mt-8 py-8 bg-slate-50 rounded-lg">
                    <p className="font-semibold">No animals found matching your search.</p>
                    {searchTerm && (
                        <div className="mt-4">
                             <p className="text-sm mb-4">Want to search the web for "{searchTerm}"?</p>
                             <button
                                onClick={handleAiSearch}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-sky-500 text-white font-semibold rounded-full hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transition text-sm"
                            >
                                <SparklesIcon className="w-5 h-5" />
                                Search with AI
                            </button>
                        </div>
                    )}
                </div>
            )}

            {aiSearchError && (
                 <div className="text-center text-red-600 bg-red-100 p-4 rounded-lg mt-8">{aiSearchError}</div>
            )}
        </div>
    );
};

export default Animalpedia;