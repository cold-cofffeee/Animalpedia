export interface AnimalpediaEntry {
    id: string;
    name: string;
    scientificName: string;
    description: string;
    imageUrl: string;
    funFact: string;
    sampleSound: string;
    habitat: string;
    diet: 'Omnivore' | 'Carnivore' | 'Herbivore';
    lifespan: string;
    related?: string[];
    taxonomy: Taxonomy;
    iucnStatus: IUCNStatus;
    region: 'Africa' | 'Asia' | 'North America' | 'South America' | 'Antarctica' | 'Europe' | 'Australia' | 'Oceans' | 'Global';
    size: {
        height: string;
        weight: string;
    };
    speed: string | null;
    evolutionaryHistory: string;
    foodChain: {
        role: string;
        predators: string[];
        prey: string[];
    };
}

export type IUCNStatus = 'Least Concern' | 'Near Threatened' | 'Vulnerable' | 'Endangered' | 'Critically Endangered' | 'Extinct in the Wild' | 'Extinct' | 'Data Deficient';

export interface Taxonomy {
    kingdom: string;
    phylum: string;
    class: string;
    order: string;
    family: string;
    genus: string;
    species: string;
}

export interface Article {
    id: string;
    title: string;
    summary: string;
    imageUrl: string;
}

export interface GroundingSource {
    title: string;
    uri: string;
}

export interface ChatMessage {
    role: 'user' | 'model';
    content: string;
    sources?: GroundingSource[];
}

export interface QuizQuestion {
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
}

export interface AnimalSoundIdentification {
    animalName: string;
    scientificName: string;
    interestingFact: string;
    confidence: 'High' | 'Medium' | 'Low' | 'Uncertain';
}

export interface AnimalImageIdentification {
    animalName: string;
    scientificName: string;
    interestingFact: string;
    confidence: 'High' | 'Medium' | 'Low' | 'Uncertain';
}

export interface AnimalSpiritResult {
    animalName: string;
    imageUrl: string;
    description: string;
}