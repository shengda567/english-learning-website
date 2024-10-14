'use client';

import React, { useState, useEffect, useRef } from 'react';
import EnglishCard from '../components/EnglishCard';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';
import ConfirmationModal from '../components/ConfirmationModal';

interface Card {
  id: string;
  frontContent: string;
  backContent: string;
  category: string;
  isLearned: boolean;
  visibleOnMainPage?: boolean;
}

const generateTestCards = (count: number): Card[] => {
  const categories = ['Greetings', 'Phrases', 'Grammar', 'Vocabulary', 'Idioms', 'Slang', 'Business', 'Academic'];
  return Array.from({ length: count }, (_, i) => {
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    return {
      id: `card-${i + 1}`,
      frontContent: `${randomCategory} ${i + 1}`,
      backContent: `Definition for ${randomCategory} ${i + 1}`,
      category: randomCategory,
      isLearned: false,
      visibleOnMainPage: true
    };
  });
};

const categories = ['All', 'Greetings', 'Phrases', 'Grammar', 'Vocabulary', 'Idioms', 'Slang', 'Business', 'Academic'];

export default function Home() {
  const [allCards, setAllCards] = useState<Card[]>([]);
  const [visibleCards, setVisibleCards] = useState<Card[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const loadMoreRef = useRef(null);
  const [cardsToMove, setCardsToMove] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 10;

  useEffect(() => {
    const storedCards = localStorage.getItem('allCards');
    if (storedCards) {
      setAllCards(JSON.parse(storedCards));
    } else {
      const newCards = generateTestCards(100);
      setAllCards(newCards);
      localStorage.setItem('allCards', JSON.stringify(newCards));
    }
  }, []);

  useEffect(() => {
    const filteredCards = allCards.filter(card => 
      (selectedCategory === 'All' || card.category === selectedCategory) && 
      !card.isLearned &&
      card.visibleOnMainPage !== false
    );
    setVisibleCards(filteredCards.slice(0, 10));
  }, [selectedCategory, allCards]);

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
      const filteredCards = selectedCategory === 'All'
        ? allCards
        : allCards.filter(card => card.category === selectedCategory);
      const currentLength = visibleCards.length;
      const newCards = filteredCards.slice(currentLength, currentLength + 10);
      setVisibleCards(prevCards => [...prevCards, ...newCards]);
      setLoading(false);
    }, 500);
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  const handleCardLearnedToggle = (cardId: string) => {
    setCardsToMove(prev => 
      prev.includes(cardId) ? prev.filter(id => id !== cardId) : [...prev, cardId]
    );
  };

  const handleMoveLearnedCards = () => {
    setShowModal(true);
  };

  const confirmMoveLearnedCards = () => {
    const updatedCards = allCards.map(card => 
      cardsToMove.includes(card.id) 
        ? { ...card, isLearned: true, visibleOnMainPage: false } 
        : card
    );
    setAllCards(updatedCards);
    localStorage.setItem('allCards', JSON.stringify(updatedCards));
    setCardsToMove([]);
    setShowModal(false);

    // Update visible cards
    const newVisibleCards = updatedCards.filter(card => 
      !card.isLearned && card.visibleOnMainPage &&
      (selectedCategory === 'All' || card.category === selectedCategory)
    );
    setVisibleCards(newVisibleCards.slice(0, 10));
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(visibleCards.length / cardsPerPage);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <TopNav />
        <div className="flex-1 flex flex-col px-4 py-2 overflow-y-auto">
          <div className="sticky top-0 bg-gray-100 z-10 pb-2">
            <div className="flex justify-between items-center mb-2">
              <div className="flex space-x-2 overflow-x-auto py-2 scrollbar-hide">
                {categories.map((category, index) => (
                  <button 
                    key={index} 
                    className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition-colors ${
                      selectedCategory === category 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-white hover:bg-gray-200'
                    }`}
                    onClick={() => handleCategoryClick(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
              <button
                onClick={handleMoveLearnedCards}
                className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition-colors ${
                  cardsToMove.length > 0
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                disabled={cardsToMove.length === 0}
              >
                Move Learned ({cardsToMove.length})
              </button>
            </div>
          </div>
          <div className="grid grid-cols-5 gap-4 mb-4">
            {visibleCards.map((card) => (
              <EnglishCard 
                key={card.id} 
                {...card} 
                isSelected={cardsToMove.includes(card.id)}
                onLearnedToggle={() => handleCardLearnedToggle(card.id)}
              />
            ))}
          </div>
          <div className="flex justify-center mt-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`mx-1 px-3 py-1 rounded ${
                  currentPage === page ? 'bg-blue-500 text-white' : 'bg-white'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      </main>
      <ConfirmationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={confirmMoveLearnedCards}
        message={`Are you sure you want to move ${cardsToMove.length} card(s) to the Learned page?`}
      />
    </div>
  );
}