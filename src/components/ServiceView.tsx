import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wrench, CheckCircle, ShieldCheck, Check, Phone, Sparkles, MessageSquare, ArrowRight, Star } from 'lucide-react';

interface ServiceViewProps {
  navigate: (path: string) => void;
}

export default function ServiceView({ navigate }: ServiceViewProps) {
  const [activeTab, setActiveTab] = useState<'servicing' | 'modification'>('servicing');
  const [phoneInput, setPhoneInput] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedServiceItem, setSelectedServiceItem] = useState('General Doorstep Servicing');

  const SERVICING_PACKAGES = [
    {
      name: 'Basic Lubrication Package',
      price: '₹1,499',
      duration: '90 Mins Doorstep',
      desc: 'Essential fluid replacements to keep your engine smooth.',
      features: [
        'Premium synthetic engine oil replacement',
        'Genuine OEM oil filter change',
        'Air intake & cabin filter dusting',
        'Coolant topping up',
        '15-point electronic scanner diagnostics'
      ]
    },
    {
      name: 'Full Performance Service',
      price: '₹3,499',
      duration: '3 Hours Doorstep',
      desc: 'Comprehensive checkup and restoration for peak driving dynamics.',
      features: [
        'All Basic Lubrication features',
        'Spark plug clean & gap adjustments',
        'Full brake pad disinfection & lubrication',
        'Throttle body diagnostic scan',
        'Suspension greasing & underbody torque',
        'Engine health diagnostic log report'
      ]
    },
    {
      name: 'Premier Detailing Package',
      price: '₹5,999',
      duration: '5 Hours Doorstep',
      desc: 'Showroom interior/exterior detailing directly on your driveway.',
      features: [
        'All Performance Service features',
        'Interior deep cabin steam vacuuming',
        'Genuine leather upholstery chemical wash',
        'External compound machine polish (Single stage)',
        'Air conditioner antibacterial disinfection',
        'Engine bay shining & dress protection'
      ]
    }
  ];

  const MODIFICATION_PACKAGES = [
    {
      name: 'Avery/3M Premium Wrap',
      price: 'From ₹35,000',
      duration: 'Dealers Assist Only',
      desc: 'Transform your vehicle with high-grade protective gloss or matte wrap.',
      features: [
        'Gloss, satin, or ultra matte selections',
        'Paint Protection Film (PPF) option available',
        '3-Year premium peeling and color warranty',
        'Clean edge-to-edge finish assurance'
      ]
    },
    {
      name: 'Performance Upgrades & Tuning',
      price: 'From ₹15,000',
      duration: 'In-house Lab Booking',
      desc: 'Unlock raw horsepower with custom ECU maps and premium exhaust channels.',
      features: [
        'Stage 1 or Stage 2 customized ECU Remaps',
        'De-cat or high-flow Valvetronic exhausts',
        'High-flow performance replacement air filters',
        'Subtle throttle mapping enhancements'
      ]
    },
    {
      name: 'Bespoke Nappa Leather Cabin',
      price: 'From ₹18,000',
      duration: 'In-house Lab Booking',
      desc: 'Re-imagine your experience with Italian-leather hand-stitched upholstery.',
      features: [
        'Genuine Italian Alcántara or Nappa leather',
        'Dynamic ambient steering wheel wraps',
        'Premium high-density active foam repadding',
        'Piped stitching with custom color combinations'
      ]
    }
  ];

  const handleCallbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneInput || phoneInput.length < 10) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: "Direct Service Lead",
          phone: phoneInput,
          email: "support@manausedcars.com",
          brand: "Inquiry Client",
          model: activeTab === 'servicing' ? "Doorstep Servicing" : "Car Modification",
          serviceType: selectedServiceItem,
          date: new Date().toLocaleDateString('en-IN'),
          time: "Instant Callback Request",
          address: "Requested via quick Contact No",
          notes: `User checked ${activeTab === 'servicing' ? 'Servicing Packages' : 'Modification Packages'}. Wants immediate callback.`
        })
      });

      const data = await response.json();
      if (data.success) {
        setIsSubmitted(true);
      } else {
        alert("Server returned error booking slot.");
      }
    } catch (err) {
      console.error(err);
      alert("A connection difficulty occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppRedirect = () => {
    // Standard direct link pointing to high-trust support line
    const textMsg = encodeURIComponent(`Hi ManaUsedCars! I would like to query about your ${activeTab === 'servicing' ? 'Doorstep Servicing Packages' : 'Premium Car Modification services'}. Let's chat!`);
    window.open(`https://wa.me/919876543210?text=${textMsg}`, '_blank');
  };

  return (
    <div id="service-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white text-left min-h-screen">
      
      {/* Intro Header */}
      <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full uppercase tracking-wider font-mono">
          🛞 Premier Care Hub
        </span>
        <h1 className="font-sans font-bold text-3xl sm:text-4xl text-slate-900 tracking-tight">
          Service & Custom Modifications
        </h1>
        <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
          At <strong className="text-slate-900 font-semibold">ManaUsedCars</strong>, we make maintenance and upgrades completely effortless. Zero forms, zero friction — just direct, trusted contact.
        </p>
      </div>

      {/* Nav Tabs Selector */}
      <div className="flex justify-center mb-10">
        <div className="p-1 bg-slate-100 rounded-2xl flex space-x-1">
          <button
            onClick={() => {
              setActiveTab('servicing');
              setSelectedServiceItem('General Doorstep Servicing');
              setIsSubmitted(false);
            }}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'servicing'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🔧 Doorstep Servicing
          </button>
          <button
            onClick={() => {
              setActiveTab('modification');
              setSelectedServiceItem('Premium Car Modification');
              setIsSubmitted(false);
            }}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'modification'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🎨 Custom Modifications
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ================= LEFT CONTENT COLUMN ================= */}
        <div className="lg:col-span-7 space-y-8">
          
          <AnimatePresence mode="wait">
            {activeTab === 'servicing' ? (
              <motion.div
                key="servicing-panel"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="border-b border-slate-100 pb-3">
                  <h2 className="font-sans font-bold text-xl text-slate-900 flex items-center gap-2">
                    <span>1. Luxury Doorstep Service Catalog</span>
                    <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-md font-mono">Live on Driveway</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">Select an estimate package to query. Our engineers carry authentic OEM parts and lubricants.</p>
                </div>

                <div className="space-y-4">
                  {SERVICING_PACKAGES.map((pkg) => (
                    <div
                      key={pkg.name}
                      onClick={() => setSelectedServiceItem(pkg.name)}
                      className={`p-5 sm:p-6 border rounded-2xl transition-all text-left cursor-pointer relative overflow-hidden ${
                        selectedServiceItem === pkg.name
                          ? 'border-blue-600 bg-blue-50/20 shadow-md'
                          : 'border-slate-100 bg-white hover:border-slate-300'
                      }`}
                    >
                      {selectedServiceItem === pkg.name && (
                        <div className="absolute top-0 right-0 bg-blue-600 text-white text-[9px] px-3 py-1 rounded-bl-xl font-mono font-bold">
                          Primary Selected
                        </div>
                      )}
                      
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-sans font-bold text-base text-slate-900">{pkg.name}</h4>
                          <span className="text-[10px] text-blue-600 font-mono font-semibold bg-blue-50 px-2 py-0.5 rounded-md mt-1 inline-block">
                            ⏱️ {pkg.duration}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-base sm:text-lg font-black text-slate-900">{pkg.price}</span>
                          <p className="text-[9px] text-slate-400 font-mono uppercase">Full Tax Incl.</p>
                        </div>
                      </div>

                      <p className="text-xs text-slate-500 mb-4">{pkg.desc}</p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 font-sans border-t border-slate-100 pt-3">
                        {pkg.features.map((feat) => (
                          <div key={feat} className="flex items-start gap-1.5">
                            <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                            <span className="leading-tight">{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Doorstep Trust Safeguards */}
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/50 space-y-4">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest font-mono">
                    Why Doorstep Servicing with ManaUsedCars?
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div className="space-y-1">
                      <p className="font-bold text-slate-900 flex items-center gap-1.5">
                        <CheckCircle className="w-4 h-4 text-blue-600 shrink-0" />
                        100% Genuine
                      </p>
                      <p className="text-[11px] text-slate-400 leading-normal">
                        Authentic air filters, oil filters, and synthetic engine lubricants sourced directly.
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="font-bold text-slate-900 flex items-center gap-1.5">
                        <CheckCircle className="w-4 h-4 text-blue-600 shrink-0" />
                        Live Observation
                      </p>
                      <p className="text-[11px] text-slate-400 leading-normal">
                        No mysterious part changes behind closed garage doors. Watch engineers repair on your lawn.
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="font-bold text-slate-900 flex items-center gap-1.5">
                        <CheckCircle className="w-4 h-4 text-blue-600 shrink-0" />
                        Diagnostic Logs
                      </p>
                      <p className="text-[11px] text-slate-400 leading-normal">
                        Receive a comprehensive digital scanner health report detailing precise battery, engine & brake codes.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="modification-panel"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="border-b border-slate-100 pb-3">
                  <h2 className="font-sans font-bold text-xl text-slate-900 flex items-center gap-2">
                    <span>1. Premium Modification Services</span>
                    <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-md font-mono">Expert Customization</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">Turn your vehicle into a custom masterpiece. All modification services require direct personal consult.</p>
                </div>

                <div className="space-y-4">
                  {MODIFICATION_PACKAGES.map((pkg) => (
                    <div
                      key={pkg.name}
                      onClick={() => setSelectedServiceItem(pkg.name)}
                      className={`p-5 sm:p-6 border rounded-2xl transition-all text-left cursor-pointer relative overflow-hidden ${
                        selectedServiceItem === pkg.name
                          ? 'border-indigo-500 bg-indigo-50/10 shadow-md'
                          : 'border-slate-100 bg-white hover:border-slate-300'
                      }`}
                    >
                      {selectedServiceItem === pkg.name && (
                        <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[9px] px-3 py-1 rounded-bl-xl font-mono font-bold">
                          Primary Selected
                        </div>
                      )}
                      
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-sans font-bold text-base text-slate-900">{pkg.name}</h4>
                          <span className="text-[10px] text-indigo-600 font-mono font-semibold bg-indigo-50 px-2 py-0.5 rounded-md mt-1 inline-block">
                            🛠️ {pkg.duration}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-base sm:text-lg font-black text-slate-900">{pkg.price}</span>
                          <p className="text-[9px] text-slate-400 font-mono uppercase">Consult Required</p>
                        </div>
                      </div>

                      <p className="text-xs text-slate-500 mb-4">{pkg.desc}</p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 font-sans border-t border-slate-100 pt-3">
                        {pkg.features.map((feat) => (
                          <div key={feat} className="flex items-start gap-1.5">
                            <Check className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                            <span className="leading-tight">{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Modification Trust Safeguards */}
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/50 space-y-4">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest font-mono">
                    Modification Guidelines & Compliance
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    At ManaUsedCars, we prioritize performance alongside street compliance. Our modifications division ensures every design modification respect local regulations, keeping your luxury cruiser safe, elegant, and ready for public roads.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* ================= RIGHT CONTACT PANEL ================= */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden">
            {/* Background design accents */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600 rounded-full blur-3xl opacity-20 -mr-10 -mt-10"></div>
            
            <div className="space-y-2 relative z-10 border-b border-slate-800 pb-4">
              <span className="text-[10px] text-blue-400 font-mono font-bold uppercase tracking-widest flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Direct Contact Protocol
              </span>
              <h3 className="font-sans font-bold text-xl">
                2. No Forms. Just Contact.
              </h3>
              <p className="text-xs text-slate-400">
                Forget multi-step registrations. Call our booking desk or send a quick WhatsApp message. Our specialist mechanics handle the rest.
              </p>
            </div>

            {/* Support Metrics Grid */}
            <div className="grid grid-cols-2 gap-3.5 text-xs">
              <div className="bg-slate-800/60 border border-slate-800 rounded-2xl p-3.5">
                <p className="text-slate-550 text-slate-400 text-[10px]">Average Call Response</p>
                <p className="text-sm font-bold text-white mt-1">Under 2 Minutes</p>
              </div>
              <div className="bg-slate-800/60 border border-slate-800 rounded-2xl p-3.5">
                <p className="text-slate-550 text-slate-400 text-[10px]">Doorstep Mechanic SLA</p>
                <p className="text-sm font-bold text-white mt-1">Same-Day Slots</p>
              </div>
            </div>

            {/* HELPLINE ACTIONS */}
            <div className="space-y-4">
              
              {/* Phone Line Call-to-Action */}
              <a
                href="tel:+919876543210"
                className="group flex items-center justify-between bg-white text-slate-900 p-4 rounded-2xl hover:bg-slate-100 transition-all font-sans cursor-pointer shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-100 rounded-xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Tap To Call Support</p>
                    <p className="text-base font-black tracking-tight text-slate-900 group-hover:text-blue-600 transition-all">
                      +91 98765 43210
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </a>

              {/* WhatsApp Chat Call-to-Action */}
              <button
                type="button"
                onClick={handleWhatsAppRedirect}
                className="group w-full flex items-center justify-between bg-emerald-600 hover:bg-emerald-700 text-white p-4 rounded-2xl transition-all font-sans cursor-pointer shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-emerald-500/20 rounded-xl group-hover:bg-white/20 transition-all">
                    <MessageSquare className="w-5 h-5 text-emerald-300 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] text-emerald-200 font-bold uppercase tracking-wider">Chat On WhatsApp</p>
                    <p className="text-base font-bold tracking-tight">
                      Message In 2 Seconds
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-emerald-200 group-hover:translate-x-1 transition-transform animate-pulse" />
              </button>

            </div>

            {/* Live 10s callback request (So developers can verify lead capture and view logs) */}
            <div className="bg-slate-800/40 border border-slate-800/80 rounded-2xl p-5 space-y-4 text-left">
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-200">Want an Instant Callback?</h4>
                <p className="text-[10px] text-slate-400 font-sans">
                  Don't want to make the call now? Submit your mobile number; we will alert our system and callback instantly.
                </p>
              </div>

              {!isSubmitted ? (
                <form onSubmit={handleCallbackSubmit} className="space-y-3">
                  <div className="relative text-xs">
                    <span className="absolute left-3.5 top-3 text-slate-400 font-mono font-bold">+91</span>
                    <input
                      type="tel"
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="Enter 10-digit number"
                      maxLength={10}
                      required
                      className="w-full bg-slate-800 border border-slate-705 border-slate-700 rounded-xl pl-12 pr-4 py-2.5 text-xs text-white placeholder-slate-500 font-mono focus:outline-hidden focus:border-blue-500"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-sans">
                    <span>Selected: <strong className="text-slate-200">{selectedServiceItem}</strong></span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white text-xs font-semibold py-2.5 rounded-xl cursor-pointer transition-colors shadow-xs"
                  >
                    {isSubmitting ? 'Submitting to dispatch logs...' : '🚀 Call Me Back Instantly'}
                  </button>
                </form>
              ) : (
                <div className="bg-blue-900/40 border border-blue-800 rounded-xl p-3 text-center space-y-1.5 animate-in fade-in duration-200">
                  <p className="text-xs font-bold text-blue-300">✓ Callback Request Queued!</p>
                  <p className="text-[10px] text-blue-400">
                    We registered your phone number in our leads log. Verification staff will call within 15 mins.
                  </p>
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setPhoneInput('');
                    }}
                    className="text-[10px] text-white hover:underline focus:outline-hidden pt-1"
                  >
                    Request another callback
                  </button>
                </div>
              )}
            </div>

          </div>

          {/* Testimonial Feature Card */}
          <div className="border border-slate-100 bg-slate-50 rounded-2xl p-5 text-left text-xs font-sans text-slate-600 space-y-2.5 relative overflow-hidden">
            <span className="absolute top-3 right-4 flex gap-0.5 text-yellow-500">
              <Star className="w-3.5 h-3.5 fill-current" />
              <Star className="w-3.5 h-3.5 fill-current" />
              <Star className="w-3.5 h-3.5 fill-current" />
              <Star className="w-3.5 h-3.5 fill-current" />
              <Star className="w-3.5 h-3.5 fill-current" />
            </span>
            <p className="font-bold text-slate-800">What Customers Experience:</p>
            <p className="italic text-slate-500 leading-relaxed font-sans">
              "No complex forms. I clicked the service button, we spoke on WhatsApp for local availability, and the tuning van arrived right on schedule. My Octavia looks and performs like dream clockwork."
            </p>
            <p className="font-semibold text-slate-700 text-[10px]">— Kabir Dev, Bangalore</p>
          </div>

        </div>

      </div>

    </div>
  );
}
