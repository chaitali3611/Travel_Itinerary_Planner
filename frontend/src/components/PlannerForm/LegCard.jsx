import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Navigation2,
  Trash2,
  Bus,
  Train,
  Car,
  Plane,
  Key,
  RotateCcw,
  Hotel,
  Utensils,
  Compass,
  Users,
  ArrowRight,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { PassengerManager } from './PassengerManager';
import { HotelSelector } from './HotelSelector';
import { FoodMenuSelector } from './FoodMenuSelector';
import { ActivitiesSelector } from './ActivitiesSelector';
import { travelApi } from '../../api/travelApi';

const TRAVEL_MODES = [
  { id: 'bus',       name: 'Bus',      rate: 2.0,  icon: <Bus size={20} />,   childFree: true,  seniorDiscount: true  },
  { id: 'train',     name: 'Train',    rate: 0.5,  icon: <Train size={20} />, childFree: true,  seniorDiscount: true  },
  { id: 'self-car',  name: 'Self Car', rate: 10.0, icon: <Car size={20} />,   childFree: false, seniorDiscount: false },
  { id: 'rent-car',  name: 'Rent Car', rate: 15.0, icon: <Key size={20} />,   childFree: false, seniorDiscount: false },
  { id: 'flight',    name: 'Flight',   rate: 30.0, icon: <Plane size={20} />, childFree: false, seniorDiscount: false },
];

export function LegCard({
  leg,
  legIndex,
  totalLegs,
  onUpdateLeg,
  onRemoveLeg,
  destinationsCatalog = { cities: [], catalogs: {} },
  hotelsCatalog = [],
  foodCatalog = { cuisines: {} },
  isFirstLeg = false
}) {
  const [distanceInfo, setDistanceInfo] = useState({ distanceKm: null, loading: false, error: null });
  const [activeTab, setActiveTab] = useState('passengers');

  const availableCities = destinationsCatalog.cities?.length
    ? destinationsCatalog.cities
    : ['mumbai', 'pune', 'chhatrapati sambhajinagar', 'ahilyanagar', 'nashik'];

  // Live geodesic distance
  useEffect(() => {
    let isCancelled = false;
    const sCity = leg.source_city?.trim();
    const dCity = leg.destination_city?.trim();

    if (sCity && dCity && sCity.toLowerCase() !== dCity.toLowerCase()) {
      setDistanceInfo((prev) => ({ ...prev, loading: true, error: null }));

      const timer = setTimeout(async () => {
        try {
          const res = await travelApi.calculateDistance(sCity, dCity);
          if (!isCancelled && res?.distance_km !== undefined) {
            setDistanceInfo({ distanceKm: res.distance_km, loading: false, error: null });
          }
        } catch (err) {
          if (!isCancelled) {
            setDistanceInfo({ distanceKm: null, loading: false, error: err.message || 'Distance lookup failed' });
          }
        }
      }, 400);

      return () => {
        isCancelled = true;
        clearTimeout(timer);
      };
    } else {
      setDistanceInfo({ distanceKm: null, loading: false, error: null });
    }
  }, [leg.source_city, leg.destination_city]);

  const handleModeSelect = (modeId) => {
    onUpdateLeg({ ...leg, travel_mode: modeId });
  };

  const toggleRoundTrip = () => {
    onUpdateLeg({ ...leg, is_round_trip: !leg.is_round_trip });
  };

  const getEstimatedDuration = (distance, mode) => {
    if (!distance) return null;
    const speeds = { flight: 500, train: 70, 'self-car': 65, 'rent-car': 65, bus: 45 };
    const avgSpeed = speeds[mode] || 50;
    const hours = distance / avgSpeed;
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h > 0 ? `${h}h ` : ''}${m}m`;
  };

  const estTime = getEstimatedDuration(distanceInfo.distanceKm, leg.travel_mode);

  const sourceLabel = leg.source_city
    ? leg.source_city.charAt(0).toUpperCase() + leg.source_city.slice(1)
    : 'Origin';
  const destLabel = leg.destination_city
    ? leg.destination_city.charAt(0).toUpperCase() + leg.destination_city.slice(1)
    : 'Destination';

  // Counts for tab badges
  const passengerCount = leg.passengers?.length || 1;
  const hotelName = leg.hotel?.hotel_name || null;
  const foodCount = leg.food_orders?.reduce((s, f) => s + f.quantity, 0) || 0;
  const activityCount = leg.activities?.length || 0;

  const TABS = [
    { id: 'passengers', icon: <Users size={15} />, label: 'Passengers', count: passengerCount },
    { id: 'hotel',      icon: <Hotel size={15} />,  label: 'Hotel', count: hotelName ? 1 : 0 },
    { id: 'food',       icon: <Utensils size={15} />, label: 'Dining', count: foodCount },
    { id: 'activities', icon: <Compass size={15} />, label: 'Activities', count: activityCount },
  ];

  return (
    <div className="leg-card animate-fade-in">
      <div className="leg-card-accent-bar" />
      <div className="leg-card-body">

        {/* ── Card Header ── */}
        <div className="leg-card-header">
          <div className="leg-number-badge">
            <div className="leg-number-circle">{legIndex + 1}</div>
            <div>
              <div className="leg-title">
                {sourceLabel}
                <ArrowRight size={14} style={{ margin: '0 6px', display: 'inline-block', verticalAlign: 'middle', opacity: 0.5 }} />
                {destLabel}
              </div>
              <div className="leg-subtitle">
                {leg.is_round_trip ? '↩ Round Trip · Return Included' : '→ One-Way Transit'}
              </div>
            </div>
          </div>

          {totalLegs > 1 && (
            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={onRemoveLeg}
              title="Remove this leg"
            >
              <Trash2 size={14} />
              Remove
            </button>
          )}
        </div>

        {/* ── Origin & Destination Inputs ── */}
        <div className="grid-cols-2" style={{ marginBottom: 20 }}>
          {/* Source */}
          <div>
            <label className="form-label" htmlFor={`leg-${legIndex}-source`}>
              📍 Starting City / Origin
            </label>
            <div className="city-input-wrapper">
              <MapPin size={16} className="city-input-icon" style={{ color: 'var(--primary-light)' }} />
              <input
                id={`leg-${legIndex}-source`}
                type="text"
                placeholder="e.g. Mumbai, Pune, Nashik…"
                value={leg.source_city || ''}
                onChange={(e) => onUpdateLeg({ ...leg, source_city: e.target.value })}
              />
            </div>
            <div className="city-chips-group">
              {availableCities.slice(0, 6).map((city) => (
                <button
                  key={city}
                  type="button"
                  className={`city-chip ${leg.source_city?.toLowerCase() === city.toLowerCase() ? 'selected' : ''}`}
                  onClick={() => onUpdateLeg({ ...leg, source_city: city })}
                >
                  {city.charAt(0).toUpperCase() + city.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Destination */}
          <div>
            <label className="form-label" htmlFor={`leg-${legIndex}-destination`}>
              🏁 Destination City
            </label>
            <div className="city-input-wrapper">
              <Navigation2 size={16} className="city-input-icon" style={{ color: '#10B981' }} />
              <input
                id={`leg-${legIndex}-destination`}
                type="text"
                placeholder="e.g. Pune, Nashik, Sambhajinagar…"
                value={leg.destination_city || ''}
                onChange={(e) => onUpdateLeg({ ...leg, destination_city: e.target.value })}
              />
            </div>
            <div className="city-chips-group">
              {availableCities.slice(0, 6).map((city) => (
                <button
                  key={city}
                  type="button"
                  className={`city-chip ${leg.destination_city?.toLowerCase() === city.toLowerCase() ? 'selected' : ''}`}
                  onClick={() => onUpdateLeg({ ...leg, destination_city: city })}
                >
                  {city.charAt(0).toUpperCase() + city.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Travel Mode ── */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
            <label className="form-label" style={{ margin: 0 }}>🚌 Travel Mode</label>

            {/* Round-trip toggle */}
            <label className="custom-switch">
              <div
                className={`switch-track ${leg.is_round_trip ? 'checked' : ''}`}
                onClick={toggleRoundTrip}
              >
                <div className={`switch-thumb ${leg.is_round_trip ? 'checked' : ''}`} />
              </div>
              <span style={{
                fontSize: '0.84rem',
                color: leg.is_round_trip ? 'var(--primary-light)' : 'var(--text-muted)',
                fontWeight: 500
              }}>
                Round Trip
              </span>
            </label>
          </div>

          <div className="travel-modes-grid">
            {TRAVEL_MODES.map((mode) => {
              const isActive = leg.travel_mode?.toLowerCase() === mode.id;
              return (
                <div
                  key={mode.id}
                  className={`travel-mode-card ${isActive ? 'active' : ''}`}
                  onClick={() => handleModeSelect(mode.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && handleModeSelect(mode.id)}
                >
                  <div className="mode-icon">{mode.icon}</div>
                  <div className="mode-name">{mode.name}</div>
                  <div className="mode-rate">₹{mode.rate}/km</div>
                  {mode.childFree && (
                    <span className="mode-badge-free">Kids Free</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Distance Banner ── */}
        {distanceInfo.loading && (
          <div className="distance-loading">
            <Sparkles size={14} className="animate-spin-slow" />
            Computing geodesic distance…
          </div>
        )}

        {distanceInfo.distanceKm !== null && !distanceInfo.loading && (
          <div className="distance-banner animate-fade-in">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <CheckCircle2 size={18} color="var(--primary-light)" />
              <div>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                  {distanceInfo.distanceKm} km
                </span>
                {leg.is_round_trip && (
                  <span style={{ fontSize: '0.82rem', color: 'var(--primary-light)', marginLeft: 8 }}>
                    (Round trip: {(distanceInfo.distanceKm * 2).toFixed(1)} km)
                  </span>
                )}
                {' '}
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>geodesic distance</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
              {estTime && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.83rem', color: 'var(--text-muted)' }}>
                  <Clock size={13} />
                  Est. {estTime}
                </div>
              )}
              <span className="badge badge-emerald">Verified Route</span>
            </div>
          </div>
        )}

        {distanceInfo.error && (
          <div className="distance-error">
            <AlertCircle size={14} style={{ display: 'inline', marginRight: 6 }} />
            {distanceInfo.error} — will be calculated on submission.
          </div>
        )}

        {/* ── Section Tabs ── */}
        <div className="section-tabs">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`section-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(activeTab === tab.id ? null : tab.id)}
            >
              {tab.icon}
              {tab.label}
              {tab.count > 0 && (
                <span className="section-tab-count">{tab.count}</span>
              )}
            </button>
          ))}
        </div>

        {/* ── Tab Panels ── */}
        <div className="section-tab-panel">
          {activeTab === 'passengers' && (
            <PassengerManager
              passengers={leg.passengers || [{ name: 'Passenger 1', age: 25 }]}
              onChangePassengers={(newPassengers) => onUpdateLeg({ ...leg, passengers: newPassengers })}
              travelMode={leg.travel_mode}
              enableSeniorDiscount={leg.enable_senior_discount ?? true}
              onToggleSeniorDiscount={(val) => onUpdateLeg({ ...leg, enable_senior_discount: val })}
            />
          )}

          {activeTab === 'hotel' && (
            <HotelSelector
              hotelsCatalog={hotelsCatalog}
              selectedHotel={leg.hotel}
              onChangeHotel={(hotelData) => onUpdateLeg({ ...leg, hotel: hotelData })}
            />
          )}

          {activeTab === 'food' && (
            <FoodMenuSelector
              foodCatalog={foodCatalog}
              foodOrders={leg.food_orders || []}
              onChangeFoodOrders={(orders) => onUpdateLeg({ ...leg, food_orders: orders })}
            />
          )}

          {activeTab === 'activities' && (
            <ActivitiesSelector
              destinationsCatalog={destinationsCatalog}
              selectedCity={leg.destination_city || ''}
              selectedActivities={leg.activities || []}
              onChangeActivities={(activities) => onUpdateLeg({ ...leg, activities })}
            />
          )}
        </div>

      </div>
    </div>
  );
}
