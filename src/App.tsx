/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigation } from './hooks/useNavigation';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomeView from './components/HomeView';
import BuyView from './components/BuyView';
import DetailsView from './components/DetailsView';
import SellView from './components/SellView';
import ServiceView from './components/ServiceView';
import ContactView from './components/ContactView';
import AboutView from './components/AboutView';
import AdminView from './components/AdminView';
import FinanceView from './components/FinanceView';
import WhatsAppWidget from './components/WhatsAppWidget';

export default function App() {
  const { route, cityFilter, brandFilter, selectedCarId, navigate } = useNavigation();

  // Active globally selected city coordinate
  const [activeCityName, setActiveCityName] = useState<string>('Bangalore');

  // Multi-parameter search presets passed to buy filters
  const [searchPreset, setSearchPreset] = useState<{
    brand?: string;
    city?: string;
    budget?: number;
    fuel?: string;
  } | undefined>(undefined);

  // Parse path filters if they are defined on mount by popstate (e.g. city landing pages /cars/bangalore)
  const effectiveFilters = React.useMemo(() => {
    const filters: { brand?: string; city?: string; budget?: number; fuel?: string } = { ...searchPreset };

    if (cityFilter) {
      // Auto translate slug to Title (e.g., bangalore -> Bangalore)
      const formattedCity = cityFilter.charAt(0).toUpperCase() + cityFilter.slice(1);
      if (formattedCity === 'Visakhapatnam' || formattedCity === 'Vizag') {
        filters.city = 'Visakhapatnam';
      } else {
        filters.city = formattedCity;
      }
    }

    if (brandFilter) {
      // Translate brand slug (e.g., maruti -> Maruti Suzuki)
      if (brandFilter === 'maruti') filters.brand = 'Maruti Suzuki';
      else if (brandFilter === 'hyundai') filters.brand = 'Hyundai';
      else if (brandFilter === 'honda') filters.brand = 'Honda';
      else if (brandFilter === 'tata') filters.brand = 'Tata';
      else if (brandFilter === 'mahindra') filters.brand = 'Mahindra';
      else {
        filters.brand = brandFilter.charAt(0).toUpperCase() + brandFilter.slice(1);
      }
    }

    return Object.keys(filters).length > 0 ? filters : undefined;
  }, [searchPreset, cityFilter, brandFilter]);

  // Handle Navbar city updates
  const handleNavbarCityChange = (cityName: string) => {
    setActiveCityName(cityName);
    // Presets location immediately on selection
    setSearchPreset({ ...searchPreset, city: cityName });
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans selection:bg-blue-600 selection:text-white antialiased">
      {/* 1. Header Navbar */}
      <Navbar
        currentRoute={route}
        navigate={navigate}
        activeCity={activeCityName}
        onCityChange={handleNavbarCityChange}
      />

      {/* 2. Main content segment wrapper with crisp fade interactions */}
      <main className="flex-1 w-full bg-white">
        {route === 'home' && (
          <HomeView
            navigate={navigate}
            setSearchPreset={setSearchPreset}
          />
        )}

        {route === 'buy' && (
          <BuyView
            navigate={navigate}
            initialFilters={effectiveFilters}
            onClearInitialFilters={() => setSearchPreset(undefined)}
          />
        )}

        {route === 'details' && (
          <DetailsView
            carId={selectedCarId || ''}
            navigate={navigate}
          />
        )}

        {route === 'sell' && (
          <SellView
            navigate={navigate}
          />
        )}

        {route === 'service' && (
          <ServiceView
            navigate={navigate}
          />
        )}

        {route === 'finance' && (
          <FinanceView
            navigate={navigate}
          />
        )}

        {route === 'contact' && (
          <ContactView
            navigate={navigate}
          />
        )}

        {route === 'about' && (
          <AboutView />
        )}

        {route === 'admin' && (
          <AdminView />
        )}
      </main>

      {/* 3. Footer segment */}
      <Footer navigate={navigate} />

      {/* 4. Global Persistent WhatsApp Help Widget */}
      <WhatsAppWidget navigate={navigate} />
    </div>
  );
}
