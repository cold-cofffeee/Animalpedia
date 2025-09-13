import React, { useState } from 'react';
import { animalpediaData } from '../data/animalpediaData';
import { AnimalpediaEntry } from '../types';
import MapPinIcon from './icons/MapPinIcon';

type Region = AnimalpediaEntry['region'] | 'All';

const ContinentPath: React.FC<{
    id: Region;
    d: string;
    name: string;
    activeRegion: Region;
    onHover: (region: Region | null) => void;
    onClick: (region: Region) => void;
}> = ({ id, d, name, activeRegion, onHover, onClick }) => {
    const isActive = activeRegion === id;
    return (
        <path
            id={id}
            d={d}
            className={`cursor-pointer transition-all duration-300 ${isActive ? 'fill-sky-500' : 'fill-slate-300 hover:fill-sky-400'}`}
            onMouseEnter={() => onHover(id)}
            onMouseLeave={() => onHover(null)}
            onClick={() => onClick(id)}
        >
            <title>{name}</title>
        </path>
    );
};

const AnimalMap: React.FC<{ onAnimalClick: (name: string) => void }> = ({ onAnimalClick }) => {
    const [hoveredRegion, setHoveredRegion] = useState<Region | null>(null);
    const [activeRegion, setActiveRegion] = useState<Region>('All');

    const animalsForRegion = activeRegion === 'All'
        ? animalpediaData.slice(0, 8) // Show a sample for 'All'
        : animalpediaData.filter(a => a.region === activeRegion || (a.region === 'Global' && activeRegion !== 'Antarctica' && activeRegion !== 'Oceans'));

    return (
        <div className="bg-white/80 rounded-2xl shadow-xl p-6 sm:p-8 backdrop-blur-lg border border-slate-200">
            <div className="flex items-center gap-3 mb-4">
                <MapPinIcon className="w-7 h-7 text-sky-600" />
                <h2 className="text-2xl font-bold text-slate-900">Explore by Region</h2>
            </div>
            <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-2/3">
                    <svg viewBox="0 0 1000 500" xmlns="http://www.w3.org/2000/svg" aria-label="Interactive world map">
                        <ContinentPath id="North America" name="North America" onHover={setHoveredRegion} onClick={setActiveRegion} activeRegion={activeRegion} d="M165 52 L128 78 L93 84 L41 210 L122 220 L163 241 L222 239 L268 206 L302 153 L312 119 L257 60 L165 52 Z" />
                        <ContinentPath id="South America" name="South America" onHover={setHoveredRegion} onClick={setActiveRegion} activeRegion={activeRegion} d="M222 249 L184 274 L180 322 L202 368 L252 423 L302 405 L312 347 L281 292 L222 249 Z" />
                        <ContinentPath id="Africa" name="Africa" onHover={setHoveredRegion} onClick={setActiveRegion} activeRegion={activeRegion} d="M400 200 L380 250 L385 300 L420 380 L480 380 L500 320 L510 250 L480 210 L400 200 Z" />
                        <ContinentPath id="Europe" name="Europe" onHover={setHoveredRegion} onClick={setActiveRegion} activeRegion={activeRegion} d="M420 80 L400 120 L420 180 L500 180 L520 140 L480 90 L420 80 Z" />
                        <ContinentPath id="Asia" name="Asia" onHover={setHoveredRegion} onClick={setActiveRegion} activeRegion={activeRegion} d="M530 80 L510 180 L600 200 L700 300 L800 250 L820 150 L700 90 L530 80 Z" />
                        <ContinentPath id="Australia" name="Australia" onHover={setHoveredRegion} onClick={setActiveRegion} activeRegion={activeRegion} d="M780 350 L750 400 L820 450 L880 420 L850 360 L780 350 Z" />
                        <ContinentPath id="Antarctica" name="Antarctica" onHover={setHoveredRegion} onClick={setActiveRegion} activeRegion={activeRegion} d="M280 480 L350 460 L500 470 L650 460 L720 480 L500 495 L280 480 Z" />
                    </svg>
                </div>
                <div className="w-full md:w-1/3">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="font-bold text-lg text-slate-800">{activeRegion}</h3>
                         <button 
                            onClick={() => setActiveRegion('All')} 
                            className={`text-sm font-semibold ${activeRegion !== 'All' ? 'text-sky-600 hover:text-sky-700' : 'text-slate-400 cursor-default'}`}
                            disabled={activeRegion === 'All'}
                         >
                            Show All
                        </button>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-2 h-64 overflow-y-auto border border-slate-200">
                        {animalsForRegion.length > 0 ? (
                            <ul className="space-y-1">
                                {animalsForRegion.map(animal => (
                                    <li key={animal.id}>
                                        <button onClick={() => onAnimalClick(animal.name)} className="w-full text-left flex items-center gap-2 p-2 rounded-md hover:bg-sky-100 transition-colors">
                                            <img src={animal.imageUrl} alt={animal.name} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                                            <span className="text-sm font-medium text-slate-700">{animal.name}</span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-center text-sm text-slate-500 p-4">No featured animals found for this region.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnimalMap;
