// src/components/Dashboard.jsx
// @disable react-compiler
import React, { useState, useEffect } from 'react';
import MetricCard from './MetricCard';
import MapDisplay from './MapDisplay';
import SignalCard from './SignalCard';


const initialTelemetry = {
  lat: 37.7749, 
  lon: -122.4194,
  alt: 0.0,
  speed: 0.0,
  battery: 100.0,
  heading: 0,
  signal: -75.0, 
  satellites: 0, 
  startTime: Date.now(),
};

const WS_URL = 'ws://localhost:4000'; 

const Dashboard = () => {
  const [telemetry, setTelemetry] = useState(initialTelemetry);
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');
  const [flightTime, setFlightTime] = useState(0);


  const connectWebSocket = () => {
  console.log('Attempting to connect to WS...');
  const ws = new WebSocket(WS_URL);

  ws.onopen = () => {
    setConnectionStatus('Connected');
    console.log('WebSocket connected');
  };

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);

      if (data.type === 'telemetry' && data.telemetry) {
        const tel = data.telemetry;
        
        setTelemetry(prev => ({
          ...prev,
          lat: tel.lat,
          lon: tel.lon,
          alt: tel.alt,
          speed: tel.speed,
          battery: tel.battery,
          heading: tel.heading,
          signal: (tel.lat % 0.01) * 1000 - 45,
          satellites: 9 + Math.floor(Math.abs(tel.lon % 0.01) * 1000) % 5,
        }));
      }
    } catch (e) {
      console.error('Failed to parse WS message:', e);
    }
  };

  ws.onclose = () => {
    setConnectionStatus('Disconnected');
    console.log('WebSocket disconnected. Reconnecting in 3s...');
    setTimeout(connectWebSocket, 3000);
  };

  ws.onerror = (err) => {
    console.error('WebSocket error:', err);
    ws.close();
  };
};



  useEffect(() => {
  connectWebSocket();
}, []);


  // Effect for Flight Time calculation (every second)
  useEffect(() => {
    const timer = setInterval(() => {
        setFlightTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);


  const isConnected = connectionStatus === 'Connected';


  return (
    <div className="max-w-7xl mx-auto p-4">
      
      {/* Header */}
      <header className="flex justify-between items-center py-4 mb-6 border-b border-border">
        <div className="flex items-center text-2xl font-bold text-primary-accent">
          <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          VyomGarud 
        </div>
        <div className="text-sm font-mono flex items-center">
        
          <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold ${isConnected ? 'bg-green-600/30 text-green-400' : 'bg-red-600/30 text-red-400'}`}>
            {connectionStatus}
          </span>
        </div>
      </header>
      
      {/* Top Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
        
        {/* Altitude */}
        <MetricCard
          title="Altitude"
          value={telemetry.alt.toFixed(1)}
          unit="m"
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10M10 7v10M16 7v10M20 7v10" /></svg>}
        />
        
        {/* Speed */}
        <MetricCard
          title="Speed"
          value={telemetry.speed.toFixed(1)}
          unit="m/s"
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l-2 2h-1a2 2 0 01-2-2V4a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2h-1l-2-2v13" /></svg>}
        />
        
        {/* Battery */}
        <MetricCard
          title="Battery"
          value={telemetry.battery.toFixed(1)}
          unit="%"
          colorClass={telemetry.battery < 20 ? 'text-red-400' : 'text-green-400'}
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 3h3a2 2 0 012 2v14a2 2 0 01-2 2h-3m-3 0H8a2 2 0 01-2-2V5a2 2 0 012-2h3m0 0V3m0 0h2m-2 0V3m2 0V3m-2 0V3" /></svg>}
        />

        {/* Heading */}
        <MetricCard
          title="Heading"
          value={telemetry.heading.toFixed(0)}
          unit="°"
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>}
        />
        
        {/* Satellites - Using MetricCard for consistent layout */}
        <MetricCard
          title="GPS"
          value={telemetry.satellites}
          unit="Sats"
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" /></svg>}
        />

        {/* Flight Time (Placeholder - will use the dedicated card later) */}
        <MetricCard
          title="Time"
          value={String(Math.floor(flightTime / 60)).padStart(2, '0')}
          unit={`:${String(flightTime % 60).padStart(2, '0')}`}
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
      </div>

      {/* Main Content Area (Map, Signal, Time) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[60vh] min-h-[400px]">
        
        {/* Position / Map */}
        <div className="md:col-span-2">
          <MapDisplay lat={telemetry.lat} lon={telemetry.lon} />
        </div>
        
        {/* Signal, Satellites, Flight Time */}
        <SignalCard
          signal={telemetry.signal}
          satellites={telemetry.satellites}
          flightTimeSeconds={flightTime}
        />
      </div>

    </div>
  );
};

export default Dashboard;