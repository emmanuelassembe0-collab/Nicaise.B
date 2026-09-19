import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Watch,
  FolderKanban,
  ShoppingBag,
  Users,
  Boxes,
  CreditCard,
  Truck,
  Tag,
  Star,
  Wrench,
  Settings as SettingsIcon,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp,
  RefreshCw,
  Phone,
  DollarSign,
  ArrowUpRight,
  Search,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import {
  Product,
  Order,
  User,
  Review,
  Promotion,
  InventoryItem,
  PaymentRecord,
  SavTicket,
  ShippingZone,
  StoreSettings,
  formatFCFA,
} from '../../types';

type AdminTab =
  | 'dashboard'
  | 'products'
  | 'collections'
  | 'orders'
  | 'customers'
  | 'stock'
  | 'payments'
  | 'shipping'
  | 'promotions'
  | 'reviews'
  | 'sav'
  | 'settings';

interface AdminPageProps {
  onNavigateToHome: () => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onNavigateToHome }) => {
  const { user, isAdmin, openAuthModal } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [loading, setLoading] = useState(true);

  // Data states
  const [stats, setStats] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<User[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [savTickets, setSavTickets] = useState<SavTicket[]>([]);
  const [shippingZones, setShippingZones] = useState<ShippingZone[]>([]);
  const [settings, setSettings] = useState<StoreSettings | null>(null);

  // Modals / forms
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [newPromoModalOpen, setNewPromoModalOpen] = useState(false);
  const [newPromo, setNewPromo] = useState<Partial<Promotion>>({
    code: '',
    discountPercent: 10,
    minAmount: 500000,
    maxUses: 50,
  });

  // Action messages
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const showNotice = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 4000);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [
        statsData,
        productsData,
        ordersData,
        customersData,
        inventoryData,
        paymentsData,
        promosData,
        reviewsData,
        savData,
        zonesData,
        settingsData,
      ] = await Promise.all([
        api.admin.getStats().catch(() => null),
        api.products.getAll({ includeDrafts: 'true' }).catch(() => []),
        api.orders.getAll().catch(() => []),
        api.admin.getUsers().catch(() => []),
        api.inventory.getAll().catch(() => []),
        api.payments.getAllAdmin().catch(() => []),
        api.promotions.getAll().catch(() => []),
        api.reviews.getAllAdmin().catch(() => []),
        api.sav.getAll().catch(() => []),
        api.shipping.getZones().catch(() => []),
        api.settings.get().catch(() => null),
      ]);

      setStats(statsData);
      setProducts(productsData);
      setOrders(ordersData);
      setCustomers(customersData);
      setInventory(inventoryData);
      setPayments(paymentsData);
      setPromotions(promosData);
      setReviews(reviewsData);
      setSavTickets(savData);
      setShippingZones(zonesData);
      setSettings(settingsData);
    } catch (err) {
      console.error('Erreur chargement admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadData();
    }
  }, [isAdmin]);

  // Auth gate
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#FAF8F3] py-24 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-white border border-[#EDE3D2] p-8 sm:p-10 text-center shadow-lg space-y-4">
          <div className="w-12 h-12 bg-[#11100E] text-[#C6A15B] rounded-full flex items-center justify-center mx-auto">
            <Watch className="w-6 h-6" />
          </div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#C6A15B] font-semibold block">
            Accès Réservé
          </span>
          <h2 className="font-serif text-3xl text-[#11100E]">Salon de Direction</h2>
          <p className="text-xs text-[#8A8780] leading-relaxed">
            L'administration de la Maison NICAISE.A requiert des accréditations d'administrateur.
          </p>
          <div className="pt-4 flex flex-col gap-2">
            <button
              onClick={() => openAuthModal('login')}
              className="py-3 px-6 bg-[#11100E] hover:bg-[#C6A15B] text-white text-xs uppercase tracking-widest font-semibold transition-colors"
            >
              Se connecter en tant qu'Administrateur
            </button>
            <button
              onClick={onNavigateToHome}
              className="py-2.5 px-6 border border-[#EDE3D2] text-[#8A8780] hover:text-[#11100E] text-xs uppercase tracking-widest"
            >
              Retour à la boutique
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Handle Product Save
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.name || !editingProduct.price) return;
    try {
      if (editingProduct.id) {
        await api.products.update(editingProduct.id, editingProduct);
        showNotice(`Montre "${editingProduct.name}" mise à jour avec succès.`);
      } else {
        await api.products.create(editingProduct);
        showNotice(`Nouvelle montre "${editingProduct.name}" enregistrée au catalogue.`);
      }
      setIsProductModalOpen(false);
      setEditingProduct(null);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Erreur sauvegarde');
    }
  };

  // Toggle publish
  const handleTogglePublish = async (id: string) => {
    try {
      const updated = await api.products.togglePublish(id);
      showNotice(`Montre ${updated.status === 'published' ? 'publiée' : 'dépubliée'}.`);
      loadData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Delete product
  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('Confirmer le retrait définitif de ce garde-temps du catalogue ?')) return;
    try {
      await api.products.delete(id);
      showNotice('Montre retirée avec succès.');
      loadData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Update order status
  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await api.orders.updateStatus(orderId, newStatus);
      showNotice(`Commande mise à jour : ${newStatus}`);
      loadData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Update stock item
  const handleUpdateStock = async (productId: string, stock: number) => {
    try {
      await api.inventory.update(productId, { stock });
      showNotice('Stock mis à jour.');
      loadData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Moderate review
  const handleModerateReview = async (id: string, isApproved: boolean) => {
    try {
      await api.reviews.moderate(id, isApproved);
      showNotice(`Avis ${isApproved ? 'approuvé' : 'rejeté'}.`);
      loadData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Update SAV ticket
  const handleUpdateSav = async (ticketId: string, status: string, notes?: string) => {
    try {
      await api.sav.updateTicket(ticketId, { status, notes });
      showNotice(`Dossier SAV ${status}`);
      loadData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    try {
      await api.settings.update(settings);
      showNotice('Configuration de la boutique et de WhatsApp enregistrée.');
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Add Promo
  const handleCreatePromo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.promotions.create(newPromo);
      setNewPromoModalOpen(false);
      setNewPromo({ code: '', discountPercent: 10, minAmount: 500000, maxUses: 50 });
      showNotice('Nouveau code privilège activé.');
      loadData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="bg-[#FAF8F3] min-h-screen">
      {/* Top Admin Bar */}
      <div className="bg-[#11100E] text-white border-b border-[#332A20] px-4 sm:px-8 py-3 flex justify-between items-center text-xs">
        <div className="flex items-center gap-3">
          <span className="font-serif tracking-widest text-[#C6A15B] text-base font-semibold">NICAISE.A</span>
          <span className="text-[#8A8780]">|</span>
          <span className="uppercase tracking-widest text-[10px] text-[#EDE3D2]/80">Direction & Administration</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[#EDE3D2]/80 hidden sm:inline">
            Connecté : <strong>{user?.firstName} {user?.lastName}</strong> ({user?.email})
          </span>
          <button
            onClick={loadData}
            className="p-1.5 hover:text-[#C6A15B] transition-colors"
            title="Rafraîchir les données"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={onNavigateToHome}
            className="px-3 py-1 bg-[#C6A15B] hover:bg-[#D8BE7A] text-[#11100E] text-[10px] uppercase tracking-wider font-semibold"
          >
            Voir la Boutique
          </button>
        </div>
      </div>

      {/* Action Notification */}
      {actionNotice && (
        <div className="fixed top-14 right-6 z-50 bg-[#11100E] text-[#C6A15B] border border-[#C6A15B] px-5 py-3 text-xs shadow-xl flex items-center gap-2 animate-fade-in">
          <CheckCircle className="w-4 h-4" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Main Admin Workspace with Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sidebar */}
          <aside className="lg:col-span-3 bg-white border border-[#EDE3D2] p-4 space-y-1">
            <span className="text-[9px] uppercase tracking-[0.25em] text-[#C6A15B] font-semibold px-3 py-2 block">
              Menu Direction
            </span>

            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'products', label: 'Montres & Catalogue', icon: Watch, count: products.length },
              { id: 'stock', label: 'Gestion des Stocks', icon: Boxes, alert: stats?.kpis?.lowStockCount },
              { id: 'orders', label: 'Commandes', icon: ShoppingBag, count: orders.length },
              { id: 'customers', label: 'Clients VIP', icon: Users, count: customers.length },
              { id: 'payments', label: 'Paiements', icon: CreditCard, count: payments.length },
              { id: 'promotions', label: 'Codes Privilège', icon: Tag, count: promotions.length },
              { id: 'reviews', label: 'Avis & Témoignages', icon: Star, count: reviews.length },
              { id: 'sav', label: 'Service Après-Vente', icon: Wrench, count: savTickets.length },
              { id: 'shipping', label: 'Livraisons & Tarifs', icon: Truck },
              { id: 'settings', label: 'Paramètres & WhatsApp', icon: SettingsIcon },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as AdminTab)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 text-xs transition-colors ${
                    isActive
                      ? 'bg-[#11100E] text-[#C6A15B] font-semibold'
                      : 'text-[#332A20] hover:bg-[#FAF8F3]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.alert ? (
                    <span className="px-1.5 py-0.5 bg-red-100 text-red-700 text-[10px] font-bold rounded">
                      {item.alert} alertes
                    </span>
                  ) : item.count !== undefined ? (
                    <span className="text-[10px] opacity-60 font-mono">{item.count}</span>
                  ) : null}
                </button>
              );
            })}
          </aside>

          {/* Main Display Area */}
          <main className="lg:col-span-9 bg-white border border-[#EDE3D2] p-6 sm:p-8 min-h-[700px]">
            {/* 1. DASHBOARD OVERVIEW */}
            {activeTab === 'dashboard' && stats && (
              <div className="space-y-8">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#C6A15B] font-semibold block">
                    Vue Globale
                  </span>
                  <h2 className="font-serif text-3xl text-[#11100E]">Tableau de Bord Exécutif</h2>
                  <p className="text-xs text-[#8A8780]">
                    Performance commerciale, trésorerie et état des stocks de la Maison.
                  </p>
                </div>

                {/* 6 Metric Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-[#FAF8F3] border border-[#EDE3D2]">
                    <span className="text-[10px] uppercase tracking-wider text-[#8A8780] block">Chiffre d'Affaires</span>
                    <strong className="font-serif text-2xl text-[#11100E] block mt-1">
                      {formatFCFA(stats.kpis.totalRevenue)}
                    </strong>
                    <span className="text-[10px] text-emerald-700 flex items-center gap-1 mt-1 font-medium">
                      <TrendingUp className="w-3 h-3" /> +18.4% ce mois
                    </span>
                  </div>

                  <div className="p-4 bg-[#FAF8F3] border border-[#EDE3D2]">
                    <span className="text-[10px] uppercase tracking-wider text-[#8A8780] block">Commandes</span>
                    <strong className="font-serif text-2xl text-[#11100E] block mt-1">
                      {stats.kpis.totalOrders}
                    </strong>
                    <span className="text-[10px] text-[#8A8780] block mt-1">Dossiers traités</span>
                  </div>

                  <div className="p-4 bg-[#FAF8F3] border border-[#EDE3D2]">
                    <span className="text-[10px] uppercase tracking-wider text-[#8A8780] block">Clients Acquéreurs</span>
                    <strong className="font-serif text-2xl text-[#11100E] block mt-1">
                      {stats.kpis.totalClients}
                    </strong>
                    <span className="text-[10px] text-[#8A8780] block mt-1">Comptes VIP actifs</span>
                  </div>

                  <div className="p-4 bg-[#FAF8F3] border border-[#EDE3D2]">
                    <span className="text-[10px] uppercase tracking-wider text-[#8A8780] block">Panier Moyen</span>
                    <strong className="font-serif text-2xl text-[#C6A15B] block mt-1">
                      {formatFCFA(stats.kpis.averageBasket)}
                    </strong>
                    <span className="text-[10px] text-[#8A8780] block mt-1">Par acquisition</span>
                  </div>

                  <div className="p-4 bg-[#FAF8F3] border border-[#EDE3D2]">
                    <span className="text-[10px] uppercase tracking-wider text-[#8A8780] block">Montres Vendues</span>
                    <strong className="font-serif text-2xl text-[#11100E] block mt-1">
                      {stats.kpis.totalWatchesSold} pièces
                    </strong>
                    <span className="text-[10px] text-[#8A8780] block mt-1">Calibres délivrés</span>
                  </div>

                  <div className="p-4 bg-[#FAF8F3] border border-[#EDE3D2]">
                    <span className="text-[10px] uppercase tracking-wider text-[#8A8780] block">Stock Disponible</span>
                    <strong className="font-serif text-2xl text-[#11100E] block mt-1">
                      {stats.kpis.totalStockAvailable} pièces
                    </strong>
                    <span className="text-[10px] text-amber-700 block mt-1">
                      {stats.kpis.lowStockCount} alertes seuil
                    </span>
                  </div>
                </div>

                {/* Sales Chart Simulation */}
                <div className="p-6 bg-[#FAF8F3] border border-[#EDE3D2] space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-serif text-lg text-[#11100E]">
                      Évolution du Chiffre d'Affaires & Commandes
                    </h3>
                    <span className="text-[10px] uppercase tracking-wider text-[#C6A15B] font-semibold">
                      Exercice 2025 - 2026
                    </span>
                  </div>

                  <div className="space-y-3 pt-2">
                    {stats.salesTimeline.map((item: any) => {
                      const max = 15000000;
                      const pct = Math.min(100, Math.round((item.revenue / max) * 100));
                      return (
                        <div key={item.period} className="text-xs space-y-1">
                          <div className="flex justify-between text-[11px]">
                            <span className="font-medium text-[#11100E]">{item.period}</span>
                            <span className="font-mono text-[#C6A15B] font-semibold">
                              {formatFCFA(item.revenue)} ({item.orders} commandes)
                            </span>
                          </div>
                          <div className="w-full bg-[#EDE3D2] h-2.5 rounded-full overflow-hidden">
                            <div
                              className="bg-[#11100E] h-full transition-all duration-500"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Top Selling Watches */}
                <div>
                  <h3 className="font-serif text-xl text-[#11100E] mb-4">Garde-temps les Plus Prisés</h3>
                  <div className="space-y-3">
                    {stats.topSelling.map((item: any, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 bg-[#FAF8F3] border border-[#EDE3D2] text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-serif font-bold text-base text-[#C6A15B] w-6">#{idx + 1}</span>
                          <div>
                            <strong className="text-[#11100E] block">{item.product.name}</strong>
                            <span className="text-[10px] text-[#8A8780]">{item.product.collection}</span>
                          </div>
                        </div>
                        <div className="text-right font-mono">
                          <span className="block font-semibold text-[#11100E]">{item.count} vendues</span>
                          <span className="text-[10px] text-[#C6A15B]">{formatFCFA(item.totalRevenue)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 2. PRODUCTS & CATALOG MANAGEMENT */}
            {activeTab === 'products' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h2 className="font-serif text-3xl text-[#11100E]">Catalogue des Montres</h2>
                    <p className="text-xs text-[#8A8780]">
                      {products.length} pièces enregistrées dans le registre de manufacture.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingProduct({
                        name: '',
                        collection: 'Heritage',
                        category: 'Automatique',
                        price: 1500000,
                        stock: 5,
                        availability: 'EN STOCK',
                        status: 'published',
                        gender: 'Homme',
                        materialCategory: 'Acier',
                        strapCategory: 'Cuir',
                      });
                      setIsProductModalOpen(true);
                    }}
                    className="px-4 py-2.5 bg-[#11100E] hover:bg-[#C6A15B] text-white text-xs uppercase tracking-widest font-semibold transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Créer une Montre</span>
                  </button>
                </div>

                {/* Products Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[#FAF8F3] border-b border-[#EDE3D2] text-[#8A8780] uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="p-3">Garde-temps</th>
                        <th className="p-3">Collection / Catégorie</th>
                        <th className="p-3">Prix</th>
                        <th className="p-3">Stock</th>
                        <th className="p-3">Statut</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EDE3D2]">
                      {products.map((p) => (
                        <tr key={p.id} className="hover:bg-[#FAF8F3]/60">
                          <td className="p-3">
                            <div className="flex items-center gap-3">
                              <img
                                src={p.images?.front || 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=200'}
                                alt={p.name}
                                className="w-10 h-10 object-cover border border-[#EDE3D2]"
                              />
                              <div>
                                <strong className="text-[#11100E] block">{p.name}</strong>
                                <span className="text-[10px] text-[#8A8780] font-mono">{p.sku || p.id}</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-3">
                            <span className="block font-medium text-[#11100E]">{p.collection}</span>
                            <span className="text-[10px] text-[#8A8780]">{p.category}</span>
                          </td>
                          <td className="p-3 font-mono font-semibold text-[#11100E]">
                            {formatFCFA(p.promotionalPrice || p.price)}
                            {p.promotionalPrice && (
                              <span className="block text-[10px] text-[#8A8780] line-through font-normal">
                                {formatFCFA(p.price)}
                              </span>
                            )}
                          </td>
                          <td className="p-3">
                            <span className={`font-mono font-bold ${p.stock === 0 ? 'text-red-700' : (p.stock ?? 5) <= 3 ? 'text-amber-700' : 'text-emerald-700'}`}>
                              {p.stock ?? 0}
                            </span>
                          </td>
                          <td className="p-3">
                            <button
                              onClick={() => handleTogglePublish(p.id)}
                              className={`px-2 py-0.5 text-[9px] uppercase tracking-wider font-semibold ${
                                p.status === 'published'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-zinc-200 text-zinc-700'
                              }`}
                            >
                              {p.status === 'published' ? 'Publiée' : 'Brouillon'}
                            </button>
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => {
                                  setEditingProduct(p);
                                  setIsProductModalOpen(true);
                                }}
                                className="p-1 hover:text-[#C6A15B] text-[#8A8780]"
                                title="Modifier"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(p.id)}
                                className="p-1 hover:text-red-700 text-[#8A8780]"
                                title="Supprimer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 3. STOCK & INVENTORY MANAGEMENT */}
            {activeTab === 'stock' && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-serif text-3xl text-[#11100E]">Gestion des Stocks</h2>
                  <p className="text-xs text-[#8A8780]">
                    Suivi en temps réel des unités manufacturées et alertes d'approvisionnement.
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[#FAF8F3] border-b border-[#EDE3D2] text-[#8A8780] uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="p-3">Produit</th>
                        <th className="p-3">SKU</th>
                        <th className="p-3">Stock Actuel</th>
                        <th className="p-3">Seuil d'Alerte</th>
                        <th className="p-3">Statut</th>
                        <th className="p-3 text-right">Ajuster Stock</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EDE3D2]">
                      {inventory.map((item) => (
                        <tr key={item.productId} className="hover:bg-[#FAF8F3]/60">
                          <td className="p-3 font-medium text-[#11100E]">{item.productName}</td>
                          <td className="p-3 font-mono text-[#8A8780]">{item.sku}</td>
                          <td className="p-3 font-mono font-bold text-sm">{item.stock}</td>
                          <td className="p-3 font-mono text-[#8A8780]">{item.alertThreshold}</td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 text-[9px] uppercase font-bold tracking-wider ${
                                item.status === 'RUPTURE'
                                  ? 'bg-red-100 text-red-800'
                                  : item.status === 'STOCK FAIBLE'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {item.status}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => handleUpdateStock(item.productId, Math.max(0, item.stock - 1))}
                                className="px-2 py-1 bg-zinc-100 hover:bg-zinc-200 text-[#11100E] font-bold"
                              >
                                -
                              </button>
                              <span className="px-2 font-mono">{item.stock}</span>
                              <button
                                onClick={() => handleUpdateStock(item.productId, item.stock + 1)}
                                className="px-2 py-1 bg-zinc-100 hover:bg-zinc-200 text-[#11100E] font-bold"
                              >
                                +
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 4. ORDERS MANAGEMENT */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-serif text-3xl text-[#11100E]">Commandes d'Exception</h2>
                  <p className="text-xs text-[#8A8780]">
                    Suivi des acquisitions, convoyages et règlements des clients.
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[#FAF8F3] border-b border-[#EDE3D2] text-[#8A8780] uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="p-3">N° Dossier</th>
                        <th className="p-3">Client</th>
                        <th className="p-3">Montres</th>
                        <th className="p-3">Montant</th>
                        <th className="p-3">Paiement</th>
                        <th className="p-3">Statut Expédition</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EDE3D2]">
                      {orders.map((ord) => (
                        <tr key={ord.id || ord.orderNumber} className="hover:bg-[#FAF8F3]/60">
                          <td className="p-3 font-mono font-bold text-[#11100E]">{ord.orderNumber}</td>
                          <td className="p-3">
                            <span className="block font-medium text-[#11100E]">
                              {ord.customer.firstName} {ord.customer.lastName}
                            </span>
                            <span className="text-[10px] text-[#8A8780]">{ord.customer.email}</span>
                          </td>
                          <td className="p-3">
                            {ord.items.map((it, i) => (
                              <div key={i} className="text-[11px]">
                                {it.quantity}x {it.product.name}
                              </div>
                            ))}
                          </td>
                          <td className="p-3 font-mono font-bold text-[#C6A15B]">
                            {formatFCFA(ord.total)}
                          </td>
                          <td className="p-3">
                            <span className="text-[10px] uppercase font-semibold text-[#11100E]">
                              {ord.paymentMethod}
                            </span>
                            <span className={`block text-[9px] ${ord.paymentStatus === 'PAYMENT_SUCCESS' ? 'text-emerald-700 font-bold' : 'text-amber-700'}`}>
                              {ord.paymentStatus}
                            </span>
                          </td>
                          <td className="p-3">
                            <select
                              value={ord.status}
                              onChange={(e) => handleUpdateOrderStatus(ord.id || ord.orderNumber, e.target.value)}
                              className="bg-[#FAF8F3] border border-[#EDE3D2] px-2 py-1 text-[11px] text-[#11100E] focus:outline-none focus:border-[#C6A15B]"
                            >
                              <option value="En attente">En attente</option>
                              <option value="Paiement en cours">Paiement en cours</option>
                              <option value="Payée">Payée</option>
                              <option value="Préparation">Préparation</option>
                              <option value="Expédiée">Expédiée</option>
                              <option value="Livrée">Livrée</option>
                              <option value="Annulée">Annulée</option>
                            </select>
                          </td>
                          <td className="p-3 text-right">
                            <span className="text-[10px] text-[#8A8780] font-mono">
                              {new Date(ord.date).toLocaleDateString('fr-FR')}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 5. CUSTOMERS MANAGEMENT */}
            {activeTab === 'customers' && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-serif text-3xl text-[#11100E]">Cercle des Acquéreurs & Clients</h2>
                  <p className="text-xs text-[#8A8780]">
                    Registres confidentiels des acquéreurs et coordonnées de contact.
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[#FAF8F3] border-b border-[#EDE3D2] text-[#8A8780] uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="p-3">Client</th>
                        <th className="p-3">Coordonnées</th>
                        <th className="p-3">Rôle</th>
                        <th className="p-3">Commandes</th>
                        <th className="p-3">Montant Dépensé</th>
                        <th className="p-3">Date Inscription</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EDE3D2]">
                      {customers.map((c) => (
                        <tr key={c.id} className="hover:bg-[#FAF8F3]/60">
                          <td className="p-3 font-medium text-[#11100E]">
                            {c.firstName} {c.lastName}
                          </td>
                          <td className="p-3">
                            <span className="block text-[#11100E]">{c.email}</span>
                            <span className="text-[10px] text-[#8A8780] font-mono">{c.phone || 'Non renseigné'}</span>
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 text-[9px] uppercase font-bold tracking-wider ${
                              c.role === 'ADMIN' ? 'bg-[#11100E] text-[#C6A15B]' : 'bg-[#C6A15B]/20 text-[#332A20]'
                            }`}>
                              {c.role}
                            </span>
                          </td>
                          <td className="p-3 font-mono font-semibold">{c.ordersCount || 0}</td>
                          <td className="p-3 font-mono font-semibold text-[#C6A15B]">
                            {formatFCFA(c.totalSpent || 0)}
                          </td>
                          <td className="p-3 text-[#8A8780]">
                            {new Date(c.createdAt).toLocaleDateString('fr-FR')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 6. PAYMENTS MANAGEMENT */}
            {activeTab === 'payments' && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-serif text-3xl text-[#11100E]">Règlements & Transactions</h2>
                  <p className="text-xs text-[#8A8780]">
                    Paiements MTN MoMo, Orange Money, Cartes Bancaires et Conciergerie.
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[#FAF8F3] border-b border-[#EDE3D2] text-[#8A8780] uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="p-3">Réf Transaction</th>
                        <th className="p-3">Commande</th>
                        <th className="p-3">Moyen</th>
                        <th className="p-3">Client</th>
                        <th className="p-3">Montant</th>
                        <th className="p-3">Statut</th>
                        <th className="p-3">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EDE3D2]">
                      {payments.map((pay) => (
                        <tr key={pay.id} className="hover:bg-[#FAF8F3]/60">
                          <td className="p-3 font-mono text-[11px] font-bold text-[#11100E]">
                            {pay.transactionRef}
                          </td>
                          <td className="p-3 font-mono text-[#8A8780]">{pay.orderNumber}</td>
                          <td className="p-3 font-semibold text-[#11100E]">{pay.method}</td>
                          <td className="p-3">{pay.customerName || 'N/A'}</td>
                          <td className="p-3 font-mono font-bold text-[#C6A15B]">{formatFCFA(pay.amount)}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 text-[9px] uppercase font-bold tracking-wider ${
                              pay.status === 'PAYMENT_SUCCESS'
                                ? 'bg-emerald-100 text-emerald-800'
                                : pay.status === 'PAYMENT_PENDING'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {pay.status}
                            </span>
                          </td>
                          <td className="p-3 text-[10px] text-[#8A8780]">
                            {new Date(pay.createdAt).toLocaleDateString('fr-FR')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 7. PROMOTIONS */}
            {activeTab === 'promotions' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="font-serif text-3xl text-[#11100E]">Codes Privilège & Promotions</h2>
                    <p className="text-xs text-[#8A8780]">
                      Configuration des réductions confidentielles et offres de bienvenue.
                    </p>
                  </div>
                  <button
                    onClick={() => setNewPromoModalOpen(true)}
                    className="px-4 py-2.5 bg-[#11100E] hover:bg-[#C6A15B] text-white text-xs uppercase tracking-widest font-semibold flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Créer un Code</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[#FAF8F3] border-b border-[#EDE3D2] text-[#8A8780] uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="p-3">Code</th>
                        <th className="p-3">Avantage</th>
                        <th className="p-3">Montant Min</th>
                        <th className="p-3">Utilisations</th>
                        <th className="p-3">Validité</th>
                        <th className="p-3 text-right">Statut</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EDE3D2]">
                      {promotions.map((pr) => (
                        <tr key={pr.id} className="hover:bg-[#FAF8F3]/60">
                          <td className="p-3 font-mono font-bold text-sm text-[#C6A15B]">{pr.code}</td>
                          <td className="p-3 font-medium">
                            {pr.discountPercent ? `-${pr.discountPercent}%` : `-${formatFCFA(pr.discountFixed || 0)}`}
                          </td>
                          <td className="p-3 font-mono text-[#8A8780]">{formatFCFA(pr.minAmount || 0)}</td>
                          <td className="p-3 font-mono">
                            {pr.usedCount} / {pr.maxUses || '∞'}
                          </td>
                          <td className="p-3 text-[#8A8780]">
                            {pr.startDate} au {pr.endDate}
                          </td>
                          <td className="p-3 text-right">
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[9px] uppercase font-bold">
                              Actif
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 8. REVIEWS MODERATION */}
            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-serif text-3xl text-[#11100E]">Avis & Témoignages Clients</h2>
                  <p className="text-xs text-[#8A8780]">
                    Modération des avis 5 étoiles et vérification du statut d'acquéreur.
                  </p>
                </div>

                <div className="space-y-4">
                  {reviews.map((rev) => (
                    <div key={rev.id} className="p-4 bg-[#FAF8F3] border border-[#EDE3D2] space-y-2 text-xs">
                      <div className="flex justify-between items-start">
                        <div>
                          <strong className="text-[#11100E] block">{rev.userName}</strong>
                          <span className="text-[10px] text-[#C6A15B]">{rev.productName}</span>
                          {rev.isVerifiedPurchase && (
                            <span className="ml-2 text-[9px] uppercase px-1.5 py-0.5 bg-emerald-100 text-emerald-800 font-bold">
                              Acquéreur Vérifié
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-[#C6A15B]">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-[#C6A15B]" />
                          ))}
                        </div>
                      </div>

                      <p className="text-[#332A20] italic font-serif text-sm">
                        « {rev.comment} »
                      </p>

                      <div className="flex justify-between items-center pt-2 border-t border-[#EDE3D2]">
                        <span className="text-[10px] text-[#8A8780]">
                          Publié le {new Date(rev.createdAt).toLocaleDateString('fr-FR')}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleModerateReview(rev.id, !rev.isApproved)}
                            className={`px-3 py-1 text-[10px] uppercase font-semibold transition-colors ${
                              rev.isApproved
                                ? 'bg-zinc-200 hover:bg-zinc-300 text-zinc-800'
                                : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                            }`}
                          >
                            {rev.isApproved ? 'Masquer' : 'Approuver'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 9. SAV MANAGEMENT */}
            {activeTab === 'sav' && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-serif text-3xl text-[#11100E]">Service Après-Vente & Atelier</h2>
                  <p className="text-xs text-[#8A8780]">
                    Dossiers d'entretien, de réparation et d'expertise métrologique.
                  </p>
                </div>

                <div className="space-y-4">
                  {savTickets.map((t) => (
                    <div key={t.id} className="p-4 bg-[#FAF8F3] border border-[#EDE3D2] space-y-3 text-xs">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-mono font-bold text-sm text-[#11100E] block">{t.ticketNumber}</span>
                          <span className="text-[#C6A15B] font-semibold">{t.requestType}</span> — {t.watchModel}
                          <span className="block text-[10px] text-[#8A8780]">Client : {t.customerName} ({t.phone})</span>
                        </div>
                        <select
                          value={t.status}
                          onChange={(e) => handleUpdateSav(t.id, e.target.value)}
                          className="bg-white border border-[#EDE3D2] px-2.5 py-1 text-xs text-[#11100E] focus:outline-none focus:border-[#C6A15B]"
                        >
                          <option value="Nouveau">Nouveau</option>
                          <option value="En cours d'analyse">En cours d'analyse</option>
                          <option value="Devis transmis">Devis transmis</option>
                          <option value="En intervention">En intervention</option>
                          <option value="Terminé">Terminé</option>
                          <option value="Clôturé">Clôturé</option>
                        </select>
                      </div>

                      <p className="text-[#332A20] leading-relaxed font-light">
                        {t.description}
                      </p>

                      <div className="p-2 bg-white border border-[#EDE3D2] text-[11px]">
                        <span className="text-[#8A8780] font-semibold block">Notes d'atelier :</span>
                        <span>{t.notes || 'Aucune note pour le moment.'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 10. SHIPPING ZONES & RATES */}
            {activeTab === 'shipping' && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-serif text-3xl text-[#11100E]">Tarifs & Zones de Livraison</h2>
                  <p className="text-xs text-[#8A8780]">
                    Configuration des convoyages blindés, scellés diplomatiques et retraits en salon.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {shippingZones.map((zone) => (
                    <div key={zone.id} className="p-5 bg-[#FAF8F3] border border-[#EDE3D2] space-y-3 text-xs">
                      <h3 className="font-serif text-xl text-[#11100E]">{zone.name}</h3>
                      <p className="text-[10px] text-[#8A8780]">{zone.deliveryDays}</p>
                      <div className="space-y-1 font-mono text-xs">
                        <div className="flex justify-between">
                          <span>Standard / Offert :</span>
                          <strong>{formatFCFA(zone.standardPrice)}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Express Diplomatique :</span>
                          <strong>{formatFCFA(zone.expressPrice)}</strong>
                        </div>
                      </div>
                      <div className="pt-2 text-[10px] text-[#C6A15B] font-semibold uppercase">
                        Retrait en salon : {zone.boutiquePickup ? 'Disponible' : 'Non proposé'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 11. STORE SETTINGS & WHATSAPP */}
            {activeTab === 'settings' && settings && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-serif text-3xl text-[#11100E]">Paramètres & Conciergerie WhatsApp</h2>
                  <p className="text-xs text-[#8A8780]">
                    Configuration du bouton WhatsApp flottant et des informations de contact direct.
                  </p>
                </div>

                <form onSubmit={handleSaveSettings} className="space-y-4 max-w-xl text-xs">
                  <div>
                    <label className="block uppercase tracking-wider text-[#8A8780] font-semibold mb-1">
                      Numéro WhatsApp Concierge (format international)
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-[#8A8780] absolute left-3 top-3" />
                      <input
                        type="text"
                        value={settings.whatsappNumber}
                        onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                        placeholder="+225 07 48 92 10 01"
                        className="w-full bg-[#FAF8F3] border border-[#EDE3D2] pl-9 pr-3 py-2.5 text-xs text-[#11100E] focus:outline-none focus:border-[#C6A15B]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block uppercase tracking-wider text-[#8A8780] font-semibold mb-1">
                      Message d'accueil WhatsApp par défaut
                    </label>
                    <textarea
                      rows={3}
                      value={settings.whatsappDefaultMessage}
                      onChange={(e) => setSettings({ ...settings, whatsappDefaultMessage: e.target.value })}
                      className="w-full bg-[#FAF8F3] border border-[#EDE3D2] p-3 text-xs text-[#11100E] focus:outline-none focus:border-[#C6A15B]"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="checkbox"
                      id="whatsappEnabled"
                      checked={settings.whatsappEnabled}
                      onChange={(e) => setSettings({ ...settings, whatsappEnabled: e.target.checked })}
                      className="accent-[#C6A15B]"
                    />
                    <label htmlFor="whatsappEnabled" className="text-[#11100E] font-medium">
                      Activer le bouton WhatsApp flottant pour les visiteurs
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block uppercase tracking-wider text-[#8A8780] font-semibold mb-1">
                        Email Conciergerie
                      </label>
                      <input
                        type="email"
                        value={settings.conciergeEmail}
                        onChange={(e) => setSettings({ ...settings, conciergeEmail: e.target.value })}
                        className="w-full bg-[#FAF8F3] border border-[#EDE3D2] px-3 py-2 text-xs text-[#11100E]"
                      />
                    </div>
                    <div>
                      <label className="block uppercase tracking-wider text-[#8A8780] font-semibold mb-1">
                        Garantie Manufacture (Années)
                      </label>
                      <input
                        type="number"
                        value={settings.securityGuaranteeYears}
                        onChange={(e) => setSettings({ ...settings, securityGuaranteeYears: Number(e.target.value) })}
                        className="w-full bg-[#FAF8F3] border border-[#EDE3D2] px-3 py-2 text-xs text-[#11100E]"
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      className="px-6 py-3 bg-[#11100E] hover:bg-[#C6A15B] text-white text-xs uppercase tracking-widest font-semibold transition-colors"
                    >
                      Enregistrer les Paramètres
                    </button>
                  </div>
                </form>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Product Edit/Create Modal */}
      {isProductModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-white border border-[#EDE3D2] shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <h3 className="font-serif text-2xl text-[#11100E] mb-4">
              {editingProduct.id ? 'Modifier le Garde-temps' : 'Ajouter une Nouvelle Montre'}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#8A8780] uppercase tracking-wider font-semibold mb-1">Nom du modèle *</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="w-full bg-[#FAF8F3] border border-[#EDE3D2] px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[#8A8780] uppercase tracking-wider font-semibold mb-1">Collection *</label>
                  <select
                    value={editingProduct.collection || 'Heritage'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, collection: e.target.value as any })}
                    className="w-full bg-[#FAF8F3] border border-[#EDE3D2] px-3 py-2 text-xs"
                  >
                    <option value="Heritage">Heritage</option>
                    <option value="Prestige">Prestige</option>
                    <option value="Royal">Royal</option>
                    <option value="Ocean">Ocean</option>
                    <option value="Sport">Sport</option>
                    <option value="Chronograph">Chronograph</option>
                    <option value="Private Collection">Private Collection</option>
                    <option value="Women's Collection">Women's Collection</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[#8A8780] uppercase tracking-wider font-semibold mb-1">Prix (FCFA) *</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.price || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full bg-[#FAF8F3] border border-[#EDE3D2] px-3 py-2 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[#8A8780] uppercase tracking-wider font-semibold mb-1">Prix Promo (FCFA)</label>
                  <input
                    type="number"
                    value={editingProduct.promotionalPrice || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, promotionalPrice: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full bg-[#FAF8F3] border border-[#EDE3D2] px-3 py-2 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[#8A8780] uppercase tracking-wider font-semibold mb-1">Stock *</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.stock ?? 5}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                    className="w-full bg-[#FAF8F3] border border-[#EDE3D2] px-3 py-2 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#8A8780] uppercase tracking-wider font-semibold mb-1">Catégorie</label>
                  <select
                    value={editingProduct.category || 'Automatique'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value as any })}
                    className="w-full bg-[#FAF8F3] border border-[#EDE3D2] px-3 py-2 text-xs"
                  >
                    <option value="Classique">Classique</option>
                    <option value="Automatique">Automatique</option>
                    <option value="Mécanique">Mécanique</option>
                    <option value="Quartz">Quartz</option>
                    <option value="Chronographe">Chronographe</option>
                    <option value="Sport">Sport</option>
                    <option value="Plongée">Plongée</option>
                    <option value="Joaillerie">Joaillerie</option>
                    <option value="Luxe">Luxe</option>
                    <option value="Éditions Limitées">Éditions Limitées</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#8A8780] uppercase tracking-wider font-semibold mb-1">Genre</label>
                  <select
                    value={editingProduct.gender || 'Homme'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, gender: e.target.value as any })}
                    className="w-full bg-[#FAF8F3] border border-[#EDE3D2] px-3 py-2 text-xs"
                  >
                    <option value="Homme">Homme</option>
                    <option value="Femme">Femme</option>
                    <option value="Unisexe">Unisexe</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#8A8780] uppercase tracking-wider font-semibold mb-1">Description éditoriale</label>
                <textarea
                  rows={3}
                  value={editingProduct.description || editingProduct.history || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full bg-[#FAF8F3] border border-[#EDE3D2] px-3 py-2 text-xs"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#EDE3D2]">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-5 py-2.5 border border-[#EDE3D2] text-[#8A8780] hover:text-[#11100E] text-xs uppercase tracking-wider"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#11100E] hover:bg-[#C6A15B] text-white text-xs uppercase tracking-wider font-semibold"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Promo Code Creation Modal */}
      {newPromoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-white border border-[#EDE3D2] shadow-2xl p-6 sm:p-8">
            <h3 className="font-serif text-2xl text-[#11100E] mb-4">Nouveau Code Privilège</h3>
            <form onSubmit={handleCreatePromo} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#8A8780] uppercase tracking-wider font-semibold mb-1">Code Promo *</label>
                <input
                  type="text"
                  required
                  placeholder="EX: NICAISE10"
                  value={newPromo.code || ''}
                  onChange={(e) => setNewPromo({ ...newPromo, code: e.target.value.toUpperCase() })}
                  className="w-full bg-[#FAF8F3] border border-[#EDE3D2] px-3 py-2 text-xs font-mono font-bold uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#8A8780] uppercase tracking-wider font-semibold mb-1">Réduction (%)</label>
                  <input
                    type="number"
                    value={newPromo.discountPercent || ''}
                    onChange={(e) => setNewPromo({ ...newPromo, discountPercent: Number(e.target.value) })}
                    className="w-full bg-[#FAF8F3] border border-[#EDE3D2] px-3 py-2 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[#8A8780] uppercase tracking-wider font-semibold mb-1">Montant Min (FCFA)</label>
                  <input
                    type="number"
                    value={newPromo.minAmount || ''}
                    onChange={(e) => setNewPromo({ ...newPromo, minAmount: Number(e.target.value) })}
                    className="w-full bg-[#FAF8F3] border border-[#EDE3D2] px-3 py-2 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#EDE3D2]">
                <button
                  type="button"
                  onClick={() => setNewPromoModalOpen(false)}
                  className="px-4 py-2 border border-[#EDE3D2] text-xs uppercase"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#11100E] text-white text-xs uppercase tracking-wider font-semibold hover:bg-[#C6A15B]"
                >
                  Créer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
