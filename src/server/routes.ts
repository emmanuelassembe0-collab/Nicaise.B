import { Router, Request, Response } from 'express';
import { db } from './db.js';
import {
  hashPassword,
  verifyPassword,
  generateToken,
  AuthenticatedRequest,
  requireAuth,
  requireAdmin,
} from './auth.js';
import {
  Product,
  Order,
  Review,
  Promotion,
  SavTicket,
  PaymentRecord,
  PaymentStatus,
  User,
} from '../types.js';

export const apiRouter = Router();

// In-memory email simulation log (for testing & admin inspection)
export interface EmailLog {
  id: string;
  to: string;
  subject: string;
  template: 'order_confirmation' | 'payment_success' | 'order_shipped' | 'order_delivered' | 'password_reset' | 'sav_confirmation';
  payload: any;
  sentAt: string;
}

export const emailLogs: EmailLog[] = [];

function sendSimulatedEmail(to: string, subject: string, template: EmailLog['template'], payload: any) {
  const log: EmailLog = {
    id: `email-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    to,
    subject,
    template,
    payload,
    sentAt: new Date().toISOString(),
  };
  emailLogs.unshift(log);
  if (emailLogs.length > 50) emailLogs.pop();
  console.log(`[EMAIL DISPATCH] To: ${to} | Subject: "${subject}" | Template: ${template}`);
  return log;
}

// -------------------------------------------------------------
// 1. AUTHENTICATION & USERS
// -------------------------------------------------------------

apiRouter.post('/auth/register', (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: 'Tous les champs obligatoires doivent être renseignés.' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Le mot de passe doit contenir au minimum 8 caractères.' });
    }

    const users = db.getUsers();
    const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(409).json({ error: 'Un compte existe déjà avec cette adresse email.' });
    }

    const { hash, salt } = hashPassword(password);
    const newUser = {
      id: `usr-${Date.now()}`,
      email: email.toLowerCase(),
      firstName,
      lastName,
      phone: phone || '',
      role: 'CLIENT' as const,
      createdAt: new Date().toISOString(),
      totalSpent: 0,
      ordersCount: 0,
      passwordHash: hash,
      salt,
    };

    users.push(newUser);
    db.save();

    const token = generateToken({ id: newUser.id, email: newUser.email, role: newUser.role });

    const safeUser: User = {
      id: newUser.id,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      phone: newUser.phone,
      role: newUser.role,
      createdAt: newUser.createdAt,
      totalSpent: newUser.totalSpent,
      ordersCount: newUser.ordersCount,
    };

    return res.status(201).json({
      message: 'Compte créé avec distinction auprès de la Maison NICAISE.A.',
      token,
      user: safeUser,
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Erreur lors de la création du compte.', details: err.message });
  }
});

apiRouter.post('/auth/login', (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis.' });
    }

    const users = db.getUsers();
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      return res.status(401).json({ error: 'Identifiants invalides.' });
    }

    const isValid = verifyPassword(password, user.passwordHash, user.salt);
    if (!isValid) {
      return res.status(401).json({ error: 'Identifiants invalides.' });
    }

    user.lastLogin = new Date().toISOString();
    db.save();

    const token = generateToken({ id: user.id, email: user.email, role: user.role });

    const safeUser: User = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
      totalSpent: user.totalSpent,
      ordersCount: user.ordersCount,
    };

    return res.json({
      message: 'Connexion établie avec succès.',
      token,
      user: safeUser,
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Erreur de connexion.', details: err.message });
  }
});

apiRouter.get('/auth/me', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const users = db.getUsers();
  const user = users.find((u) => u.id === req.user!.id);
  if (!user) {
    return res.status(404).json({ error: 'Utilisateur introuvable.' });
  }

  const safeUser: User = {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone,
    role: user.role,
    createdAt: user.createdAt,
    lastLogin: user.lastLogin,
    totalSpent: user.totalSpent,
    ordersCount: user.ordersCount,
  };

  return res.json({ user: safeUser });
});

apiRouter.put('/auth/profile', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { firstName, lastName, phone } = req.body;
  const users = db.getUsers();
  const user = users.find((u) => u.id === req.user!.id);
  if (!user) {
    return res.status(404).json({ error: 'Utilisateur introuvable.' });
  }

  if (firstName) user.firstName = firstName;
  if (lastName) user.lastName = lastName;
  if (phone) user.phone = phone;

  db.save();

  return res.json({
    message: 'Profil mis à jour.',
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt,
      totalSpent: user.totalSpent,
      ordersCount: user.ordersCount,
    },
  });
});

apiRouter.post('/auth/reset-password-request', (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Adresse email requise.' });
  }

  const users = db.getUsers();
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

  if (user) {
    const resetToken = `reset-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    sendSimulatedEmail(user.email, 'Réinitialisation de votre mot de passe NICAISE.A', 'password_reset', {
      firstName: user.firstName,
      resetToken,
      link: `/auth/reset?token=${resetToken}`,
    });
  }

  return res.json({
    message: 'Si cette adresse correspond à un compte, un lien de réinitialisation sécurisé vient d’être envoyé.',
  });
});

// Admin list of clients
apiRouter.get('/admin/users', requireAdmin, (_req: AuthenticatedRequest, res: Response) => {
  const users = db.getUsers();
  const safeUsers: User[] = users.map((u) => ({
    id: u.id,
    email: u.email,
    firstName: u.firstName,
    lastName: u.lastName,
    phone: u.phone,
    role: u.role,
    createdAt: u.createdAt,
    lastLogin: u.lastLogin,
    totalSpent: u.totalSpent || 0,
    ordersCount: u.ordersCount || 0,
  }));
  return res.json({ users: safeUsers });
});

// -------------------------------------------------------------
// 2. PRODUCTS & INVENTORY
// -------------------------------------------------------------

apiRouter.get('/products', (req: Request, res: Response) => {
  let products = [...db.getProducts()];

  const {
    category,
    collection,
    gender,
    movement,
    material,
    strap,
    minPrice,
    maxPrice,
    search,
    availability,
    includeDrafts,
  } = req.query;

  // Filter out drafts for regular users unless requested by admin
  if (includeDrafts !== 'true') {
    products = products.filter((p) => p.status !== 'draft');
  }

  if (category) {
    products = products.filter((p) => p.category === category);
  }
  if (collection) {
    products = products.filter((p) => p.collection === collection);
  }
  if (gender) {
    products = products.filter((p) => p.gender === gender);
  }
  if (movement) {
    products = products.filter((p) => p.movementType === movement);
  }
  if (material) {
    products = products.filter((p) => p.materialCategory === material);
  }
  if (strap) {
    products = products.filter((p) => p.strapCategory === strap);
  }
  if (minPrice) {
    const min = parseFloat(minPrice as string);
    if (!isNaN(min)) products = products.filter((p) => p.price >= min);
  }
  if (maxPrice) {
    const max = parseFloat(maxPrice as string);
    if (!isNaN(max)) products = products.filter((p) => p.price <= max);
  }
  if (availability) {
    products = products.filter((p) => p.availability === availability);
  }
  if (search) {
    const q = (search as string).toLowerCase();
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.collection.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.reference && p.reference.toLowerCase().includes(q)) ||
        (p.sku && p.sku.toLowerCase().includes(q)) ||
        p.dialColor.toLowerCase().includes(q)
    );
  }

  return res.json({ products, total: products.length });
});

apiRouter.get('/products/:id', (req: Request, res: Response) => {
  const products = db.getProducts();
  const product = products.find((p) => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Montre introuvable dans nos registres.' });
  }
  return res.json({ product });
});

// Admin: Add new watch
apiRouter.post('/products', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  try {
    const body = req.body as Partial<Product>;
    if (!body.name || !body.price || !body.collection || !body.category) {
      return res.status(400).json({ error: 'Le nom, le prix, la collection et la catégorie sont obligatoires.' });
    }

    const products = db.getProducts();
    const inventory = db.getInventory();

    const id = body.id || `nicaise-${body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString().slice(-4)}`;
    const sku = body.sku || `SKU-NCA-${String(products.length + 1).padStart(3, '0')}`;
    const reference = body.reference || `REF-NC-${body.collection.substring(0, 3).toUpperCase()}-${String(products.length + 1).padStart(2, '0')}`;
    const stock = typeof body.stock === 'number' ? body.stock : 5;

    const newProduct: Product = {
      id,
      name: body.name,
      description: body.description || '',
      collection: body.collection,
      category: body.category,
      movementType: body.movementType || 'Automatique',
      diameter: body.diameter || '41 mm',
      thickness: body.thickness || '11.5 mm',
      caseMaterial: body.caseMaterial || 'Acier inoxydable 904L',
      dialColor: body.dialColor || 'Cadran soleillé',
      strapMaterial: body.strapMaterial || 'Cuir d’alligator',
      gender: body.gender || 'Homme',
      materialCategory: body.materialCategory || 'Acier',
      strapCategory: body.strapCategory || 'Cuir',
      price: Number(body.price),
      promotionalPrice: body.promotionalPrice ? Number(body.promotionalPrice) : undefined,
      availability: stock === 0 ? 'ÉPUISÉ' : stock <= 2 ? 'SUR DEMANDE' : 'EN STOCK',
      badge: body.badge,
      limitedEditionNumber: body.limitedEditionNumber,
      isNew: body.isNew ?? true,
      isLimited: body.isLimited ?? false,
      images: body.images || {
        front: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=900&auto=format&fit=crop',
        back: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=900&auto=format&fit=crop',
        dial: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=900&auto=format&fit=crop',
        strap: 'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?q=80&w=900&auto=format&fit=crop',
        wrist: 'https://images.unsplash.com/photo-1547996160-71dfabbce5fa?q=80&w=900&auto=format&fit=crop',
      },
      specs: body.specs || {
        movement: 'Calibre NC-Manufacture',
        powerReserve: '70 heures',
        case: body.caseMaterial || 'Acier inoxydable 904L',
        diameter: body.diameter || '41 mm',
        waterResistance: '100 mètres (10 ATM)',
        glass: 'Glace saphir bombée traitée antireflet double face',
        strap: body.strapMaterial || 'Cuir d’alligator cousu main',
        clasp: 'Boucle déployante en or ou acier',
        warranty: '5 ans internationale manufacture',
      },
      history: body.history || body.description || '',
      tagline: body.tagline || 'L’élégance intemporelle signée Nicaise.a',
      reference,
      sku,
      stock,
      status: body.status || 'published',
      rating: 5,
      reviewsCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    products.unshift(newProduct);

    inventory.unshift({
      productId: newProduct.id,
      productName: newProduct.name,
      sku: newProduct.sku!,
      stock: newProduct.stock!,
      alertThreshold: 3,
      status: newProduct.stock! === 0 ? 'RUPTURE' : newProduct.stock! <= 3 ? 'STOCK FAIBLE' : 'EN STOCK',
      price: newProduct.price,
      updatedAt: new Date().toISOString(),
    });

    db.save();

    return res.status(201).json({ message: 'Montre ajoutée au catalogue d’exception avec succès.', product: newProduct });
  } catch (err: any) {
    return res.status(500).json({ error: 'Erreur lors de l’ajout du produit.', details: err.message });
  }
});

// Admin: Update watch
apiRouter.put('/products/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const products = db.getProducts();
  const index = products.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Montre introuvable.' });
  }

  const existing = products[index];
  const updated: Product = {
    ...existing,
    ...req.body,
    updatedAt: new Date().toISOString(),
  };

  products[index] = updated;

  // Update inventory record
  const inventory = db.getInventory();
  const invIndex = inventory.findIndex((i) => i.productId === req.params.id);
  if (invIndex !== -1) {
    const stock = updated.stock ?? inventory[invIndex].stock;
    const threshold = inventory[invIndex].alertThreshold;
    inventory[invIndex] = {
      ...inventory[invIndex],
      productName: updated.name,
      stock,
      price: updated.price,
      status: stock === 0 ? 'RUPTURE' : stock <= threshold ? 'STOCK FAIBLE' : 'EN STOCK',
      updatedAt: new Date().toISOString(),
    };
  }

  db.save();

  return res.json({ message: 'Garde-temps mis à jour.', product: updated });
});

// Admin: Delete watch
apiRouter.delete('/products/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const products = db.getProducts();
  const index = products.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Montre introuvable.' });
  }

  products.splice(index, 1);

  const inventory = db.getInventory();
  const invIdx = inventory.findIndex((i) => i.productId === req.params.id);
  if (invIdx !== -1) inventory.splice(invIdx, 1);

  db.save();

  return res.json({ message: 'Garde-temps retiré du catalogue.' });
});

// Admin: Toggle publish
apiRouter.patch('/products/:id/publish', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const products = db.getProducts();
  const product = products.find((p) => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Montre introuvable.' });
  }

  product.status = product.status === 'published' ? 'draft' : 'published';
  product.updatedAt = new Date().toISOString();
  db.save();

  return res.json({ message: `Statut modifié : ${product.status}`, product });
});

// Categories & Collections
apiRouter.get('/categories', (_req: Request, res: Response) => {
  return res.json({ categories: db.getCategories() });
});

apiRouter.get('/collections', (_req: Request, res: Response) => {
  return res.json({ collections: db.getCollections() });
});

// -------------------------------------------------------------
// 3. CART & STOCK VERIFICATION (Server-side)
// -------------------------------------------------------------

apiRouter.post('/cart/verify', (req: Request, res: Response) => {
  const { items } = req.body as { items: { productId: string; quantity: number }[] };
  if (!Array.isArray(items)) {
    return res.status(400).json({ error: 'Format de panier invalide.' });
  }

  const products = db.getProducts();
  const results = items.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    if (!product) {
      return { productId: item.productId, available: false, currentStock: 0, reason: 'Produit retiré' };
    }
    const currentStock = product.stock ?? 5;
    const available = currentStock >= item.quantity;
    return {
      productId: item.productId,
      productName: product.name,
      requestedQuantity: item.quantity,
      currentStock,
      available,
      price: product.promotionalPrice || product.price,
    };
  });

  const allAvailable = results.every((r) => r.available);

  return res.json({
    valid: allAvailable,
    details: results,
  });
});

// -------------------------------------------------------------
// 4. ORDERS & CHECKOUT
// -------------------------------------------------------------

apiRouter.post('/orders', (req: AuthenticatedRequest, res: Response) => {
  try {
    const { items, customer, shippingAddress, shippingMethod, paymentMethod, promoCode, momoPhone } = req.body;

    if (!items || !items.length || !customer || !shippingAddress) {
      return res.status(400).json({ error: 'Informations de commande incomplètes.' });
    }

    const products = db.getProducts();
    const inventory = db.getInventory();

    // 1. Verify stock server-side
    for (const item of items) {
      const prod = products.find((p) => p.id === item.product.id);
      if (!prod) {
        return res.status(400).json({ error: `La montre "${item.product.name}" n'est plus disponible.` });
      }
      const availableStock = prod.stock ?? 0;
      if (availableStock < item.quantity) {
        return res.status(400).json({
          error: `Stock insuffisant pour "${prod.name}". Il ne reste que ${availableStock} pièce(s) disponible(s).`,
        });
      }
    }

    // 2. Calculate subtotal
    let subtotal = 0;
    const validatedItems = items.map((item: any) => {
      const prod = products.find((p) => p.id === item.product.id)!;
      const unitPrice = prod.promotionalPrice || prod.price;
      subtotal += unitPrice * item.quantity;
      return {
        product: prod,
        quantity: item.quantity,
      };
    });

    // 3. Apply promotion if provided
    let discount = 0;
    if (promoCode) {
      const promos = db.getPromotions();
      const promo = promos.find((p) => p.code.toUpperCase() === promoCode.toUpperCase() && p.isActive);
      if (promo) {
        if (!promo.minAmount || subtotal >= promo.minAmount) {
          if (promo.discountPercent) {
            discount = Math.round((subtotal * promo.discountPercent) / 100);
          } else if (promo.discountFixed) {
            discount = Math.min(subtotal, promo.discountFixed);
          }
          promo.usedCount += 1;
        }
      }
    }

    // 4. Shipping cost
    const shippingCost = shippingMethod?.includes('express') || shippingMethod?.includes('privé') ? 0 : 0; // Offert pour les montres de prestige
    const total = Math.max(0, subtotal - discount + shippingCost);

    // 5. Decrement stock
    for (const item of validatedItems) {
      item.product.stock = Math.max(0, (item.product.stock ?? 1) - item.quantity);
      if (item.product.stock === 0) {
        item.product.availability = 'ÉPUISÉ';
      }

      // Update inventory list
      const invItem = inventory.find((i) => i.productId === item.product.id);
      if (invItem) {
        invItem.stock = item.product.stock;
        invItem.status = invItem.stock === 0 ? 'RUPTURE' : invItem.stock <= invItem.alertThreshold ? 'STOCK FAIBLE' : 'EN STOCK';
        invItem.updatedAt = new Date().toISOString();
      }
    }

    // 6. Generate order
    const orderNumber = db.generateOrderNumber();
    const certificateNumber = `CERT-NCA-2026-${Math.floor(10000 + Math.random() * 90000)}`;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      userId: req.user?.id || undefined,
      date: new Date().toISOString(),
      items: validatedItems,
      subtotal,
      shippingCost,
      discount,
      total,
      status: 'Paiement en cours',
      paymentStatus: 'PAYMENT_PENDING',
      customer,
      shippingMethod: shippingMethod || 'Convoyage sécurisé diplomatique offert',
      shippingAddress,
      paymentMethod,
      momoPhone,
      trackingCode: `TRK-VIP-${orderNumber.slice(-4)}-${Math.floor(1000 + Math.random() * 9000)}`,
      carrier: 'Maison Nicaise.a Privilège Express',
      guaranteeCertificateNumber: certificateNumber,
    };

    const orders = db.getOrders();
    orders.unshift(newOrder);

    // 7. Create payment record
    const paymentRecord: PaymentRecord = {
      id: `pay-${Date.now()}`,
      orderId: newOrder.id!,
      orderNumber,
      method: paymentMethod,
      amount: total,
      currency: 'FCFA',
      status: 'PAYMENT_PENDING',
      transactionRef: db.generateTransactionRef(paymentMethod),
      customerName: `${customer.firstName} ${customer.lastName}`,
      customerPhone: customer.phone,
      createdAt: new Date().toISOString(),
    };

    const payments = db.getPayments();
    payments.unshift(paymentRecord);

    // 8. If authenticated user, update statistics
    if (req.user?.id) {
      const users = db.getUsers();
      const user = users.find((u) => u.id === req.user!.id);
      if (user) {
        user.ordersCount = (user.ordersCount || 0) + 1;
        user.totalSpent = (user.totalSpent || 0) + total;
      }
    }

    db.save();

    // 9. Send order confirmation email
    sendSimulatedEmail(customer.email, `Confirmation de votre commande d'exception ${orderNumber} — NICAISE.A`, 'order_confirmation', {
      orderNumber,
      customerName: `${customer.firstName} ${customer.lastName}`,
      total,
      itemsCount: validatedItems.length,
      certificateNumber,
    });

    return res.status(201).json({
      message: 'Commande enregistrée avec prestige.',
      order: newOrder,
      payment: paymentRecord,
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Erreur lors de la création de la commande.', details: err.message });
  }
});

apiRouter.get('/orders', (req: AuthenticatedRequest, res: Response) => {
  const orders = db.getOrders();

  if (req.user?.role === 'ADMIN') {
    return res.json({ orders });
  }

  if (req.user?.id) {
    const userOrders = orders.filter((o) => o.userId === req.user!.id || o.customer.email.toLowerCase() === req.user!.email.toLowerCase());
    return res.json({ orders: userOrders });
  }

  return res.status(401).json({ error: 'Authentification requise pour consulter les commandes.' });
});

apiRouter.get('/orders/:orderNumber', (req: Request, res: Response) => {
  const orders = db.getOrders();
  const order = orders.find((o) => o.orderNumber === req.params.orderNumber);
  if (!order) {
    return res.status(404).json({ error: 'Commande introuvable.' });
  }
  return res.json({ order });
});

// Admin: Update order status
apiRouter.put('/orders/:id/status', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { status, paymentStatus } = req.body;
  const orders = db.getOrders();
  const order = orders.find((o) => o.id === req.params.id || o.orderNumber === req.params.id);

  if (!order) {
    return res.status(404).json({ error: 'Commande introuvable.' });
  }

  if (status) order.status = status;
  if (paymentStatus) order.paymentStatus = paymentStatus;

  // Send status update email if shipped or delivered
  if (status === 'Expédiée') {
    sendSimulatedEmail(order.customer.email, `Votre garde-temps NICAISE.A ${order.orderNumber} est en cours de convoyage`, 'order_shipped', {
      orderNumber: order.orderNumber,
      trackingCode: order.trackingCode,
      carrier: order.carrier,
    });
  } else if (status === 'Livrée') {
    sendSimulatedEmail(order.customer.email, `Livraison effectuée avec succès — Commande ${order.orderNumber}`, 'order_delivered', {
      orderNumber: order.orderNumber,
      guaranteeCertificateNumber: order.guaranteeCertificateNumber,
    });
  }

  db.save();

  return res.json({ message: 'Statut de la commande mis à jour.', order });
});

// -------------------------------------------------------------
// 5. PAYMENTS & GATEWAYS (MTN MoMo, Orange Money, Visa, Mastercard)
// -------------------------------------------------------------

apiRouter.post('/payments/process', (req: Request, res: Response) => {
  try {
    const { orderNumber, paymentMethod, momoPhone, cardToken } = req.body;

    if (!orderNumber || !paymentMethod) {
      return res.status(400).json({ error: 'Numéro de commande et moyen de paiement requis.' });
    }

    const orders = db.getOrders();
    const order = orders.find((o) => o.orderNumber === orderNumber);
    if (!order) {
      return res.status(404).json({ error: 'Commande introuvable.' });
    }

    const payments = db.getPayments();
    let payment = payments.find((p) => p.orderNumber === orderNumber);

    // Simulate payment gateway authorization
    // In production, uses Orange Money WebPay API, MTN MoMo Collection API, or Stripe/Visa gateway
    const isSuccess = true; // High-level simulated successful verification
    const status: PaymentStatus = isSuccess ? 'PAYMENT_SUCCESS' : 'PAYMENT_FAILED';

    if (!payment) {
      payment = {
        id: `pay-${Date.now()}`,
        orderId: order.id || order.orderNumber,
        orderNumber,
        method: paymentMethod,
        amount: order.total,
        currency: 'FCFA',
        status,
        transactionRef: db.generateTransactionRef(paymentMethod),
        customerName: `${order.customer.firstName} ${order.customer.lastName}`,
        customerPhone: momoPhone || order.customer.phone,
        createdAt: new Date().toISOString(),
      };
      payments.unshift(payment);
    } else {
      payment.status = status;
      payment.method = paymentMethod;
    }

    if (isSuccess) {
      order.status = 'Payée';
      order.paymentStatus = 'PAYMENT_SUCCESS';

      sendSimulatedEmail(order.customer.email, `Récépissé de paiement honoré — Commande ${orderNumber}`, 'payment_success', {
        orderNumber,
        amount: order.total,
        transactionRef: payment.transactionRef,
        method: paymentMethod,
      });
    }

    db.save();

    return res.json({
      success: isSuccess,
      status,
      transactionRef: payment.transactionRef,
      message: isSuccess
        ? 'Règlement validé avec succès par la chambre de compensation.'
        : 'Échec de la transaction. Veuillez vérifier vos plafonds ou tenter un autre moyen.',
      payment,
      order,
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Erreur lors du traitement du paiement.', details: err.message });
  }
});

apiRouter.get('/admin/payments', requireAdmin, (_req: AuthenticatedRequest, res: Response) => {
  return res.json({ payments: db.getPayments() });
});

// -------------------------------------------------------------
// 6. PROMOTIONS & PRIVILEGES
// -------------------------------------------------------------

apiRouter.post('/promotions/validate', (req: Request, res: Response) => {
  const { code, amount } = req.body;
  if (!code) {
    return res.status(400).json({ error: 'Code promotionnel requis.' });
  }

  const promos = db.getPromotions();
  const promo = promos.find((p) => p.code.toUpperCase() === code.toUpperCase().trim());

  if (!promo || !promo.isActive) {
    return res.status(404).json({ error: 'Code privilège invalide ou expiré.' });
  }

  if (promo.maxUses && promo.usedCount >= promo.maxUses) {
    return res.status(400).json({ error: 'Ce code privilège a atteint sa limite maximale d’utilisation.' });
  }

  const subtotal = Number(amount) || 0;
  if (promo.minAmount && subtotal < promo.minAmount) {
    return res.status(400).json({
      error: `Montant minimum d’achat requis : ${new Intl.NumberFormat('fr-FR').format(promo.minAmount)} FCFA.`,
    });
  }

  let discount = 0;
  if (promo.discountPercent) {
    discount = Math.round((subtotal * promo.discountPercent) / 100);
  } else if (promo.discountFixed) {
    discount = Math.min(subtotal, promo.discountFixed);
  }

  return res.json({
    valid: true,
    promo,
    discount,
    message: `Privilège appliqué : -${promo.discountPercent ? promo.discountPercent + '%' : new Intl.NumberFormat('fr-FR').format(discount) + ' FCFA'}`,
  });
});

apiRouter.get('/admin/promotions', requireAdmin, (_req: AuthenticatedRequest, res: Response) => {
  return res.json({ promotions: db.getPromotions() });
});

apiRouter.post('/admin/promotions', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { code, discountPercent, discountFixed, minAmount, maxUses, startDate, endDate } = req.body;
  if (!code) {
    return res.status(400).json({ error: 'Code requis.' });
  }

  const promotions = db.getPromotions();
  const newPromo: Promotion = {
    id: `promo-${Date.now()}`,
    code: code.toUpperCase().trim(),
    discountPercent: discountPercent ? Number(discountPercent) : undefined,
    discountFixed: discountFixed ? Number(discountFixed) : undefined,
    minAmount: minAmount ? Number(minAmount) : 0,
    maxUses: maxUses ? Number(maxUses) : 100,
    usedCount: 0,
    startDate: startDate || new Date().toISOString().slice(0, 10),
    endDate: endDate || '2026-12-31',
    isActive: true,
  };

  promotions.push(newPromo);
  db.save();

  return res.status(201).json({ message: 'Code privilège créé.', promotion: newPromo });
});

apiRouter.delete('/admin/promotions/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const promotions = db.getPromotions();
  const idx = promotions.findIndex((p) => p.id === req.params.id);
  if (idx !== -1) {
    promotions.splice(idx, 1);
    db.save();
  }
  return res.json({ message: 'Code promotionnel supprimé.' });
});

// -------------------------------------------------------------
// 7. REVIEWS & VERIFIED CLIENT RATINGS
// -------------------------------------------------------------

apiRouter.get('/reviews/product/:productId', (req: Request, res: Response) => {
  const reviews = db.getReviews();
  const approved = reviews.filter((r) => r.productId === req.params.productId && r.isApproved);
  return res.json({ reviews: approved });
});

apiRouter.post('/reviews', (req: AuthenticatedRequest, res: Response) => {
  const { productId, rating, comment, userName, userEmail } = req.body;
  if (!productId || !rating || !comment) {
    return res.status(400).json({ error: 'Champs obligatoires manquants pour l’avis.' });
  }

  const products = db.getProducts();
  const product = products.find((p) => p.id === productId);
  if (!product) {
    return res.status(404).json({ error: 'Montre introuvable.' });
  }

  // Check if user has purchased this product
  const orders = db.getOrders();
  const emailToCheck = req.user?.email || userEmail;
  const isVerified = orders.some(
    (o) =>
      o.customer.email.toLowerCase() === emailToCheck?.toLowerCase() &&
      o.items.some((it) => it.product.id === productId)
  );

  const reviews = db.getReviews();
  const newReview: Review = {
    id: `rev-${Date.now()}`,
    productId,
    productName: product.name,
    userId: req.user?.id || 'guest',
    userName: userName || (req.user ? `${req.user.email}` : 'Client Passionné'),
    userEmail: emailToCheck || '',
    rating: Math.min(5, Math.max(1, Number(rating))),
    comment,
    isVerifiedPurchase: isVerified,
    isApproved: true, // Auto-published by default, moderatable by admin
    createdAt: new Date().toISOString(),
  };

  reviews.unshift(newReview);
  db.save();

  return res.status(201).json({ message: 'Votre témoignage a été publié avec gratitude.', review: newReview });
});

apiRouter.get('/admin/reviews', requireAdmin, (_req: AuthenticatedRequest, res: Response) => {
  return res.json({ reviews: db.getReviews() });
});

apiRouter.put('/admin/reviews/:id/moderate', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { isApproved } = req.body;
  const reviews = db.getReviews();
  const review = reviews.find((r) => r.id === req.params.id);
  if (!review) {
    return res.status(404).json({ error: 'Avis introuvable.' });
  }

  review.isApproved = Boolean(isApproved);
  db.save();

  return res.json({ message: `Avis ${review.isApproved ? 'approuvé' : 'masqué'}.`, review });
});

apiRouter.delete('/admin/reviews/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const reviews = db.getReviews();
  const idx = reviews.findIndex((r) => r.id === req.params.id);
  if (idx !== -1) {
    reviews.splice(idx, 1);
    db.save();
  }
  return res.json({ message: 'Avis supprimé.' });
});

// -------------------------------------------------------------
// 8. SERVICE APRÈS-VENTE (SAV), GARANTIE, RÉPARATION
// -------------------------------------------------------------

apiRouter.post('/sav', (req: AuthenticatedRequest, res: Response) => {
  try {
    const { customerName, email, phone, watchModel, watchReference, serialNumber, requestType, description } = req.body;

    if (!customerName || !email || !phone || !watchModel || !requestType || !description) {
      return res.status(400).json({ error: 'Tous les champs obligatoires doivent être renseignés.' });
    }

    const ticketNumber = db.generateSavTicketNumber();
    const newTicket: SavTicket = {
      id: `sav-${Date.now()}`,
      ticketNumber,
      userId: req.user?.id || undefined,
      customerName,
      email,
      phone,
      watchModel,
      watchReference: watchReference || 'N/A',
      serialNumber,
      requestType,
      description,
      status: 'Nouveau',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const tickets = db.getSavTickets();
    tickets.unshift(newTicket);
    db.save();

    sendSimulatedEmail(email, `Confirmation de votre demande d'intervention ${ticketNumber} — Atelier NICAISE.A`, 'sav_confirmation', {
      ticketNumber,
      customerName,
      watchModel,
      requestType,
    });

    return res.status(201).json({
      message: 'Votre dossier d’intervention horlogère a été transmis à nos maîtres artisans.',
      ticket: newTicket,
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Erreur lors de la soumission du dossier SAV.', details: err.message });
  }
});

apiRouter.get('/sav', (req: AuthenticatedRequest, res: Response) => {
  const tickets = db.getSavTickets();

  if (req.user?.role === 'ADMIN') {
    return res.json({ tickets });
  }

  if (req.user?.id) {
    const userTickets = tickets.filter((t) => t.userId === req.user!.id || t.email.toLowerCase() === req.user!.email.toLowerCase());
    return res.json({ tickets: userTickets });
  }

  return res.status(401).json({ error: 'Connexion requise.' });
});

apiRouter.get('/sav/track/:ticketNumber', (req: Request, res: Response) => {
  const tickets = db.getSavTickets();
  const ticket = tickets.find((t) => t.ticketNumber.toUpperCase() === req.params.ticketNumber.toUpperCase());
  if (!ticket) {
    return res.status(404).json({ error: 'Numéro de dossier SAV introuvable dans nos registres d’atelier.' });
  }
  return res.json({ ticket });
});

apiRouter.put('/admin/sav/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { status, notes } = req.body;
  const tickets = db.getSavTickets();
  const ticket = tickets.find((t) => t.id === req.params.id || t.ticketNumber === req.params.id);
  if (!ticket) {
    return res.status(404).json({ error: 'Dossier SAV introuvable.' });
  }

  if (status) ticket.status = status;
  if (notes !== undefined) ticket.notes = notes;
  ticket.updatedAt = new Date().toISOString();

  db.save();

  return res.json({ message: 'Dossier SAV mis à jour.', ticket });
});

// -------------------------------------------------------------
// 9. INVENTORY & STOCK ALERTS
// -------------------------------------------------------------

apiRouter.get('/admin/inventory', requireAdmin, (_req: AuthenticatedRequest, res: Response) => {
  return res.json({ inventory: db.getInventory() });
});

apiRouter.put('/admin/inventory/:productId', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { stock, alertThreshold } = req.body;
  const inventory = db.getInventory();
  const item = inventory.find((i) => i.productId === req.params.productId);

  if (!item) {
    return res.status(404).json({ error: 'Article d’inventaire introuvable.' });
  }

  if (typeof stock === 'number') {
    item.stock = stock;
  }
  if (typeof alertThreshold === 'number') {
    item.alertThreshold = alertThreshold;
  }

  item.status = item.stock === 0 ? 'RUPTURE' : item.stock <= item.alertThreshold ? 'STOCK FAIBLE' : 'EN STOCK';
  item.updatedAt = new Date().toISOString();

  // Synchronize product record
  const products = db.getProducts();
  const prod = products.find((p) => p.id === req.params.productId);
  if (prod) {
    prod.stock = item.stock;
    prod.availability = item.stock === 0 ? 'ÉPUISÉ' : item.stock <= 2 ? 'SUR DEMANDE' : 'EN STOCK';
    prod.updatedAt = new Date().toISOString();
  }

  db.save();

  return res.json({ message: 'Stock mis à jour.', item });
});

// -------------------------------------------------------------
// 10. SHIPPING ZONES & RATES
// -------------------------------------------------------------

apiRouter.get('/shipping-zones', (_req: Request, res: Response) => {
  return res.json({ zones: db.getShippingZones() });
});

apiRouter.put('/admin/shipping-zones/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const zones = db.getShippingZones();
  const zone = zones.find((z) => z.id === req.params.id);
  if (!zone) {
    return res.status(404).json({ error: 'Zone de livraison introuvable.' });
  }

  const { standardPrice, expressPrice, deliveryDays } = req.body;
  if (typeof standardPrice === 'number') zone.standardPrice = standardPrice;
  if (typeof expressPrice === 'number') zone.expressPrice = expressPrice;
  if (deliveryDays) zone.deliveryDays = deliveryDays;

  db.save();

  return res.json({ message: 'Zone de livraison mise à jour.', zone });
});

// -------------------------------------------------------------
// 11. ADMIN DASHBOARD STATS & ANALYTICS
// -------------------------------------------------------------

apiRouter.get('/admin/stats', requireAdmin, (_req: AuthenticatedRequest, res: Response) => {
  const orders = db.getOrders();
  const users = db.getUsers();
  const products = db.getProducts();
  const inventory = db.getInventory();

  const totalRevenue = orders
    .filter((o) => o.status !== 'Annulée')
    .reduce((sum, o) => sum + (o.total || 0), 0);

  const totalOrders = orders.length;
  const totalClients = users.filter((u) => u.role === 'CLIENT').length;
  const averageBasket = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  const totalWatchesSold = orders
    .filter((o) => o.status !== 'Annulée')
    .reduce((sum, o) => sum + o.items.reduce((s, it) => s + it.quantity, 0), 0);

  const totalStockAvailable = inventory.reduce((sum, it) => sum + it.stock, 0);
  const lowStockCount = inventory.filter((it) => it.status === 'STOCK FAIBLE').length;
  const outOfStockCount = inventory.filter((it) => it.status === 'RUPTURE').length;

  // Monthly revenue trend (last 6 periods)
  const salesTimeline = [
    { period: 'Oct 2025', revenue: 4200000, orders: 3 },
    { period: 'Nov 2025', revenue: 6850000, orders: 5 },
    { period: 'Déc 2025', revenue: 12400000, orders: 8 },
    { period: 'Jan 2026', revenue: 8900000, orders: 6 },
    { period: 'Fév 2026', revenue: 9500000, orders: 7 },
    { period: 'Mar 2026', revenue: totalRevenue > 0 ? totalRevenue : 11200000, orders: totalOrders > 0 ? totalOrders : 8 },
  ];

  // Top selling watches calculation
  const productSalesMap: Record<string, { product: Product; count: number; totalRevenue: number }> = {};
  for (const order of orders) {
    if (order.status === 'Annulée') continue;
    for (const item of order.items) {
      const pId = item.product.id;
      if (!productSalesMap[pId]) {
        productSalesMap[pId] = { product: item.product, count: 0, totalRevenue: 0 };
      }
      productSalesMap[pId].count += item.quantity;
      productSalesMap[pId].totalRevenue += item.quantity * (item.product.promotionalPrice || item.product.price);
    }
  }

  const topSelling = Object.values(productSalesMap)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return res.json({
    kpis: {
      totalRevenue,
      totalOrders,
      totalClients,
      averageBasket,
      totalWatchesSold,
      totalStockAvailable,
      lowStockCount,
      outOfStockCount,
    },
    salesTimeline,
    topSelling,
  });
});

// -------------------------------------------------------------
// 12. STORE SETTINGS & WHATSAPP
// -------------------------------------------------------------

apiRouter.get('/settings', (_req: Request, res: Response) => {
  return res.json({ settings: db.getSettings() });
});

apiRouter.put('/admin/settings', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const updated = db.updateSettings(req.body);
  return res.json({ message: 'Paramètres enregistrés.', settings: updated });
});

// Email Logs for admin inspection
apiRouter.get('/admin/email-logs', requireAdmin, (_req: AuthenticatedRequest, res: Response) => {
  return res.json({ emailLogs });
});
