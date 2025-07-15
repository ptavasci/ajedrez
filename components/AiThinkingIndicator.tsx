import React from 'react';

export const AiThinkingIndicator: React.FC = () => {
  return (
    <div className="absolute inset-0 bg-night-sky bg-opacity-80 flex flex-col items-center justify-center z-20 rounded-lg">
      <div className="w-20 h-20 border-4 border-t-transparent border-vibrant-violet rounded-full animate-spin"></div>
      <p className="mt-6 text-xl text-star-white">Tu oponente está pensando...</p>
    </div>
  );
};
