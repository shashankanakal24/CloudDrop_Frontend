import React from 'react';
import { Cloud, Mail } from 'lucide-react';
import { Link } from '../router';

export const Navbar: React.FC = () => {
  return (
    <nav className="sticky top-0 z-50 bg-slate-900/85 backdrop-blur-md border-b border-slate-800/80 py-3.5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Brand Logo only on left */}
        <Link
          to="/"
          className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-white hover:opacity-95 transition-opacity"
        >
          <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-2 rounded-xl shadow-lg shadow-blue-500/25 flex items-center justify-center">
            <Cloud size={20} className="text-white" />
          </div>
          <span>CloudDrop</span>
        </Link>

        {/* Only Contact Us Button on top right */}
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-600/25 transition-all cursor-pointer"
        >
          <Mail size={14} />
          <span>Contact Us</span>
        </Link>
      </div>
    </nav>
  );
};
