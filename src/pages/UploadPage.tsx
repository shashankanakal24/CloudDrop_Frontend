import React, { useState, useEffect } from 'react';
import { FileUploader } from '../components/FileUploader';
import { FileList } from '../components/FileList';
import { FileRecord } from '../types';
import { api } from '../services/api';
import { Link } from '../router';
import { ArrowRight, Layers, Zap, Clock, Sparkles } from 'lucide-react';

export const UploadPage: React.FC = () => {
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchFiles = async () => {
    try {
      setIsLoading(true);
      const data = await api.listFiles();
      setFiles(data);
    } catch (err) {
      console.warn('Could not fetch active files:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div className="space-y-10">
      {/* Hero Header */}
      <section className="text-center pt-2 sm:pt-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-4">
          <Sparkles size={13} />
          <span>Simple, Fast & Secure File Sharing</span>
        </div>
        <div className="w-full text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-normal pt-1 pb-3 mb-3 bg-gradient-to-r from-blue-400 via-indigo-300 to-pink-400 bg-clip-text text-transparent inline-block">
            Send Big Files in Seconds
          </h1>
        </div>
        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Transfer high-resolution videos, large archives, presentations, and documents up to 5 GB. Generate instant, self-destructing links with total privacy protection.
        </p>
      </section>

      {/* Main Upload Card */}
      <div className="relative z-30">
        <FileUploader onUploadSuccess={fetchFiles} />
      </div>

      {/* What CloudDrop Does - Marketing Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 hover:border-slate-700 transition-colors">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center mb-3">
            <Zap size={20} />
          </div>
          <h3 className="font-semibold text-white text-sm mb-1">Lightning-Fast Transfers</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Send high-resolution media, datasets, and archives up to 5 GB with blazing upload speeds and zero wait times.
          </p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 hover:border-slate-700 transition-colors">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
            <Clock size={20} />
          </div>
          <h3 className="font-semibold text-white text-sm mb-1">Self-Destructing Links</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Choose when your transfer expires—from 1 hour to 7 days. Once expired, files are permanently deleted.
          </p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 hover:border-slate-700 transition-colors">
          <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center mb-3">
            <Layers size={20} />
          </div>
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-white text-sm">Real-Time Control</h3>
            <Link
              to="/transfers"
              className="text-xs text-blue-400 hover:text-blue-300 font-medium inline-flex items-center gap-1"
            >
              <span>Dashboard</span>
              <ArrowRight size={12} />
            </Link>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Monitor download counts, copy shareable links instantly, and revoke or delete files anytime with one click.
          </p>
        </div>
      </div>

      {/* Active Transfers Table on Home Page */}
      <div className="relative z-10 pt-2">
        <FileList
          files={files}
          isLoading={isLoading}
          onRefresh={fetchFiles}
        />
      </div>
    </div>
  );
};
