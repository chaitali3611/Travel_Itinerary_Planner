import React from 'react';
import { X, Sparkles, MapPin, ArrowRight, Check } from 'lucide-react';
import { PRESET_TRIPS } from '../../constants/presets';

export function PresetsModal({ isOpen, onClose, onLoadPreset }) {
  if (!isOpen) return null;

  return (
    <div className="loading-overlay" style={{ zIndex: 1100 }}>
      <div 
        className="glass-panel-elevated animate-fade-in"
        style={{
          maxWidth: '850px',
          width: '100%',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          background: 'var(--bg-card-solid)'
        }}
      >
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.15)', color: '#FBBF24', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem' }}>Curated Itinerary Presets</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Select an itinerary to prefill multi-city destinations, hotel stays, and dining</p>
            </div>
          </div>

          <button
            type="button"
            className="btn-secondary btn-sm"
            onClick={onClose}
            style={{ borderRadius: '50%', padding: '6px 10px' }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {PRESET_TRIPS.map((preset) => (
            <div
              key={preset.id}
              className="preset-card"
              style={{ padding: '20px' }}
              onClick={() => {
                onLoadPreset(preset);
                onClose();
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span className="badge badge-cyan">{preset.legs.length} Destination Legs</span>
                <span className="badge badge-emerald">Budget: ₹{preset.budget.toLocaleString('en-IN')}</span>
              </div>

              <h4 style={{ fontSize: '1.2rem', marginBottom: '6px' }}>{preset.name}</h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '16px' }}>{preset.tagline}</p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', padding: '10px 14px', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.03)', fontSize: '0.82rem' }}>
                {preset.legs.map((leg, i) => (
                  <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={13} color="#0EA5E9" />
                    <strong>{leg.source_city}</strong> ➔ <strong>{leg.destination_city}</strong> ({leg.travel_mode.toUpperCase()})
                  </span>
                ))}
              </div>

              <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px', color: '#38BDF8', fontWeight: 600, fontSize: '0.9rem' }}>
                <span>Load & Plan This Trip</span>
                <ArrowRight size={16} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
