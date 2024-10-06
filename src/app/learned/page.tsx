'use client';

import React, { useState, useEffect } from 'react';
import EnglishCard from '../../components/EnglishCard';
import Sidebar from '../../components/Sidebar';
import TopNav from '../../components/TopNav';
import ConfirmationModal from '../../components/ConfirmationModal';

interface Card {
  id: string;
  frontContent: string;
  backContent: string;
  category: string;
  isLearned: boolean;
  visibleOnMainPage: boolean;
}

const categories = ['All', 'Greetings', 'Phrases', 'Grammar', 'Vocabulary', 'Idioms', 'Slang', 'Business', 'Academic'];

export default function LearnedPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [learnedCards, setLearnedCards] = useState<Card[]>([]);
  const [cardsToMoveOut, setCardsToMoveOut] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const storedCards = localStorage.getItem('allCards');
    if (storedCards) {
      const allCards: Card[] = JSON.parse(storedCards);
      const learned = allCards.filter(card => card.isLearned);
      setLearnedCards(learned);
    }
  }, []);

  const filteredCards = selectedCategory === 'All' 
    ? learnedCards 
    : learnedCards.filter(card => card.category === selectedCategory);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  const handleCardLearnedToggle = (cardId: string) => {
    setCardsToMoveOut(prev => 
      prev.includes(cardId) ? prev.filter(id => id !== cardId) : [...prev, cardId]
    );
  };

  const handleMoveOutCards = () => {
    if (cardsToMoveOut.length > 0) {
      setShowModal(true);
    }
  };

  const confirmMoveOutCards = () => {
    const storedCards = localStorage.getItem('allCards');
    if (storedCards) {
      const allCards: Card[] = JSON.parse(storedCards);
      const updatedAllCards = allCards.map(card => 
        cardsToMoveOut.includes(card.id) 
          ? { ...card, isLearned: false, visibleOnMainPage: true } 
          : card
      );
      localStorage.setItem('allCards', JSON.stringify(updatedAllCards));
      
      // Update the learned cards state
      const updatedLearnedCards = updatedAllCards.filter(card => card.isLearned);
      setLearnedCards(updatedLearnedCards);
      setCardsToMoveOut([]);
    }
    setShowModal(false);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <TopNav />
        <div className="flex-1 flex flex-col px-4 py-2 overflow-y-auto">
          <h1 className="text-2xl font-bold mb-4">Learned Cards</h1>
          <div className="sticky top-0 bg-gray-100 z-10 pb-4">
            <div className="flex justify-between items-center">
              <div className="flex space-x-4 overflow-x-auto py-3 scrollbar-hide flex-grow">
                {categories.map((category, index) => (
                  <button 
                    key={index} 
                    className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
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
                onClick={handleMoveOutCards}
                className={`ml-4 px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                  cardsToMoveOut.length > 0
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                disabled={cardsToMoveOut.length === 0}
              >
                Move out Cards ({cardsToMoveOut.length})
              </button>
            </div>
          </div>
          <div className="grid grid-cols-5 gap-4">
            {filteredCards.map((card) => (
              <EnglishCard 
                key={card.id} 
                {...card} 
                isSelected={cardsToMoveOut.includes(card.id)}
                onLearnedToggle={() => handleCardLearnedToggle(card.id)}
              />
            ))}
          </div>
          {filteredCards.length === 0 && (
            <p className="text-center py-4">No learned cards in this category yet.</p>
          )}
        </div>
      </main>
      <ConfirmationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={confirmMoveOutCards}
        message={`Are you sure you want to move out ${cardsToMoveOut.length} card(s) from the Learned page?`}
      />
    </div>
  );
}