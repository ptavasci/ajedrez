import { useState, useEffect } from 'react';
import { Device } from '@capacitor/device';
import { DeviceInfo } from '../types'; // Import the DeviceInfo interface

export const useDeviceDetection = (): DeviceInfo => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isMobile: false,
    isTouch: false,
    isTV: false,
    resolution: {
      width: 0,
      height: 0,
    },
    userAgent: '', // Initialize userAgent
    platform: '', // Initialize platform
  });

  useEffect(() => {
    const detectDevice = async () => {
      let isTouch = false;
      if (typeof window !== 'undefined') {
        isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        if (!isTouch && window.matchMedia) {
          isTouch = window.matchMedia('(pointer:coarse)').matches;
        }
      }

      let isMobile = false;
      let isTV = false;
      let width = window.innerWidth;
      let height = window.innerHeight;

      try {
        const info = await Device.getInfo();
        const userAgent = navigator.userAgent.toLowerCase();
        const platform = info.platform;

        if (info.platform === 'ios' || info.platform === 'android') {
          // More robust detection for mobile and TV
          // More robust TV detection, including common TV user agent strings and models
          isTV =
            userAgent.includes('android tv') ||
            userAgent.includes('googletv') ||
            userAgent.includes('tv') ||
            userAgent.includes('smarttv') ||
            userAgent.includes('appletv') ||
            info.model.toLowerCase().includes('tv') ||
            info.model.toLowerCase().includes('android tv') ||
            userAgent.includes('crkey') ||
            userAgent.includes('aftb') ||
            userAgent.includes('globe') ||
            userAgent.includes('roku');
          isMobile = !isTV && (info.platform === 'ios' || info.platform === 'android');

          // Refine isTouch for TV devices
          if (isTV) {
            isTouch = false; // Explicitly set to false for TVs
          }
        }
      } catch (e) {
        console.warn('Capacitor Device plugin not available, defaulting to web detection.', e);
        const userAgent = navigator.userAgent.toLowerCase();
        isMobile = /android|iphone|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
        isTV = /googletv|android tv|firetv|tv|smarttv|appletv|crkey|aftb|globe|roku/i.test(
          userAgent,
        );
        if (isTV) {
          isTouch = false; // Explicitly set to false for TVs
        }
      }

      setDeviceInfo({
        isMobile,
        isTouch,
        isTV,
        resolution: {
          width,
          height,
        },
        userAgent: navigator.userAgent, // Capture userAgent
        platform: platform, // Capture platform
      });
    };

    detectDevice();
  }, []);

  return deviceInfo;
};
