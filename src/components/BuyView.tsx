import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SlidersHorizontal, Grid, List, Search, RotateCcw, X, Sliders, ChevronDown, Check, ArrowUpDown, Clock } from 'lucide-react';
import { CARS, BRANDS, CITIES } from '../data';
import { Car } from '../types';

interface BuyViewProps {
  navigate: (path: string) => void;
  initialFilters?: {
    brand?: string;
    city?: string;
    budget?: number; // max budget in Lakhs
    fuel?: string;
  };
  onClearInitialFilters?: () => void;
}

type SortOption = 'price-asc' | 'price-desc' | 'km-asc' | 'year-desc' | 'score-desc';

export default function BuyView({ navigate, initialFilters, onClearInitialFilters }: BuyViewProps) {
  // Navigation layout state
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Search, Sort and Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState(initialFilters?.brand || '');
  const [selectedCity, setSelectedCity] = useState(initialFilters?.city || '');
  const [selectedFuel, setSelectedFuel] = useState(initialFilters?.fuel || '');
  const [selectedTransmission, setSelectedTransmission] = useState('');
  const [selectedOwner, setSelectedOwner] = useState('');
  const [maxPrice, setMaxPrice] = useState<number>(initialFilters?.budget || 30); // 30 Lakh max default
  const [maxKm, setMaxKm] = useState<number>(100000); // 100k km max
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortOption>('score-desc');

  // Infinite Scroll / Load more state
  const [visibleCount, setVisibleCount] = useState(8);

  // Sync initial filters when props provide updates (from hero selector or header)
  useEffect(() => {
    if (initialFilters) {
      if (initialFilters.brand) setSelectedBrand(initialFilters.brand);
      if (initialFilters.city) setSelectedCity(initialFilters.city);
      if (initialFilters.fuel) setSelectedFuel(initialFilters.fuel);
      if (initialFilters.budget) setMaxPrice(initialFilters.budget);
    }
  }, [initialFilters]);

  // Reset Filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedBrand('');
    setSelectedCity('');
    setSelectedFuel('');
    setSelectedTransmission('');
    setSelectedOwner('');
    setMaxPrice(30);
    setMaxKm(100000);
    setSelectedYear('');
    setSortBy('score-desc');
    setVisibleCount(8);
    if (onClearInitialFilters) onClearInitialFilters();
    navigate('/buy');
  };

  // Filter and Sort Computing
  const filteredCars = useMemo(() => {
    let result = [...CARS];

    // 1. Brand Filter
    if (selectedBrand) {
      result = result.filter(c => c.brand.toLowerCase() === selectedBrand.toLowerCase());
    }

    // 2. City Filter
    if (selectedCity) {
      result = result.filter(c => c.city.toLowerCase() === selectedCity.toLowerCase());
    }

    // 3. Fuel Filter
    if (selectedFuel) {
      result = result.filter(c => c.fuel.toLowerCase() === selectedFuel.toLowerCase());
    }

    // 4. Transmission
    if (selectedTransmission) {
      result = result.filter(c => c.transmission.toLowerCase() === selectedTransmission.toLowerCase());
    }

    // 5. Ownership
    if (selectedOwner) {
      result = result.filter(c => c.owner.toLowerCase() === selectedOwner.toLowerCase());
    }

    // 6. Max Price
    if (maxPrice) {
      result = result.filter(c => c.price <= maxPrice);
    }

    // 7. Max KM
    if (maxKm) {
      result = result.filter(c => c.km <= maxKm);
    }

    // 8. Odometer year
    if (selectedYear) {
      result = result.filter(c => c.year >= parseInt(selectedYear));
    }

    // 9. Search Bar text
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result.filter(c => 
        c.brand.toLowerCase().includes(q) ||
        c.model.toLowerCase().includes(q) ||
        c.variant.toLowerCase().includes(q) ||
        c.overview.toLowerCase().includes(q)
      );
    }

    // 10. Direct Sorting Matcher
    result.sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'km-asc') return a.km - b.km;
      if (sortBy === 'year-desc') return b.year - a.year;
      return b.inspectionScore - a.inspectionScore; // default 'score-desc'
    });

    return result;
  }, [
    selectedBrand, selectedCity, selectedFuel, selectedTransmission,
    selectedOwner, maxPrice, maxKm, selectedYear, searchTerm, sortBy
  ]);

  // Handle Load More
  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 4);
  };

  const paginatedCars = filteredCars.slice(0, visibleCount);

  return (
    <div id="buy-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-left bg-white">
      
      {/* Search and Quick Metrics */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
        <div>
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest font-mono">Verified Inventory</span>
          <h1 className="font-sans font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight mt-1">
            Certified Used Cars India
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Showing {filteredCars.length} of {CARS.length} pre-owned vehicles with active certificates
          </p>
        </div>

        {/* Global Keyword Search */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full lg:w-auto">
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by keywords (e.g. sunroof, AWD, i20)..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-xs text-slate-900 focus:outline-hidden focus:border-blue-600 focus:bg-white"
            />
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center border border-slate-200 rounded-xl p-1 gap-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${viewMode === 'grid' ? 'bg-slate-100 text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${viewMode === 'list' ? 'bg-slate-100 text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* ================= DESKTOP SIDEBAR FILTERS ================= */}
        <aside className="hidden lg:block bg-slate-50 border border-slate-200 p-6 rounded-2xl space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-slate-200">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs uppercase tracking-wider font-mono">
              <SlidersHorizontal className="w-4 h-4 text-blue-600" />
              <span>Filters</span>
            </div>
            <button
              onClick={handleResetFilters}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer focus:outline-hidden"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>

          {/* Quick filter city tag */}
          {initialFilters && (initialFilters.brand || initialFilters.city) && (
            <div className="flex flex-wrap gap-1.5 pb-2">
              {setSelectedBrand && selectedBrand && (
                <span className="inline-flex items-center gap-1 text-[10px] bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-md uppercase font-mono">
                  {selectedBrand}
                  <X className="w-3 h-3 hover:text-red-600 cursor-pointer" onClick={() => setSelectedBrand('')} />
                </span>
              )}
              {setSelectedCity && selectedCity && (
                <span className="inline-flex items-center gap-1 text-[10px] bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-md uppercase font-mono">
                  {selectedCity}
                  <X className="w-3 h-3 hover:text-red-600 cursor-pointer" onClick={() => setSelectedCity('')} />
                </span>
              )}
            </div>
          )}

          {/* Brand Filter */}
          <div className="space-y-1.5 text-xs text-left">
            <p className="font-bold text-slate-700">Brand</p>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-hidden focus:border-blue-600 cursor-pointer"
            >
              <option value="">All Brands</option>
              {BRANDS.map(b => (
                <option key={b.id} value={b.name}>{b.name}</option>
              ))}
            </select>
          </div>

          {/* City Filter */}
          <div className="space-y-1.5 text-xs text-left">
            <p className="font-bold text-slate-700">Metro City</p>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-hidden focus:border-blue-600 cursor-pointer"
            >
              <option value="">All Cities</option>
              {CITIES.map(c => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-2 text-xs text-left">
            <div className="flex justify-between items-center">
              <p className="font-bold text-slate-700">Max Budget</p>
              <span className="font-bold font-mono text-blue-600">₹{maxPrice.toFixed(2)} Lakh</span>
            </div>
            <input
              type="range"
              min="3"
              max="30"
              step="0.5"
              value={maxPrice}
              onChange={(e) => setMaxPrice(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 focus:outline-hidden"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>₹3 Lakhs</span>
              <span>₹30 Lakhs</span>
            </div>
          </div>

          {/* Kilometers Driven Limit */}
          <div className="space-y-2 text-xs text-left">
            <div className="flex justify-between items-center">
              <p className="font-bold text-slate-700">Max KM Driven</p>
              <span className="font-bold font-mono text-blue-600">{(maxKm).toLocaleString('en-IN')} km</span>
            </div>
            <input
              type="range"
              min="10000"
              max="100000"
              step="5000"
              value={maxKm}
              onChange={(e) => setMaxKm(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 focus:outline-hidden"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>10,000 km</span>
              <span>100,000 km</span>
            </div>
          </div>

          {/* Fuel Type */}
          <div className="space-y-1.5 text-xs text-left">
            <p className="font-bold text-slate-700">Fuel Preference</p>
            <div className="grid grid-cols-2 gap-2">
              {['Petrol', 'Diesel', 'CNG', 'Electric'].map((fuelOp) => (
                <button
                  type="button"
                  key={fuelOp}
                  onClick={() => setSelectedFuel(selectedFuel === fuelOp ? '' : fuelOp)}
                  className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold text-center border cursor-pointer transition-colors ${
                    selectedFuel === fuelOp
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  {fuelOp}
                </button>
              ))}
            </div>
          </div>

          {/* Transmission Type */}
          <div className="space-y-1.5 text-xs text-left">
            <p className="font-bold text-slate-700">Transmission</p>
            <div className="flex items-center gap-2">
              {['Manual', 'Automatic'].map((transOp) => (
                <button
                  type="button"
                  key={transOp}
                  onClick={() => setSelectedTransmission(selectedTransmission === transOp ? '' : transOp)}
                  className={`flex-1 py-1.5 rounded-lg text-center text-xs font-semibold border cursor-pointer transition-colors ${
                    selectedTransmission === transOp
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  {transOp}
                </button>
              ))}
            </div>
          </div>

          {/* Registration Model Year Slider */}
          <div className="space-y-1.5 text-xs text-left font-sans">
            <p className="font-bold text-slate-700">Minimum Year</p>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-hidden focus:border-blue-600 cursor-pointer"
            >
              <option value="">Any Year</option>
              <option value="2022">2022 & Newer</option>
              <option value="2021">2021 & Newer</option>
              <option value="2020">2020 & Newer</option>
              <option value="2019">2019 & Newer</option>
              <option value="2018">2018 & Newer</option>
            </select>
          </div>

          {/* Ownership Status */}
          <div className="space-y-1.5 text-xs text-left font-sans">
            <p className="font-bold text-slate-700">Ownership</p>
            <select
              value={selectedOwner}
              onChange={(e) => setSelectedOwner(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-hidden focus:border-blue-600 cursor-pointer"
            >
              <option value="">Any Owner</option>
              <option value="1st Owner">First Hand (1st Owner)</option>
              <option value="2nd Owner">Second Hand (2nd Owner)</option>
            </select>
          </div>

          {/* Action Support Block inside the Sidebar */}
          <div className="p-4 bg-blue-50/50 rounded-xl text-left border border-blue-100 space-y-2">
            <p className="text-[10px] font-bold text-blue-700 uppercase tracking-wide">💡 Free Inspection Check</p>
            <p className="text-[11px] text-slate-600 leading-normal">
              Book a doorstep evaluation with our representative and receive verified RTO checklists.
            </p>
            <button 
              onClick={() => navigate('/contact')}
              className="text-[11px] font-extrabold text-blue-600 hover:underline cursor-pointer block"
            >
              Contact inspector now →
            </button>
          </div>
        </aside>

        {/* ================= INVENTORY LISTINGS AREA ================= */}
        <section className="lg:col-span-3 space-y-6">
          
          {/* Mobile Filter Drawer Launcher / Sort Selector */}
          <div className="flex justify-between items-center bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl lg:hidden">
            <button
              onClick={() => setIsMobileFiltersOpen(true)}
              className="flex items-center gap-1.5 py-1 text-slate-700 text-xs font-bold font-sans cursor-pointer"
            >
              <Sliders className="w-4 h-4 text-blue-600" />
              <span>Filters Drawer</span>
            </button>

            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-sans">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="bg-transparent text-slate-700 font-semibold focus:outline-hidden cursor-pointer"
              >
                <option value="score-desc">Top Certified</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="km-asc">KM Driven: Low to High</option>
                <option value="year-desc">Year: Newest First</option>
              </select>
            </div>
          </div>

          {/* Sorting Control Row (Desktop) */}
          <div className="hidden lg:flex justify-between items-center pb-4 border-b border-slate-100">
            <div className="text-xs text-slate-500 font-sans font-medium">
              We parsed <span className="font-bold text-slate-900">{filteredCars.length}</span> verified cars matching filters
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 font-sans">Sort Portfolio:</span>
              <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg p-0.5">
                {[
                  { value: 'score-desc', label: 'Top Certified' },
                  { value: 'price-asc', label: 'Price: Low' },
                  { value: 'price-desc', label: 'Price: High' },
                  { value: 'km-asc', label: 'Low KM' },
                  { value: 'year-desc', label: 'Newest' }
                ].map((sortOp) => (
                  <button
                    key={sortOp.value}
                    onClick={() => setSortBy(sortOp.value as SortOption)}
                    className={`px-3 py-1 rounded-md font-semibold text-[11px] transition-all cursor-pointer ${
                      sortBy === sortOp.value
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {sortOp.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* CAR LISTINGS CONTAINER */}
          {filteredCars.length === 0 ? (
            <div className="bg-slate-50 border border-slate-200 p-12 text-center rounded-3xl space-y-4 max-w-lg mx-auto">
              <div className="p-3 bg-slate-200/50 rounded-full w-fit mx-auto text-slate-400">
                <Sliders className="w-8 h-8" />
              </div>
              <p className="font-sans font-bold text-base text-slate-900">No Vehicles Match Filters</p>
              <p className="text-xs text-slate-500 leading-normal">
                No inventory matches the selected filters. Try widening your price parameter, choosing "All Cities", or removing specific fuels.
              </p>
              <button
                onClick={handleResetFilters}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg text-xs cursor-pointer block mx-auto"
              >
                Clear Selected Filters
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            /* GRID VIEW */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedCars.map((car) => (
                <div
                  key={car.id}
                  onClick={() => navigate(`/car/${car.id}`)}
                  className="group bg-white rounded-2xl border border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-lg transition-all cursor-pointer flex flex-col h-full overflow-hidden"
                >
                  <div className="relative aspect-video bg-slate-100 overflow-hidden">
                    <img
                      referrerPolicy="no-referrer"
                      src={car.images[0]}
                      alt={`${car.brand} ${car.model}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    <div className="absolute top-2.5 left-2.5 bg-blue-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-sm uppercase font-mono tracking-wider">
                      {car.inspectionScore}% Score
                    </div>

                    <div className="absolute bottom-2.5 right-2.5 bg-slate-900/80 text-white text-[10px] px-2 py-0.5 rounded-sm font-mono uppercase">
                      {car.city}
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-1">
                      <p className="text-xs font-mono font-bold text-slate-400 uppercase tracking-tight">
                        {car.year} • {car.owner}
                      </p>
                      <h3 className="font-sans font-bold text-base text-slate-950 group-hover:text-blue-600 transition-colors">
                        {car.brand} {car.model}
                      </h3>
                      <p className="text-xs text-slate-500">{car.variant}</p>
                    </div>

                    <div className="grid grid-cols-3 gap-1 py-1.5 border-y border-slate-100 text-[9px] font-bold text-slate-600 uppercase tracking-wider font-mono">
                      <div className="text-center">
                        <p className="text-slate-400 font-normal">Fuel</p>
                        <p className="truncate">{car.fuel}</p>
                      </div>
                      <div className="text-center border-x border-slate-100">
                        <p className="text-slate-400 font-normal">Gear</p>
                        <p className="truncate">{car.transmission}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-slate-400 font-normal">Odo</p>
                        <p className="truncate">{(car.km / 1000).toFixed(0)}K km</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-[9px] text-slate-400 font-bold uppercase">Cash Price</p>
                        <p className="text-base font-extrabold text-slate-905">₹{car.price.toFixed(2)} Lakh</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] text-slate-400 font-bold uppercase">Installment</p>
                        <p className="text-xs font-bold text-slate-700 font-mono">₹{car.emi.toLocaleString()}/mo</p>
                      </div>
                    </div>

                    <button className="w-full bg-slate-50 hover:bg-blue-600 group-hover:bg-blue-600 group-hover:text-white border border-slate-200 group-hover:border-blue-600 transition-colors text-slate-800 text-xs font-bold py-2 rounded-xl block text-center cursor-pointer">
                      View Diagnostics Report
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* LIST VIEW */
            <div className="space-y-4">
              {paginatedCars.map((car) => (
                <div
                  key={car.id}
                  onClick={() => navigate(`/car/${car.id}`)}
                  className="group bg-white rounded-2xl border border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-lg transition-all cursor-pointer flex flex-col sm:flex-row overflow-hidden"
                >
                  <div className="relative w-full sm:w-64 md:w-72 bg-slate-100 aspect-video sm:aspect-auto overflow-hidden">
                    <img
                      referrerPolicy="no-referrer"
                      src={car.images[0]}
                      alt={`${car.brand} ${car.model}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 left-2 bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm font-mono">
                      {car.inspectionScore}% Certified
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-1">
                      <div>
                        <p className="text-xs font-mono font-bold text-slate-400 tracking-wider uppercase">
                          {car.year} • {car.owner} • {car.city}
                        </p>
                        <h3 className="font-sans font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors mt-0.5">
                          {car.brand} {car.model} <span className="text-xs font-normal text-slate-500">[{car.variant}]</span>
                        </h3>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Complete Buyout</p>
                        <p className="text-lg font-black text-slate-900">₹{car.price.toFixed(2)} Lakh</p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 leading-normal line-clamp-2">
                      {car.overview}
                    </p>

                    <div className="grid grid-cols-4 gap-2 bg-slate-50 p-2 rounded-xl text-[10px] font-bold text-slate-600 uppercase tracking-wider font-mono text-center border border-slate-100">
                      <div>
                        <p className="text-slate-400 text-[9px] font-normal font-sans">Fuel</p>
                        <p>{car.fuel}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-[9px] font-normal font-sans">Transmission</p>
                        <p>{car.transmission}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-[9px] font-normal font-sans">Odometer</p>
                        <p>{car.km.toLocaleString()} km</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-[9px] font-normal font-sans">Emi Estimate</p>
                        <p className="text-blue-600">₹{car.emi.toLocaleString('en-IN')}/mo</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* INFINITE SCROLL / LOAD MORE BUTTON */}
          {filteredCars.length > visibleCount && (
            <div className="pt-6">
              <button
                onClick={handleLoadMore}
                className="w-full max-w-sm mx-auto bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3 px-6 rounded-xl text-xs transition-transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Clock className="w-4 h-4 text-slate-500" />
                <span>Show More Listings (Infinite Scroll)</span>
              </button>
            </div>
          )}

          {/* Trust Seal for lead generation */}
          <div className="p-6 bg-slate-900 text-white rounded-3xl text-left border border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="space-y-1.5 max-w-md">
              <span className="text-[10px] font-bold text-blue-400 tracking-wider uppercase font-mono">ManaUsedCars Buyer Safeguard</span>
              <h3 className="font-bold text-lg font-sans">Buy with absolute certainty</h3>
              <p className="text-xs text-slate-400 leading-normal">
                We safeguard buyers by managing paperwork transfers, ownership validation and providing transparent seller test drives.
              </p>
            </div>
            <button
              onClick={() => navigate('/contact')}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-full transition-transform shrink-0 hover:scale-105 cursor-pointer block"
            >
              📞 Request Callback Support
            </button>
          </div>

        </section>
      </div>

      {/* ================= MOBILE FILTER DRAWER OVERLAY ================= */}
      <AnimatePresence>
        {isMobileFiltersOpen && (
          <div id="mobile-filter-drawer" className="fixed inset-0 z-50 lg:hidden flex justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileFiltersOpen(false)}
              className="absolute inset-0 bg-slate-950"
            ></motion.div>

            {/* Content Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-sm bg-white h-full shadow-2xl flex flex-col justify-between"
            >
              {/* Header */}
              <div className="p-4 border-b border-slate-200 flex justify-between items-center">
                <span className="font-sans font-bold text-sm text-slate-900 uppercase tracking-widest font-mono">Mobile Filters</span>
                <button
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="p-1 text-slate-500 hover:text-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Filters form */}
              <div className="flex-1 overflow-y-auto p-5 space-y-6">
                
                {/* Brand */}
                <div className="space-y-1.5 text-xs text-left">
                  <p className="font-bold text-slate-700">Brand</p>
                  <select
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-hidden"
                  >
                    <option value="">All Brands</option>
                    {BRANDS.map(b => (
                      <option key={b.id} value={b.name}>{b.name}</option>
                    ))}
                  </select>
                </div>

                {/* City */}
                <div className="space-y-1.5 text-xs text-left">
                  <p className="font-bold text-slate-700">Metro City</p>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-hidden"
                  >
                    <option value="">All Cities</option>
                    {CITIES.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                {/* Price */}
                <div className="space-y-2 text-xs text-left">
                  <div className="flex justify-between items-center">
                    <p className="font-bold text-slate-700">Max Budget</p>
                    <span className="font-bold font-mono text-blue-600">₹{maxPrice} Lakh</span>
                  </div>
                  <input
                    type="range"
                    min="3"
                    max="30"
                    step="1"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>

                {/* Fuel */}
                <div className="space-y-1.5 text-xs text-left">
                  <p className="font-bold text-slate-700">Fuel Preference</p>
                  <div className="grid grid-cols-2 gap-2">
                    {['Petrol', 'Diesel', 'CNG', 'Electric'].map((fuelOp) => (
                      <button
                        type="button"
                        key={fuelOp}
                        onClick={() => setSelectedFuel(selectedFuel === fuelOp ? '' : fuelOp)}
                        className={`py-1.5 px-2 rounded-lg text-xs font-semibold text-center border cursor-pointer ${
                          selectedFuel === fuelOp
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        {fuelOp}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Transmission */}
                <div className="space-y-1.5 text-xs text-left">
                  <p className="font-bold text-slate-700">Transmission</p>
                  <div className="flex gap-2">
                    {['Manual', 'Automatic'].map((transOp) => (
                      <button
                        type="button"
                        key={transOp}
                        onClick={() => setSelectedTransmission(selectedTransmission === transOp ? '' : transOp)}
                        className={`flex-1 py-1.5 rounded-lg text-center text-xs font-semibold border cursor-pointer ${
                          selectedTransmission === transOp
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        {transOp}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Actions Footer */}
              <div className="p-4 border-t border-slate-200 grid grid-cols-2 gap-3 bg-slate-50">
                <button
                  onClick={handleResetFilters}
                  className="w-full text-center py-2.5 bg-slate-200 hover:bg-slate-300 rounded-xl text-xs font-bold text-slate-700 cursor-pointer"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="w-full text-center py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
