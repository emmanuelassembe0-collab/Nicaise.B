import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, Phone, ArrowRight, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AuthModal: React.FC = () => {
  const { authModalOpen, authModalMode, closeAuthModal, openAuthModal, login, register } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!authModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (authModalMode === 'login') {
        await login({ email, password });
      } else if (authModalMode === 'register') {
        await register({ email, password, firstName, lastName, phone });
      } else if (authModalMode === 'forgot') {
        setSuccessMessage('Un lien de réinitialisation sécurisé a été transmis à votre adresse email confidentielle.');
      }
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (role: 'admin' | 'client') => {
    setError(null);
    setLoading(true);
    try {
      if (role === 'admin') {
        await login({ email: 'admin@nicaise-a.com', password: 'AdminNicaise2026!' });
      } else {
        await login({ email: 'alexandre@prestige.com', password: 'ClientNicaise2026!' });
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-[#FAF8F3] border border-[#EDE3D2] shadow-2xl p-8 sm:p-10">
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-2 text-[#8A8780] hover:text-[#11100E] transition-colors"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="text-center mb-8 space-y-2">
          <div className="w-10 h-10 mx-auto rounded-full bg-[#11100E] flex items-center justify-center text-[#C6A15B]">
            <Lock className="w-5 h-5" />
          </div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#C6A15B] font-semibold block">
            Espace Privé & Salons
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl text-[#11100E]">
            {authModalMode === 'login' && 'Connexion à la Maison'}
            {authModalMode === 'register' && 'Rejoindre le Cercle'}
            {authModalMode === 'forgot' && 'Récupération de Compte'}
          </h3>
          <p className="text-xs text-[#8A8780] font-light">
            {authModalMode === 'login' && 'Accédez à votre collection, certificats et commandes.'}
            {authModalMode === 'register' && 'Créez votre profil d’acquéreur privilégié.'}
            {authModalMode === 'forgot' && 'Recevez les instructions par courrier sécurisé.'}
          </p>
        </div>

        {/* Demo Fast Login Buttons */}
        {authModalMode === 'login' && (
          <div className="mb-6 p-3 bg-white border border-[#EDE3D2] space-y-2 text-center">
            <span className="text-[9px] uppercase tracking-wider text-[#8A8780] font-medium block">
              Accès Démonstration Rapide
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin')}
                disabled={loading}
                className="flex-1 py-2 px-3 bg-[#11100E] text-[#C6A15B] text-[10px] uppercase tracking-wider font-semibold hover:bg-black transition-colors"
              >
                Admin (Direction)
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('client')}
                disabled={loading}
                className="flex-1 py-2 px-3 bg-[#C6A15B] text-[#11100E] text-[10px] uppercase tracking-wider font-semibold hover:bg-[#D8BE7A] transition-colors"
              >
                Client VIP
              </button>
            </div>
          </div>
        )}

        {/* Feedback Messages */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {successMessage && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {authModalMode === 'register' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase tracking-wider text-[#8A8780] text-[10px] font-semibold mb-1">
                    Prénom *
                  </label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Alexandre"
                    className="w-full bg-white border border-[#EDE3D2] px-3 py-2.5 text-xs text-[#11100E] focus:outline-none focus:border-[#C6A15B]"
                  />
                </div>
                <div>
                  <label className="block uppercase tracking-wider text-[#8A8780] text-[10px] font-semibold mb-1">
                    Nom *
                  </label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="de Montmirail"
                    className="w-full bg-white border border-[#EDE3D2] px-3 py-2.5 text-xs text-[#11100E] focus:outline-none focus:border-[#C6A15B]"
                  />
                </div>
              </div>

              <div>
                <label className="block uppercase tracking-wider text-[#8A8780] text-[10px] font-semibold mb-1">
                  Téléphone de contact
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#8A8780] absolute left-3 top-3" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+225 07 48 92 10 01"
                    className="w-full bg-white border border-[#EDE3D2] pl-9 pr-3 py-2.5 text-xs text-[#11100E] focus:outline-none focus:border-[#C6A15B]"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block uppercase tracking-wider text-[#8A8780] text-[10px] font-semibold mb-1">
              Adresse Email *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#8A8780] absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre.nom@prestige.com"
                className="w-full bg-white border border-[#EDE3D2] pl-9 pr-3 py-2.5 text-xs text-[#11100E] focus:outline-none focus:border-[#C6A15B]"
              />
            </div>
          </div>

          {authModalMode !== 'forgot' && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="uppercase tracking-wider text-[#8A8780] text-[10px] font-semibold">
                  Mot de passe *
                </label>
                {authModalMode === 'login' && (
                  <button
                    type="button"
                    onClick={() => openAuthModal('forgot')}
                    className="text-[10px] text-[#C6A15B] hover:underline"
                  >
                    Mot de passe oublié ?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#8A8780] absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-white border border-[#EDE3D2] pl-9 pr-3 py-2.5 text-xs text-[#11100E] focus:outline-none focus:border-[#C6A15B]"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 bg-[#11100E] hover:bg-[#C6A15B] text-white text-xs uppercase tracking-widest font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span>Vérification en cours...</span>
            ) : (
              <>
                <span>
                  {authModalMode === 'login' && 'Accéder à mon salon'}
                  {authModalMode === 'register' && 'Créer mon compte'}
                  {authModalMode === 'forgot' && 'Transmettre le lien'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer switch between modes */}
        <div className="mt-6 pt-4 border-t border-[#EDE3D2] text-center text-xs text-[#8A8780]">
          {authModalMode === 'login' ? (
            <p>
              Pas encore membre du Cercle ?{' '}
              <button
                type="button"
                onClick={() => openAuthModal('register')}
                className="text-[#11100E] font-semibold hover:text-[#C6A15B] underline ml-1"
              >
                Créer un compte
              </button>
            </p>
          ) : (
            <p>
              Déjà inscrit ?{' '}
              <button
                type="button"
                onClick={() => openAuthModal('login')}
                className="text-[#11100E] font-semibold hover:text-[#C6A15B] underline ml-1"
              >
                Se connecter
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
