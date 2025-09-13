import React from 'react';

const RulerIcon: React.FC<{ className?: string }> = ({ className }) => (
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
            d="M3.75 3v18h16.5V3H3.75zm12.75 3.75h-1.5V9h1.5V6.75zm-3 0h-1.5V9h1.5V6.75zm-3 0H9V9h1.5V6.75zm-3 0H6V9h1.5V6.75zm0 9.75h1.5v-1.5H6v1.5zm3 0h1.5v-1.5H9v1.5zm3 0h1.5v-1.5h-1.5v1.5zm3 0h1.5v-1.5h-1.5v1.5z"
        />
    </svg>
);

export default RulerIcon;