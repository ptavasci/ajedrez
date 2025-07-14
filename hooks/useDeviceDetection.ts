import { useState, useEffect } from 'react';
import { Device } from '@capacitor/device';

interface DeviceInfo {
    isMobile: boolean;
    isTablet: boolean;
    isTV: boolean;
    isTouchscreen: boolean;
    platform: string;
    model: string;
}

export const useDeviceDetection = (): DeviceInfo => {
    const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
        isMobile: false,
        isTablet: false,
        isTV: false,
        isTouchscreen: false,
        platform: 'web',
        model: '',
    });

    useEffect(() => {
        const detectDevice = async () => {
            let isTouchscreen = false;
            if (typeof window !== 'undefined') {
                isTouchscreen = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
                if (!isTouchscreen && window.matchMedia) {
                    isTouchscreen = window.matchMedia('(pointer:coarse)').matches;
                }
            }

            let platform = 'web';
            let model = '';
            let isMobile = false;
            let isTablet = false;
            let isTV = false;

            try {
                const info = await Device.getInfo();
                platform = info.platform;
                model = info.model;

                if (platform === 'ios' || platform === 'android') {
                    // Basic mobile/tablet detection based on common screen sizes or device types
                    // This is a heuristic and might need refinement
                    const screenWidth = window.innerWidth;
                    const screenHeight = window.innerHeight;
                    const minTabletSize = 600; // A common breakpoint for tablets

                    if (info.isVirtual) {
                        // For emulators, assume mobile/tablet based on platform
                        isMobile = true; // Default for emulators
                    } else if (platform === 'ios') {
                        // iOS specific checks (e.g., iPad models)
                        if (model.includes('iPad')) {
                            isTablet = true;
                        } else {
                            isMobile = true;
                        }
                    } else if (platform === 'android') {
                        // Android specific checks
                        // Check for common TV indicators in model name or user agent (less reliable)
                        const userAgent = navigator.userAgent.toLowerCase();
                        if (userAgent.includes('android tv') || userAgent.includes('googletv') || model.includes('tv')) {
                            isTV = true;
                        } else if (screenWidth >= minTabletSize || screenHeight >= minTabletSize) {
                            isTablet = true;
                        } else {
                            isMobile = true;
                        }
                    }
                }
            } catch (e) {
                console.warn('Capacitor Device plugin not available, defaulting to web detection.', e);
                // Fallback for web or when Capacitor is not initialized
                const userAgent = navigator.userAgent.toLowerCase();
                isMobile = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
                isTablet = /(ipad|tablet|playbook|silk)|(android(?!.*mobile))/i.test(userAgent);
                isTV = /googletv|android tv|firetv/i.test(userAgent); // Basic web TV detection
            }

            setDeviceInfo({
                isMobile,
                isTablet,
                isTV,
                isTouchscreen,
                platform,
                model,
            });
        };

        detectDevice();
    }, []);

    return deviceInfo;
};