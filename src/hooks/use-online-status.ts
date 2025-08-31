
'use client';

import { useState, useEffect } from 'react';

/**
 * A custom hook to detect and monitor the online status of the browser.
 * @returns {boolean} `true` if the browser is online, `false` otherwise.
 */
export function useOnlineStatus() {
  // Initialize state from navigator.onLine, ensuring it works only in the browser.
  const [isOnline, setIsOnline] = useState(
    typeof window !== 'undefined' ? window.navigator.onLine : true
  );

  useEffect(() => {
    // Handler to update state to true when the browser comes online.
    function handleOnline() {
      setIsOnline(true);
    }

    // Handler to update state to false when the browser goes offline.
    function handleOffline() {
      setIsOnline(false);
    }

    // Add event listeners to respond to network status changes.
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup function to remove event listeners when the component unmounts.
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}
