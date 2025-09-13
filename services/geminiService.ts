import { GoogleGenAI, Type, GenerateContentResponse, Content } from "@google/genai";
import { ChatMessage, QuizQuestion, AnimalSoundIdentification, AnimalpediaEntry, AnimalImageIdentification, AnimalSpiritResult } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getDailyFact(): Promise<string> {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: 'Tell me a surprising and little-known fun fact about an animal. Make it short, exciting, and easy to understand for a general audience. Format it as a simple string, without any introductory text like "Did you know...".',
        });
        return response.text.trim();
    } catch (error) {
        console.error("Error fetching daily fact:", error);
        return "The animal kingdom is full of surprises! Check back later for a new fact.";
    }
}

// FIX: Made function async and awaited the stream call for robust error handling.
export async function streamAnimalChat(animalName: string, description: string, history: ChatMessage[], newQuestion: string) {
    const model = 'gemini-2.5-flash';
    const contents: Content[] = [...history.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.content }]
    })), {
        role: 'user',
        parts: [{ text: newQuestion }]
    }];

    const config = {
        systemInstruction: `You are a friendly and knowledgeable zoologist specializing in the ${animalName}. Your goal is to provide clear, engaging information without overwhelming the user.
1. **Initial Answer**: Provide a concise, summary-level answer to the user's question in 2-3 sentences.
2. **Engage for Deeper Dive**: After the summary, prompt the user to learn more by asking a question, like "Would you like a more detailed explanation of its diet, or perhaps its unique social behaviors?".
3. **Formatting**: When providing detailed information (especially in follow-up answers), use simple Markdown for clarity: use '**' to bold key terms and start lines with '- ' to create bulleted lists.
4. **Tone**: Remain friendly, knowledgeable, and never mention you are an AI. Base your knowledge on this core information: "${description}", and use search to supplement it.`,
        tools: [{googleSearch: {}}],
    };

    try {
        return await ai.models.generateContentStream({ model, contents, config });
    } catch (error) {
        console.error("Error in streaming chat:", error);
        throw new Error("Could not start chat stream.");
    }
}

export async function* streamGlobalChat(history: ChatMessage[], newQuestion: string, currentPage: string) {
    const model = 'gemini-2.5-flash';
    const contents: Content[] = [...history.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.content }]
    })), {
        role: 'user',
        parts: [{ text: newQuestion }]
    }];
    
    const systemInstruction = `You are the Animalpedia Assistant, a helpful AI guide for the Animalpedia website.
1. **Be Concise First**: Always provide a brief, direct answer to the user's question first.
2. **Offer More Info**: After your initial answer, ask a follow-up question to see if the user wants more detail, e.g., "Would you like me to elaborate on that?".
3. **Use Context**: The user is on the "${currentPage}" page. Use this to provide more relevant answers or suggestions.
4. **Formatting**: Use simple Markdown for formatting, such as '**bolding**' key terms and creating lists with '-'.
5. **Tone**: Be friendly, informative, and never reveal you are an AI.`;

    const config = {
        systemInstruction,
    };

    try {
        const response = await ai.models.generateContentStream({ model, contents, config });
        for await (const chunk of response) {
            yield chunk.text;
        }
    } catch (error) {
        console.error("Error in global streaming chat:", error);
        yield "I'm sorry, I'm having a little trouble communicating right now. Please try again later.";
    }
}

export async function generateQuizQuestion(category: string): Promise<QuizQuestion> {
    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            question: {
                type: Type.STRING,
                description: 'The trivia question about an animal.'
            },
            options: {
                type: Type.ARRAY,
                items: {
                    type: Type.STRING
                },
                description: 'An array of 4 possible answers.'
            },
            correctAnswer: {
                type: Type.STRING,
                description: 'The correct answer from the options array.'
            },
            explanation: {
                type: Type.STRING,
                description: 'A brief, interesting explanation or fun fact related to the correct answer.'
            }
        },
        required: ['question', 'options', 'correctAnswer', 'explanation']
    };

    const categoryTopic = category === 'General' ? 'a general fact' : `the ${category.toLowerCase()}`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Generate a moderately difficult, multiple-choice trivia question about an animal, focusing on ${categoryTopic}. Ensure one of the options is the correct answer. Also provide a brief, interesting explanation for why the correct answer is correct.`,
            config: {
                responseMimeType: "application/json",
                responseSchema,
            },
        });
        
        const jsonText = response.text.trim();
        const parsed = JSON.parse(jsonText);

        if (parsed.options.length !== 4 || !parsed.options.includes(parsed.correctAnswer)) {
             throw new Error("Generated quiz question is malformed.");
        }

        return parsed;

    } catch (error) {
        console.error("Error generating quiz question:", error);
        return {
            question: "Which animal is known as the 'King of the Jungle'?",
            options: ["Elephant", "Tiger", "Lion", "Bear"],
            correctAnswer: "Lion",
            explanation: "Lions are often called the 'King of the Jungle,' though they primarily live in grasslands and savannas, not jungles. The title refers to their position at the top of the food chain."
        };
    }
}

export async function identifyAnimalSound(base64Audio: string, mimeType: string): Promise<AnimalSoundIdentification> {
    const audioPart = {
      inlineData: {
        mimeType: mimeType,
        data: base64Audio,
      },
    };
    const textPart = {
      text: 'Identify the animal from this sound. Provide its common name, scientific name, and a brief, interesting fact about it. Also provide your confidence level in the identification (High, Medium, Low, or Uncertain). If you cannot identify it, say so in the animalName field and explain why in the interestingFact.',
    };
    
    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            animalName: { type: Type.STRING, description: "The common name of the identified animal." },
            scientificName: { type: Type.STRING, description: "The scientific name of the animal." },
            interestingFact: { type: Type.STRING, description: "An interesting fact about the animal or the sound it makes." },
            confidence: { type: Type.STRING, enum: ['High', 'Medium', 'Low', 'Uncertain'], description: "The confidence level of the identification." },
        },
        required: ['animalName', 'scientificName', 'interestingFact', 'confidence'],
    };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [audioPart, textPart] },
            config: {
                responseMimeType: "application/json",
                responseSchema,
            }
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error identifying animal sound:", error);
        return {
            animalName: "Identification Failed",
            scientificName: "N/A",
            interestingFact: "Sorry, I couldn't identify the sound from the recording. Please try again with a clearer audio clip, ideally with less background noise.",
            confidence: 'Uncertain'
        };
    }
}

export async function generateSoundDescription(animalName: string): Promise<string> {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `In a few paragraphs, provide a detailed and engaging description of the sounds and vocalizations made by a ${animalName}. Explain what the different sounds mean (e.g., for communication, mating rituals, warnings to predators). Be descriptive about what the sounds are like. Use simple Markdown for formatting, such as bolding key terms.`,
        });
        return response.text.trim();
    } catch (error) {
        console.error(`Error generating sound description for ${animalName}:`, error);
        return `I'm sorry, I was unable to generate a description of the ${animalName}'s sounds at this time. Please try again later.`;
    }
}

export async function fetchAnimalDataByName(animalName: string): Promise<AnimalpediaEntry | null> {
    const prompt = `Fetch comprehensive data for the animal: "${animalName}". Use web search to find accurate information. Return the data as a single raw JSON object that strictly adheres to the following TypeScript interface:
interface AnimalpediaEntry {
    id: string; // A unique, URL-friendly ID for the animal (e.g., 'fennec-fox').
    name: string; // The common name of the animal.
    scientificName: string; // The scientific name of the animal.
    description: string; // A brief, one-paragraph description of the animal.
    imageUrl: string; // A URL to a high-quality, royalty-free image of the animal.
    funFact: string; // A surprising and little-known fun fact about the animal.
    habitat: string; // A description of the animal's primary habitat.
    diet: 'Omnivore' | 'Carnivore' | 'Herbivore';
    lifespan: string; // e.g., '10-15 years'
    taxonomy: { kingdom: string; phylum: string; class: string; order: string; family: string; genus: string; species: string; };
    iucnStatus: 'Least Concern' | 'Near Threatened' | 'Vulnerable' | 'Endangered' | 'Critically Endangered' | 'Extinct in the Wild' | 'Extinct' | 'Data Deficient';
    region: 'Africa' | 'Asia' | 'North America' | 'South America' | 'Antarctica' | 'Europe' | 'Australia' | 'Oceans' | 'Global';
    size: { height: string; weight: string; }; // e.g., height: '4 ft', weight: '500 lbs'
    speed: string | null; // e.g., '50 mph'
    evolutionaryHistory: string; // A brief summary.
    foodChain: { role: string; predators: string[]; prey: string[]; };
}
Ensure the image URL is from a reliable, royalty-free source like Pexels or Unsplash. If a field is not applicable (e.g., speed for a slow animal), provide a null value. For domesticated animals found worldwide, set the region to 'Global'.
Your response must be only the JSON object, with no surrounding text or markdown formatting (like \`\`\`json).`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
            },
        });

        const jsonText = response.text.trim();
        const cleanJsonText = jsonText.replace(/^```json\s*/, '').replace(/```\s*$/, '');
        const parsed = JSON.parse(cleanJsonText) as AnimalpediaEntry;
        
        parsed.sampleSound = parsed.sampleSound || 'No sample sound available.';
        return parsed;
    } catch (error) {
        console.error(`Error fetching data for ${animalName}:`, error);
        return null;
    }
}

export async function identifyAnimalFromImage(base64Image: string, mimeType: string): Promise<AnimalImageIdentification> {
    const imagePart = {
      inlineData: {
        mimeType: mimeType,
        data: base64Image,
      },
    };
    const textPart = {
      text: 'Identify the animal in this image. Provide its common name, scientific name, and a brief, interesting fact about it. Also provide your confidence level in the identification (High, Medium, Low, or Uncertain). If you cannot identify it, state that in the animalName field and explain why in the interestingFact.',
    };
    
    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            animalName: { type: Type.STRING, description: "The common name of the identified animal." },
            scientificName: { type: Type.STRING, description: "The scientific name of the animal." },
            interestingFact: { type: Type.STRING, description: "An interesting fact about the animal." },
            confidence: { type: Type.STRING, enum: ['High', 'Medium', 'Low', 'Uncertain'], description: "The confidence level of the identification." },
        },
        required: ['animalName', 'scientificName', 'interestingFact', 'confidence'],
    };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, textPart] },
            config: {
                responseMimeType: "application/json",
                responseSchema,
            }
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error identifying animal from image:", error);
        return {
            animalName: "Identification Failed",
            scientificName: "N/A",
            interestingFact: "Sorry, I couldn't identify the animal from the image. Please try again with a clearer picture, ideally with the animal as the main subject.",
            confidence: 'Uncertain'
        };
    }
}

export async function generateAnimalSpirit(answers: Record<string, string>): Promise<AnimalSpiritResult | null> {
    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            animalName: { type: Type.STRING, description: "The name of the animal that best represents the user's personality." },
            imageUrl: { type: Type.STRING, description: "A URL to a high-quality, royalty-free image of the animal." },
            description: { type: Type.STRING, description: "A creative, insightful, and positive paragraph explaining why this animal is the user's spirit animal based on their answers. It should connect their choices to the animal's key traits." },
        },
        required: ['animalName', 'imageUrl', 'description'],
    };

    const prompt = `Based on these personality quiz answers, determine the user's spirit animal.
    - Ideal vacation: ${answers.vacation}
    - Social style: ${answers.social}
    - A hobby: ${answers.hobby}
    - Time of day: ${answers.time}
    Provide a creative, positive, and insightful analysis connecting their answers to the traits of a specific animal. Find a suitable, royalty-free image URL for the animal.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema,
            },
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error generating animal spirit:", error);
        return null;
    }
}

export async function generateHumanPersona(animalName: string): Promise<string> {
    const prompt = `Imagine a ${animalName} as a human. Write a creative and detailed "human persona" for them. Describe their likely job, personality traits, hobbies, and a funny quirk they might have. Format the response using simple Markdown (bolding, lists).`;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text.trim();
    } catch (error) {
        console.error(`Error generating human persona for ${animalName}:`, error);
        return `I'm sorry, I couldn't quite imagine what a ${animalName} would be like as a human right now. Please try another animal!`;
    }
}