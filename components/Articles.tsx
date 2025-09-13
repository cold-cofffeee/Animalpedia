import React from 'react';
import { articlesData } from '../data/articlesData';

const Articles: React.FC = () => {
  const [featuredArticle, ...otherArticles] = articlesData;

  return (
    <div className="animate-fade-in">
      <h2 className="text-3xl font-bold text-slate-900 mb-6 text-center">Articles & Insights</h2>
      
      {/* Featured Article */}
      {featuredArticle && (
        <div className="mb-12 bg-white/80 rounded-2xl shadow-xl backdrop-blur-lg border border-slate-200 overflow-hidden group">
          <div className="md:flex">
            <div className="md:w-1/2">
               <img src={featuredArticle.imageUrl} alt={featuredArticle.title} className="w-full h-64 md:h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
            <div className="p-6 md:p-8 flex flex-col justify-center md:w-1/2">
              <h3 className="text-2xl font-bold text-slate-800 mb-2">{featuredArticle.title}</h3>
              <p className="text-slate-600">{featuredArticle.summary}</p>
              <span className="mt-4 text-sm font-semibold text-sky-600">Featured Read</span>
            </div>
          </div>
        </div>
      )}

      {/* Other Articles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {otherArticles.map(article => (
          <div key={article.id} className="bg-white/80 rounded-2xl shadow-xl backdrop-blur-lg border border-slate-200 overflow-hidden group">
            <img src={article.imageUrl} alt={article.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
            <div className="p-6">
              <h3 className="text-xl font-bold text-slate-800 mb-2">{article.title}</h3>
              <p className="text-slate-600">{article.summary}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Articles;