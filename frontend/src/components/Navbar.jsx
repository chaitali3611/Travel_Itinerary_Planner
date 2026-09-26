import React, { useState, useEffect } from 'react';
import { Compass, Sparkles, Activity, MapPin, Database, Sun, Moon, RefreshCw } from 'lucide-react';
import { travelApi } from '../api/travelApi';

export function Navbar({ currentView, onNavigate, onOpenPresets, onOpenCatalogs }) {
  const [backendHealth, setBackendHealth] = useState({ online: false, checking: true, latency: null });
  const [theme, setTheme] = useState('dark');

  const checkHealth = async () => {
    setBackendHealth((prev) => ({ ...prev, checking: true }));
    const startTime = performance.now();
    try {
      const res = await travelApi.getHealth();
      const latency = Math.round(performance.now() - startTime);
      if (res?.success || res?.data?.status === 'healthy') {
        setBackendHealth({ online: true, checking: false, latency });
      } else {
        setBackendHealth({ online: false, checking: false, latency: null });
      }
    } catch {
      setBackendHealth({ online: false, checking: false, latency: null });
    }
  };

  useEffect(() => {
    checkHealth();
    const timer = setInterval(checkHealth, 30000);
    return () => clearInterval(timer);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  return (
    <header className="navbar">
      <div className="container flex-between">
        <div className="nav-brand" onClick={() => onNavigate('home')}>
          <div className="nav-logo-icon">
            <Compass size={24} />
          </div>
          <div>
            <div className="nav-brand-title">
              <span className="gradient-text">WanderPlan</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', letterSpacing: '0.04em' }}>
              SMART ITINERARY PLANNER
            </div>
          </div>
        </div>

        <nav className="nav-links">
          <button
            className={`nav-link-btn ${currentView === 'home' ? 'active' : ''}`}
            onClick={() => onNavigate('home')}
          >
            Home
          </button>
          
          <button
            className={`nav-link-btn ${currentView === 'planner' ? 'active' : ''}`}
            onClick={() => onNavigate('planner')}
          >
            Trip Planner
          </button>

          <button
            className="nav-link-btn"
            onClick={onOpenCatalogs}
            title="Browse Destination, Hotel & Food Catalogs"
          >
            <Database size={15} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
            Catalogs
          </button>

          <button
            className="nav-link-btn"
            onClick={onOpenPresets}
            title="Explore Curated Ready-to-Plan Trips"
          >
            <Sparkles size={15} style={{ verticalAlign: 'middle', marginRight: '4px', color: '#F59E0B' }} />
            Presets
          </button>

          {/* Live API Health Status */}
          <div
            className={`health-badge ${backendHealth.online ? '' : 'offline'}`}
            title={
              backendHealth.online
                ? `FastAPI Backend Online (${backendHealth.latency}ms)`
                : 'FastAPI Backend Offline or Starting'
            }
            onClick={checkHealth}
            style={{ cursor: 'pointer' }}
          >
            <span className={`status-dot ${backendHealth.online ? '' : 'offline'}`} />
            <span>
              {backendHealth.checking
                ? 'Pinging...'
                : backendHealth.online
                ? `API Online (${backendHealth.latency}ms)`
                : 'API Offline'}
            </span>
            <RefreshCw size={12} style={{ opacity: 0.7 }} />
          </div>

          {/* Theme Switch */}
          <button
            onClick={toggleTheme}
            className="btn-secondary btn-sm"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
            style={{ padding: '7px 10px', borderRadius: '50%' }}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </nav>
      </div>
    </header>
  );
}
