import React from 'react';
import { Hotel, Moon, Plus, Minus, Check, Sparkles } from 'lucide-react';

export function HotelSelector({
  hotelsCatalog = [],
  selectedHotel = null, // { hotel_name, room_type, nights }
  onChangeHotel
}) {
  const safeHotels = Array.isArray(hotelsCatalog) ? hotelsCatalog : (hotelsCatalog?.hotels || []);
  const isEnabled = Boolean(selectedHotel);

  const toggleHotelStay = (enabled) => {
    if (enabled) {
      // Default to first hotel and RK or 1BHK
      const firstHotel = safeHotels[0] || { name: 'Omsai', rooms: { RK: 2000, '1BHK': 3000 } };
      const defaultRoom = Object.keys(firstHotel.rooms || {})[0] || '1BHK';
      onChangeHotel({
        hotel_name: firstHotel.name,
        room_type: defaultRoom,
        nights: 1
      });
    } else {
      onChangeHotel(null);
    }
  };

  const handleSelectHotel = (hotelName) => {
    const hotelObj = safeHotels.find((h) => h.name.toLowerCase() === hotelName.toLowerCase());
    const availableRooms = hotelObj ? Object.keys(hotelObj.rooms || {}) : ['1BHK'];
    const currentRoom = selectedHotel?.room_type;
    const roomToUse = availableRooms.includes(currentRoom) ? currentRoom : availableRooms[0];

    onChangeHotel({
      hotel_name: hotelName,
      room_type: roomToUse,
      nights: selectedHotel?.nights || 1
    });
  };

  const handleSelectRoom = (roomType) => {
    if (!selectedHotel) return;
    onChangeHotel({
      ...selectedHotel,
      room_type: roomType
    });
  };

  const updateNights = (delta) => {
    if (!selectedHotel) return;
    const nextNights = Math.max(1, Math.min(30, (selectedHotel.nights || 1) + delta));
    onChangeHotel({
      ...selectedHotel,
      nights: nextNights
    });
  };

  // Compute live hotel total
  const getCurrentHotelObj = () => {
    if (!selectedHotel) return null;
    return safeHotels.find(
      (h) => h.name.toLowerCase() === selectedHotel.hotel_name.toLowerCase()
    );
  };

  const currentHotelObj = getCurrentHotelObj();
  const currentRatePerNight = currentHotelObj?.rooms?.[selectedHotel?.room_type] || 0;
  const totalHotelCost = currentRatePerNight * (selectedHotel?.nights || 1);

  return (
    <div style={{ marginTop: '14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Hotel size={18} color="#818CF8" />
          <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>Hotel Stay & Accommodation</h4>
        </div>

        <label className="custom-switch">
          <div
            className={`switch-track ${isEnabled ? 'checked' : ''}`}
            onClick={() => toggleHotelStay(!isEnabled)}
          >
            <div className={`switch-thumb ${isEnabled ? 'checked' : ''}`} />
          </div>
          <span style={{ fontSize: '0.85rem', color: isEnabled ? '#38BDF8' : 'var(--text-muted)', fontWeight: 500 }}>
            {isEnabled ? 'Hotel Included' : 'No Stay (Day Trip)'}
          </span>
        </label>
      </div>

      {isEnabled && (
        <div className="animate-fade-in" style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
          {/* Nights Counter & Price Banner */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid var(--border-subtle)', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Duration of Stay:</span>
              <div className="qty-counter">
                <button
                  type="button"
                  className="qty-btn"
                  onClick={() => updateNights(-1)}
                  disabled={selectedHotel?.nights <= 1}
                >
                  <Minus size={14} />
                </button>
                <span style={{ minWidth: '40px', textAlign: 'center', fontWeight: 700, fontSize: '0.95rem' }}>
                  {selectedHotel?.nights} {selectedHotel?.nights === 1 ? 'Night' : 'Nights'}
                </span>
                <button
                  type="button"
                  className="qty-btn"
                  onClick={() => updateNights(1)}
                  disabled={selectedHotel?.nights >= 30}
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                Est. Hotel Cost
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#A78BFA' }}>
                ₹{totalHotelCost.toLocaleString('en-IN')}
                <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)', marginLeft: '4px' }}>
                  (₹{currentRatePerNight}/night)
                </span>
              </div>
            </div>
          </div>

          {/* Hotel Selection Cards */}
          <div className="grid-cols-4" style={{ gap: '12px' }}>
            {safeHotels.map((hotel) => {
              const isSelected = selectedHotel?.hotel_name.toLowerCase() === hotel.name.toLowerCase();

              return (
                <div
                  key={hotel.name}
                  className={`hotel-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleSelectHotel(hotel.name)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem', color: isSelected ? '#A78BFA' : 'var(--text-main)' }}>
                      {hotel.name}
                    </span>
                    {isSelected && (
                      <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#6366F1', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Check size={12} />
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {Object.entries(hotel.rooms).map(([roomType, price]) => {
                      const isRoomActive = isSelected && selectedHotel?.room_type === roomType;

                      return (
                        <button
                          key={roomType}
                          type="button"
                          className={`room-type-btn ${isRoomActive ? 'active' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectHotel(hotel.name);
                            handleSelectRoom(roomType);
                          }}
                        >
                          <span>{roomType}</span>
                          <span>₹{price.toLocaleString('en-IN')}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
