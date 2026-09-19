import React from 'react';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { Product, formatFCFA } from '../types';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, e?: React.MouseEvent) => void;
  onToggleWishlist: (product: Product, e?: React.MouseEvent) => void;
  isWishlisted: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelectProduct,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
}) => {
  return (
    <div
      id={`product-card-${product.id}`}
      className="group relative flex flex-col bg-[#FAF8F3] border border-[#EDE3D2] rounded-none hover:border-[#C6A15B]/60 transition-all duration-500 overflow-hidden"
    >
      {/* Top badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 pointer-events-none">
        {product.badge && (
          <span
            id={`badge-${product.id}`}
            className={`text-[10px] uppercase font-semibold tracking-widest px-2.5 py-1 ${
              product.badge === 'ÉDITION LIMITÉE'
                ? 'bg-[#11100E] text-[#D8BE7A] border border-[#C6A15B]/40'
                : product.badge === 'NOUVEAU'
                ? 'bg-[#C6A15B] text-white'
                : 'bg-[#FAF8F3]/90 text-[#11100E] border border-[#EDE3D2]'
            }`}
          >
            {product.badge}
          </span>
        )}
        {product.limitedEditionNumber && (
          <span className="text-[9px] uppercase tracking-wider px-2 py-0.5 bg-[#332A20] text-[#EDE3D2]">
            {product.limitedEditionNumber}
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        id={`btn-wishlist-${product.id}`}
        type="button"
        onClick={(e) => onToggleWishlist(product, e)}
        aria-label="Ajouter aux favoris"
        className="absolute top-3 right-3 z-10 p-2 bg-[#FAF8F3]/85 hover:bg-white text-[#11100E] border border-[#EDE3D2] hover:border-[#C6A15B] transition-colors duration-300"
      >
        <Heart
          className={`w-4 h-4 transition-transform duration-300 active:scale-125 ${
            isWishlisted ? 'fill-[#C6A15B] text-[#C6A15B]' : 'text-[#8A8780] hover:text-[#C6A15B]'
          }`}
        />
      </button>

      {/* Product Image Stage */}
      <div
        onClick={() => onSelectProduct(product)}
        className="relative w-full aspect-square bg-[#F5F2EB] overflow-hidden cursor-pointer flex items-center justify-center p-6"
      >
        <img
          src={product.images.front}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-contain object-center transition-transform duration-700 ease-out group-hover:scale-105 group-hover:rotate-1"
          loading="lazy"
        />
        {/* Subtle hover overlay with alternate dial view */}
        <div className="absolute inset-0 bg-[#11100E]/0 group-hover:bg-[#11100E]/5 transition-colors duration-500 pointer-events-none" />
      </div>

      {/* Product Info */}
      <div className="flex flex-col flex-1 p-5 bg-white border-t border-[#EDE3D2]/70">
        {/* Collection & Movement Category */}
        <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-[#8A8780] mb-1.5">
          <span>{product.collection}</span>
          <span className="text-[#C6A15B] font-medium">{product.movementType}</span>
        </div>

        {/* Watch Title */}
        <h3
          onClick={() => onSelectProduct(product)}
          className="font-serif text-xl text-[#11100E] hover:text-[#C6A15B] transition-colors cursor-pointer leading-snug tracking-wide line-clamp-1 mb-2"
        >
          {product.name}
        </h3>

        {/* Key Attributes */}
        <div className="grid grid-cols-2 gap-y-1 text-[11px] text-[#8A8780] mb-3 pb-3 border-b border-[#EDE3D2]/60">
          <div>
            <span className="text-[#8A8780]">Boîtier: </span>
            <span className="text-[#11100E] font-medium">{product.materialCategory}</span>
          </div>
          <div className="text-right">
            <span className="text-[#8A8780]">Diamètre: </span>
            <span className="text-[#11100E] font-medium">{product.diameter}</span>
          </div>
          <div className="col-span-2 line-clamp-1">
            <span className="text-[#8A8780]">Cadran: </span>
            <span className="text-[#11100E]">{product.dialColor}</span>
          </div>
        </div>

        {/* Price & Availability */}
        <div className="flex items-baseline justify-between mb-4">
          <div className="flex flex-col">
            <span className="text-[10px] tracking-wider uppercase text-[#8A8780]">Prix horloger</span>
            <span className="text-base font-semibold text-[#11100E] tracking-tight">
              {formatFCFA(product.price)}
            </span>
          </div>
          <span
            className={`text-[10px] tracking-widest uppercase font-medium px-2 py-0.5 ${
              product.availability === 'EN STOCK'
                ? 'text-[#2e7d32] bg-[#e8f5e9]'
                : product.availability === 'PIÈCE UNIQUE'
                ? 'text-[#C6A15B] bg-[#FAF8F3] border border-[#C6A15B]/30'
                : 'text-[#8A8780] bg-[#f5f5f5]'
            }`}
          >
            {product.availability}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 mt-auto">
          <button
            id={`btn-view-${product.id}`}
            type="button"
            onClick={() => onSelectProduct(product)}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 text-[11px] font-medium tracking-widest uppercase text-[#11100E] bg-[#FAF8F3] hover:bg-[#EDE3D2] border border-[#EDE3D2] transition-colors"
          >
            <span>Voir</span>
            <ArrowRight className="w-3 h-3" />
          </button>
          <button
            id={`btn-cart-${product.id}`}
            type="button"
            onClick={(e) => onAddToCart(product, e)}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 text-[11px] font-medium tracking-widest uppercase text-white bg-[#11100E] hover:bg-[#C6A15B] transition-colors"
          >
            <ShoppingBag className="w-3 h-3" />
            <span>Panier</span>
          </button>
        </div>
      </div>
    </div>
  );
};
