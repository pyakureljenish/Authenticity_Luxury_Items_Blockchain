"use client";

import { FC } from "react";

interface CardProps {
  title: string;
  description: string;
}

const Card: FC<CardProps> = ({ title, description }) => {
  return (
    <div className="rounded-lg border bg-white text-card-foreground shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 cursor-pointer">
      <div className="flex flex-col space-y-1.5 p-6">
        <h3 className="text-2xl font-semibold leading-none tracking-tight font-sans">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground font-sans">{description}</p>
      </div>
    </div>
  );
};

export default Card;
