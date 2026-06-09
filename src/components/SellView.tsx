import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, ClipboardList, Car, Gauge, DollarSign, Upload, ShieldAlert, BadgeInfo, Undo, Calendar, Sparkles, MapPin, IndianRupee, HelpCircle, Phone, ArrowLeft, ArrowRight, X } from 'lucide-react';
import { BRANDS, CITIES } from '../data';

// Preset stock images so they can easily fill inputs with stylish presets instantly
const PRESET_CAR_PHOTOS = [
  'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=400&q=80'
];

interface SellViewProps {
  navigate: (path: string) => void;
}

export default function SellView({ navigate }: SellViewProps) {
  // Active step (1 to 5)
  const [step, setStep] = useState(1);

  // Step 1: Owner Info
  const [ownerName, setOwnerName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerCity, setOwnerCity] = useState('');

  // Step 2: Vehicle Info
  const [vehicleBrand, setVehicleBrand] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehicleVariant, setVehicleVariant] = useState('');
  const [vehicleYear, setVehicleYear] = useState('2021');
  const [vehicleFuel, setVehicleFuel] = useState('Petrol');
  const [vehicleTransmission, setVehicleTransmission] = useState('Manual');
  const [vehicleKm, setVehicleKm] = useState(30000);

  // Step 3: Selling Info
  const [expectedPrice, setExpectedPrice] = useState(5.5); // Lakhs
  const [vehicleCondition, setVehicleCondition] = useState('Excellent');
  const [additionalNotes, setAdditionalNotes] = useState('');

  // Step 4: Images
  const [uploadedImages, setUploadedImages] = useState<string[]>([
    PRESET_CAR_PHOTOS[0], // pre-seeded for standard submission convenience
    PRESET_CAR_PHOTOS[1],
    PRESET_CAR_PHOTOS[2],
    PRESET_CAR_PHOTOS[3]
  ]);

  // Submission control
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Free Instant Valuation Engine computer
  const valuationResult = useMemo(() => {
    if (!vehicleBrand || !vehicleYear) {
      return { low: 0, high: 0 };
    }

    // Base market pricing estimation depending on brand premium & mileage
    let basePriceMultiplier = 8.5; // Lakhs
    if (vehicleBrand.toLowerCase().includes('maruti') || vehicleBrand.toLowerCase().includes('hyundai')) basePriceMultiplier = 5.5;
    if (vehicleBrand.toLowerCase().includes('tata') || vehicleBrand.toLowerCase().includes('honda')) basePriceMultiplier = 8.0;
    if (vehicleBrand.toLowerCase().includes('mahindra') || vehicleBrand.toLowerCase().includes('toyota')) basePriceMultiplier = 20.0;
    if (vehicleBrand.toLowerCase().includes('skoda') || vehicleBrand.toLowerCase().includes('volkswagen')) basePriceMultiplier = 9.0;

    // Age depreciation (e.g. 10% per year from 2026)
    const currentYear = 2026;
    const carAge = Math.max(0, currentYear - parseInt(vehicleYear));
    const depreciationFactor = Math.pow(0.88, carAge);

    // Mileage depreciation
    const kmDepreciation = Math.max(0.75, 1 - (vehicleKm / 400000));

    const estimatedValue = basePriceMultiplier * depreciationFactor * kmDepreciation;
    
    // Low / High margins
    const lowRange = Math.max(1.5, estimatedValue * 0.92);
    const highRange = Math.max(1.8, estimatedValue * 1.08);

    return {
      low: parseFloat(lowRange.toFixed(2)),
      high: parseFloat(highRange.toFixed(2))
    };
  }, [vehicleBrand, vehicleYear, vehicleKm]);

  // Apply auto estimated price on click
  const applyEstimatedPrice = () => {
    const avg = parseFloat(((valuationResult.low + valuationResult.high) / 2).toFixed(2));
    setExpectedPrice(avg);
    setStep(3); // proceed to Step 3
  };

  // Image upload triggers
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const readersArray = Array.from(files).map((file: any) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result as string);
          };
          reader.readAsDataURL(file);
        });
      });

      Promise.all(readersArray).then((base64Strings) => {
        setUploadedImages([...base64Strings, ...uploadedImages].slice(0, 4));
      });
    }
  };

  // Multi-step custom validators
  const handleForwardStep = () => {
    if (step === 1) {
      if (!ownerName || !ownerPhone || !ownerCity) {
        alert("Please complete all required Contact fields.");
        return;
      }
    }
    if (step === 2) {
      if (!vehicleBrand || !vehicleModel || !vehicleVariant) {
        alert("Please provide the complete Brand, Model and Variant specifications.");
        return;
      }
    }
    setStep(prev => Math.min(5, prev + 1));
  };

  // Final submit handler
  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/inquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'sell',
          sellerDetails: {
            name: ownerName,
            phone: ownerPhone,
            email: ownerEmail || 'N/A',
            city: ownerCity
          },
          vehicleDetails: {
            brand: vehicleBrand,
            model: vehicleModel,
            variant: vehicleVariant,
            year: parseInt(vehicleYear),
            fuel: vehicleFuel,
            transmission: vehicleTransmission,
            km: vehicleKm
          },
          expectedPrice: expectedPrice,
          condition: vehicleCondition,
          additionalNotes: additionalNotes,
          images: uploadedImages
        })
      });

      const resData = await response.json();
      if (resData.success) {
        setIsSubmitted(true);
      } else {
        alert("Server returned an error. Please test after configuring secrets.");
      }
    } catch (e) {
      console.error(e);
      alert("A network error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="sell-view" className="max-w-4xl mx-auto px-4 sm:px-6 py-8 text-left bg-white">
      
      {/* 1. PROGRESS STEPS INDICATOR */}
      <section className="mb-10">
        <div className="flex justify-between items-center text-xs font-mono font-bold text-slate-400 uppercase tracking-widest pb-4 border-b border-slate-100">
           <span>🚘 Resale Hub</span>
           <span>Step {step} of 5</span>
        </div>

        {/* Horizontal visually polished beads */}
        <div className="flex items-center gap-2 mt-4">
          {[
            { label: 'Seller Info' },
            { label: 'Vehicle details' },
            { label: 'Valuation & Price' },
            { label: 'Photos Upload' },
            { label: 'Confirmation' }
          ].map((item, idx) => {
            const stepNum = idx + 1;
            const isCompleted = step > stepNum;
            const isActive = step === stepNum;
            return (
              <React.Fragment key={idx}>
                <div className="flex items-center gap-1.5 focus:outline-hidden">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isCompleted ? 'bg-green-600 text-white' : isActive ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'
                  }`}>
                    {isCompleted ? <Check className="w-3.5 h-3.5" /> : stepNum}
                  </div>
                  <span className={`hidden md:inline font-sans text-xs font-bold leading-none ${
                    isActive ? 'text-slate-900 border-b-2 border-blue-600 pb-0.5' : 'text-slate-400'
                  }`}>
                    {item.label}
                  </span>
                </div>
                {idx < 4 && <div className={`flex-1 h-0.5 ${stepNum < step ? 'bg-green-500' : 'bg-slate-100'}`}></div>}
              </React.Fragment>
            );
          })}
        </div>
      </section>

      {/* Main interactive cards form wrapper */}
      <div className="bg-slate-50 border border-slate-200 p-6 sm:p-10 rounded-3xl shadow-xs min-h-[400px] flex flex-col justify-between">
        
        {!isSubmitted ? (
          <>
            {/* Step renders content */}
            <div className="space-y-6">
              
              {/* === STEP 1: OWNER INFORMATION === */}
              {step === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-3 duration-200">
                  <div className="space-y-1">
                     <span className="text-[10px] bg-blue-100 text-blue-600 font-bold px-2.5 py-0.5 rounded font-mono uppercase tracking-wider">Step 1</span>
                     <h2 className="font-sans font-bold text-xl text-slate-900">Owner Verification</h2>
                     <p className="text-xs text-slate-500">Furnish basic contact details. We protect your credentials rigorously.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5 text-xs text-left">
                      <label className="font-bold text-slate-600">Full Name <strong className="text-red-500">*</strong></label>
                      <input
                        type="text"
                        value={ownerName}
                        onChange={(e) => setOwnerName(e.target.value)}
                        placeholder="e.g. Lalitesh Sharma"
                        required
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-hidden focus:border-blue-600"
                      />
                    </div>

                    <div className="space-y-1.5 text-xs text-left">
                      <label className="font-bold text-slate-600">Phone Number <strong className="text-red-500">*</strong></label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 font-mono text-slate-400 font-bold">+91</span>
                        <input
                          type="tel"
                          pattern="[6-9][0-9]{9}"
                          value={ownerPhone}
                          onChange={(e) => setOwnerPhone(e.target.value)}
                          placeholder="9876543210"
                          required
                          className="w-full bg-white border border-slate-200 rounded-xl pl-12 pr-3 py-2.5 text-slate-800 font-mono focus:outline-hidden focus:border-blue-600"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs text-left">
                      <label className="font-bold text-slate-600">Email (Optional)</label>
                      <input
                        type="email"
                        value={ownerEmail}
                        onChange={(e) => setOwnerEmail(e.target.value)}
                        placeholder="e.g. lalitesh@gmail.com"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-hidden focus:border-blue-600"
                      />
                    </div>

                    <div className="space-y-1.5 text-xs text-left">
                      <label className="font-bold text-slate-600">Your Current City <strong className="text-red-500">*</strong></label>
                      <select
                        value={ownerCity}
                        onChange={(e) => setOwnerCity(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-hidden cursor-pointer"
                      >
                        <option value="">Select city</option>
                        {CITIES.map(c => (
                          <option key={c.id} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* === STEP 2: VEHICLE INFORMATION & INSTANT EVALUATION === */}
              {step === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-3 duration-200">
                  <div className="space-y-1">
                     <span className="text-[10px] bg-blue-100 text-blue-600 font-bold px-2.5 py-0.5 rounded font-mono uppercase tracking-wider">Step 2</span>
                     <h2 className="font-sans font-bold text-xl text-slate-900">Vehicle Specifications</h2>
                     <p className="text-xs text-slate-500">Provide registration details to calculate our Free Instant Valuation estimate.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5 text-xs">
                      <label className="font-bold text-slate-600">Vehicle Brand</label>
                      <select
                        value={vehicleBrand}
                        onChange={(e) => setVehicleBrand(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-hidden cursor-pointer"
                      >
                        <option value="">Select Brand</option>
                        {BRANDS.map(b => (
                          <option key={b.id} value={b.name}>{b.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <label className="font-bold text-slate-600">Model Name</label>
                      <input
                        type="text"
                        value={vehicleModel}
                        onChange={(e) => setVehicleModel(e.target.value)}
                        placeholder="e.g. Swift or Nexon"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-hidden"
                      />
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <label className="font-bold text-slate-600">Trim / Variant</label>
                      <input
                        type="text"
                        value={vehicleVariant}
                        onChange={(e) => setVehicleVariant(e.target.value)}
                        placeholder="e.g. VXI 1.2 or XZA Plus"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
                    <div className="space-y-1.5 text-xs">
                      <label className="font-bold text-slate-600">Registration Year</label>
                      <select
                        value={vehicleYear}
                        onChange={(e) => setVehicleYear(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-hidden cursor-pointer"
                      >
                        {['2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016'].map(y => (
                          <option key={y} value={y}>{y}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <label className="font-bold text-slate-600">Fuel Type</label>
                      <select
                        value={vehicleFuel}
                        onChange={(e) => setVehicleFuel(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-hidden cursor-pointer"
                      >
                        <option value="Petrol">Petrol</option>
                        <option value="Diesel">Diesel</option>
                        <option value="CNG">CNG</option>
                        <option value="Electric">Electric</option>
                      </select>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <label className="font-bold text-slate-600">Transmission</label>
                      <select
                        value={vehicleTransmission}
                        onChange={(e) => setVehicleTransmission(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-hidden cursor-pointer"
                      >
                        <option value="Manual">Manual</option>
                        <option value="Automatic">Automatic</option>
                      </select>
                    </div>

                    {/* KM Slider */}
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between font-bold text-slate-600">
                        <span>Odometer</span>
                        <span className="font-mono text-blue-600">{vehicleKm.toLocaleString()} km</span>
                      </div>
                      <input
                        type="range"
                        min="5000"
                        max="150000"
                        step="5000"
                        value={vehicleKm}
                        onChange={(e) => setVehicleKm(parseInt(e.target.value))}
                        className="w-full h-1 bg-slate-200 rounded appearance-none cursor-pointer accent-blue-600"
                      />
                    </div>
                  </div>

                  {/* === LIVE VALUATION BLOCK === */}
                  {vehicleBrand && vehicleModel && (
                    <motion.div
                      initial={{ scale: 0.98, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="bg-blue-600 text-white rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-md font-sans"
                    >
                      <div className="space-y-1 text-left">
                        <span className="text-[10px] font-bold font-mono text-yellow-300 uppercase tracking-wide">
                          🔑 FREE INSTANT VALUATION CALCULATED
                        </span>
                        <h4 className="text-lg font-bold leading-tight">
                          ManaUsedCars Est. Resale Range
                        </h4>
                        <p className="text-xs text-blue-100">
                          Estimate for {vehicleYear} {vehicleBrand} {vehicleModel} with {vehicleKm.toLocaleString()} km • Refundable Physical Doorstep Evaluation Fee: ₹200
                        </p>
                      </div>

                      <div className="text-center sm:text-right shrink-0 py-2 sm:py-0 px-4 bg-blue-700/60 rounded-xl border border-blue-500">
                        <p className="text-[9px] uppercase font-mono tracking-wider font-bold text-blue-200">Value Range</p>
                        <p className="text-xl sm:text-2xl font-black font-sans leading-none">
                          ₹{valuationResult.low}L - ₹{valuationResult.high}L
                        </p>
                        <button
                          type="button"
                          onClick={applyEstimatedPrice}
                          className="mt-1.5 border border-yellow-300/60 bg-yellow-400 hover:bg-yellow-500 text-slate-900 text-xs font-bold px-3 py-1.5 rounded-lg pointer-events-auto cursor-pointer"
                        >
                          Accept value and list
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}

              {/* === STEP 3: SELLING INFORMATION === */}
              {step === 3 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-3 duration-200">
                  <div className="space-y-1">
                     <span className="text-[10px] bg-blue-100 text-blue-600 font-bold px-2.5 py-0.5 rounded font-mono uppercase tracking-wider">Step 3</span>
                     <h2 className="font-sans font-bold text-xl text-slate-900">Your Valuation Preferences</h2>
                     <p className="text-xs text-slate-500">How much do you value your car, and what is its general condition status?</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                    {/* Expected Price slider */}
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between font-bold text-slate-700">
                        <span>Expected Handover Valuation</span>
                        <span className="font-mono text-blue-600 bg-white border px-3 py-1 rounded-sm">
                          ₹{expectedPrice.toFixed(2)} Lakhs
                        </span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="30"
                        step="0.1"
                        value={expectedPrice}
                        onChange={(e) => setExpectedPrice(parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                      <div className="flex justify-between text-[10px] text-slate-400 font-mono pt-1">
                        <span>₹1 Lakh</span>
                        <span>₹30 Lakhs</span>
                      </div>
                    </div>

                    {/* Condition */}
                    <div className="space-y-1.5 text-xs text-left">
                      <label className="font-bold text-slate-605">Vehicle Running Condition</label>
                      <div className="grid grid-cols-3 gap-2">
                        {['Excellent', 'Good', 'Fair'].map((condOption) => (
                          <button
                            type="button"
                            key={condOption}
                            onClick={() => setVehicleCondition(condOption)}
                            className={`py-2 rounded-xl text-xs font-semibold text-center border cursor-pointer transition-colors ${
                              vehicleCondition === condOption
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                            }`}
                          >
                            {condOption}
                          </button>
                        ))}
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">Excellent is clean, single owner with dealership history.</p>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <label className="font-bold text-slate-600 block">Additional Notes / Descriptions</label>
                    <textarea
                      rows={3}
                      value={additionalNotes}
                      onChange={(e) => setAdditionalNotes(e.target.value)}
                      placeholder="e.g. Tires replaced 6 months ago, insurance active till Dec 2026, minor scratch on left fender."
                      className="w-full bg-white border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-hidden focus:border-blue-600 text-xs"
                    ></textarea>
                  </div>
                </div>
              )}

              {/* === STEP 4: UPLOAD VIEW PHOTOS === */}
              {step === 4 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-3 duration-200">
                  <div className="space-y-1">
                     <span className="text-[10px] bg-blue-100 text-blue-600 font-bold px-2.5 py-0.5 rounded font-mono uppercase tracking-wider">Step 4</span>
                     <h2 className="font-sans font-bold text-xl text-slate-900">Vehicle Image Capture</h2>
                     <p className="text-xs text-slate-500">Provide photos to optimize conversion. You may drag-and-drop or select our instant stock-demo assets below for testing!</p>
                  </div>

                  {/* Upload inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     
                     <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center space-y-2 hover:border-blue-600 transition-colors bg-white relative">
                        <Upload className="w-8 h-8 text-slate-400 mx-auto" />
                        <p className="text-xs font-bold text-slate-700">Drag files or Click to Upload</p>
                        <p className="text-[10px] text-slate-400">Front View, Rear View, Interior or Odometer</p>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full"
                        />
                     </div>

                     <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 space-y-2">
                        <p className="text-xs font-bold text-blue-700">💡 Easy Sandbox Seed-Options</p>
                        <p className="text-[10px] text-slate-600 leading-normal">
                          By default, we pre-seeded your form with 4 crisp car photos so you can proceed smoothly in this preview environment. You can submit immediately! This guarantees flawless demo completion.
                        </p>
                        <button
                          type="button"
                          onClick={() => setUploadedImages(PRESET_CAR_PHOTOS)}
                          className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer block"
                        >
                          Restore pre-seeded stock placeholders →
                        </button>
                     </div>

                  </div>

                  {/* Render Thumbnail previews */}
                  <div className="space-y-2 text-xs">
                    <p className="font-bold text-slate-700">Active image deck ({uploadedImages.length}):</p>
                    <div className="flex gap-2 flex-wrap">
                      {uploadedImages.map((img, i) => (
                        <div key={i} className="relative w-20 aspect-video rounded-lg overflow-hidden border border-slate-200">
                          <img src={img} className="w-full h-full object-cover" alt="" />
                          <button
                            type="button"
                            onClick={() => setUploadedImages(uploadedImages.filter((_, idx) => idx !== i))}
                            className="absolute right-1 top-1 bg-red-600 text-white p-0.5 rounded-full hover:bg-red-800"
                          >
                            <X className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* === STEP 5: REVIEW INFORMATION & SUBMIT === */}
              {step === 5 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-3 duration-200">
                  <div className="space-y-1">
                     <span className="text-[10px] bg-blue-100 text-blue-600 font-bold px-2.5 py-0.5 rounded font-mono uppercase tracking-wider">Step 5</span>
                     <h2 className="font-sans font-bold text-xl text-slate-900">Review & Confirmed Submission</h2>
                     <p className="text-xs text-slate-500">Validate all credentials before broadcasting this lead to our staff inbox.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-slate-700 font-sans divide-y sm:divide-y-0 sm:divide-x divide-slate-200">
                    
                    {/* Owner column */}
                    <div className="space-y-3.5 pb-4 sm:pb-0">
                      <p className="font-bold uppercase text-[10px] text-slate-400 font-mono tracking-wider">Owner details</p>
                      <p><strong>Name:</strong> {ownerName}</p>
                      <p><strong>Phone:</strong> {ownerPhone}</p>
                      <p><strong>Email Address:</strong> {ownerEmail || 'N/A'}</p>
                      <p><strong>Metro city:</strong> {ownerCity}</p>
                    </div>

                    {/* Car column */}
                    <div className="space-y-3.5 pt-4 sm:pt-0 sm:pl-6 text-left">
                      <p className="font-bold uppercase text-[10px] text-slate-400 font-mono tracking-wider">Vehicle Details</p>
                      <p><strong>Model:</strong> {vehicleBrand} {vehicleModel} ({vehicleVariant})</p>
                      <p><strong>Specs:</strong> {vehicleYear} • {vehicleFuel} • {vehicleTransmission}</p>
                      <p><strong>Driven:</strong> {vehicleKm.toLocaleString()} km</p>
                      <p className="text-blue-600"><strong>Demanded Valuation:</strong> ₹{expectedPrice} Lakhs</p>
                    </div>

                  </div>

                  <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200/60 text-amber-800 text-[11px] leading-relaxed flex gap-2">
                     <ShieldAlert className="w-5 h-5 shrink-0" />
                     <span>
                        By submitting, you consent to schedule a professional physical doorstep inspection of your vehicle by a certified evaluator from ManaUsedCars. A nominal, fully refundable slot reservation fee of **₹200** is required to guarantee your slot and filter out spam listings. It will be completely adjusted/refunded during the evaluation handshake.
                     </span>
                  </div>
                </div>
              )}

            </div>

            {/* Step navigation actions */}
            <div className="flex justify-between items-center pt-8 border-t border-slate-200 mt-10">
              <button
                type="button"
                onClick={() => setStep(prev => Math.max(1, prev - 1))}
                disabled={step === 1}
                className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-805 disabled:opacity-40 cursor-pointer focus:outline-hidden"
              >
                <ArrowLeft className="w-4 h-4" /> Back step
              </button>

              {step < 5 ? (
                <button
                  type="button"
                  onClick={handleForwardStep}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-1 cursor-pointer shadow-sm hover:shadow-md"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleFinalSubmit}
                  disabled={isSubmitting}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white font-bold px-8 py-3 rounded-xl text-xs flex items-center gap-1 cursor-pointer shadow-md hover:shadow-lg transition-transform hover:-translate-y-0.5"
                >
                  <span>{isSubmitting ? 'Submitting Valuation Now...' : 'Publish Evaluation Request'}</span>
                  <Check className="w-4 h-4" />
                </button>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-12 space-y-6 animate-in fade-in duration-300">
             <div className="p-4 bg-green-100 text-green-700 rounded-full w-fit mx-auto">
                <Check className="w-12 h-12" />
             </div>
             
             <div className="space-y-2">
                <h2 className="font-sans font-bold text-2xl text-slate-900">Valuation Request Registered!</h2>
                <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                   Thank you, <strong>{ownerName}</strong>. Your registered used car details have been converted to an active valuation lead.
                </p>
             </div>

             <div className="bg-blue-50/50 p-4 border border-blue-100 rounded-2xl max-w-md mx-auto text-xs text-blue-700 font-sans space-y-1">
                <p className="font-bold">✓ Live Session Console Logged</p>
                <p>Since your sandbox relies on standard mail variables, we printed your email payload on our in-memory leads database. You can review your submission live in our inspector console.</p>
             </div>

             <div className="flex justify-center gap-4 pt-4">
               <button
                 type="button"
                 onClick={() => navigate('/admin')}
                 className="bg-slate-900 hover:bg-slate-950 text-white font-bold py-2.5 px-5 rounded-xl text-xs cursor-pointer block"
               >
                 View Leads Admin Dashboard
               </button>
               <button
                 type="button"
                 onClick={() => {
                   setStep(1);
                   setIsSubmitted(false);
                   setOwnerName('');
                   setOwnerPhone('');
                   setOwnerEmail('');
                   setVehicleBrand('');
                   setVehicleModel('');
                   setVehicleVariant('');
                 }}
                 className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-bold py-2.5 px-5 rounded-xl text-xs cursor-pointer block"
               >
                 List Another Car
               </button>
             </div>
          </div>
        )}

      </div>

    </div>
  );
}
