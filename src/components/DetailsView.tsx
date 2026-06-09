import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CARS } from '../data';
import { ShieldCheck, Calendar, Disc, Check, Phone, FileText, Sparkles, MessageSquare, AlertCircle, Heart, Share2, Clipboard, ArrowLeft, ArrowRight, UserCheck, Percent, HelpCircle, X, ChevronRight } from 'lucide-react';
import { Car } from '../types';

interface DetailsViewProps {
  carId: string;
  navigate: (path: string) => void;
}

export default function DetailsView({ carId, navigate }: DetailsViewProps) {
  // Look up the car
  const car = useMemo(() => {
    return CARS.find(c => c.id === carId) || CARS[0];
  }, [carId]);

  // Gallery Active Image
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // EMI Slider calculator states
  const [downPaymentPercent, setDownPaymentPercent] = useState(20); // 20% down
  const [tenureMonths, setTenureMonths] = useState(48); // 4 years
  const [interestRate, setInterestRate] = useState(9.5); // 9.5%

  // Lead Modal flow
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [inquiryType, setInquiryType] = useState<'drive' | 'call' | 'report'>('drive');
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const [isLeadSubmittedSuccessfully, setIsLeadSubmittedSuccessfully] = useState(false);

  // Math EMI computation
  const calculatedEMI = useMemo(() => {
    const loanAmount = car.price * 100000 * (1 - downPaymentPercent / 100);
    const r = interestRate / 12 / 100;
    const n = tenureMonths;
    // Standard EMI formula: [P x R x (1+R)^N]/[(1+R)^N-1]
    if (r === 0) return Math.round(loanAmount / n);
    const emi = (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    return Math.round(emi);
  }, [car.price, downPaymentPercent, tenureMonths, interestRate]);

  // Submit Inquiry handler
  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName || !leadPhone) {
      alert("Please provide your Name and Phone Number.");
      return;
    }

    setIsSubmittingLead(true);

    try {
      const response = await fetch('/api/inquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'buy',
          sellerDetails: {
            name: leadName,
            phone: leadPhone,
            email: leadEmail || 'N/A',
            city: car.city
          },
          vehicleDetails: {
            brand: car.brand,
            model: car.model,
            variant: car.variant,
            year: car.year,
            fuel: car.fuel,
            transmission: car.transmission,
            km: car.km
          },
          expectedPrice: car.price,
          condition: `Buyer request: ${inquiryType === 'drive' ? 'Schedule Test Drive' : inquiryType === 'call' ? 'Call Seller Support' : 'Download Inspection Report'}`,
          additionalNotes: `Requested on details view for ${car.brand} ${car.model} (${car.id}). Preferred contact channel - phone.`
        }),
      });

      const resData = await response.json();
      if (resData.success) {
        setIsLeadSubmittedSuccessfully(true);
      } else {
        alert("Server responded with an error, please retry.");
      }
    } catch (err) {
      console.error(err);
      alert("A network error occurred.");
    } finally {
      setIsSubmittingLead(false);
    }
  };

  const openLeadModal = (type: 'drive' | 'call' | 'report') => {
    setInquiryType(type);
    setIsInquiryModalOpen(true);
  };

  // Find similar cars (matching brand or same fuel type in same city, excluding this car)
  const similarCars = useMemo(() => {
    return CARS.filter(c => c.id !== car.id && (c.brand === car.brand || c.fuel === car.fuel)).slice(0, 3);
  }, [car]);

  return (
    <div id="details-view" className="relative bg-white pb-24 text-left">
      
      {/* Back to buy breadcrumbs bar */}
      <div className="bg-slate-50 border-b border-slate-200 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs text-slate-500">
          <button
            onClick={() => navigate('/buy')}
            className="flex items-center gap-1 hover:text-blue-600 transition-colors font-semibold cursor-pointer focus:outline-hidden"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Used Cars Catalog
          </button>
          <span className="font-mono">Certified Code: {car.id.toUpperCase()}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ================= LEFT 7 COLS: GALLERY, OVERVIEW, REPORTS ================= */}
          <div className="lg:col-span-7 space-y-10">
            
            {/* 1. IMAGE GALLERY */}
            <div className="space-y-3">
              {/* Main Expanded Card */}
              <div className="relative aspect-video bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 shadow-sm group">
                <img
                  referrerPolicy="no-referrer"
                  src={car.images[activeImageIndex] || car.images[0]}
                  alt={`${car.brand} ${car.model}`}
                  className="w-full h-full object-cover transition-transform duration-500"
                />
                
                <div className="absolute top-4 left-4 bg-blue-600 text-white text-[10px] font-bold py-1 px-2.5 rounded-full uppercase font-mono tracking-wider">
                  Verified Inspection Score: {car.inspectionScore}/100
                </div>

                <div className="absolute bottom-4 right-4 bg-slate-950/80 backdrop-blur-xs text-white text-xs px-3 py-1 rounded-full font-mono">
                  {car.city} NCR
                </div>
              </div>

              {/* Thumbnails row */}
              <div className="flex gap-3">
                {car.images.map((imgUrl, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImageIndex(i)}
                    className={`relative w-24 aspect-video rounded-xl overflow-hidden border-2 cursor-pointer transition-colors ${
                      activeImageIndex === i ? 'border-blue-600 shadow-md scale-95' : 'border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    <img referrerPolicy="no-referrer" src={imgUrl} className="w-full h-full object-cover" alt="Thumbnail" />
                  </button>
                ))}
              </div>
            </div>

            {/* 2. SPECIFICATIONS GRID */}
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6">
              <h3 className="font-sans font-bold text-lg text-slate-900 border-b border-slate-200 pb-3">
                Technical Specifications
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 font-sans">
                <div className="space-y-1">
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Engine displacement</p>
                  <p className="text-xs sm:text-sm font-bold text-slate-800 font-mono">{car.specifications.engine}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Max Power Peak</p>
                  <p className="text-xs sm:text-sm font-bold text-slate-800 font-mono">{car.specifications.maxPower}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">ARAI Mileage Claim</p>
                  <p className="text-xs sm:text-sm font-bold text-slate-800 font-mono">{car.specifications.mileage}</p>
                </div>
                <div className="space-y-1 border-t border-slate-200/60 pt-4">
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Cabin Seating</p>
                  <p className="text-xs sm:text-sm font-bold text-slate-800 font-mono">{car.specifications.seats} Seater</p>
                </div>
                <div className="space-y-1 border-t border-slate-200/60 pt-4">
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Theme Shade</p>
                  <p className="text-xs sm:text-sm font-bold text-slate-800 font-mono">{car.specifications.color}</p>
                </div>
                <div className="space-y-1 border-t border-slate-200/60 pt-4">
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Registry Year</p>
                  <p className="text-xs sm:text-sm font-bold text-slate-800 font-mono">{car.registrationYear}</p>
                </div>
              </div>
            </div>

            {/* 3. DIAGNOSTIC INSPECTION REPORT (Cashify special) */}
            <div className="border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-4 gap-2">
                <div className="space-y-0.5">
                  <h3 className="font-sans font-bold text-lg text-slate-900">
                    ManaUsedCars verified Technical Check
                  </h3>
                  <p className="text-xs text-slate-400">150-parameter safety assessment completed by certified mechanic.</p>
                </div>
                <span className="bg-green-100 text-green-700 text-xs font-mono font-extrabold px-3 py-1 rounded-full">
                  ★ PASS
                </span>
              </div>

              {/* Progress bars segment */}
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-1">
                    <span>Engine & Transmission Health</span>
                    <span className="text-blue-600 font-mono">94%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full" style={{ width: '94%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-1">
                    <span>Suspension & Steering Alignment</span>
                    <span className="text-blue-600 font-mono">91%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full" style={{ width: '91%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-1">
                    <span>AC / Heating Cooling Rate</span>
                    <span className="text-blue-600 font-mono">92%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full" style={{ width: '92%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-1">
                    <span>Body Paint Depth Integrity</span>
                    <span className="text-blue-600 font-mono">88%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full" style={{ width: '88%' }}></div>
                  </div>
                </div>
              </div>

              {/* Bullet checks list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-4 text-xs font-medium text-slate-600 font-sans">
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-green-600 shrink-0" /> No frame/chassis structural decay</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-green-600 shrink-0" /> Odometer metrics verified against RTO logs</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-green-600 shrink-0" /> Water flood seepage validation passed</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-green-600 shrink-0" /> SRS airbags and seatbelts functional</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-green-600 shrink-0" /> Standard exhaust emission bounds approved</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-green-600 shrink-0" /> Battery voltage decay under 10% bounds</div>
              </div>

              {/* Inspection CTA inside */}
              <button
                onClick={() => openLeadModal('report')}
                className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 py-3 rounded-2xl text-xs font-bold text-slate-800 text-center cursor-pointer flex items-center justify-center gap-1.5 focus:outline-hidden"
              >
                <FileText className="w-4 h-4 text-blue-600" /> Request Full Diagnostic PDF Report
              </button>
            </div>

            {/* 4. VEHICLE OVERVIEW PARAGRAPH */}
            <div className="space-y-4">
              <h3 className="font-sans font-bold text-lg text-slate-900 border-b border-slate-100 pb-2">
                Inspector Notes & Overview
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans first-letter:text-3xl first-letter:font-bold first-letter:text-slate-900 first-letter:mr-1.5 first-letter:float-left">
                {car.overview}
              </p>
            </div>

          </div>

          {/* ================= RIGHT 5 COLS: SUMMARY CARD, LOAN CALCULATOR ================= */}
          <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-20">
            
            {/* 1. CENTRAL VALUE SUMMARY */}
            <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl shadow-xs space-y-5">
              <div className="space-y-1 border-b border-slate-100 pb-4">
                <p className="text-xs font-mono font-bold text-blue-600 uppercase tracking-wider">{car.year} • {car.owner}</p>
                <h1 className="font-sans font-extrabold text-2xl sm:text-3xl text-slate-900">{car.brand} {car.model}</h1>
                <p className="text-sm font-semibold text-slate-500">{car.variant}</p>
              </div>

              {/* Spec row badges */}
              <div className="flex flex-wrap gap-2 py-1">
                <span className="bg-slate-100 text-slate-600 text-xs font-semibold px-3 py-1 rounded-full font-mono">{car.fuel}</span>
                <span className="bg-slate-100 text-slate-600 text-xs font-semibold px-3 py-1 rounded-full font-mono">{car.transmission}</span>
                <span className="bg-slate-100 text-slate-600 text-xs font-semibold px-3 py-1 rounded-full font-mono">{car.km.toLocaleString()} km</span>
              </div>

              {/* Parameters metrics list (Insurance, logs, registration) */}
              <div className="space-y-3 pt-2 text-xs divide-y divide-slate-100">
                <div className="flex justify-between items-center py-2.5">
                  <span className="text-slate-400 font-sans">Active Insurance</span>
                  <span className="font-bold text-slate-800 font-mono">{car.insuranceStatus}</span>
                </div>
                <div className="flex justify-between items-center py-2.5">
                  <span className="text-slate-400 font-sans">Authorized Dealership Logs</span>
                  <span className="font-bold text-blue-600 font-mono flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-blue-600" /> Verified
                  </span>
                </div>
                <div className="flex justify-between items-center py-2.5">
                  <span className="text-slate-400 font-sans">Odometer Validation Check</span>
                  <span className="font-bold text-slate-800 font-mono">100% Genuine</span>
                </div>
                <div className="flex justify-between items-center py-2.5">
                  <span className="text-slate-400 font-sans">RTO Registration state</span>
                  <span className="font-bold text-slate-800 font-mono">{car.city} (Clean)</span>
                </div>
              </div>

              {/* Pricing section */}
              <div className="pt-4 border-t border-slate-100 flex justify-between items-end">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">All-Inclusive Price</p>
                  <p className="text-2xl sm:text-3xl font-black text-slate-900 font-sans leading-tight">
                    ₹{car.price.toFixed(2)} Lakh
                  </p>
                </div>
                
                <div className="text-right">
                  <span className="inline-block bg-green-50 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded font-mono mb-1">
                     No hidden commissions
                  </span>
                  <p className="text-xs text-slate-400">Zero RC Transfer charges</p>
                </div>
              </div>

              {/* Conversion Buttons (Primary actions) */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={() => openLeadModal('drive')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-2xl text-xs sm:text-sm cursor-pointer transition-all hover:shadow-md flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Schedule Home Test Drive</span>
                </button>

                <button
                  onClick={() => openLeadModal('call')}
                  className="w-full bg-slate-900 hover:bg-slate-950 text-white font-bold py-3.5 rounded-2xl text-xs sm:text-sm cursor-pointer transition-all hover:shadow-md flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Verified Owner Support</span>
                </button>
              </div>

              <div className="text-center">
                <p className="text-[10px] text-slate-500 font-sans">
                  🛡️ Booking is protected by our <strong className="text-slate-800">Refund Safeguard Pledge</strong>
                </p>
              </div>
            </div>

            {/* 2. DYNAMIC LOAN FINANCE CALCULATOR */}
            <div className="bg-slate-50 border border-slate-200 p-6 sm:p-8 rounded-3xl space-y-6">
              <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
                <Percent className="w-5 h-5 text-blue-600" />
                <h3 className="font-sans font-bold text-base text-slate-900">
                  Interactive EMI Estimator
                </h3>
              </div>

              {/* Sliders bundle */}
              <div className="space-y-5">
                {/* Sliders 1: Down Payment */}
                <div className="space-y-1.5 text-xs text-left">
                  <div className="flex justify-between font-bold text-slate-600">
                    <span>Down Payment ({downPaymentPercent}%)</span>
                    <span className="font-mono text-blue-600">
                      ₹{((car.price * 100000 * downPaymentPercent) / 100).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="80"
                    step="5"
                    value={downPaymentPercent}
                    onChange={(e) => setDownPaymentPercent(parseInt(e.target.value))}
                    className="w-full h-1 bg-slate-200 rounded appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>Min 10%</span>
                    <span>Max 80%</span>
                  </div>
                </div>

                {/* Sliders 2: Loan Tenure */}
                <div className="space-y-1.5 text-xs text-left">
                  <div className="flex justify-between font-bold text-slate-600">
                    <span>Loan Duration</span>
                    <span className="font-mono text-blue-600">{tenureMonths / 12} Years ({tenureMonths} Mo)</span>
                  </div>
                  <input
                    type="range"
                    min="12"
                    max="84"
                    step="12"
                    value={tenureMonths}
                    onChange={(e) => setTenureMonths(parseInt(e.target.value))}
                    className="w-full h-1 bg-slate-200 rounded appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono font-bold">
                    <span>1 yr</span>
                    <span>7 yrs</span>
                  </div>
                </div>

                {/* Sliders 3: Interest Rates */}
                <div className="space-y-1.5 text-xs text-left">
                  <div className="flex justify-between font-bold text-slate-600">
                    <span>Interests (Bank Linked)</span>
                    <span className="font-mono text-blue-600">{interestRate}% p.a.</span>
                  </div>
                  <input
                    type="range"
                    min="8.5"
                    max="15.0"
                    step="0.25"
                    value={interestRate}
                    onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                    className="w-full h-1 bg-slate-200 rounded appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>8.5%</span>
                    <span>15%</span>
                  </div>
                </div>
              </div>

              {/* Total calculated box */}
              <div className="bg-blue-600 text-white rounded-2xl p-4 text-center space-y-1">
                <p className="text-[10px] font-mono font-bold uppercase text-blue-100 tracking-wide">
                  Your Estimated Monthly EMI
                </p>
                <p className="text-2xl font-black font-sans">
                  ₹{calculatedEMI.toLocaleString('en-IN')} <span className="text-sm font-medium font-sans">/ month</span>
                </p>
                <p className="text-[9px] text-blue-100 leading-none">
                  Interest calculated with HDFC/ICICI custom used car index
                </p>
              </div>

              {/* Apply sanction loan CTA */}
              <button
                onClick={() => openLeadModal('drive')}
                className="w-full bg-white hover:bg-slate-50 border border-slate-200 py-2.5 rounded-xl text-xs font-bold text-slate-800 text-center cursor-pointer transition-colors"
              >
                Apply for Pre-Approved Auto Loan
              </button>
            </div>

          </div>

        </div>

        {/* Similar Cars Sector */}
        {similarCars.length > 0 && (
          <div className="border-t border-slate-200 mt-16 pt-12 space-y-8">
            <div className="text-left">
               <h3 className="font-sans font-bold text-xl text-slate-900 leading-tight">Similar Certified Vehicles</h3>
               <p className="text-xs text-slate-550">Based on your selected premium brand and fuel metrics.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {similarCars.map((carItem) => (
                <div
                  key={carItem.id}
                  onClick={() => navigate(`/car/${carItem.id}`)}
                  className="group bg-white rounded-2xl border border-slate-200/80 hover:border-slate-300 shadow-xs hover:shadow-md transition-all cursor-pointer overflow-hidden text-left"
                >
                  <div className="aspect-video relative bg-slate-100 overflow-hidden">
                    <img referrerPolicy="no-referrer" src={carItem.images[0]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" alt="Vehicle image" />
                  </div>
                  <div className="p-4 space-y-3">
                    <div>
                       <p className="text-[10px] font-mono font-bold text-slate-400">{carItem.year} • {carItem.city}</p>
                       <h4 className="font-sans font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors">{carItem.brand} {carItem.model}</h4>
                    </div>
                    <div className="flex justify-between items-center text-xs border-t border-slate-50 pt-2.5">
                      <p className="font-extrabold text-slate-905">₹{carItem.price} Lakhs</p>
                      <p className="text-slate-400 text-[11px] font-sans">{(carItem.km/1000).toFixed(0)}K km • {carItem.fuel}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ================= STICKY BOTTOM ACTIONS BAR ================= */}
      <div id="sticky-lead-navigation" className="fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 py-3 px-4 z-40 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          <div className="hidden sm:block text-left">
            <p className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider">Viewing Vehicle</p>
            <p className="text-sm font-extrabold text-slate-905">{car.brand} {car.model} • ₹{car.price} Lakh</p>
          </div>

          <div className="flex-1 sm:flex-initial grid grid-cols-3 gap-2 w-full sm:w-auto">
            <button
              onClick={() => openLeadModal('call')}
              className="bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-800 text-xs font-bold py-2.5 rounded-xl cursor-pointer"
            >
              📞 Call Owner
            </button>
            <button
              onClick={() => openLeadModal('drive')}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 rounded-xl cursor-pointer"
            >
              🗓️ Book Test Drive
            </button>
            <button
              onClick={() => openLeadModal('report')}
              className="bg-slate-900 hover:bg-slate-950 text-white text-xs font-bold py-2.5 rounded-xl cursor-pointer"
            >
              📋 View Checkups
            </button>
          </div>

        </div>
      </div>

      {/* ================= MODAL INQUIRY SYSTEM ================= */}
      <AnimatePresence>
        {isInquiryModalOpen && (
          <div id="inquiry-lead-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsInquiryModalOpen(false)}
              className="absolute inset-0 bg-slate-950"
            ></motion.div>

            {/* Modal Body */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md bg-white p-6 sm:p-8 rounded-3xl shadow-2xl z-10 space-y-6 text-left border border-slate-100"
            >
              {/* Close Button */}
              <button
                onClick={() => {
                  setIsInquiryModalOpen(false);
                  setIsLeadSubmittedSuccessfully(false);
                  setLeadName('');
                  setLeadPhone('');
                  setLeadEmail('');
                }}
                className="absolute right-4 top-4 p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {!isLeadSubmittedSuccessfully ? (
                <>
                  <div className="space-y-1.5 pt-2">
                    <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded font-mono uppercase tracking-wide">
                      Lead Dispatch Engine
                    </span>
                    <h3 className="font-sans font-bold text-xl text-slate-900">
                      {inquiryType === 'drive' ? 'Request Doorstep Test Drive' : inquiryType === 'call' ? 'Connect with Seller Support' : 'Request Certified Report'}
                    </h3>
                    <p className="text-xs text-slate-500 leading-normal">
                      Submit your coordinates below to log this inquiry. Our regional executive will reach you within 15 minutes.
                    </p>
                  </div>

                  <form onSubmit={handleInquirySubmit} className="space-y-4">
                    
                    {/* Name input */}
                    <div className="space-y-1.5 text-xs text-left">
                      <label className="font-bold text-slate-600 block">Your Full Name <strong className="text-red-500">*</strong></label>
                      <input
                        type="text"
                        value={leadName}
                        onChange={(e) => setLeadName(e.target.value)}
                        placeholder="e.g. Sunil Deshmukh"
                        required
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 text-xs focus:outline-hidden focus:border-blue-600 focus:bg-white"
                      />
                    </div>

                    {/* Phone Input */}
                    <div className="space-y-1.5 text-xs text-left">
                      <label className="font-bold text-slate-600 block">Mobile Phone Number <strong className="text-red-500">*</strong></label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 font-mono text-slate-400 font-semibold">+91</span>
                        <input
                          type="tel"
                          pattern="[6-9][0-9]{9}"
                          value={leadPhone}
                          onChange={(e) => setLeadPhone(e.target.value)}
                          placeholder="9876543210"
                          required
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-3 py-2.5 text-slate-800 text-xs focus:outline-hidden focus:border-blue-600 focus:bg-white font-mono"
                        />
                      </div>
                      <p className="text-[10px] text-slate-400">Enter a valid 10-digit Indian coordinate starting with 6-9</p>
                    </div>

                    {/* Email Input */}
                    <div className="space-y-1.5 text-xs text-left">
                      <label className="font-bold text-slate-600 block">Email Address (Optional)</label>
                      <input
                        type="email"
                        value={leadEmail}
                        onChange={(e) => setLeadEmail(e.target.value)}
                        placeholder="e.g. sunil@gmail.com"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 text-xs focus:outline-hidden focus:border-blue-600 focus:bg-white"
                      />
                    </div>

                    {/* Summary badge */}
                    <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-center gap-3">
                      <img referrerPolicy="no-referrer" src={car.images[0]} className="w-14 h-10 object-cover rounded-md" alt="" />
                      <div className="text-left">
                        <p className="text-[11px] font-bold text-slate-900">{car.brand} {car.model}</p>
                        <p className="text-[10px] text-slate-500 font-mono">₹{car.price} Lakhs • {car.city}</p>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmittingLead}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold py-3 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {isSubmittingLead ? 'Transmitting Inquiries...' : 'Confirm Callback & Transmit'}
                    </button>
                  </form>
                </>
              ) : (
                <div className="text-center py-6 space-y-4">
                  <div className="p-3 bg-green-100 text-green-700 rounded-full w-fit mx-auto">
                    <ShieldCheck className="w-10 h-10" />
                  </div>
                  <h3 className="font-sans font-bold text-xl text-slate-900">Inquiry Transmitted!</h3>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
                    Excellent, <strong>{leadName}</strong>. Your used car inquiry for the <strong>{car.brand} {car.model}</strong> has been logged. 
                  </p>
                  <p className="text-[11px] bg-blue-50 border border-blue-100 p-2.5 text-blue-700 rounded-xl max-w-xs mx-auto">
                     Logged in Demo Mode. Check our Admin Lead Dashboard to view your record live!
                  </p>
                  <button
                    onClick={() => {
                      setIsInquiryModalOpen(false);
                      setIsLeadSubmittedSuccessfully(false);
                      setLeadName('');
                      setLeadPhone('');
                      setLeadEmail('');
                    }}
                    className="bg-slate-900 hover:bg-slate-950 text-white font-bold px-6 py-2.5 rounded-xl text-xs cursor-pointer inline-block"
                  >
                    Done
                  </button>
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
