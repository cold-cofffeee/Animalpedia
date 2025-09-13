import React, { useState } from 'react';
import PawIcon from './icons/PawIcon';
import Bars3Icon from './icons/Bars3Icon';
import XMarkIcon from './icons/XMarkIcon';
import SwitchHorizontalIcon from './icons/SwitchHorizontalIcon';

interface HeaderProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

const NavLink: React.FC<{
  page: string;
  currentPage: string;
  onClick: (page: string) => void;
  children: React.ReactNode;
  isMobile?: boolean;
}> = ({ page, currentPage, onClick, children, isMobile }) => {
  const isActive = currentPage === page;
  const baseClasses = 'font-medium transition-colors';
  const desktopClasses = isActive
    ? 'bg-sky-100 text-sky-600 px-3 py-2 rounded-md text-sm'
    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 px-3 py-2 rounded-md text-sm';
  const mobileClasses = isActive
    ? 'bg-sky-100 text-sky-600 block w-full text-left p-3 rounded-md'
    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 block w-full text-left p-3 rounded-md';
  
  return (
    <button
      onClick={() => onClick(page)}
      className={`${baseClasses} ${isMobile ? mobileClasses : desktopClasses}`}
      aria-current={isActive ? 'page' : undefined}
    >
      {children}
    </button>
  );
};

const Header: React.FC<HeaderProps> = ({ currentPage, setCurrentPage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavClick = (page: string) => {
    setCurrentPage(page);
    setIsMenuOpen(false);
  };

  const navItems = [
    { page: 'home', label: 'Home' },
    { page: 'browse', label: 'Browse Species' },
    { page: 'persona', label: 'AI Personas' },
    { page: 'articles', label: 'Articles' },
    { page: 'compare', label: 'Compare' },
    { page: 'sound-library', label: 'Sound Library' },
    { page: 'image-id', label: 'Image ID' },
    { page: 'quiz', label: 'Quiz' },
    { page: 'about', label: 'About' },
  ];

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-20 mb-6 md:mb-8">
      <nav className="max-w-4xl mx-auto flex items-center justify-between p-4 relative">
        <button className="flex items-center gap-3" onClick={() => handleNavClick('home')}>
          <PawIcon className="w-8 h-8 text-sky-500" />
          <span className="text-xl font-bold text-slate-800 tracking-tight">
            Animalpedia
          </span>
        </button>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1 flex-wrap justify-end">
          {navItems.map(item => (
            <NavLink key={item.page} page={item.page} currentPage={currentPage} onClick={handleNavClick}>
              {item.label}
            </NavLink>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-md text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky-500"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            <span className="sr-only">Open main menu</span>
            {isMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Nav Menu */}
        {isMenuOpen && (
          <div id="mobile-menu" className="md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-lg shadow-lg border-t border-slate-200 animate-fade-in-down">
            <div className="p-2 space-y-1">
               {navItems.map(item => (
                <NavLink key={item.page} page={item.page} currentPage={currentPage} onClick={handleNavClick} isMobile>
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;