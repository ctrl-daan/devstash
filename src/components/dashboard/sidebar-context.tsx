"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

interface SidebarContextValue {
  /** Whether the sidebar is currently shown. */
  isOpen: boolean;
  /** True when the viewport is at mobile width (sidebar becomes an overlay drawer). */
  isMobile: boolean;
  toggle: () => void;
  close: () => void;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

export function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return ctx;
}

// Matches Tailwind's `md` breakpoint — below this the sidebar is a drawer.
const MOBILE_QUERY = "(max-width: 767px)";

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  // Keep `isMobile` in sync with the viewport, and reset the open state to the
  // sensible default whenever we cross the breakpoint (open on desktop, closed
  // as a drawer on mobile).
  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);
    const apply = () => {
      setIsMobile(mq.matches);
      setIsOpen(!mq.matches);
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const toggle = useCallback(() => setIsOpen((o) => !o), []);
  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo(
    () => ({ isOpen, isMobile, toggle, close }),
    [isOpen, isMobile, toggle, close],
  );

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
}