import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const SideNavBar: React.FC = () => {
  const { logout } = useAuth();

  return (
    <nav className="hidden md:flex flex-col bg-surface-charcoal/90 dark:bg-surface-charcoal/90 fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 backdrop-blur-2xl z-40 border-r border-glass-border pt-8 pb-margin-desktop">
      {/* Header/Profile */}
      <div className="px-6 mb-8 flex items-center gap-4 group cursor-pointer hover:bg-technical-gray/50 hover:text-primary-container transition-all">
        <div className="relative w-12 h-12 rounded-full border border-primary flex items-center justify-center overflow-hidden glow-border group-hover:shadow-[0_0_8px_rgba(0,210,255,0.4)]">
          <img 
            alt="SYSTEM_OPERATOR_BIO_SCAN" 
            className="w-full h-full object-cover mix-blend-screen opacity-80" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAyl43nlpkFmdB0pnZgkVZcYug7rBfRqJ76qZkNJsdYdWJaGHgaeNFpF5vWrsu-utp2kW8vPdDzdQSloeElQnV4nhtjQYS5XjsJztr3jvHwipZx27T341I8RDSfw2-OP0Q4li_-FKZAQeUCWM1ncN_RMB_Dx3Fu7B3oorM8TMlc2Czk3FXhsK8jqHQtX_W2jZnhoexhx3sCX9pS7F5lBJv9-1hIxEpodxSans8O_BtzheKB1m0YlSD_"
          />
        </div>
        <div>
          <h2 className="font-data-mono text-data-mono text-primary font-bold">STRAT_OS</h2>
          <p className="font-metadata text-metadata text-outline">V.2.0.4_STABLE</p>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="flex-1 space-y-1">
        <NavLink 
          to="/dashboard"
          end
          className={({ isActive }) => 
            isActive 
              ? "flex items-center gap-4 text-primary bg-primary/10 border-l-2 border-primary py-3 px-6 shadow-[inset_4px_0_10px_rgba(0,210,255,0.1)] group-hover:translate-x-1 duration-300"
              : "flex items-center gap-4 text-outline py-3 px-6 hover:text-on-surface-variant hover:bg-technical-gray/50 hover:text-primary-container transition-all group-hover:translate-x-1 duration-300"
          }
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
          <span className="font-data-mono text-data-mono">DASHBOARD</span>
        </NavLink>

        <NavLink 
          to="/heroes"
          className={({ isActive }) => 
            isActive 
              ? "flex items-center gap-4 text-primary bg-primary/10 border-l-2 border-primary py-3 px-6 shadow-[inset_4px_0_10px_rgba(0,210,255,0.1)] group-hover:translate-x-1 duration-300"
              : "flex items-center gap-4 text-outline py-3 px-6 hover:text-on-surface-variant hover:bg-technical-gray/50 hover:text-primary-container transition-all group-hover:translate-x-1 duration-300"
          }
        >
          <span className="material-symbols-outlined">lan</span>
          <span className="font-data-mono text-data-mono">NETWORK</span>
        </NavLink>

        <NavLink 
          to="/missions"
          className={({ isActive }) => 
            isActive 
              ? "flex items-center gap-4 text-primary bg-primary/10 border-l-2 border-primary py-3 px-6 shadow-[inset_4px_0_10px_rgba(0,210,255,0.1)] group-hover:translate-x-1 duration-300"
              : "flex items-center gap-4 text-outline py-3 px-6 hover:text-on-surface-variant hover:bg-technical-gray/50 hover:text-primary-container transition-all group-hover:translate-x-1 duration-300"
          }
        >
          <span className="material-symbols-outlined">radar</span>
          <span className="font-data-mono text-data-mono">MISSIONS</span>
        </NavLink>
      </div>

      {/* CTA */}
      <div className="px-6 mb-8">
        <button className="w-full py-2 border border-primary text-primary font-data-mono text-data-mono rounded-DEFAULT hover:bg-primary hover:text-on-primary transition-colors flex justify-center items-center gap-2 glow-border">
          <span className="material-symbols-outlined text-sm">sync</span>
          EXECUTE_SYNC
        </button>
      </div>

      {/* Footer Tabs */}
      <div className="space-y-1 border-t border-glass-border/50 pt-4">
        <a className="flex items-center gap-4 text-outline py-3 px-6 hover:text-on-surface-variant hover:bg-technical-gray/50 hover:text-primary-container transition-all" href="#">
          <span className="material-symbols-outlined text-sm">query_stats</span>
          <span className="font-data-mono text-data-mono">DIAGNOSTICS</span>
        </a>
        <button 
          onClick={logout}
          className="w-full flex items-center gap-4 text-outline py-3 px-6 hover:text-on-surface-variant hover:bg-error/20 hover:text-error transition-all group"
        >
          <span className="material-symbols-outlined text-sm group-hover:text-error">power_settings_new</span>
          <span className="font-data-mono text-data-mono">LOGOUT</span>
        </button>
      </div>
    </nav>
  );
};
