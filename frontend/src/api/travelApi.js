import { apiClient } from './client';

export const travelApi = {
  // Health Check
  async getHealth() {
    return apiClient.get('/api/v1/health');
  },

  // Catalogs
  async getDestinations(city = null) {
    const query = city ? `?city=${encodeURIComponent(city)}` : '';
    const res = await apiClient.get(`/api/v1/catalogs/destinations${query}`);
    return res.data;
  },

  async getHotels() {
    const res = await apiClient.get('/api/v1/catalogs/hotels');
    return res.data;
  },

  async getFood() {
    const res = await apiClient.get('/api/v1/catalogs/food');
    return res.data;
  },

  async getTravelModes() {
    const res = await apiClient.get('/api/v1/catalogs/travel-modes');
    return res.data;
  },

  // Distance Calculation
  async calculateDistance(sourceCity, destinationCity) {
    const res = await apiClient.post('/api/v1/distance/calculate', {
      source_city: sourceCity,
      destination_city: destinationCity
    });
    return res.data;
  },

  // Travel Cost Calculation
  async calculateTravelCost(payload) {
    const res = await apiClient.post('/api/v1/travel/calculate-cost', payload);
    return res.data;
  },

  // Consolidated Itinerary & Summary Calculation
  async calculateItinerarySummary(payload) {
    const res = await apiClient.post('/api/v1/itinerary/calculate-summary', payload);
    return res.data;
  }
};
