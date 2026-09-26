import React, { useState } from 'react';
import { Compass, Check, Search, MapPin, Sparkles, Trees, ShoppingBag, Landmark, HeartHandshake } from 'lucide-react';

const CATEGORY_ICONS = {
  'Mall': <ShoppingBag size={14} color="#38BDF8" />,
  'Parks & Gardens': <Trees size={14} color="#34D399" />,
  'Picnic Spot': <Landmark size={14} color="#FBBF24" />,
  'Religious': <Sparkles size={14} color="#A78BFA" />
};

export function ActivitiesSelector({
  destinationsCatalog = { catalogs: {} },
  selectedCity = '',
  selectedActivities = [], // [ { category, place } ]
  onChangeActivities
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('ALL');

  const normalizedCity = selectedCity.trim().toLowerCase();
  const cityCatalog = destinationsCatalog.catalogs?.[normalizedCity] || {};
  const categories = Object.keys(cityCatalog);

  // Check if an activity is selected
  const isSelected = (category, place) => {
    return selectedActivities.some(
      (a) => a.category.toLowerCase() === category.toLowerCase() && a.place.toLowerCase() === place.toLowerCase()
    );
  };

  const toggleActivity = (category, place) => {
    if (isSelected(category, place)) {
      onChangeActivities(
        selectedActivities.filter(
          (a) => !(a.category.toLowerCase() === category.toLowerCase() && a.place.toLowerCase() === place.toLowerCase())
        )
      );
    } else {
      onChangeActivities([...selectedActivities, { category, place }]);
    }
  };

  // Collect all places from this city
  let allPlaces = [];
  categories.forEach((cat) => {
    const places = cityCatalog[cat] || [];
    places.forEach((p) => {
      allPlaces.push({ category: cat, place: p });
    });
  });

  // If city not in catalog or empty, check if any generic activities exist
  if (allPlaces.length === 0 && destinationsCatalog.catalogs) {
    Object.entries(destinationsCatalog.catalogs).forEach(([cityName, cats]) => {
      Object.entries(cats).forEach(([cat, places]) => {
        places.forEach((p) => {
          allPlaces.push({ category: cat, place: `${p} (${cityName})` });
        });
      });
    });
  }

  // Filter by category and search
  const filteredPlaces = allPlaces.filter((item) => {
    const matchesCat = activeCategoryFilter === 'ALL' || item.category === activeCategoryFilter;
    const matchesSearch = searchTerm === '' || item.place.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div style={{ marginTop: '14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Compass size={18} color="#34D399" />
          <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>
            Activities & Top Attractions ({selectedActivities.length} Selected)
          </h4>
        </div>

        {selectedActivities.length > 0 && (
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => onChangeActivities([])}
            style={{ fontSize: '0.75rem', padding: '4px 8px' }}
          >
            Clear Selected
          </button>
        )}
      </div>

      <div style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
        {/* Filter Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '180px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
            <input
              type="text"
              placeholder="Search spots, temples, forts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '36px', paddingRight: '12px', height: '36px', fontSize: '0.85rem' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            <button
              type="button"
              className={`city-chip ${activeCategoryFilter === 'ALL' ? 'selected' : ''}`}
              onClick={() => setActiveCategoryFilter('ALL')}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`city-chip ${activeCategoryFilter === cat ? 'selected' : ''}`}
                onClick={() => setActiveCategoryFilter(cat)}
              >
                {CATEGORY_ICONS[cat]}
                <span style={{ marginLeft: '4px' }}>{cat}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Places Grid */}
        {filteredPlaces.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.9rem' }}>
            No matching attractions found for "{selectedCity}". You can enter custom activities or select another destination.
          </div>
        ) : (
          <div className="grid-cols-2" style={{ gap: '10px', maxHeight: '280px', overflowY: 'auto', paddingRight: '4px' }}>
            {filteredPlaces.map((item, idx) => {
              const checked = isSelected(item.category, item.place);

              return (
                <div
                  key={`${item.category}-${item.place}-${idx}`}
                  className={`activity-chip-card ${checked ? 'selected' : ''}`}
                  onClick={() => toggleActivity(item.category, item.place)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {CATEGORY_ICONS[item.category] || <MapPin size={14} color="#38BDF8" />}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 600, color: checked ? '#34D399' : 'var(--text-main)' }}>
                        {item.place}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {item.category}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      border: checked ? '2px solid #10B981' : '1px solid var(--border-subtle)',
                      background: checked ? '#10B981' : 'transparent',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {checked && <Check size={12} />}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
