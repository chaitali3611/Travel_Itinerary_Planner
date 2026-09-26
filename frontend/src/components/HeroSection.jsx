import React from 'react';
import { 
  Sparkles, 
  MapPin, 
  Navigation, 
  Hotel, 
  Utensils, 
  Users, 
  ShieldCheck, 
  ArrowRight, 
  Compass, 
  Route, 
  Percent, 
  TrendingUp 
} from 'lucide-react';
import { PRESET_TRIPS } from '../constants/presets';

export function HeroSection({ onStartPlanner, onLoadPreset, onOpenCatalogs }) {
  return (
    <section className="hero-section">
      <div className="container">
        {/* Pill Badge */}
        <div className="hero-pill">
          <Sparkles size={16} />
          <span>Smart Route & Budget Engine • Powered by FastAPI</span>
        </div>

        {/* Title */}
        <h1 className="hero-title">
          Plan Unforgettable Multi-City Trips <br />
          <span className="gradient-text">Accurately, Intelligently & Seamlessly</span>
        </h1>

        {/* Subtitle */}
        <p className="hero-subtitle">
          Design custom multi-destination itineraries across Maharashtra and India. 
          Calculate geodesic road & rail distances, apply intelligent passenger age & senior discounts, 
          handpick luxury & budget stays, curate culinary dining, and track expenses against your budget goals.
        </p>

        {/* Primary CTA Buttons */}
        <div className="hero-cta-group">
          <button className="btn btn-primary btn-lg" onClick={onStartPlanner}>
            <Navigation size={20} />
            <span>Launch Itinerary Planner</span>
            <ArrowRight size={18} />
          </button>
          
          <button className="btn btn-secondary btn-lg" onClick={onOpenCatalogs}>
            <Compass size={20} />
            <span>Explore City & Hotel Catalogs</span>
          </button>
        </div>

        {/* Feature Highlights Mini Grid */}
        <div className="features-grid">
          <div className="feature-mini-card">
            <div className="feature-icon-box" style={{ background: 'rgba(14, 165, 233, 0.15)', color: '#38BDF8' }}>
              <Route size={22} />
            </div>
            <div>
              <h4 style={{ fontSize: '1rem', marginBottom: '4px' }}>Geodesic Distance</h4>
              <p style={{ fontSize: '0.82rem' }}>Real geographic distance calculations using geocoding algorithms.</p>
            </div>
          </div>

          <div className="feature-mini-card">
            <div className="feature-icon-box" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818CF8' }}>
              <Percent size={22} />
            </div>
            <div>
              <h4 style={{ fontSize: '1rem', marginBottom: '4px' }}>Age & Senior Rules</h4>
              <p style={{ fontSize: '0.82rem' }}>Kids under 10 ride free on bus/train, and seniors receive 25% off automatically.</p>
            </div>
          </div>

          <div className="feature-mini-card">
            <div className="feature-icon-box" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34D399' }}>
              <Hotel size={22} />
            </div>
            <div>
              <h4 style={{ fontSize: '1rem', marginBottom: '4px' }}>Hotels & Rooms</h4>
              <p style={{ fontSize: '0.82rem' }}>Select verified accommodations from RK, 1BHK to 2BHK suites with multi-night stay logic.</p>
            </div>
          </div>

          <div className="feature-mini-card">
            <div className="feature-icon-box" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#FBBF24' }}>
              <Utensils size={22} />
            </div>
            <div>
              <h4 style={{ fontSize: '1rem', marginBottom: '4px' }}>Culinary & Dining</h4>
              <p style={{ fontSize: '0.82rem' }}>Authentic regional cuisines (Maharashtrian, Punjabi, Gujarati, Chinese) with real dish rates.</p>
            </div>
          </div>
        </div>

        {/* Preset Itineraries Section */}
        <div className="preset-section">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', textAlign: 'left' }}>
            <div>
              <h3 style={{ fontSize: '1.4rem' }}>
                🌟 Featured Ready-to-Plan Itineraries
              </h3>
              <p style={{ fontSize: '0.88rem' }}>Click any preset to instantly pre-fill all multi-destination legs, passengers, hotels, and dining!</p>
            </div>
          </div>

          <div className="grid-cols-3">
            {PRESET_TRIPS.map((preset) => (
              <div 
                key={preset.id} 
                className="preset-card"
                onClick={() => onLoadPreset(preset)}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span className="badge badge-cyan">{preset.legs.length} Destinations</span>
                    <span className="badge badge-emerald">Budget: ₹{preset.budget.toLocaleString('en-IN')}</span>
                  </div>
                  
                  <h4 className="preset-card-title">{preset.name}</h4>
                  <p className="preset-card-tagline">{preset.tagline}</p>
                </div>

                <div style={{ marginTop: '20px', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.85rem', color: '#38BDF8', fontWeight: 600 }}>
                    Load Preset & Customize
                  </span>
                  <ArrowRight size={16} color="#38BDF8" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
