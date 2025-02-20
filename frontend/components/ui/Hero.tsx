"use client";

import { FC } from "react";
import Link from "next/link";

interface HeroProps {
  title: string;
  gradientText: string;
  description: string;
}

const Hero: FC<HeroProps> = ({ title, gradientText, description }) => {
  return (
    <section className="w-full bg-[rgb(245,245,240)] min-h-[55vh]">
      <div className="max-w-8xl mx-auto px-4 py-20 text-center">
        <h2 className="text-6xl font-bold mb-4 font-sans">
          {title}
          <br />
          <span className="text-gradient">{gradientText}</span>
        </h2>
        <p className="text-gray-600 mb-12 max-w-3xl mx-auto font-sans">
          {description}
        </p>
        <div className="flex justify-center gap-4">
          <button className="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 font-bold font-sans transform transition-all duration-300 hover:-translate-y-1 hover:scale-105 active:translate-y-0 active:scale-95">
            <Link href="/buyers">Start Shopping</Link>
          </button>
          <button className="border border-black px-8 py-3 rounded-full hover:bg-gray-50 font-bold font-sans transform transition-all duration-300 hover:-translate-y-1 hover:scale-105 active:translate-y-0 active:scale-95">
            <Link href="/sellers">Become a Seller</Link>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
