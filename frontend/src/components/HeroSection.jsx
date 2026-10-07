import React from 'react';
import {
  Sparkles,
  Navigation,
  Route,
  Percent,
  Hotel,
  Utensils,
  ArrowRight,
  Compass
} from 'lucide-react';
import { PRESET_TRIPS } from '../constants/presets';

const FEATURES = [
  {
    icon: <Route size={20} />,
    color: { bg: 'rgba(14,165,233,0.14)', text: '#38BDF8' },
    title: 'Geodesic Distance',
    desc: 'Real geographic distance calculations using geocoding algorithms.'
  },
  {
    icon: <Percent size={20} />,
    color: { bg: 'rgba(99,102,241,0.14)', text: '#818CF8' },
    title: 'Age & Senior Rules',
    desc: 'Kids under 10 ride free on bus/train, seniors get 25% off automatically.'
  },
  {
    icon: <Hotel size={20} />,
    color: { bg: 'rgba(16,185,129,0.14)', text: '#34D399' },
    title: 'Hotels & Rooms',
    desc: 'Verified accommodations from RK to 2BHK suites with multi-night logic.'
  },
  {
    icon: <Utensils size={20} />,
    color: { bg: 'rgba(245,158,11,0.14)', text: '#FBBF24' },
    title: 'Culinary & Dining',
    desc: 'Authentic regional cuisines (Maharashtrian, Punjabi, Gujarati, Chinese).'
  }
];

export function HeroSection({ onStartPlanner, onLoadPreset, onOpenCatalogs }) {
  return (
    <section className="hero-section">
      <div className="container">

        {/* Eyebrow pill */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 0 }}>
          <div className="hero-pill">
            <Sparkles size={14} />
            Smart Route & Budget Engine • Powered by FastAPI
          </div>
        </div>

        {/* Main title */}
        <h1 className="hero-title">
          Plan Multi-City Trips<br />
          <span className="gradient-text">Accurately & Intelligently</span>
        </h1>

        {/* Subtitle */}
        <p className="hero-subtitle">
          Design custom multi-destination itineraries across Maharashtra and India.
          Calculate geodesic distances, apply intelligent passenger discounts,
          handpick luxury &amp; budget stays, and track every expense.
        </p>

        {/* CTA Group */}
        <div className="hero-cta-group">
          <button className="btn btn-primary btn-xl" onClick={onStartPlanner}>
            <Navigation size={20} />
            Launch Itinerary Planner
            <ArrowRight size={18} />
          </button>

          <button className="btn btn-secondary btn-lg" onClick={onOpenCatalogs}>
            <Compass size={18} />
            Explore Catalogs
          </button>
        </div>

        {/* Feature highlights */}
        <div className="features-grid">
          {FEATURES.map((f) => (
            <div className="feature-mini-card" key={f.title}>
              <div
                className="feature-icon-box"
                style={{ background: f.color.bg, color: f.color.text }}
              >
                {f.icon}
              </div>
              <div>
                <h4>{f.title}</h4>
                <p>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Preset Itineraries */}
        <div className="preset-section">
          <div className="preset-section-header">
            <div>
              <h3>
                <span style={{ marginRight: 8 }}>🌟</span>
                Featured Ready-to-Plan Itineraries
              </h3>
              <p>
                Click any preset to instantly pre-fill all legs, passengers, hotels, and dining.
              </p>
            </div>
          </div>

          <div className="grid-cols-3">
            {PRESET_TRIPS.map((preset) => (
              <div
                key={preset.id}
                className="preset-card"
                onClick={() => onLoadPreset(preset)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && onLoadPreset(preset)}
              >
                <div>
                  <div className="preset-card-badges">
                    <span className="badge badge-cyan">
                      {preset.legs.length} {preset.legs.length === 1 ? 'Destination' : 'Destinations'}
                    </span>
                    <span className="badge badge-emerald">
                      ₹{preset.budget.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <h4 className="preset-card-title">{preset.name}</h4>
                  <p className="preset-card-tagline">{preset.tagline}</p>
                </div>

                <div className="preset-card-footer">
                  <span style={{ fontSize: '0.85rem', color: 'var(--primary-light)', fontWeight: 600 }}>
                    Load & Customize
                  </span>
                  <ArrowRight size={16} color="var(--primary-light)" />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
