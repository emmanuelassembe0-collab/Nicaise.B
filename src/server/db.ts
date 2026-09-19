import fs from 'fs';
import path from 'path';
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
} from '../types.js';
import { PRODUCTS, CATEGORIES_DATA, COLLECTIONS_DATA } from '../data/products.js';
import { hashPassword } from './auth.js';

export interface DatabaseSchema {
  users: (User & { passwordHash: string; salt: string })[];
  products: Product[];
  categories: typeof CATEGORIES_DATA;
  collections: typeof COLLECTIONS_DATA;
  orders: Order[];
  payments: PaymentRecord[];
  reviews: Review[];
  favorites: Record<string, string[]>; // userId -> productId[]
  promotions: Promotion[];
  inventory: InventoryItem[];
  shippingZones: ShippingZone[];
  savTickets: SavTicket[];
  settings: StoreSettings;
}

const DB_FILE = path.join(process.cwd(), 'data', 'database.json');

function ensureDataDir() {
  const dir = path.dirname(DB_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function getInitialSeedData(): DatabaseSchema {
  // Admin password: AdminNicaise2026!
  const adminAuth = hashPassword('AdminNicaise2026!');
  // Client password: ClientNicaise2026!
  const clientAuth = hashPassword('ClientNicaise2026!');

  const initialProducts: Product[] = PRODUCTS.map((p, idx) => {
    const sku = `SKU-NCA-${String(idx + 1).padStart(3, '0')}`;
    const reference = `REF-NC-${p.collection.substring(0, 3).toUpperCase()}-${String(idx + 1).padStart(2, '0')}`;
    const stock = p.availability === 'PIÈCE UNIQUE' ? 1 : p.availability === 'SUR DEMANDE' ? 3 : 12 - idx;
    return {
      ...p,
      description: p.history || `Garde-temps d'exception façonné au sein de la manufacture genevoise Nicaise.a. Boîtier ${p.specs.case}, calibre haute fréquence et finitions d'exception.`,
      reference,
      sku,
      stock,
      thickness: p.specs.diameter ? `${parseInt(p.specs.diameter) > 42 ? '12.8 mm' : '10.5 mm'}` : '11 mm',
      status: 'published',
      rating: 4.9,
      reviewsCount: 3 + (idx % 4),
      createdAt: '2026-01-15T10:00:00.000Z',
      updatedAt: '2026-03-01T14:30:00.000Z',
    };
  });

  const initialInventory: InventoryItem[] = initialProducts.map((p) => {
    const stock = p.stock ?? 5;
    const alertThreshold = 3;
    const status = stock === 0 ? 'RUPTURE' : stock <= alertThreshold ? 'STOCK FAIBLE' : 'EN STOCK';
    return {
      productId: p.id,
      productName: p.name,
      sku: p.sku || `SKU-${p.id}`,
      stock,
      alertThreshold,
      status,
      price: p.price,
      updatedAt: new Date().toISOString(),
    };
  });

  return {
    users: [
      {
        id: 'usr-admin-01',
        email: 'admin@nicaise-a.com',
        firstName: 'Nicaise',
        lastName: 'Administration',
        phone: '+225 07 48 92 10 01',
        role: 'ADMIN',
        createdAt: '2026-01-01T00:00:00.000Z',
        totalSpent: 0,
        ordersCount: 0,
        passwordHash: adminAuth.hash,
        salt: adminAuth.salt,
      },
      {
        id: 'usr-client-01',
        email: 'alexandre@prestige.com',
        firstName: 'Alexandre',
        lastName: 'de Montmirail',
        phone: '+225 07 48 92 10 01',
        role: 'CLIENT',
        createdAt: '2026-01-10T11:20:00.000Z',
        totalSpent: 2150000,
        ordersCount: 1,
        passwordHash: clientAuth.hash,
        salt: clientAuth.salt,
      },
    ],
    products: initialProducts,
    categories: CATEGORIES_DATA,
    collections: COLLECTIONS_DATA,
    orders: [
      {
        id: 'ord-0001',
        orderNumber: 'NCA-2026-000001',
        userId: 'usr-client-01',
        date: '2026-03-12T14:20:00.000Z',
        items: [
          {
            product: initialProducts[1],
            quantity: 1,
          },
        ],
        subtotal: initialProducts[1].price,
        shippingCost: 0,
        discount: 0,
        total: initialProducts[1].price,
        status: 'Livrée',
        paymentStatus: 'PAYMENT_SUCCESS',
        customer: {
          firstName: 'Alexandre',
          lastName: 'de Montmirail',
          email: 'alexandre@prestige.com',
          phone: '+225 07 48 92 10 01',
          address: 'Boulevard des Ambassades, Villa 14',
          city: 'Abidjan',
          postalCode: 'BP 1024',
          country: "Côte d'Ivoire",
        },
        shippingMethod: 'Convoyeur privé sécurisé sous scellés diplomatiques',
        paymentMethod: 'VISA',
        trackingCode: 'CONV-VIP-CI-8921',
        carrier: 'Diplomatic Prestige Express',
        guaranteeCertificateNumber: 'CERT-NCA-2026-89412',
      },
    ],
    payments: [
      {
        id: 'pay-0001',
        orderId: 'ord-0001',
        orderNumber: 'NCA-2026-000001',
        method: 'VISA',
        amount: initialProducts[1].price,
        currency: 'FCFA',
        status: 'PAYMENT_SUCCESS',
        transactionRef: 'TXN-VISA-99214401',
        customerName: 'Alexandre de Montmirail',
        customerPhone: '+225 07 48 92 10 01',
        createdAt: '2026-03-12T14:25:00.000Z',
      },
    ],
    reviews: [
      {
        id: 'rev-01',
        productId: initialProducts[0].id,
        productName: initialProducts[0].name,
        userId: 'usr-client-01',
        userName: 'Alexandre de M.',
        userEmail: 'alexandre@prestige.com',
        rating: 5,
        comment: 'Une pièce d’une noblesse absolue. Les finitions du cadran et la douceur du remontage automatique attestent d’un travail d’artisanat digne des plus grands noms genevois.',
        isVerifiedPurchase: true,
        isApproved: true,
        createdAt: '2026-02-14T09:15:00.000Z',
      },
      {
        id: 'rev-02',
        productId: initialProducts[1].id,
        productName: initialProducts[1].name,
        userId: 'usr-client-02',
        userName: 'Benoît D.',
        userEmail: 'benoit.d@luxury.fr',
        rating: 5,
        comment: 'La livraison en mains propres avec le coffret en noyer massif a été une expérience digne des salons de la place Vendôme. Le boîtier en or rose capte la lumière avec une élégance saisissante.',
        isVerifiedPurchase: true,
        isApproved: true,
        createdAt: '2026-02-28T16:40:00.000Z',
      },
      {
        id: 'rev-03',
        productId: initialProducts[3].id,
        productName: initialProducts[3].name,
        userId: 'usr-client-03',
        userName: 'Capitaine H. K.',
        userEmail: 'h.koffi@marine.ci',
        rating: 5,
        comment: 'Précision redoutable sous l’eau. La lisibilité dans l’obscurité est impeccable et la lunette céramique offre un crantage net et rassurant.',
        isVerifiedPurchase: true,
        isApproved: true,
        createdAt: '2026-03-05T11:00:00.000Z',
      },
    ],
    favorites: {
      'usr-client-01': [initialProducts[0].id, initialProducts[4].id],
    },
    promotions: [
      {
        id: 'promo-01',
        code: 'NICAISE5',
        discountPercent: 5,
        minAmount: 500000,
        maxUses: 100,
        usedCount: 8,
        startDate: '2026-01-01',
        endDate: '2026-12-31',
        isActive: true,
      },
      {
        id: 'promo-02',
        code: 'ROYAL10',
        discountPercent: 10,
        minAmount: 1500000,
        maxUses: 50,
        usedCount: 3,
        startDate: '2026-01-01',
        endDate: '2026-12-31',
        isActive: true,
      },
      {
        id: 'promo-03',
        code: 'BIENVENUE',
        discountFixed: 50000,
        minAmount: 800000,
        maxUses: 200,
        usedCount: 15,
        startDate: '2026-01-01',
        endDate: '2026-12-31',
        isActive: true,
      },
    ],
    inventory: initialInventory,
    shippingZones: [
      {
        id: 'zone-abidjan',
        name: 'Grand Abidjan VIP',
        region: "Côte d'Ivoire",
        countries: ["Côte d'Ivoire"],
        standardPrice: 0,
        expressPrice: 25000,
        boutiquePickup: true,
        deliveryDays: 'Sous 24h ouvrées en mains propres',
      },
      {
        id: 'zone-interieur-ci',
        name: 'Intérieur Côte d’Ivoire',
        region: "Côte d'Ivoire",
        countries: ["Côte d'Ivoire"],
        standardPrice: 15000,
        expressPrice: 35000,
        boutiquePickup: false,
        deliveryDays: '2 à 3 jours ouvrés',
      },
      {
        id: 'zone-cedeao',
        name: 'Afrique de l’Ouest (CEDEAO)',
        region: 'Afrique',
        countries: ['Sénégal', 'Mali', 'Burkina Faso', 'Togo', 'Bénin', 'Ghana', 'Cameroun', 'Gabon'],
        standardPrice: 35000,
        expressPrice: 65000,
        boutiquePickup: false,
        deliveryDays: '3 à 5 jours ouvrés sous scellés diplomatiques',
      },
      {
        id: 'zone-international',
        name: 'Europe & International',
        region: 'International',
        countries: ['France', 'Suisse', 'Belgique', 'Monaco', 'Canada', 'Émirats Arabes Unis'],
        standardPrice: 50000,
        expressPrice: 95000,
        boutiquePickup: true,
        deliveryDays: '2 à 4 jours par transporteur blindé',
      },
    ],
    savTickets: [
      {
        id: 'sav-001',
        ticketNumber: 'SAV-2026-0001',
        userId: 'usr-client-01',
        customerName: 'Alexandre de Montmirail',
        email: 'alexandre@prestige.com',
        phone: '+225 07 48 92 10 01',
        watchModel: 'Nicaise.a Heritage Or Rose',
        watchReference: 'REF-NC-HER-02',
        serialNumber: 'SN-NCA-9812-77',
        requestType: 'Entretien',
        description: 'Demande de polissage annuel du boîtier or rose et vérification du joint d’étanchéité.',
        status: 'En cours d\'analyse',
        createdAt: '2026-03-10T10:00:00.000Z',
        updatedAt: '2026-03-11T16:00:00.000Z',
        notes: 'Garde-temps réceptionné au salon d’Abidjan. Contrôle métrologique en cours.',
      },
      {
        id: 'sav-002',
        ticketNumber: 'SAV-2026-0002',
        customerName: 'Marc-Aurèle K.',
        email: 'm.koffi@africafinance.com',
        phone: '+225 05 12 34 56 78',
        watchModel: 'Nicaise.a Automatic Prestige',
        watchReference: 'REF-NC-PRE-01',
        serialNumber: 'SN-NCA-0045-12',
        requestType: 'Garantie',
        description: 'Vérification de la déviation de marche après un voyage transatlantique.',
        status: 'Terminé',
        createdAt: '2026-02-18T14:30:00.000Z',
        updatedAt: '2026-02-22T09:00:00.000Z',
        notes: 'Démagnétisation effectuée avec succès. Déviation stabilisée à +1 sec/jour.',
      },
    ],
    settings: {
      whatsappNumber: '+225 07 48 92 10 01',
      whatsappDefaultMessage: 'Bonjour Maison NICAISE.A, je souhaite échanger avec un conseiller au sujet de vos garde-temps de prestige.',
      whatsappEnabled: true,
      conciergeEmail: 'concierge@nicaise-a.com',
      conciergePhone: '+225 07 48 92 10 01',
      currency: 'FCFA',
      securityGuaranteeYears: 5,
      allowCashOnDeliveryDiplomatic: true,
    },
  };
}

class Database {
  private data: DatabaseSchema;
  private isLoaded = false;

  constructor() {
    this.data = getInitialSeedData();
    this.load();
  }

  private load() {
    try {
      ensureDataDir();
      if (fs.existsSync(DB_FILE)) {
        const content = fs.readFileSync(DB_FILE, 'utf8');
        const parsed = JSON.parse(content);
        this.data = { ...getInitialSeedData(), ...parsed };
      } else {
        this.save();
      }
      this.isLoaded = true;
    } catch (err) {
      console.error('[DB] Erreur chargement database.json, utilisation des données d’initialisation:', err);
      this.data = getInitialSeedData();
    }
  }

  public save() {
    try {
      ensureDataDir();
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (err) {
      console.error('[DB] Erreur écriture database.json:', err);
    }
  }

  // Schema getters
  public getUsers() {
    return this.data.users;
  }

  public getProducts() {
    return this.data.products;
  }

  public getCategories() {
    return this.data.categories;
  }

  public getCollections() {
    return this.data.collections;
  }

  public getOrders() {
    return this.data.orders;
  }

  public getPayments() {
    return this.data.payments;
  }

  public getReviews() {
    return this.data.reviews;
  }

  public getPromotions() {
    return this.data.promotions;
  }

  public getInventory() {
    return this.data.inventory;
  }

  public getShippingZones() {
    return this.data.shippingZones;
  }

  public getSavTickets() {
    return this.data.savTickets;
  }

  public getSettings() {
    return this.data.settings;
  }

  public updateSettings(newSettings: Partial<StoreSettings>) {
    this.data.settings = { ...this.data.settings, ...newSettings };
    this.save();
    return this.data.settings;
  }

  // Sequence generator
  public generateOrderNumber(): string {
    const count = this.data.orders.length + 1;
    return `NCA-2026-${String(count).padStart(6, '0')}`;
  }

  public generateSavTicketNumber(): string {
    const count = this.data.savTickets.length + 1;
    return `SAV-2026-${String(count).padStart(4, '0')}`;
  }

  public generateTransactionRef(method: string): string {
    const prefix = method.toUpperCase().replace(/[^A-Z]/g, '');
    const rand = Math.floor(100000 + Math.random() * 900000);
    return `TXN-${prefix}-${Date.now().toString().slice(-4)}-${rand}`;
  }
}

export const db = new Database();
