import React from 'react';
import ChatBubbleOvalLeftEllipsisIcon from './icons/ChatBubbleOvalLeftEllipsisIcon';

interface FloatingChatButtonProps {
    onClick: () => void;
    isVisible: boolean;
}

const FloatingChatButton: React.FC<FloatingChatButtonProps> = ({ onClick, isVisible }) => {
    return (
        <button
            onClick={onClick}
            className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 bg-sky-500 text-white rounded-full p-4 shadow-lg hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transition-transform duration-300 ease-in-out z-30 ${isVisible ? 'scale-100' : 'scale-0'}`}
            aria-label="Open Animalpedia Assistant"
        >
            <ChatBubbleOvalLeftEllipsisIcon className="w-8 h-8" />
        </button>
    );
};

export default FloatingChatButton;
