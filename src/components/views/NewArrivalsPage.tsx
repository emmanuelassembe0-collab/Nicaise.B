import React from 'react';
import { Sparkles } from 'lucide-react';
import { Product } from '../../types';
import { ProductCard } from '../ProductCard';

interface NewArrivalsPageProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: (productId: string) => boolean;
}

export const NewArrivalsPage: React.FC<NewArrivalsPageProps> = ({
  products,
  onSelectProduct,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
}) => {
  // Filter newest additions or highlight those with badge === 'NOUVEAU' or isNew === true
  const newArrivals = products.filter((p) => p.isNew || p.badge === 'NOUVEAU' || p.category === 'Éditions Limitées' || p.badge === 'COUP DE CŒUR');

  return (
    <div className="bg-[#FAF8F3] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#C6A15B]/10 border border-[#C6A15B]/30 text-[#C6A15B] text-[10px] uppercase tracking-[0.25em] font-semibold mb-3">
            <Sparkles className="w-3 h-3" />
            <span>Millésime Horloger 2026</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#11100E] tracking-wide mb-4">
            LES NOUVEAUTÉS
          </h1>
          <div className="w-16 h-[1.5px] bg-[#C6A15B] mx-auto mb-4" />
          <p className="font-serif italic text-base sm:text-lg text-[#332A20] leading-relaxed">
            « Découvrez les dernières créations sorties de nos ateliers genevois, repoussant les frontières du design et de l’ingénierie mécanique. »
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {newArrivals.map((product) => (
            <ProductCard
              key={product.id}
              product={{ ...product, badge: 'NOUVEAU' }}
              onSelectProduct={onSelectProduct}
              onAddToCart={onAddToCart}
              onToggleWishlist={onToggleWishlist}
              isWishlisted={isWishlisted(product.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
