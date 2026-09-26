import React, { useEffect } from 'react';
import { 
  Car, 
  Hotel, 
  Utensils, 
  Wallet, 
  ArrowLeft, 
  Printer, 
  Copy, 
  Share2, 
  Sparkles, 
  MapPin, 
  Calendar, 
  CheckCircle,
  TrendingDown,
  Navigation,
  Plus
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { LegResultCard } from './LegResultCard';
import { BudgetVarianceCard } from './BudgetVarianceCard';
import { useToast } from '../Common/Toast';

export function ItineraryDashboard({ 
  itineraryData, 
  onBackToPlanner, 
  onResetTrip 
}) {
  const { addToast } = useToast();

  useEffect(() => {
    // Fire confetti celebration when itinerary dashboard opens
    try {
      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }
  }, []);

  if (!itineraryData) {
    return (
      <div className="container" style={{ padding: '60px 0', textAlign: 'center' }}>
        <h3>No itinerary summary available.</h3>
        <button className="btn btn-primary" onClick={onBackToPlanner} style={{ marginTop: '16px' }}>
          Go to Trip Planner
        </button>
      </div>
    );
  }

  const {
    trip_name = 'My Travel Itinerary',
    budget = 0,
    budget_category = 'Domestic Trip',
    is_within_budget = true,
    budget_variance = 0,
    legs_summary = [],
    grand_totals = {}
  } = itineraryData;

  const {
    total_travel_cost = 0,
    total_hotel_cost = 0,
    total_food_cost = 0,
    overall_total_cost = 0
  } = grand_totals;

  // Print itinerary
  const handlePrint = () => {
    window.print();
  };

  // Copy text summary to clipboard
  const handleCopySummary = () => {
    let summaryText = `🗺️ ${trip_name}\n`;
    summaryText += `💰 Total Estimated Cost: ₹${overall_total_cost.toLocaleString('en-IN')}\n`;
    summaryText += `📊 Budget Category: ${budget_category}\n`;
    summaryText += `🚗 Travel: ₹${total_travel_cost.toLocaleString('en-IN')} | 🏨 Hotel: ₹${total_hotel_cost.toLocaleString('en-IN')} | 🍲 Dining: ₹${total_food_cost.toLocaleString('en-IN')}\n\n`;
    summaryText += `📍 DESTINATION LEGS:\n`;
    legs_summary.forEach((leg, idx) => {
      summaryText += `${idx + 1}. ${leg.source_city} ➔ ${leg.destination_city} (${leg.distance_km} km) - ₹${leg.leg_total_cost.toLocaleString('en-IN')}\n`;
      if (leg.activities?.length > 0) {
        summaryText += `   Activities: ${leg.activities.map(a => a.place).join(', ')}\n`;
      }
    });

    navigator.clipboard.writeText(summaryText).then(() => {
      addToast('Itinerary summary copied to clipboard!', 'success');
    }).catch(() => {
      addToast('Could not copy to clipboard', 'warning');
    });
  };

  return (
    <section className="results-dashboard">
      <div className="container">
        {/* Navigation & Action Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <button className="btn btn-secondary" onClick={onBackToPlanner}>
            <ArrowLeft size={16} />
            <span>Edit Trip Parameters</span>
          </button>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button className="btn btn-secondary" onClick={handleCopySummary} title="Copy Itinerary Text">
              <Copy size={16} />
              <span>Copy Summary</span>
            </button>

            <button className="btn btn-secondary" onClick={handlePrint} title="Print or Save as PDF">
              <Printer size={16} />
              <span>Print Itinerary</span>
            </button>

            <button className="btn btn-primary" onClick={onResetTrip}>
              <Plus size={16} />
              <span>Plan New Trip</span>
            </button>
          </div>
        </div>

        {/* Dashboard Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div className="hero-pill" style={{ margin: '0 auto 12px' }}>
            <Sparkles size={16} />
            <span>Consolidated Itinerary & Bill Summary</span>
          </div>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '8px' }}>
            {trip_name}
          </h1>
          <p style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>
            Calculated via live FastAPI backend with exact geodesic distances, travel modes, and age discounts
          </p>
        </div>

        {/* Grand Totals Metric Cards Grid */}
        <div className="totals-banner-grid">
          {/* Total Travel Cost */}
          <div className="stat-box animate-fade-in">
            <div className="stat-box-icon" style={{ background: 'rgba(14, 165, 233, 0.15)', color: '#38BDF8' }}>
              <Car size={24} />
            </div>
            <div>
              <div className="stat-box-label">Transportation</div>
              <div className="stat-box-value" style={{ color: '#38BDF8' }}>
                ₹{total_travel_cost.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                {legs_summary.length} {legs_summary.length === 1 ? 'Route Leg' : 'Route Legs'}
              </div>
            </div>
          </div>

          {/* Total Hotel Cost */}
          <div className="stat-box animate-fade-in">
            <div className="stat-box-icon" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818CF8' }}>
              <Hotel size={24} />
            </div>
            <div>
              <div className="stat-box-label">Hotel & Stays</div>
              <div className="stat-box-value" style={{ color: '#818CF8' }}>
                ₹{total_hotel_cost.toLocaleString('en-IN')}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                Verified Accommodations
              </div>
            </div>
          </div>

          {/* Total Food Cost */}
          <div className="stat-box animate-fade-in">
            <div className="stat-box-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#FBBF24' }}>
              <Utensils size={24} />
            </div>
            <div>
              <div className="stat-box-label">Food & Dining</div>
              <div className="stat-box-value" style={{ color: '#FBBF24' }}>
                ₹{total_food_cost.toLocaleString('en-IN')}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                Regional Cuisines & Meals
              </div>
            </div>
          </div>

          {/* Grand Overall Total */}
          <div className="stat-box animate-fade-in" style={{ background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.15), rgba(99, 102, 241, 0.15))', border: '1px solid rgba(14, 165, 233, 0.4)' }}>
            <div className="stat-box-icon" style={{ background: 'linear-gradient(135deg, #0EA5E9, #6366F1)', color: 'white' }}>
              <Wallet size={24} />
            </div>
            <div>
              <div className="stat-box-label" style={{ color: 'var(--text-main)', fontWeight: 700 }}>Overall Trip Cost</div>
              <div className="stat-box-value gradient-text">
                ₹{overall_total_cost.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#38BDF8', fontWeight: 600 }}>
                {budget_category}
              </div>
            </div>
          </div>
        </div>

        {/* Financial Budget Analysis Bar */}
        <BudgetVarianceCard
          budget={budget}
          overallTotal={overall_total_cost}
          budgetCategory={budget_category}
          isWithinBudget={is_within_budget}
          budgetVariance={budget_variance}
        />

        {/* Route Stepper / Flow Indicator */}
        <div style={{ margin: '30px 0 20px', padding: '16px 20px', borderRadius: 'var(--radius-lg)', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '0.04em' }}>
            Complete Travel Route & Stop Sequence:
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {legs_summary.map((leg, i) => (
              <React.Fragment key={leg.leg_index || i}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: 'var(--radius-full)', background: 'rgba(14, 165, 233, 0.12)', border: '1px solid rgba(14, 165, 233, 0.3)', fontSize: '0.9rem' }}>
                  <MapPin size={14} color="#0EA5E9" />
                  <strong>{leg.source_city}</strong>
                  <span style={{ color: 'var(--text-muted)' }}>➔</span>
                  <strong>{leg.destination_city}</strong>
                  <span style={{ fontSize: '0.75rem', color: '#38BDF8', marginLeft: '4px' }}>({leg.distance_km}km)</span>
                </div>
                {i < legs_summary.length - 1 && (
                  <span style={{ color: 'var(--text-dim)', fontSize: '1.1rem' }}>•</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Destination-Wise / Leg-Wise Detailed Results */}
        <div style={{ marginTop: '30px' }}>
          <h3 style={{ fontSize: '1.4rem', marginBottom: '16px' }}>
            Destination-Wise Breakdown & Itinerary Schedule
          </h3>
          {legs_summary.map((leg, index) => (
            <LegResultCard key={leg.leg_index || index} leg={leg} legIndex={index} />
          ))}
        </div>

        {/* Bottom Actions */}
        <div style={{ marginTop: '40px', textAlign: 'center', display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary btn-lg" onClick={onBackToPlanner}>
            <ArrowLeft size={18} />
            <span>Modify This Itinerary</span>
          </button>
          
          <button className="btn btn-primary btn-lg" onClick={handlePrint}>
            <Printer size={18} />
            <span>Print / Save Complete Bill</span>
          </button>
        </div>
      </div>
    </section>
  );
}
