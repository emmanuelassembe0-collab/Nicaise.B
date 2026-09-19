import React from 'react';
import { Award, Lock, Sparkles, ShieldCheck } from 'lucide-react';
import { Product, formatFCFA } from '../../types';
import { ProductCard } from '../ProductCard';

interface LimitedEditionsPageProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: (productId: string) => boolean;
}

export const LimitedEditionsPage: React.FC<LimitedEditionsPageProps> = ({
  products,
  onSelectProduct,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
}) => {
  // Only the rarest and limited edition pieces
  const limitedPieces = products.filter(
    (p) => p.isLimited || p.badge === 'ÉDITION LIMITÉE' || p.collection === 'Private Collection'
  );

  return (
    <div className="bg-[#11100E] text-[#EDE3D2] min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#C6A15B]/15 border border-[#C6A15B]/40 text-[#D8BE7A] text-[10px] uppercase tracking-[0.3em] font-semibold">
            <Lock className="w-3 h-3 text-[#C6A15B]" />
            <span>Salon d'Exception & Haute Complication</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl text-white tracking-[0.2em] font-normal uppercase">
            PRIVATE COLLECTION
          </h1>

          <p className="font-serif italic text-xl sm:text-2xl text-[#C6A15B]">
            « Des pièces rares destinées à ceux qui recherchent bien plus qu'une montre. »
          </p>

          <div className="w-20 h-[1.5px] bg-[#C6A15B] mx-auto" />

          <p className="text-xs sm:text-sm text-[#8A8780] font-light leading-relaxed max-w-xl mx-auto">
            Produites en séries strictement limitées et numérotées, ces créations rassemblent les plus grandes complications de l'horlogerie : tourbillons volants, cadrans d'aventurine et quantièmes perpétuels.
          </p>
        </div>

        {/* Featured Showcase for Pièce n° 12 / 100 */}
        <div className="bg-[#1C1A16] border border-[#C6A15B]/40 p-8 sm:p-12 mb-16 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 transform translate-x-8 -translate-y-8 w-64 h-64 bg-[#C6A15B]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 relative flex items-center justify-center">
              <div className="relative w-full max-w-sm aspect-square bg-[#11100E] border border-[#332A20] p-6 flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?q=80&w=1000&auto=format&fit=crop"
                  alt="Nicaise.a Tourbillon Nocturne"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain filter drop-shadow-2xl"
                />
                <span className="absolute top-4 left-4 text-[10px] uppercase tracking-widest px-3 py-1 bg-[#11100E] text-[#D8BE7A] border border-[#C6A15B]/60 font-semibold">
                  ÉDITION LIMITÉE
                </span>
                <span className="absolute bottom-4 right-4 text-[11px] font-mono uppercase tracking-widest px-3 py-1 bg-[#332A20] text-white">
                  Pièce n° 12 / 100
                </span>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-6">
              <div>
                <span className="text-xs uppercase tracking-[0.3em] text-[#C6A15B] font-semibold block mb-1">
                  Private Collection
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl text-white tracking-wide mb-2">
                  Nicaise.a Tourbillon Nocturne
                </h2>
                <div className="inline-block px-3 py-1 bg-[#332A20] text-[#D8BE7A] text-xs font-mono mb-4 border border-[#C6A15B]/30">
                  ÉDITION LIMITÉE — Pièce n° 12 / 100
                </div>
                <p className="text-xs sm:text-sm text-[#EDE3D2]/80 leading-relaxed font-light">
                  Façonnée dans un bloc de platine 950 massif et dotée d’un cadran en aventurine scintillante, cette pièce d’exception accueille un tourbillon volant effectuant une révolution par minute.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 py-4 border-y border-[#332A20] text-xs">
                <div>
                  <span className="text-[#8A8780] block text-[10px] uppercase">Boîtier</span>
                  <span className="text-white font-medium">Platine 950 massif</span>
                </div>
                <div>
                  <span className="text-[#8A8780] block text-[10px] uppercase">Réserve de marche</span>
                  <span className="text-white font-medium">100 heures (4 jours)</span>
                </div>
                <div>
                  <span className="text-[#8A8780] block text-[10px] uppercase">Complication</span>
                  <span className="text-[#C6A15B] font-medium">Tourbillon Volant 60s</span>
                </div>
                <div>
                  <span className="text-[#8A8780] block text-[10px] uppercase">Garantie</span>
                  <span className="text-white font-medium">72 mois manuscrite</span>
                </div>
              </div>

              <div className="flex items-baseline justify-between pt-2">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#8A8780] block">
                    Investissement Horloger
                  </span>
                  <span className="text-3xl font-serif text-[#C6A15B] font-medium">
                    {formatFCFA(14500000)}
                  </span>
                </div>

                <button
                  onClick={() => {
                    const tourbillon = products.find((p) => p.id === 'nicaise-tourbillon-nocturne');
                    if (tourbillon) onSelectProduct(tourbillon);
                  }}
                  className="px-8 py-3.5 bg-[#C6A15B] hover:bg-[#D8BE7A] text-[#11100E] text-xs uppercase tracking-widest font-semibold transition-colors"
                >
                  Acquérir cette pièce
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Private Collection Grid */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8 pb-3 border-b border-[#332A20]">
            <h3 className="font-serif text-2xl text-white">
              Garde-Temps Numérotés & Séries Rares ({limitedPieces.length})
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {limitedPieces.map((product) => (
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

        {/* Exclusivity Certificate Note */}
        <div className="bg-[#1C1A16] p-8 border border-[#332A20] text-center max-w-2xl mx-auto text-xs text-[#8A8780] space-y-2">
          <Award className="w-8 h-8 text-[#C6A15B] mx-auto mb-2" />
          <h4 className="text-white uppercase font-serif text-base tracking-widest">
            Protocole d'Attribution Privée
          </h4>
          <p className="leading-relaxed">
            Chaque propriétaire d'une pièce de la Private Collection reçoit une carte d’identité horlogère en titane gravée au laser et bénéficie d'une invitation perpétuelle aux visites de notre manufacture à Genève.
          </p>
        </div>
      </div>
    </div>
  );
};
