'use client';

import React, { useState } from 'react';
import { Volume2 } from 'lucide-react';

interface EnglishCardProps {
  frontContent: string;
  backContent: string;
}

const EnglishCard: React.FC<EnglishCardProps> = ({ frontContent, backContent }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleSpeak = (e: React.MouseEvent, content: string) => {
    e.stopPropagation(); // Prevent card from flipping when clicking the audio button
    const utterance = new SpeechSynthesisUtterance(content);
    utterance.lang = 'en-US'; // Set language to English
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div 
      className="aspect-[4/5] w-full [perspective:1000px] cursor-pointer rounded-lg overflow-hidden shadow-lg relative group"
      onClick={handleFlip}
    >
      <div className={`relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}>
        {/* Front of the card */}
        <div className="absolute w-full h-full backface-hidden bg-white flex flex-col items-center justify-center p-3">
          <h2 className="text-base font-bold text-center">{frontContent}</h2>
          <button 
            onClick={(e) => handleSpeak(e, frontContent)}
            className="absolute bottom-2 right-2 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition opacity-0 group-hover:opacity-100"
          >
            <Volume2 size={16} />
          </button>
        </div>
        {/* Back of the card */}
        <div className="absolute w-full h-full backface-hidden bg-blue-100 flex flex-col items-center justify-center p-3 [transform:rotateY(180deg)]">
          <p className="text-sm text-center">{backContent}</p>
          <button 
            onClick={(e) => handleSpeak(e, backContent)}
            className="absolute bottom-2 right-2 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition opacity-0 group-hover:opacity-100"
          >
            <Volume2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnglishCard;