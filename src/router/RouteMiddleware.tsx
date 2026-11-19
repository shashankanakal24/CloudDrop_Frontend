import React, { useEffect, ReactNode } from 'react';
import { useLocation, useParams } from './Router';

export interface RouteMiddlewareProps {
  children: ReactNode;
}

/**
 * Route Middleware (Navigation Guard & Page Lifecycle Interceptor)
 * Intercepts route changes to:
 * 1. Scroll window smoothly to top
 * 2. Set dynamic document title based on current route
 * 3. Log navigation events for debugging and client analytics
 */
export const RouteMiddleware: React.FC<RouteMiddlewareProps> = ({ children }) => {
  const location = useLocation();
  const params = useParams<{ fileId?: string }>();

  useEffect(() => {
    // 1. Scroll window to top on route change
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // 2. Set dynamic page title
    const pathname = location.pathname;

    if (pathname === '/' || pathname === '/upload') {
      document.title = 'CloudDrop | Send & Share Large Files';
    } else if (pathname === '/transfers' || pathname === '/files') {
      document.title = 'CloudDrop | Active Transfers Dashboard';
    } else if (pathname.startsWith('/download/') || pathname.startsWith('/d/') || pathname.startsWith('/f/')) {
      document.title = 'CloudDrop | Secure File Download';
    } else {
      document.title = 'CloudDrop | Intelligent File Transfer';
    }

    // 3. Navigation logging
    if (import.meta.env.DEV) {
      console.debug(`[Navigation Guard] Route changed to: ${pathname}`, params);
    }
  }, [location.pathname, params]);

  return <>{children}</>;
};

