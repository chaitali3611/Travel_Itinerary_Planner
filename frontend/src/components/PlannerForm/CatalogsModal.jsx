import React, { useState } from 'react';
import { X, MapPin, Hotel, Utensils, Bus, Sparkles, ShoppingBag, Trees, Landmark } from 'lucide-react';

export function CatalogsModal({ isOpen, onClose, catalogsData }) {
  const [activeTab, setActiveTab] = useState('destinations'); // 'destinations' | 'hotels' | 'food' | 'modes'

  if (!isOpen) return null;

  const { destinations = { catalogs: {} }, hotels = [], food = { cuisines: {} }, travelModes = { rates_per_km: {} } } = catalogsData || {};
  const hotelList = Array.isArray(hotels) ? hotels : (hotels?.hotels || []);

  return (
    <div className="loading-overlay" style={{ zIndex: 1100 }}>
      <div 
        className="glass-panel-elevated animate-fade-in"
        style={{
          maxWidth: '900px',
          width: '100%',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          background: 'var(--bg-card-solid)'
        }}
      >
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(14, 165, 233, 0.15)', color: '#38BDF8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem' }}>Travel Planner Knowledge Base & Catalogs</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Verified database of Maharashtra destinations, hotels, dining, and fares</p>
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

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: '8px', padding: '12px 24px', borderBottom: '1px solid var(--border-subtle)', background: 'rgba(255,255,255,0.02)' }}>
          <button
            className={`nav-link-btn ${activeTab === 'destinations' ? 'active' : ''}`}
            onClick={() => setActiveTab('destinations')}
          >
            <MapPin size={15} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
            Destinations & Attractions
          </button>
          <button
            className={`nav-link-btn ${activeTab === 'hotels' ? 'active' : ''}`}
            onClick={() => setActiveTab('hotels')}
          >
            <Hotel size={15} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
            Hotels & Rooms
          </button>
          <button
            className={`nav-link-btn ${activeTab === 'food' ? 'active' : ''}`}
            onClick={() => setActiveTab('food')}
          >
            <Utensils size={15} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
            Dining & Cuisines
          </button>
          <button
            className={`nav-link-btn ${activeTab === 'modes' ? 'active' : ''}`}
            onClick={() => setActiveTab('modes')}
          >
            <Bus size={15} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
            Fare Matrix & Rules
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
          {/* Destinations Tab */}
          {activeTab === 'destinations' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {Object.entries(destinations.catalogs || {}).map(([cityName, categories]) => (
                <div key={cityName} style={{ padding: '16px', borderRadius: 'var(--radius-lg)', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <MapPin size={18} color="#0EA5E9" />
                    <h4 style={{ fontSize: '1.1rem', textTransform: 'capitalize' }}>{cityName}</h4>
                  </div>

                  <div className="grid-cols-2" style={{ gap: '12px' }}>
                    {Object.entries(categories).map(([catName, places]) => (
                      <div key={catName} style={{ padding: '12px', borderRadius: 'var(--radius-md)', background: 'rgba(18, 26, 43, 0.4)', border: '1px solid var(--border-subtle)' }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#38BDF8', marginBottom: '6px' }}>
                          {catName}
                        </div>
                        <ul style={{ listStyle: 'none', paddingLeft: '0', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                          {places.map((place) => (
                            <li key={place} style={{ marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#38BDF8' }} />
                              <span>{place}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Hotels Tab */}
          {activeTab === 'hotels' && (
            <div className="grid-cols-2" style={{ gap: '16px' }}>
              {hotelList.map((hotel) => (
                <div key={hotel.name} style={{ padding: '18px', borderRadius: 'var(--radius-lg)', background: 'rgba(18, 26, 43, 0.5)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Hotel size={18} color="#818CF8" />
                      <h4 style={{ fontSize: '1.05rem' }}>{hotel.name}</h4>
                    </div>
                    <span className="badge badge-purple">Verified Partner</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {Object.entries(hotel.rooms).map(([room, price]) => (
                      <div key={room} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', borderRadius: 'var(--radius-sm)', background: 'rgba(255,255,255,0.03)' }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{room} Configuration</span>
                        <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#A78BFA' }}>₹{price.toLocaleString('en-IN')}/night</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Food Tab */}
          {activeTab === 'food' && (
            <div className="grid-cols-2" style={{ gap: '16px' }}>
              {Object.entries(food.cuisines || {}).map(([cuisine, items]) => (
                <div key={cuisine} style={{ padding: '18px', borderRadius: 'var(--radius-lg)', background: 'rgba(18, 26, 43, 0.5)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <Utensils size={18} color="#FBBF24" />
                    <h4 style={{ fontSize: '1.05rem' }}>{cuisine} Cuisine</h4>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {items.map((dish) => (
                      <div key={dish.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', borderRadius: 'var(--radius-sm)', background: 'rgba(255,255,255,0.03)' }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{dish.name}</span>
                        <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FBBF24' }}>₹{dish.price.toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Modes & Rules Tab */}
          {activeTab === 'modes' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ padding: '18px', borderRadius: 'var(--radius-lg)', background: 'rgba(18, 26, 43, 0.5)', border: '1px solid var(--border-subtle)' }}>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '12px' }}>Transit Rates per Kilometer</h4>
                <div className="grid-cols-3" style={{ gap: '10px' }}>
                  {Object.entries(travelModes.rates_per_km || {}).map(([mode, rate]) => (
                    <div key={mode} style={{ padding: '12px', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.03)', textAlign: 'center' }}>
                      <div style={{ fontWeight: 700, textTransform: 'capitalize', fontSize: '0.95rem' }}>{mode}</div>
                      <div style={{ color: '#38BDF8', fontWeight: 800, fontSize: '1.1rem', marginTop: '4px' }}>₹{rate} / km</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid-cols-2" style={{ gap: '16px' }}>
                <div style={{ padding: '18px', borderRadius: 'var(--radius-lg)', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span className="badge badge-emerald">Child Policy</span>
                  </div>
                  <h4 style={{ fontSize: '1rem', color: '#34D399', marginBottom: '6px' }}>100% Free Travel for Kids &lt; 10</h4>
                  <p style={{ fontSize: '0.85rem' }}>
                    Eligible Modes: <strong>Bus and Train</strong>. Children under 10 years of age do not pay any transportation fare.
                  </p>
                </div>

                <div style={{ padding: '18px', borderRadius: 'var(--radius-lg)', background: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span className="badge badge-purple">Senior Citizen Policy</span>
                  </div>
                  <h4 style={{ fontSize: '1rem', color: '#818CF8', marginBottom: '6px' }}>25% Fare Concession (60+ Years)</h4>
                  <p style={{ fontSize: '0.85rem' }}>
                    Eligible Modes: <strong>Bus and Train</strong>. Senior citizens age 60 and above automatically receive a 25% discount per leg.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
