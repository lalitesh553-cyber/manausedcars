import { useState, useEffect } from 'react';

export type RouteType =
  | 'home'
  | 'buy'
  | 'sell'
  | 'service'
  | 'finance'
  | 'details'
  | 'contact'
  | 'about'
  | 'admin';

interface NavigationState {
  route: RouteType;
  cityFilter?: string; // used for city landing pages
  brandFilter?: string; // used for brand landing pages
  selectedCarId?: string; // used for details view
}

export function useNavigation() {
  const [nav, setNav] = useState<NavigationState>({ route: 'home' });

  // Parse path and set state
  const parsePath = (path: string) => {
    // Trim slashes and parse
    const cleanPath = path.replace(/^\/|\/$/g, '');

    if (!cleanPath) {
      setNav({ route: 'home' });
      return;
    }

    if (cleanPath === 'buy') {
      setNav({ route: 'buy' });
      return;
    }

    if (cleanPath === 'sell') {
      setNav({ route: 'sell' });
      return;
    }

    if (cleanPath === 'service') {
      setNav({ route: 'service' });
      return;
    }

    if (cleanPath === 'finance') {
      setNav({ route: 'finance' });
      return;
    }

    if (cleanPath === 'contact') {
      setNav({ route: 'contact' });
      return;
    }

    if (cleanPath === 'about') {
      setNav({ route: 'about' });
      return;
    }

    if (cleanPath === 'admin') {
      setNav({ route: 'admin' });
      return;
    }

    // City landing page: /cars/bangalore -> buy route with cityFilter
    if (cleanPath.startsWith('cars/')) {
      const city = cleanPath.split('/')[1];
      setNav({ route: 'buy', cityFilter: city });
      return;
    }

    // Brand landing page: /brands/maruti -> buy route with brandFilter
    if (cleanPath.startsWith('brands/')) {
      const brand = cleanPath.split('/')[1];
      setNav({ route: 'buy', brandFilter: brand });
      return;
    }

    // Details view: /car/maruti-baleno-1 -> details route
    if (cleanPath.startsWith('car/')) {
      const carId = cleanPath.split('/')[1];
      setNav({ route: 'details', selectedCarId: carId });
      return;
    }

    // Default to home if route not matched
    setNav({ route: 'home' });
  };

  useEffect(() => {
    // Handle initial load
    parsePath(window.location.pathname);

    // Handle back/forward buttons
    const handlePopState = () => {
      parsePath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Soft navigate function
  const navigate = (path: string) => {
    window.history.pushState(null, '', path);
    parsePath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return {
    ...nav,
    navigate,
  };
}
