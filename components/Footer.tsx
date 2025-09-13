import React from 'react';
import NewsletterSubscribe from './NewsletterSubscribe';

interface FooterProps {
  setCurrentPage: (page: string) => void;
}

const Footer: React.FC<FooterProps> = ({ setCurrentPage }) => {
  return (
    <footer className="bg-white/80 backdrop-blur-lg border-t border-slate-200 mt-12">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-bold text-slate-800 mb-2">Stay Curious</h3>
            <p className="text-slate-600 mb-4 text-sm">Subscribe to our newsletter for the latest articles and animal facts.</p>
            <NewsletterSubscribe />
          </div>
          <div className="flex justify-start md:justify-end items-start gap-8">
            <div>
              <h3 className="font-bold text-slate-800 mb-2">Navigate</h3>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => setCurrentPage('explore')} className="text-slate-600 hover:text-sky-600 transition-colors">Explore</button></li>
                <li><button onClick={() => setCurrentPage('articles')} className="text-slate-600 hover:text-sky-600 transition-colors">Articles</button></li>
                <li><button onClick={() => setCurrentPage('compare')} className="text-slate-600 hover:text-sky-600 transition-colors">Compare</button></li>
                <li><button onClick={() => setCurrentPage('about')} className="text-slate-600 hover:text-sky-600 transition-colors">About</button></li>
              </ul>
            </div>
             <div>
              <h3 className="font-bold text-slate-800 mb-2">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => setCurrentPage('privacy')} className="text-slate-600 hover:text-sky-600 transition-colors">Privacy Policy</button></li>
                <li><button onClick={() => setCurrentPage('terms')} className="text-slate-600 hover:text-sky-600 transition-colors">Terms & Conditions</button></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="text-center mt-8 pt-8 border-t border-slate-200 text-slate-500 text-sm">
          <p>Explore the wonders of nature. &copy; {new Date().getFullYear()} Animalpedia.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
