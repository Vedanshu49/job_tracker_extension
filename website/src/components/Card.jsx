import React from 'react';

export default function Card({ title, description, icon, href, client }) {
  return (
    <a 
      href={href}
      className="block h-full p-8 bg-[#1E293B] border border-white/10 rounded-3xl hover:-translate-y-2 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 group cursor-pointer"
    >
      <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
        {icon}
      </div>
      
      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors">
        {title}
      </h3>
      
      <p className="text-gray-400 text-sm leading-relaxed">
        {description}
      </p>
    </a>
  );
}