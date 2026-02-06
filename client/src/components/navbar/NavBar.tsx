import { useState, type PropsWithChildren } from "react";

const NavBar = ({ children }: PropsWithChildren) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <nav className="relative after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-white/10 w-full z-50">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-center">
          <div className="fixed top-0 left-0 z-10 flex items-center sm:hidden">
            <button
              type="button"
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              onClick={() => setMobileOpen((s) => !s)}
              className={`relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-white/5 focus:outline-2 focus:-outline-offset-1 focus:outline-indigo-500`}>
              <span className="absolute -inset-0.5"></span>
              <span className="sr-only">Open main menu</span>
              {/* hamburger icon - shown when closed */}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                data-slot="icon"
                aria-hidden="true"
                className={`size-6 ${mobileOpen ? "hidden" : ""}`}>
                <path d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {/* X icon - shown when open */}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                data-slot="icon"
                aria-hidden="true"
                className={`size-6 ${mobileOpen ? "" : "hidden"}`}>
                <path d="M6 18 18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
          <div className="flex items-center justify-center sm:items-stretch sm:justify-start">
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">{children}</div>
            </div>
          </div>
        </div>
      </div>
      {/* Mobile menu panel: fixed full-screen overlay that slides in from the left */}
      <div
        id="mobile-menu"
        aria-hidden={!mobileOpen}
        className={`sm:hidden fixed top-0 left-0 w-full h-full pt-10 bg-white/50 backdrop-blur-sm transform will-change-transform transition-transform duration-200 ease-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div
          className="space-y-1 px-2 pt-2 pb-3"
          onClick={() => setMobileOpen(false)}
        >
          {children}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
