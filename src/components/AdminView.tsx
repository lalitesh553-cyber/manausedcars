import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ClipboardList, ShieldAlert, RefreshCw, Clock, CheckCircle } from 'lucide-react';
import { Lead } from '../types';

export default function AdminView() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'buy' | 'sell' | 'service' | 'contact' | 'finance'>('all');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fetch leads on refresh
  useEffect(() => {
    async function fetchLeads() {
      setIsLoading(true);
      try {
        const response = await fetch('/api/leads');
        const data = await response.json();
        setLeads(data.leads || []);
      } catch (err) {
        console.error("Failed to load leads from backend:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchLeads();
  }, [refreshTrigger]);

  // Filter leads inside client
  const filteredLeads = leads.filter(l => {
    if (activeFilter === 'all') return true;
    return l.type === activeFilter;
  });

  return (
    <div id="admin-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-left bg-white font-sans">
      
      {/* Visual Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200 pb-6 mb-8 gap-4">
        <div>
           <span className="text-xs font-bold text-red-600 uppercase tracking-widest font-mono">Operations Console</span>
           <h1 className="font-sans font-bold text-2xl sm:text-3xl text-slate-900 mt-1">Lead Capture Dashboard</h1>
           <p className="text-xs text-slate-500 mt-1">
             Live tracker of buying, selling, finance, and doorstep servicing inquiries generated during this sandbox session.
           </p>
        </div>

        {/* Refresh Actions */}
        <button
          onClick={() => setRefreshTrigger(p => p + 1)}
          className="bg-slate-900 hover:bg-slate-950 text-white font-bold p-2.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs focus:outline-hidden"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} /> Refresh Lead Deck
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
         
         {/* Filter Sidebar (Quick metrics) */}
         <div className="lg:col-span-3 space-y-4">
            <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-4 text-xs font-sans">
              <p className="font-bold text-slate-700 uppercase tracking-wider text-[11px] font-mono">Leads Classification</p>
              
              <div className="flex flex-col gap-1.5">
                {[
                  { id: 'all', label: 'All Inquiries', count: leads.length },
                  { id: 'sell', label: 'Sell Valuation Leads', count: leads.filter(l => l.type === 'sell').length },
                  { id: 'buy', label: 'Buy Test Drive Leads', count: leads.filter(l => l.type === 'buy').length },
                  { id: 'finance', label: 'Car Loan Applications', count: leads.filter(l => l.type === 'finance').length },
                  { id: 'service', label: 'Servicing Bookings', count: leads.filter(l => l.type === 'service').length },
                  { id: 'contact', label: 'Support Inbound Desk', count: leads.filter(l => l.type === 'contact').length }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveFilter(item.id as any)}
                    className={`w-full text-left px-3 py-2 rounded-xl font-bold flex justify-between items-center cursor-pointer transition-colors ${
                      activeFilter === item.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                     <span>{item.label}</span>
                     <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${activeFilter === item.id ? 'bg-blue-700' : 'bg-slate-100 text-slate-400 border'}`}>
                       {item.count}
                     </span>
                  </button>
                ))}
              </div>

               <div className="pt-2 border-t border-slate-200">
                  <div className="bg-amber-50 rounded-xl p-3 border border-amber-200 text-[11px] leading-relaxed text-amber-900 flex gap-1.5">
                     <ShieldAlert className="w-5 h-5 shrink-0 text-amber-700" />
                     <span>
                        All credentials displayed are populated dynamically strictly during runtime memory storage and expire upon restarting the dev server.
                     </span>
                  </div>
               </div>
            </div>
         </div>

         {/* Leads List table */}
         <div className="lg:col-span-9 space-y-6">
            {isLoading ? (
              <div className="py-12 text-center bg-slate-50 border rounded-2xl animate-pulse text-slate-400 text-sm">
                Refreshing Leads deck... Please hold...
              </div>
            ) : filteredLeads.length === 0 ? (
              <div className="border border-slate-200 rounded-3xl p-12 text-center bg-slate-50 space-y-4 max-w-md mx-auto">
                 <div className="p-3 bg-slate-200 text-slate-500 rounded-full w-fit mx-auto">
                    <ClipboardList className="w-8 h-8" />
                 </div>
                 <h3 className="font-bold text-slate-900 text-base">No Active Leads Captured Yet</h3>
                 <p className="text-xs text-slate-500 leading-relaxed">
                   Go ahead and submit a test Sell My Car valuation request, request Car Finance eligibility, book a Doorstep Car Servicing appointment, or trigger a callback on the Buy Cars details page. They will populate automatically!
                 </p>
              </div>
            ) : (
              <div className="space-y-4">
                 {filteredLeads.map((lead) => (
                   <div
                     key={lead.id}
                     className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-5 shadow-xs hover:shadow-md transition-shadow text-xs font-sans text-slate-700 flex flex-col sm:flex-row justify-between items-start gap-4"
                   >
                     
                     {/* Left segment specs */}
                     <div className="space-y-3 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                           <span className={`px-2 py-0.5 rounded font-mono font-bold uppercase text-[9px] ${
                             lead.type === 'sell' ? 'bg-green-100 text-green-700' :
                             lead.type === 'buy' ? 'bg-blue-100 text-blue-700' :
                             lead.type === 'finance' ? 'bg-purple-100 text-purple-700' :
                             lead.type === 'service' ? 'bg-yellow-101 bg-yellow-100 text-yellow-800' :
                             'bg-slate-100 text-slate-700'
                           }`}>
                             {lead.type.toUpperCase()} INQUIRY
                           </span>

                           <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                              <Clock className="w-3" /> {new Date(lead.timestamp).toLocaleTimeString()} • {new Date(lead.timestamp).toLocaleDateString()}
                           </span>

                           {/* Status of Resend API */}
                           <span className="text-[9px] text-slate-400 bg-slate-50 font-mono px-1.5 py-0.5 rounded flex items-center gap-0.5">
                              <CheckCircle className="w-3 text-green-600" /> Lead Captured / Console Draft Saved
                           </span>
                        </div>

                        {/* Customer profile */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-3 border-b border-slate-100">
                          <div className="space-y-1 text-left">
                             <p className="text-[10px] uppercase text-slate-400 font-bold">👤 Profile</p>
                             <p className="font-bold text-slate-900">{lead.name}</p>
                             <p className="text-[11px] text-slate-500 font-mono">{lead.phone} • {lead.email}</p>
                          </div>
                          
                          <div className="space-y-1 text-left">
                             <p className="text-[10px] uppercase text-slate-400 font-bold">📍 Metadata location</p>
                             <p className="font-bold text-slate-800">{lead.city || 'N/A'}</p>
                          </div>
                        </div>

                        {/* Custom fields depending on type */}
                        {lead.type === 'sell' && (
                          <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-left">
                            <p className="font-bold text-slate-800">
                              🚙 {lead.details.year} {lead.details.brand} {lead.details.model} ({lead.details.variant})
                            </p>
                            <p className="text-slate-500">
                              {lead.details.fuel} • {lead.details.transmission} • {Number(lead.details.km).toLocaleString()} km • Condition: <strong>{lead.details.condition}</strong>
                            </p>
                            <p className="text-blue-600 font-bold">Expected Price: ₹{lead.details.expectedPrice} Lakhs</p>
                            {lead.details.notes && <p className="text-[11px] text-slate-500 italic mt-1 font-sans">Notes: "{lead.details.notes}"</p>}
                          </div>
                        )}

                        {lead.type === 'buy' && (
                          <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-left text-[11px]">
                            <p className="font-bold text-slate-800">
                              🚗 Targeted: {lead.details.brand} {lead.details.model} ({lead.details.year})
                            </p>
                            <p className="text-slate-500">Action demanded: <strong className="text-blue-600">{lead.details.condition}</strong></p>
                          </div>
                        )}

                        {lead.type === 'finance' && (
                          <div className="p-3 bg-purple-50/50 border border-purple-100 rounded-xl space-y-1 text-left text-[11px]">
                            <p className="font-bold text-purple-900">
                              💰 Professional Car Finance Application
                            </p>
                            <p className="text-slate-600">
                              <strong>Employment:</strong> {lead.details.condition} • <strong>Monthly Income Bracket:</strong> {lead.details.variant}
                            </p>
                            <p className="text-indigo-700 font-bold">
                              Requested Loan Amount: ₹ {lead.details.expectedPrice} Lakhs
                            </p>
                            {lead.details.notes && (
                              <p className="text-[10px] text-slate-500 italic mt-1 font-mono">
                                Computed Details: {lead.details.notes}
                              </p>
                            )}
                          </div>
                        )}

                        {lead.type === 'service' && (
                          <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-left text-[11px]">
                            <p className="font-bold text-slate-800">
                              ⚙️ Doorstep booking: <span className="bg-yellow-105 bg-yellow-100 text-slate-800 font-bold px-2 py-0.5 rounded font-sans text-[10px]">{lead.details.serviceType}</span>
                            </p>
                            <p className="text-slate-600">
                              <strong>Vehicle:</strong> {lead.details.brand} {lead.details.model} • <strong>Slot:</strong> {lead.details.bookingDate} at {lead.details.bookingTime}
                            </p>
                            <p className="text-slate-600"><strong>Address:</strong> {lead.details.address}</p>
                            {lead.details.notes && <p className="text-[11px] text-slate-500 italic">"Instructions: {lead.details.notes}"</p>}
                          </div>
                        )}

                        {lead.type === 'contact' && (
                          <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-left">
                            <p className="font-bold text-slate-800">✉ Message Body:</p>
                            <p className="text-slate-500 italic">"{lead.details.notes}"</p>
                          </div>
                        )}
                     </div>

                     {/* Right segment actions */}
                     <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest leading-none bg-slate-50 border p-2 rounded-xl shrink-0">
                       ID: {lead.id}
                     </span>

                   </div>
                 ))}
              </div>
            )}
         </div>

      </div>

    </div>
  );
}
