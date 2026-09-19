import React from 'react';
import { X, Trash2, ShoppingBag, Heart, ArrowRight } from 'lucide-react';
import { Product, formatFCFA } from '../types';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlist: Product[];
  onRemoveFromWishlist: (productId: string) => void;
  onAddToCart: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlist,
  onRemoveFromWishlist,
  onAddToCart,
  onSelectProduct,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="wishlist-drawer-backdrop"
      className="fixed inset-0 z-50 bg-[#11100E]/70 backdrop-blur-sm flex justify-end"
      onClick={onClose}
    >
      <div
        id="wishlist-drawer-panel"
        className="w-full max-w-md bg-[#FAF8F3] h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 border-l border-[#EDE3D2]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-[#EDE3D2] flex items-center justify-between bg-white">
          <div>
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#C6A15B] font-semibold block">
              Vos Préférés
            </span>
            <h3 className="font-serif text-2xl text-[#11100E]">
              Garde-Temps Favoris ({wishlist.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Fermer les favoris"
            className="p-2 text-[#8A8780] hover:text-[#11100E]"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {wishlist.length === 0 ? (
            <div className="text-center py-16 px-4">
              <Heart className="w-12 h-12 text-[#C6A15B]/50 mx-auto mb-4" />
              <h4 className="font-serif text-xl text-[#11100E] mb-2">
                Aucun favori enregistré
              </h4>
              <p className="text-xs text-[#8A8780] max-w-xs mx-auto mb-6 leading-relaxed">
                Cliquez sur l'icône cœur lors de la navigation pour conserver vos pièces favorites.
              </p>
            </div>
          ) : (
            wishlist.map((product) => (
              <div
                key={product.id}
                className="flex gap-4 p-4 bg-white border border-[#EDE3D2]"
              >
                <div
                  onClick={() => {
                    onClose();
                    onSelectProduct(product);
                  }}
                  className="w-20 h-20 bg-[#FAF8F3] p-1 border border-[#EDE3D2]/60 cursor-pointer flex-shrink-0"
                >
                  <img
                    src={product.images.front}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] uppercase tracking-wider text-[#C6A15B]">
                      {product.collection}
                    </span>
                    <button
                      onClick={() => onRemoveFromWishlist(product.id)}
                      className="text-[#8A8780] hover:text-[#c62828] p-1"
                      title="Supprimer des favoris"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <h4
                    onClick={() => {
                      onClose();
                      onSelectProduct(product);
                    }}
                    className="font-serif text-base text-[#11100E] font-medium truncate cursor-pointer hover:text-[#C6A15B]"
                  >
                    {product.name}
                  </h4>

                  <div className="text-[11px] text-[#8A8780]">
                    {product.diameter} • {product.movementType}
                  </div>

                  <div className="text-xs font-bold text-[#11100E] mt-1 mb-2">
                    {formatFCFA(product.price)}
                  </div>

                  <button
                    onClick={() => {
                      onAddToCart(product);
                    }}
                    className="w-full py-2 px-3 bg-[#11100E] hover:bg-[#C6A15B] text-white text-[11px] font-medium uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <ShoppingBag className="w-3 h-3" />
                    <span>Ajouter au panier</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
