import React, { useState } from 'react';
import { ArrowRight, Compass } from 'lucide-react';
import { Product, CollectionName } from '../../types';
import { COLLECTIONS_DATA } from '../../data/products';
import { ProductCard } from '../ProductCard';

interface CollectionsPageProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: (productId: string) => boolean;
  onNavigateToCatalogWithCollection: (col: CollectionName) => void;
}

export const CollectionsPage: React.FC<CollectionsPageProps> = ({
  products,
  onSelectProduct,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  onNavigateToCatalogWithCollection,
}) => {
  const [activeTab, setActiveTab] = useState<CollectionName>('Prestige');

  const activeCollectionMeta =
    COLLECTIONS_DATA.find((c) => c.id === activeTab) || COLLECTIONS_DATA[0];

  const collectionProducts = products.filter((p) => p.collection === activeTab);

  return (
    <div className="bg-[#FAF8F3] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-[0.3em] text-[#C6A15B] font-semibold block mb-2">
            Haute Horlogerie
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#11100E] tracking-wide mb-4">
            LES GRANDES COLLECTIONS
          </h1>
          <div className="w-16 h-[1.5px] bg-[#C6A15B] mx-auto mb-4" />
          <p className="font-serif italic text-base sm:text-lg text-[#332A20]">
            « Chaque ligne incarne une facette de l'excellence et de la signature Nicaise.a. »
          </p>
        </div>

        {/* Collection Selector Tabs */}
        <div className="flex items-center justify-start lg:justify-center overflow-x-auto gap-2 sm:gap-3 pb-4 mb-12 border-b border-[#EDE3D2]">
          {COLLECTIONS_DATA.map((col) => {
            const isActive = activeTab === col.id;
            return (
              <button
                key={col.id}
                onClick={() => setActiveTab(col.id)}
                className={`px-4 py-2.5 text-xs uppercase tracking-[0.16em] font-medium whitespace-nowrap transition-all duration-300 border ${
                  isActive
                    ? 'bg-[#11100E] text-white border-[#11100E] shadow-sm'
                    : 'bg-white text-[#8A8780] hover:text-[#11100E] border-[#EDE3D2] hover:border-[#C6A15B]'
                }`}
              >
                {col.name.replace('Collection ', '')}
              </button>
            );
          })}
        </div>

        {/* Collection Hero Banner */}
        <div className="relative overflow-hidden bg-[#11100E] border border-[#332A20] mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[380px] items-center">
            {/* Left Image */}
            <div className="lg:col-span-7 h-72 lg:h-full relative overflow-hidden">
              <img
                src={activeCollectionMeta.image}
                alt={activeCollectionMeta.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-80 scale-105 transition-transform duration-700 hover:scale-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-transparent to-[#11100E]" />
            </div>

            {/* Right Meta */}
            <div className="lg:col-span-5 p-8 lg:p-12 text-[#EDE3D2] space-y-4">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#C6A15B] font-semibold block">
                Collection Signature
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-white tracking-wide">
                {activeCollectionMeta.name}
              </h2>
              <p className="font-serif italic text-lg text-[#D8BE7A]">
                {activeCollectionMeta.tagline}
              </p>
              <p className="text-xs sm:text-sm text-[#8A8780] font-light leading-relaxed">
                {activeCollectionMeta.description}
              </p>
              <div className="pt-2">
                <button
                  onClick={() => onNavigateToCatalogWithCollection(activeCollectionMeta.id)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#C6A15B] hover:bg-[#D8BE7A] text-[#11100E] text-xs uppercase tracking-widest font-semibold transition-colors"
                >
                  <span>Explorer les {collectionProducts.length} pièces</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Collection Watches Grid */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8 pb-3 border-b border-[#EDE3D2]">
            <h3 className="font-serif text-2xl text-[#11100E]">
              Pièces de la collection ({collectionProducts.length})
            </h3>
            <button
              onClick={() => onNavigateToCatalogWithCollection(activeCollectionMeta.id)}
              className="text-xs uppercase tracking-wider text-[#C6A15B] hover:underline flex items-center gap-1"
            >
              Voir dans la boutique <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {collectionProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelectProduct={onSelectProduct}
                onAddToCart={onAddToCart}
                onToggleWishlist={onToggleWishlist}
                isWishlisted={isWishlisted(product.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
