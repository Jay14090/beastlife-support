import React from 'react';

const categoryColors = {
  'Order Tracking': { bg: 'bg-[#3B82F6]/10', text: 'text-[#3B82F6]', border: 'border-[#3B82F6]/20' },
  'Delivery Delay': { bg: 'bg-[#F59E0B]/10', text: 'text-[#F59E0B]', border: 'border-[#F59E0B]/20' },
  'Refund Request': { bg: 'bg-[#F87171]/10', text: 'text-[#F87171]', border: 'border-[#F87171]/20' },
  'Product Complaint': { bg: 'bg-[#A78BFA]/10', text: 'text-[#A78BFA]', border: 'border-[#A78BFA]/20' },
  'General Query': { bg: 'bg-[#94A3B8]/10', text: 'text-[#94A3B8]', border: 'border-[#94A3B8]/20' },
  'Payment Failure': { bg: 'bg-[#FB923C]/10', text: 'text-[#FB923C]', border: 'border-[#FB923C]/20' },
  'Subscription Issue': { bg: 'bg-[#2DD4BF]/10', text: 'text-[#2DD4BF]', border: 'border-[#2DD4BF]/20' }
};

const CategoryBadge = ({ category }) => {
  const style = categoryColors[category] || categoryColors['General Query'];
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${style.bg} ${style.text} border ${style.border}`}>
      {category}
    </span>
  );
};

export default CategoryBadge;
