import React, { useState, useRef, useEffect } from 'react';
import { AnimalpediaEntry, ChatMessage, GroundingSource } from '../types';
import { streamAnimalChat } from '../services/geminiService';
import PaperAirplaneIcon from './icons/PaperAirplaneIcon';
import MarkdownRenderer from './MarkdownRenderer';

interface AnimalChatProps {
    animal: AnimalpediaEntry;
}

const AnimalChat: React.FC<AnimalChatProps> = ({ animal }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    useEffect(() => {
        // Reset chat when animal changes
        setMessages([]);
    }, [animal]);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInput.trim() || isLoading) return;

        const userMessage: ChatMessage = { role: 'user', content: userInput };
        const currentMessages = [...messages, userMessage];
        setMessages(currentMessages);
        setUserInput('');
        setIsLoading(true);

        let fullResponse = '';
        let sources: GroundingSource[] | undefined = undefined;

        try {
            // FIX: Awaited the result of streamAnimalChat to get the async generator.
            const stream = await streamAnimalChat(animal.name, animal.description, messages, userInput);
            for await (const chunk of stream) {
                fullResponse += chunk.text;
                setMessages([...currentMessages, { role: 'model', content: fullResponse }]);
                
                const groundingChunks = chunk.candidates?.[0]?.groundingMetadata?.groundingChunks;
                if (groundingChunks) {
                    sources = groundingChunks
                        .map((c: any) => ({
                            title: c.web?.title || 'Untitled Source',
                            uri: c.web?.uri || '',
                        }))
                        .filter((s: GroundingSource) => s.uri);
                }
            }

            if (sources && sources.length > 0) {
                 setMessages([...currentMessages, { role: 'model', content: fullResponse, sources }]);
            }
        } catch (error) {
            console.error("Chat error:", error);
            setMessages([...currentMessages, { role: 'model', content: "Sorry, something went wrong while fetching my response." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mt-8 bg-white/80 rounded-2xl shadow-xl backdrop-blur-lg border border-slate-200">
            <div className="p-6 border-b border-slate-200">
                <h3 className="text-2xl font-bold text-slate-900">Ask an Expert</h3>
                <p className="text-slate-600">Have a question about the {animal.name}? Ask away!</p>
            </div>
            <div className="p-6 h-80 overflow-y-auto bg-slate-50/50">
                <div className="space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                            <div className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                                {msg.role === 'model' && <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center flex-shrink-0 font-bold text-white text-xs">AI</div>}
                                <div className={`max-w-md p-3 rounded-lg ${msg.role === 'user' ? 'bg-sky-500 text-white' : 'bg-slate-200 text-slate-800'}`}>
                                    {msg.role === 'user' ? (
                                        <p className="text-sm">{msg.content}</p>
                                    ) : (
                                        <MarkdownRenderer content={msg.content} />
                                    )}
                                </div>
                            </div>
                            {msg.role === 'model' && msg.sources && msg.sources.length > 0 && (
                                <div className="mt-2 text-xs text-slate-500 max-w-md ml-11">
                                    <h4 className="font-semibold">Sources:</h4>
                                    <ul className="space-y-1 mt-1">
                                        {msg.sources.map((source, i) => (
                                            <li key={i} className="truncate">
                                                <a href={source.uri} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-sky-600 underline">
                                                    <span>{i+1}.</span> 
                                                    <span className="truncate">{source.title}</span>
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ))}
                    {isLoading && (
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
            </div>
            <div className="p-4 border-t border-slate-200">
                <form onSubmit={handleSubmit} className="flex items-center gap-2">
                    <label htmlFor="chat-input" className="sr-only">Your question</label>
                    <input
                        id="chat-input"
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder={`e.g., "How fast can a ${animal.name.toLowerCase()} run?"`}
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
            </div>
        </div>
    );
};

export default AnimalChat;