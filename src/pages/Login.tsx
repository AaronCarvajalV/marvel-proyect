import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const data = await authService.login({ email, password });
      login(data.access_token, data.user);
      navigate(from, { replace: true });
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Credenciales inválidas o error de conexión.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-margin-mobile md:p-margin-desktop overflow-hidden relative z-10">
      
      {/* Cinematic Centered Login Card */}
      <div className="relative w-full max-w-md bg-surface-charcoal/80 backdrop-blur-xl border border-glass-border rounded flex flex-col items-center justify-center p-8 z-10 shadow-[0_1px_12px_rgba(0,210,255,0.1)]">
        
        {/* Subtle cyan lines for visual structure */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
        <div className="absolute top-0 left-0 w-[1px] h-full bg-gradient-to-b from-transparent via-primary to-transparent opacity-50"></div>
        <div className="absolute top-0 right-0 w-[1px] h-full bg-gradient-to-b from-transparent via-primary to-transparent opacity-50"></div>
        
        {/* System Scan Line in Header */}
        <div className="absolute top-0 left-0 w-full h-1 bg-[linear-gradient(90deg,transparent_0%,rgba(0,210,255,0.2)_50%,transparent_100%)]"></div>
        
        {/* Logo / Branding */}
        <div className="mb-8 flex flex-col items-center">
          <span className="material-symbols-outlined text-6xl text-on-surface mb-2" style={{ fontVariationSettings: "'FILL' 0, 'wght' 200, 'GRAD' 0, 'opsz' 48" }}>
            all_inclusive
          </span>
          <h1 className="font-display-lg text-display-lg text-on-surface tracking-tight uppercase">Stark Ind.</h1>
          <p className="font-metadata text-metadata text-primary mt-2 uppercase tracking-[0.2em]">JARVIS Subsystem Active</p>
        </div>

        {/* Form Fields */}
        <form className="w-full space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label className="font-data-mono text-data-mono text-primary flex items-center gap-2" htmlFor="operator_id">
              <span className="material-symbols-outlined text-sm">badge</span>
              OPERATOR_ID
            </label>
            <input 
              className="w-full bg-background border border-[#121316] text-on-surface font-data-mono text-data-mono p-3 focus:outline-none focus:border-primary focus:ring-0 input-glow transition-all duration-300 rounded" 
              id="operator_id" 
              placeholder="ENTER ID SEQUENCE" 
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-1">
            <label className="font-data-mono text-data-mono text-primary flex items-center gap-2" htmlFor="passcode">
              <span className="material-symbols-outlined text-sm">lock</span>
              PASSCODE
            </label>
            <input 
              className="w-full bg-background border border-[#121316] text-on-surface font-data-mono text-data-mono p-3 focus:outline-none focus:border-primary focus:ring-0 input-glow transition-all duration-300 rounded" 
              id="passcode" 
              placeholder="••••••••••••" 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="bg-error-container/20 text-error font-data-mono text-[12px] p-3 rounded border border-error-container/50">
              {error}
            </div>
          )}

          {/* Primary Action Button */}
          <button 
            className="w-full bg-primary text-background font-label-caps text-label-caps py-4 rounded hover:holographic-glow transition-all duration-300 uppercase flex items-center justify-center gap-2 group mt-8 disabled:opacity-50" 
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'AUTHENTICATING...' : 'INITIATE_PROTOCOL'}
            {!isLoading && <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>}
          </button>
        </form>

        {/* System Status Footer */}
        <div className="mt-8 flex items-center gap-2 border border-glass-border rounded bg-primary/10 px-4 py-2">
          <div className="w-2 h-2 rounded-full bg-primary status-dot"></div>
          <span className="font-metadata text-metadata text-primary uppercase">SECURE_CONNECTION_ESTABLISHED</span>
        </div>
      </div>

      {/* Background Atmospheric Glows */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] pointer-events-none -z-10"></div>
      <div className="fixed top-1/4 left-1/4 w-[300px] h-[300px] bg-primary/10 rounded-full blur-[80px] pointer-events-none -z-10"></div>
      <div className="fixed bottom-1/4 right-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[90px] pointer-events-none -z-10"></div>
    </div>
  );
};
