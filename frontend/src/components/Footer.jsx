import React from 'react';
import { Activity, ShieldCheck, HeartPulse, Clock, Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-sm border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center text-white">
                <Activity className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                AuraHealth
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Leading digital diagnostic healthcare platform delivering fast, accurate, and confidential medical laboratory report tracking.
            </p>
            <div className="flex items-center gap-2 text-xs text-teal-400 font-medium">
              <ShieldCheck className="w-4 h-4" /> ISO 15189 Certified Labs
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-4">Patient Care</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#" className="hover:text-teal-400 transition">Complete Blood Count</a></li>
              <li><a href="#" className="hover:text-teal-400 transition">Lipid Screening</a></li>
              <li><a href="#" className="hover:text-teal-400 transition">Thyroid Function Panel</a></li>
              <li><a href="#" className="hover:text-teal-400 transition">Diabetes Care (HbA1c)</a></li>
              <li><a href="#" className="hover:text-teal-400 transition">Vitamin & Mineral Profile</a></li>
            </ul>
          </div>

          {/* Standards & Timelines */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-4">Laboratory Workflow</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-teal-400" /> 12-24 Hour Turnaround</li>
              <li className="flex items-center gap-2"><HeartPulse className="w-3.5 h-3.5 text-teal-400" /> Verified Pathologist Signoff</li>
              <li className="flex items-center gap-2"><ShieldCheck className="w-3.5 h-3.5 text-teal-400" /> Encrypted PDF Reports</li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-4">Emergency Support</h4>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-teal-400" />
                <span>+1 (800) 555-AURA (2872)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-teal-400" />
                <span>support@aurahealth.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-teal-400" />
                <span>742 Evergreen Medical Park, Sector 4</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} AuraHealth Platform. All rights reserved.</p>
          <div className="flex items-center gap-4 mt-2 sm:mt-0">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">HIPAA Compliance</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
