import React from 'react';
import { ShieldCheck, Mail, Phone, MapPin, ExternalLink, Calendar, Heart } from 'lucide-react';
import { CITIES, BRANDS } from '../data';

interface FooterProps {
  navigate: (path: string) => void;
}

export default function Footer({ navigate }: FooterProps) {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Logo & Intro */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
              <div className="p-1.5 bg-blue-600 rounded-lg text-white">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className="font-sans font-bold text-xl tracking-tight text-white">
                Mana<span className="text-blue-500 font-extrabold">UsedCars</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              ManaUsedCars is South India's premier trust-first used cars marketplace. Experience certified 150-point inspection reports, seamless RC transfers, and doorstep evaluations across Bangalore, Hyderabad, Chennai, Kochi, Coimbatore, and Visakhapatnam.
            </p>
            <div className="flex items-center text-xs text-slate-400 gap-2">
              <Phone className="w-3.5 h-3.5 text-blue-500" />
              <span>Support Desk: +91 98765 43210</span>
            </div>
            <div className="flex items-center text-xs text-slate-400 gap-2">
              <Mail className="w-3.5 h-3.5 text-blue-500" />
              <span>Email: help@manausedcars.com</span>
            </div>
          </div>

          {/* City Landing Pages (SEO-focused as requested) */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-blue-500 pl-2">
              Cars in Popular Cities
            </h3>
            <ul className="space-y-2 text-xs">
              {CITIES.map((city) => (
                <li key={city.id}>
                  <button
                    onClick={() => navigate(`/cars/${city.slug}`)}
                    className="hover:text-blue-400 transition-colors cursor-pointer text-left focus:outline-hidden"
                  >
                    Used Cars in {city.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Brand Landing Pages (SEO-focused) */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-blue-500 pl-2">
              Popular Car Brands
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {BRANDS.slice(0, 8).map((brand) => (
                <button
                  key={brand.id}
                  onClick={() => navigate(`/brands/${brand.id}`)}
                  className="hover:text-blue-400 transition-colors cursor-pointer text-left hover:underline focus:outline-hidden block"
                >
                  Used {brand.name}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Help & Admin Actions */}
          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3 border-l-2 border-blue-500 pl-2">
                Our Offerings
              </h3>
              <ul className="space-y-2 text-xs">
                <li>
                  <button onClick={() => navigate('/buy')} className="hover:text-blue-400 transition-colors cursor-pointer block">
                    Verified Car Catalog
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('/sell')} className="hover:text-blue-400 transition-colors cursor-pointer block">
                    Free Instant Valuation
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('/service')} className="hover:text-blue-400 transition-colors cursor-pointer flex items-center gap-1">
                    <span className="flex w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Doorstep Car Servicing
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('/finance')} className="hover:text-blue-400 transition-colors cursor-pointer block">
                    Car Finance & Easy EMI
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('/contact')} className="hover:text-blue-400 transition-colors cursor-pointer block">
                    Schedule Inspection
                  </button>
                </li>
              </ul>
            </div>

            <div className="pt-2">
              <button
                onClick={() => navigate('/admin')}
                className="inline-flex items-center gap-1 text-[10px] uppercase font-mono font-bold text-red-500 bg-red-950/40 px-2 py-1 rounded border border-red-900/60 transition-colors hover:bg-red-950/70 cursor-pointer"
              >
                ⚙️ Inquiries Console Dashboard
              </button>
            </div>
          </div>
        </div>

        {/* Separator / Copyright */}
        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center text-[11px] text-slate-500 font-mono">
          <p>© 2026 ManaUsedCars. Built with Trust-First Engineering.</p>
          <p className="flex items-center gap-1 mt-2 sm:mt-0">
            Engineered for elite lead speed and conversion optimization <Heart className="w-3" />
          </p>
        </div>
      </div>
    </footer>
  );
}
