import React, { useState } from 'react';
import { animalpediaData } from '../data/animalpediaData';
import { AnimalpediaEntry } from '../types';
import IUCNStatusBadge from './IUCNStatusBadge';

const Compare: React.FC = () => {
  const [animal1Id, setAnimal1Id] = useState<string>('');
  const [animal2Id, setAnimal2Id] = useState<string>('');

  const animal1 = animalpediaData.find(a => a.id === animal1Id);
  const animal2 = animalpediaData.find(a => a.id === animal2Id);

  const renderAnimalData = (animal?: AnimalpediaEntry) => {
    if (!animal) {
      return (
        <div className="text-center p-4 h-full flex items-center justify-center">
          <p className="text-slate-500">Select an animal</p>
        </div>
      );
    }
    return (
      <div className="p-4 space-y-4">
        <img src={animal.imageUrl} alt={animal.name} className="w-full h-48 object-cover rounded-lg shadow-md" />
        <div className="flex justify-between items-start">
            <div>
                <h3 className="text-2xl font-bold text-slate-800">{animal.name}</h3>
                <p className="text-sm font-mono text-sky-600">{animal.scientificName}</p>
            </div>
            <IUCNStatusBadge status={animal.iucnStatus} />
        </div>
        <ul className="space-y-2 text-slate-700 border-t border-slate-200 pt-4">
          <li><strong>Diet:</strong> {animal.diet}</li>
          <li><strong>Habitat:</strong> {animal.habitat}</li>
          <li><strong>Lifespan:</strong> {animal.lifespan}</li>
          <li><strong>Size:</strong> {animal.size.height} (h), {animal.size.weight} (w)</li>
          {animal.speed && <li><strong>Top Speed:</strong> {animal.speed}</li>}
        </ul>
      </div>
    );
  };
  
  const selectClass = "w-full p-2 border border-slate-300 rounded-md bg-white shadow-sm focus:ring-sky-500 focus:border-sky-500 transition";

  return (
    <div className="bg-white/80 rounded-2xl shadow-xl p-6 sm:p-8 backdrop-blur-lg border border-slate-200 animate-fade-in">
      <h2 className="text-3xl font-bold text-slate-900 mb-6 text-center">Compare Species</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label htmlFor="animal1-select" className="block text-sm font-medium text-slate-700 mb-1">Animal 1</label>
          <select id="animal1-select" value={animal1Id} onChange={e => setAnimal1Id(e.target.value)} className={selectClass}>
            <option value="">-- Choose --</option>
            {animalpediaData.map(animal => (
              <option key={animal.id} value={animal.id}>{animal.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="animal2-select" className="block text-sm font-medium text-slate-700 mb-1">Animal 2</label>
          <select id="animal2-select" value={animal2Id} onChange={e => setAnimal2Id(e.target.value)} className={selectClass}>
            <option value="">-- Choose --</option>
            {animalpediaData.map(animal => (
              <option key={animal.id} value={animal.id}>{animal.name}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-px bg-slate-200 rounded-lg overflow-hidden border border-slate-200">
        <div className="bg-slate-50 min-h-[300px]">{renderAnimalData(animal1)}</div>
        <div className="bg-slate-50 min-h-[300px]">{renderAnimalData(animal2)}</div>
      </div>
    </div>
  );
};

export default Compare;