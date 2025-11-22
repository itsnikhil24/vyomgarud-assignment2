// src/components/MetricCard.jsx
import React from 'react';

const MetricCard = ({ title, value, unit, icon, colorClass = 'text-primary-accent' }) => {
  return (
    <div className="bg-card-bg border border-border rounded-xl p-4 flex flex-col justify-between shadow-xl">
      <div className="flex items-center text-sm font-semibold text-text-secondary mb-2">
        {icon}
        <span className="ml-2 uppercase tracking-wider">{title}</span>
      </div>
      <div className={`${colorClass} metric-value`}>
        {value}
        <span className="text-xl font-normal ml-1 text-text-secondary">{unit}</span>
      </div>
    </div>
  );
};

export default MetricCard;