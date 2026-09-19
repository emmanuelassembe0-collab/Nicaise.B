import React, { useState, useEffect } from 'react';
import {
  Heart,
  ShoppingBag,
  ShieldCheck,
  Package,
  Award,
  Clock,
  ArrowLeft,
  Check,
  Sparkles,
  Share2,
  ZoomIn,
  MessageSquare,
  Star,
  Send,
} from 'lucide-react';
import { Product, formatFCFA, Review } from '../../types';
import { ProductCard } from '../ProductCard';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

interface ProductDetailPageProps {
  product: Product;
  allProducts: Product[];
  onBack: () => void;
  onAddToCart: (product: Product, quantity?: number) => void;
  onBuyNow: (product: Product, quantity?: number) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: boolean;
  onSelectProduct: (product: Product) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  allProducts,
  onBack,
  onAddToCart,
  onBuyNow,
  onToggleWishlist,
  isWishlisted,
  onSelectProduct,
}) => {
  const { user } = useAuth();
  const [selectedImageKey, setSelectedImageKey] = useState<
    'front' | 'back' | 'dial' | 'strap' | 'wrist'
  >('front');
  const [quantity, setQuantity] = useState(1);
  const [addedNotification, setAddedNotification] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  // Reviews State
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewerName, setReviewerName] = useState(user ? `${user.firstName} ${user.lastName}` : '');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState<string | null>(null);

  useEffect(() => {
    api.reviews.getByProduct(product.id)
      .then((data) => setReviews(data))
      .catch((e) => console.warn('Avis non chargés:', e));
  }, [product.id]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    setSubmittingReview(true);
    try {
      const res = await api.reviews.submit({
        productId: product.id,
        rating: reviewRating,
        comment: reviewComment.trim(),
        userName: reviewerName.trim() || (user ? `${user.firstName} ${user.lastName}` : 'Connaisseur Anonyme'),
        userEmail: user?.email,
      });
      setReviewSuccess('Votre témoignage a été transmis et validé avec succès par notre atelier.');
      setReviewComment('');
      // Reload reviews
      const updated = await api.reviews.getByProduct(product.id);
      setReviews(updated);
    } catch (err: any) {
      console.error(err);
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleWhatsAppInquiry = () => {
    const text = `Bonjour, je souhaite échanger avec un conseiller au sujet de la montre ${product.name} (Réf: ${product.reference || product.id}, Prix: ${formatFCFA(product.price)}). Est-elle disponible pour une présentation privée ?`;
    window.open(`https://wa.me/237690000000?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  };

  const imageViews = [
    { key: 'front' as const, label: 'Vue Frontale', src: product.images.front },
    { key: 'back' as const, label: 'Vue Arrière & Calibre', src: product.images.back },
    { key: 'dial' as const, label: 'Détail du Cadran', src: product.images.dial },
    { key: 'strap' as const, label: 'Bracelet & Boucle', src: product.images.strap },
    { key: 'wrist' as const, label: 'Porté au Poignet', src: product.images.wrist },
  ];

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    setAddedNotification(true);
    setTimeout(() => setAddedNotification(false), 3000);
  };

  const handleBuyNow = () => {
    onBuyNow(product, quantity);
  };

  // Related watches from same collection or category
  const relatedWatches = allProducts
    .filter((p) => p.id !== product.id && (p.collection === product.collection || p.category === product.category))
    .slice(0, 4);

  return (
    <div className="bg-[#FAF8F3] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs & Back button */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#EDE3D2]">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#8A8780] hover:text-[#11100E] font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour aux collections</span>
          </button>

          <div className="text-xs text-[#8A8780] hidden sm:block">
            <span>NICAISE.A</span> / <span>{product.collection}</span> /{' '}
            <span className="text-[#11100E] font-medium">{product.name}</span>
          </div>
        </div>

        {/* 11 & 12. MAIN PRODUCT SECTION: 50% GALERIE / 50% INFORMATIONS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20 items-start">
          {/* 50% GALERIE (Col 1 to 6) */}
          <div className="lg:col-span-6 space-y-4 sticky top-28">
            {/* Main Stage Image */}
            <div
              className="relative w-full aspect-square bg-white border border-[#EDE3D2] p-8 flex items-center justify-center overflow-hidden group shadow-sm cursor-crosshair"
              onClick={() => setIsZoomed(!isZoomed)}
            >
              {/* Badges */}
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
                {product.badge && (
                  <span
                    className={`text-[10px] uppercase font-semibold tracking-widest px-3 py-1 ${
                      product.badge === 'ÉDITION LIMITÉE'
                        ? 'bg-[#11100E] text-[#D8BE7A] border border-[#C6A15B]/40'
                        : product.badge === 'NOUVEAU'
                        ? 'bg-[#C6A15B] text-white'
                        : 'bg-[#FAF8F3] text-[#11100E] border border-[#EDE3D2]'
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

              <img
                src={product.images[selectedImageKey]}
                alt={`${product.name} - ${selectedImageKey}`}
                referrerPolicy="no-referrer"
                className={`w-full h-full object-contain transition-transform duration-500 ease-out ${
                  isZoomed ? 'scale-150' : 'group-hover:scale-110'
                }`}
              />

              {/* View label tag */}
              <span className="absolute bottom-4 left-4 text-[10px] uppercase tracking-widest text-[#8A8780] bg-[#FAF8F3]/90 px-2 py-1 border border-[#EDE3D2]">
                {imageViews.find((v) => v.key === selectedImageKey)?.label}
              </span>

              {/* Zoom hint */}
              <div className="absolute bottom-4 right-4 p-2 bg-white/80 border border-[#EDE3D2] text-[#8A8780] hover:text-[#11100E]">
                <ZoomIn className="w-4 h-4" />
              </div>
            </div>

            {/* 5 Views Thumbnail Selectors */}
            <div className="grid grid-cols-5 gap-3">
              {imageViews.map((view) => {
                const isActive = selectedImageKey === view.key;
                return (
                  <button
                    key={view.key}
                    type="button"
                    onClick={() => setSelectedImageKey(view.key)}
                    className={`flex flex-col items-center p-2 bg-white border transition-all duration-300 ${
                      isActive
                        ? 'border-[#C6A15B] ring-1 ring-[#C6A15B] shadow-sm'
                        : 'border-[#EDE3D2] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <div className="w-full aspect-square flex items-center justify-center bg-[#FAF8F3] mb-1">
                      <img
                        src={view.src}
                        alt={view.label}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <span className="text-[8px] uppercase tracking-wider text-[#11100E] line-clamp-1 font-medium">
                      {view.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 50% INFORMATIONS DE LA MONTRE (Col 7 to 12) */}
          <div className="lg:col-span-6 space-y-6 bg-white p-8 border border-[#EDE3D2] shadow-sm">
            {/* Brand Header */}
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-[#C6A15B] font-semibold block mb-1">
                NICAISE.A • {product.collection}
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl text-[#11100E] tracking-wide mb-2">
                {product.name}
              </h1>
              <p className="font-serif italic text-base text-[#8A8780]">
                {product.tagline}
              </p>
            </div>

            {/* Price & Availability */}
            <div className="flex items-baseline justify-between py-4 border-y border-[#EDE3D2]">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#8A8780] block mb-0.5">
                  Prix public conseillé
                </span>
                <span className="text-3xl font-serif text-[#11100E] font-medium tracking-tight">
                  {formatFCFA(product.price)}
                </span>
              </div>
              <div className="text-right">
                <span
                  className={`text-xs uppercase tracking-widest font-semibold px-3 py-1 ${
                    product.availability === 'EN STOCK'
                      ? 'text-[#2e7d32] bg-[#e8f5e9]'
                      : 'text-[#C6A15B] bg-[#FAF8F3] border border-[#C6A15B]/40'
                  }`}
                >
                  {product.availability}
                </span>
                <span className="text-[10px] text-[#8A8780] block mt-1">
                  Expédié sous 24h avec convoyeur de valeur
                </span>
              </div>
            </div>

            {/* Fast specs preview */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-[#FAF8F3] p-4 border border-[#EDE3D2]">
              <div>
                <span className="text-[#8A8780] block text-[10px] uppercase">Mouvement</span>
                <span className="text-[#11100E] font-medium">{product.specs.movement}</span>
              </div>
              <div>
                <span className="text-[#8A8780] block text-[10px] uppercase">Diamètre</span>
                <span className="text-[#11100E] font-medium">{product.diameter}</span>
              </div>
              <div>
                <span className="text-[#8A8780] block text-[10px] uppercase">Boîtier</span>
                <span className="text-[#11100E] font-medium">{product.caseMaterial}</span>
              </div>
              <div>
                <span className="text-[#8A8780] block text-[10px] uppercase">Étanchéité</span>
                <span className="text-[#11100E] font-medium">{product.specs.waterResistance}</span>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 pt-2">
              <span className="text-xs uppercase tracking-wider text-[#8A8780] font-medium">
                Quantité :
              </span>
              <div className="flex items-center border border-[#EDE3D2] bg-[#FAF8F3]">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 text-[#8A8780] hover:text-[#11100E]"
                >
                  -
                </button>
                <span className="px-4 py-1.5 text-xs font-semibold text-[#11100E]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1.5 text-[#8A8780] hover:text-[#11100E]"
                >
                  +
                </button>
              </div>
            </div>

            {/* Notification message */}
            {addedNotification && (
              <div className="p-3 bg-[#e8f5e9] border border-[#2e7d32]/30 text-[#2e7d32] text-xs flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>Garde-temps ajouté avec succès à votre coffret !</span>
              </div>
            )}

            {/* ACTION BUTTONS (Ajouter au panier, Acheter maintenant, Favoris) */}
            <div className="space-y-3 pt-2">
              <button
                id="btn-product-add-cart"
                type="button"
                onClick={handleAddToCart}
                className="w-full py-4 bg-[#11100E] hover:bg-[#C6A15B] text-white text-xs uppercase tracking-[0.2em] font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-sm"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>AJOUTER AU PANIER</span>
              </button>

              <button
                id="btn-product-buy-now"
                type="button"
                onClick={handleBuyNow}
                className="w-full py-4 bg-[#C6A15B] hover:bg-[#D8BE7A] text-[#11100E] text-xs uppercase tracking-[0.2em] font-semibold transition-all duration-300 flex items-center justify-center gap-2"
              >
                <span>ACHETER MAINTENANT</span>
              </button>

              <button
                id="btn-product-wishlist"
                type="button"
                onClick={() => onToggleWishlist(product)}
                className={`w-full py-3.5 border text-xs uppercase tracking-[0.18em] font-medium transition-colors flex items-center justify-center gap-2 ${
                  isWishlisted
                    ? 'border-[#C6A15B] text-[#C6A15B] bg-[#FAF8F3]'
                    : 'border-[#EDE3D2] text-[#11100E] hover:border-[#C6A15B] hover:bg-[#FAF8F3]'
                }`}
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#C6A15B]' : ''}`} />
                <span>
                  {isWishlisted ? 'DANS VOS FAVORIS' : '♡ AJOUTER AUX FAVORIS'}
                </span>
              </button>

              <button
                id="btn-product-whatsapp-inquiry"
                type="button"
                onClick={handleWhatsAppInquiry}
                className="w-full py-3 bg-[#FAF8F3] hover:bg-[#EDE3D2] border border-[#C6A15B]/60 text-[#11100E] text-xs uppercase tracking-wider font-medium transition-colors flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#C6A15B]" />
                <span>Consulter un conseiller WhatsApp pour ce modèle</span>
              </button>
            </div>

            {/* Reassurance Guarantees */}
            <div className="pt-6 border-t border-[#EDE3D2] space-y-3 text-xs text-[#8A8780]">
              <div className="flex items-center gap-3">
                <Package className="w-4 h-4 text-[#C6A15B] flex-shrink-0" />
                <span>Écrin de présentation en noyer massif laqué et loupe d'horloger offerte</span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-[#C6A15B] flex-shrink-0" />
                <span>Garantie manufacture officielle {product.specs.warranty}</span>
              </div>
              <div className="flex items-center gap-3">
                <Award className="w-4 h-4 text-[#C6A15B] flex-shrink-0" />
                <span>Certificat d’authenticité signé de notre maître horloger</span>
              </div>
            </div>
          </div>
        </div>

        {/* 13. FICHE TECHNIQUE HORLOGÈRE - CARACTÉRISTIQUES */}
        <section id="specs-section" className="mb-20 bg-white p-8 sm:p-12 border border-[#EDE3D2] shadow-sm">
          <div className="max-w-3xl mb-10">
            <span className="text-xs uppercase tracking-[0.3em] text-[#C6A15B] font-semibold block mb-2">
              Précision Mécanique
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#11100E] tracking-wide">
              CARACTÉRISTIQUES HORLOGÈRES
            </h2>
            <div className="w-16 h-[1.5px] bg-[#C6A15B] mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-6 text-sm">
            <div className="border-b border-[#EDE3D2] pb-3">
              <span className="text-xs uppercase tracking-wider text-[#8A8780] block mb-1">
                Mouvement
              </span>
              <span className="font-medium text-[#11100E]">{product.specs.movement}</span>
            </div>

            <div className="border-b border-[#EDE3D2] pb-3">
              <span className="text-xs uppercase tracking-wider text-[#8A8780] block mb-1">
                Réserve de marche
              </span>
              <span className="font-medium text-[#11100E]">{product.specs.powerReserve}</span>
            </div>

            <div className="border-b border-[#EDE3D2] pb-3">
              <span className="text-xs uppercase tracking-wider text-[#8A8780] block mb-1">
                Boîtier
              </span>
              <span className="font-medium text-[#11100E]">{product.specs.case}</span>
            </div>

            <div className="border-b border-[#EDE3D2] pb-3">
              <span className="text-xs uppercase tracking-wider text-[#8A8780] block mb-1">
                Diamètre
              </span>
              <span className="font-medium text-[#11100E]">{product.specs.diameter}</span>
            </div>

            <div className="border-b border-[#EDE3D2] pb-3">
              <span className="text-xs uppercase tracking-wider text-[#8A8780] block mb-1">
                Étanchéité
              </span>
              <span className="font-medium text-[#11100E]">{product.specs.waterResistance}</span>
            </div>

            <div className="border-b border-[#EDE3D2] pb-3">
              <span className="text-xs uppercase tracking-wider text-[#8A8780] block mb-1">
                Verre
              </span>
              <span className="font-medium text-[#11100E]">{product.specs.glass}</span>
            </div>

            <div className="border-b border-[#EDE3D2] pb-3">
              <span className="text-xs uppercase tracking-wider text-[#8A8780] block mb-1">
                Bracelet
              </span>
              <span className="font-medium text-[#11100E]">{product.specs.strap}</span>
            </div>

            <div className="border-b border-[#EDE3D2] pb-3">
              <span className="text-xs uppercase tracking-wider text-[#8A8780] block mb-1">
                Boucle
              </span>
              <span className="font-medium text-[#11100E]">{product.specs.clasp}</span>
            </div>

            <div className="border-b border-[#EDE3D2] pb-3">
              <span className="text-xs uppercase tracking-wider text-[#8A8780] block mb-1">
                Garantie
              </span>
              <span className="font-medium text-[#C6A15B]">{product.specs.warranty}</span>
            </div>

            {product.specs.caliber && (
              <div className="border-b border-[#EDE3D2] pb-3">
                <span className="text-xs uppercase tracking-wider text-[#8A8780] block mb-1">
                  Calibre
                </span>
                <span className="font-medium text-[#11100E]">{product.specs.caliber}</span>
              </div>
            )}

            {product.specs.frequency && (
              <div className="border-b border-[#EDE3D2] pb-3">
                <span className="text-xs uppercase tracking-wider text-[#8A8780] block mb-1">
                  Fréquence
                </span>
                <span className="font-medium text-[#11100E]">{product.specs.frequency}</span>
              </div>
            )}

            {product.specs.jewels && (
              <div className="border-b border-[#EDE3D2] pb-3">
                <span className="text-xs uppercase tracking-wider text-[#8A8780] block mb-1">
                  Rubis
                </span>
                <span className="font-medium text-[#11100E]">{product.specs.jewels}</span>
              </div>
            )}
          </div>
        </section>

        {/* 14. HISTOIRE DE LA MONTRE */}
        <section id="history-section" className="mb-20 bg-[#11100E] text-[#EDE3D2] p-8 sm:p-14 border border-[#332A20]">
          <div className="max-w-4xl mx-auto space-y-6">
            <span className="text-xs uppercase tracking-[0.3em] text-[#C6A15B] font-semibold block">
              Genèse & Inspiration
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl text-white tracking-wide">
              L'HISTOIRE DE CETTE PIÈCE
            </h2>
            <div className="w-16 h-[1.5px] bg-[#C6A15B]" />
            <p className="font-serif italic text-xl sm:text-2xl text-[#D8BE7A] leading-relaxed">
              « Chaque sillon, chaque biseau raconte l’éternel dialogue entre la matière et le temps. »
            </p>
            <p className="text-sm sm:text-base text-[#8A8780] leading-relaxed font-light">
              {product.history}
            </p>
            <div className="pt-4 flex items-center gap-4 text-xs text-[#C6A15B] tracking-wider uppercase font-mono">
              <span>Maison Nicaise.a</span>
              <span>•</span>
              <span>Atelier de Haute Horlogerie</span>
              <span>•</span>
              <span>Genève</span>
            </div>
          </div>
        </section>

        {/* 15. AVIS & TÉMOIGNAGES DES CONNAISSEURS */}
        <section id="reviews-section" className="mb-20 bg-white p-8 sm:p-12 border border-[#EDE3D2] shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-8 border-b border-[#EDE3D2] gap-4">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-[#C6A15B] font-semibold block mb-1">
                Livre d'Or & Registre
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#11100E]">
                AVIS CERTIFIÉS DES CONNAISSEURS
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex text-[#C6A15B]">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 fill-[#C6A15B]" />
                ))}
              </div>
              <span className="text-xs font-semibold text-[#11100E]">
                5.0 / 5
              </span>
              <span className="text-xs text-[#8A8780]">
                ({reviews.length} témoignages certifiés)
              </span>
            </div>
          </div>

          {/* List of Reviews */}
          <div className="space-y-6 mb-12">
            {reviews.length === 0 ? (
              <p className="text-xs text-[#8A8780] italic">
                Soyez le premier acquéreur à inscrire votre appréciation sur ce modèle d'exception.
              </p>
            ) : (
              reviews.map((rev) => (
                <div key={rev.id} className="pb-6 border-b border-[#EDE3D2]/70 last:border-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-[#11100E]">
                        {rev.userName}
                      </span>
                      {rev.isVerifiedPurchase && (
                        <span className="text-[9px] uppercase px-2 py-0.5 bg-[#e8f5e9] text-[#2e7d32] border border-[#2e7d32]/20 font-medium tracking-wider">
                          Acquéreur Vérifié
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-[#8A8780]">
                      {new Date(rev.createdAt).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="flex text-[#C6A15B] mb-2">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#C6A15B]" />
                    ))}
                  </div>
                  <p className="text-xs text-[#555] font-light leading-relaxed">
                    "{rev.comment}"
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Review Submission Form */}
          <div className="bg-[#FAF8F3] p-6 sm:p-8 border border-[#EDE3D2]">
            <h4 className="font-serif text-lg text-[#11100E] mb-2">
              Transmettre votre témoignage
            </h4>
            <p className="text-xs text-[#8A8780] mb-4">
              Partagez votre expérience avec la Maison NICAISE.A. Votre avis sera consigné sur le registre de nos créations.
            </p>

            {reviewSuccess && (
              <div className="mb-4 p-3 bg-[#e8f5e9] border border-[#2e7d32]/30 text-[#2e7d32] text-xs flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>{reviewSuccess}</span>
              </div>
            )}

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#8A8780] mb-1">
                    Votre Nom ou Titre
                  </label>
                  <input
                    type="text"
                    required
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    placeholder="M. Alexandre D."
                    className="w-full bg-white border border-[#EDE3D2] px-3 py-2 text-xs text-[#11100E] focus:outline-none focus:border-[#C6A15B]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#8A8780] mb-1">
                    Évaluation Horlogère
                  </label>
                  <div className="flex items-center gap-1.5 py-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= reviewRating
                              ? 'text-[#C6A15B] fill-[#C6A15B]'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs text-[#11100E] font-medium ml-2">
                      {reviewRating}/5 étoiles
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#8A8780] mb-1">
                  Votre appréciation détaillée
                </label>
                <textarea
                  rows={3}
                  required
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Équilibre du boîtier, finitions du calibre, confort du bracelet..."
                  className="w-full bg-white border border-[#EDE3D2] p-3 text-xs text-[#11100E] focus:outline-none focus:border-[#C6A15B]"
                />
              </div>

              <button
                type="submit"
                disabled={submittingReview}
                className="px-6 py-3 bg-[#11100E] hover:bg-[#C6A15B] text-white text-xs uppercase tracking-widest font-semibold transition-colors flex items-center gap-2"
              >
                <span>{submittingReview ? 'Enregistrement...' : 'Consigner mon avis'}</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </section>

        {/* RELATED TIMEPIECES */}
        {relatedWatches.length > 0 && (
          <section id="related-watches-section" className="mb-12">
            <div className="flex items-center justify-between mb-8 pb-3 border-b border-[#EDE3D2]">
              <div>
                <span className="text-xs uppercase tracking-[0.25em] text-[#C6A15B] font-semibold block">
                  Dans le même esprit
                </span>
                <h3 className="font-serif text-2xl text-[#11100E]">
                  Garde-Temps Complémentaires
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedWatches.map((related) => (
                <ProductCard
                  key={related.id}
                  product={related}
                  onSelectProduct={onSelectProduct}
                  onAddToCart={(p) => onAddToCart(p, 1)}
                  onToggleWishlist={onToggleWishlist}
                  isWishlisted={false}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
