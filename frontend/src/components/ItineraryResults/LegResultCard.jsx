import React, { useState } from 'react';
import { 
  MapPin, 
  Navigation, 
  Bus, 
  Train, 
  Car, 
  Plane, 
  Key, 
  Hotel, 
  Utensils, 
  Compass, 
  ChevronDown, 
  ChevronUp, 
  RotateCcw, 
  Clock, 
  CheckCircle2,
  Receipt,
  Calendar
} from 'lucide-react';
import { PassengerFareTable } from './PassengerFareTable';

const MODE_ICONS = {
  bus: <Bus size={18} />,
  train: <Train size={18} />,
  'self-car': <Car size={18} />,
  'rent-car': <Key size={18} />,
  flight: <Plane size={18} />
};

export function LegResultCard({ leg, legIndex }) {
  const [showPassengerDetails, setShowPassengerDetails] = useState(true);

  const travel = leg.travel_details || {};
  const hotel = leg.hotel_details;
  const food = leg.food_details;
  const activities = leg.activities || [];

  return (
    <div className="leg-card animate-fade-in" style={{ marginBottom: '24px' }}>
      {/* Header */}
      <div className="leg-card-header" style={{ alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="leg-number-circle" style={{ width: '38px', height: '38px', fontSize: '1.1rem' }}>
            {legIndex + 1}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <h3 style={{ fontSize: '1.35rem' }}>
                {leg.source_city} ➔ {leg.destination_city}
              </h3>
              <span className="badge badge-cyan" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                {MODE_ICONS[travel.travel_mode?.toLowerCase()] || <Bus size={14} />}
                {travel.travel_mode?.toUpperCase()}
              </span>
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Geodesic Route: <strong>{leg.distance_km} km</strong> • {travel.return_cost > 0 ? 'Round Trip (2x)' : 'One-Way'}
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
            Leg Subtotal
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#38BDF8' }}>
            ₹{leg.leg_total_cost.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      {/* Cost Breakdown Grid for this leg */}
      <div className="grid-cols-3" style={{ gap: '14px', marginBottom: '20px' }}>
        {/* Transit Cost Box */}
        <div style={{ padding: '16px', borderRadius: 'var(--radius-lg)', background: 'rgba(14, 165, 233, 0.08)', border: '1px solid rgba(14, 165, 233, 0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              🚗 Transportation
            </span>
            <span style={{ fontWeight: 700, color: '#38BDF8', fontSize: '1.05rem' }}>
              ₹{leg.travel_cost.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '3px' }}>
            <div>Rate: ₹{travel.rate_per_km}/km • Base: ₹{travel.base_fare_per_person?.toFixed(2)}/person</div>
            <div>One-Way: ₹{travel.one_way_cost?.toFixed(2)} | Return: ₹{travel.return_cost?.toFixed(2)}</div>
            <div>Passengers: {travel.total_passengers} ({travel.free_passengers_count || 0} Free)</div>
          </div>
        </div>

        {/* Hotel Cost Box */}
        <div style={{ padding: '16px', borderRadius: 'var(--radius-lg)', background: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              🏨 Accommodation
            </span>
            <span style={{ fontWeight: 700, color: '#818CF8', fontSize: '1.05rem' }}>
              ₹{leg.hotel_cost.toLocaleString('en-IN')}
            </span>
          </div>
          {hotel ? (
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '3px' }}>
              <div>Hotel: <strong>{hotel.hotel}</strong></div>
              <div>Room: {hotel.room_type} (₹{hotel.rate_per_night}/night)</div>
              <div>Duration: {hotel.nights} {hotel.nights === 1 ? 'Night' : 'Nights'}</div>
            </div>
          ) : (
            <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontStyle: 'italic', paddingTop: '6px' }}>
              No hotel stay selected (Day excursion)
            </div>
          )}
        </div>

        {/* Dining Cost Box */}
        <div style={{ padding: '16px', borderRadius: 'var(--radius-lg)', background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              🍲 Dining & Food
            </span>
            <span style={{ fontWeight: 700, color: '#FBBF24', fontSize: '1.05rem' }}>
              ₹{leg.food_cost.toLocaleString('en-IN')}
            </span>
          </div>
          {food && food.items?.length > 0 ? (
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '3px' }}>
              <div>Ordered: {food.items_count} Meals / Plates</div>
              <div style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                {food.items.map((i) => `${i.name} (x${i.quantity})`).join(', ')}
              </div>
            </div>
          ) : (
            <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontStyle: 'italic', paddingTop: '6px' }}>
              No meal package included
            </div>
          )}
        </div>
      </div>

      {/* Activities Timeline */}
      {activities.length > 0 && (
        <div style={{ marginBottom: '20px', padding: '14px 18px', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <Compass size={16} color="#34D399" />
            <h5 style={{ fontSize: '0.9rem', fontWeight: 600 }}>
              Planned Sightseeing & Activities in {leg.destination_city} ({activities.length})
            </h5>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {activities.map((act, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '5px 12px',
                  borderRadius: 'var(--radius-full)',
                  background: 'rgba(16, 185, 129, 0.12)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  fontSize: '0.82rem'
                }}
              >
                <CheckCircle2 size={13} color="#34D399" />
                <span style={{ fontWeight: 600 }}>{act.place}</span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>({act.category})</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Passenger Fare Table Accordion */}
      <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
        <button
          type="button"
          className="accordion-header"
          onClick={() => setShowPassengerDetails(!showPassengerDetails)}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: 600 }}>
            <span>Passenger Ticket Breakdown ({travel.total_passengers} passengers)</span>
          </div>
          {showPassengerDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {showPassengerDetails && (
          <PassengerFareTable
            passengersBreakdown={travel.passenger_breakdown}
            travelMode={travel.travel_mode}
          />
        )}
      </div>
    </div>
  );
}
