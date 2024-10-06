'use client';

import React, { useState } from 'react';
import { Volume2, Check } from 'lucide-react';

interface EnglishCardProps {
  id: string;
  frontContent: string;
  backContent: string;
  category: string;
  isLearned: boolean;
  visibleOnMainPage?: boolean;
  isSelected: boolean;
  onLearnedToggle: (id: string) => void;
}

const EnglishCard: React.FC<EnglishCardProps> = ({ 
  id, 
  frontContent, 
  backContent, 
  isLearned, 
  isSelected,
  onLearnedToggle 
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleSpeak = (e: React.MouseEvent, content: string) => {
    e.stopPropagation();
    const utterance = new SpeechSynthesisUtterance(content);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  const handleLearnedToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onLearnedToggle(id);
  };

  return (
    <div 
      className={`aspect-[4/5] w-full [perspective:1000px] cursor-pointer rounded-lg overflow-hidden shadow-lg relative group ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      }`}
      onClick={handleFlip}
    >
      <div className={`relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}>
        {/* Front of the card */}
        <div className="absolute w-full h-full backface-hidden bg-white flex flex-col items-center justify-center p-3">
          <h2 className="text-base font-bold text-center">{frontContent}</h2>
          <div className="absolute bottom-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={handleLearnedToggle}
            className={`p-2 rounded-full transition ${isSelected ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
          >
            <Check size={16} />
          </button>
          <button 
            onClick={(e) => handleSpeak(e, frontContent)}
            className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
          >
            <Volume2 size={16} />
          </button>
          </div>
        </div>
        {/* Back of the card */}
        <div className="absolute w-full h-full backface-hidden bg-blue-100 flex flex-col items-center justify-center p-3 [transform:rotateY(180deg)]">
          <p className="text-sm text-center">{backContent}</p>
          <div className="absolute bottom-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={handleLearnedToggle}
            className={`p-2 rounded-full transition ${isSelected ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
          >
            <Check size={16} />
          </button>
          <button 
            onClick={(e) => handleSpeak(e, frontContent)}
            className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
          >
            <Volume2 size={16} />
          </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnglishCard;