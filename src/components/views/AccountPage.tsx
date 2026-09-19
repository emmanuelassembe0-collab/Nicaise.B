import React, { useState, useEffect } from 'react';
import {
  User,
  Package,
  Heart,
  Award,
  Calendar,
  ShieldCheck,
  CheckCircle,
  Clock,
  ArrowRight,
  ExternalLink,
  LogOut,
  LogIn,
  Sliders,
} from 'lucide-react';
import { Order, Product, formatFCFA } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

interface AccountPageProps {
  orders: Order[];
  wishlist: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onNavigateToCatalog: () => void;
  onNavigateToAdmin?: () => void;
}

export const AccountPage: React.FC<AccountPageProps> = ({
  orders: initialOrders,
  wishlist,
  onSelectProduct,
  onAddToCart,
  onNavigateToCatalog,
  onNavigateToAdmin,
}) => {
  const { user, isAuthenticated, isAdmin, logout, openAuthModal } = useAuth();
  const [activeTab, setActiveTab] = useState<
    'orders' | 'wishlist' | 'certificates' | 'appointment' | 'profile'
  >('orders');
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  // Sync real orders from backend if logged in
  useEffect(() => {
    if (isAuthenticated) {
      api.orders.getAll()
        .then((fetched: Order[]) => {
          if (fetched && fetched.length > 0) {
            setOrders(fetched);
          }
        })
        .catch((e: unknown) => console.warn('Could not fetch user orders:', e));
    }
  }, [isAuthenticated]);

  // Appointment Form
  const [appointmentBooked, setAppointmentBooked] = useState(false);
  const [appointmentData, setAppointmentData] = useState({
    city: 'Genève - Salon Privé Rue du Rhône',
    date: '2026-10-15',
    time: '15:00',
    guests: '1 personne',
    notes: 'Présentation de la collection Private Collection et du Tourbillon Nocturne.',
  });

  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    setAppointmentBooked(true);
  };

  return (
    <div className="bg-[#FAF8F3] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-8 mb-8 border-b border-[#EDE3D2] gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#C6A15B] font-semibold block mb-1">
              Espace Privilège
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#11100E]">
              Salon Membre & Carnet Horloger
            </h1>
            <p className="text-xs text-[#8A8780] mt-1">
              {user ? (
                <>Bienvenue, {user.firstName} {user.lastName} • Membre NICAISE.A {isAdmin ? '(Direction & Atelier)' : 'Prestige'}</>
              ) : (
                <>Accédez à vos commandes, certificats de manufacture et réservations privées.</>
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {isAdmin && onNavigateToAdmin && (
              <button
                onClick={onNavigateToAdmin}
                className="px-4 py-2 bg-[#11100E] hover:bg-[#C6A15B] text-[#D8BE7A] hover:text-[#11100E] border border-[#C6A15B]/50 text-xs uppercase tracking-wider font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Panneau Administration</span>
              </button>
            )}

            {isAuthenticated ? (
              <button
                onClick={logout}
                className="px-3.5 py-1.5 bg-white border border-[#EDE3D2] hover:border-red-300 text-[#8A8780] hover:text-red-700 text-xs font-medium uppercase tracking-wider flex items-center gap-1.5 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Déconnexion</span>
              </button>
            ) : (
              <button
                onClick={() => openAuthModal('login')}
                className="px-4 py-2 bg-[#C6A15B] hover:bg-[#D8BE7A] text-[#11100E] text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Connexion / Inscription</span>
              </button>
            )}

            <span className="px-3 py-1.5 bg-white border border-[#C6A15B]/50 text-[#C6A15B] text-xs font-mono uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4" />
              <span>Carte Privilège n° {user ? `NA-${user.id.slice(-4).toUpperCase()}` : 'NA-0894'}</span>
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto gap-2 sm:gap-4 pb-4 mb-8 border-b border-[#EDE3D2]">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2.5 text-xs uppercase tracking-wider font-medium whitespace-nowrap flex items-center gap-2 border transition-all ${
              activeTab === 'orders'
                ? 'bg-[#11100E] text-white border-[#11100E]'
                : 'bg-white text-[#8A8780] hover:text-[#11100E] border-[#EDE3D2]'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Historique des commandes ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('wishlist')}
            className={`px-4 py-2.5 text-xs uppercase tracking-wider font-medium whitespace-nowrap flex items-center gap-2 border transition-all ${
              activeTab === 'wishlist'
                ? 'bg-[#11100E] text-white border-[#11100E]'
                : 'bg-white text-[#8A8780] hover:text-[#11100E] border-[#EDE3D2]'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>Liste d'envies ({wishlist.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('certificates')}
            className={`px-4 py-2.5 text-xs uppercase tracking-wider font-medium whitespace-nowrap flex items-center gap-2 border transition-all ${
              activeTab === 'certificates'
                ? 'bg-[#11100E] text-white border-[#11100E]'
                : 'bg-white text-[#8A8780] hover:text-[#11100E] border-[#EDE3D2]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Certificats d'authenticité</span>
          </button>

          <button
            onClick={() => setActiveTab('appointment')}
            className={`px-4 py-2.5 text-xs uppercase tracking-wider font-medium whitespace-nowrap flex items-center gap-2 border transition-all ${
              activeTab === 'appointment'
                ? 'bg-[#11100E] text-white border-[#11100E]'
                : 'bg-white text-[#8A8780] hover:text-[#11100E] border-[#EDE3D2]'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Rendez-vous en salon privé</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2.5 text-xs uppercase tracking-wider font-medium whitespace-nowrap flex items-center gap-2 border transition-all ${
              activeTab === 'profile'
                ? 'bg-[#11100E] text-white border-[#11100E]'
                : 'bg-white text-[#8A8780] hover:text-[#11100E] border-[#EDE3D2]'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Profil & Préférences</span>
          </button>
        </div>

        {/* TAB 1: COMMANDES */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {orders.length === 0 ? (
              <div className="bg-white p-12 text-center border border-[#EDE3D2]">
                <Package className="w-12 h-12 text-[#C6A15B]/50 mx-auto mb-4" />
                <h3 className="font-serif text-2xl text-[#11100E] mb-2">
                  Aucune commande récente
                </h3>
                <p className="text-xs text-[#8A8780] max-w-sm mx-auto mb-6">
                  Vous n'avez pas encore d'acquisition enregistrée sous ce compte.
                </p>
                <button
                  onClick={onNavigateToCatalog}
                  className="px-6 py-3 bg-[#11100E] text-white text-xs uppercase tracking-widest font-semibold hover:bg-[#C6A15B] transition-colors"
                >
                  Découvrir la collection
                </button>
              </div>
            ) : (
              orders.map((ord) => (
                <div key={ord.orderNumber} className="bg-white p-6 border border-[#EDE3D2] shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-[#EDE3D2] gap-2">
                    <div>
                      <span className="font-mono text-sm font-bold text-[#11100E]">
                        Commande {ord.orderNumber}
                      </span>
                      <span className="text-xs text-[#8A8780] block mt-0.5">
                        Passée le {ord.date}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-[#e8f5e9] text-[#2e7d32] text-xs font-medium">
                        ✓ {ord.status}
                      </span>
                      <span className="text-sm font-bold text-[#C6A15B] font-serif">
                        {formatFCFA(ord.total)}
                      </span>
                    </div>
                  </div>

                  {/* Items list */}
                  <div className="space-y-3">
                    {ord.items.map((item) => (
                      <div
                        key={item.product.id}
                        className="flex items-center justify-between gap-4 p-2 hover:bg-[#FAF8F3]"
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={item.product.images.front}
                            alt={item.product.name}
                            referrerPolicy="no-referrer"
                            className="w-12 h-12 object-contain bg-white p-1 border border-[#EDE3D2]"
                          />
                          <div>
                            <span className="text-[10px] uppercase text-[#C6A15B]">
                              {item.product.collection}
                            </span>
                            <h4 className="font-serif text-sm font-medium text-[#11100E]">
                              {item.product.name}
                            </h4>
                            <span className="text-xs text-[#8A8780]">
                              Quantité : {item.quantity} • {item.product.specs.movement}
                            </span>
                          </div>
                        </div>
                        <span className="text-xs font-semibold text-[#11100E]">
                          {formatFCFA(item.product.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#EDE3D2] flex justify-between items-center text-xs text-[#8A8780]">
                    <span>Livraison vers : {ord.customer.address}, {ord.customer.city}</span>
                    <button
                      onClick={() => alert(`Suivi du convoyeur diplomatique pour ${ord.orderNumber} : En transit sécurisé, remise prévue sous 24h.`)}
                      className="text-[#C6A15B] hover:underline font-medium"
                    >
                      Suivre le convoyeur →
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 2: FAVORIS */}
        {activeTab === 'wishlist' && (
          <div>
            {wishlist.length === 0 ? (
              <div className="bg-white p-12 text-center border border-[#EDE3D2]">
                <Heart className="w-12 h-12 text-[#C6A15B]/50 mx-auto mb-4" />
                <h3 className="font-serif text-2xl text-[#11100E] mb-2">
                  Votre liste d'envies est vide
                </h3>
                <p className="text-xs text-[#8A8780] max-w-sm mx-auto mb-6">
                  Explorez notre catalogue et marquez vos pièces favorites pour les conserver ici.
                </p>
                <button
                  onClick={onNavigateToCatalog}
                  className="px-6 py-3 bg-[#11100E] text-white text-xs uppercase tracking-widest font-semibold hover:bg-[#C6A15B] transition-colors"
                >
                  Découvrir les montres
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlist.map((prod) => (
                  <div key={prod.id} className="bg-white p-6 border border-[#EDE3D2] flex flex-col justify-between">
                    <div>
                      <div
                        onClick={() => onSelectProduct(prod)}
                        className="w-full aspect-square bg-[#FAF8F3] p-4 border border-[#EDE3D2]/60 mb-4 cursor-pointer flex items-center justify-center"
                      >
                        <img
                          src={prod.images.front}
                          alt={prod.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-contain hover:scale-105 transition-transform"
                        />
                      </div>
                      <span className="text-[10px] uppercase tracking-wider text-[#C6A15B]">
                        {prod.collection}
                      </span>
                      <h4
                        onClick={() => onSelectProduct(prod)}
                        className="font-serif text-lg text-[#11100E] font-medium cursor-pointer hover:text-[#C6A15B]"
                      >
                        {prod.name}
                      </h4>
                      <p className="text-xs text-[#8A8780] mt-1">{prod.tagline}</p>
                      <div className="text-base font-serif text-[#11100E] font-bold mt-2">
                        {formatFCFA(prod.price)}
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-[#EDE3D2] flex gap-2">
                      <button
                        onClick={() => onAddToCart(prod)}
                        className="flex-1 py-2.5 bg-[#11100E] hover:bg-[#C6A15B] text-white text-[11px] uppercase tracking-wider font-semibold transition-colors"
                      >
                        Ajouter au panier
                      </button>
                      <button
                        onClick={() => onSelectProduct(prod)}
                        className="px-3 py-2.5 border border-[#EDE3D2] text-[11px] text-[#11100E] hover:border-[#C6A15B]"
                      >
                        Voir
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: CERTIFICATS */}
        {activeTab === 'certificates' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 border border-[#C6A15B]/40 shadow-sm relative">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#EDE3D2]">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#C6A15B] font-semibold">
                    Certificat d'Origine & Garantie
                  </span>
                  <h3 className="font-serif text-xl text-[#11100E]">
                    Nicaise.a Automatic Prestige
                  </h3>
                </div>
                <Award className="w-8 h-8 text-[#C6A15B]" />
              </div>

              <div className="space-y-2 text-xs text-[#8A8780] font-mono">
                <p>N° DE SÉRIE : NA-2026-AP-0428</p>
                <p>CALIBRE : NA-9042 Manufacture Automatique</p>
                <p>BOÎTIER : Acier 904L Satiné-Poli</p>
                <p>DATE D'ÉMISSION : 12 Janvier 2026</p>
                <p>MAÎTRE HORLOGER : H. Nicaise (Genève)</p>
                <p className="text-[#2e7d32] font-semibold">STATUT : ACTIF (GARANTIE 24 MOIS)</p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#EDE3D2] flex justify-between items-center text-xs">
                <span className="text-[#8A8780]">Blockchain Timestamp : Verified</span>
                <button
                  onClick={() => alert('Téléchargement du certificat d’authenticité officiel sécurisé au format PDF.')}
                  className="text-[#C6A15B] hover:underline flex items-center gap-1 font-medium"
                >
                  Télécharger le certificat <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="bg-white p-8 border border-[#EDE3D2] shadow-sm flex flex-col justify-center text-center">
              <ShieldCheck className="w-12 h-12 text-[#C6A15B]/50 mx-auto mb-4" />
              <h3 className="font-serif text-xl text-[#11100E] mb-2">
                Enregistrer un nouveau garde-temps
              </h3>
              <p className="text-xs text-[#8A8780] max-w-xs mx-auto mb-6">
                Vous venez d'acquérir une montre Nicaise.a auprès d'un détaillant agréé ou d'un salon privé ? Enregistrez son numéro de série pour activer la garantie manufacture.
              </p>
              <button
                onClick={() => alert('Formulaire d’enregistrement du garde-temps ouvert. Entrez le numéro de série figurant sous le fond saphir.')}
                className="inline-block px-6 py-3 border border-[#C6A15B] text-[#C6A15B] hover:bg-[#C6A15B] hover:text-[#11100E] text-xs uppercase tracking-widest font-semibold transition-colors mx-auto"
              >
                Activer une garantie
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: RENDEZ-VOUS SALON PRIVÉ */}
        {activeTab === 'appointment' && (
          <div className="max-w-2xl mx-auto bg-white p-8 sm:p-12 border border-[#EDE3D2] shadow-sm">
            <span className="text-xs uppercase tracking-[0.3em] text-[#C6A15B] font-semibold block mb-2">
              Expérience Privilège
            </span>
            <h2 className="font-serif text-3xl text-[#11100E] mb-3">
              Réservation en Salon Privé
            </h2>
            <p className="text-xs text-[#8A8780] mb-8 leading-relaxed">
              Nos conseillers horlogers vous accueillent dans un cadre feutré pour vous présenter nos garde-temps d’exception autour d'un grand cru.
            </p>

            {appointmentBooked ? (
              <div className="p-6 bg-[#FAF8F3] border border-[#C6A15B]/40 text-center space-y-3">
                <CheckCircle className="w-10 h-10 text-[#2e7d32] mx-auto" />
                <h3 className="font-serif text-xl text-[#11100E]">
                  Votre rendez-vous est confirmé
                </h3>
                <p className="text-xs text-[#8A8780]">
                  Lieu : <strong>{appointmentData.city}</strong>
                  <br />
                  Date : <strong>{appointmentData.date}</strong> à <strong>{appointmentData.time}</strong>
                </p>
                <p className="text-[11px] text-[#8A8780] italic">
                  Une invitation d'accès et un mot de passe sécurisé vous ont été envoyés par email.
                </p>
                <button
                  onClick={() => setAppointmentBooked(false)}
                  className="mt-4 text-xs text-[#C6A15B] hover:underline"
                >
                  Modifier ma réservation
                </button>
              </div>
            ) : (
              <form onSubmit={handleBookAppointment} className="space-y-4 text-xs">
                <div>
                  <label className="block uppercase tracking-wider text-[#8A8780] font-medium mb-1.5">
                    Salon de réception *
                  </label>
                  <select
                    value={appointmentData.city}
                    onChange={(e) => setAppointmentData({ ...appointmentData, city: e.target.value })}
                    className="w-full bg-[#FAF8F3] border border-[#EDE3D2] px-3.5 py-2.5 text-xs text-[#11100E] focus:outline-none focus:border-[#C6A15B]"
                  >
                    <option value="Genève - Salon Privé Rue du Rhône">Genève - Salon Privé Rue du Rhône</option>
                    <option value="Abidjan - Salon Privilège Cocody Ambassades">Abidjan - Salon Privilège Cocody Ambassades</option>
                    <option value="Paris - Suite Horlogère Place Vendôme">Paris - Suite Horlogère Place Vendôme</option>
                    <option value="Dubaï - Private Lounge DIFC">Dubaï - Private Lounge DIFC</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block uppercase tracking-wider text-[#8A8780] font-medium mb-1.5">
                      Date souhaitée *
                    </label>
                    <input
                      type="date"
                      required
                      value={appointmentData.date}
                      onChange={(e) => setAppointmentData({ ...appointmentData, date: e.target.value })}
                      className="w-full bg-[#FAF8F3] border border-[#EDE3D2] px-3.5 py-2.5 text-xs text-[#11100E] focus:outline-none focus:border-[#C6A15B]"
                    />
                  </div>
                  <div>
                    <label className="block uppercase tracking-wider text-[#8A8780] font-medium mb-1.5">
                      Créneau horaire *
                    </label>
                    <select
                      value={appointmentData.time}
                      onChange={(e) => setAppointmentData({ ...appointmentData, time: e.target.value })}
                      className="w-full bg-[#FAF8F3] border border-[#EDE3D2] px-3.5 py-2.5 text-xs text-[#11100E] focus:outline-none focus:border-[#C6A15B]"
                    >
                      <option value="11:00">11:00 - Matinée</option>
                      <option value="15:00">15:00 - Après-midi</option>
                      <option value="18:30">18:30 - Soirée privée</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-[#8A8780] font-medium mb-1.5">
                    Pièces ou complications que vous souhaitez découvrir
                  </label>
                  <textarea
                    rows={3}
                    value={appointmentData.notes}
                    onChange={(e) => setAppointmentData({ ...appointmentData, notes: e.target.value })}
                    className="w-full bg-[#FAF8F3] border border-[#EDE3D2] px-3.5 py-2.5 text-xs text-[#11100E] focus:outline-none focus:border-[#C6A15B]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#11100E] hover:bg-[#C6A15B] text-white text-xs uppercase tracking-widest font-semibold transition-colors mt-4"
                >
                  Confirmer la demande de rendez-vous
                </button>
              </form>
            )}
          </div>
        )}

        {/* TAB 5: PROFIL */}
        {activeTab === 'profile' && (
          <div className="max-w-xl mx-auto bg-white p-8 border border-[#EDE3D2] shadow-sm space-y-6">
            <h3 className="font-serif text-2xl text-[#11100E]">
              Coordonnées du Titulaire
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-[#EDE3D2]">
                <span className="text-[#8A8780]">Nom complet :</span>
                <span className="text-[#11100E] font-medium">
                  {user ? `${user.firstName} ${user.lastName}` : 'Alexandre de Montmirail'}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#EDE3D2]">
                <span className="text-[#8A8780]">Email vérifié :</span>
                <span className="text-[#11100E] font-medium font-mono">
                  {user ? user.email : 'alexandre@prestige.com'}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#EDE3D2]">
                <span className="text-[#8A8780]">Téléphone sécurisé :</span>
                <span className="text-[#11100E] font-medium">
                  {user?.phone || '+225 07 48 92 10 01'}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#EDE3D2]">
                <span className="text-[#8A8780]">Rôle & Privilèges :</span>
                <span className="text-[#C6A15B] font-semibold uppercase">
                  {isAdmin ? 'Direction & Administrateur Atelier' : 'Cercle NICAISE.A Prestige (Niveau Or)'}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#EDE3D2]">
                <span className="text-[#8A8780]">Sécurité de compte :</span>
                <span className="text-[#2e7d32] font-medium">
                  Chiffrement AES 256-bit • Sessions vérifiées
                </span>
              </div>
            </div>

            <div className="pt-4 flex gap-3">
              {isAdmin && onNavigateToAdmin && (
                <button
                  type="button"
                  onClick={onNavigateToAdmin}
                  className="flex-1 py-3 bg-[#11100E] hover:bg-[#C6A15B] text-white text-xs uppercase tracking-widest font-semibold transition-colors text-center"
                >
                  Gestion Atelier & Boutique
                </button>
              )}
              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={logout}
                  className="px-6 py-3 border border-[#EDE3D2] hover:border-red-300 text-xs text-red-700 uppercase tracking-widest font-medium transition-colors"
                >
                  Déconnexion
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => openAuthModal('login')}
                  className="w-full py-3 bg-[#C6A15B] hover:bg-[#D8BE7A] text-[#11100E] text-xs uppercase tracking-widest font-semibold transition-colors"
                >
                  Se connecter
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
