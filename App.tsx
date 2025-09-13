import React, { useState } from 'react';
import Header from './components/Header';
import Animalpedia from './components/Animalpedia';
import Articles from './components/Articles';
import Compare from './components/Compare';
import About from './components/About';
import PrivacyPolicy from './components/PrivacyPolicy';
import Terms from './components/Terms';
import Footer from './components/Footer';
import Quiz from './components/Quiz';
import FloatingChatButton from './components/FloatingChatButton';
import GlobalChat from './components/GlobalChat';
import SoundIdentifier from './components/SoundIdentifier';
import SoundLibrary from './components/SoundLibrary';
import Dashboard from './components/Dashboard';
import ImageIdentifier from './components/ImageIdentifier';
import AnimalPersona from './components/AnimalPersona';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage('browse');
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'browse':
        return <Animalpedia initialSearchTerm={searchTerm} clearSearchTerm={() => setSearchTerm('')} />;
      case 'articles':
        return <Articles />;
      case 'compare':
        return <Compare />;
      case 'about':
        return <About />;
      case 'privacy':
        return <PrivacyPolicy />;
      case 'terms':
        return <Terms />;
      case 'quiz':
        return <Quiz />;
      case 'sound-id':
        return <SoundIdentifier />;
      case 'sound-library':
        return <SoundLibrary />;
      case 'image-id':
        return <ImageIdentifier />;
      case 'persona':
        return <AnimalPersona />;
      case 'home':
      default:
        return <Dashboard onSearch={handleSearch} setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen text-slate-800 flex flex-col">
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <div className="flex-grow max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 pt-0 w-full">
        <main>
          {renderContent()}
        </main>
      </div>
      <Footer setCurrentPage={setCurrentPage} />
      <FloatingChatButton onClick={() => setIsChatOpen(true)} isVisible={!isChatOpen} />
      <GlobalChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} currentPage={currentPage} />
    </div>
  );
};

export default App;