import React, { useState, useEffect } from 'react';
import { PageView, Product, CartItem, Order, CollectionName } from './types';
import { PRODUCTS } from './data/products';
import { api } from './services/api';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { SearchModal } from './components/SearchModal';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { AuthModal } from './components/AuthModal';
import { WhatsappConcierge } from './components/WhatsappConcierge';

// Views
import { HomePage } from './components/views/HomePage';
import { CatalogPage } from './components/views/CatalogPage';
import { ProductDetailPage } from './components/views/ProductDetailPage';
import { CollectionsPage } from './components/views/CollectionsPage';
import { NewArrivalsPage } from './components/views/NewArrivalsPage';
import { LimitedEditionsPage } from './components/views/LimitedEditionsPage';
import { AboutPage } from './components/views/AboutPage';
import { ContactPage } from './components/views/ContactPage';
import { CheckoutPage } from './components/views/CheckoutPage';
import { AccountPage } from './components/views/AccountPage';
import { AdminPage } from './components/views/AdminPage';
import { SavPage } from './components/views/SavPage';

export function App() {
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [catalogFilter, setCatalogFilter] = useState<{ key: string; value: string } | undefined>();
  const [products, setProducts] = useState<Product[]>(PRODUCTS);

  // Sync products from backend API
  const refreshProducts = async () => {
    try {
      const fetched = await api.products.getAll();
      if (fetched && fetched.length > 0) {
        setProducts(fetched);
      }
    } catch (e) {
      console.warn('Utilisation du catalogue de secours:', e);
    }
  };

  useEffect(() => {
    refreshProducts();
  }, []);

  // Modals & Drawers
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [wishlistDrawerOpen, setWishlistDrawerOpen] = useState(false);

  // Cart & Wishlist & Orders State with default initial items
  const [cart, setCart] = useState<CartItem[]>([
    {
      product: PRODUCTS.find((p) => p.id === 'nicaise-automatic-prestige') || PRODUCTS[0],
      quantity: 1,
    },
  ]);

  const [wishlist, setWishlist] = useState<Product[]>([
    PRODUCTS.find((p) => p.id === 'nicaise-tourbillon-nocturne') || PRODUCTS[4],
    PRODUCTS.find((p) => p.id === 'nicaise-ocean-submariner') || PRODUCTS[3],
  ]);

  const [orders, setOrders] = useState<Order[]>([
    {
      orderNumber: 'NC-2025-7814',
      date: '18 Novembre 2025',
      customer: {
        firstName: 'Alexandre',
        lastName: 'de Montmirail',
        email: 'alexandre@prestige.com',
        phone: '+225 07 48 92 10 01',
        address: 'Boulevard des Grands Chênes',
        city: 'Abidjan',
        postalCode: 'BP 1024',
        country: "Côte d'Ivoire",
      },
      items: [
        {
          product: PRODUCTS.find((p) => p.id === 'nicaise-heritage-or-rose') || PRODUCTS[1],
          quantity: 1,
        },
      ],
      shippingMethod: 'express-private',
      paymentMethod: 'card',
      total: 2150000,
      status: 'Livrée avec succès en mains propres',
    },
  ]);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage, selectedProduct]);

  // Navigation handlers
  const handleNavigate = (page: PageView, filterParam?: { key: string; value: string }) => {
    setCatalogFilter(filterParam);
    setCurrentPage(page);
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentPage('product-detail');
  };

  // Cart actions
  const handleAddToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    setCartDrawerOpen(true);
  };

  const handleBuyNow = (product: Product, quantity = 1) => {
    handleAddToCart(product, quantity);
    setCartDrawerOpen(false);
    setCurrentPage('checkout');
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  // Wishlist actions
  const handleToggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const isWishlisted = (productId: string) => {
    return wishlist.some((p) => p.id === productId);
  };

  const handleRemoveFromWishlist = (productId: string) => {
    setWishlist((prev) => prev.filter((p) => p.id !== productId));
  };

  // Order completion
  const handleOrderCompleted = (order: Order) => {
    setOrders((prev) => [order, ...prev]);
    setCart([]); // Clear cart upon purchase
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F3] text-[#11100E] font-sans antialiased selection:bg-[#C6A15B] selection:text-white">
      {/* Global Header */}
      <Header
        currentPage={currentPage}
        onNavigate={handleNavigate}
        cartCount={cartCount}
        wishlistCount={wishlist.length}
        onOpenCart={() => setCartDrawerOpen(true)}
        onOpenWishlist={() => setWishlistDrawerOpen(true)}
        onOpenSearch={() => setSearchModalOpen(true)}
        onOpenAccount={() => handleNavigate('account')}
      />

      {/* Main Content Router */}
      <main className="flex-1 w-full">
        {currentPage === 'home' && (
          <HomePage
            products={products}
            onSelectProduct={handleSelectProduct}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            isWishlisted={isWishlisted}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'catalog' && (
          <CatalogPage
            products={products}
            onSelectProduct={handleSelectProduct}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            isWishlisted={isWishlisted}
            initialFilter={catalogFilter}
          />
        )}

        {currentPage === 'product-detail' && selectedProduct && (
          <ProductDetailPage
            product={selectedProduct}
            allProducts={products}
            onBack={() => setCurrentPage('catalog')}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            onToggleWishlist={handleToggleWishlist}
            isWishlisted={isWishlisted(selectedProduct.id)}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentPage === 'collections' && (
          <CollectionsPage
            products={products}
            onSelectProduct={handleSelectProduct}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            isWishlisted={isWishlisted}
            onNavigateToCatalogWithCollection={(col: CollectionName) => {
              handleNavigate('catalog', { key: 'collection', value: col });
            }}
          />
        )}

        {currentPage === 'new-arrivals' && (
          <NewArrivalsPage
            products={products}
            onSelectProduct={handleSelectProduct}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            isWishlisted={isWishlisted}
          />
        )}

        {currentPage === 'limited-editions' && (
          <LimitedEditionsPage
            products={products}
            onSelectProduct={handleSelectProduct}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            isWishlisted={isWishlisted}
          />
        )}

        {currentPage === 'about' && (
          <AboutPage
            onNavigateToCatalog={() => handleNavigate('catalog')}
            onNavigateToContact={() => handleNavigate('contact')}
          />
        )}

        {currentPage === 'contact' && <ContactPage />}

        {currentPage === 'sav' && <SavPage />}

        {currentPage === 'admin' && (
          <AdminPage onNavigateToHome={() => handleNavigate('home')} />
        )}

        {currentPage === 'checkout' && (
          <CheckoutPage
            items={cart}
            onOrderCompleted={handleOrderCompleted}
            onNavigateToCatalog={() => handleNavigate('catalog')}
            onNavigateToHome={() => handleNavigate('home')}
          />
        )}

        {currentPage === 'account' && (
          <AccountPage
            orders={orders}
            wishlist={wishlist}
            onSelectProduct={handleSelectProduct}
            onAddToCart={handleAddToCart}
            onNavigateToCatalog={() => handleNavigate('catalog')}
            onNavigateToAdmin={() => handleNavigate('admin')}
          />
        )}
      </main>

      {/* Global Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Mobile Sticky Bottom Navigation Bar */}
      <MobileBottomNav
        currentPage={currentPage}
        onNavigate={handleNavigate}
        cartCount={cartCount}
        wishlistCount={wishlist.length}
        onOpenCart={() => setCartDrawerOpen(true)}
        onOpenWishlist={() => setWishlistDrawerOpen(true)}
        onOpenAccount={() => handleNavigate('account')}
      />

      {/* VIP WhatsApp Concierge Floating Contact */}
      <WhatsappConcierge />

      {/* Authentication Modal */}
      <AuthModal />

      {/* Instant Search Modal */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onSelectProduct={handleSelectProduct}
        onNavigateToCatalogWithSearch={(term: string) => {
          handleNavigate('catalog', { key: 'search', value: term });
        }}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={() => {
          setCartDrawerOpen(false);
          handleNavigate('checkout');
        }}
        onExploreCatalog={() => {
          setCartDrawerOpen(false);
          handleNavigate('catalog');
        }}
      />

      {/* Wishlist Drawer */}
      <WishlistDrawer
        isOpen={wishlistDrawerOpen}
        onClose={() => setWishlistDrawerOpen(false)}
        wishlist={wishlist}
        onRemoveFromWishlist={handleRemoveFromWishlist}
        onAddToCart={handleAddToCart}
        onSelectProduct={handleSelectProduct}
      />
    </div>
  );
}

export default App;

