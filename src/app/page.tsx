'use client';

import React, { useState, useEffect, useRef } from 'react';
import EnglishCard from '../components/EnglishCard';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';


interface Card {
  frontContent: string;
  backContent: string;
  category: string;
}

// Function to generate a large number of test cards with categories
const generateTestCards = (count: number): Card[] => {
  const categories = ['Greetings', 'Phrases', 'Grammar', 'Vocabulary', 'Idioms', 'Slang', 'Business', 'Academic'];
  return Array.from({ length: count }, (_, i) => {
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    return {
      frontContent: `${randomCategory} ${i + 1}`,
      backContent: `Definition for ${randomCategory} ${i + 1}`,
      category: randomCategory
    };
  });
};

const allCardData: Card[] = generateTestCards(100);

const categories = ['All', 'Greetings', 'Phrases', 'Grammar', 'Vocabulary', 'Idioms', 'Slang', 'Business', 'Academic'];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [visibleCards, setVisibleCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(false);
  const loadMoreRef = useRef(null);

  const filteredCards: Card[] = selectedCategory === 'All' 
  ? allCardData 
  : allCardData.filter(card => card.category === selectedCategory);

  useEffect(() => {
    setVisibleCards(filteredCards.slice(0, 10));
  }, [selectedCategory]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          loadMoreCards();
        }
      },
      { threshold: 1.0 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [loading, visibleCards]);

  const loadMoreCards = () => {
    setLoading(true);
    setTimeout(() => {
      const currentLength = visibleCards.length;
      const newCards = filteredCards.slice(currentLength, currentLength + 10);
      setVisibleCards(prevCards => [...prevCards, ...newCards]);
      setLoading(false);
    }, 500);
  };
  
  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    // Reset visible cards when changing category
    setVisibleCards([]);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <TopNav />
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="bg-white shadow-md py-3 px-4 z-10">
            <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
              {categories.map((category, index) => (
                <button 
                  key={index} 
                  className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                    selectedCategory === category 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                  onClick={() => handleCategoryClick(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-2">
            <div className="grid grid-cols-5 gap-4">
              {visibleCards.map((card, index) => (
                <EnglishCard key={index} frontContent={card.frontContent} backContent={card.backContent} />
              ))}
            </div>
            {visibleCards.length < filteredCards.length && (
              <div ref={loadMoreRef} className="text-center py-4">
                {loading ? 'Loading more cards...' : 'Scroll for more'}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}