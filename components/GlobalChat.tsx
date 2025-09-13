import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { streamGlobalChat } from '../services/geminiService';
import PaperAirplaneIcon from './icons/PaperAirplaneIcon';
import XMarkIcon from './icons/XMarkIcon';
import PawIcon from './icons/PawIcon';
import MarkdownRenderer from './MarkdownRenderer';

interface GlobalChatProps {
    isOpen: boolean;
    onClose: () => void;
    currentPage: string;
}

const GlobalChat: React.FC<GlobalChatProps> = ({ isOpen, onClose, currentPage }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const pageNameMap: { [key: string]: string } = {
        'explore': 'Explore',
        'articles': 'Articles',
        'compare': 'Compare Species',
        'quiz': 'Quiz',
        'about': 'About',
        'sound-id': 'Sound Identifier',
        'privacy': 'Privacy Policy',
        'terms': 'Terms & Conditions',
    };
    const friendlyPageName = pageNameMap[currentPage] || currentPage;

    useEffect(() => {
        if (isOpen) {
            // Focus input when chat opens
            setTimeout(() => inputRef.current?.focus(), 100);
            if (messages.length === 0) {
                 // Add initial greeting
                setMessages([{ role: 'model', content: "Hello! I'm the Animalpedia Assistant. How can I help you explore the animal kingdom today?" }]);
            }
        }
    }, [isOpen, messages.length]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInput.trim() || isLoading) return;

        const newMessages: ChatMessage[] = [...messages, { role: 'user', content: userInput }];
        setMessages(newMessages);
        setUserInput('');
        setIsLoading(true);

        let fullResponse = '';
        try {
            const stream = streamGlobalChat(messages, userInput, friendlyPageName);
            for await (const chunk of stream) {
                fullResponse += chunk;
                setMessages([...newMessages, { role: 'model', content: fullResponse }]);
            }
        } catch (error) {
            setMessages([...newMessages, { role: 'model', content: "Sorry, something went wrong." }]);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100%-2rem)] sm:w-full max-w-sm h-[70vh] max-h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col border border-slate-200 animate-fade-in-up z-40">
            <header className="p-4 border-b border-slate-200 flex items-center justify-between flex-shrink-0">
                 <div className="flex items-center gap-3">
                    <PawIcon className="w-6 h-6 text-sky-500" />
                    <h3 className="text-lg font-bold text-slate-800">Animalpedia Assistant</h3>
                </div>
                <button onClick={onClose} className="text-slate-500 hover:text-slate-800" aria-label="Close chat">
                    <XMarkIcon className="w-6 h-6" />
                </button>
            </header>
            <main className="flex-grow p-4 overflow-y-auto bg-slate-50/50">
                <div className="space-y-4">
                     {messages.map((msg, index) => (
                        <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                            {msg.role === 'model' && <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center flex-shrink-0 font-bold text-white text-xs">AI</div>}
                            <div className={`max-w-xs p-3 rounded-lg ${msg.role === 'user' ? 'bg-sky-500 text-white' : 'bg-slate-200 text-slate-800'}`}>
                                {msg.role === 'user' ? (
                                    <p className="text-sm">{msg.content}</p>
                                ) : (
                                    <MarkdownRenderer content={msg.content} />
                                )}
                            </div>
                        </div>
                    ))}
                    {isLoading && messages[messages.length - 1]?.role === 'user' && (
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center flex-shrink-0 font-bold text-white text-xs">AI</div>
                            <div className="max-w-md p-3 rounded-lg bg-slate-200 text-slate-800">
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-0"></span>
                                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-150"></span>
                                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-300"></span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </div>
            </main>
            <footer className="p-4 border-t border-slate-200 flex-shrink-0">
                <form onSubmit={handleSubmit} className="flex items-center gap-2">
                    <input
                        ref={inputRef}
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="Ask about any animal..."
                        required
                        className="flex-grow w-full px-3 py-2 border border-slate-300 rounded-full bg-white shadow-sm focus:ring-sky-500 focus:border-sky-500 transition text-sm"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="p-2 bg-sky-500 text-white font-semibold rounded-full hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transition text-sm disabled:bg-slate-400 disabled:cursor-not-allowed"
                        aria-label="Send message"
                    >
                        <PaperAirplaneIcon className="w-5 h-5" />
                    </button>
                </form>
            </footer>
        </div>
    );
};

export default GlobalChat;
