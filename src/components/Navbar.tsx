import React from 'react';
import { Cloud, ShieldCheck, UploadCloud, HardDrive } from 'lucide-react';
import { Link, NavLink } from '../router';

interface NavbarProps {
  systemStatus: string;
}

export const Navbar: React.FC<NavbarProps> = ({ systemStatus }) => {
  return (
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

        {/* Status Indicators */}
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
            <span
              className={`w-2 h-2 rounded-full ${
                systemStatus === 'UP'
                  ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]'
                  : 'bg-amber-400'
              }`}
            ></span>
            <span>{systemStatus === 'UP' ? 'System Operational' : 'Connecting...'}</span>
          </div>

          <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-400">
            <ShieldCheck size={16} className="text-emerald-400" />
            <span>256-bit Encrypted</span>
          </div>
        </div>
      </div>
    </nav>
  );
};
