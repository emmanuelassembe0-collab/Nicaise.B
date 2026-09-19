import React, { useState, useMemo } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { Product, formatFCFA } from '../types';
import { PRODUCTS } from '../data/products';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
  onNavigateToCatalogWithSearch: (term: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
  onNavigateToCatalogWithSearch,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const quickKeywords = [
    'Automatique',
    'Prestige',
    'Or rose',
    'Plongée',
    'Chronographe',
    'Skeleton',
    'Titane',
    'Diamant',
    'Heritage',
  ];

  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const term = searchTerm.toLowerCase();
    return PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.collection.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term) ||
        p.dialColor.toLowerCase().includes(term) ||
        p.caseMaterial.toLowerCase().includes(term) ||
        p.materialCategory.toLowerCase().includes(term)
    ).slice(0, 6);
  }, [searchTerm]);

  if (!isOpen) return null;

  return (
    <div
      id="search-modal-backdrop"
      className="fixed inset-0 z-50 bg-[#11100E]/80 backdrop-blur-md flex flex-col items-center pt-16 sm:pt-24 px-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="search-modal-box"
        className="w-full max-w-2xl bg-[#FAF8F3] border border-[#C6A15B]/50 shadow-2xl p-6 sm:p-8 relative animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          id="btn-close-search"
          onClick={onClose}
          className="absolute top-6 right-6 text-[#8A8780] hover:text-[#11100E] p-1"
          aria-label="Fermer la recherche"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Title */}
        <span className="text-[10px] uppercase tracking-[0.25em] text-[#C6A15B] font-semibold block mb-1">
          Recherche Haute Horlogerie
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl text-[#11100E] mb-6">
          Trouvez votre garde-temps d’exception
        </h2>

        {/* Input Field */}
        <div className="relative mb-6">
          <input
            id="search-input-field"
            type="text"
            autoFocus
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Ex : Automatic Prestige, Chrono, Or, Titane..."
            className="w-full bg-white border border-[#EDE3D2] focus:border-[#C6A15B] px-12 py-4 text-base text-[#11100E] placeholder:text-[#8A8780] focus:outline-none transition-colors"
          />
          <Search className="w-5 h-5 text-[#8A8780] absolute left-4 top-1/2 -translate-y-1/2" />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#8A8780] hover:text-[#11100E]"
            >
              Effacer
            </button>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="mb-6">
          <span className="text-[11px] uppercase tracking-wider text-[#8A8780] block mb-2">
            Recherches populaires :
          </span>
          <div className="flex flex-wrap gap-2">
            {quickKeywords.map((kw) => (
              <button
                key={kw}
                onClick={() => setSearchTerm(kw)}
                className="text-xs px-3 py-1 bg-white hover:bg-[#EDE3D2] border border-[#EDE3D2] text-[#11100E] transition-colors"
              >
                {kw}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {searchTerm.trim() && (
          <div className="border-t border-[#EDE3D2] pt-4">
            <div className="flex items-center justify-between mb-3 text-xs text-[#8A8780]">
              <span>{filteredProducts.length} résultat(s) trouvé(s)</span>
              {filteredProducts.length > 0 && (
                <button
                  onClick={() => {
                    onClose();
                    onNavigateToCatalogWithSearch(searchTerm);
                  }}
                  className="text-[#C6A15B] hover:underline flex items-center gap-1 font-medium"
                >
                  Voir tous les résultats <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>

            {filteredProducts.length === 0 ? (
              <p className="text-sm text-[#8A8780] py-6 text-center italic">
                Aucun modèle ne correspond à « {searchTerm} ». Essayez un autre mot-clé comme « Prestige », « Plongée », « Or » ou « Automatique ».
              </p>
            ) : (
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {filteredProducts.map((prod) => (
                  <div
                    key={prod.id}
                    onClick={() => {
                      onClose();
                      onSelectProduct(prod);
                    }}
                    className="flex items-center gap-4 p-3 bg-white hover:bg-[#F5F2EB] border border-[#EDE3D2]/70 cursor-pointer transition-colors"
                  >
                    <img
                      src={prod.images.front}
                      alt={prod.name}
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 object-contain bg-[#FAF8F3] p-1 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase tracking-wider text-[#C6A15B]">
                          {prod.collection}
                        </span>
                        <span className="text-[10px] text-[#8A8780]">• {prod.diameter}</span>
                      </div>
                      <h4 className="font-serif text-base text-[#11100E] truncate font-medium">
                        {prod.name}
                      </h4>
                      <span className="text-xs text-[#8A8780]">{prod.materialCategory}</span>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="text-sm font-semibold text-[#11100E] block">
                        {formatFCFA(prod.price)}
                      </span>
                      <span className="text-[10px] uppercase text-[#2e7d32]">
                        {prod.availability}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
