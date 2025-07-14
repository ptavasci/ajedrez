import React from 'react';
import { useDeviceDetection } from '../hooks/useDeviceDetection';

export const Footer: React.FC = () => {
  const { isMobile, isTouch, isTV, resolution, platform } = useDeviceDetection();

  return (
    <footer className="mt-8 text-center text-lavender-mist text-sm opacity-75 flex justify-center items-center">
      <p className="mr-2">Hecho con ❤️ por Sofi para los amantes del ajedrez</p>
      <div className="flex items-center space-x-1">
        <span className="bg-gray-700 text-white px-2 py-1 rounded-full text-xs">
          {resolution.width}x{resolution.height}
        </span>
        <span className="bg-gray-700 text-white px-2 py-1 rounded-full text-xs">
          {' '}
          {isMobile ? 'Mobile' : 'Desktop'}{' '}
        </span>
        <span className="bg-gray-700 text-white px-2 py-1 rounded-full text-xs">
          {isTouch ? 'Touch' : 'No Touch'}
        </span>
        <span className="bg-gray-700 text-white px-2 py-1 rounded-full text-xs">
          {isTV ? 'TV' : 'No TV'}
        </span>
        <span className="bg-gray-700 text-white px-2 py-1 rounded-full text-xs">{platform}</span>
      </div>
    </footer>
  );
};
