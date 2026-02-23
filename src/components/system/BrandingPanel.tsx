"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Palette, Globe, Image as ImageIcon, Type, Sparkles } from "lucide-react";

export default function BrandingPanel() {
  const [primaryColor, setPrimaryColor] = useState("#6366f1");
  const [logoUrl, setLogoUrl] = useState("");
  const [subdomain, setSubdomain] = useState("acme");
  const [font, setFont] = useState("inter");
  const [showPreview, setShowPreview] = useState(true);

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-20">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-light text-slate-800 dark:text-slate-100">Workspace Theming</h1>
          <p className="mt-2 text-slate-500 font-light">Customize the look and feel of FlowBoard for your white-label experience.</p>
        </div>
        <div className="px-3 py-1 bg-amber-100 text-amber-700 text-xs uppercase tracking-wider rounded-full border border-amber-200">
          White Label Active
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Configuration Column */}
        <div className="space-y-6">
          
          {/* Brand Identity */}
          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800  p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg text-indigo-600 dark:text-indigo-400">
                <ImageIcon className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-medium text-slate-800 dark:text-slate-100">Logos & Icons</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Workspace Logo</label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700 overflow-hidden">
                    {logoUrl ? (
                      <img src={logoUrl} alt="Logo" className="w-full h-full object-contain p-2" />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-slate-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <input 
                      type="text" 
                      placeholder="Paste image URL..." 
                      value={logoUrl}
                      onChange={(e) => setLogoUrl(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
                    />
                    <p className="text-xs text-slate-400 mt-1">Accepts PNG, SVG, JPG. Recommended size: 200x50px.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Color & Typography */}
          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800  p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-pink-50 dark:bg-pink-900/20 rounded-lg text-pink-600 dark:text-pink-400">
                <Palette className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-medium text-slate-800 dark:text-slate-100">Appearance</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Primary Accent Color</label>
                <div className="flex items-center gap-3">
                  <input 
                    type="color" 
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-10 h-10 rounded overflow-hidden cursor-pointer border-0 p-0"
                  />
                  <input 
                    type="text" 
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-32 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm font-mono uppercase focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

               <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Typography</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Inter', 'Roboto', 'Outfit', 'Merriweather'].map((f) => (
                    <button
                      key={f}
                      onClick={() => setFont(f.toLowerCase())}
                      className={`px-3 py-2 rounded-lg border text-sm text-left transition-all ${
                        font === f.toLowerCase() 
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300' 
                          : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Custom Domain */}
          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800  p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg text-emerald-600 dark:text-emerald-400">
                <Globe className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-medium text-slate-800 dark:text-slate-100">Custom Domain</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Workspace Subdomain</label>
                <div className="flex items-center">
                  <input 
                    type="text" 
                    value={subdomain}
                    onChange={(e) => setSubdomain(e.target.value)}
                    className="flex-1 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-l-lg px-3 py-2 text-sm text-right focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                  <span className="bg-slate-100 dark:bg-slate-800 border-l-0 border border-slate-200 dark:border-slate-700 rounded-r-lg px-3 py-2 text-sm text-slate-500 dark:text-slate-400">
                    .flowboard.com
                  </span>
                </div>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded border border-dashed border-slate-300 dark:border-slate-700 text-xs text-slate-500">
                <p>Enterprise users can also map a full custom domain (CNAME) like <span className="font-mono text-slate-700 dark:text-slate-300">tasks.acme.com</span> via DNS settings.</p>
              </div>
            </div>
          </section>

        </div>

        {/* Live Preview Column */}
        <div className="sticky top-8">
           <div className="flex items-center justify-between mb-4">
             <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest">Live Preview</h3>
             <button onClick={() => setShowPreview(!showPreview)} className="text-xs text-indigo-500 hover:text-indigo-600">
                {showPreview ? "Hide Preview" : "Show Preview"}
             </button>
           </div>
           
           <motion.div 
             layout
             className="w-full aspect-[4/3] bg-slate-100 dark:bg-black rounded-lg border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden relative group"
           >
              {/* Simulated UI */}
              <div className="absolute inset-0 bg-white dark:bg-slate-900 flex" style={{ fontFamily: font === 'inter' ? 'sans-serif' : font }}>
                  {/* Sidebar */}
                  <div className="w-16 border-r border-slate-200 dark:border-slate-800 flex flex-col items-center py-4 gap-4 bg-slate-50 dark:bg-slate-800/50">
                     <div className="w-8 h-8 rounded bg-slate-200 dark:bg-slate-700 overflow-hidden flex items-center justify-center">
                        {logoUrl ? <img src={logoUrl} className="w-full h-full object-cover" /> : <Sparkles className="w-4 h-4 text-slate-400" />}
                     </div>
                     <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 mt-auto"></div>
                  </div>
                  
                  {/* Main Content */}
                  <div className="flex-1 p-6">
                      <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded mb-6"></div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-6">
                          <div className="h-24 bg-slate-50 dark:bg-slate-800 rounded border border-slate-100 dark:border-slate-700 p-4 relative overflow-hidden">
                              <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: primaryColor }}></div>
                              <div className="h-3 w-20 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
                              <div className="h-8 w-12 bg-slate-100 dark:bg-slate-800 rounded"></div>
                          </div>
                           <div className="h-24 bg-slate-50 dark:bg-slate-800 rounded border border-slate-100 dark:border-slate-700 p-4">
                              <div className="h-3 w-20 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
                           </div>
                      </div>

                      <button 
                        className="px-4 py-2 text-xs font-medium text-white rounded shadow-sm transition-all"
                        style={{ backgroundColor: primaryColor }}
                      >
                        Create New Project
                      </button>
                  </div>
              </div>

               {/* Watermark overlay */}
               <div className="absolute bottom-2 right-2 text-[10px] text-slate-400 opacity-50 pointer-events-none">
                  Powered by FlowBoard
               </div>
           </motion.div>
        </div>

      </div>

      <div className="fixed bottom-0 left-0 w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-4 px-8 flex justify-end items-center z-50">
          <button className="px-6 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-medium rounded-lg hover:opacity-90 transition-opacity">
              Publish Branding Changes
          </button>
      </div>

    </div>
  );
}
