import React from 'react';
import { AnimalpediaEntry } from '../types';
import HumanIcon from './icons/HumanIcon';
import PawIcon from './icons/PawIcon';
import RulerIcon from './icons/RulerIcon';
import ScaleIcon from './icons/ScaleIcon';

interface HumanComparisonProps {
    animal: AnimalpediaEntry;
}

const humanData = {
    height: '5.7 ft',
    weight: '180 lbs',
    speed: '18 mph',
};

const ComparisonRow: React.FC<{ title: string; animalValue: string | null; humanValue: string; icon: React.ReactNode; }> = ({ title, animalValue, humanValue, icon }) => (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4">
        <div className="flex items-center gap-2 text-slate-700 font-semibold w-full sm:w-1/4">
            {icon}
            <span>{title}</span>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-1/3">
            <PawIcon className="w-5 h-5 text-sky-500" />
            <span className="font-medium text-slate-800">{animalValue || 'N/A'}</span>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-1/3">
            <HumanIcon className="w-5 h-5 text-slate-500" />
            <span className="font-medium text-slate-600">{humanValue}</span>
        </div>
    </div>
);

const HumanComparison: React.FC<HumanComparisonProps> = ({ animal }) => {
    return (
        <div className="mt-12 border-t border-slate-200 pt-8">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Size & Speed vs. Human</h3>
            <div className="bg-slate-50 rounded-lg border border-slate-200 divide-y divide-slate-200">
                <ComparisonRow
                    title="Height"
                    animalValue={animal.size.height}
                    humanValue={humanData.height}
                    icon={<RulerIcon className="w-5 h-5" />}
                />
                <ComparisonRow
                    title="Weight"
                    animalValue={animal.size.weight}
                    humanValue={humanData.weight}
                    icon={<ScaleIcon className="w-5 h-5" />}
                />
                <ComparisonRow
                    title="Top Speed"
                    animalValue={animal.speed}
                    humanValue={humanData.speed}
                    icon={<PawIcon className="w-5 h-5" />}
                />
            </div>
        </div>
    );
};

export default HumanComparison;