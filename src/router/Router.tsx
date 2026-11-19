import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';

export interface LocationState {
  pathname: string;
  search: string;
  hash: string;
}

export interface RouterContextValue {
  location: LocationState;
  navigate: (to: string, options?: { replace?: boolean }) => void;
  params: Record<string, string>;
}

const RouterContext = createContext<RouterContextValue | null>(null);

export function useLocation(): LocationState {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error('useLocation must be used within a <BrowserRouter>');
  return ctx.location;
}

export function useNavigate(): (to: string, options?: { replace?: boolean }) => void {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error('useNavigate must be used within a <BrowserRouter>');
  return ctx.navigate;
}

export function useParams<T extends Record<string, string>>(): T {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error('useParams must be used within a <BrowserRouter>');
  return ctx.params as T;
}

export interface BrowserRouterProps {
  children: ReactNode;
}

export const BrowserRouter: React.FC<BrowserRouterProps> = ({ children }) => {
  const [location, setLocation] = useState<LocationState>({
    pathname: window.location.pathname,
    search: window.location.search,
    hash: window.location.hash,
  });

  const [params, setParams] = useState<Record<string, string>>({});

  useEffect(() => {
    const handlePopState = () => {
      setLocation({
        pathname: window.location.pathname,
        search: window.location.search,
        hash: window.location.hash,
      });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (to: string, options?: { replace?: boolean }) => {
    if (options?.replace) {
      window.history.replaceState(null, '', to);
    } else {
      window.history.pushState(null, '', to);
    }

    const url = new URL(window.location.origin + to);
    setLocation({
      pathname: url.pathname,
      search: url.search,
      hash: url.hash,
    });
  };

  const contextValue = useMemo(
    () => ({ location, navigate, params }),
    [location, params],
  );

  return (
    <RouterContext.Provider value={{ ...contextValue, params }}>
      <ParamsUpdater setParams={setParams}>
        {children}
      </ParamsUpdater>
    </RouterContext.Provider>
  );
};

const ParamsUpdaterContext = createContext<((p: Record<string, string>) => void) | null>(null);

const ParamsUpdater: React.FC<{ children: ReactNode; setParams: (p: Record<string, string>) => void }> = ({
  children,
  setParams,
}) => {
  return (
    <ParamsUpdaterContext.Provider value={setParams}>
      {children}
    </ParamsUpdaterContext.Provider>
  );
};

export interface RouteProps {
  path: string;
  element: ReactNode;
}

export const Route: React.FC<RouteProps> = () => {
  return null; // Rendered by <Routes>
};

function matchPath(
  pattern: string,
  pathname: string,
): { match: boolean; params: Record<string, string> } {
  if (pattern === '*') return { match: true, params: {} };

  // Normalize
  const patternParts = pattern.split('/').filter(Boolean);
  const pathParts = pathname.split('/').filter(Boolean);

  if (patternParts.length !== pathParts.length) {
    return { match: false, params: {} };
  }

  const params: Record<string, string> = {};

  for (let i = 0; i < patternParts.length; i++) {
    const patternPart = patternParts[i];
    const pathPart = pathParts[i];

    if (patternPart.startsWith(':')) {
      const paramName = patternPart.slice(1);
      params[paramName] = decodeURIComponent(pathPart);
    } else if (patternPart.toLowerCase() !== pathPart.toLowerCase()) {
      return { match: false, params: {} };
    }
  }

  return { match: true, params };
}

export interface RoutesProps {
  children: ReactNode;
}

export const Routes: React.FC<RoutesProps> = ({ children }) => {
  const location = useLocation();
  const setParams = useContext(ParamsUpdaterContext);

  const matched = useMemo(() => {
    const childrenArray = React.Children.toArray(children) as React.ReactElement<RouteProps>[];
    let fallbackElement: ReactNode = null;

    for (const child of childrenArray) {
      if (!React.isValidElement(child)) continue;

      const { path, element } = child.props;
      if (path === '*') {
        fallbackElement = element;
        continue;
      }

      const { match, params } = matchPath(path, location.pathname);
      if (match) {
        return { element, params };
      }
    }

    return { element: fallbackElement, params: {} };
  }, [children, location.pathname]);

  useEffect(() => {
    if (setParams) {
      setParams(matched.params);
    }
  }, [matched.params, setParams]);

  return <>{matched.element}</>;
};

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
  replace?: boolean;
}

export const Link: React.FC<LinkProps> = ({ to, replace, onClick, children, ...rest }) => {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) onClick(e);

    // Don't intercept cmd/ctrl clicks or external URLs
    if (
      !e.defaultPrevented &&
      e.button === 0 &&
      !e.metaKey &&
      !e.altKey &&
      !e.ctrlKey &&
      !e.shiftKey &&
      !to.startsWith('http://') &&
      !to.startsWith('https://')
    ) {
      e.preventDefault();
      navigate(to, { replace });
    }
  };

  return (
    <a href={to} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
};

export interface NavLinkProps extends Omit<LinkProps, 'className'> {
  className?: string | ((props: { isActive: boolean }) => string);
  activeClassName?: string;
}

export const NavLink: React.FC<NavLinkProps> = ({
  to,
  className,
  activeClassName = 'bg-blue-600/15 text-blue-400 border border-blue-500/30',
  ...rest
}) => {
  const location = useLocation();
  const isActive = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));

  const resolvedClass =
    typeof className === 'function'
      ? className({ isActive })
      : `${className || ''} ${isActive ? activeClassName : ''}`.trim();

  return <Link to={to} className={resolvedClass} {...rest} />;
};
