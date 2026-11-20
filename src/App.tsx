import React from 'react';
import { BrowserRouter, Routes, Route, RouteMiddleware, ErrorBoundary } from './router';
import { Navbar } from './components/Navbar';
import { UploadPage } from './pages/UploadPage';
import { TransfersPage } from './pages/TransfersPage';
import { DownloadPage } from './pages/DownloadPage';
import { ContactPage } from './pages/ContactPage';
import { NotFoundPage } from './pages/NotFoundPage';

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <RouteMiddleware>
          <div className="min-h-screen bg-[#0b0f19] text-gray-100 flex flex-col selection:bg-blue-600/30 selection:text-white">
            <Navbar />

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

                {/* 4. Contact Us Page */}
                <Route path="/contact" element={<ContactPage />} />

                {/* 5. Client-side 404 Fallback */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>

            {/* Simple single copyright line */}
            <footer className="border-t border-slate-800/60 py-6 text-center text-xs text-slate-500">
              <p>© 2026 CloudDrop. All rights reserved.</p>
            </footer>
          </div>
        </RouteMiddleware>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;
