import React, { useState } from 'react';
import { CheckCircle, ShieldCheck, IndianRupee } from 'lucide-react';
import { CITIES } from '../data';

interface FinanceViewProps {
  navigate: (path: string) => void;
}

export default function FinanceView({ navigate }: FinanceViewProps) {
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', city: 'Bangalore', loanAmount: 5 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert("Please enter your name and phone number.");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/finance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email || 'N/A',
          city: formData.city,
          loanAmount: formData.loanAmount,
          employmentType: 'Not specified',
          monthlyIncome: 'Not specified',
          notes: `Loan request of ₹${formData.loanAmount} Lakhs`
        })
      });
      const data = await res.json();
      if (data.success) setSubmitted(true);
      else alert("Server error. Please try again.");
    } catch (err) {
      console.error(err);
      alert("Network error.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4"><CheckCircle className="w-8 h-8 text-green-700" /></div>
        <h2 className="text-2xl font-bold">Application Sent!</h2>
        <p className="text-slate-600 mt-2">Your loan request has been sent to our Telegram bot. We'll contact you shortly.</p>
        <button onClick={() => navigate('/')} className="mt-6 bg-slate-900 text-white px-5 py-2 rounded-xl text-sm">Back to Home</button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Car Loan Request</h1>
        <p className="text-slate-500 mt-1">Fill the form below – we will reach out to you.</p>
      </div>
      <div className="bg-white border rounded-2xl p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700">Full Name *</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full border rounded-xl px-4 py-2 mt-1" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700">Phone Number *</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="w-full border rounded-xl px-4 py-2 mt-1" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700">Email (optional)</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border rounded-xl px-4 py-2 mt-1" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700">City</label>
            <select name="city" value={formData.city} onChange={handleChange} className="w-full border rounded-xl px-4 py-2 mt-1">
              {CITIES.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700">Loan Amount (₹ Lakhs)</label>
            <input type="number" name="loanAmount" value={formData.loanAmount} onChange={handleChange} min="1" max="50" step="0.5" className="w-full border rounded-xl px-4 py-2 mt-1" />
            <p className="text-xs text-slate-400 mt-1">We will get you the best rates from partner banks.</p>
          </div>
          <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl mt-4">
            {isSubmitting ? 'Submitting...' : 'Request Callback'}
          </button>
          <p className="text-center text-[10px] text-slate-400 flex items-center justify-center gap-1 mt-2"><ShieldCheck className="w-3 h-3" /> Your data is secure and sent only to our Telegram bot.</p>
        </form>
      </div>
    </div>
  );
}
