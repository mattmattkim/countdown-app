declare global {
  interface Window {
    Tick: any;
    _flipLoaded?: boolean;
    _flipLoading?: Promise<void>;
  }
}

let loadPromise: Promise<void> | null = null;

export const loadFlipLibrary = (): Promise<void> => {
  // If already loaded, return resolved promise
  if (window._flipLoaded) {
    return Promise.resolve();
  }

  // If currently loading, return the existing promise
  if (loadPromise) {
    return loadPromise;
  }

  // Create new loading promise
  loadPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = process.env.PUBLIC_URL + '/flip.min.js';
    script.async = true;
    
    script.onerror = (error) => {
      console.error('Failed to load Flip library:', error);
      loadPromise = null;
      reject(new Error('Failed to load flip library'));
    };
    
    script.onload = () => {
      // Check if Tick is available and has the expected structure
      if (window.Tick && window.Tick.DOM && window.Tick.DOM.create) {
        window._flipLoaded = true;
        resolve();
      } else {
        loadPromise = null;
        reject(new Error('Flip library loaded but Tick is not available'));
      }
    };

    document.head.appendChild(script);
  });

  return loadPromise;
};

export const isFlipLoaded = (): boolean => {
  return !!window._flipLoaded && !!window.Tick;
};