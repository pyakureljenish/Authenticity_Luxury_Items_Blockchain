"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useWeb3 } from "@/contexts/Web3Context";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { connect, connecting, isConnected, account } = useWeb3();

  useEffect(() => {
    setIsMounted(true);
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent hydration mismatch by not rendering until mounted
  if (!isMounted) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 font-sans w-full py-6 bg-[rgb(245,245,240)]">
        <div className="max-w-8xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="text-2xl font-medium tracking-tight text-luxury-black font-sans"
            >
              LUXE VERIFY
            </Link>
            <div className="flex items-center space-x-8">
              <div className="h-10 w-32" /> {/* Placeholder for button */}
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 font-sans w-full ${
        isScrolled
          ? "glass-panel py-4 bg-[rgb(245,245,240)]/80 backdrop-blur-sm"
          : "py-6 bg-[rgb(245,245,240)]"
      }`}
    >
      <div className="max-w-8xl mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="text-2xl font-medium tracking-tight text-luxury-black hover:text-luxury-gold transition-colors font-sans"
          >
            LUXE VERIFY
          </Link>
          <div className="flex items-center space-x-8">
            <Link
              href="/buyers"
              className="text-sm font-medium text-luxury-black hover:text-luxury-gold transition-colors font-sans"
            >
              FOR BUYERS
            </Link>
            <Link
              href="/sellers"
              className="text-sm font-medium text-luxury-black hover:text-luxury-gold transition-colors font-sans"
            >
              FOR SELLERS
            </Link>
            <button
              onClick={connect}
              disabled={connecting || isConnected}
              className="px-6 py-2 bg-luxury-black text-white text-sm font-medium rounded-full hover:bg-light-black transition-all disabled:opacity-50 disabled:cursor-not-allowed font-sans"
            >
              {connecting
                ? "Connecting..."
                : isConnected
                ? `Connected: ${account?.slice(0, 6)}...${account?.slice(-4)}`
                : "Connect Wallet"}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
