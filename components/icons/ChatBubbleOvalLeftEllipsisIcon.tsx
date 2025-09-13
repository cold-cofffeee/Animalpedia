import React from 'react';

const ChatBubbleOvalLeftEllipsisIcon: React.FC<{ className?: string }> = ({ className }) => (
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
            d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193l-3.72 3.72a.75.75 0 01-1.06 0l-3.72-3.72A2.123 2.123 0 013 16.894V8.511c0-.97.616-1.813 1.5-2.097a6.75 6.75 0 0111.046 0z"
        />
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 11.25h.008v.008H12v-.008zm-2.25 0h.008v.008h-.008v-.008zm4.5 0h.008v.008h-.008v-.008z"
        />
    </svg>
);

export default ChatBubbleOvalLeftEllipsisIcon;
