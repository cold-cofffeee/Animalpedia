import React from 'react';

const LightbulbIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className={className}
        aria-hidden="true"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.311a7.5 7.5 0 01-7.5 0c-1.433-.422-2.5-1.92-2.5-3.565a12.043 12.043 0 014.288-8.878 7.5 7.5 0 0110.424 0 12.043 12.043 0 014.288 8.878c0 1.645-1.067 3.143-2.5 3.565z"
        />
    </svg>
);

export default LightbulbIcon;
