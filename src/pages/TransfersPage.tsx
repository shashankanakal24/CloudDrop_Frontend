import React, { useState, useEffect } from 'react';
import { FileList } from '../components/FileList';
import { FileRecord } from '../types';
import { api } from '../services/api';
import { Link } from '../router';
import { UploadCloud, ArrowLeft, RefreshCw, HardDrive } from 'lucide-react';

export const TransfersPage: React.FC = () => {
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchFiles = async () => {
    try {
      setIsLoading(true);
      const data = await api.listFiles();
      setFiles(data);
    } catch (err) {
      console.warn('Failed to load transfers:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              to="/"
              className="text-xs text-slate-400 hover:text-white inline-flex items-center gap-1 transition-colors"
            >
              <ArrowLeft size={13} />
              <span>Back to Upload</span>
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <HardDrive size={24} className="text-blue-500" />
            <span>Active Transfers Dashboard</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage your uploaded files, monitor access logs, and track link expiration in real-time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs px-4 py-2 rounded-xl shadow-lg shadow-blue-600/25 transition-all"
          >
            <UploadCloud size={15} />
            <span>New Transfer</span>
          </Link>
        </div>
      </div>

      {/* File List Table Component */}
      <FileList
        files={files}
        isLoading={isLoading}
        onRefresh={fetchFiles}
      />
    </div>
  );
};

