import React, { useState } from 'react';
import {
  Plus,
  Sparkles,
  Navigation,
  AlertCircle,
  ArrowRight,
  FileSpreadsheet,
  Route
} from 'lucide-react';
import { TripMetaCard } from './TripMetaCard';
import { LegCard } from './LegCard';
import { useToast } from '../Common/Toast';

export function TripPlanner({
  tripData,
  onChangeTripData,
  catalogsData,
  onGenerateItinerary,
  isCalculating,
  onOpenPresets
}) {
  const { addToast } = useToast();
  const [validationErrors, setValidationErrors] = useState([]);

  const { tripName = '', budget = 0, legs = [] } = tripData;

  const addLeg = () => {
    const lastLeg = legs[legs.length - 1];
    const newSource = lastLeg?.destination_city || 'mumbai';
    const newLeg = {
      leg_index: legs.length + 1,
      source_city: newSource,
      destination_city: '',
      travel_mode: 'bus',
      is_round_trip: false,
      enable_senior_discount: true,
      passengers: lastLeg?.passengers?.length
        ? JSON.parse(JSON.stringify(lastLeg.passengers))
        : [{ id: 1, name: 'Passenger 1', age: 25 }],
      hotel: null,
      food_orders: [],
      activities: []
    };
    onChangeTripData({ ...tripData, legs: [...legs, newLeg] });
    addToast(`Leg ${legs.length + 1} added`, 'info');
  };

  const removeLeg = (index) => {
    if (legs.length <= 1) {
      addToast('At least 1 destination leg is required', 'warning');
      return;
    }
    const updated = legs
      .filter((_, i) => i !== index)
      .map((leg, i) => ({ ...leg, leg_index: i + 1 }));
    onChangeTripData({ ...tripData, legs: updated });
    addToast('Leg removed', 'info');
  };

  const updateLeg = (index, updatedLeg) => {
    const updated = legs.map((leg, i) => (i === index ? updatedLeg : leg));
    onChangeTripData({ ...tripData, legs: updated });
  };

  const validateForm = () => {
    const errors = [];
    if (!tripName.trim()) {
      errors.push('Please give your trip a name or title.');
    }

    legs.forEach((leg, index) => {
      const num = index + 1;
      if (!leg.source_city?.trim()) errors.push(`Leg ${num}: Starting city is required.`);
      if (!leg.destination_city?.trim()) errors.push(`Leg ${num}: Destination city is required.`);
      if (
        leg.source_city?.trim().toLowerCase() &&
        leg.source_city?.trim().toLowerCase() === leg.destination_city?.trim().toLowerCase()
      ) {
        errors.push(`Leg ${num}: Origin and destination cannot be the same city.`);
      }
      if (!leg.passengers || leg.passengers.length === 0) {
        errors.push(`Leg ${num}: At least 1 passenger is required.`);
      } else {
        leg.passengers.forEach((p, pIdx) => {
          if (p.age === undefined || p.age === null || isNaN(p.age) || p.age < 0 || p.age > 120) {
            errors.push(`Leg ${num} · Passenger ${pIdx + 1}: Valid age (0–120) is required.`);
          }
        });
      }
    });

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      addToast('Please fix the highlighted issues before generating.', 'error');
      window.scrollTo({ top: 120, behavior: 'smooth' });
      return;
    }
    setValidationErrors([]);
    onGenerateItinerary();
  };

  return (
    <section className="planner-container">
      <div className="container">

        {/* ── Header Bar ── */}
        <div className="planner-header-bar">
          <div className="planner-title-group">
            <div className="section-eyebrow">
              <Route size={13} />
              Multi-Destination Planner
            </div>
            <h2>Design Your Custom Trip</h2>
            <p>
              Configure your route, passenger ages, stays, and dining — then generate your bill.
            </p>
          </div>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={onOpenPresets}
            title="Load a pre-configured sample trip"
          >
            <FileSpreadsheet size={16} />
            Load a Preset
          </button>
        </div>

        {/* ── Validation Errors ── */}
        {validationErrors.length > 0 && (
          <div className="validation-box animate-fade-in">
            <div className="validation-box-title">
              <AlertCircle size={18} />
              Please resolve these issues before generating:
            </div>
            <ul>
              {validationErrors.map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>

          {/* ── Trip Meta Card (name + budget) ── */}
          <TripMetaCard
            tripName={tripName}
            setTripName={(name) => onChangeTripData({ ...tripData, tripName: name })}
            budget={budget}
            setBudget={(b) => onChangeTripData({ ...tripData, budget: b })}
          />

          {/* ── Leg Cards ── */}
          <div style={{ margin: '32px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: 4 }}>
                  📍 Route Legs
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 26,
                    height: 26,
                    borderRadius: '50%',
                    background: 'rgba(14,165,233,0.15)',
                    color: 'var(--primary-light)',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    marginLeft: 10,
                    border: '1px solid rgba(14,165,233,0.3)'
                  }}>
                    {legs.length}
                  </span>
                </h3>
                <p style={{ fontSize: '0.85rem' }}>Each leg is an independent city-to-city segment</p>
              </div>
            </div>

            {legs.map((leg, index) => (
              <LegCard
                key={leg.leg_index || index}
                leg={leg}
                legIndex={index}
                totalLegs={legs.length}
                onUpdateLeg={(updated) => updateLeg(index, updated)}
                onRemoveLeg={() => removeLeg(index)}
                destinationsCatalog={catalogsData?.destinations}
                hotelsCatalog={catalogsData?.hotels?.hotels || []}
                foodCatalog={catalogsData?.food}
                isFirstLeg={index === 0}
              />
            ))}

            {/* Add Leg Button */}
            <button
              type="button"
              className="btn btn-secondary"
              onClick={addLeg}
              style={{
                width: '100%',
                padding: '18px',
                borderStyle: 'dashed',
                borderRadius: 'var(--radius-xl)',
                fontSize: '0.95rem',
                marginTop: 8,
                color: 'var(--text-muted)',
                gap: 10
              }}
            >
              <Plus size={18} style={{ color: 'var(--primary-light)' }} />
              Add Another Destination Leg
            </button>
          </div>

          {/* ── Generate CTA Bar ── */}
          <div className="generate-cta-bar">
            <div>
              <h4 style={{ fontSize: '1.15rem', marginBottom: 6, color: 'var(--text-primary)' }}>
                Ready to compute your complete itinerary?
              </h4>
              <p style={{ fontSize: '0.85rem', margin: 0 }}>
                FastAPI calculates geodesic distances, person-wise fares with age &amp; senior discounts,
                hotel &amp; dining costs, and generates your full budget dashboard.
              </p>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg animate-pulse-glow"
              disabled={isCalculating}
              style={{ minWidth: 220, flexShrink: 0 }}
            >
              <Sparkles size={18} />
              <span>{isCalculating ? 'Calculating…' : 'Generate Itinerary'}</span>
              <ArrowRight size={17} />
            </button>
          </div>

        </form>
      </div>
    </section>
  );
}
