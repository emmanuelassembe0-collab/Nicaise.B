import React from 'react';
import { ArrowRight, Compass, ShieldCheck, Sparkles, Clock, CheckCircle } from 'lucide-react';
import { Product, PageView, formatFCFA } from '../../types';
import { HERO_IMAGE, ATELIER_IMAGE, CATEGORIES_DATA } from '../../data/products';
import { ProductCard } from '../ProductCard';

interface HomePageProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: (productId: string) => boolean;
  onNavigate: (page: PageView, filterParam?: { key: string; value: string }) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  products,
  onSelectProduct,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  onNavigate,
}) => {
  // Iconic flagship product requested by user: Nicaise.a Automatic Prestige
  const flagshipWatch = products.find((p) => p.id === 'nicaise-automatic-prestige') || products[0];

  // Selection of iconic featured watches
  const featuredWatches = products.slice(0, 8);

  return (
    <div className="flex flex-col w-full">
      {/* 5. HERO SECTION */}
      <section
        id="hero-section"
        className="relative min-h-[90vh] flex items-center justify-center bg-[#11100E] overflow-hidden"
      >
        {/* Background Photography (realistic watch on Italian marble and walnut wood) */}
        <div className="absolute inset-0">
          <img
            src={HERO_IMAGE}
            alt="Garde-temps d'exception Nicaise.a sur marbre et bois noble"
            className="w-full h-full object-cover object-center opacity-65 scale-105 transition-transform duration-1000 ease-out"
          />
          {/* Subtle gradient vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#11100E] via-[#11100E]/40 to-[#11100E]/70" />
          <div className="absolute inset-0 bg-radial-at-c from-transparent via-[#11100E]/30 to-[#11100E]/90" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          {/* Overline */}
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 border border-[#C6A15B]/40 bg-[#11100E]/70 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C6A15B] animate-pulse" />
            <span className="text-[11px] uppercase tracking-[0.3em] text-[#D8BE7A] font-medium">
              Maison Horlogère d'Exception
            </span>
          </div>

          {/* Main Title */}
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-[0.2em] text-[#FAF8F3] font-normal uppercase mb-4">
            NICAISE.A
          </h1>

          {/* Brand Signature */}
          <p className="font-serif italic text-2xl sm:text-3xl md:text-4xl text-[#C6A15B] tracking-wider mb-6">
            « Le temps devient une signature. »
          </p>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-[#EDE3D2]/90 font-light leading-relaxed tracking-wide mb-10">
            Découvrez une sélection de garde-temps d'exception conçus pour ceux qui considèrent le temps comme la plus précieuse des signatures.
          </p>

          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <button
              id="hero-btn-discover-watches"
              onClick={() => onNavigate('catalog')}
              className="w-full sm:w-auto px-8 py-4 bg-[#C6A15B] hover:bg-[#D8BE7A] text-[#11100E] text-xs uppercase tracking-[0.2em] font-semibold transition-all duration-300 shadow-lg hover:shadow-[#C6A15B]/20 flex items-center justify-center gap-2 group"
            >
              <span>DÉCOUVRIR LES MONTRES</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              id="hero-btn-explore-collections"
              onClick={() => onNavigate('collections')}
              className="w-full sm:w-auto px-8 py-4 bg-transparent hover:bg-white/10 text-[#FAF8F3] border border-[#FAF8F3]/60 hover:border-[#FAF8F3] text-xs uppercase tracking-[0.2em] font-medium transition-all duration-300 flex items-center justify-center"
            >
              EXPLORER LES COLLECTIONS
            </button>
          </div>

          {/* Micro badges at bottom of Hero */}
          <div className="mt-16 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4 text-[#8A8780] text-[11px] uppercase tracking-wider font-light">
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#C6A15B]" />
              <span>Finitions Haute Horlogerie</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Clock className="w-3.5 h-3.5 text-[#C6A15B]" />
              <span>Calibres Précision Suisse</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C6A15B]" />
              <span>Garantie Internationale</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Compass className="w-3.5 h-3.5 text-[#C6A15B]" />
              <span>Livraison Sécurisée Privée</span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. SECTION CATÉGORIES - EXPLOREZ NOTRE UNIVERS HORLOGER */}
      <section id="categories-section" className="py-24 bg-[#FAF8F3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-[0.3em] text-[#C6A15B] font-semibold block mb-2">
              Univers & Savoir-Faire
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#11100E] tracking-wide mb-4">
              EXPLOREZ NOTRE UNIVERS HORLOGER
            </h2>
            <div className="w-16 h-[1.5px] bg-[#C6A15B] mx-auto mb-4" />
            <p className="text-sm text-[#8A8780] font-light leading-relaxed">
              Des garde-temps raffinés aux complications de haute volée, découvrez des créations forgées avec rigueur et passion.
            </p>
          </div>

          {/* Visual Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Montres Homme */}
            <div
              id="cat-card-homme"
              onClick={() => onNavigate('catalog', { key: 'gender', value: 'Homme' })}
              className="group relative h-96 overflow-hidden cursor-pointer border border-[#EDE3D2] bg-[#11100E]"
            >
              <img
                src="https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=900&auto=format&fit=crop"
                alt="Montres Homme Nicaise.a"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110 opacity-75 group-hover:opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#11100E] via-[#11100E]/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col justify-end">
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#C6A15B] font-semibold mb-1">
                  Collection Masculine
                </span>
                <h3 className="font-serif text-2xl text-white tracking-wider mb-1 group-hover:text-[#D8BE7A] transition-colors">
                  MONTRES HOMME
                </h3>
                <p className="text-xs text-[#EDE3D2]/80 line-clamp-1 mb-3">
                  Prestance, précision et calibres puissants.
                </p>
                <div className="inline-flex items-center text-xs text-white uppercase tracking-widest gap-2 font-medium group-hover:text-[#C6A15B]">
                  <span>Explorer</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </div>

            {/* Montres Femme */}
            <div
              id="cat-card-femme"
              onClick={() => onNavigate('catalog', { key: 'gender', value: 'Femme' })}
              className="group relative h-96 overflow-hidden cursor-pointer border border-[#EDE3D2] bg-[#11100E]"
            >
              <img
                src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=900&auto=format&fit=crop"
                alt="Montres Femme Nicaise.a"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110 opacity-75 group-hover:opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#11100E] via-[#11100E]/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col justify-end">
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#C6A15B] font-semibold mb-1">
                  Collection Féminine
                </span>
                <h3 className="font-serif text-2xl text-white tracking-wider mb-1 group-hover:text-[#D8BE7A] transition-colors">
                  MONTRES FEMME
                </h3>
                <p className="text-xs text-[#EDE3D2]/80 line-clamp-1 mb-3">
                  Élégance joaillière, nacre et or délicat.
                </p>
                <div className="inline-flex items-center text-xs text-white uppercase tracking-widest gap-2 font-medium group-hover:text-[#C6A15B]">
                  <span>Explorer</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </div>

            {/* Automatiques */}
            <div
              id="cat-card-automatiques"
              onClick={() => onNavigate('catalog', { key: 'category', value: 'Automatique' })}
              className="group relative h-96 overflow-hidden cursor-pointer border border-[#EDE3D2] bg-[#11100E]"
            >
              <img
                src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=900&auto=format&fit=crop"
                alt="Montres Automatiques Nicaise.a"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110 opacity-75 group-hover:opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#11100E] via-[#11100E]/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col justify-end">
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#C6A15B] font-semibold mb-1">
                  Mécanique Pure
                </span>
                <h3 className="font-serif text-2xl text-white tracking-wider mb-1 group-hover:text-[#D8BE7A] transition-colors">
                  AUTOMATIQUES
                </h3>
                <p className="text-xs text-[#EDE3D2]/80 line-clamp-1 mb-3">
                  Le battement d'un mouvement perpétuel.
                </p>
                <div className="inline-flex items-center text-xs text-white uppercase tracking-widest gap-2 font-medium group-hover:text-[#C6A15B]">
                  <span>Explorer</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </div>

            {/* Chronographes */}
            <div
              id="cat-card-chronographes"
              onClick={() => onNavigate('catalog', { key: 'category', value: 'Chronographe' })}
              className="group relative h-96 overflow-hidden cursor-pointer border border-[#EDE3D2] bg-[#11100E]"
            >
              <img
                src="https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=900&auto=format&fit=crop"
                alt="Chronographes Nicaise.a"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110 opacity-75 group-hover:opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#11100E] via-[#11100E]/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col justify-end">
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#C6A15B] font-semibold mb-1">
                  Haute Précision
                </span>
                <h3 className="font-serif text-2xl text-white tracking-wider mb-1 group-hover:text-[#D8BE7A] transition-colors">
                  CHRONOGRAPHES
                </h3>
                <p className="text-xs text-[#EDE3D2]/80 line-clamp-1 mb-3">
                  La mesure exacte de chaque exploit.
                </p>
                <div className="inline-flex items-center text-xs text-white uppercase tracking-widest gap-2 font-medium group-hover:text-[#C6A15B]">
                  <span>Explorer</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </div>

            {/* Montres Sport */}
            <div
              id="cat-card-sport"
              onClick={() => onNavigate('catalog', { key: 'category', value: 'Sport' })}
              className="group relative h-96 overflow-hidden cursor-pointer border border-[#EDE3D2] bg-[#11100E]"
            >
              <img
                src="https://images.unsplash.com/photo-1533139502658-0198f920d8e8?q=80&w=900&auto=format&fit=crop"
                alt="Montres Sport Nicaise.a"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110 opacity-75 group-hover:opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#11100E] via-[#11100E]/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col justify-end">
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#C6A15B] font-semibold mb-1">
                  Performance & Titane
                </span>
                <h3 className="font-serif text-2xl text-white tracking-wider mb-1 group-hover:text-[#D8BE7A] transition-colors">
                  MONTRES SPORT
                </h3>
                <p className="text-xs text-[#EDE3D2]/80 line-clamp-1 mb-3">
                  Légèreté, robustesse et ergonomie absolue.
                </p>
                <div className="inline-flex items-center text-xs text-white uppercase tracking-widest gap-2 font-medium group-hover:text-[#C6A15B]">
                  <span>Explorer</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </div>

            {/* Montres de Plongée */}
            <div
              id="cat-card-plongee"
              onClick={() => onNavigate('catalog', { key: 'category', value: 'Plongée' })}
              className="group relative h-96 overflow-hidden cursor-pointer border border-[#EDE3D2] bg-[#11100E]"
            >
              <img
                src="https://images.unsplash.com/photo-1547996160-71dfabbce5fa?q=80&w=900&auto=format&fit=crop"
                alt="Montres de Plongée Nicaise.a"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110 opacity-75 group-hover:opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#11100E] via-[#11100E]/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col justify-end">
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#C6A15B] font-semibold mb-1">
                  Submariner 300M
                </span>
                <h3 className="font-serif text-2xl text-white tracking-wider mb-1 group-hover:text-[#D8BE7A] transition-colors">
                  MONTRES DE PLONGÉE
                </h3>
                <p className="text-xs text-[#EDE3D2]/80 line-clamp-1 mb-3">
                  Étanche 300 mètres et Super-LumiNova.
                </p>
                <div className="inline-flex items-center text-xs text-white uppercase tracking-widest gap-2 font-medium group-hover:text-[#C6A15B]">
                  <span>Explorer</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </div>

            {/* Montres Joaillerie */}
            <div
              id="cat-card-joaillerie"
              onClick={() => onNavigate('catalog', { key: 'category', value: 'Joaillerie' })}
              className="group relative h-96 overflow-hidden cursor-pointer border border-[#EDE3D2] bg-[#11100E]"
            >
              <img
                src="https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=900&auto=format&fit=crop"
                alt="Montres Joaillerie Nicaise.a"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110 opacity-75 group-hover:opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#11100E] via-[#11100E]/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col justify-end">
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#C6A15B] font-semibold mb-1">
                  Diamants & Or 18k
                </span>
                <h3 className="font-serif text-2xl text-white tracking-wider mb-1 group-hover:text-[#D8BE7A] transition-colors">
                  MONTRES JOAILLERIE
                </h3>
                <p className="text-xs text-[#EDE3D2]/80 line-clamp-1 mb-3">
                  Serti neige, nacre naturelle et raffinement.
                </p>
                <div className="inline-flex items-center text-xs text-white uppercase tracking-widest gap-2 font-medium group-hover:text-[#C6A15B]">
                  <span>Explorer</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </div>

            {/* Éditions Limitées */}
            <div
              id="cat-card-limited"
              onClick={() => onNavigate('limited-editions')}
              className="group relative h-96 overflow-hidden cursor-pointer border border-[#C6A15B]/50 bg-[#11100E]"
            >
              <img
                src="https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?q=80&w=900&auto=format&fit=crop"
                alt="Éditions Limitées Nicaise.a"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110 opacity-75 group-hover:opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#11100E] via-[#11100E]/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col justify-end">
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#D8BE7A] font-semibold mb-1">
                  Private Collection
                </span>
                <h3 className="font-serif text-2xl text-white tracking-wider mb-1 group-hover:text-[#C6A15B] transition-colors">
                  ÉDITIONS LIMITÉES
                </h3>
                <p className="text-xs text-[#EDE3D2]/80 line-clamp-1 mb-3">
                  Numérotées, pièces uniques & tourbillons.
                </p>
                <div className="inline-flex items-center text-xs text-[#C6A15B] uppercase tracking-widest gap-2 font-medium">
                  <span>Découvrir l'exclusivité</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ICONIC SHOWCASE - PIÈCE MAÎTRESSE : NICAISE.A AUTOMATIC PRESTIGE */}
      <section id="flagship-showcase" className="py-24 bg-[#11100E] text-[#EDE3D2] relative overflow-hidden border-y border-[#332A20]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Watch Image Stage */}
            <div className="lg:col-span-6 relative flex items-center justify-center">
              <div className="relative w-full max-w-md aspect-square bg-[#1C1A16] border border-[#332A20] p-8 flex items-center justify-center">
                {/* Glow accent */}
                <div className="absolute w-72 h-72 rounded-full bg-[#C6A15B]/10 blur-3xl pointer-events-none" />
                <img
                  src={flagshipWatch.images.front}
                  alt={flagshipWatch.name}
                  referrerPolicy="no-referrer"
                  className="relative z-10 w-full h-full object-contain filter drop-shadow-2xl transition-transform duration-700 hover:scale-105"
                />
                <span className="absolute top-4 left-4 text-[10px] uppercase tracking-[0.2em] px-2.5 py-1 bg-[#C6A15B] text-[#11100E] font-semibold">
                  Pièce Signature
                </span>
              </div>
            </div>

            {/* Right Details */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <span className="text-xs uppercase tracking-[0.3em] text-[#C6A15B] font-semibold block mb-2">
                  Garde-Temps Emblématique
                </span>
                <h2 className="font-serif text-3xl sm:text-5xl text-white tracking-wide mb-3">
                  {flagshipWatch.name}
                </h2>
                <p className="font-serif italic text-xl text-[#D8BE7A] mb-4">
                  {flagshipWatch.tagline}
                </p>
                <p className="text-sm text-[#8A8780] leading-relaxed font-light">
                  {flagshipWatch.history}
                </p>
              </div>

              {/* Horological Key Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-4 border-y border-[#332A20] text-xs">
                <div>
                  <span className="text-[#8A8780] block text-[10px] uppercase">Mouvement</span>
                  <span className="text-white font-medium">{flagshipWatch.specs.movement}</span>
                </div>
                <div>
                  <span className="text-[#8A8780] block text-[10px] uppercase">Boîtier</span>
                  <span className="text-white font-medium">{flagshipWatch.caseMaterial}</span>
                </div>
                <div>
                  <span className="text-[#8A8780] block text-[10px] uppercase">Diamètre</span>
                  <span className="text-white font-medium">{flagshipWatch.diameter}</span>
                </div>
                <div>
                  <span className="text-[#8A8780] block text-[10px] uppercase">Cadran</span>
                  <span className="text-white font-medium">{flagshipWatch.dialColor}</span>
                </div>
                <div>
                  <span className="text-[#8A8780] block text-[10px] uppercase">Étanchéité</span>
                  <span className="text-white font-medium">{flagshipWatch.specs.waterResistance}</span>
                </div>
                <div>
                  <span className="text-[#8A8780] block text-[10px] uppercase">Garantie</span>
                  <span className="text-[#C6A15B] font-medium">{flagshipWatch.specs.warranty}</span>
                </div>
              </div>

              {/* Price & Actions */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-2">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#8A8780] block">
                    Valeur Horlogère
                  </span>
                  <span className="text-3xl font-serif text-[#C6A15B] font-medium tracking-tight">
                    {formatFCFA(flagshipWatch.price)}
                  </span>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    id="flagship-btn-detail"
                    onClick={() => onSelectProduct(flagshipWatch)}
                    className="flex-1 sm:flex-initial px-6 py-3.5 bg-transparent border border-[#FAF8F3]/60 hover:border-white text-white text-xs uppercase tracking-widest font-medium transition-colors"
                  >
                    Voir la montre
                  </button>
                  <button
                    id="flagship-btn-cart"
                    onClick={() => onAddToCart(flagshipWatch)}
                    className="flex-1 sm:flex-initial px-6 py-3.5 bg-[#C6A15B] hover:bg-[#D8BE7A] text-[#11100E] text-xs uppercase tracking-widest font-semibold transition-colors"
                  >
                    Ajouter au panier
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED SELECTION - NOTRE CATALOGUE D'EXCEPTION */}
      <section id="featured-watches-section" className="py-24 bg-[#FAF8F3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-[#C6A15B] font-semibold block mb-2">
                Sélection Exclusive
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#11100E] tracking-wide">
                GARDE-TEMPS DE PRESTIGE
              </h2>
            </div>
            <button
              onClick={() => onNavigate('catalog')}
              className="mt-4 md:mt-0 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#11100E] hover:text-[#C6A15B] font-semibold transition-colors group"
            >
              <span>Voir tout le catalogue (26 montres)</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredWatches.map((product) => (
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

          <div className="mt-14 text-center">
            <button
              id="btn-discover-all-catalog"
              onClick={() => onNavigate('catalog')}
              className="px-10 py-4 bg-[#11100E] hover:bg-[#C6A15B] text-white text-xs uppercase tracking-[0.2em] font-semibold transition-colors shadow-md"
            >
              Découvrir la collection complète
            </button>
          </div>
        </div>
      </section>

      {/* SAVOIR-FAIRE & ATELIER - L'ART DU TEMPS */}
      <section id="savoir-faire-section" className="py-24 bg-[#EDE3D2]/30 border-t border-[#EDE3D2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Editorial Content */}
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs uppercase tracking-[0.3em] text-[#C6A15B] font-semibold block">
                Haute Horlogerie & Savoir-Faire
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl text-[#11100E] tracking-wide leading-tight">
                L'Artisanat de Précision au Service de l'Éternité
              </h2>
              <div className="w-16 h-[1.5px] bg-[#C6A15B]" />
              <p className="text-sm text-[#332A20] font-light leading-relaxed">
                Chez <strong>NICAISE.A</strong>, chaque montre est bien plus qu'un instrument de mesure : c'est un poème mécanique sculpté par la main de maîtres horlogers chevronnés.
              </p>
              <p className="text-sm text-[#8A8780] font-light leading-relaxed">
                Des heures de polissage manuel sur les biseaux, des anglages d'une netteté chirurgicale et des tests chronométriques rigoureux garantissent une régularité de marche absolue.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-xs text-[#11100E]">
                  <CheckCircle className="w-4 h-4 text-[#C6A15B]" />
                  <span>Métaux nobles rigoureusement sélectionnés (Or 18k, Platine 950, Titane Grade 5)</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-[#11100E]">
                  <CheckCircle className="w-4 h-4 text-[#C6A15B]" />
                  <span>Calibres mécaniques et automatiques décorés de Côtes de Genève</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-[#11100E]">
                  <CheckCircle className="w-4 h-4 text-[#C6A15B]" />
                  <span>Contrôle qualité 1000 heures en conditions réelles</span>
                </div>
              </div>

              <div className="pt-4">
                <button
                  id="btn-about-maison"
                  onClick={() => onNavigate('about')}
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#11100E] hover:bg-[#C6A15B] text-white text-xs uppercase tracking-widest font-medium transition-colors"
                >
                  <span>Découvrir la Maison Nicaise.a</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Atelier Image */}
            <div className="lg:col-span-6">
              <div className="relative p-3 bg-white border border-[#EDE3D2] shadow-xl">
                <img
                  src={ATELIER_IMAGE}
                  alt="Établi de maître horloger Nicaise.a"
                  className="w-full h-[460px] object-cover"
                />
                <div className="p-4 bg-[#FAF8F3] border-t border-[#EDE3D2] flex justify-between items-center text-xs">
                  <div>
                    <span className="font-serif italic text-[#11100E] block text-sm">
                      L'Atelier des Complications
                    </span>
                    <span className="text-[#8A8780] text-[10px] uppercase tracking-wider">
                      Genève & Salons Privés
                    </span>
                  </div>
                  <span className="text-[#C6A15B] font-serif text-sm">Depuis 1952</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRIVATE CONCIERGE BANNER */}
      <section id="concierge-banner" className="py-20 bg-[#11100E] text-white border-b border-[#332A20]">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <span className="text-xs uppercase tracking-[0.3em] text-[#C6A15B] font-semibold block">
            Service Privilège
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#FAF8F3] tracking-wide">
            Une Présentation Privée à Votre Convenance
          </h2>
          <p className="text-sm text-[#EDE3D2]/80 max-w-xl mx-auto font-light leading-relaxed">
            Vous souhaitez contempler un garde-temps dans l'intimité de nos salons privés ou recevoir la visite d'un conseiller horloger à votre résidence ?
          </p>
          <div className="pt-2 flex flex-col sm:flex-row justify-center gap-4">
            <button
              id="btn-private-appointment"
              onClick={() => onNavigate('contact')}
              className="px-8 py-3.5 bg-[#C6A15B] hover:bg-[#D8BE7A] text-[#11100E] text-xs uppercase tracking-widest font-semibold transition-colors"
            >
              Prendre rendez-vous
            </button>
            <button
              onClick={() => onNavigate('catalog')}
              className="px-8 py-3.5 border border-[#EDE3D2]/40 hover:border-white text-white text-xs uppercase tracking-widest font-medium transition-colors"
            >
              Consulter le catalogue
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
