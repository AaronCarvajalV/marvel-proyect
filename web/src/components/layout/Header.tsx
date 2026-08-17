import React from 'react';
import { Bell, Search } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header style={{
      height: '72px',
      padding: '0 var(--spacing-xl)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
      background: 'rgba(10, 10, 11, 0.4)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      position: 'sticky',
      top: 0,
      zIndex: 5,
    }}>
      {/* Global Search Placeholder */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-md)',
        background: 'rgba(255, 255, 255, 0.05)',
        padding: '8px 16px',
        borderRadius: 'var(--radius-full)',
        width: '300px',
        border: '1px solid var(--border-subtle)'
      }}>
        <Search size={18} style={{ color: 'var(--text-muted)' }} />
        <input 
          type="text"
          placeholder="Buscar operativos, misiones..."
          style={{
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-body)',
            fontSize: '14px',
            width: '100%'
          }}
        />
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
        <button style={{
          background: 'transparent',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 'var(--radius-full)',
          width: '40px',
          height: '40px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'var(--text-secondary)',
          cursor: 'pointer',
          position: 'relative',
        }}>
          <Bell size={20} />
          {/* Notification Dot */}
          <span style={{
            position: 'absolute',
            top: '8px',
            right: '10px',
            width: '8px',
            height: '8px',
            background: 'var(--color-primary)',
            borderRadius: '50%',
            border: '2px solid var(--bg-base)'
          }}></span>
        </button>
      </div>
    </header>
  );
};
