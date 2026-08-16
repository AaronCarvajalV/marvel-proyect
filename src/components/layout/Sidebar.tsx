import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Shield, LayoutDashboard, Users, UserPlus, FileText, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar: React.FC = () => {
  const { logout, user } = useAuth();
  const location = useLocation();

  const navItems = [
    { name: 'System Overview', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Hero Network', path: '/heroes', icon: Users },
    { name: 'Onboarding', path: '/onboarding', icon: UserPlus },
    { name: 'Missions & Docs', path: '/missions', icon: FileText },
  ];

  if (user?.role === 'ADMIN') {
    navItems.push({ name: 'System Core', path: '/settings', icon: Settings });
  }

  return (
    <aside style={{
      width: '280px',
      height: '100vh',
      background: 'rgba(20, 20, 21, 0.7)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      borderRight: '1px solid rgba(255, 255, 255, 0.05)',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      left: 0,
      top: 0,
      zIndex: 10,
    }}>
      {/* Brand */}
      <div style={{
        padding: 'var(--spacing-xl) var(--spacing-lg)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-md)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
      }}>
        <div style={{
          background: 'var(--color-primary)',
          color: '#fff',
          width: '32px',
          height: '32px',
          borderRadius: 'var(--radius-sm)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          boxShadow: '0 0 10px rgba(226, 54, 54, 0.5)'
        }}>
          <Shield size={20} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span className="text-label-caps" style={{ color: 'var(--color-primary)' }}>SHIELD</span>
          <span className="text-metadata" style={{ fontSize: '10px' }}>MISSION CONTROL</span>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{
        flex: 1,
        padding: 'var(--spacing-lg) var(--spacing-md)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-xs)'
      }}>
        <div className="text-label-caps" style={{ 
          color: 'var(--text-muted)', 
          padding: 'var(--spacing-sm) var(--spacing-sm)', 
          marginBottom: 'var(--spacing-xs)' 
        }}>
          MODULES
        </div>
        
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          const Icon = item.icon;
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-md)',
                padding: '12px var(--spacing-md)',
                borderRadius: 'var(--radius-md)',
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                background: isActive ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                borderLeft: isActive ? '3px solid var(--color-primary)' : '3px solid transparent',
                textDecoration: 'none',
                transition: 'all 0.2s',
              }}
            >
              <Icon size={20} style={{ color: isActive ? 'var(--color-primary)' : 'inherit' }} />
              <span className="text-body-sm">{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* User Section */}
      <div style={{
        padding: 'var(--spacing-lg)',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-md)',
          marginBottom: 'var(--spacing-md)'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: 'var(--radius-full)',
            background: 'var(--bg-popover)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <span className="text-label-caps">{user?.name?.charAt(0) || 'U'}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
            <span className="text-body-sm" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.name || 'Operativo Desconocido'}
            </span>
            <span className="text-metadata" style={{ color: 'var(--text-muted)' }}>
              Nivel: {user?.role || 'CONSULTA'}
            </span>
          </div>
        </div>
        
        <button
          onClick={logout}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'var(--spacing-sm)',
            padding: '10px',
            background: 'rgba(226, 54, 54, 0.1)',
            color: 'var(--status-error)',
            border: '1px solid rgba(226, 54, 54, 0.2)',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          className="text-label-caps"
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(226, 54, 54, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(226, 54, 54, 0.1)';
          }}
        >
          <LogOut size={16} />
          DESCONECTAR
        </button>
      </div>
    </aside>
  );
};
