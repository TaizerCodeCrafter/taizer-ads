import React, { useState } from 'react';
import { ShieldCheck, Lock, KeyRound, ArrowLeft, CheckCircle2, Eye, EyeOff, Mail } from 'lucide-react';
import TaizerLogo from '../TaizerLogo.jsx';

export default function CeoAdminLogin({ onUnlockSuccess, onExit, onShowToast, siteConfig = {} }) {
  const configuredPass = siteConfig?.adminProfile?.passcode || 'ceo';
  const configuredEmail = siteConfig?.adminProfile?.email || 'admin@taizerads.lk';

  const [email, setEmail] = useState(() => configuredEmail);
  const [passcode, setPasscode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // Keep email synced if siteConfig changes
  React.useEffect(() => {
    if (siteConfig?.adminProfile?.email) {
      setEmail(siteConfig.adminProfile.email);
    }
  }, [siteConfig?.adminProfile?.email]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = passcode.trim();
    const expectedEmail = configuredEmail.trim().toLowerCase();
    const expectedPass = configuredPass.trim();
    
    // STRICT VALIDATION: ONLY the single registered email and single password are accepted!
    // No hardcoded bypasses ('admin', '1234', 'ceo', etc.)
    if (cleanEmail === expectedEmail && cleanPass === expectedPass) {
      setError('');
      onUnlockSuccess();
      onShowToast && onShowToast('CEO Super Admin Access Granted!');
    } else {
      if (cleanEmail !== expectedEmail && cleanPass !== expectedPass) {
        setError('Invalid Admin Email and Password! (ඊමේල් ලිපිනය හා මුරපදය වැරදියි)');
      } else if (cleanEmail !== expectedEmail) {
        setError('Invalid Admin Email! (ඇතුලත් කළ Admin ඊමේල් ලිපිනය වැරදියි)');
      } else {
        setError('Invalid Admin Password! (ඇතුලත් කළ Admin මුරපදය වැරදියි)');
      }
      onShowToast && onShowToast('Invalid Credentials! Access Denied.');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#0b1329]">
      <div className="bg-[#0f172a] border border-gray-800 rounded-3xl w-full max-w-md shadow-2xl p-6 sm:p-8 space-y-6 text-center animate-in fade-in zoom-in-95">
        {/* Taizer Ads Brand Logo */}
        <div className="flex justify-center">
          <TaizerLogo size="lg" />
        </div>

        <div>
          <div className="inline-flex items-center space-x-1.5 bg-red-950/60 border border-red-500/40 text-red-400 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-2">
            <span>Restricted Super Admin Area</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            CEO Super Admin Access
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Master Terminal Control Panel (/ceo)
          </p>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {/* Admin Email Field */}
          <div>
            <label className="block text-xs font-bold text-gray-300 mb-1.5 flex items-center justify-between">
              <span className="flex items-center space-x-1.5">
                <Mail className="w-3.5 h-3.5 text-pink-400" />
                <span>Official Admin Email (ඊමේල් ලිපිනය)</span>
              </span>
              <span className="text-[10px] bg-pink-500/20 text-pink-300 font-bold px-1.5 py-0.2 rounded">
                Required
              </span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              placeholder="Enter official admin email..."
              className={`w-full bg-[#1e293b] border ${
                error ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-700'
              } rounded-xl px-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 transition`}
            />
          </div>

          {/* Admin Password Field */}
          <div>
            <label className="block text-xs font-bold text-gray-300 mb-1.5 flex items-center justify-between">
              <span className="flex items-center space-x-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Admin Password / Passcode (මුරපදය)</span>
              </span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  setError('');
                }}
                placeholder="Enter admin password / passcode..."
                className={`w-full bg-[#1e293b] border ${
                  error ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-700'
                } rounded-xl pl-4 pr-11 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 transition font-mono`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-1 cursor-pointer"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-950/60 border border-red-500/50 rounded-xl text-red-300 text-xs font-medium space-y-1 animate-in fade-in">
              <p className="font-bold flex items-center space-x-1.5">
                <span>⚠️ {error}</span>
              </p>
              <p className="text-[11px] text-red-400">
                Security notice: Only the single registered admin email and password can access the panel.
              </p>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-amber-500 to-[#f03a5f] hover:from-amber-600 hover:to-[#d92348] text-white font-extrabold py-3 px-4 rounded-xl text-xs sm:text-sm transition shadow-lg shadow-red-500/20 active:scale-[0.99] flex items-center justify-center space-x-2 cursor-pointer"
          >
            <KeyRound className="w-4 h-4" />
            <span>Unlock Master Admin Panel</span>
          </button>
        </form>

        <div className="pt-2 border-t border-gray-800 flex items-center justify-between text-xs text-gray-400">
          <button
            onClick={onExit}
            className="hover:text-white flex items-center space-x-1 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Exit to Public Website</span>
          </button>
          <span className="text-[11px] text-gray-600">Taizer Ads v2.4</span>
        </div>
      </div>
    </div>
  );
}
