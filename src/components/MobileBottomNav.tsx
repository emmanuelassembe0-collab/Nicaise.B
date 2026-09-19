import React from 'react';
import { Home, Watch, Heart, ShoppingBag, User } from 'lucide-react';
import { PageView } from '../types';

interface MobileBottomNavProps {
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenAccount: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentPage,
  onNavigate,
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenAccount,
}) => {
  return (
    <nav
      id="mobile-bottom-bar"
      aria-label="Navigation mobile principale"
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#FAF8F3]/95 backdrop-blur-md border-t border-[#EDE3D2] lg:hidden px-2 py-2 shadow-lg"
    >
      <div className="grid grid-cols-5 items-center text-center">
        {/* Accueil */}
        <button
          id="mobile-tab-home"
          type="button"
          onClick={() => onNavigate('home')}
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            currentPage === 'home' ? 'text-[#C6A15B]' : 'text-[#8A8780] hover:text-[#11100E]'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-wider uppercase font-medium">Accueil</span>
        </button>

        {/* Montres */}
        <button
          id="mobile-tab-catalog"
          type="button"
          onClick={() => onNavigate('catalog')}
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            currentPage === 'catalog' ? 'text-[#C6A15B]' : 'text-[#8A8780] hover:text-[#11100E]'
          }`}
        >
          <Watch className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-wider uppercase font-medium">Montres</span>
        </button>

        {/* Favoris */}
        <button
          id="mobile-tab-wishlist"
          type="button"
          onClick={onOpenWishlist}
          className="relative flex flex-col items-center justify-center py-1 text-[#8A8780] hover:text-[#C6A15B] transition-colors"
        >
          <Heart className="w-5 h-5 mb-0.5" />
          {wishlistCount > 0 && (
            <span className="absolute top-0 right-4 w-3.5 h-3.5 bg-[#C6A15B] text-white text-[8px] font-bold rounded-full flex items-center justify-center">
              {wishlistCount}
            </span>
          )}
          <span className="text-[10px] tracking-wider uppercase font-medium">Favoris</span>
        </button>

        {/* Panier */}
        <button
          id="mobile-tab-cart"
          type="button"
          onClick={onOpenCart}
          className="relative flex flex-col items-center justify-center py-1 text-[#8A8780] hover:text-[#C6A15B] transition-colors"
        >
          <ShoppingBag className="w-5 h-5 mb-0.5" />
          {cartCount > 0 && (
            <span className="absolute top-0 right-4 w-3.5 h-3.5 bg-[#11100E] text-[#D8BE7A] text-[8px] font-bold rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
          <span className="text-[10px] tracking-wider uppercase font-medium">Panier</span>
        </button>

        {/* Compte */}
        <button
          id="mobile-tab-account"
          type="button"
          onClick={onOpenAccount}
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            currentPage === 'account' ? 'text-[#C6A15B]' : 'text-[#8A8780] hover:text-[#11100E]'
          }`}
        >
          <User className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-wider uppercase font-medium">Compte</span>
        </button>
      </div>
    </nav>
  );
};
