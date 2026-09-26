import React, { useState, useEffect } from 'react';
import { Plane, Compass, Sparkles } from 'lucide-react';

const LOADING_STEPS = [
  'Connecting to FastAPI calculation engine...',
  'Geocoding source and destination coordinates...',
  'Computing geodesic distance matrix...',
  'Applying child & senior citizen fare rules...',
  'Optimizing hotel stays and room occupancies...',
  'Aggregating dining selections and taxes...',
  'Formatting day-by-day multi-destination schedule...',
  'Finalizing total trip budget dashboard...'
];

export function LoadingOverlay({ isVisible, message = 'Generating your custom itinerary...' }) {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (!isVisible) {
      setStepIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % LOADING_STEPS.length);
    }, 1200);

    return () => clearInterval(interval);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="loading-overlay">
      <div className="loading-card animate-fade-in">
        <div className="airplane-spinner">
          <Plane size={36} />
        </div>
        
        <h3 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>
          {message}
        </h3>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#38BDF8', fontSize: '0.95rem', margin: '12px 0 20px', minHeight: '26px' }}>
          <Sparkles size={18} className="animate-spin-slow" />
          <span>{LOADING_STEPS[stepIndex]}</span>
        </div>

        <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '99px', overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              background: 'linear-gradient(90deg, #0EA5E9, #6366F1, #10B981)',
              borderRadius: '99px',
              width: `${Math.min(100, ((stepIndex + 1) / LOADING_STEPS.length) * 100)}%`,
              transition: 'width 0.4s ease'
            }}
          />
        </div>

        <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '14px' }}>
          Running live calculations via FastAPI backend
        </p>
      </div>
    </div>
  );
}
