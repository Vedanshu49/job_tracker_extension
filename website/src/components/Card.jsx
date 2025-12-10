import React from 'react';

export default function Card({ title, description, icon, href }) {
  return (
    <a 
      href={href}
      className="block p-6 bg-card border border-white/10 rounded-xl hover:-translate-y-1 hover:border-primary hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 group cursor-pointer h-full"
    >
      <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h2 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">
        {title}
      </h2>
      <p className="text-gray-400 text-sm leading-relaxed">
        {description}
      </p>
    </a>
  );
}