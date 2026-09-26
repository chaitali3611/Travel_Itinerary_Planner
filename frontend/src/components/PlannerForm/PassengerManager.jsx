import React from 'react';
import { Users, Plus, Trash2, Baby, User, Sparkles, ShieldCheck } from 'lucide-react';

export function PassengerManager({ 
  passengers = [], 
  onChangePassengers,
  travelMode = 'bus',
  enableSeniorDiscount = true,
  onToggleSeniorDiscount
}) {
  const addPassenger = () => {
    const newPassenger = {
      id: Date.now(),
      name: `Passenger ${passengers.length + 1}`,
      age: 25
    };
    onChangePassengers([...passengers, newPassenger]);
  };

  const removePassenger = (index) => {
    if (passengers.length <= 1) return;
    const updated = passengers.filter((_, i) => i !== index);
    onChangePassengers(updated);
  };

  const updatePassenger = (index, field, value) => {
    const updated = passengers.map((p, i) => {
      if (i === index) {
        return {
          ...p,
          [field]: field === 'age' ? Math.max(0, Math.min(120, parseInt(value) || 0)) : value
        };
      }
      return p;
    });
    onChangePassengers(updated);
  };

  const isPublicTransport = ['bus', 'train'].includes(travelMode?.toLowerCase());

  // Count passenger categories
  const childrenCount = passengers.filter((p) => p.age < 10).length;
  const seniorCount = passengers.filter((p) => p.age >= 60).length;
  const adultCount = passengers.length - childrenCount - seniorCount;

  return (
    <div style={{ marginTop: '10px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Users size={18} color="#38BDF8" />
          <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>Passengers ({passengers.length})</h4>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {isPublicTransport && (
            <label className="custom-switch" title="Apply 25% discount for Senior Citizens (60+) on Bus and Train">
              <div 
                className={`switch-track ${enableSeniorDiscount ? 'checked' : ''}`}
                onClick={() => onToggleSeniorDiscount && onToggleSeniorDiscount(!enableSeniorDiscount)}
              >
                <div className={`switch-thumb ${enableSeniorDiscount ? 'checked' : ''}`} />
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Senior Citizen 25% Off
              </span>
            </label>
          )}

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={addPassenger}
          >
            <Plus size={14} />
            <span>Add Passenger</span>
          </button>
        </div>
      </div>

      {/* Breakdown Pills */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
        <span className="badge badge-cyan">{adultCount} Adults (10-59y)</span>
        {childrenCount > 0 && (
          <span className="badge badge-emerald">
            {childrenCount} Child {isPublicTransport ? '(Free on Bus/Train)' : '(<10y)'}
          </span>
        )}
        {seniorCount > 0 && (
          <span className="badge badge-purple">
            {seniorCount} Senior {isPublicTransport && enableSeniorDiscount ? '(25% Discount)' : '(60+y)'}
          </span>
        )}
      </div>

      {/* Passenger List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {passengers.map((passenger, index) => {
          const isChild = passenger.age < 10;
          const isSenior = passenger.age >= 60;

          return (
            <div key={passenger.id || index} className="passenger-item">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 700, flexShrink: 0 }}>
                {index + 1}
              </div>

              <div style={{ flex: 2, minWidth: '140px' }}>
                <input
                  type="text"
                  placeholder="Passenger Name"
                  value={passenger.name || ''}
                  onChange={(e) => updatePassenger(index, 'name', e.target.value)}
                  style={{ padding: '8px 12px', fontSize: '0.9rem' }}
                />
              </div>

              <div style={{ flex: 1, minWidth: '90px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <input
                    type="number"
                    min="0"
                    max="120"
                    placeholder="Age"
                    value={passenger.age ?? ''}
                    onChange={(e) => updatePassenger(index, 'age', e.target.value)}
                    style={{ padding: '8px 10px', fontSize: '0.9rem', textAlign: 'center' }}
                  />
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>yrs</span>
                </div>
              </div>

              <div style={{ flex: 1.5, minWidth: '150px' }}>
                {isChild ? (
                  <span className="badge badge-emerald" style={{ fontSize: '0.75rem' }}>
                    <Baby size={12} />
                    {isPublicTransport ? 'Free Ride (Age < 10)' : 'Child Fare'}
                  </span>
                ) : isSenior ? (
                  <span className="badge badge-purple" style={{ fontSize: '0.75rem' }}>
                    <User size={12} />
                    {isPublicTransport && enableSeniorDiscount ? '25% Senior Off' : 'Senior (60+)'}
                  </span>
                ) : (
                  <span className="badge badge-cyan" style={{ fontSize: '0.75rem' }}>
                    <User size={12} />
                    Standard Fare
                  </span>
                )}
              </div>

              {passengers.length > 1 && (
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() => removePassenger(index)}
                  title="Remove Passenger"
                  style={{ padding: '8px 10px' }}
                >
                  <Trash2 size={15} />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
