import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  IndianRupee, 
  Percent, 
  Calendar, 
  HelpCircle, 
  CheckCircle, 
  FileText, 
  Check, 
  Clock, 
  Building2, 
  ArrowRight,
  ShieldCheck,
  MapPin,
  Sparkles
} from 'lucide-react';
import { CITIES } from '../data';

interface FinanceViewProps {
  navigate: (path: string) => void;
}

export default function FinanceView({ navigate }: FinanceViewProps) {
  // Calculator States
  const [loanAmount, setLoanAmount] = useState<number>(6.5); // Lakhs
  const [interestRate, setInterestRate] = useState<number>(9.5); // %
  const [tenureMonths, setTenureMonths] = useState<number>(36); // months

  // Form States
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: 'Bangalore',
    employmentType: 'Salaried',
    monthlyIncome: '₹50,000 - ₹1,00,000',
    notes: 'Calculated Scheme Interest: 9.5% for 36 months'
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [serverMessage, setServerMessage] = useState<string>('');

  // Sync calculator changes into form data notes
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      notes: `Targeted Scheme: ₹${loanAmount} Lakhs at ${interestRate}% APR for ${tenureMonths} Months (${Math.round(emi)}/mo)`
    }));
  }, [loanAmount, interestRate, tenureMonths]);

  // EMI Computations
  // Formula: EMI = [P x R x (1+R)^N]/[((1+R)^N)-1]
  const P = loanAmount * 100000; // convert Lakhs to absolute Rupees
  const r = (interestRate / 12) / 100; // monthly rate
  const n = tenureMonths;

  const emi = P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1) || 0;
  const totalPayable = emi * n;
  const totalInterest = totalPayable - P;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEmpTypeSelect = (type: string) => {
    setFormData(prev => ({ ...prev, employmentType: type }));
  };

  const handleIncomeSelect = (income: string) => {
    setFormData(prev => ({ ...prev, monthlyIncome: income }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.email) {
      alert("Please fill in all contact information to compute eligibility.");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/finance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          loanAmount: loanAmount,
          notes: `${formData.notes}. Email: ${formData.email}`
        })
      });

      const result = await response.json();
      if (result.success) {
        setSubmitStatus('success');
        setServerMessage(result.message);
      } else {
        setSubmitStatus('error');
        setServerMessage(result.error || "Failed to submit.");
      }
    } catch (err: any) {
      console.error("Finance submission failure:", err);
      setSubmitStatus('error');
      setServerMessage("Unable to connect to registration server. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="finance-view" className="py-8 bg-slate-50 font-sans text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner Section */}
        <div className="bg-slate-900 rounded-3xl p-6 sm:p-10 text-white mb-8 relative overflow-hidden shadow-xl border border-slate-800">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-600/10 rounded-full blur-2xl -ml-20 -mb-20"></div>

          <div className="relative z-10 max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-widest font-mono">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" /> South India Exclusive Services
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-sans text-white">
              Instant Used Car Loans <br className="hidden sm:inline" />
              With Zero Doorstep Friction
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              We partnered with India's leading banking institutions like <strong className="text-white font-semibold">ICICI, HDFC, IDFC First, & SBI</strong> to offer standard interest rates beginning at just <span className="text-yellow-400 font-extrabold underline decoration-wavy">9.25% APR</span>. Complete online approvals with paperless RTO hypothecation updates in South India!
            </p>
            <div className="flex flex-wrap gap-4 text-xs font-mono text-slate-300 pt-2">
              <span className="flex items-center gap-1 bg-slate-850 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
                <Check className="w-4 h-4 text-green-400 shrink-0" /> Rate starting 9.25%
              </span>
              <span className="flex items-center gap-1 bg-slate-850 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
                <Check className="w-4 h-4 text-green-400 shrink-0" /> Funding up to 90%
              </span>
              <span className="flex items-center gap-1 bg-slate-850 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
                <Check className="w-4 h-4 text-green-400 shrink-0" /> Approval in 3 Hours
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT PANEL: Interactive Loan EMI Calculator */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                <IndianRupee className="w-5 h-5 text-blue-600" /> Interactive Easy-EMI Calculator
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Adjust values to estimate monthly payouts and choose your comfortable tenure.
              </p>
            </div>

            {/* Sliders Block */}
            <div className="space-y-6 pt-2">
              
              {/* Slider 1: Loan Amount */}
              <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="flex justify-between items-center text-xs font-sans">
                  <span className="font-semibold text-slate-600">Calculated Loan Amount</span>
                  <span className="font-mono text-base font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-xl border border-blue-100">
                    ₹ {loanAmount.toFixed(2)} Lakhs
                  </span>
                </div>
                <input 
                  type="range" 
                  min="1.0" 
                  max="25.0" 
                  step="0.1"
                  value={loanAmount} 
                  onChange={(e) => setLoanAmount(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                  <span>₹1.0 Lakh</span>
                  <span>₹12.5 Lakhs</span>
                  <span>₹25.0 Lakhs</span>
                </div>
              </div>

              {/* Slider 2: Interest Rate */}
              <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="flex justify-between items-center text-xs font-sans">
                  <span className="font-semibold text-slate-600">Offered Interest Rate (p.a.)</span>
                  <span className="font-mono text-base font-bold text-slate-900 bg-slate-200/50 px-3 py-1 rounded-xl border">
                    {interestRate.toFixed(2)}%
                  </span>
                </div>
                <input 
                  type="range" 
                  min="9.25" 
                  max="16.0" 
                  step="0.05"
                  value={interestRate} 
                  onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-800"
                />
                <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                  <span>9.25% (Exclusive Rate)</span>
                  <span>12.5%</span>
                  <span>16.0%</span>
                </div>
              </div>

              {/* Tenure months Selector (Chips style matching top craftsmanship) */}
              <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <label className="block text-xs font-semibold text-slate-600 text-left">
                  Loan Repayment Tenure
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {[12, 24, 36, 48, 60, 72].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setTenureMonths(m)}
                      className={`py-2 px-1 text-center font-bold text-xs rounded-xl border font-mono transition-all cursor-pointer ${
                        tenureMonths === m
                          ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {m / 12} {m / 12 === 1 ? 'Year' : 'Years'}
                      <span className="block text-[8px] font-normal text-slate-400 font-mono mt-0.5">{m} Months</span>
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Calculations Breakdown */}
            <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 space-y-4 relative overflow-hidden">
              <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-white/10 pb-4 gap-3">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">Calculated Monthly Outgoings</span>
                  <span className="text-3xl font-extrabold tracking-tight text-white font-sans">
                    ₹ {Math.round(emi).toLocaleString('en-IN')}<span className="text-xs font-medium text-slate-400 font-mono"> / month</span>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    // Quick scroll to form anchor
                    const formEl = document.getElementById('apply-form-box');
                    if (formEl) formEl.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1 cursor-pointer transition-colors"
                >
                  Apply Under This EMI <ArrowRight className="w-3" />
                </button>
              </div>

              {/* Progress visual comparison bar */}
              <div className="space-y-1 text-xs">
                <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                  <span>Principal: ₹ {(loanAmount * 100000).toLocaleString('en-IN')} ({(100 * P / totalPayable).toFixed(0)}%)</span>
                  <span>Interest: ₹ {Math.round(totalInterest).toLocaleString('en-IN')} ({(100 * totalInterest / totalPayable).toFixed(0)}%)</span>
                </div>
                <div className="w-full h-2.5 bg-slate-800 rounded-full flex overflow-hidden border border-slate-700">
                  <div className="bg-blue-500 h-full" style={{ width: `${(100 * P / totalPayable)}%` }}></div>
                  <div className="bg-yellow-400 h-full animate-pulse" style={{ width: `${(100 * totalInterest / totalPayable)}%` }}></div>
                </div>
              </div>

              {/* Combined payback stats */}
              <div className="grid grid-cols-2 gap-4 text-xs font-sans pt-2">
                <div className="bg-slate-850 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[9px] font-mono text-slate-400 uppercase">Total Interest Amount</span>
                  <p className="font-bold text-yellow-400 font-mono mt-0.5">₹ {Math.round(totalInterest).toLocaleString('en-IN')}</p>
                </div>
                <div className="bg-slate-850 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[9px] font-mono text-slate-400 uppercase">Total Payback Sum</span>
                  <p className="font-bold text-white font-mono mt-0.5">₹ {Math.round(totalPayable).toLocaleString('en-IN')}</p>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT PANEL: Loan application details form */}
          <div id="apply-form-box" className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-sm space-y-6">
            <div>
              <span className="text-[9px] font-bold text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full uppercase tracking-widest font-mono">
                Prescreen Application Range
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-2">
                Evaluate Loan Eligibility
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Share details to get instant provisional eligibility within minutes.
              </p>
            </div>

            {/* Application flow */}
            <AnimatePresence mode="wait">
              {submitStatus === 'success' ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center space-y-4 font-sans py-12"
                >
                  <div className="p-3 bg-green-100 text-green-700 rounded-full w-fit mx-auto">
                    <CheckCircle className="w-10 h-10 animate-bounce" />
                  </div>
                  <h3 className="font-bold text-green-900 text-lg">Application Submitted Successfully!</h3>
                  <p className="text-xs text-green-700 leading-relaxed max-w-sm mx-auto">
                    {serverMessage || "Our banking relationship officers are coordinating with HDFC & ICICI desk to formulate your custom loan quote. Prepare your bank statements!"}
                  </p>
                  <div className="bg-white border rounded-xl p-3.5 space-y-1.5 text-xs text-left text-slate-600 max-w-xs mx-auto">
                     <p className="font-bold text-slate-800 flex justify-between border-b pb-1 font-mono text-[10px] uppercase">
                       <span>Application Draft ID</span>
                       <span className="text-indigo-600">CAPTURED</span>
                     </p>
                     <p>🚗 <strong>Loan Pool Required:</strong> ₹ {loanAmount} Lakhs</p>
                     <p>💵 <strong>Rate Bracket:</strong> {interestRate}% APR</p>
                     <p>📍 <strong>Primary Location:</strong> {formData.city}</p>
                  </div>
                  <button
                    onClick={() => {
                      setSubmitStatus('idle');
                      setFormData({
                        name: '',
                        phone: '',
                        email: '',
                        city: 'Bangalore',
                        employmentType: 'Salaried',
                        monthlyIncome: '₹50,000 - ₹1,00,000',
                        notes: `Applied online through Easy-EMI`
                      });
                    }}
                    className="mt-4 outline-none hover:bg-slate-900 text-slate-800 hover:text-white border px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Calculate Again / Swap Profile
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  {/* Name field */}
                  <div className="space-y-1 text-left">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block font-mono">
                      Your Full Name
                    </label>
                    <input 
                      type="text" 
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Sridhar Ramanujam"
                      className="w-full text-xs font-sans px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl outline-hidden text-slate-800"
                    />
                  </div>

                  {/* Dual Grid Phone & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1 text-left">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block font-mono">
                        Mobile Number
                      </label>
                      <input 
                        type="tel" 
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="10-digit mobile"
                        className="w-full text-xs font-sans px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl outline-hidden text-slate-800"
                      />
                    </div>

                    <div className="space-y-1 text-left">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block font-mono">
                        Email Address
                      </label>
                      <input 
                        type="email" 
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="name@domain.com"
                        className="w-full text-xs font-sans px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl outline-hidden text-slate-800"
                      />
                    </div>
                  </div>

                  {/* City Selector (South India Only - Locked!) */}
                  <div className="space-y-1 text-left">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block font-mono flex justify-between">
                      <span>South India City Network</span>
                      <span className="text-[10px] text-blue-600 lowercase bg-blue-50 px-1 rounded flex items-center gap-0.5">
                        <MapPin className="w-2.5 h-2.5" /> exclusive focus branch
                      </span>
                    </label>
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full text-xs font-sans px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-hidden"
                    >
                      {CITIES.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Employment Status */}
                  <div className="space-y-1 text-left">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block font-mono">
                      Employment Sector type
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {['Salaried', 'Self-Employed', 'Business Owner'].map((sector) => (
                        <button
                          key={sector}
                          type="button"
                          onClick={() => handleEmpTypeSelect(sector)}
                          className={`p-2 font-bold text-[10px] rounded-xl border transition-all text-center cursor-pointer ${
                            formData.employmentType === sector
                              ? 'bg-purple-100 border-purple-400 text-purple-900 font-extrabold'
                              : 'bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-slate-200'
                          }`}
                        >
                          {sector}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Monthly Income Bucket */}
                  <div className="space-y-1 text-left">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block font-mono">
                      Your Monthly Income Bracket (₹)
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        'Under ₹35,000',
                        '₹35,000 - ₹50,000',
                        '₹50,000 - ₹1,00,000',
                        'Over ₹1,00,000'
                      ].map((bracket) => (
                        <button
                          key={bracket}
                          type="button"
                          onClick={() => handleIncomeSelect(bracket)}
                          className={`p-2 text-left px-3 font-semibold text-[10px] rounded-xl border transition-all cursor-pointer ${
                            formData.monthlyIncome === bracket
                              ? 'bg-purple-100 border-purple-400 text-purple-950 font-bold'
                              : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200'
                          }`}
                        >
                          <span className="flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${formData.monthlyIncome === bracket ? 'bg-purple-600' : 'bg-slate-300'}`}></span>
                            {bracket}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-slate-900 hover:bg-slate-950 text-white font-extrabold text-xs py-3 rounded-xl block transition-all shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer text-center outline-hidden"
                    >
                      {isSubmitting ? 'Evaluating Verification...' : `Compute Eligibility for ₹ ${loanAmount.toFixed(1)} Lakhs`}
                    </button>
                  </div>

                  <p className="text-[10px] leading-relaxed text-slate-400 font-mono text-center pt-1.5 flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-green-500" /> Secure SSL Encryption. None of your data is shared with uncertified brokers.
                  </p>

                </form>
              )}
            </AnimatePresence>

          </div>

        </div>

        {/* Banking Partner Listings */}
        <div className="mt-12 bg-white rounded-3xl border p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" /> Authorized Banking Network
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                We coordinate quotes simultaneously from multiple banks to assure lowest interest and maximum processing velocity.
              </p>
            </div>
            <span className="text-[9px] uppercase font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded font-mono">
              South India Coverage Partner
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: "HDFC Bank", baseRate: "9.25%", tenure: "Up to 7 Years", processing: "₹1,500 Flat", maxFunding: "90% of Valuation" },
              { name: "ICICI Bank", baseRate: "9.30%", tenure: "Up to 7 Years", processing: "1% of Loan Value", maxFunding: "85% of Valuation" },
              { name: "IDFC First", baseRate: "9.45%", tenure: "Up to 6 Years", processing: "No Prepayment Fee", maxFunding: "92% of Valuation" },
              { name: "SBI Loan Desk", baseRate: "9.50%", tenure: "Up to 7 Years", processing: "Zero Hidden Charges", maxFunding: "80% of Valuation" }
            ].map((bank) => (
              <div key={bank.name} className="border border-slate-200/80 hover:border-slate-300 rounded-2xl p-4 space-y-2 hover:shadow-xs transition-shadow">
                <div className="flex justify-between items-center border-b pb-2">
                  <h3 className="font-extrabold text-slate-800 text-sm">{bank.name}</h3>
                  <span className="text-[11px] font-mono font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">
                    From {bank.baseRate}
                  </span>
                </div>
                <div className="space-y-1.5 text-[11px] font-sans text-slate-600">
                  <p className="flex justify-between"><span>Max Tenure:</span> <strong className="text-slate-800">{bank.tenure}</strong></p>
                  <p className="flex justify-between"><span>Processing fee:</span> <strong className="text-slate-800">{bank.processing}</strong></p>
                  <p className="flex justify-between"><span>Max Funding:</span> <strong className="text-slate-800">{bank.maxFunding}</strong></p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Checklist Requirements Block */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          
          {/* Documents Checklist Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" /> Paperless Document Checklist
            </h3>
            <p className="text-xs text-slate-500">
              Prepare these scanned files digitally to claim provisional approval certificates in under 3 hours:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-2">
                <p className="font-bold text-slate-700 bg-slate-50 px-2 py-1 rounded">💼 For Salaried Employees</p>
                <ul className="space-y-1.5 pl-2 text-slate-600">
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-green-600 shrink-0" /> PAN Card & Aadhaar Verification
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-green-600 shrink-0" /> Latest 3 Months Salary Slips
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-green-600 shrink-0" /> 6 Months PDF Bank Statement
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-green-600 shrink-0" /> Form 16 or IT Return Draft
                  </li>
                </ul>
              </div>

              <div className="space-y-2">
                <p className="font-bold text-slate-700 bg-slate-50 px-2 py-1 rounded">🚜 For Business Owners</p>
                <ul className="space-y-1.5 pl-2 text-slate-600">
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-green-600 shrink-0" /> GST Register Proof / MSME
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-green-600 shrink-0" /> IT Returns for last 2 Years
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-green-600 shrink-0" /> Office Address Proof file
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-green-600 shrink-0" /> Partner / Directors ID files
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* RTO Transfer and Hypothecation workflow */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 text-xs">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" /> RTO Hypothecation Process in South India
            </h3>
            <p className="text-slate-500">
              Buying a used car via loan requires correcting the bank hypothecation details in the Registration Certificate (RC Book). Under our specialized South Indian network, we make this fully doorstep-led:
            </p>

            <div className="space-y-3">
              <div className="flex gap-2 text-slate-700">
                <span className="w-5 h-5 shrink-0 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center font-mono text-[10px]">1</span>
                <div>
                  <strong className="text-slate-800">Form 34 Preparation:</strong> Our desk drafts Form 34 (Notice of Hypothecation in favor of your selected loan provider) automatically upon bank sign-off.
                </div>
              </div>

              <div className="flex gap-2 text-slate-700">
                <span className="w-5 h-5 shrink-0 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center font-mono text-[10px]">2</span>
                <div>
                  <strong className="text-slate-800">Local RTO Coordination:</strong> We send representative personnel to regional RTOs (whether KA-01 Bangalore, TS-09 Hyderabad, TN-01 Chennai, or others) on your behalf to register the bank endorsement.
                </div>
              </div>

              <div className="flex gap-2 text-slate-700">
                <span className="w-5 h-5 shrink-0 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center font-mono text-[10px]">3</span>
                <div>
                  <strong className="text-slate-800">Pristine RC Delivery:</strong> A fresh smartcard RC specifying the Hypothecation is courier-dispatched directly to your door in 15 days. No queues!
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
