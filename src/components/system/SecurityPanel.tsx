"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Lock, Globe, Key, FileText, Download, Check, AlertTriangle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/Tooltip";
// Actually, I'll avoid complex imports and stick to basic HTML/CSS + Framer Motion for now to be safe, or just use standard HTML elements styled with Tailwind.

export default function SecurityPanel() {
  const [ssoEnabled, setSsoEnabled] = useState(false);
  const [domain, setDomain] = useState("acme.com");
  const [ssoProvider, setSsoProvider] = useState("google");
  const [enforce2FA, setEnforce2FA] = useState(false);
  const [ipAllowlist, setIpAllowlist] = useState("");

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-20">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-light text-slate-800 dark:text-slate-100">Enterprise Security</h1>
          <p className="mt-2 text-slate-500 font-light">Manage SSO, domain restrictions, and compliance controls.</p>
        </div>
        <div className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs uppercase tracking-wider rounded-full border border-emerald-200">
          Enterprise Plan Active
        </div>
      </div>

      {/* SSO Configuration */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800  p-8 shadow-sm">
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl text-indigo-600 dark:text-indigo-400">
            <Key className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-medium text-slate-800 dark:text-slate-100">Single Sign-On (SSO)</h2>
            <p className="text-slate-500 text-sm mt-1">Enable SAML or OAuth authentication for your workspace.</p>
          </div>
          <div className="ml-auto">
             <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={ssoEnabled} onChange={(e) => setSsoEnabled(e.target.checked)} className="sr-only peer" />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
            </label>
          </div>
        </div>

        {ssoEnabled && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="space-y-6 border-t border-slate-100 dark:border-slate-800 pt-6"
          >
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Identity Provider</label>
                <select 
                  value={ssoProvider}
                  onChange={(e) => setSsoProvider(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="google">Google Workspace</option>
                  <option value="azure-ad">Azure AD (Microsoft Entra ID)</option>
                  <option value="okta">Okta</option>
                  <option value="saml">Custom SAML 2.0</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Corporate Domain</label>
                <input 
                  type="text" 
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g. acme.com" 
                />
                <p className="text-xs text-slate-400 mt-1">Users with this email domain will be auto-joined.</p>
              </div>
            </div>

            {/* XML Configuration (Stub) */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">IdP Metadata XML</label>
              <textarea 
                className="w-full h-32 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 font-mono text-xs focus:ring-2 focus:ring-indigo-500"
                placeholder="Paste your XML metadata here..."
              ></textarea>
            </div>

            <div className="flex justify-end pt-2">
              <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors">
                Save SSO Configuration
              </button>
            </div>
          </motion.div>
        )}
      </section>

      {/* Domain Restrictions & Access */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800  p-8 shadow-sm">
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 bg-rose-50 dark:bg-rose-900/20 rounded-xl text-rose-600 dark:text-rose-400">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-medium text-slate-800 dark:text-slate-100">Access Control</h2>
            <p className="text-slate-500 text-sm mt-1">Restrict access by IP address and domain.</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">IP Allowlist (CIDR)</label>
            <input 
              type="text" 
              value={ipAllowlist}
              onChange={(e) => setIpAllowlist(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-rose-500 font-mono text-sm"
              placeholder="e.g. 192.168.1.0/24, 10.0.0.1" 
            />
            <p className="text-xs text-slate-400 mt-1">Separate multiple IP ranges with commas. Leave empty to allow from anywhere.</p>
          </div>

          <div className="flex items-center justify-between py-4 border-t border-slate-100 dark:border-slate-800">
            <div>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200">Enforce Workspace-Isolation</p>
              <p className="text-xs text-slate-500">Prevent users from creating personal projects outside this workspace.</p>
            </div>
             <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-rose-600"></div>
            </label>
          </div>
        </div>
      </section>

      {/* Compliance & Audit Logs */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800  p-8 shadow-sm">
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-600 dark:text-blue-400">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-medium text-slate-800 dark:text-slate-100">Audit Logs & Compliance</h2>
            <p className="text-slate-500 text-sm mt-1">Export activity logs for security auditing.</p>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Data Retention Policy</p>
                <p className="text-xs text-slate-500 mt-1">Audit logs are retained for 90 days on Enterprise.</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-sm font-medium rounded-lg transition-colors">
                <Download className="w-4 h-4" />
                Export CSV
            </button>
        </div>

        <div className="mt-6 space-y-4">
             <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <p className="text-sm text-slate-600 dark:text-slate-400 font-mono">2024-10-24 14:32:11 - User Login (SAML) - 192.168.1.42</p>
             </div>
             <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <p className="text-sm text-slate-600 dark:text-slate-400 font-mono">2024-10-24 13:15:05 - API Key Created - 10.0.0.5</p>
             </div>
             <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                <p className="text-sm text-slate-600 dark:text-slate-400 font-mono">2024-10-24 11:00:22 - Permisison Changed (Admin) - 10.0.0.1</p>
             </div>
        </div>
      </section>

      {/* SCIM Stub */}
      <section className="opacity-75 relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800  p-8 shadow-sm">
        <div className="absolute top-4 right-4 px-2 py-1 bg-slate-100 dark:bg-slate-800 text-xs font-semibold rounded text-slate-500">COMING SOON</div>
        <div className="flex items-start gap-4 opacity-50">
          <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl text-purple-600 dark:text-purple-400">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-medium text-slate-800 dark:text-slate-100">SCIM Provisioning</h2>
            <p className="text-slate-500 text-sm mt-1">Automated user lifecycle management via SCIM 2.0.</p>
          </div>
        </div>
      </section>

    </div>
  );
}
