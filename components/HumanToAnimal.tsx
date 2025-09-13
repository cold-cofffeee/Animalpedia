import React, { useState } from 'react';
import { AnimalSpiritResult } from '../types';
import { generateAnimalSpirit } from '../services/geminiService';
import Spinner from './Spinner';

// FIX: Removed the QuizAnswers interface and created a specific type for question IDs to maintain type safety.
type QuizQuestionId = 'vacation' | 'social' | 'hobby' | 'time';

const Question: React.FC<{
    id: QuizQuestionId;
    questionText: string;
    options: string[];
    value: string;
    onChange: (id: QuizQuestionId, value: string) => void;
}> = ({ id, questionText, options, value, onChange }) => (
    <div>
        <label className="block text-lg font-semibold text-slate-800 mb-2">{questionText}</label>
        <div className="flex flex-wrap gap-3">
            {options.map(option => (
                <button
                    key={option}
                    onClick={() => onChange(id, option)}
                    className={`px-4 py-2 text-sm font-medium rounded-full border-2 transition-all ${
                        value === option
                            ? 'bg-sky-500 text-white border-sky-500 shadow-md'
                            : 'bg-white text-slate-600 border-slate-300 hover:border-sky-400'
                    }`}
                >
                    {option}
                </button>
            ))}
        </div>
    </div>
);

const HumanToAnimal: React.FC = () => {
    // FIX: Changed state type to Record<string, string> to match the service function's expected parameter type.
    const [answers, setAnswers] = useState<Record<string, string>>({
        vacation: '',
        social: '',
        hobby: '',
        time: '',
    });
    const [result, setResult] = useState<AnimalSpiritResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAnswerChange = (id: QuizQuestionId, value: string) => {
        setAnswers(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (Object.values(answers).some(a => !a)) {
            setError("Please answer all questions to find your spirit animal!");
            return;
        }
        setError(null);
        setIsLoading(true);
        setResult(null);
        // FIX: The `answers` object now correctly matches the `Record<string, string>` type, resolving the error on the following line.
        const spiritResult = await generateAnimalSpirit(answers);
        if (spiritResult) {
            setResult(spiritResult);
        } else {
            setError("Sorry, the AI couldn't determine your spirit animal. Please try again!");
        }
        setIsLoading(false);
    };

    if (isLoading) {
        return (
            <div className="text-center py-12">
                <Spinner className="w-12 h-12 text-sky-500 mx-auto" />
                <p className="mt-4 text-slate-600 font-semibold">Analyzing your personality...</p>
            </div>
        );
    }
    
    if (result) {
        return (
            <div className="text-center animate-fade-in">
                <h3 className="text-2xl font-bold text-slate-800">Your Spirit Animal is the...</h3>
                <h2 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-sky-500 to-indigo-600 my-2">{result.animalName}</h2>
                <div className="max-w-md mx-auto bg-slate-50 p-6 rounded-lg border border-slate-200 mt-4">
                     <img src={result.imageUrl} alt={result.animalName} className="w-full h-56 object-cover rounded-lg shadow-md mb-4" />
                     <p className="text-slate-700">{result.description}</p>
                </div>
                <button
                    onClick={() => {
                        setResult(null);
                        setAnswers({ vacation: '', social: '', hobby: '', time: '' });
                    }}
                    className="mt-6 px-6 py-2 bg-sky-500 text-white font-semibold rounded-full hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transition"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in">
            <Question
                id="vacation"
                questionText="1. What's your ideal vacation?"
                options={["Cozy cabin in the woods", "Sunny beach resort", "Exploring a new city", "Adventurous mountain hike"]}
                value={answers.vacation}
                onChange={handleAnswerChange}
            />
            <Question
                id="social"
                questionText="2. How do you prefer to socialize?"
                options={["With a small, close group", "At a large, lively party", "One-on-one", "I prefer my own company"]}
                value={answers.social}
                onChange={handleAnswerChange}
            />
            <Question
                id="hobby"
                questionText="3. Pick a hobby:"
                options={["Building or crafting something", "Reading a good book", "Playing a team sport", "Gardening or being in nature"]}
                value={answers.hobby}
                onChange={handleAnswerChange}
            />
            <Question
                id="time"
                questionText="4. When are you most active?"
                options={["Early morning", "Midday", "Late at night", "All day long"]}
                value={answers.time}
                onChange={handleAnswerChange}
            />

            {error && <p className="text-red-500 text-center font-medium">{error}</p>}

            <div className="text-center pt-4">
                <button
                    type="submit"
                    className="px-8 py-3 bg-sky-500 text-white font-bold rounded-full hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transition text-lg"
                >
                    Discover My Spirit Animal
                </button>
            </div>
        </form>
    );
};

export default HumanToAnimal;