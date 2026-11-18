import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Lock, Mail, User, ShieldCheck, Gamepad2, Image, Award, ChevronDown } from 'lucide-react';

export default function AuthModal() {
  const { isAuthModalOpen, setIsAuthModalOpen, login, register, showToast } = useApp();

  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register'
  const [roleCategory, setRoleCategory] = useState('Customer'); // 'Customer' | 'Player'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  // Pro Player picture and profile details
  const [avatarUrl, setAvatarUrl] = useState('');
  const [rankProofPictureUrl, setRankProofPictureUrl] = useState('');
  const [platformSpecialty, setPlatformSpecialty] = useState('PS5');
  const [rankTier, setRankTier] = useState('Top 200 Global');

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      showToast('Please enter both email and password', 'error');
      return;
    }

    if (activeTab === 'login') {
      login(email, password);
    } else {
      if (!name.trim()) {
        showToast('Please enter your gamer username', 'error');
        return;
      }

      const options = {
        avatarUrl: avatarUrl.trim() || null,
        rankProofPictureUrl: rankProofPictureUrl.trim() || null,
        platformSpecialty,
        competitiveRankTier: rankTier,
      };

      register(name, email, password, roleCategory, options);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md select-none font-sans overflow-y-auto">
      <div className="w-full max-w-md bg-[#141824] border border-[#262B3D] rounded-3xl p-5 sm:p-7 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-5 right-5 p-1.5 rounded-xl hover:bg-[#1C2234] text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-5 space-y-1.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00F59B] to-[#00D687] text-[#0B0D13] flex items-center justify-center font-black text-xl italic mx-auto shadow-lg shadow-[#00F59B]/20">
            BH
          </div>
          <h3 className="text-xl font-black text-white uppercase tracking-wider">
            {activeTab === 'login' ? 'Welcome Back' : (roleCategory === 'Player' ? 'Register Pro Player' : 'Create Customer Account')}
          </h3>
          <p className="text-xs text-gray-400">
            {roleCategory === 'Player'
              ? 'Join our verified roster: claim client orders and earn fast payouts.'
              : 'Track orders, view receipts, and chat live with your assigned pro.'}
          </p>
        </div>

        {/* Main Tabs: Sign In / Register */}
        <div className="grid grid-cols-2 gap-2 bg-[#0B0D13] p-1 rounded-xl mb-4 border border-[#262B3D]">
          <button
            onClick={() => setActiveTab('login')}
            className={`py-2 rounded-lg text-xs font-bold uppercase transition-all ${
              activeTab === 'login'
                ? 'bg-[#141824] text-[#00F59B] border border-[#262B3D]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`py-2 rounded-lg text-xs font-bold uppercase transition-all ${
              activeTab === 'register'
                ? 'bg-[#141824] text-[#00F59B] border border-[#262B3D]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Register
          </button>
        </div>

        {/* Role Category Switcher (When Registering) */}
        {activeTab === 'register' && (
          <div className="mb-4 p-1.5 bg-[#0B0D13] rounded-2xl border border-[#262B3D] space-y-1">
            <span className="text-[10px] uppercase font-black text-gray-400 px-2 tracking-wider block">
              I am joining as:
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => setRoleCategory('Customer')}
                className={`py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center space-x-1.5 ${
                  roleCategory === 'Customer'
                    ? 'bg-[#00F59B] text-[#0B0D13] shadow-md shadow-[#00F59B]/20'
                    : 'bg-[#141824] text-gray-400 hover:text-white'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>CUSTOMER</span>
              </button>
              <button
                type="button"
                onClick={() => setRoleCategory('Player')}
                className={`py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center space-x-1.5 ${
                  roleCategory === 'Player'
                    ? 'bg-[#00F59B] text-[#0B0D13] shadow-md shadow-[#00F59B]/20'
                    : 'bg-[#141824] text-gray-400 hover:text-white'
                }`}
              >
                <Gamepad2 className="w-3.5 h-3.5" />
                <span>PRO PLAYER</span>
              </button>
            </div>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {activeTab === 'register' && (
            <div>
              <label className="text-gray-400 font-semibold block mb-1">
                {roleCategory === 'Player' ? 'Pro Nickname / Gamer Tag' : 'Gamer Username'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder={roleCategory === 'Player' ? 'e.g. Pro_Kaiser' : 'e.g. AlexGamer'}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#0B0D13] border border-[#262B3D] rounded-xl pl-9 pr-3 py-2.5 text-white focus:outline-none focus:border-[#00F59B]"
                />
                <User className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
              </div>
            </div>
          )}

          <div>
            <label className="text-gray-400 font-semibold block mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="yourname@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0B0D13] border border-[#262B3D] rounded-xl pl-9 pr-3 py-2.5 text-white focus:outline-none focus:border-[#00F59B]"
              />
              <Mail className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="text-gray-400 font-semibold block mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0B0D13] border border-[#262B3D] rounded-xl pl-9 pr-3 py-2.5 text-white focus:outline-none focus:border-[#00F59B]"
              />
              <Lock className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
            </div>
          </div>

          {/* Player Picture Fields */}
          {activeTab === 'register' && roleCategory === 'Player' && (
            <div className="space-y-3 p-3 bg-[#0B0D13] rounded-2xl border border-[#00F59B]/30 animate-in fade-in duration-200">
              <div className="flex items-center space-x-1.5 text-[#00F59B] font-black text-[11px] uppercase tracking-wider">
                <Image className="w-3.5 h-3.5" />
                <span>Player Profile & Verification Pictures</span>
              </div>

              {/* Avatar Picture URL */}
              <div>
                <label className="text-gray-400 font-semibold block mb-1">
                  Profile Picture / Avatar URL
                </label>
                <div className="relative">
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    className="w-full bg-[#141824] border border-[#262B3D] rounded-xl pl-9 pr-3 py-2 text-white focus:outline-none focus:border-[#00F59B] text-xs"
                  />
                  <Image className="w-4 h-4 text-gray-500 absolute left-3 top-2.5" />
                </div>
                {avatarUrl && (
                  <div className="mt-1.5 flex items-center space-x-2">
                    <img src={avatarUrl} alt="Avatar Preview" className="w-7 h-7 rounded-full object-cover border border-[#00F59B]" />
                    <span className="text-[10px] text-[#00F59B]">Avatar preview loaded</span>
                  </div>
                )}
              </div>

              {/* Rank Verification Screenshot Picture URL */}
              <div>
                <label className="text-gray-400 font-semibold block mb-1">
                  Rank Verification Picture / Screenshot URL
                </label>
                <div className="relative">
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={rankProofPictureUrl}
                    onChange={(e) => setRankProofPictureUrl(e.target.value)}
                    className="w-full bg-[#141824] border border-[#262B3D] rounded-xl pl-9 pr-3 py-2 text-white focus:outline-none focus:border-[#00F59B] text-xs"
                  />
                  <Award className="w-4 h-4 text-gray-500 absolute left-3 top-2.5" />
                </div>
                {rankProofPictureUrl && (
                  <div className="mt-1.5 flex items-center space-x-2">
                    <img src={rankProofPictureUrl} alt="Proof Preview" className="w-12 h-8 rounded object-cover border border-[#00F59B]" />
                    <span className="text-[10px] text-[#00F59B]">Rank proof screenshot preview</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-gray-400 font-semibold block mb-1">Platform Specialty</label>
                  <select
                    value={platformSpecialty}
                    onChange={(e) => setPlatformSpecialty(e.target.value)}
                    className="w-full bg-[#141824] border border-[#262B3D] rounded-xl px-2.5 py-2 text-white focus:outline-none focus:border-[#00F59B] text-xs"
                  >
                    <option value="PS5">PlayStation 5</option>
                    <option value="Xbox">Xbox Series X</option>
                    <option value="PC">PC (EA App / Steam)</option>
                  </select>
                </div>
                <div>
                  <label className="text-gray-400 font-semibold block mb-1">Competitive Tier</label>
                  <select
                    value={rankTier}
                    onChange={(e) => setRankTier(e.target.value)}
                    className="w-full bg-[#141824] border border-[#262B3D] rounded-xl px-2.5 py-2 text-white focus:outline-none focus:border-[#00F59B] text-xs"
                  >
                    <option value="Top 200 Global">Top 200 Global</option>
                    <option value="Elite Division (900+ SR)">Elite Division</option>
                    <option value="Rank 1 Weekend League">Rank 1 Weekend League</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-[#00F59B] hover:bg-[#00D687] text-[#0B0D13] font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#00F59B]/20 cursor-pointer mt-2"
          >
            {activeTab === 'login'
              ? 'Sign In to Account'
              : (roleCategory === 'Player' ? 'Register as Pro Player with Pictures' : 'Create Free Customer Account')}
          </button>
        </form>

        {/* Security Footer Note */}
        <div className="mt-5 pt-3.5 border-t border-[#262B3D]/70 flex items-center justify-center space-x-1.5 text-[11px] text-gray-400">
          <ShieldCheck className="w-3.5 h-3.5 text-[#00F59B]" />
          <span>SSL 256-Bit Encrypted Data Protection</span>
        </div>

      </div>
    </div>
  );
}
