import React from 'react';

const PaperAirplaneIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className={className}
        aria-hidden="true"
    >
        <path
            d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.949a.75.75 0 00.95.826L11.25 8.25l-5.607 1.76a.75.75 0 00-.826.95l1.414 4.949a.75.75 0 00.95.826l3.296-1.03a.75.75 0 00.493-.493l1.03-3.296a.75.75 0 00-.826-.95L8.25 11.25l1.76-5.607a.75.75 0 00-.95-.826L3.105 2.289z"
        />
    </svg>
);

export default PaperAirplaneIcon;
