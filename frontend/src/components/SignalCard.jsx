// src/components/SignalCard.jsx
import React from 'react';

const SignalCard = ({ signal, satellites, flightTimeSeconds }) => {
  const signalText = signal <= -70 ? 'Weak' : signal <= -50 ? 'Moderate' : 'Strong';
  const signalColor = signalText === 'Strong' ? 'text-green-400' : signalText === 'Moderate' ? 'text-yellow-400' : 'text-red-400';
  
  // Format seconds to MM:SS
  const minutes = Math.floor(flightTimeSeconds / 60);
  const seconds = flightTimeSeconds % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <div className="space-y-4 h-full flex flex-col">
      {/* Satellites */}
      <div className="bg-card-bg border border-border rounded-xl p-4 shadow-xl flex-1 min-h-[100px]">
        <div className="flex items-center text-sm font-semibold text-text-secondary mb-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zM12 4a8 8 0 00-8 8h16a8 8 0 00-8-8z" /></svg>
          <span className="ml-2 uppercase tracking-wider">Satellites</span>
        </div>
        <div className="metric-value flex items-baseline">
          {satellites} 
          <span className="text-xl font-normal ml-1 text-text-secondary">GPS</span>
        </div>
        <div className="text-sm text-green-400 font-medium mt-1">
          GPS Lock
        </div>
      </div>

      {/* Signal */}
      <div className="bg-card-bg border border-border rounded-xl p-4 shadow-xl flex-1 min-h-[100px]">
        <div className="flex items-center text-sm font-semibold text-text-secondary mb-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5v14" /></svg>
          <span className="ml-2 uppercase tracking-wider">Signal</span>
        </div>
        <div className={`metric-value ${signalColor} font-mono`}>
          {signal.toFixed(2)} 
          <span className="text-xl font-normal ml-1 text-text-secondary">dBm</span>
        </div>
        <div className={`text-sm ${signalColor} font-medium mt-1`}>
          {signalText}
        </div>
      </div>

      {/* Flight Time */}
      <div className="bg-card-bg border border-border rounded-xl p-4 shadow-xl flex-1 min-h-[100px]">
        <div className="flex items-center text-sm font-semibold text-text-secondary mb-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span className="ml-2 uppercase tracking-wider">Flight Time</span>
        </div>
        <div className="metric-value">
          {formattedTime}
        </div>
        <div className="text-sm text-text-secondary font-medium mt-1">
          Total airtime
        </div>
      </div>
    </div>
  );
};

export default SignalCard;