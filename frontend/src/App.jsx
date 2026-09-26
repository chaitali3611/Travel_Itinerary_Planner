import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { TripPlanner } from './components/PlannerForm/TripPlanner';
import { ItineraryDashboard } from './components/ItineraryResults/ItineraryDashboard';
import { CatalogsModal } from './components/PlannerForm/CatalogsModal';
import { PresetsModal } from './components/PlannerForm/PresetsModal';
import { LoadingOverlay } from './components/Common/LoadingOverlay';
import { ToastProvider, useToast } from './components/Common/Toast';
import { travelApi } from './api/travelApi';
import { PRESET_TRIPS } from './constants/presets';

// Default starter itinerary
const DEFAULT_INITIAL_TRIP = {
  tripName: 'My Maharashtra Exploration 2026',
  budget: 20000,
  legs: [
    {
      leg_index: 1,
      source_city: 'mumbai',
      destination_city: 'pune',
      travel_mode: 'bus',
      is_round_trip: true,
      enable_senior_discount: true,
      passengers: [
        { id: 1, name: 'Traveler 1', age: 28 },
        { id: 2, name: 'Grandfather', age: 65 }
      ],
      hotel: {
        hotel_name: 'Omsai',
        room_type: '1BHK',
        nights: 2
      },
      food_orders: [
        { cuisine: 'Maharashtrian', item_name: 'Puran-Poli', quantity: 2 },
        { cuisine: 'Maharashtrian', item_name: 'Dal-Rice', quantity: 2 }
      ],
      activities: [
        { category: 'Picnic Spot', place: 'Sinhagad Fort' },
        { category: 'Religious', place: 'Dagdu Sheth Ganapati' }
      ]
    }
  ]
};

function MainApp() {
  const { addToast } = useToast();

  const [currentView, setCurrentView] = useState('home'); // 'home' | 'planner' | 'result'
  const [tripData, setTripData] = useState(DEFAULT_INITIAL_TRIP);
  const [itineraryResult, setItineraryResult] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Modals state
  const [isCatalogsModalOpen, setIsCatalogsModalOpen] = useState(false);
  const [isPresetsModalOpen, setIsPresetsModalOpen] = useState(false);

  // Catalogs fetched from backend
  const [catalogsData, setCatalogsData] = useState({
    destinations: { cities: [], catalogs: {} },
    hotels: { hotels: [] },
    food: { cuisines: {} },
    travelModes: { rates_per_km: {} }
  });

  // Fetch catalogs on startup
  useEffect(() => {
    async function loadCatalogs() {
      try {
        const [dest, hotels, food, modes] = await Promise.allSettled([
          travelApi.getDestinations(),
          travelApi.getHotels(),
          travelApi.getFood(),
          travelApi.getTravelModes()
        ]);

        setCatalogsData({
          destinations: dest.status === 'fulfilled' ? dest.value : { cities: [], catalogs: {} },
          hotels: hotels.status === 'fulfilled' ? hotels.value : { hotels: [] },
          food: food.status === 'fulfilled' ? food.value : { cuisines: {} },
          travelModes: modes.status === 'fulfilled' ? modes.value : { rates_per_km: {} }
        });
      } catch (err) {
        console.warn('Could not load catalogs from backend:', err);
      }
    }
    loadCatalogs();
  }, []);

  // Load a preset itinerary
  const handleLoadPreset = (preset) => {
    setTripData({
      tripName: preset.name,
      budget: preset.budget,
      legs: JSON.parse(JSON.stringify(preset.legs))
    });
    setCurrentView('planner');
    addToast(`Loaded preset: "${preset.name}"`, 'success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset trip to clean state
  const handleResetTrip = () => {
    setTripData({
      tripName: 'New Travel Itinerary',
      budget: 15000,
      legs: [
        {
          leg_index: 1,
          source_city: 'mumbai',
          destination_city: 'pune',
          travel_mode: 'bus',
          is_round_trip: true,
          enable_senior_discount: true,
          passengers: [{ id: 1, name: 'Passenger 1', age: 25 }],
          hotel: null,
          food_orders: [],
          activities: []
        }
      ]
    });
    setItineraryResult(null);
    setCurrentView('planner');
    addToast('Started a fresh trip plan', 'info');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Generate Itinerary API Call
  const handleGenerateItinerary = async () => {
    setIsCalculating(true);

    try {
      // Format payload according to ItinerarySummaryRequest schema
      const payload = {
        trip_name: tripData.tripName || 'My Travel Itinerary',
        budget: Number(tripData.budget) || 0,
        legs: tripData.legs.map((leg, index) => ({
          leg_index: index + 1,
          source_city: leg.source_city.trim(),
          destination_city: leg.destination_city.trim(),
          travel_mode: leg.travel_mode || 'bus',
          is_round_trip: Boolean(leg.is_round_trip),
          passengers: (leg.passengers || []).map((p, pIdx) => ({
            id: p.id || pIdx + 1,
            name: p.name || `Passenger ${pIdx + 1}`,
            age: Number(p.age) || 18
          })),
          activities: (leg.activities || []).map((a) => ({
            category: a.category,
            place: a.place
          })),
          hotel: leg.hotel ? {
            hotel_name: leg.hotel.hotel_name,
            room_type: leg.hotel.room_type,
            nights: Number(leg.hotel.nights) || 1
          } : null,
          food_orders: (leg.food_orders || []).map((f) => ({
            cuisine: f.cuisine || null,
            item_name: f.item_name,
            quantity: Number(f.quantity) || 1
          }))
        }))
      };

      const result = await travelApi.calculateItinerarySummary(payload);
      
      setItineraryResult(result);
      setCurrentView('result');
      addToast('Itinerary and consolidated bill generated successfully!', 'success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Error calculating itinerary summary:', err);
      const msg = err.message || 'Failed to calculate itinerary with backend';
      addToast(`Calculation Error: ${msg}`, 'error', 6000);
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="app-layout">
      {/* Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenPresets={() => setIsPresetsModalOpen(true)}
        onOpenCatalogs={() => setIsCatalogsModalOpen(true)}
      />

      {/* Main View Router */}
      <main>
        {currentView === 'home' && (
          <HeroSection
            onStartPlanner={() => {
              setCurrentView('planner');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onLoadPreset={handleLoadPreset}
            onOpenCatalogs={() => setIsCatalogsModalOpen(true)}
          />
        )}

        {currentView === 'planner' && (
          <TripPlanner
            tripData={tripData}
            onChangeTripData={setTripData}
            catalogsData={catalogsData}
            onGenerateItinerary={handleGenerateItinerary}
            isCalculating={isCalculating}
            onOpenPresets={() => setIsPresetsModalOpen(true)}
          />
        )}

        {currentView === 'result' && (
          <ItineraryDashboard
            itineraryData={itineraryResult}
            onBackToPlanner={() => {
              setCurrentView('planner');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onResetTrip={handleResetTrip}
          />
        )}
      </main>

      {/* Footer */}
      <footer style={{ padding: '36px 0', borderTop: '1px solid var(--border-subtle)', textAlign: 'center', marginTop: '60px', background: 'rgba(9, 13, 22, 0.9)' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="gradient-text" style={{ fontWeight: 800, fontSize: '1.1rem' }}>WanderPlan</span>
            <span style={{ color: 'var(--text-dim)' }}>• Modern Multi-Destination Travel Planning Suite</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
            Real-time geodesic routing, passenger age rules & multi-leg itinerary cost dashboard. Connected to FastAPI backend.
          </p>
        </div>
      </footer>

      {/* Modals & Overlays */}
      <CatalogsModal
        isOpen={isCatalogsModalOpen}
        onClose={() => setIsCatalogsModalOpen(false)}
        catalogsData={catalogsData}
      />

      <PresetsModal
        isOpen={isPresetsModalOpen}
        onClose={() => setIsPresetsModalOpen(false)}
        onLoadPreset={handleLoadPreset}
      />

      <LoadingOverlay
        isVisible={isCalculating}
        message="Computing multi-destination travel itinerary..."
      />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <MainApp />
    </ToastProvider>
  );
}
