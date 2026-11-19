import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, RouteMiddleware, ErrorBoundary } from './router';
import { Navbar } from './components/Navbar';
import { UploadPage } from './pages/UploadPage';
import { TransfersPage } from './pages/TransfersPage';
import { DownloadPage } from './pages/DownloadPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { api } from './services/api';

export const App: React.FC = () => {
  const [systemStatus, setSystemStatus] = useState<string>('UP');

  const checkHealth = async () => {
    try {
      const res = await api.getHealth();
      setSystemStatus(res.status || 'UP');
    } catch {
      setSystemStatus('UP');
    }
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <RouteMiddleware>
          <div className="min-h-screen bg-[#0b0f19] text-gray-100 flex flex-col selection:bg-blue-600/30 selection:text-white">
            <Navbar systemStatus={systemStatus} />

            <main className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-10 flex-1">
              <Routes>
                {/* 1. Main Send / Upload Page */}
                <Route path="/" element={<UploadPage />} />
                <Route path="/upload" element={<UploadPage />} />

                {/* 2. Active Transfers Dashboard */}
                <Route path="/transfers" element={<TransfersPage />} />
                <Route path="/files" element={<TransfersPage />} />

                {/* 3. Dedicated Recipient File Download & Preview Pages */}
                <Route path="/download/:fileId" element={<DownloadPage />} />
                <Route path="/d/:fileId" element={<DownloadPage />} />
                <Route path="/f/:fileId" element={<DownloadPage />} />

                {/* 4. Client-side 404 Fallback */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>

            <footer className="border-t border-slate-800/60 py-6 text-center text-xs text-slate-500">
              <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
                <p>© 2026 CloudDrop Platform. Secure Cloud Storage & File Distribution.</p>
                <div className="flex items-center gap-4 text-[11px] text-slate-500">
                  <span>S3 Direct Upload</span>
                  <span>•</span>
                  <span>Lambda Verification</span>
                  <span>•</span>
                  <span>DynamoDB Index</span>
                </div>
              </div>
            </footer>
          </div>
        </RouteMiddleware>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;
