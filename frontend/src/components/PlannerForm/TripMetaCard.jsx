import React from 'react';
import { Tag, Wallet, Compass, Info, CheckCircle2 } from 'lucide-react';

export function TripMetaCard({ tripName, setTripName, budget, setBudget }) {
  // Determine budget category
  const getBudgetCategory = (amount) => {
    const val = parseFloat(amount) || 0;
    if (val <= 0) return { label: 'Not Specified', color: 'badge-purple' };
    if (val <= 5000) return { label: 'Local Trip (₹0 - ₹5,000)', color: 'badge-emerald' };
    if (val <= 15000) return { label: 'Domestic Trip (₹5,000 - ₹15,000)', color: 'badge-cyan' };
    return { label: 'Premium Trip (> ₹15,000)', color: 'badge-purple' };
  };

  const currentCategory = getBudgetCategory(budget);

  const presetBudgets = [5000, 15000, 25000, 50000];

  return (
    <div className="meta-card animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(14, 165, 233, 0.15)', color: '#38BDF8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Compass size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem' }}>Trip Overview & Budget Target</h3>
            <p style={{ fontSize: '0.82rem' }}>Define your trip name and maximum spending threshold</p>
          </div>
        </div>

        <span className={`badge ${currentCategory.color}`}>
          {currentCategory.label}
        </span>
      </div>

      <div className="grid-cols-2">
        <div>
          <label className="form-label" htmlFor="trip-name-input">
            Trip Title / Itinerary Name
          </label>
          <input
            id="trip-name-input"
            type="text"
            placeholder="e.g. Maharashtra Summer Roadtrip 2026"
            value={tripName}
            onChange={(e) => setTripName(e.target.value)}
          />
        </div>

        <div>
          <label className="form-label" htmlFor="trip-budget-input">
            Target Budget (₹ INR)
          </label>
          <input
            id="trip-budget-input"
            type="number"
            min="0"
            step="500"
            placeholder="e.g. 20000"
            value={budget || ''}
            onChange={(e) => setBudget(Math.max(0, Number(e.target.value)))}
          />
          
          {/* Quick budget chip selector */}
          <div style={{ display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', alignSelf: 'center' }}>Quick set:</span>
            {presetBudgets.map((amt) => (
              <button
                key={amt}
                type="button"
                className={`city-chip ${budget === amt ? 'selected' : ''}`}
                onClick={() => setBudget(amt)}
              >
                ₹{amt.toLocaleString('en-IN')}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
