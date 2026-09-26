import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Navigation, 
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
  ChevronDown, 
  ChevronUp, 
  ArrowRight,
  Info,
  Clock,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { PassengerManager } from './PassengerManager';
import { HotelSelector } from './HotelSelector';
import { FoodMenuSelector } from './FoodMenuSelector';
import { ActivitiesSelector } from './ActivitiesSelector';
import { travelApi } from '../../api/travelApi';

const TRAVEL_MODES = [
  { id: 'bus', name: 'Bus', rate: 2.0, icon: <Bus size={18} />, childFree: true, seniorDiscount: true },
  { id: 'train', name: 'Train', rate: 0.5, icon: <Train size={18} />, childFree: true, seniorDiscount: true },
  { id: 'self-car', name: 'Self Car', rate: 10.0, icon: <Car size={18} />, childFree: false, seniorDiscount: false },
  { id: 'rent-car', name: 'Rent Car', rate: 15.0, icon: <Key size={18} />, childFree: false, seniorDiscount: false },
  { id: 'flight', name: 'Flight', rate: 30.0, icon: <Plane size={18} />, childFree: false, seniorDiscount: false },
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
  const [activeAccordion, setActiveAccordion] = useState('passengers'); // 'passengers' | 'hotel' | 'food' | 'activities' | null

  const availableCities = destinationsCatalog.cities?.length 
    ? destinationsCatalog.cities 
    : ['mumbai', 'pune', 'chhatrapati sambhajinagar', 'ahilyanagar', 'nashik'];

  // Calculate live geodesic distance when source and destination are provided
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
            setDistanceInfo({
              distanceKm: res.distance_km,
              loading: false,
              error: null
            });
          }
        } catch (err) {
          if (!isCancelled) {
            setDistanceInfo({
              distanceKm: null,
              loading: false,
              error: err.message || 'Distance lookup failed'
            });
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

  // Estimate transit time based on mode and distance
  const getEstimatedDuration = (distance, mode) => {
    if (!distance) return null;
    let avgSpeed = 50; // km/h
    if (mode === 'flight') avgSpeed = 500;
    else if (mode === 'train') avgSpeed = 70;
    else if (mode === 'self-car' || mode === 'rent-car') avgSpeed = 65;
    else if (mode === 'bus') avgSpeed = 45;

    const hours = distance / avgSpeed;
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h > 0 ? `${h}h ` : ''}${m}m`;
  };

  const estTime = getEstimatedDuration(distanceInfo.distanceKm, leg.travel_mode);

  return (
    <div className="leg-card animate-fade-in">
      {/* Leg Header */}
      <div className="leg-card-header">
        <div className="leg-number-badge">
          <div className="leg-number-circle">{legIndex + 1}</div>
          <div>
            <span>
              {leg.source_city ? leg.source_city.toUpperCase() : 'START'} ➔ {leg.destination_city ? leg.destination_city.toUpperCase() : 'DESTINATION'}
            </span>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 400 }}>
              {leg.is_round_trip ? '🔄 Round Trip (Return Included)' : '➡️ One-Way Transit'}
            </div>
          </div>
        </div>

        {totalLegs > 1 && (
          <button
            type="button"
            className="btn btn-danger btn-sm"
            onClick={onRemoveLeg}
            title="Delete this destination leg"
          >
            <Trash2 size={15} />
            <span>Remove Leg</span>
          </button>
        )}
      </div>

      {/* Origin & Destination Row */}
      <div className="grid-cols-2" style={{ marginBottom: '18px' }}>
        {/* Source City */}
        <div>
          <label className="form-label" htmlFor={`leg-${legIndex}-source`}>
            Starting Location / Origin
          </label>
          <div style={{ position: 'relative' }}>
            <MapPin size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#0EA5E9' }} />
            <input
              id={`leg-${legIndex}-source`}
              type="text"
              placeholder="e.g. Mumbai, Pune, Nashik..."
              value={leg.source_city || ''}
              onChange={(e) => onUpdateLeg({ ...leg, source_city: e.target.value })}
              style={{ paddingLeft: '36px' }}
            />
          </div>
          
          {/* Quick Origin Suggestions */}
          <div className="city-chips-group">
            {availableCities.slice(0, 5).map((city) => (
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

        {/* Destination City */}
        <div>
          <label className="form-label" htmlFor={`leg-${legIndex}-destination`}>
            Destination Location
          </label>
          <div style={{ position: 'relative' }}>
            <Navigation size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#10B981' }} />
            <input
              id={`leg-${legIndex}-destination`}
              type="text"
              placeholder="e.g. Pune, Nashik, Sambhajinagar..."
              value={leg.destination_city || ''}
              onChange={(e) => onUpdateLeg({ ...leg, destination_city: e.target.value })}
              style={{ paddingLeft: '36px' }}
            />
          </div>

          {/* Quick Destination Suggestions */}
          <div className="city-chips-group">
            {availableCities.slice(0, 5).map((city) => (
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

      {/* Travel Mode Selector */}
      <div style={{ marginBottom: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <label className="form-label" style={{ margin: 0 }}>
            Travel Mode & Transportation
          </label>
          
          {/* Return Journey Toggle */}
          <label className="custom-switch">
            <div
              className={`switch-track ${leg.is_round_trip ? 'checked' : ''}`}
              onClick={toggleRoundTrip}
            >
              <div className={`switch-thumb ${leg.is_round_trip ? 'checked' : ''}`} />
            </div>
            <span style={{ fontSize: '0.85rem', color: leg.is_round_trip ? '#38BDF8' : 'var(--text-muted)', fontWeight: 500 }}>
              Round Trip (2x)
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
              >
                <div style={{ color: isActive ? '#38BDF8' : 'var(--text-muted)' }}>
                  {mode.icon}
                </div>
                <div className="mode-name">{mode.name}</div>
                <div className="mode-rate">₹{mode.rate}/km</div>
                {mode.childFree && (
                  <span className="mode-badge-free" title="Children under 10 travel 100% free">
                    Kids Free
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Distance Calculation Live Indicator */}
      {distanceInfo.distanceKm !== null && (
        <div className="distance-banner animate-fade-in">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sparkles size={18} color="#0EA5E9" />
            <div>
              <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                Geodesic Distance: {distanceInfo.distanceKm} km
              </span>
              {leg.is_round_trip && (
                <span style={{ fontSize: '0.8rem', color: '#38BDF8', marginLeft: '6px' }}>
                  (Round Trip: {(distanceInfo.distanceKm * 2).toFixed(1)} km)
                </span>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {estTime && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <Clock size={14} />
                <span>Est. Transit: {estTime}</span>
              </div>
            )}
            <span className="badge badge-emerald">Verified Route</span>
          </div>
        </div>
      )}

      {distanceInfo.loading && (
        <div style={{ fontSize: '0.85rem', color: '#38BDF8', margin: '10px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={14} className="animate-spin-slow" />
          <span>Computing exact geodesic distance between cities...</span>
        </div>
      )}

      {distanceInfo.error && (
        <div style={{ fontSize: '0.82rem', color: '#FB7185', margin: '8px 0' }}>
          ⚠️ {distanceInfo.error} (Will be calculated upon itinerary submission)
        </div>
      )}

      {/* Section Tabs / Accordions */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px', marginTop: '20px', flexWrap: 'wrap' }}>
        <button
          type="button"
          className={`nav-link-btn ${activeAccordion === 'passengers' ? 'active' : ''}`}
          onClick={() => setActiveAccordion(activeAccordion === 'passengers' ? null : 'passengers')}
        >
          <Users size={16} style={{ verticalAlign: 'middle', marginRight: '5px' }} />
          <span>Passengers ({leg.passengers?.length || 1})</span>
        </button>

        <button
          type="button"
          className={`nav-link-btn ${activeAccordion === 'hotel' ? 'active' : ''}`}
          onClick={() => setActiveAccordion(activeAccordion === 'hotel' ? null : 'hotel')}
        >
          <Hotel size={16} style={{ verticalAlign: 'middle', marginRight: '5px' }} />
          <span>Hotel Stay {leg.hotel ? `(${leg.hotel.hotel_name})` : '(None)'}</span>
        </button>

        <button
          type="button"
          className={`nav-link-btn ${activeAccordion === 'food' ? 'active' : ''}`}
          onClick={() => setActiveAccordion(activeAccordion === 'food' ? null : 'food')}
        >
          <Utensils size={16} style={{ verticalAlign: 'middle', marginRight: '5px' }} />
          <span>Dining & Meals ({leg.food_orders?.reduce((s, f) => s + f.quantity, 0) || 0})</span>
        </button>

        <button
          type="button"
          className={`nav-link-btn ${activeAccordion === 'activities' ? 'active' : ''}`}
          onClick={() => setActiveAccordion(activeAccordion === 'activities' ? null : 'activities')}
        >
          <Compass size={16} style={{ verticalAlign: 'middle', marginRight: '5px' }} />
          <span>Activities ({leg.activities?.length || 0})</span>
        </button>
      </div>

      {/* Active Tab Panel */}
      <div style={{ marginTop: '12px' }}>
        {activeAccordion === 'passengers' && (
          <PassengerManager
            passengers={leg.passengers || [{ name: 'Passenger 1', age: 25 }]}
            onChangePassengers={(newPassengers) => onUpdateLeg({ ...leg, passengers: newPassengers })}
            travelMode={leg.travel_mode}
            enableSeniorDiscount={leg.enable_senior_discount ?? true}
            onToggleSeniorDiscount={(val) => onUpdateLeg({ ...leg, enable_senior_discount: val })}
          />
        )}

        {activeAccordion === 'hotel' && (
          <HotelSelector
            hotelsCatalog={hotelsCatalog}
            selectedHotel={leg.hotel}
            onChangeHotel={(hotelData) => onUpdateLeg({ ...leg, hotel: hotelData })}
          />
        )}

        {activeAccordion === 'food' && (
          <FoodMenuSelector
            foodCatalog={foodCatalog}
            foodOrders={leg.food_orders || []}
            onChangeFoodOrders={(orders) => onUpdateLeg({ ...leg, food_orders: orders })}
          />
        )}

        {activeAccordion === 'activities' && (
          <ActivitiesSelector
            destinationsCatalog={destinationsCatalog}
            selectedCity={leg.destination_city || ''}
            selectedActivities={leg.activities || []}
            onChangeActivities={(activities) => onUpdateLeg({ ...leg, activities })}
          />
        )}
      </div>
    </div>
  );
}
