import React from 'react';
import { ShieldCheck, Heart, UserCheck, Star, Award, MapPin } from 'lucide-react';

export default function AboutView() {
  return (
    <div id="about-view" className="max-w-4xl mx-auto px-4 sm:px-6 py-10 text-left bg-white font-sans space-y-12">
      
      {/* Intro Header */}
      <div className="space-y-3 pt-4 border-b border-slate-100 pb-8 text-center sm:text-left">
         <span className="text-xs font-bold text-blue-600 uppercase tracking-widest font-mono">Our Heritage</span>
         <h1 className="font-sans font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">The ManaUsedCars Story</h1>
         <p className="text-sm text-slate-500 max-w-xl leading-relaxed">
            Pioneering a blueprint for transparency, simplicity, and absolute consumer protection in India's pre-owned automotive sector.
         </p>
      </div>

      {/* Grid of details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
         
         {/* Story Card */}
         <div className="space-y-4">
            <h3 className="text-lg font-bold font-sans text-slate-900">Why ManaUsedCars Exists</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans pt-1">
               Historically, purchasing a used car in India has been a maze of obscure pricing, undisclosed structural defects, and endless RTO transfer hassles. Middlemen and uncertified agents often conceal water damage, odometer tampering, or pending traffic violations from buyers.
            </p>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
               ManaUsedCars was founded with one singular objective: to establish complete, verified clarity inside the market. We are a **trust-first, lead-generation catalog**. Rather than pressuring quick transactions, we prioritize extensive diagnostics, doorstep values, and zero-cost paperwork processing.
            </p>
         </div>

         {/* Visual Highlights list */}
         <div className="bg-slate-50 border border-slate-200 p-6 sm:p-8 rounded-3xl space-y-5">
            <h4 className="text-xs font-bold text-slate-400 font-mono tracking-widest uppercase">The Pillars of our Pledge</h4>
            
            <div className="space-y-4">
              <div className="flex gap-3 text-xs leading-relaxed">
                 <div className="p-2 bg-blue-105 bg-blue-100 rounded-xl text-blue-600 w-fit shrink-0">
                    <ShieldCheck className="w-5 h-5 text-blue-600" />
                 </div>
                 <div>
                    <h5 className="font-bold text-slate-900">100% Certified Integrity</h5>
                    <p className="text-slate-500">Every catalog entry undergoes a meticulous 150-point technical diagnostics check prior to approval.</p>
                 </div>
              </div>

              <div className="flex gap-3 text-xs leading-relaxed">
                 <div className="p-2 bg-blue-105 bg-blue-100 rounded-xl text-blue-600 w-fit shrink-0">
                    <UserCheck className="w-5 h-5 text-blue-600" />
                 </div>
                 <div>
                    <h5 className="font-bold text-slate-900">Free Paperwork Formalities</h5>
                    <p className="text-slate-500">Our regional transport office experts process all registration transfers completely free of charge.</p>
                 </div>
              </div>

              <div className="flex gap-3 text-xs leading-relaxed">
                 <div className="p-2 bg-blue-105 bg-blue-100 rounded-xl text-blue-600 w-fit shrink-0">
                    <Award className="w-5 h-5 text-blue-600" />
                 </div>
                 <div>
                    <h5 className="font-bold text-slate-900">Doorstep Convenience</h5>
                    <p className="text-slate-500">From home valuations to verified mechanics doorstep servicing, we optimize your schedule.</p>
                 </div>
              </div>
            </div>
         </div>

      </div>

      {/* Mission & Vision blocks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-slate-700">
         <div className="p-6 border border-slate-200/80 rounded-2xl space-y-2">
            <h4 className="font-bold text-slate-900 text-sm">Vision Statement</h4>
            <p className="leading-relaxed text-slate-500">
               To build India's most cohesive, secure, and technologically seamless digital used car platform where buyers and sellers operate with complete, uncompromised safety and confidence.
            </p>
         </div>

         <div className="p-6 border border-slate-200/80 rounded-2xl space-y-2">
            <h4 className="font-bold text-slate-900 text-sm">Mission Statement</h4>
            <p className="leading-relaxed text-slate-500">
               To empower hundreds of thousands of Indian families through accurate diagnostics, door-to-door servicing convenience, banking interest packages, and transparent valuation estimators.
            </p>
         </div>
      </div>

    </div>
  );
}
