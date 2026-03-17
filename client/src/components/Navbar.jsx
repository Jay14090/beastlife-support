import React from 'react';
import { NavLink } from 'react-router-dom';
import { useQueries } from '../hooks/useQueries';

const Navbar = () => {
  const { queries } = useQueries();
  const totalQueries = queries.length;

  return (
    <nav className="sticky top-0 z-50 bg-[#0B0F1A]/90 backdrop-blur-md border-b border-[#1E2D4A] px-6 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-8">
        <div className="flex items-center space-x-2 text-[#00C9A7]">
          <span className="text-2xl">🐾</span>
          <span className="font-['Outfit'] font-bold text-xl tracking-wider">BEASTLIFE</span>
        </div>
        <div className="hidden md:flex space-x-1 border border-[#1E2D4A] rounded-lg p-1 bg-[#141928]">
          <NavLink to="/dashboard" className={({isActive}) => `px-4 py-2 rounded-md transition-colors ${isActive ? 'bg-[#1E2D4A] text-[#DDE6F4]' : 'text-[#6B7FA3] hover:text-[#DDE6F4] hover:bg-[#1E2D4A]/50'}`}>Dashboard</NavLink>
          <NavLink to="/analyzer" className={({isActive}) => `px-4 py-2 rounded-md transition-colors ${isActive ? 'bg-[#1E2D4A] text-[#DDE6F4]' : 'text-[#6B7FA3] hover:text-[#DDE6F4] hover:bg-[#1E2D4A]/50'}`}>AI Analyzer</NavLink>
          <NavLink to="/feed" className={({isActive}) => `px-4 py-2 rounded-md transition-colors ${isActive ? 'bg-[#1E2D4A] text-[#DDE6F4]' : 'text-[#6B7FA3] hover:text-[#DDE6F4] hover:bg-[#1E2D4A]/50'}`}>Query Feed</NavLink>
          <NavLink to="/automation" className={({isActive}) => `px-4 py-2 rounded-md transition-colors ${isActive ? 'bg-[#1E2D4A] text-[#DDE6F4]' : 'text-[#6B7FA3] hover:text-[#DDE6F4] hover:bg-[#1E2D4A]/50'}`}>Automation Plan</NavLink>
        </div>
      </div>
      <div className="flex items-center space-x-6">
        <div className="flex flex-col items-end">
          <span className="text-xs text-[#6B7FA3] uppercase tracking-wider">Analyzed Queries</span>
          <span className="text-xl font-bold font-['Space_Mono']">{totalQueries}</span>
        </div>
        <div className="flex items-center space-x-2 px-3 py-1.5 bg-[#00C9A7]/10 rounded-full border border-[#00C9A7]/20">
          <div className="w-2 h-2 rounded-full bg-[#00C9A7] animate-pulse"></div>
          <span className="text-[#00C9A7] text-sm font-semibold tracking-wide">LIVE</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
