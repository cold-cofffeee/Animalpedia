import React, { useState, useCallback } from 'react';
import { identifyAnimalFromImage } from '../services/geminiService';
import { AnimalImageIdentification } from '../types';
import Spinner from './Spinner';
import LightbulbIcon from './icons/LightbulbIcon';
import UploadIcon from './icons/UploadIcon';

const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = (reader.result as string).split(',')[1];
            resolve(base64String);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

const ResultCard: React.FC<{ result: AnimalImageIdentification }> = ({ result }) => {
    const confidenceColor = {
        'High': 'text-green-600 bg-green-100',
        'Medium': 'text-yellow-600 bg-yellow-100',
        'Low': 'text-orange-600 bg-orange-100',
        'Uncertain': 'text-red-600 bg-red-100',
    }[result.confidence];
    
    return (
        <div className="bg-white rounded-xl shadow-lg p-6 mt-8 animate-fade-in border border-slate-200">
             <div className="flex justify-between items-start">
                 <div>
                    <h3 className="text-2xl font-bold text-slate-800">{result.animalName}</h3>
                    <p className="font-mono text-sm text-sky-600">{result.scientificName}</p>
                 </div>
                 <span className={`px-3 py-1 text-sm font-semibold rounded-full ${confidenceColor}`}>
                     {result.confidence} Confidence
                 </span>
            </div>
            <div className="flex items-start gap-4 mt-4 p-4 bg-slate-50 rounded-lg">
                <LightbulbIcon className="w-6 h-6 text-sky-500 flex-shrink-0 mt-1" />
                <p className="text-slate-700">{result.interestingFact}</p>
            </div>
        </div>
    )
}

const ImageIdentifier: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<AnimalImageIdentification | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleImageUpload = useCallback(async (file: File) => {
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setError("Please upload a valid image file (e.g., JPEG, PNG).");
            return;
        }

        setIsLoading(true);
        setError(null);
        setResult(null);

        // Create a preview
        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);

        try {
            const base64Image = await blobToBase64(file);
            const identificationResult = await identifyAnimalFromImage(base64Image, file.type);
            setResult(identificationResult);
        } catch (err) {
            console.error("Error identifying image:", err);
            setError("Something went wrong during the identification. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }, []);
    
    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleImageUpload(e.target.files[0]);
        }
    };

    const onDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const onDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const onDrop = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleImageUpload(e.dataTransfer.files[0]);
        }
    };


    return (
        <div className="bg-white/80 rounded-2xl shadow-xl p-6 sm:p-8 backdrop-blur-lg border border-slate-200 animate-fade-in">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-slate-900">Animal Image Identifier</h2>
                <p className="mt-2 text-slate-600 max-w-xl mx-auto">
                   Upload a photo of an animal and let our AI try to identify it for you.
                </p>
            </div>

            <div className="my-8">
                <label 
                    htmlFor="image-upload" 
                    className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${isDragging ? 'border-sky-500 bg-sky-50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100'}`}
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onDrop={onDrop}
                >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <UploadIcon className="w-10 h-10 mb-3 text-slate-400" />
                        <p className="mb-2 text-sm text-slate-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                        <p className="text-xs text-slate-500">PNG, JPG, or WEBP</p>
                    </div>
                    <input id="image-upload" type="file" className="hidden" onChange={onFileChange} accept="image/png, image/jpeg, image/webp" />
                </label>
            </div>

             {isLoading && (
                 <div className="text-center">
                     <Spinner className="w-12 h-12 text-sky-500 mx-auto" />
                     <p className="mt-4 text-slate-600">Analyzing image...</p>
                 </div>
            )}
            
            {imagePreview && !isLoading && (
                 <div className="text-center mb-4">
                    <h3 className="font-bold text-lg text-slate-700 mb-2">Your Image:</h3>
                    <img src={imagePreview} alt="Uploaded animal" className="max-w-xs mx-auto rounded-lg shadow-md" />
                 </div>
            )}

            {error && (
                <div className="text-center text-red-600 bg-red-100 p-3 rounded-lg">{error}</div>
            )}

            {result && <ResultCard result={result} />}
        </div>
    );
};

export default ImageIdentifier;
