import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { testsAPI } from '../../services/api';
import {
  Search,
  Stethoscope,
  Clock,
  FlaskConical,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  HeartPulse,
  Tag
} from 'lucide-react';

const categories = ['All', 'Blood Test', 'Cardiology', 'Diabetes', 'Pathology', 'Radiology', 'Health Package'];

const Home = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: tests = [], isLoading, isError } = useQuery({
    queryKey: ['tests', selectedCategory, searchTerm],
    queryFn: async () => {
      const res = await testsAPI.getAll({
        category: selectedCategory === 'All' ? '' : selectedCategory,
        search: searchTerm,
      });
      return res.data;
    },
  });

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Banner Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white p-8 md:p-14 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-80 h-80 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold border border-teal-500/30">
            <Sparkles className="w-3.5 h-3.5" /> Certified Diagnostic Partner
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
            Accurate Diagnostic Testing, <br />
            <span className="bg-gradient-to-r from-teal-300 to-cyan-300 bg-clip-text text-transparent">
              Simplified & Transparent.
            </span>
          </h1>

          <p className="text-slate-300 text-sm md:text-base leading-relaxed font-light max-w-2xl">
            Book certified blood & pathology tests, schedule convenient appointment slots, and track your sample status in real-time with instant digital PDF reports.
          </p>

          {/* Search Bar */}
          <div className="pt-2">
            <div className="relative max-w-xl">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Search className="w-5 h-5 text-teal-400" />
              </div>
              <input
                type="text"
                placeholder="Search test name (e.g., Complete Blood Count, Lipid, Thyroid)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-white/10 backdrop-blur-md text-white placeholder-slate-400 border border-white/20 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:bg-white/20 transition shadow-lg"
              />
            </div>
          </div>

          {/* Highlights Row */}
          <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-300 font-medium">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-400" /> NABL Accredited Labs
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-400" /> 100% Digital PDF Reports
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-400" /> 5-Step Journey Tracking
            </div>
          </div>
        </div>
      </section>

      {/* Category Pills Filter */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Browse Diagnostic Tests</h2>
            <p className="text-xs text-slate-500">Filter tests by specialized medical categories</p>
          </div>
          <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
            {tests.length} Tests Available
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-teal-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Diagnostic Tests Grid */}
      <section>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-white rounded-2xl p-6 h-64 border border-slate-200 animate-pulse space-y-4">
                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                <div className="h-3 bg-slate-100 rounded w-1/2"></div>
                <div className="h-16 bg-slate-100 rounded"></div>
                <div className="h-8 bg-slate-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="bg-rose-50 border border-rose-200 p-6 rounded-2xl text-rose-700 text-sm text-center">
            Failed to load diagnostic tests. Please try refreshing.
          </div>
        ) : tests.length === 0 ? (
          <div className="bg-slate-100/70 border border-slate-200 p-12 rounded-2xl text-center space-y-3">
            <Stethoscope className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="font-semibold text-slate-800 text-base">No diagnostic tests found</h3>
            <p className="text-xs text-slate-500">Try adjusting your search query or category filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tests.map((test) => {
              const effectivePrice = test.discountPrice > 0 ? test.discountPrice : test.price;
              const hasDiscount = test.discountPrice > 0 && test.discountPrice < test.price;

              return (
                <div
                  key={test._id}
                  className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className="px-2.5 py-1 bg-teal-50 text-teal-700 text-[11px] font-bold rounded-lg uppercase tracking-wider border border-teal-100">
                        {test.category}
                      </span>
                      <span className="text-[11px] font-medium text-slate-400 font-mono">
                        {test.code}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-teal-600 transition-colors">
                      {test.name}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {test.description}
                    </p>

                    <div className="pt-2 grid grid-cols-2 gap-2 text-xs text-slate-500 border-t border-slate-100">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-teal-600" />
                        <span>{test.turnaroundTime}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <FlaskConical className="w-3.5 h-3.5 text-cyan-600" />
                        <span>{test.sampleType}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-xl font-extrabold text-slate-900">
                          ${effectivePrice.toFixed(2)}
                        </span>
                        {hasDiscount && (
                          <span className="text-xs text-slate-400 line-through">
                            ${test.price.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
                        <Tag className="w-3 h-3" /> No hidden lab fee
                      </span>
                    </div>

                    <button
                      onClick={() => navigate(`/tests/${test._id}`)}
                      className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition"
                    >
                      Book Test <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
