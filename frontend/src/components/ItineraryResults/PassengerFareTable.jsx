import React from 'react';
import { Users, Baby, User, Sparkles, CheckCircle } from 'lucide-react';

export function PassengerFareTable({ passengersBreakdown = [], travelMode = 'bus' }) {
  if (!passengersBreakdown || passengersBreakdown.length === 0) return null;

  return (
    <div style={{ marginTop: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
        <Users size={16} color="#38BDF8" />
        <h5 style={{ fontSize: '0.92rem', fontWeight: 600 }}>Passenger Fare Breakdown</h5>
      </div>

      <div className="data-table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Passenger</th>
              <th>Age</th>
              <th>Fare Category / Status</th>
              <th>One-Way Fare</th>
              <th>Return Fare</th>
              <th style={{ textAlign: 'right' }}>Total Person Fare</th>
            </tr>
          </thead>
          <tbody>
            {passengersBreakdown.map((p, idx) => {
              const isFree = p.status === 'FREE_CHILD' || p.total_fare === 0;
              const isSenior = p.status === 'SENIOR_DISCOUNT';

              return (
                <tr key={p.id || idx}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
                      <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' }}>
                        {idx + 1}
                      </div>
                      <span>{p.name || `Passenger ${idx + 1}`}</span>
                    </div>
                  </td>
                  <td>{p.age} yrs</td>
                  <td>
                    {isFree ? (
                      <span className="badge badge-emerald">
                        <Baby size={12} />
                        Free Child (&lt;10y)
                      </span>
                    ) : isSenior ? (
                      <span className="badge badge-purple">
                        <User size={12} />
                        Senior 25% Discount
                      </span>
                    ) : (
                      <span className="badge badge-cyan">
                        <User size={12} />
                        Standard Fare
                      </span>
                    )}
                  </td>
                  <td>₹{p.one_way_fare.toFixed(2)}</td>
                  <td>₹{p.return_fare.toFixed(2)}</td>
                  <td style={{ textAlign: 'right', fontWeight: 700, color: isFree ? '#34D399' : '#38BDF8' }}>
                    {isFree ? 'FREE (₹0.00)' : `₹${p.total_fare.toFixed(2)}`}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
