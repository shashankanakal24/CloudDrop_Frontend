import React, { useState } from 'react';
import { Cloud, ShieldCheck, UploadCloud, HardDrive, Server, Settings, Check, X, RotateCcw } from 'lucide-react';
import { Link, NavLink } from '../router';
import { getApiBase, setCustomApiUrl } from '../services/api';

interface NavbarProps {
  systemStatus: string;
}

export const Navbar: React.FC<NavbarProps> = ({ systemStatus }) => {
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const currentApiUrl = getApiBase();
  const [inputUrl, setInputUrl] = useState(currentApiUrl);

  const handleSaveUrl = (e: React.FormEvent) => {
    e.preventDefault();
    setCustomApiUrl(inputUrl);
  };

  const handleReset = () => {
    setCustomApiUrl(null);
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-slate-900/85 backdrop-blur-md border-b border-slate-800/80 py-3">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-white hover:opacity-95 transition-opacity"
            >
              <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-2 rounded-xl shadow-lg shadow-blue-500/25 flex items-center justify-center">
                <Cloud size={20} className="text-white" />
              </div>
              <span>CloudDrop</span>
            </Link>

            {/* Navigation Links with Active Highlighting */}
            <div className="hidden sm:flex items-center gap-1.5 bg-slate-950/60 border border-slate-800/80 p-1 rounded-xl text-xs font-medium">
              <NavLink
                to="/"
                className="px-3.5 py-1.5 rounded-lg text-slate-400 hover:text-white transition-all flex items-center gap-1.5"
                activeClassName="bg-blue-600 text-white shadow-sm font-semibold"
              >
                <UploadCloud size={14} />
                <span>Send Files</span>
              </NavLink>

              <NavLink
                to="/transfers"
                className="px-3.5 py-1.5 rounded-lg text-slate-400 hover:text-white transition-all flex items-center gap-1.5"
                activeClassName="bg-blue-600 text-white shadow-sm font-semibold"
              >
                <HardDrive size={14} />
                <span>Active Transfers</span>
              </NavLink>
            </div>
          </div>

          {/* Status & EC2 Endpoint Switcher */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsConfigOpen(!isConfigOpen)}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 transition-all cursor-pointer group"
              title="Click to view or change backend EC2 IP address"
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  systemStatus === 'UP'
                    ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]'
                    : 'bg-amber-400 animate-pulse'
                }`}
              ></span>
              <span className="font-medium">
                {systemStatus === 'UP' ? 'Backend Online' : 'Connecting...'}
              </span>
              <Settings size={12} className="text-slate-400 group-hover:text-blue-400 transition-colors ml-0.5" />
            </button>

            <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-400">
              <ShieldCheck size={16} className="text-emerald-400" />
              <span>256-bit Encrypted</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Backend EC2 Endpoint Switcher Modal */}
      {isConfigOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-dropdown">
          <div className="w-full max-w-md bg-[#0f172a] border border-slate-700 rounded-2xl p-6 shadow-2xl ring-1 ring-slate-700/60 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2 text-white font-semibold text-sm">
                <Server size={18} className="text-blue-400" />
                <span>Backend EC2 Endpoint Configuration</span>
              </div>
              <button
                onClick={() => setIsConfigOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Whenever you stop and restart your EC2 instance and its public IP changes, you can paste the new IP here to connect immediately <strong className="text-slate-200">without rebuilding Amplify</strong>!
            </p>

            <form onSubmit={handleSaveUrl} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Backend API URL (EC2 IP or NLB DNS):
                </label>
                <input
                  type="text"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  placeholder="http://54.210.12.34:3000"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono"
                  required
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
                >
                  <RotateCcw size={13} />
                  <span>Reset to Default</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsConfigOpen(false)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-medium transition-colors shadow-lg shadow-blue-600/30"
                  >
                    <Check size={14} />
                    <span>Save & Connect</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
