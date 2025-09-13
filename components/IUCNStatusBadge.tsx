import React from 'react';
import { IUCNStatus } from '../types';

interface IUCNStatusBadgeProps {
    status: IUCNStatus;
}

const IUCNStatusBadge: React.FC<IUCNStatusBadgeProps> = ({ status }) => {
    const statusColors: Record<IUCNStatus, string> = {
        'Extinct': 'bg-black text-white',
        'Extinct in the Wild': 'bg-gray-700 text-white',
        'Critically Endangered': 'bg-red-600 text-white',
        'Endangered': 'bg-red-500 text-white',
        'Vulnerable': 'bg-orange-400 text-orange-900',
        'Near Threatened': 'bg-yellow-300 text-yellow-800',
        'Least Concern': 'bg-green-200 text-green-800',
        'Data Deficient': 'bg-slate-200 text-slate-600',
    };

    return (
        <span
            className={`px-3 py-1 text-xs font-bold rounded-full text-center flex-shrink-0 ${statusColors[status]}`}
            title={`IUCN Red List Status: ${status}`}
        >
            {status}
        </span>
    );
};

export default IUCNStatusBadge;