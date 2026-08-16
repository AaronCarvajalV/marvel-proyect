import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Menu, X } from 'lucide-react';

export const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Close sidebar on route change on mobile
  useEffect(() => {
    setSidebarOpen(false);
  }, [location]);

  return (
    <div className="layout-container">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 9,
          }}
          className="md:hidden"
        />
      )}

      <div className={`layout-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <Sidebar />
      </div>
      
      <div className="layout-main">
        {/* Mobile Header Toggle */}
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: 'var(--spacing-md)',
            background: 'rgba(20, 20, 21, 0.7)',
            backdropFilter: 'blur(24px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          }}
          className="mobile-header"
        >
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-primary)',
              cursor: 'pointer'
            }}
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <span className="text-label-caps" style={{ marginLeft: 'var(--spacing-md)' }}>MARVEL MISSION CONTROL</span>
        </div>

        <div className="desktop-header">
          <Header />
        </div>

        <main style={{ 
          flex: 1, 
          padding: 'var(--spacing-xl)',
          overflowY: 'auto'
        }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};
