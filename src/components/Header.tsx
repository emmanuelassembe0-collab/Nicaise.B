import React, { useState, useEffect } from 'react';
import { Search, Heart, User, ShoppingBag, Menu, X, Clock, Sliders } from 'lucide-react';
import { PageView } from '../types';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  currentPage: PageView;
  onNavigate: (page: PageView, filterParam?: { key: string; value: string }) => void;
  cartCount: number;
  wishlistCount: number;
  onOpenSearch: () => void;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenAccount: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onNavigate,
  cartCount,
  wishlistCount,
  onOpenSearch,
  onOpenCart,
  onOpenWishlist,
  onOpenAccount,
}) => {
  const { user, isAdmin } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Accueil', page: 'home' as PageView },
    { label: 'Montres', page: 'catalog' as PageView },
    {
      label: 'Homme',
      page: 'catalog' as PageView,
      filter: { key: 'gender', value: 'Homme' },
    },
    {
      label: 'Femme',
      page: 'catalog' as PageView,
      filter: { key: 'gender', value: 'Femme' },
    },
    { label: 'Collections', page: 'collections' as PageView },
    { label: 'Nouveautés', page: 'new-arrivals' as PageView },
    { label: 'Éditions limitées', page: 'limited-editions' as PageView },
  ];

  return (
    <>
      {/* Top Banner - Subtle Haute Horlogerie announcement */}
      <div className="bg-[#11100E] text-[#EDE3D2] text-[11px] py-2 px-4 border-b border-[#332A20] text-center tracking-[0.2em] uppercase font-light flex items-center justify-center gap-3">
        <Clock className="w-3.5 h-3.5 text-[#C6A15B]" />
        <span>Maison Horlogère Nicaise.A — Livraison sécurisée & Certificat d’authenticité inclus</span>
      </div>

      {/* Main Sticky Header */}
      <header
        id="main-header"
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#FAF8F3]/95 backdrop-blur-md shadow-sm border-b border-[#EDE3D2]'
            : 'bg-[#FAF8F3] border-b border-[#EDE3D2]/70'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Mobile Burger (Left on Mobile) */}
            <div className="flex items-center lg:hidden">
              <button
                id="btn-mobile-menu"
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 text-[#11100E] hover:text-[#C6A15B] transition-colors"
                aria-label="Ouvrir le menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>

            {/* Left: Brand Logo */}
            <div className="flex-shrink-0 flex items-center">
              <button
                id="brand-logo-btn"
                onClick={() => onNavigate('home')}
                className="group text-left"
              >
                <span className="font-serif text-2xl sm:text-3xl tracking-[0.25em] text-[#11100E] group-hover:text-[#C6A15B] transition-colors font-medium">
                  NICAISE.A
                </span>
                <span className="block text-[9px] tracking-[0.35em] uppercase text-[#8A8780] group-hover:text-[#11100E] transition-colors mt-0.5">
                  Haute Horlogerie
                </span>
              </button>
            </div>

            {/* Center: Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-7 xl:space-x-8">
              {navLinks.map((link) => {
                const isActive =
                  currentPage === link.page &&
                  (!link.filter || (link.label === 'Homme' && false));

                return (
                  <button
                    key={link.label}
                    id={`nav-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                    onClick={() => {
                      if (link.filter) {
                        onNavigate(link.page, link.filter);
                      } else {
                        onNavigate(link.page);
                      }
                    }}
                    className={`text-[12px] uppercase tracking-[0.18em] font-medium py-1 relative transition-colors duration-200 ${
                      isActive
                        ? 'text-[#C6A15B]'
                        : 'text-[#11100E] hover:text-[#C6A15B]'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#C6A15B]" />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              {/* Search */}
              <button
                id="btn-header-search"
                type="button"
                onClick={onOpenSearch}
                aria-label="Rechercher une montre"
                className="p-2 text-[#11100E] hover:text-[#C6A15B] transition-colors"
                title="Rechercher"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist */}
              <button
                id="btn-header-wishlist"
                type="button"
                onClick={onOpenWishlist}
                aria-label="Favoris"
                className="p-2 text-[#11100E] hover:text-[#C6A15B] transition-colors relative"
                title="Favoris"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span
                    id="wishlist-badge"
                    className="absolute top-1 right-1 w-4 h-4 bg-[#C6A15B] text-white text-[9px] font-bold rounded-full flex items-center justify-center"
                  >
                    {wishlistCount}
                  </span>
                )}
              </button>

              {/* Admin Panel Quick Access */}
              {isAdmin && (
                <button
                  id="btn-header-admin"
                  type="button"
                  onClick={() => onNavigate('admin')}
                  className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-[11px] uppercase tracking-wider font-semibold border transition-all ${
                    currentPage === 'admin'
                      ? 'bg-[#C6A15B] text-[#11100E] border-[#C6A15B]'
                      : 'bg-[#11100E] text-[#D8BE7A] border-[#C6A15B]/50 hover:bg-[#C6A15B] hover:text-[#11100E]'
                  }`}
                  title="Panneau d'administration"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Admin</span>
                </button>
              )}

              {/* Account */}
              <button
                id="btn-header-account"
                type="button"
                onClick={onOpenAccount}
                aria-label="Compte client"
                className="flex items-center gap-1.5 p-2 text-[#11100E] hover:text-[#C6A15B] transition-colors"
                title={user ? `${user.firstName} (${user.role})` : 'Compte client'}
              >
                <User className="w-5 h-5" />
                {user && (
                  <span className="hidden md:inline text-[10px] uppercase font-medium tracking-wider text-[#11100E]">
                    {user.firstName}
                  </span>
                )}
              </button>

              {/* Cart */}
              <button
                id="btn-header-cart"
                type="button"
                onClick={onOpenCart}
                aria-label="Panier d'achat"
                className="flex items-center gap-2 py-2 px-3 bg-[#11100E] hover:bg-[#C6A15B] text-white transition-colors duration-300"
                title="Panier"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline text-[11px] uppercase tracking-widest font-medium">
                  Panier
                </span>
                <span
                  id="cart-count-badge"
                  className="bg-[#C6A15B] text-[#11100E] text-[10px] font-bold px-1.5 py-0.2 rounded-full min-w-[18px] text-center"
                >
                  {cartCount}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-drawer-backdrop"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden flex"
        >
          <div
            id="mobile-drawer-content"
            className="w-4/5 max-w-sm bg-[#FAF8F3] h-full shadow-2xl flex flex-col animate-in slide-in-from-left duration-300"
          >
            {/* Drawer Header */}
            <div className="p-6 border-b border-[#EDE3D2] flex items-center justify-between">
              <div>
                <span className="font-serif text-2xl tracking-[0.2em] text-[#11100E] block">
                  NICAISE.A
                </span>
                <span className="text-[9px] tracking-[0.3em] uppercase text-[#8A8780]">
                  Haute Horlogerie
                </span>
              </div>
              <button
                id="btn-close-mobile-menu"
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-[#11100E] hover:text-[#C6A15B]"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Links */}
            <div className="flex-1 overflow-y-auto py-6 px-6 space-y-4">
              <div className="text-[10px] uppercase tracking-[0.25em] text-[#8A8780] font-semibold mb-2">
                Navigation
              </div>
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  id={`mobile-nav-${link.label.toLowerCase()}`}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (link.filter) {
                      onNavigate(link.page, link.filter);
                    } else {
                      onNavigate(link.page);
                    }
                  }}
                  className="w-full text-left font-serif text-xl tracking-wider text-[#11100E] hover:text-[#C6A15B] py-2 border-b border-[#EDE3D2]/50 flex items-center justify-between"
                >
                  <span>{link.label}</span>
                  <span className="text-xs font-sans text-[#8A8780]">→</span>
                </button>
              ))}

              <div className="pt-6">
                <div className="text-[10px] uppercase tracking-[0.25em] text-[#8A8780] font-semibold mb-3">
                  La Maison
                </div>
                <button
                  id="mobile-nav-about"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigate('about');
                  }}
                  className="w-full text-left text-sm text-[#11100E] hover:text-[#C6A15B] py-1.5 block"
                >
                  L’Art du Temps & Histoire
                </button>
                <button
                  id="mobile-nav-sav"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigate('sav');
                  }}
                  className="w-full text-left text-sm text-[#11100E] hover:text-[#C6A15B] py-1.5 block"
                >
                  Service Après-Vente & Garantie
                </button>
                <button
                  id="mobile-nav-contact"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigate('contact');
                  }}
                  className="w-full text-left text-sm text-[#11100E] hover:text-[#C6A15B] py-1.5 block"
                >
                  Conciergerie & Salons Privés
                </button>
                {isAdmin && (
                  <button
                    id="mobile-nav-admin"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onNavigate('admin');
                    }}
                    className="w-full text-left text-sm font-semibold text-[#C6A15B] hover:text-[#11100E] py-1.5 block uppercase tracking-wider mt-2 border-t border-[#EDE3D2] pt-2"
                  >
                    ⚙ Panneau Direction / Atelier
                  </button>
                )}
              </div>
            </div>

            {/* Mobile Drawer Footer */}
            <div className="p-6 bg-[#EDE3D2]/30 border-t border-[#EDE3D2] text-xs text-[#8A8780] space-y-2">
              <p className="font-serif italic text-sm text-[#11100E]">
                « Le temps devient une signature. »
              </p>
              <p className="text-[10px] uppercase tracking-wider">
                Service client : +237 690 00 00 00 / +33 1 42 68 00 00
              </p>
            </div>
          </div>

          <div
            className="flex-1"
            onClick={() => setMobileMenuOpen(false)}
          />
        </div>
      )}
    </>
  );
};
