import React from 'react';

const MetricCard = ({ title, value, subtitle }) => {
  return (
    <div className="bg-[#141928] border border-[#1E2D4A] rounded-xl p-5 flex flex-col justify-between shadow-sm">
      <h3 className="text-[#6B7FA3] text-sm font-semibold tracking-wide uppercase">{title}</h3>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-3xl font-bold text-[#DDE6F4]">{value}</span>
        {subtitle && <span className="text-sm font-medium text-[#00C9A7] bg-[#00C9A7]/10 px-2 py-0.5 rounded-md">{subtitle}</span>}
      </div>
    </div>
  );
};

export default MetricCard;
