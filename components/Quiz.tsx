import React, { useState, useEffect, useCallback } from 'react';
import { QuizQuestion } from '../types';
import { generateQuizQuestion } from '../services/geminiService';
import Spinner from './Spinner';
import CheckCircleIcon from './icons/CheckCircleIcon';
import XCircleIcon from './icons/XCircleIcon';

const AnswerButton: React.FC<{
    option: string;
    correctAnswer: string;
    selectedAnswer: string | null;
    handleAnswer: (answer: string) => void;
    disabled: boolean;
}> = ({ option, correctAnswer, selectedAnswer, handleAnswer, disabled }) => {
    
    const isSelected = selectedAnswer === option;
    const isCorrect = correctAnswer === option;

    let buttonClass = 'bg-white hover:bg-slate-100 border-slate-300';
    let icon = null;

    if (selectedAnswer) {
        if (isCorrect) {
            buttonClass = 'bg-green-100 border-green-500 text-green-800';
            icon = <CheckCircleIcon className="w-6 h-6 text-green-600" />;
        } else if (isSelected) {
            buttonClass = 'bg-red-100 border-red-500 text-red-800';
            icon = <XCircleIcon className="w-6 h-6 text-red-600" />;
        } else {
            buttonClass = 'bg-slate-100 border-slate-300 opacity-70 cursor-not-allowed';
        }
    }

    return (
        <button
            onClick={() => handleAnswer(option)}
            disabled={disabled}
            className={`w-full p-4 rounded-lg border-2 text-left font-medium transition-all duration-300 flex items-center justify-between ${buttonClass}`}
        >
            <span>{option}</span>
            {icon}
        </button>
    );
};


const Quiz: React.FC = () => {
    const [question, setQuestion] = useState<QuizQuestion | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [score, setScore] = useState(0);
    const [category, setCategory] = useState('General');

    const fetchQuestion = useCallback(async () => {
        setLoading(true);
        setSelectedAnswer(null);
        setIsCorrect(null);
        const q = await generateQuizQuestion(category);
        setQuestion(q);
        setLoading(false);
    }, [category]);

    useEffect(() => {
        fetchQuestion();
    }, [fetchQuestion]);

    const handleAnswer = (answer: string) => {
        if (selectedAnswer) return;

        setSelectedAnswer(answer);
        if (answer === question?.correctAnswer) {
            setIsCorrect(true);
            setScore(prev => prev + 1);
        } else {
            setIsCorrect(false);
        }
    };
    
    return (
        <div className="bg-white/80 rounded-2xl shadow-xl p-6 sm:p-8 backdrop-blur-lg border border-slate-200 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-3xl font-bold text-slate-900">Animal Quiz</h2>
                <div className="flex items-center gap-4">
                    <div className="w-40">
                         <label htmlFor="category-select" className="sr-only">Quiz Category</label>
                         <select
                            id="category-select"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full p-2 border border-slate-300 rounded-md bg-white shadow-sm focus:ring-sky-500 focus:border-sky-500 transition text-sm"
                            disabled={loading}
                         >
                             <option value="General">General</option>
                             <option value="Diet">Diet</option>
                             <option value="Habitat">Habitat</option>
                         </select>
                    </div>
                    <div className="text-lg font-bold text-slate-700 bg-slate-200 px-3 py-1 rounded-full">
                        Score: {score}
                    </div>
                </div>
            </div>

            {loading && !question && (
                <div className="text-center py-12 min-h-[300px] flex flex-col justify-center items-center">
                    <Spinner className="w-12 h-12 text-sky-500 mx-auto" />
                    <p className="mt-4 text-slate-600">Generating a {category.toLowerCase()} question...</p>
                </div>
            )}
            
            {question && (
                 <div className="min-h-[300px]">
                    <p className="text-xl font-semibold text-slate-800 mb-6 text-center">{question.question}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {question.options.map((option, index) => (
                            <AnswerButton
                                key={index}
                                option={option}
                                correctAnswer={question.correctAnswer}
                                selectedAnswer={selectedAnswer}
                                handleAnswer={handleAnswer}
                                disabled={!!selectedAnswer || loading}
                            />
                        ))}
                    </div>

                    {selectedAnswer && (
                        <div className="text-center mt-6 animate-fade-in">
                             <div className="bg-slate-100 p-4 rounded-lg">
                                <p className={`font-bold text-lg mb-2 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                                    {isCorrect ? 'Correct!' : `Not quite! The answer is ${question.correctAnswer}.`}
                                </p>
                                <p className="text-slate-700">{question.explanation}</p>
                            </div>
                            <button
                                onClick={fetchQuestion}
                                disabled={loading}
                                className="mt-4 px-6 py-2 bg-sky-500 text-white font-semibold rounded-full hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transition disabled:bg-slate-400 disabled:cursor-not-allowed min-w-[150px] flex items-center justify-center mx-auto"
                            >
                                {loading ? <Spinner className="w-5 h-5" /> : 'Next Question'}
                            </button>
                        </div>
                    )}
                 </div>
            )}
        </div>
    );
};

export default Quiz;