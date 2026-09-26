import React, { useState } from 'react';
import { 
  Plus, 
  Sparkles, 
  Navigation, 
  MapPin, 
  RotateCcw, 
  AlertCircle, 
  ArrowRight, 
  Layers,
  HelpCircle,
  FileSpreadsheet
} from 'lucide-react';
import { TripMetaCard } from './TripMetaCard';
import { LegCard } from './LegCard';
import { useToast } from '../Common/Toast';
import { travelApi } from '../../api/travelApi';

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

  // Add a new leg (pre-filling source with the destination of previous leg for smooth chaining!)
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
    onChangeTripData({
      ...tripData,
      legs: [...legs, newLeg]
    });
    addToast(`Added Leg ${legs.length + 1}`, 'info');
  };

  const removeLeg = (index) => {
    if (legs.length <= 1) {
      addToast('Itinerary must have at least 1 destination leg', 'warning');
      return;
    }
    const updated = legs.filter((_, i) => i !== index).map((leg, i) => ({
      ...leg,
      leg_index: i + 1
    }));
    onChangeTripData({
      ...tripData,
      legs: updated
    });
    addToast('Destination leg removed', 'info');
  };

  const updateLeg = (index, updatedLeg) => {
    const updated = legs.map((leg, i) => (i === index ? updatedLeg : leg));
    onChangeTripData({
      ...tripData,
      legs: updated
    });
  };

  // Validate form before submitting
  const validateForm = () => {
    const errors = [];
    if (!tripName.trim()) {
      errors.push('Please give your trip a title or name.');
    }

    legs.forEach((leg, index) => {
      const legNum = index + 1;
      if (!leg.source_city?.trim()) {
        errors.push(`Leg ${legNum}: Please specify a starting origin city.`);
      }
      if (!leg.destination_city?.trim()) {
        errors.push(`Leg ${legNum}: Please specify a destination city.`);
      }
      if (
        leg.source_city?.trim().toLowerCase() && 
        leg.source_city?.trim().toLowerCase() === leg.destination_city?.trim().toLowerCase()
      ) {
        errors.push(`Leg ${legNum}: Starting location and destination cannot be identical (${leg.source_city}).`);
      }
      if (!leg.passengers || leg.passengers.length === 0) {
        errors.push(`Leg ${legNum}: Must have at least one passenger.`);
      } else {
        leg.passengers.forEach((p, pIdx) => {
          if (p.age === undefined || p.age === null || isNaN(p.age) || p.age < 0 || p.age > 120) {
            errors.push(`Leg ${legNum}, Passenger ${pIdx + 1}: Valid age between 0 and 120 is required.`);
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
      addToast('Please fix the validation issues before generating itinerary.', 'error');
      // Scroll to top of form
      window.scrollTo({ top: 120, behavior: 'smooth' });
      return;
    }

    setValidationErrors([]);
    onGenerateItinerary();
  };

  return (
    <section className="planner-container">
      <div className="container">
        {/* Header Bar */}
        <div className="planner-header-bar">
          <div className="planner-title-group">
            <div className="hero-pill" style={{ marginBottom: '8px' }}>
              <Sparkles size={14} />
              <span>Multi-Destination Planner</span>
            </div>
            <h2>Design Your Custom Trip</h2>
            <p style={{ fontSize: '0.9rem' }}>
              Configure your multi-stop route, passenger ages, verified stays, and local dining
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onOpenPresets}
              title="Load a pre-configured sample trip"
            >
              <FileSpreadsheet size={16} />
              <span>Load Sample Preset</span>
            </button>
          </div>
        </div>

        {/* Validation Errors Alert Box */}
        {validationErrors.length > 0 && (
          <div className="animate-fade-in" style={{ padding: '16px 20px', borderRadius: 'var(--radius-lg)', background: 'rgba(244, 63, 94, 0.12)', border: '1px solid rgba(244, 63, 94, 0.35)', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#FB7185', fontWeight: 700, marginBottom: '8px' }}>
              <AlertCircle size={20} />
              <span>Please resolve the following before generating:</span>
            </div>
            <ul style={{ listStyle: 'disc', paddingLeft: '24px', color: '#FECDD3', fontSize: '0.88rem' }}>
              {validationErrors.map((err, idx) => (
                <li key={idx} style={{ marginBottom: '4px' }}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Trip Meta Overview Card */}
          <TripMetaCard
            tripName={tripName}
            setTripName={(name) => onChangeTripData({ ...tripData, tripName: name })}
            budget={budget}
            setBudget={(b) => onChangeTripData({ ...tripData, budget: b })}
          />

          {/* Leg Cards List */}
          <div style={{ margin: '30px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.3rem' }}>
                📍 Destination Route Legs ({legs.length})
              </h3>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Chain multiple cities seamlessly
              </span>
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

            {/* Add Destination Leg Button */}
            <button
              type="button"
              className="btn btn-secondary"
              onClick={addLeg}
              style={{ width: '100%', padding: '16px', borderStyle: 'dashed', borderRadius: 'var(--radius-xl)', fontSize: '1rem', marginTop: '12px' }}
            >
              <Plus size={20} color="#0EA5E9" />
              <span>+ Add Another Destination Stop / Leg</span>
            </button>
          </div>

          {/* Generate Final CTA Bar */}
          <div style={{ marginTop: '40px', padding: '24px', borderRadius: 'var(--radius-xl)', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h4 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>Ready to compute your complete itinerary?</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                FastAPI backend will calculate geodesic distances, exact person-wise fares with child & senior discounts, and generate your budget dashboard.
              </p>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg animate-pulse-glow"
              disabled={isCalculating}
              style={{ minWidth: '220px' }}
            >
              <Sparkles size={20} />
              <span>{isCalculating ? 'Calculating...' : 'Generate Itinerary'}</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
