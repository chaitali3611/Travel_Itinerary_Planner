import React, { useState, useEffect } from 'react';
import {
  Compass,
  Sparkles,
  Database,
  Sun,
  Moon,
  RefreshCw,
  Map,
  LayoutDashboard
} from 'lucide-react';
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
      <div className="container">
        <div className="navbar-inner">

          {/* Brand */}
          <div className="nav-brand" onClick={() => onNavigate('home')}>
            <div className="nav-logo-icon">
              <Compass size={22} strokeWidth={2.2} />
            </div>
            <div>
              <div className="nav-brand-name">
                <span className="gradient-text">WanderPlan</span>
              </div>
              <div className="nav-brand-sub">Smart Itinerary Planner</div>
            </div>
          </div>

          {/* Center Navigation Pills */}
          <nav className="nav-center">
            <button
              className={`nav-link-btn ${currentView === 'home' ? 'active' : ''}`}
              onClick={() => onNavigate('home')}
            >
              <Map size={15} />
              Home
            </button>

            <button
              className={`nav-link-btn ${currentView === 'planner' ? 'active' : ''}`}
              onClick={() => onNavigate('planner')}
            >
              <LayoutDashboard size={15} />
              Planner
            </button>

            <button
              className="nav-link-btn"
              onClick={onOpenCatalogs}
              title="Browse Destination, Hotel & Food Catalogs"
            >
              <Database size={15} />
              Catalogs
            </button>

            <button
              className="nav-link-btn"
              onClick={onOpenPresets}
              title="Explore Curated Ready-to-Plan Trips"
            >
              <Sparkles size={15} style={{ color: '#FBBF24' }} />
              Presets
            </button>
          </nav>

          {/* Right Side Controls */}
          <div className="nav-right">
            {/* Live API Health */}
            <div
              className={`health-badge ${backendHealth.online ? '' : 'offline'}`}
              title={
                backendHealth.online
                  ? `FastAPI Backend Online — ${backendHealth.latency}ms`
                  : 'FastAPI Backend Offline or Starting'
              }
              onClick={checkHealth}
            >
              <span className={`status-dot ${backendHealth.online ? '' : 'offline'}`} />
              <span style={{ fontSize: '0.77rem' }}>
                {backendHealth.checking
                  ? 'Pinging...'
                  : backendHealth.online
                  ? `API · ${backendHealth.latency}ms`
                  : 'Offline'}
              </span>
              <RefreshCw
                size={11}
                style={{ opacity: backendHealth.checking ? 1 : 0.55 }}
                className={backendHealth.checking ? 'animate-spin-slow' : ''}
              />
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="btn btn-ghost btn-sm"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
              style={{
                padding: '7px',
                borderRadius: '50%',
                width: 34,
                height: 34,
                border: '1px solid var(--border-medium)'
              }}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
