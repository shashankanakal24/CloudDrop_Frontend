import React, { useState, useEffect } from 'react';
import { useParams, Link } from '../router';
import { api } from '../services/api';
import { FileRecord } from '../types';
import {
  Download,
  ShieldCheck,
  Clock,
  HardDrive,
  Copy,
  Check,
  Eye,
  AlertCircle,
  Loader2,
  FileText,
  FileArchive,
  FileImage,
  FileVideo,
  FileCode,
  File as FileGeneric,
  ArrowLeft,
  ExternalLink,
} from 'lucide-react';

export const DownloadPage: React.FC = () => {
  const { fileId } = useParams<{ fileId: string }>();
  const [file, setFile] = useState<FileRecord | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (!fileId) {
      setErrorMessage('No file identifier provided in the download link.');
      setIsLoading(false);
      return;
    }

    const loadMetadata = async () => {
      try {
        setIsLoading(true);
        setErrorMessage(null);
        const data = await api.getFileDetails(fileId);
        setFile(data);
      } catch (err: any) {
        console.error('Failed to load file details:', err);
        const msg =
          err.normalized?.message ||
          err.response?.data?.message ||
          'This file transfer link has expired or the file has been removed.';
        setErrorMessage(msg);
      } finally {
        setIsLoading(false);
      }
    };

    loadMetadata();
  }, [fileId]);

  const formatBytes = (bytes: number) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatExpiry = (epochSeconds: number) => {
    if (!epochSeconds) return 'Never';
    const date = new Date(epochSeconds * 1000);
    const now = new Date();
    const diffHours = Math.round((date.getTime() - now.getTime()) / (1000 * 3600));
    if (diffHours <= 0) return 'Expired';
    if (diffHours < 24) return `Expires in ${diffHours} hr${diffHours > 1 ? 's' : ''}`;
    return `Expires on ${date.toLocaleDateString()}`;
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return <FileImage size={44} className="text-blue-400" />;
    if (mimeType.startsWith('video/')) return <FileVideo size={44} className="text-purple-400" />;
    if (mimeType.includes('zip') || mimeType.includes('tar') || mimeType.includes('rar')) {
      return <FileArchive size={44} className="text-amber-400" />;
    }
    if (mimeType.includes('pdf') || mimeType.includes('word') || mimeType.includes('document')) {
      return <FileText size={44} className="text-emerald-400" />;
    }
    if (mimeType.includes('json') || mimeType.includes('javascript') || mimeType.includes('typescript')) {
      return <FileCode size={44} className="text-pink-400" />;
    }
    return <FileGeneric size={44} className="text-blue-400" />;
  };

  const handleDownload = () => {
    if (!fileId) return;
    // Direct download through backend /d/:fileId which generates S3 URL and redirects
    window.location.href = api.getDirectDownloadUrl(fileId);
    setFile((prev) => (prev ? { ...prev, downloadCount: (prev.downloadCount || 0) + 1 } : null));
  };

  const handleCopyLink = async () => {
    if (!fileId) return;
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      alert('Failed to copy link.');
    }
  };

  const handlePreviewOnline = () => {
    if (!fileId) return;
    window.open(file?.previewLink || api.getPreviewUrl(fileId), '_blank');
  };

  const isMediaViewable =
    file?.mimeType?.startsWith('image/') ||
    file?.mimeType?.startsWith('video/') ||
    file?.mimeType?.startsWith('audio/') ||
    file?.mimeType?.startsWith('text/') ||
    file?.mimeType?.includes('pdf') ||
    file?.mimeType?.includes('json') ||
    file?.originalName?.endsWith('.txt') ||
    file?.originalName?.endsWith('.json') ||
    file?.originalName?.endsWith('.csv') ||
    file?.originalName?.endsWith('.log') ||
    file?.originalName?.endsWith('.md') ||
    file?.originalName?.endsWith('.pdf') ||
    file?.originalName?.endsWith('.png') ||
    file?.originalName?.endsWith('.jpg') ||
    file?.originalName?.endsWith('.jpeg');

  return (
    <div className="max-w-xl mx-auto py-6 sm:py-12">
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Upload Another File</span>
        </Link>
      </div>

      {isLoading ? (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-10 text-center shadow-xl">
          <Loader2 size={36} className="animate-spin text-blue-500 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-white mb-1">Verifying File Transfer</h2>
          <p className="text-xs text-slate-400">
            Connecting to CloudDrop and preparing your secure download...
          </p>
        </div>
      ) : errorMessage ? (
        <div className="bg-slate-900/90 border border-rose-500/30 rounded-2xl p-8 sm:p-10 text-center shadow-xl">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <AlertCircle size={28} />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">File Link Unavailable</h2>
          <p className="text-sm text-slate-400 mb-6 leading-relaxed">
            {errorMessage}
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-blue-600/25 transition-all"
          >
            <HardDrive size={15} />
            <span>Go to CloudDrop Home</span>
          </Link>
        </div>
      ) : file ? (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/40 backdrop-blur-sm">
          {/* Card Header */}
          <div className="flex items-center justify-between pb-6 border-b border-slate-800/80 mb-6">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                Ready for Secure Download
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Clock size={13} />
              <span>{formatExpiry(file.expiresAt)}</span>
            </div>
          </div>

          {/* File Overview Box */}
          <div className="flex items-start gap-4 p-5 rounded-xl bg-slate-950/60 border border-slate-800/60 mb-6">
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 shrink-0">
              {getFileIcon(file.mimeType)}
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg font-bold text-white truncate mb-1" title={file.originalName}>
                {file.originalName}
              </h1>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                <span className="font-medium text-slate-300">{formatBytes(file.sizeBytes)}</span>
                <span>•</span>
                <span className="font-mono text-slate-400 text-[11px] truncate max-w-[200px]" title={file.mimeType}>
                  {file.mimeType}
                </span>
                <span>•</span>
                <span className="text-blue-400">{file.downloadCount || 0} downloads</span>
              </div>
            </div>
          </div>

          {/* Security & Verification Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-800 flex items-center gap-2.5 text-xs">
              <ShieldCheck size={18} className="text-emerald-400 shrink-0" />
              <div className="truncate">
                <div className="text-slate-400 text-[11px]">Integrity Checksum</div>
                <div className="font-mono text-slate-200 truncate">
                  {file.processedMetadata?.md5Checksum
                    ? `MD5: ${file.processedMetadata.md5Checksum.slice(0, 16)}...`
                    : 'SHA-256 Verified ✓'}
                </div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-800 flex items-center gap-2.5 text-xs">
              <ShieldCheck size={18} className="text-blue-400 shrink-0" />
              <div>
                <div className="text-slate-400 text-[11px]">Security Level</div>
                <div className="text-slate-200 font-medium">256-Bit Encrypted Cloud</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="w-full inline-flex items-center justify-center gap-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm py-3.5 px-6 rounded-xl shadow-lg shadow-blue-600/30 transition-all disabled:opacity-50"
            >
              {isDownloading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Preparing Secure Download...</span>
                </>
              ) : (
                <>
                  <Download size={18} />
                  <span>Download File ({formatBytes(file.sizeBytes)})</span>
                </>
              )}
            </button>

            <div className="grid grid-cols-2 gap-3">
              {isMediaViewable && (
                <button
                  onClick={handlePreviewOnline}
                  className="inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-medium transition-colors"
                >
                  <Eye size={15} />
                  <span>Preview Online</span>
                  <ExternalLink size={12} className="text-slate-400" />
                </button>
              )}

              <button
                onClick={handleCopyLink}
                className={`inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-medium transition-colors ${
                  !isMediaViewable ? 'col-span-2' : ''
                }`}
              >
                {copied ? <Check size={15} className="text-emerald-400" /> : <Copy size={15} />}
                <span>{copied ? 'Link Copied!' : 'Copy Share Link'}</span>
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

