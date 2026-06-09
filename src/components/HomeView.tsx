import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Shield, Award, Sparkles, Receipt, IndianRupee, HelpCircle, ChevronDown, ChevronUp, CheckCircle, ArrowRight, Star, Heart, MapPin, Wrench } from 'lucide-react';
import { CARS, BRANDS, CITIES, TESTIMONIALS, FAQS } from '../data';
import { Car } from '../types';
import BrandLogo from './BrandLogo';

interface HomeViewProps {
  navigate: (path: string) => void;
  setSearchPreset: (preset: { brand?: string; city?: string; budget?: number; fuel?: string }) => void;
}

export default function HomeView({ navigate, setSearchPreset }: HomeViewProps) {
  // Hero filters states
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedBudget, setSelectedBudget] = useState('');
  const [selectedFuel, setSelectedFuel] = useState('');

  // Active FAQ IDs for accordion
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq1');

  // Interactive Search Trigger
  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchPreset({
      brand: selectedBrand || undefined,
      city: selectedCity || undefined,
      budget: selectedBudget ? parseFloat(selectedBudget) : undefined,
      fuel: selectedFuel || undefined
    });
    navigate('/buy');
  };

  // Quick select brand
  const handleBrandClick = (brandName: string) => {
    setSearchPreset({ brand: brandName });
    navigate(`/brands/${brandName.toLowerCase().replace(' ', '-')}`);
  };

  // Quick select city
  const handleCityClick = (cityName: string) => {
    setSearchPreset({ city: cityName });
    navigate(`/cars/${cityName.toLowerCase().replace(' ncr', '')}`);
  };

  return (
    <div id="home-view" className="space-y-16 pb-16 bg-white shrink-0">
      
      {/* 1. HERO SEARCH INTERFACE */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 text-white overflow-hidden border-b border-blue-900/40">
        
        {/* Subtle grid background decoration */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent pointer-events-none"></div>

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-8">
          
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold tracking-wide bg-blue-500/15 border border-blue-500/20 text-blue-300">
              ⚡ Certified Trust-First Used Cars
            </span>
            <h1 className="font-sans font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-tight leading-tight">
              India's Trusted <br className="hidden sm:inline"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                Used Car Marketplace
              </span>
            </h1>
            <p className="max-w-2xl mx-auto text-sm sm:text-lg text-slate-300 font-sans tracking-wide">
              Buy certified cars with a 150-point inspection report, or sell yours from your doorstep at the absolute best market price.
            </p>
          </motion.div>

          {/* Search Card Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="bg-white text-slate-800 p-6 rounded-2xl shadow-2xl border border-slate-100 max-w-4xl mx-auto"
          >
            <form onSubmit={handleHeroSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 items-end text-left">
              
              {/* Brand Filter */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-sans">Brand</label>
                <div className="relative">
                  <select
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-blue-100 focus:border-blue-600 focus:outline-hidden cursor-pointer appearance-none"
                  >
                    <option value="">Any Brand</option>
                    {BRANDS.map((b) => (
                      <option key={b.id} value={b.name}>{b.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* City Filter */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-sans">Location</label>
                <div className="relative">
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-blue-100 focus:border-blue-600 focus:outline-hidden cursor-pointer appearance-none"
                  >
                    <option value="">Any City</option>
                    {CITIES.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Budget Filter */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-sans">Max Budget</label>
                <div className="relative">
                  <select
                    value={selectedBudget}
                    onChange={(e) => setSelectedBudget(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-blue-100 focus:border-blue-600 focus:outline-hidden cursor-pointer appearance-none"
                  >
                    <option value="">No Limit</option>
                    <option value="5">Under ₹5 Lakhs</option>
                    <option value="8">Under ₹8 Lakhs</option>
                    <option value="12">Under ₹12 Lakhs</option>
                    <option value="18">Under ₹18 Lakhs</option>
                    <option value="25">Under ₹25 Lakhs</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Fuel Type */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-sans">Fuel Type</label>
                <div className="relative">
                  <select
                    value={selectedFuel}
                    onChange={(e) => setSelectedFuel(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-blue-100 focus:border-blue-600 focus:outline-hidden cursor-pointer appearance-none"
                  >
                    <option value="">Any Fuel</option>
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="CNG">CNG</option>
                    <option value="Electric">Electric</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Action Button */}
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl text-xs sm:text-sm transitions duration-150 inline-flex items-center justify-center gap-1.5 cursor-pointer shadow-sm hover:shadow-md"
              >
                <Search className="w-4 h-4" />
                <span>Search Cars</span>
              </button>
            </form>
          </motion.div>

          {/* Quick Dual Action CTAs for direct pathways */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 text-sm pt-2">
            <span className="text-slate-400">What are you looking to do?</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/buy')}
                className="px-5 py-2 bg-slate-800/80 hover:bg-slate-800 text-white font-semibold border border-slate-700 rounded-full transition-colors cursor-pointer inline-flex items-center gap-1.5 hover:border-slate-500"
              >
                🔍 Buy Verified Used Car
              </button>
              <button
                onClick={() => navigate('/sell')}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full transition-all cursor-pointer inline-flex items-center gap-1.5 hover:-translate-y-0.5"
              >
                🚀 Sell Registered Car
              </button>
            </div>
          </div>

          {/* Trust Metrics Grid (White outlines in Slate Hero) */}
          <div className="border-t border-slate-800/60 pt-10 mt-10 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="space-y-1">
              <p className="text-2xl sm:text-3xl font-extrabold text-blue-400">50,000+</p>
              <p className="text-[11px] text-slate-400 font-mono tracking-wider uppercase">Verified Cars Sold</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl sm:text-3xl font-extrabold text-blue-400">100+</p>
              <p className="text-[11px] text-slate-400 font-mono tracking-wider uppercase">Tier-1 & 2 Cities Covered</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl sm:text-3xl font-extrabold text-blue-400">4.8 ★</p>
              <p className="text-[11px] text-slate-400 font-mono tracking-wider uppercase">Customer Trust Score</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl sm:text-3xl font-extrabold text-blue-400">100%</p>
              <p className="text-[11px] text-slate-400 font-mono tracking-wider uppercase">Verified Paper Transfer</p>
            </div>
          </div>

        </div>
      </section>

      {/* 2. BRONDS LANDING GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <h2 className="font-sans font-bold text-2xl sm:text-3xl tracking-tight text-slate-900">
            Browse by Popular Brands
          </h2>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            Select an OEM partner to view certified used models with warranty packages.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-3">
          {BRANDS.map((b) => (
            <div
              key={b.id}
              onClick={() => handleBrandClick(b.name)}
              className="group cursor-pointer border border-slate-200 hover:border-blue-600 bg-white hover:bg-blue-50/20 p-4 rounded-2xl text-center transition-all hover:shadow-md hover:-translate-y-1 flex flex-col justify-center items-center space-y-3"
            >
              <div className="w-14 h-14 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <BrandLogo id={b.id} />
              </div>
              <span className="text-[11px] font-bold text-slate-700 tracking-tight group-hover:text-blue-600 font-sans truncate w-full">
                {b.name}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. DOORSTEP CAR SERVICING PROMOTION BLOCK (Valuable requested Doorstep Servicing feature) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-gradient-to-br from-blue-700 to-blue-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl overflow-hidden border border-blue-600">
          <div className="absolute right-0 bottom-0 top-0 opacity-15 pointer-events-none flex items-center justify-center p-8">
            <Wrench className="w-72 h-72 text-white stroke-1" />
          </div>
          <div className="relative z-10 max-w-xl space-y-6 text-left">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-yellow-400 text-slate-950 font-mono">
              ★ DOORSTEP MECHANIC SERVICE
            </span>
            <div className="space-y-2">
              <h3 className="font-sans font-bold text-2xl sm:text-3xl leading-tight">
                No time? We service your car right at your doorstep!
              </h3>
              <p className="text-blue-100 text-sm sm:text-base">
                Oil changes, computer diagnostics, filter replacements, and polishing. Witness the work live without stepping out of your apartment.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 items-center pt-2">
              <button
                onClick={() => navigate('/service')}
                className="bg-yellow-400 hover:bg-yellow-500 text-slate-950 font-bold px-6 py-3 rounded-xl text-xs sm:text-sm transition-all hover:shadow-lg hover:-translate-y-0.5 cursor-pointer flex items-center gap-1.5"
              >
                🔧 Book Doorstep Service Now
                <ArrowRight className="w-4 h-4" />
              </button>
              <div className="text-xs text-blue-100 font-mono flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-green-400" /> Services starting from ₹1,499 only
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FEATURED USED CARS */}
      <section className="bg-slate-50 border-y border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
            <div className="space-y-1 text-left">
              <h2 className="font-sans font-bold text-2xl sm:text-3xl tracking-tight text-slate-900">
                Trending Verified Listings
              </h2>
              <p className="text-slate-500 text-sm">
                Each list contains a verified dealer seal and downloadable inspection report.
              </p>
            </div>
            
            <button
              onClick={() => navigate('/buy')}
              className="inline-flex items-center text-sm font-bold text-blue-600 hover:text-blue-700 gap-1.5 group cursor-pointer focus:outline-hidden"
            >
              <span>View All Listings</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Cars Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CARS.slice(0, 4).map((car) => (
              <div
                key={car.id}
                onClick={() => navigate(`/car/${car.id}`)}
                className="group bg-white rounded-2xl border border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-lg transition-all cursor-pointer flex flex-col h-full overflow-hidden"
              >
                {/* Photo Header */}
                <div className="relative aspect-video bg-slate-100 overflow-hidden">
                  <img
                    referrerPolicy="no-referrer"
                    src={car.images[0]}
                    alt={`${car.brand} ${car.model}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Quality Badge overlays */}
                  <div className="absolute top-2.5 left-2.5 bg-blue-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-md uppercase font-mono tracking-wider">
                    {car.inspectionScore}% Certified
                  </div>

                  <div className="absolute bottom-2.5 right-2.5 bg-slate-900/80 text-white text-[10px] px-2 py-0.5 rounded-sm font-mono uppercase">
                    {car.city}
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-4 text-left">
                  <div className="space-y-1">
                    <p className="text-xs font-mono font-bold text-slate-400 uppercase tracking-tight">
                      {car.year} • {car.owner}
                    </p>
                    <h3 className="font-sans font-bold text-base text-slate-900 group-hover:text-blue-600 transition-colors">
                      {car.brand} {car.model}
                    </h3>
                    <p className="text-xs text-slate-500">{car.variant}</p>
                  </div>

                  {/* Highlights Bar */}
                  <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-100 text-[10px] font-semibold text-slate-600">
                    <div className="text-center">
                      <p className="text-slate-400 font-normal">Fuel</p>
                      <p className="truncate font-mono">{car.fuel}</p>
                    </div>
                    <div className="text-center border-x border-slate-100">
                      <p className="text-slate-400 font-normal">Transmission</p>
                      <p className="truncate font-mono">{car.transmission}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-slate-400 font-normal">Driven</p>
                      <p className="truncate font-mono">{(car.km / 1000).toFixed(0)}K km</p>
                    </div>
                  </div>

                  {/* Pricing segment */}
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Buyout Price</p>
                      <p className="text-lg font-extrabold text-slate-900 font-sans">
                        ₹{car.price.toFixed(2)} Lakh
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-[9px] text-slate-400 font-bold uppercase">Estimated EMI</p>
                      <p className="text-xs font-bold text-slate-700 font-mono">
                        ₹{car.emi.toLocaleString('en-IN')}/mo
                      </p>
                    </div>
                  </div>

                  {/* CTA Inside */}
                  <button className="w-full bg-slate-50 hover:bg-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors text-slate-800 text-xs font-bold py-2 rounded-xl border border-slate-200 group-hover:border-blue-600 inline-flex items-center justify-center gap-1.5 cursor-pointer">
                    <span>View Inspection Report</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. WHY CHOOSE US */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-12">
          <h2 className="font-sans font-bold text-2xl sm:text-3xl tracking-tight text-slate-900">
            Why Hundreds Choose ManaUsedCars
          </h2>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            Establishing absolute integrity in the Indian used car space through transparent engineering.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          <div className="p-6 border border-slate-100 rounded-2xl bg-white shadow-xs space-y-3 text-left hover:shadow-md transition-shadow">
            <div className="p-3 bg-blue-50/80 text-blue-600 rounded-xl w-fit">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="font-sans font-bold text-base text-slate-900">Verified Cars</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              150-point checklist covering core chassis health, electronics, and odometer validation.
            </p>
          </div>

          <div className="p-6 border border-slate-100 rounded-2xl bg-white shadow-xs space-y-3 text-left hover:shadow-md transition-shadow">
            <div className="p-3 bg-blue-50/80 text-blue-600 rounded-xl w-fit">
              <IndianRupee className="w-6 h-6" />
            </div>
            <h3 className="font-sans font-bold text-base text-slate-900">Transparent Pricing</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              No commission, no markup. Pay exactly what the owner demands with free document transfers.
            </p>
          </div>

          <div className="p-6 border border-slate-100 rounded-2xl bg-white shadow-xs space-y-3 text-left hover:shadow-md transition-shadow">
            <div className="p-3 bg-blue-50/80 text-blue-600 rounded-xl w-fit">
              <Receipt className="w-6 h-6" />
            </div>
            <h3 className="font-sans font-bold text-base text-slate-900">Inspection Reports</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Download extensive reports instantly, detailing paint thickness, suspension decay, and compression.
            </p>
          </div>

          <div className="p-6 border border-slate-100 rounded-2xl bg-white shadow-xs space-y-3 text-left hover:shadow-md transition-shadow">
            <div className="p-3 bg-blue-50/80 text-blue-600 rounded-xl w-fit">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-sans font-bold text-base text-slate-900">Easy Financing</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Tie-ups with private banking partners starting from 9.25% with 2-hour online sanction approvals.
            </p>
          </div>

          <div className="p-6 border border-slate-100 rounded-2xl bg-white shadow-xs space-y-3 text-left hover:shadow-md transition-shadow">
            <div className="p-3 bg-blue-50/80 text-blue-600 rounded-xl w-fit">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-sans font-bold text-base text-slate-900">Nationwide Support</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Our dedicated staff guides you through local RTO formalities and transfers completely free.
            </p>
          </div>
        </div>
      </section>

      {/* 6. HOW IT WORKS */}
      <section className="bg-slate-50 border-y border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center space-y-2 mb-12">
            <h2 className="font-sans font-bold text-2xl sm:text-3xl tracking-tight text-slate-900">
              The ManaUsedCars Blueprint
            </h2>
            <p className="text-slate-500 text-sm max-w-md mx-auto">
              Our streamlined procedures engineered for peak reassurance. No hidden details.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Buying Process */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6 text-left">
              <div className="flex items-center space-x-2">
                <span className="p-2 bg-blue-100 text-blue-700 rounded-lg text-xs font-bold uppercase font-mono">
                  Buyer Path
                </span>
                <h3 className="text-xl font-bold font-sans text-slate-900">How to Buy</h3>
              </div>

              <div className="space-y-4">
                <div className="flex gap-4 items-start">
                  <div className="flex items-center justify-center bg-blue-50 text-blue-600 rounded-xl w-8 h-8 text-xs font-mono font-bold shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-sans font-bold text-sm text-slate-900">Search Listings</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Browse certified vehicles filtered by make, odometer, ownership history, and city.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="flex items-center justify-center bg-blue-50 text-blue-600 rounded-xl w-8 h-8 text-xs font-mono font-bold shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-sans font-bold text-sm text-slate-900">Compare Parameters</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Contrast mileage data, paint depth integrity, engine compression, and owner valuations.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="flex items-center justify-center bg-blue-50 text-blue-600 rounded-xl w-8 h-8 text-xs font-mono font-bold shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-sans font-bold text-sm text-slate-900">Inspect On-site</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Schedule a zero-cost test drive or book an advanced on-site technician report.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="flex items-center justify-center bg-blue-50 text-blue-600 rounded-xl w-8 h-8 text-xs font-mono font-bold shrink-0">
                    4
                  </div>
                  <div>
                    <h4 className="font-sans font-bold text-sm text-slate-900">Close Deal Securely</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Pay the seller directly via secure bank link while ManaUsedCars completes RTO registration.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Selling Process */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6 text-left">
              <div className="flex items-center space-x-2">
                <span className="p-2 bg-green-100 text-green-700 rounded-lg text-xs font-bold uppercase font-mono">
                  Seller Path
                </span>
                <h3 className="text-xl font-bold font-sans text-slate-900">How to Sell</h3>
              </div>

              <div className="space-y-4">
                <div className="flex gap-4 items-start">
                  <div className="flex items-center justify-center bg-green-50 text-green-600 rounded-xl w-8 h-8 text-xs font-mono font-bold shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-sans font-bold text-sm text-slate-900">Submit Details</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Furnish your vehicle metrics (registration year, odometer, city) in under a minute.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="flex items-center justify-center bg-green-50 text-green-600 rounded-xl w-8 h-8 text-xs font-mono font-bold shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-sans font-bold text-sm text-slate-900">Get Free Valuation</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Our interactive pricing engine generates a highly precise real-time ballpark price index.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="flex items-center justify-center bg-green-50 text-green-600 rounded-xl w-8 h-8 text-xs font-mono font-bold shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-sans font-bold text-sm text-slate-900">Doorstep Inspection</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Book a free physical check at your residence. An inspector visits with diagnostic tools.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="flex items-center justify-center bg-green-50 text-green-600 rounded-xl w-8 h-8 text-xs font-mono font-bold shrink-0">
                    4
                  </div>
                  <div>
                    <h4 className="font-sans font-bold text-sm text-slate-900">Instant Handover</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Accept our premium buyout bid and receive electronic funds within 60 minutes, hands free.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 7. CUSTOMER REVIEWS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <h2 className="font-sans font-bold text-2xl sm:text-3xl tracking-tight text-slate-900">
            Approved by Indian Drivers
          </h2>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            Real feedback from verified purchasers and sellers across our metropolitan centers.
          </p>
        </div>

        {/* Testimonials Static Grid with Custom Visual Accentuation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TESTIMONIALS.map((t) => (
            <div key={t.id} className="p-6 border border-slate-200/60 rounded-2xl bg-white shadow-xs flex flex-col justify-between space-y-4 text-left">
              <div className="space-y-3">
                <div className="flex items-center space-x-0.5 text-amber-500">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star
                      key={idx}
                      className={`w-3.5 h-3.5 fill-current ${
                        idx < Math.floor(t.rating) ? 'text-amber-500' : 'text-slate-200'
                      }`}
                    />
                  ))}
                  <span className="text-xs text-slate-500 font-bold ml-1">{t.rating}</span>
                </div>
                <p className="text-xs text-slate-600 italic leading-relaxed">
                  "{t.text}"
                </p>
              </div>

              <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                <div>
                  <h4 className="font-sans font-bold text-xs text-slate-900">{t.name}</h4>
                  <p className="text-[10px] text-slate-400 font-mono">{t.location}</p>
                </div>
                <span className="text-[9px] bg-slate-50 font-bold text-slate-500 px-2 py-0.5 rounded border border-slate-100">
                  {t.carModel}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. FAQ SECTION (Collabsible Accordions) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center space-y-2 mb-10">
          <div className="flex justify-center">
            <div className="p-2 bg-yellow-100 text-yellow-800 rounded-full">
              <HelpCircle className="w-5 h-5" />
            </div>
          </div>
          <h2 className="font-sans font-bold text-2xl sm:text-3xl tracking-tight text-slate-900">
            Frequently Asked Inquiries
          </h2>
          <p className="text-slate-500 text-sm max-w-sm mx-auto">
            Need further assistance? Check out these common subjects or contact our support team.
          </p>
        </div>

        {/* Collapsible List */}
        <div className="space-y-3">
          {FAQS.map((faq) => {
            const isOpen = openFaqId === faq.id;
            return (
              <div
                key={faq.id}
                className="border border-slate-200 rounded-xl bg-white overflow-hidden transition-all text-left"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                  className="w-full flex justify-between items-center px-5 py-4 text-slate-900 hover:bg-slate-50 transition-colors text-xs sm:text-sm font-bold font-sans cursor-pointer"
                >
                  <span>{faq.question}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-slate-500 leading-relaxed border-t border-slate-100 animate-in slide-in-from-top-1 duration-150">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
