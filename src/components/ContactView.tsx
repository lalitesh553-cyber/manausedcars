import React, { useState } from 'react';
import { Mail, Phone, MapPin, CheckCircle, Clock, ShieldCheck, ArrowRight, MessageSquare } from 'lucide-react';

interface ContactViewProps {
  navigate: (path: string) => void;
}

export default function ContactView({ navigate }: ContactViewProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !message) {
      alert("Please provide Name, Phone, and your Message.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, email: email || 'N/A', message })
      });
      const res = await response.json();
      if (res.success) {
        setIsSubmitted(true);
      } else {
        alert("Server returned error booking contact request.");
      }
    } catch (err) {
      console.error(err);
      alert("A network error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="contact-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left bg-white font-sans">
      
      <div className="text-center space-y-2 mb-12">
        <span className="text-xs font-bold text-blue-600 uppercase tracking-widest font-mono">24/7 Support Desk</span>
        <h1 className="font-sans font-bold text-2xl sm:text-4xl text-slate-900 tracking-tight">Connect with ManaUsedCars Support</h1>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          Need help transfering ownership? Want RTO confirmation? Connect directly with local agents.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* ================= LEFT: SUPPORT METRICS & COORDINATES ================= */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200/80 space-y-6">
            <h3 className="font-sans font-bold text-lg text-slate-900 border-b border-slate-200 pb-3">Corporate Headquarters</h3>
            
            <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
              <div className="flex gap-3">
                <MapPin className="w-5 h-5 text-blue-600 shrink-0" />
                <div>
                   <p className="font-bold text-slate-800">ManaUsedCars Private Limited</p>
                   <p>Level 8, Nexus Trade Tower, 100 Feet Ring Road, Indiranagar, Bangalore - 560038</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Phone className="w-5 h-5 text-blue-600 shrink-0" />
                <div>
                   <p className="font-bold text-slate-800">Toll-Free Helpline</p>
                   <p className="font-mono">+91 98765 43210 (Mon-Sat 9 AM - 6 PM)</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Mail className="w-5 h-5 text-blue-600 shrink-0" />
                <div>
                   <p className="font-bold text-slate-800">Email Correspondence</p>
                   <p className="font-mono">help@autobazaarindia.com / partners@autobazaar.in</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Clock className="w-5 h-5 text-blue-600 shrink-0" />
                <div>
                   <p className="font-bold text-slate-800">Estimated Response Time</p>
                   <p>Callbacks completed in under 15 minutes during active business slots.</p>
                </div>
              </div>
            </div>

            {/* Quick trust seals list */}
            <div className="border-t border-slate-200 pt-5 space-y-2 text-[11px] font-medium text-slate-500">
               <p className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-green-600" /> Free RTO Transfer & paperwork mediation</p>
               <p className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-green-600" /> Fair pricing index with no agent markup</p>
            </div>
          </div>
        </div>

        {/* ================= RIGHT: CONTACT FORM MODULE ================= */}
        <div className="lg:col-span-7 bg-white border border-slate-200 p-6 sm:p-10 rounded-3xl shadow-xs">
          {!isSubmitted ? (
            <div className="space-y-6">
              <div className="space-y-1">
                 <h3 className="font-sans font-bold text-lg text-slate-900">Broadcast Support Request</h3>
                 <p className="text-xs text-slate-450">Fill out your message parameters. We submit directly to admin inbox.</p>
              </div>

              <form onSubmit={handleContactSubmit} className="space-y-4">
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-left">
                   <div className="space-y-1.5">
                     <label className="font-bold text-slate-600">Your Full Name <strong className="text-red-500">*</strong></label>
                     <input
                       type="text"
                       value={name}
                       onChange={(e) => setName(e.target.value)}
                       placeholder="e.g. Priyesh Deshmukh"
                       required
                       className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-hidden focus:border-blue-600 focus:bg-white"
                     />
                   </div>

                   <div className="space-y-1.5">
                     <label className="font-bold text-slate-600">Contact Number <strong className="text-red-500">*</strong></label>
                     <div className="relative">
                       <span className="absolute left-3 top-2.5 font-mono text-slate-400 font-bold">+91</span>
                       <input
                         type="tel"
                         pattern="[6-9][0-9]{9}"
                         value={phone}
                         onChange={(e) => setPhone(e.target.value)}
                         placeholder="9876543210"
                         required
                         className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-3 py-2.5 text-xs text-slate-800 font-mono focus:outline-hidden focus:border-blue-600 focus:bg-white"
                       />
                     </div>
                   </div>
                 </div>

                 <div className="space-y-1.5 text-xs">
                    <label className="font-bold text-slate-600 block">Email Address (Optional)</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. priyesh@gmail.com"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-hidden focus:border-blue-600 focus:bg-white"
                    />
                 </div>

                 <div className="space-y-1.5 text-xs">
                    <label className="font-bold text-slate-600 block">Your Message / Inquiry Details <strong className="text-red-500">*</strong></label>
                    <textarea
                      rows={4}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="e.g. I want to buy a Honda City located in Mumbai. I reside in South Mumbai and want to schedule a physical test drive tomorrow evening."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-hidden focus:border-blue-600 focus:bg-white"
                    ></textarea>
                 </div>

                 <button
                   type="submit"
                   disabled={isSubmitting}
                   className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold py-3.5 rounded-xl text-xs transition-colors cursor-pointer"
                 >
                   {isSubmitting ? 'Transmitting lead to admin...' : 'Submit Support Request'}
                 </button>
              </form>
            </div>
          ) : (
            <div className="text-center py-8 space-y-6 animate-in fade-in">
              <div className="p-3.5 bg-green-100 text-green-700 rounded-full w-fit mx-auto">
                 <CheckCircle className="w-10 h-10" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-sans font-bold text-lg text-slate-900">Message Delivered Successfully</h3>
                <p className="text-xs text-slate-550 max-w-sm mx-auto leading-relaxed">
                   Hello <strong>{name}</strong>! Your support request message has been transformed into a Support Lead. Check your console dashboard to see the logged parameters.
                </p>
              </div>

              <div className="flex gap-3 justify-center pt-2">
                 <button
                   type="button"
                   onClick={() => navigate('/admin')}
                   className="bg-slate-900 hover:bg-slate-950 text-white font-bold py-2.5 px-5 rounded-xl text-xs cursor-pointer block text-center"
                 >
                   Browse Admin Leads Workspace
                 </button>
                 <button
                   type="button"
                   onClick={() => {
                     setName('');
                     setPhone('');
                     setMessage('');
                     setIsSubmitted(false);
                   }}
                   className="bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-bold py-2.5 px-5 rounded-xl text-xs cursor-pointer block text-center"
                 >
                   Write Another Message
                 </button>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
