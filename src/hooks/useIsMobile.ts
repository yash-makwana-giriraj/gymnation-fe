"use client";
import { useState, useEffect } from 'react';

const useIsMobile = (breakpoint: number = 768): boolean => {
    const [isMobile, setIsMobile] = useState<boolean>(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia(`(max-width: ${breakpoint}px)`);

        // Set initial state
        setIsMobile(mediaQuery.matches);

        // Handler for media query changes
        const handleResize = (event: MediaQueryListEvent) => {
            setIsMobile(event.matches);
        };

        // Add event listener for media query changes
        mediaQuery.addEventListener('change', handleResize);

        // Cleanup listener on component unmount
        return () => {
            mediaQuery.removeEventListener('change', handleResize);
        };
    }, [breakpoint]);

    return isMobile;
};

export default useIsMobile;