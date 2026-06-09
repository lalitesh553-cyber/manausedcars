import React, { useState } from 'react';
import { Search, MapPin, Menu, X, ShieldCheck, Phone, Wrench, ChevronDown, IndianRupee } from 'lucide-react';
import { CITIES } from '../data';

interface NavbarProps {
  currentRoute: string;
  navigate: (path: string) => void;
  activeCity?: string;
  onCityChange?: (city: string) => void;
}

export default function Navbar({ currentRoute, navigate, activeCity, onCityChange }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCitySelectorOpen, setIsCitySelectorOpen] = useState(false);

  const handleCitySelect = (cityName: string) => {
    if (onCityChange) {
      onCityChange(cityName);
    }
    setIsCitySelectorOpen(false);
    // Navigate to cars city landing
    const cleanCity = cityName.toLowerCase().replace(' ncr', '');
    navigate(`/cars/${cleanCity}`);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="p-1.5 bg-blue-600 rounded-lg text-white">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="font-sans font-bold text-xl tracking-tight text-slate-900">
                Mana<span className="text-blue-600 font-extrabold font-sans">UsedCars</span>
              </span>
              <p className="text-[10px] text-slate-500 font-mono tracking-wider uppercase -mt-1 leading-none">
                Verified Resale Hub
              </p>
            </div>
          </div>

          {/* Search bar inside header (Cashify-inspired center segment) */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search verified cars (e.g., Baleno, Honda City)..."
                className="w-full bg-slate-50 border border-slate-200 rounded-full py-1.5 pl-10 pr-4 text-sm text-slate-900 focus:outline-hidden focus:border-blue-600 focus:bg-white transition-colors cursor-pointer"
                onClick={() => navigate('/buy')}
                readOnly
              />
              <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
            </div>
          </div>

          {/* Nav Links (Desktop) */}
          <nav className="hidden lg:flex space-x-6 items-center">
            <button
              onClick={() => navigate('/buy')}
              className={`text-sm font-medium ${
                currentRoute === 'buy' ? 'text-blue-600' : 'text-slate-600 hover:text-slate-950'
              } transition-colors cursor-pointer`}
            >
              Buy Cars
            </button>
            <button
              onClick={() => navigate('/sell')}
              className={`text-sm font-medium ${
                currentRoute === 'sell' ? 'text-blue-600' : 'text-slate-600 hover:text-slate-950'
              } transition-colors cursor-pointer`}
            >
              Sell My Car
            </button>
            <button
              onClick={() => navigate('/service')}
              className={`text-sm font-medium flex items-center gap-1 ${
                currentRoute === 'service' ? 'text-blue-600' : 'text-slate-600 hover:text-slate-950'
              } transition-colors cursor-pointer`}
            >
              <Wrench className="w-4 h-4 text-blue-600" />
              Service & Modification
            </button>
            <button
              onClick={() => navigate('/finance')}
              className={`text-sm font-medium flex items-center gap-1 ${
                currentRoute === 'finance' ? 'text-blue-600' : 'text-slate-600 hover:text-slate-950'
              } transition-colors cursor-pointer`}
            >
              <IndianRupee className="w-4 h-4 text-blue-600" />
              Car Finance
            </button>
            <button
              onClick={() => navigate('/about')}
              className={`text-sm font-medium ${
                currentRoute === 'about' ? 'text-blue-600' : 'text-slate-600 hover:text-slate-950'
              } transition-colors cursor-pointer`}
            >
              About Us
            </button>
            <button
              onClick={() => navigate('/contact')}
              className={`text-sm font-medium ${
                currentRoute === 'contact' ? 'text-blue-600' : 'text-slate-600 hover:text-slate-950'
              } transition-colors cursor-pointer`}
            >
              Contact Support
            </button>
          </nav>

          {/* Right Action Widgets */}
          <div className="flex items-center space-x-4">
            {/* City Selector */}
            <div className="relative">
              <button
                onClick={() => setIsCitySelectorOpen(!isCitySelectorOpen)}
                className="flex items-center text-slate-700 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full text-xs font-semibold hover:border-blue-600 transition-colors gap-1.5 cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                <span>{activeCity || 'Select City'}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isCitySelectorOpen && (
                <div id="city-selector-dropdown" className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-1 text-slate-400 text-[10px] uppercase font-mono tracking-wider font-bold">
                    Popular Cities
                  </div>
                  {CITIES.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => handleCitySelect(c.name)}
                      className={`w-full text-left px-4 py-2 text-xs hover:bg-slate-50 transition-colors cursor-pointer block ${
                        activeCity === c.name ? 'text-blue-600 font-semibold bg-blue-50/50' : 'text-slate-700'
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sell CTA Accent Button */}
            <button
              onClick={() => navigate('/sell')}
              className="hidden sm:inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-full transition-all shadow-xs gap-1.5 hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
            >
              🚀 Sell My Car
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 focus:outline-hidden cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div id="mobile-navigation-menu" className="lg:hidden border-t border-slate-200 bg-white py-4 px-4 space-y-3 shadow-md animate-in fade-in slide-in-from-top-1">
          {/* Quick Search */}
          <div className="relative w-full pb-2">
            <input
              type="text"
              placeholder="Search verified cars..."
              className="w-full bg-slate-50 border border-slate-200 rounded-full py-2 pl-10 pr-4 text-xs text-slate-900 focus:outline-hidden"
              onClick={() => {
                setIsMobileMenuOpen(false);
                navigate('/buy');
              }}
              readOnly
            />
            <Search className="absolute left-3.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
          </div>

          <div className="grid grid-cols-2 gap-2 pb-2">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                navigate('/buy');
              }}
              className="w-full text-center py-2.5 bg-slate-50 rounded-lg text-xs font-semibold text-slate-700 border border-slate-200 hover:bg-slate-100 cursor-pointer"
            >
              Browse Cars
            </button>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                navigate('/sell');
              }}
              className="w-full text-center py-2.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 cursor-pointer"
            >
              Sell My Car
            </button>
          </div>

          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              navigate('/service');
            }}
            className="w-full text-left py-2 px-3 hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-700 flex items-center gap-2 cursor-pointer"
          >
            <Wrench className="w-4 h-4 text-blue-600" /> Doorstep Service & Modification
          </button>

          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              navigate('/finance');
            }}
            className="w-full text-left py-2 px-3 hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-700 flex items-center gap-2 cursor-pointer"
          >
            <IndianRupee className="w-4 h-4 text-blue-600" /> Car Finance & Loan EMI
          </button>

          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              navigate('/about');
            }}
            className="w-full text-left py-2 px-3 hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-700 cursor-pointer block"
          >
            About ManaUsedCars
          </button>

          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              navigate('/contact');
            }}
            className="w-full text-left py-2 px-3 hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-700 cursor-pointer block"
          >
            Contact Customer Support
          </button>

          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              navigate('/admin');
            }}
            className="w-full text-left py-2 px-3 bg-red-50 hover:bg-red-100 rounded-lg text-xs font-bold text-red-700 cursor-pointer block"
          >
            Leads Console (Demo Log)
          </button>
        </div>
      )}
    </header>
  );
}
