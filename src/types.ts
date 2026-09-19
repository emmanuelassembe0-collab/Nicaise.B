export type Gender = 'Homme' | 'Femme' | 'Unisexe';

export type WatchCategory = 
  | 'Classique'
  | 'Automatique'
  | 'Mécanique'
  | 'Quartz'
  | 'Chronographe'
  | 'Sport'
  | 'Plongée'
  | 'Joaillerie'
  | 'Luxe'
  | 'Éditions Limitées';

export type CaseMaterial = 'Acier' | 'Or' | 'Titane' | 'Céramique' | 'Carbone';

export type StrapType = 'Cuir' | 'Acier' | 'Caoutchouc' | 'Métal précieux';

export type CollectionName = 
  | 'Heritage'
  | 'Prestige'
  | 'Royal'
  | 'Ocean'
  | 'Sport'
  | 'Chronograph'
  | 'Private Collection'
  | "Women's Collection";

export interface WatchSpecs {
  movement: string;
  powerReserve: string;
  case: string;
  diameter: string;
  waterResistance: string;
  glass: string;
  strap: string;
  clasp: string;
  warranty: string;
  caliber?: string;
  frequency?: string;
  jewels?: string;
  thickness?: string;
}

export interface WatchImages {
  front: string;
  back: string;
  dial: string;
  strap: string;
  wrist: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  collection: CollectionName;
  category: WatchCategory;
  movementType: 'Automatique' | 'Mécanique' | 'Quartz';
  diameter: string;
  thickness?: string;
  caseMaterial: string;
  dialColor: string;
  strapMaterial: string;
  gender: Gender;
  materialCategory: CaseMaterial;
  strapCategory: StrapType;
  price: number; // in FCFA
  promotionalPrice?: number;
  availability: 'EN STOCK' | 'SUR DEMANDE' | 'PIÈCE UNIQUE' | 'ÉPUISÉ';
  badge?: 'NOUVEAU' | 'ÉDITION LIMITÉE' | 'BEST-SELLER' | 'COUP DE CŒUR';
  limitedEditionNumber?: string;
  isNew?: boolean;
  isLimited?: boolean;
  images: WatchImages;
  specs: WatchSpecs;
  history: string;
  tagline: string;
  reference?: string;
  sku?: string;
  stock?: number;
  status?: 'published' | 'draft';
  rating?: number;
  reviewsCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type UserRole = 'CLIENT' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  createdAt: string;
  lastLogin?: string;
  totalSpent?: number;
  ordersCount?: number;
}

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode?: string;
  country: string;
}

export interface ShippingAddress {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  pays: string;
  region: string;
  ville: string;
  quartier: string;
  adresse: string;
  instructions?: string;
}

export type PaymentMethod = 
  | 'MTN_MOMO' 
  | 'ORANGE_MONEY' 
  | 'VISA' 
  | 'MASTERCARD' 
  | 'card' 
  | 'bank_transfer' 
  | 'concierge' 
  | 'crypto';

export type PaymentStatus = 
  | 'PAYMENT_PENDING' 
  | 'PAYMENT_SUCCESS' 
  | 'PAYMENT_FAILED' 
  | 'PAYMENT_CANCELLED';

export interface PaymentRecord {
  id: string;
  orderId: string;
  orderNumber: string;
  method: PaymentMethod | string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  transactionRef: string;
  customerName?: string;
  customerPhone?: string;
  createdAt: string;
}

export interface Order {
  id?: string;
  orderNumber: string;
  userId?: string;
  date: string;
  items: CartItem[];
  subtotal?: number;
  shippingCost?: number;
  discount?: number;
  total: number;
  status: 'En attente' | 'Paiement en cours' | 'Payée' | 'Préparation' | 'Expédiée' | 'Livrée' | 'Annulée' | string;
  paymentStatus?: PaymentStatus;
  customer: CustomerInfo;
  shippingMethod?: string;
  shippingAddress?: ShippingAddress;
  paymentMethod: PaymentMethod | string;
  momoPhone?: string;
  trackingCode?: string;
  carrier?: string;
  guaranteeCertificateNumber?: string;
}

export interface Review {
  id: string;
  productId: string;
  productName: string;
  userId: string;
  userName: string;
  userEmail: string;
  rating: number; // 1 to 5
  comment: string;
  isVerifiedPurchase: boolean;
  isApproved: boolean;
  createdAt: string;
}

export interface Promotion {
  id: string;
  code: string;
  discountPercent?: number;
  discountFixed?: number;
  minAmount?: number;
  maxUses?: number;
  usedCount: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface InventoryItem {
  productId: string;
  productName: string;
  sku: string;
  stock: number;
  alertThreshold: number;
  status: 'EN STOCK' | 'STOCK FAIBLE' | 'RUPTURE';
  price: number;
  updatedAt: string;
}

export interface ShippingZone {
  id: string;
  name: string;
  region: string;
  countries: string[];
  standardPrice: number;
  expressPrice: number;
  boutiquePickup: boolean;
  deliveryDays: string;
}

export interface SavTicket {
  id: string;
  ticketNumber: string;
  userId?: string;
  customerName: string;
  email: string;
  phone: string;
  watchModel: string;
  watchReference: string;
  serialNumber?: string;
  requestType: 'Garantie' | 'Entretien' | 'Réparation' | 'Authentification' | 'Information';
  description: string;
  status: 'Nouveau' | 'En cours d\'analyse' | 'Devis transmis' | 'En intervention' | 'Terminé' | 'Clôturé';
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export interface StoreSettings {
  whatsappNumber: string;
  whatsappDefaultMessage: string;
  whatsappEnabled: boolean;
  conciergeEmail: string;
  conciergePhone: string;
  currency: string;
  securityGuaranteeYears: number;
  allowCashOnDeliveryDiplomatic: boolean;
}

export const formatFCFA = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
};

export type PageView = 
  | 'home'
  | 'catalog'
  | 'collections'
  | 'new-arrivals'
  | 'limited-editions'
  | 'product-detail'
  | 'cart'
  | 'checkout'
  | 'order-confirmation'
  | 'account'
  | 'about'
  | 'contact'
  | 'sav'
  | 'admin';
