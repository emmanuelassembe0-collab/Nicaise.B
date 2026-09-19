import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, Lock, ShoppingBag, ShieldCheck, ArrowRight } from 'lucide-react';
import { CartItem, formatFCFA } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onProceedToCheckout: () => void;
  onExploreCatalog: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  onExploreCatalog,
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [promoError, setPromoError] = useState('');

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const discountRate = discountApplied ? 0.05 : 0; // 5% privilege discount
  const discountAmount = subtotal * discountRate;
  const shippingCost = 0; // Free VIP secured shipping for luxury watches
  const total = subtotal - discountAmount + shippingCost;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'NICAISE5' || promoCode.trim().toUpperCase() === 'PRIVILEGE') {
      setDiscountApplied(true);
      setPromoError('');
    } else {
      setPromoError('Code privilège non reconnu. Essayez : NICAISE5');
    }
  };

  if (!isOpen) return null;

  return (
    <div
      id="cart-drawer-backdrop"
      className="fixed inset-0 z-50 bg-[#11100E]/70 backdrop-blur-sm flex justify-end"
      onClick={onClose}
    >
      <div
        id="cart-drawer-panel"
        className="w-full max-w-md bg-[#FAF8F3] h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 border-l border-[#EDE3D2]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-6 border-b border-[#EDE3D2] flex items-center justify-between bg-white">
          <div>
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#C6A15B] font-semibold block">
              Haute Horlogerie
            </span>
            <h3 className="font-serif text-2xl text-[#11100E]">
              Votre Coffret ({items.reduce((acc, i) => acc + i.quantity, 0)})
            </h3>
          </div>
          <button
            id="btn-close-cart"
            onClick={onClose}
            aria-label="Fermer le panier"
            className="p-2 text-[#8A8780] hover:text-[#11100E] transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-16 px-4">
              <ShoppingBag className="w-12 h-12 text-[#C6A15B]/50 mx-auto mb-4" />
              <h4 className="font-serif text-xl text-[#11100E] mb-2">
                Votre coffret est actuellement vide
              </h4>
              <p className="text-xs text-[#8A8780] max-w-xs mx-auto mb-6 leading-relaxed">
                Explorez notre univers horloger et choisissez le garde-temps qui définira votre signature.
              </p>
              <button
                id="btn-empty-cart-catalog"
                onClick={() => {
                  onClose();
                  onExploreCatalog();
                }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#11100E] hover:bg-[#C6A15B] text-white text-xs uppercase tracking-widest font-medium transition-colors"
              >
                <span>Découvrir les montres</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            items.map((item) => {
              const itemTotal = item.product.price * item.quantity;
              return (
                <div
                  key={item.product.id}
                  id={`cart-item-${item.product.id}`}
                  className="flex gap-4 p-4 bg-white border border-[#EDE3D2] relative group"
                >
                  {/* Image */}
                  <div className="w-20 h-20 bg-[#FAF8F3] border border-[#EDE3D2]/50 p-2 flex items-center justify-center flex-shrink-0">
                    <img
                      src={item.product.images.front}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-[#C6A15B] block">
                          {item.product.collection}
                        </span>
                        <h4 className="font-serif text-base text-[#11100E] font-medium truncate">
                          {item.product.name}
                        </h4>
                      </div>
                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="text-[#8A8780] hover:text-[#c62828] p-1 transition-colors"
                        title="Retirer la pièce"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="text-[11px] text-[#8A8780] mt-0.5">
                      {item.product.diameter} • {item.product.movementType}
                    </div>

                    <div className="text-xs font-semibold text-[#11100E] mt-1">
                      {formatFCFA(item.product.price)}
                    </div>

                    {/* Quantity Selector & Item Subtotal */}
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#EDE3D2]/40">
                      <div className="flex items-center border border-[#EDE3D2]">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="p-1 text-[#8A8780] hover:text-[#11100E] disabled:opacity-30"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-medium text-[#11100E]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 text-[#8A8780] hover:text-[#11100E]"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] uppercase text-[#8A8780] block">Sous-total</span>
                        <span className="text-xs font-bold text-[#11100E]">
                          {formatFCFA(itemTotal)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Summary & Checkout */}
        {items.length > 0 && (
          <div className="p-6 bg-white border-t border-[#EDE3D2] space-y-4">
            {/* Promo Code Form */}
            <form onSubmit={handleApplyPromo} className="flex gap-2">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Code privilège (ex: NICAISE5)"
                className="flex-1 bg-[#FAF8F3] border border-[#EDE3D2] px-3 py-2 text-xs text-[#11100E] uppercase placeholder:normal-case focus:outline-none focus:border-[#C6A15B]"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-[#FAF8F3] hover:bg-[#EDE3D2] text-[#11100E] border border-[#EDE3D2] text-xs font-medium uppercase tracking-wider"
              >
                Appliquer
              </button>
            </form>
            {promoError && <p className="text-[11px] text-red-600">{promoError}</p>}
            {discountApplied && (
              <p className="text-[11px] text-[#2e7d32] font-medium">
                ✓ Remise Privilège de 5% appliquée !
              </p>
            )}

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs border-t border-[#EDE3D2] pt-3">
              <div className="flex justify-between text-[#8A8780]">
                <span>Sous-total</span>
                <span className="text-[#11100E] font-medium">{formatFCFA(subtotal)}</span>
              </div>
              {discountApplied && (
                <div className="flex justify-between text-[#2e7d32]">
                  <span>Réduction Privilège (5%)</span>
                  <span>-{formatFCFA(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-[#8A8780]">
                <span>Livraison</span>
                <span className="text-[#2e7d32] font-medium">Offerte (Convoyage sécurisé)</span>
              </div>
              <div className="flex justify-between text-base font-bold text-[#11100E] pt-2 border-t border-[#EDE3D2]">
                <span className="font-serif text-lg">Total</span>
                <span className="text-[#C6A15B] text-lg font-sans">{formatFCFA(total)}</span>
              </div>
            </div>

            {/* Proceed to checkout button */}
            <button
              id="btn-proceed-to-checkout"
              onClick={() => {
                onClose();
                onProceedToCheckout();
              }}
              className="w-full py-4 bg-[#11100E] hover:bg-[#C6A15B] text-white text-xs uppercase tracking-[0.2em] font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-md"
            >
              <span>Procéder au paiement</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Trust badge */}
            <div className="flex items-center justify-center gap-2 text-[11px] text-[#8A8780]">
              <Lock className="w-3.5 h-3.5 text-[#C6A15B]" />
              <span>Paiement sécurisé</span>
              <span>•</span>
              <ShieldCheck className="w-3.5 h-3.5 text-[#C6A15B]" />
              <span>Garantie manufacture 24h</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
