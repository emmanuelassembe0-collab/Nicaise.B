import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, X, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { Product, Gender, WatchCategory, CaseMaterial, StrapType, CollectionName, formatFCFA } from '../../types';
import { ProductCard } from '../ProductCard';

interface CatalogPageProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: (productId: string) => boolean;
  initialFilter?: { key: string; value: string };
}

type SortOption = 'pertinence' | 'nouveautes' | 'prix-asc' | 'prix-desc' | 'meilleures-ventes';

interface PriceRange {
  label: string;
  min: number;
  max: number;
}

const PRICE_RANGES: PriceRange[] = [
  { label: '0 – 500 000 FCFA', min: 0, max: 500000 },
  { label: '500 000 – 1 000 000 FCFA', min: 500000, max: 1000000 },
  { label: '1 000 000 – 5 000 000 FCFA', min: 1000000, max: 5000000 },
  { label: '5 000 000 FCFA+', min: 5000000, max: Infinity },
];

export const CatalogPage: React.FC<CatalogPageProps> = ({
  products,
  onSelectProduct,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  initialFilter,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGender, setSelectedGender] = useState<Gender | ''>('');
  const [selectedCategory, setSelectedCategory] = useState<WatchCategory | ''>('');
  const [selectedMaterial, setSelectedMaterial] = useState<CaseMaterial | ''>('');
  const [selectedStrap, setSelectedStrap] = useState<StrapType | ''>('');
  const [selectedPriceRangeIndex, setSelectedPriceRangeIndex] = useState<number | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<CollectionName | ''>('');
  const [sortOption, setSortOption] = useState<SortOption>('pertinence');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Apply initialFilter if passed from navigation
  useEffect(() => {
    if (initialFilter) {
      if (initialFilter.key === 'gender') {
        setSelectedGender(initialFilter.value as Gender);
      } else if (initialFilter.key === 'category') {
        setSelectedCategory(initialFilter.value as WatchCategory);
      } else if (initialFilter.key === 'collection') {
        setSelectedCollection(initialFilter.value as CollectionName);
      } else if (initialFilter.key === 'search') {
        setSearchQuery(initialFilter.value);
      }
    }
  }, [initialFilter]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedGender('');
    setSelectedCategory('');
    setSelectedMaterial('');
    setSelectedStrap('');
    setSelectedPriceRangeIndex(null);
    setSelectedCollection('');
    setSortOption('pertinence');
  };

  const hasActiveFilters =
    Boolean(searchQuery) ||
    Boolean(selectedGender) ||
    Boolean(selectedCategory) ||
    Boolean(selectedMaterial) ||
    Boolean(selectedStrap) ||
    selectedPriceRangeIndex !== null ||
    Boolean(selectedCollection);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.collection.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.dialColor.toLowerCase().includes(q) ||
          p.caseMaterial.toLowerCase().includes(q) ||
          p.tagline.toLowerCase().includes(q)
      );
    }

    // Gender
    if (selectedGender) {
      list = list.filter((p) => p.gender === selectedGender || p.gender === 'Unisexe');
    }

    // Category / Type
    if (selectedCategory) {
      list = list.filter((p) => p.category === selectedCategory);
    }

    // Material
    if (selectedMaterial) {
      list = list.filter((p) => p.materialCategory === selectedMaterial);
    }

    // Strap
    if (selectedStrap) {
      list = list.filter((p) => p.strapCategory === selectedStrap);
    }

    // Price range
    if (selectedPriceRangeIndex !== null) {
      const range = PRICE_RANGES[selectedPriceRangeIndex];
      list = list.filter((p) => p.price >= range.min && p.price < range.max);
    }

    // Collection
    if (selectedCollection) {
      list = list.filter((p) => p.collection === selectedCollection);
    }

    // Sorting
    switch (sortOption) {
      case 'prix-asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'prix-desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'nouveautes':
        list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case 'meilleures-ventes':
        list.sort((a, b) => (b.badge === 'BEST-SELLER' ? 1 : 0) - (a.badge === 'BEST-SELLER' ? 1 : 0));
        break;
      case 'pertinence':
      default:
        // natural curated order
        break;
    }

    return list;
  }, [
    products,
    searchQuery,
    selectedGender,
    selectedCategory,
    selectedMaterial,
    selectedStrap,
    selectedPriceRangeIndex,
    selectedCollection,
    sortOption,
  ]);

  const genders: Gender[] = ['Homme', 'Femme', 'Unisexe'];
  const categories: WatchCategory[] = [
    'Classique',
    'Automatique',
    'Mécanique',
    'Quartz',
    'Chronographe',
    'Sport',
    'Plongée',
    'Joaillerie',
  ];
  const materials: CaseMaterial[] = ['Acier', 'Or', 'Titane', 'Céramique', 'Carbone'];
  const straps: StrapType[] = ['Cuir', 'Acier', 'Caoutchouc', 'Métal précieux'];
  const collections: CollectionName[] = [
    'Heritage',
    'Prestige',
    'Sport',
    'Ocean',
    'Royal',
    'Private Collection',
  ];

  const FilterSidebarContent = (
    <div className="space-y-8 text-xs text-[#11100E]">
      {/* Search inside filter */}
      <div>
        <label className="block text-[10px] uppercase tracking-[0.2em] text-[#8A8780] font-semibold mb-2">
          Recherche directe
        </label>
        <div className="relative">
          <input
            id="catalog-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Nom, matériau, cadran..."
            className="w-full bg-white border border-[#EDE3D2] px-3 py-2.5 text-xs text-[#11100E] placeholder:text-[#8A8780] focus:outline-none focus:border-[#C6A15B]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8A8780] hover:text-[#11100E]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Genre */}
      <div>
        <h4 className="text-[10px] uppercase tracking-[0.2em] text-[#C6A15B] font-semibold mb-3 border-b border-[#EDE3D2] pb-1">
          Genre
        </h4>
        <div className="space-y-2">
          {genders.map((gender) => (
            <label
              key={gender}
              className="flex items-center gap-2.5 cursor-pointer text-[#11100E] hover:text-[#C6A15B]"
            >
              <input
                type="radio"
                name="gender"
                checked={selectedGender === gender}
                onChange={() => setSelectedGender(selectedGender === gender ? '' : gender)}
                onClick={() => {
                  if (selectedGender === gender) setSelectedGender('');
                }}
                className="accent-[#C6A15B]"
              />
              <span>{gender}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Type / Catégorie */}
      <div>
        <h4 className="text-[10px] uppercase tracking-[0.2em] text-[#C6A15B] font-semibold mb-3 border-b border-[#EDE3D2] pb-1">
          Type & Mouvement
        </h4>
        <div className="space-y-2">
          {categories.map((cat) => (
            <label
              key={cat}
              className="flex items-center gap-2.5 cursor-pointer text-[#11100E] hover:text-[#C6A15B]"
            >
              <input
                type="radio"
                name="category"
                checked={selectedCategory === cat}
                onChange={() => setSelectedCategory(selectedCategory === cat ? '' : cat)}
                onClick={() => {
                  if (selectedCategory === cat) setSelectedCategory('');
                }}
                className="accent-[#C6A15B]"
              />
              <span>{cat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Matériau du boîtier */}
      <div>
        <h4 className="text-[10px] uppercase tracking-[0.2em] text-[#C6A15B] font-semibold mb-3 border-b border-[#EDE3D2] pb-1">
          Matériau
        </h4>
        <div className="space-y-2">
          {materials.map((mat) => (
            <label
              key={mat}
              className="flex items-center gap-2.5 cursor-pointer text-[#11100E] hover:text-[#C6A15B]"
            >
              <input
                type="radio"
                name="material"
                checked={selectedMaterial === mat}
                onChange={() => setSelectedMaterial(selectedMaterial === mat ? '' : mat)}
                onClick={() => {
                  if (selectedMaterial === mat) setSelectedMaterial('');
                }}
                className="accent-[#C6A15B]"
              />
              <span>{mat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Bracelet */}
      <div>
        <h4 className="text-[10px] uppercase tracking-[0.2em] text-[#C6A15B] font-semibold mb-3 border-b border-[#EDE3D2] pb-1">
          Bracelet
        </h4>
        <div className="space-y-2">
          {straps.map((strap) => (
            <label
              key={strap}
              className="flex items-center gap-2.5 cursor-pointer text-[#11100E] hover:text-[#C6A15B]"
            >
              <input
                type="radio"
                name="strap"
                checked={selectedStrap === strap}
                onChange={() => setSelectedStrap(selectedStrap === strap ? '' : strap)}
                onClick={() => {
                  if (selectedStrap === strap) setSelectedStrap('');
                }}
                className="accent-[#C6A15B]"
              />
              <span>{strap}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Prix */}
      <div>
        <h4 className="text-[10px] uppercase tracking-[0.2em] text-[#C6A15B] font-semibold mb-3 border-b border-[#EDE3D2] pb-1">
          Gamme de Prix
        </h4>
        <div className="space-y-2">
          {PRICE_RANGES.map((range, idx) => (
            <label
              key={range.label}
              className="flex items-center gap-2.5 cursor-pointer text-[#11100E] hover:text-[#C6A15B]"
            >
              <input
                type="radio"
                name="priceRange"
                checked={selectedPriceRangeIndex === idx}
                onChange={() => setSelectedPriceRangeIndex(selectedPriceRangeIndex === idx ? null : idx)}
                onClick={() => {
                  if (selectedPriceRangeIndex === idx) setSelectedPriceRangeIndex(null);
                }}
                className="accent-[#C6A15B]"
              />
              <span className="text-[11px]">{range.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Collection */}
      <div>
        <h4 className="text-[10px] uppercase tracking-[0.2em] text-[#C6A15B] font-semibold mb-3 border-b border-[#EDE3D2] pb-1">
          Collection
        </h4>
        <div className="space-y-2">
          {collections.map((col) => (
            <label
              key={col}
              className="flex items-center gap-2.5 cursor-pointer text-[#11100E] hover:text-[#C6A15B]"
            >
              <input
                type="radio"
                name="collection"
                checked={selectedCollection === col}
                onChange={() => setSelectedCollection(selectedCollection === col ? '' : col)}
                onClick={() => {
                  if (selectedCollection === col) setSelectedCollection('');
                }}
                className="accent-[#C6A15B]"
              />
              <span>{col}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Reset button */}
      {hasActiveFilters && (
        <button
          id="btn-reset-filters"
          type="button"
          onClick={handleResetFilters}
          className="w-full py-2.5 px-4 bg-[#EDE3D2] hover:bg-[#C6A15B] text-[#11100E] hover:text-white uppercase tracking-wider font-semibold text-[10px] flex items-center justify-center gap-2 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Réinitialiser les filtres</span>
        </button>
      )}
    </div>
  );

  return (
    <div className="bg-[#FAF8F3] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Title & Subtitle */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-[0.3em] text-[#C6A15B] font-semibold block mb-2">
            Haute Horlogerie
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#11100E] tracking-wide mb-4">
            LA COLLECTION NICAISE.A
          </h1>
          <div className="w-16 h-[1.5px] bg-[#C6A15B] mx-auto mb-4" />
          <p className="font-serif italic text-base sm:text-lg text-[#332A20] leading-relaxed">
            « Explorez notre sélection de garde-temps conçus pour accompagner chaque instant d'exception. »
          </p>
        </div>

        {/* Toolbar: Search, Mobile Filter Toggle, Sort */}
        <div className="bg-white p-4 border border-[#EDE3D2] mb-8 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un modèle..."
              className="w-full pl-9 pr-4 py-2 bg-[#FAF8F3] border border-[#EDE3D2] text-xs text-[#11100E] placeholder:text-[#8A8780] focus:outline-none focus:border-[#C6A15B]"
            />
            <Search className="w-4 h-4 text-[#8A8780] absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          <div className="flex items-center justify-between w-full md:w-auto gap-4">
            {/* Mobile Filter Button */}
            <button
              id="btn-mobile-filter-open"
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-[#FAF8F3] border border-[#EDE3D2] text-xs text-[#11100E] font-medium"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#C6A15B]" />
              <span>Filtres ({hasActiveFilters ? 'Actifs' : 'Tous'})</span>
            </button>

            {/* Results Count */}
            <span className="text-xs text-[#8A8780]">
              <strong className="text-[#11100E] font-medium">{filteredProducts.length}</strong>{' '}
              garde-temps
            </span>

            {/* 10. TRI */}
            <div className="flex items-center gap-2">
              <label htmlFor="catalog-sort" className="hidden sm:inline text-xs text-[#8A8780] uppercase tracking-wider">
                Trier par :
              </label>
              <select
                id="catalog-sort"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOption)}
                className="bg-[#FAF8F3] border border-[#EDE3D2] px-3 py-2 text-xs text-[#11100E] focus:outline-none focus:border-[#C6A15B] cursor-pointer"
              >
                <option value="pertinence">Pertinence</option>
                <option value="nouveautes">Nouveautés</option>
                <option value="prix-asc">Prix croissant</option>
                <option value="prix-desc">Prix décroissant</option>
                <option value="meilleures-ventes">Meilleures ventes</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-6 text-xs">
            <span className="text-[#8A8780] text-[11px] uppercase tracking-wider">Filtres actifs :</span>
            {searchQuery && (
              <span className="px-2.5 py-1 bg-white border border-[#C6A15B] text-[#11100E] flex items-center gap-1.5">
                Recherche: « {searchQuery} »
                <X className="w-3 h-3 cursor-pointer text-[#8A8780] hover:text-[#11100E]" onClick={() => setSearchQuery('')} />
              </span>
            )}
            {selectedGender && (
              <span className="px-2.5 py-1 bg-white border border-[#C6A15B] text-[#11100E] flex items-center gap-1.5">
                Genre: {selectedGender}
                <X className="w-3 h-3 cursor-pointer text-[#8A8780] hover:text-[#11100E]" onClick={() => setSelectedGender('')} />
              </span>
            )}
            {selectedCategory && (
              <span className="px-2.5 py-1 bg-white border border-[#C6A15B] text-[#11100E] flex items-center gap-1.5">
                Type: {selectedCategory}
                <X className="w-3 h-3 cursor-pointer text-[#8A8780] hover:text-[#11100E]" onClick={() => setSelectedCategory('')} />
              </span>
            )}
            {selectedMaterial && (
              <span className="px-2.5 py-1 bg-white border border-[#C6A15B] text-[#11100E] flex items-center gap-1.5">
                Matériau: {selectedMaterial}
                <X className="w-3 h-3 cursor-pointer text-[#8A8780] hover:text-[#11100E]" onClick={() => setSelectedMaterial('')} />
              </span>
            )}
            {selectedStrap && (
              <span className="px-2.5 py-1 bg-white border border-[#C6A15B] text-[#11100E] flex items-center gap-1.5">
                Bracelet: {selectedStrap}
                <X className="w-3 h-3 cursor-pointer text-[#8A8780] hover:text-[#11100E]" onClick={() => setSelectedStrap('')} />
              </span>
            )}
            {selectedPriceRangeIndex !== null && (
              <span className="px-2.5 py-1 bg-white border border-[#C6A15B] text-[#11100E] flex items-center gap-1.5">
                Prix: {PRICE_RANGES[selectedPriceRangeIndex].label}
                <X className="w-3 h-3 cursor-pointer text-[#8A8780] hover:text-[#11100E]" onClick={() => setSelectedPriceRangeIndex(null)} />
              </span>
            )}
            {selectedCollection && (
              <span className="px-2.5 py-1 bg-white border border-[#C6A15B] text-[#11100E] flex items-center gap-1.5">
                Collection: {selectedCollection}
                <X className="w-3 h-3 cursor-pointer text-[#8A8780] hover:text-[#11100E]" onClick={() => setSelectedCollection('')} />
              </span>
            )}
            <button
              onClick={handleResetFilters}
              className="text-[#8A8780] hover:text-[#c62828] underline text-[11px] ml-2"
            >
              Tout effacer
            </button>
          </div>
        )}

        {/* Main Catalog Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-1 bg-white p-6 border border-[#EDE3D2] sticky top-28 shadow-sm">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#EDE3D2]">
              <h3 className="font-serif text-lg text-[#11100E] tracking-wider flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#C6A15B]" />
                <span>FILTRES DE RECHERCHE</span>
              </h3>
            </div>
            {FilterSidebarContent}
          </aside>

          {/* Products Grid */}
          <main className="lg:col-span-3">
            {filteredProducts.length === 0 ? (
              <div className="bg-white p-12 text-center border border-[#EDE3D2]">
                <h4 className="font-serif text-2xl text-[#11100E] mb-3">
                  Aucun garde-temps ne correspond à ces critères
                </h4>
                <p className="text-sm text-[#8A8780] max-w-md mx-auto mb-6">
                  Modifiez vos critères de sélection ou réinitialisez les filtres pour découvrir l'intégralité de nos pièces de collection.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-6 py-3 bg-[#11100E] hover:bg-[#C6A15B] text-white text-xs uppercase tracking-widest font-semibold transition-colors"
                >
                  Réinitialiser tous les filtres
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
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
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Slide-over Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-[#11100E]/70 backdrop-blur-sm lg:hidden flex justify-end">
          <div className="w-full max-w-sm bg-[#FAF8F3] h-full shadow-2xl flex flex-col p-6 overflow-y-auto animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between pb-4 border-b border-[#EDE3D2] mb-6">
              <h3 className="font-serif text-xl text-[#11100E]">Filtres de recherche</h3>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 text-[#8A8780] hover:text-[#11100E]"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            {FilterSidebarContent}
            <div className="pt-8 mt-auto">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-3 bg-[#11100E] text-white text-xs uppercase tracking-widest font-semibold"
              >
                Afficher les {filteredProducts.length} résultats
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
