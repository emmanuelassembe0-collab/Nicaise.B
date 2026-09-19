import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Truck,
  CreditCard,
  Building,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Download,
  ShoppingBag,
  Clock,
  Sparkles,
  Award,
  Smartphone,
  Tag,
  AlertCircle,
} from 'lucide-react';
import { CartItem, CustomerInfo, Order, formatFCFA } from '../../types';
import { api } from '../../services/api';

interface CheckoutPageProps {
  items: CartItem[];
  onOrderCompleted: (order: Order) => void;
  onNavigateToCatalog: () => void;
  onNavigateToHome: () => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  items,
  onOrderCompleted,
  onNavigateToCatalog,
  onNavigateToHome,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form States
  const [customer, setCustomer] = useState<CustomerInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: "Côte d'Ivoire",
  });

  const [shippingMethod, setShippingMethod] = useState<
    'standard-secure' | 'express-private' | 'salon-pickup'
  >('standard-secure');

  const [paymentMethod, setPaymentMethod] = useState<
    'card' | 'momo' | 'orange_money' | 'bank_transfer' | 'concierge'
  >('card');

  const [momoPhone, setMomoPhone] = useState('');

  const [cardDetails, setCardDetails] = useState({
    holder: '',
    number: '',
    expiry: '',
    cvv: '',
  });

  // Promo code state
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number; message: string } | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [promoLoading, setPromoLoading] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discount = appliedPromo?.discount || 0;
  const shippingCost = shippingMethod === 'express-private' ? 25000 : 0;
  const total = Math.max(0, subtotal - discount + shippingCost);

  // Apply promo
  const handleApplyPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    setPromoError(null);
    setPromoLoading(true);
    try {
      const res = await api.promotions.validate(promoInput.trim(), subtotal);
      setAppliedPromo({
        code: res.promo.code,
        discount: res.discount,
        message: res.message,
      });
    } catch (err: any) {
      setPromoError(err.message || 'Code privilège non valide.');
      setAppliedPromo(null);
    } finally {
      setPromoLoading(false);
    }
  };

  // Step 1 Validation
  const isStep1Valid =
    Boolean(customer.firstName.trim()) &&
    Boolean(customer.lastName.trim()) &&
    Boolean(customer.email.trim()) &&
    Boolean(customer.phone.trim()) &&
    Boolean(customer.address.trim()) &&
    Boolean(customer.city.trim());

  // Step 3 Confirmation with Real Backend
  const handleFinalizeOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitting(true);

    try {
      // 1. Create order in database
      const orderPayload = {
        items,
        customer,
        shippingAddress: `${customer.address}, ${customer.city}, ${customer.country}`,
        shippingMethod:
          shippingMethod === 'express-private'
            ? 'Convoyeur privé express sous scellés diplomatiques'
            : shippingMethod === 'salon-pickup'
            ? 'Remise en salon privé'
            : 'Convoyage sécurisé diplomatique offert',
        paymentMethod:
          paymentMethod === 'card'
            ? 'Carte Bancaire (Visa/Mastercard)'
            : paymentMethod === 'momo'
            ? 'MTN Mobile Money'
            : paymentMethod === 'orange_money'
            ? 'Orange Money'
            : paymentMethod === 'bank_transfer'
            ? 'Virement Bancaire Privé'
            : 'Conciergerie Privée',
        promoCode: appliedPromo?.code,
        momoPhone: (paymentMethod === 'momo' || paymentMethod === 'orange_money') ? momoPhone : undefined,
      };

      const { order } = await api.orders.create(orderPayload);

      // 2. Process payment simulation / confirmation
      await api.payments.process({
        orderNumber: order.orderNumber,
        paymentMethod: orderPayload.paymentMethod,
        momoPhone,
      });

      setCompletedOrder(order);
      onOrderCompleted(order);
      setStep(4);
    } catch (err: any) {
      setSubmitError(err.message || 'Une erreur est survenue lors de l’enregistrement de votre commande.');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  if (items.length === 0 && step !== 4) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 bg-[#FAF8F3] text-center">
        <ShoppingBag className="w-14 h-14 text-[#C6A15B]/50 mb-4" />
        <h2 className="font-serif text-3xl text-[#11100E] mb-2">Votre coffret est vide</h2>
        <p className="text-xs text-[#8A8780] max-w-sm mb-6">
          Veuillez sélectionner au moins un garde-temps d'exception avant de procéder au protocole d'acquisition.
        </p>
        <button
          onClick={onNavigateToCatalog}
          className="px-8 py-3.5 bg-[#11100E] text-white text-xs uppercase tracking-widest font-semibold hover:bg-[#C6A15B] transition-colors"
        >
          Découvrir les montres
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF8F3] min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Checkout Stepper Progress (1 to 4) */}
        <div className="mb-12">
          <div className="flex items-center justify-between max-w-2xl mx-auto relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#EDE3D2] -translate-y-1/2 z-0" />

            {[
              { num: 1, label: 'Informations' },
              { num: 2, label: 'Livraison' },
              { num: 3, label: 'Paiement' },
              { num: 4, label: 'Confirmation' },
            ].map((s) => {
              const isPassed = step > s.num;
              const isCurrent = step === s.num;
              return (
                <div key={s.num} className="relative z-10 flex flex-col items-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-serif transition-colors duration-300 ${
                      isPassed
                        ? 'bg-[#C6A15B] text-white'
                        : isCurrent
                        ? 'bg-[#11100E] text-white ring-4 ring-[#C6A15B]/30'
                        : 'bg-[#EDE3D2] text-[#8A8780]'
                    }`}
                  >
                    {isPassed ? '✓' : s.num}
                  </div>
                  <span
                    className={`text-[10px] uppercase tracking-wider mt-2 font-medium ${
                      isCurrent ? 'text-[#11100E]' : 'text-[#8A8780]'
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* STEP 4: ORDER CONFIRMATION RECEIPT */}
        {step === 4 && completedOrder ? (
          <div className="bg-white border border-[#C6A15B]/40 p-8 sm:p-14 shadow-xl max-w-3xl mx-auto text-center animate-in fade-in duration-300">
            <div className="w-16 h-16 bg-[#e8f5e9] text-[#2e7d32] rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <span className="text-xs uppercase tracking-[0.3em] text-[#C6A15B] font-semibold block mb-2">
              Protocole d'Acquisition Validé
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl text-[#11100E] tracking-wide mb-4">
              Félicitations pour votre acquisition
            </h1>
            <p className="font-serif italic text-lg sm:text-xl text-[#332A20] max-w-xl mx-auto mb-6">
              « Votre nom est désormais gravé dans le grand livre de la Maison NICAISE.A. »
            </p>

            <div className="p-4 bg-[#FAF8F3] border border-[#EDE3D2] inline-block mb-8">
              <span className="text-[10px] uppercase tracking-widest text-[#8A8780] block">
                Numéro de commande confidentiel
              </span>
              <span className="font-mono text-xl text-[#11100E] font-bold tracking-wider">
                {completedOrder.orderNumber}
              </span>
            </div>

            {/* Recapped Products */}
            <div className="border-t border-b border-[#EDE3D2] py-6 text-left space-y-4 mb-8">
              <h3 className="text-xs uppercase tracking-wider text-[#8A8780] font-semibold">
                Garde-temps acquis :
              </h3>
              {completedOrder.items.map((item) => (
                <div key={item.product.id} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={item.product.images.front}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 object-contain bg-[#FAF8F3] p-1 border border-[#EDE3D2]"
                    />
                    <div>
                      <span className="text-[10px] uppercase text-[#C6A15B]">
                        {item.product.collection}
                      </span>
                      <h4 className="font-serif text-base text-[#11100E] font-medium">
                        {item.product.name}
                      </h4>
                      <span className="text-xs text-[#8A8780]">
                        Quantité : {item.quantity} • {item.product.diameter}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-[#11100E]">
                      {formatFCFA(item.product.price * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}

              <div className="pt-4 border-t border-[#EDE3D2]/60 flex justify-between items-center text-sm font-bold text-[#11100E]">
                <span>Total de l'acquisition</span>
                <span className="text-lg text-[#C6A15B] font-serif">
                  {formatFCFA(completedOrder.total)}
                </span>
              </div>
            </div>

            {/* Luxury Box Mention */}
            <div className="p-6 bg-[#FAF8F3] border border-[#EDE3D2] text-left mb-8 space-y-3">
              <div className="flex items-center gap-3 text-xs text-[#11100E] font-medium">
                <Sparkles className="w-4 h-4 text-[#C6A15B]" />
                <span>
                  Votre garde-temps sera préparé dans notre <strong>écrin en noyer massif laqué</strong> accompagné de sa loupe d'horloger et de son certificat numéroté.
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-[#8A8780]">
                <Clock className="w-4 h-4 text-[#C6A15B]" />
                <span>
                  Un concierge dédié vous contactera au{' '}
                  <strong className="text-[#11100E]">{completedOrder.customer.phone}</strong> sous 2 heures pour confirmer les détails de remise sécurisée.
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={handlePrintInvoice}
                className="w-full sm:w-auto px-6 py-3.5 bg-white border border-[#EDE3D2] hover:border-[#C6A15B] text-[#11100E] text-xs uppercase tracking-widest font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4 text-[#C6A15B]" />
                <span>Télécharger la facture proforma</span>
              </button>

              <button
                onClick={onNavigateToHome}
                className="w-full sm:w-auto px-8 py-3.5 bg-[#11100E] hover:bg-[#C6A15B] text-white text-xs uppercase tracking-widest font-semibold transition-colors"
              >
                Retour à l'accueil
              </button>
            </div>
          </div>
        ) : (
          /* STEPS 1, 2, 3 LAYOUT WITH ORDER SUMMARY */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Form (Col 1 to 7) */}
            <div className="lg:col-span-7 bg-white p-8 border border-[#EDE3D2] shadow-sm">
              {/* STEP 1: INFORMATIONS CLIENT */}
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.25em] text-[#C6A15B] font-semibold block mb-1">
                      Étape 1 sur 3
                    </span>
                    <h2 className="font-serif text-2xl sm:text-3xl text-[#11100E]">
                      Vos coordonnées d’acquéreur
                    </h2>
                    <p className="text-xs text-[#8A8780] mt-1">
                      Ces informations permettront l'établissement du certificat de manufacture et du protocole de livraison.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#8A8780] font-medium mb-1.5">
                        Prénom *
                      </label>
                      <input
                        type="text"
                        required
                        value={customer.firstName}
                        onChange={(e) => setCustomer({ ...customer, firstName: e.target.value })}
                        placeholder="Ex : Alexandre"
                        className="w-full bg-[#FAF8F3] border border-[#EDE3D2] px-3.5 py-2.5 text-xs text-[#11100E] focus:outline-none focus:border-[#C6A15B]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#8A8780] font-medium mb-1.5">
                        Nom *
                      </label>
                      <input
                        type="text"
                        required
                        value={customer.lastName}
                        onChange={(e) => setCustomer({ ...customer, lastName: e.target.value })}
                        placeholder="Ex : de Montmirail"
                        className="w-full bg-[#FAF8F3] border border-[#EDE3D2] px-3.5 py-2.5 text-xs text-[#11100E] focus:outline-none focus:border-[#C6A15B]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#8A8780] font-medium mb-1.5">
                        Email confidentiel *
                      </label>
                      <input
                        type="email"
                        required
                        value={customer.email}
                        onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                        placeholder="alexandre@prestige.com"
                        className="w-full bg-[#FAF8F3] border border-[#EDE3D2] px-3.5 py-2.5 text-xs text-[#11100E] focus:outline-none focus:border-[#C6A15B]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#8A8780] font-medium mb-1.5">
                        Téléphone pour le convoyeur *
                      </label>
                      <input
                        type="tel"
                        required
                        value={customer.phone}
                        onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                        placeholder="+225 07 00 00 00 00"
                        className="w-full bg-[#FAF8F3] border border-[#EDE3D2] px-3.5 py-2.5 text-xs text-[#11100E] focus:outline-none focus:border-[#C6A15B]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#8A8780] font-medium mb-1.5">
                      Adresse de résidence ou d'affaires *
                    </label>
                    <input
                      type="text"
                      required
                      value={customer.address}
                      onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                      placeholder="Rue des Salons, Résidence d'Honneur"
                      className="w-full bg-[#FAF8F3] border border-[#EDE3D2] px-3.5 py-2.5 text-xs text-[#11100E] focus:outline-none focus:border-[#C6A15B]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#8A8780] font-medium mb-1.5">
                        Ville *
                      </label>
                      <input
                        type="text"
                        required
                        value={customer.city}
                        onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                        placeholder="Abidjan / Genève / Paris"
                        className="w-full bg-[#FAF8F3] border border-[#EDE3D2] px-3.5 py-2.5 text-xs text-[#11100E] focus:outline-none focus:border-[#C6A15B]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#8A8780] font-medium mb-1.5">
                        Code Postal
                      </label>
                      <input
                        type="text"
                        value={customer.postalCode}
                        onChange={(e) => setCustomer({ ...customer, postalCode: e.target.value })}
                        placeholder="BP 1234"
                        className="w-full bg-[#FAF8F3] border border-[#EDE3D2] px-3.5 py-2.5 text-xs text-[#11100E] focus:outline-none focus:border-[#C6A15B]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#8A8780] font-medium mb-1.5">
                        Pays
                      </label>
                      <select
                        value={customer.country}
                        onChange={(e) => setCustomer({ ...customer, country: e.target.value })}
                        className="w-full bg-[#FAF8F3] border border-[#EDE3D2] px-3 py-2.5 text-xs text-[#11100E] focus:outline-none focus:border-[#C6A15B]"
                      >
                        <option value="Côte d'Ivoire">Côte d'Ivoire</option>
                        <option value="France">France</option>
                        <option value="Suisse">Suisse</option>
                        <option value="Sénégal">Sénégal</option>
                        <option value="Cameroun">Cameroun</option>
                        <option value="Émirats Arabes Unis">Émirats Arabes Unis</option>
                        <option value="Belgique">Belgique</option>
                        <option value="Monaco">Monaco</option>
                        <option value="Autre">Autre destination internationale</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      id="btn-checkout-step1-next"
                      type="button"
                      disabled={!isStep1Valid}
                      onClick={() => setStep(2)}
                      className="px-8 py-3.5 bg-[#11100E] disabled:bg-[#8A8780] hover:bg-[#C6A15B] text-white text-xs uppercase tracking-widest font-semibold transition-colors flex items-center gap-2"
                    >
                      <span>Continuer vers la livraison</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: MODE DE LIVRAISON */}
              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.25em] text-[#C6A15B] font-semibold block mb-1">
                      Étape 2 sur 3
                    </span>
                    <h2 className="font-serif text-2xl sm:text-3xl text-[#11100E]">
                      Mode de convoyage & remise
                    </h2>
                    <p className="text-xs text-[#8A8780] mt-1">
                      Toutes nos expéditions sont assurées à 100 % de la valeur déclarée et emballées sous scellé haute sécurité.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {/* Standard Secure */}
                    <label
                      onClick={() => setShippingMethod('standard-secure')}
                      className={`block p-4 border cursor-pointer transition-all ${
                        shippingMethod === 'standard-secure'
                          ? 'border-[#C6A15B] bg-[#FAF8F3] ring-1 ring-[#C6A15B]'
                          : 'border-[#EDE3D2] hover:border-[#C6A15B]/50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <input
                            type="radio"
                            name="shipping"
                            checked={shippingMethod === 'standard-secure'}
                            onChange={() => setShippingMethod('standard-secure')}
                            className="mt-1 accent-[#C6A15B]"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-xs text-[#11100E] uppercase tracking-wider">
                                Livraison sécurisée standard
                              </span>
                              <span className="text-[10px] uppercase px-2 py-0.5 bg-[#e8f5e9] text-[#2e7d32] font-semibold">
                                Offerte
                              </span>
                            </div>
                            <p className="text-xs text-[#8A8780] mt-1">
                              Colis scellé haute sécurité remis en mains propres contre pièce d'identité (3 à 5 jours ouvrés).
                            </p>
                          </div>
                        </div>
                        <span className="text-xs font-semibold text-[#2e7d32]">GRATUIT</span>
                      </div>
                    </label>

                    {/* Express Private Courier */}
                    <label
                      onClick={() => setShippingMethod('express-private')}
                      className={`block p-4 border cursor-pointer transition-all ${
                        shippingMethod === 'express-private'
                          ? 'border-[#C6A15B] bg-[#FAF8F3] ring-1 ring-[#C6A15B]'
                          : 'border-[#EDE3D2] hover:border-[#C6A15B]/50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <input
                            type="radio"
                            name="shipping"
                            checked={shippingMethod === 'express-private'}
                            onChange={() => setShippingMethod('express-private')}
                            className="mt-1 accent-[#C6A15B]"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-xs text-[#11100E] uppercase tracking-wider">
                                Livraison express avec convoyeur privé
                              </span>
                              <span className="text-[10px] uppercase px-2 py-0.5 bg-[#C6A15B]/20 text-[#11100E] font-semibold">
                                VIP 24h
                              </span>
                            </div>
                            <p className="text-xs text-[#8A8780] mt-1">
                              Un officier de sécurité dédié remet la pièce à votre domicile ou bureau sous valise diplomatique sécurisée.
                            </p>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-[#11100E]">
                          {formatFCFA(50000)}
                        </span>
                      </div>
                    </label>

                    {/* Salon Pickup */}
                    <label
                      onClick={() => setShippingMethod('salon-pickup')}
                      className={`block p-4 border cursor-pointer transition-all ${
                        shippingMethod === 'salon-pickup'
                          ? 'border-[#C6A15B] bg-[#FAF8F3] ring-1 ring-[#C6A15B]'
                          : 'border-[#EDE3D2] hover:border-[#C6A15B]/50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <input
                            type="radio"
                            name="shipping"
                            checked={shippingMethod === 'salon-pickup'}
                            onChange={() => setShippingMethod('salon-pickup')}
                            className="mt-1 accent-[#C6A15B]"
                          />
                          <div>
                            <span className="font-medium text-xs text-[#11100E] uppercase tracking-wider block">
                              Retrait en salon privé d'exception
                            </span>
                            <p className="text-xs text-[#8A8780] mt-1">
                              Remise accompagnée d’une dégustation de champagne millésimé dans nos salons privés (Genève, Abidjan ou Paris).
                            </p>
                          </div>
                        </div>
                        <span className="text-xs font-semibold text-[#2e7d32]">GRATUIT</span>
                      </div>
                    </label>
                  </div>

                  <div className="pt-4 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-6 py-3.5 text-xs uppercase tracking-widest text-[#8A8780] hover:text-[#11100E] flex items-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Retour</span>
                    </button>

                    <button
                      id="btn-checkout-step2-next"
                      type="button"
                      onClick={() => setStep(3)}
                      className="px-8 py-3.5 bg-[#11100E] hover:bg-[#C6A15B] text-white text-xs uppercase tracking-widest font-semibold transition-colors flex items-center gap-2"
                    >
                      <span>Continuer vers le paiement</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: PAIEMENT */}
              {step === 3 && (
                <form onSubmit={handleFinalizeOrder} className="space-y-6">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.25em] text-[#C6A15B] font-semibold block mb-1">
                      Étape 3 sur 3
                    </span>
                    <h2 className="font-serif text-2xl sm:text-3xl text-[#11100E]">
                      Règlement sécurisé
                    </h2>
                    <p className="text-xs text-[#8A8780] mt-1">
                      Toutes les transactions sont chiffrées de bout en bout et protégées selon les normes de sécurité bancaire.
                    </p>
                  </div>

                  {submitError && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  {/* Payment Methods Selection */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`p-3 border text-center transition-all ${
                        paymentMethod === 'card'
                          ? 'border-[#C6A15B] bg-[#FAF8F3] ring-1 ring-[#C6A15B]'
                          : 'border-[#EDE3D2]'
                      }`}
                    >
                      <CreditCard className="w-5 h-5 mx-auto text-[#C6A15B] mb-1" />
                      <span className="text-[11px] font-medium text-[#11100E] block">
                        Carte bancaire
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('momo')}
                      className={`p-3 border text-center transition-all ${
                        paymentMethod === 'momo'
                          ? 'border-[#C6A15B] bg-[#FAF8F3] ring-1 ring-[#C6A15B]'
                          : 'border-[#EDE3D2]'
                      }`}
                    >
                      <Smartphone className="w-5 h-5 mx-auto text-[#C6A15B] mb-1" />
                      <span className="text-[11px] font-medium text-[#11100E] block">
                        MTN MoMo
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('orange_money')}
                      className={`p-3 border text-center transition-all ${
                        paymentMethod === 'orange_money'
                          ? 'border-[#C6A15B] bg-[#FAF8F3] ring-1 ring-[#C6A15B]'
                          : 'border-[#EDE3D2]'
                      }`}
                    >
                      <Smartphone className="w-5 h-5 mx-auto text-[#C6A15B] mb-1" />
                      <span className="text-[11px] font-medium text-[#11100E] block">
                        Orange Money
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('bank_transfer')}
                      className={`p-3 border text-center transition-all ${
                        paymentMethod === 'bank_transfer'
                          ? 'border-[#C6A15B] bg-[#FAF8F3] ring-1 ring-[#C6A15B]'
                          : 'border-[#EDE3D2]'
                      }`}
                    >
                      <Building className="w-5 h-5 mx-auto text-[#C6A15B] mb-1" />
                      <span className="text-[11px] font-medium text-[#11100E] block">
                        Virement privé
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('concierge')}
                      className={`p-3 border text-center transition-all ${
                        paymentMethod === 'concierge'
                          ? 'border-[#C6A15B] bg-[#FAF8F3] ring-1 ring-[#C6A15B]'
                          : 'border-[#EDE3D2]'
                      }`}
                    >
                      <ShieldCheck className="w-5 h-5 mx-auto text-[#C6A15B] mb-1" />
                      <span className="text-[11px] font-medium text-[#11100E] block">
                        Conciergerie
                      </span>
                    </button>
                  </div>

                  {/* Card Form */}
                  {paymentMethod === 'card' && (
                    <div className="space-y-4 p-5 bg-[#FAF8F3] border border-[#EDE3D2]">
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-[#8A8780] font-medium mb-1">
                          Nom du porteur *
                        </label>
                        <input
                          type="text"
                          required
                          value={cardDetails.holder}
                          onChange={(e) => setCardDetails({ ...cardDetails, holder: e.target.value })}
                          placeholder="M. ALEXANDRE DE MONTMIRAIL"
                          className="w-full bg-white border border-[#EDE3D2] px-3.5 py-2.5 text-xs text-[#11100E] uppercase focus:outline-none focus:border-[#C6A15B]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs uppercase tracking-wider text-[#8A8780] font-medium mb-1">
                          Numéro de carte (Visa / Mastercard) *
                        </label>
                        <input
                          type="text"
                          required
                          maxLength={19}
                          value={cardDetails.number}
                          onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                          placeholder="4532 •••• •••• 8942"
                          className="w-full bg-white border border-[#EDE3D2] px-3.5 py-2.5 text-xs text-[#11100E] focus:outline-none focus:border-[#C6A15B] font-mono"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs uppercase tracking-wider text-[#8A8780] font-medium mb-1">
                            Date d'expiration *
                          </label>
                          <input
                            type="text"
                            required
                            maxLength={5}
                            value={cardDetails.expiry}
                            onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                            placeholder="MM/AA"
                            className="w-full bg-white border border-[#EDE3D2] px-3.5 py-2.5 text-xs text-[#11100E] focus:outline-none focus:border-[#C6A15B]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs uppercase tracking-wider text-[#8A8780] font-medium mb-1">
                            Cryptogramme CVV *
                          </label>
                          <input
                            type="password"
                            required
                            maxLength={4}
                            value={cardDetails.cvv}
                            onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                            placeholder="•••"
                            className="w-full bg-white border border-[#EDE3D2] px-3.5 py-2.5 text-xs text-[#11100E] focus:outline-none focus:border-[#C6A15B] font-mono"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-[#8A8780] pt-2">
                        <Lock className="w-3.5 h-3.5 text-[#C6A15B]" />
                        <span>Conforme PCI-DSS. Le code CVV et les données de carte ne sont jamais conservés sur nos serveurs.</span>
                      </div>
                    </div>
                  )}

                  {/* Mobile Money MTN & Orange Money */}
                  {(paymentMethod === 'momo' || paymentMethod === 'orange_money') && (
                    <div className="space-y-4 p-5 bg-[#FAF8F3] border border-[#EDE3D2]">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#11100E] text-[#C6A15B] flex items-center justify-center font-bold text-xs">
                          {paymentMethod === 'momo' ? 'MTN' : 'OM'}
                        </div>
                        <div>
                          <h4 className="font-semibold text-xs text-[#11100E] uppercase tracking-wider">
                            Règlement par {paymentMethod === 'momo' ? 'MTN Mobile Money' : 'Orange Money'}
                          </h4>
                          <span className="text-[11px] text-[#8A8780]">Afrique de l'Ouest & Centrale (UEMOA)</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs uppercase tracking-wider text-[#8A8780] font-medium mb-1">
                          Numéro de compte Mobile Money *
                        </label>
                        <input
                          type="tel"
                          required
                          value={momoPhone}
                          onChange={(e) => setMomoPhone(e.target.value)}
                          placeholder="Ex: +225 07 00 11 22 33"
                          className="w-full bg-white border border-[#EDE3D2] px-3.5 py-2.5 text-xs text-[#11100E] focus:outline-none focus:border-[#C6A15B] font-mono"
                        />
                      </div>

                      <div className="p-3 bg-white border border-[#EDE3D2] text-[11px] text-[#332A20] space-y-1">
                        <p>
                          1. Cliquez sur le bouton de validation ci-dessous.<br />
                          2. Une notification d'autorisation de débit sécurisée sera envoyée sur votre combiné mobile.<br />
                          3. <strong>Sécurité stricte :</strong> Votre code secret PIN Mobile Money ne doit jamais être saisi sur un site web. Vous le validerez directement sur votre téléphone.
                        </p>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'bank_transfer' && (
                    <div className="p-5 bg-[#FAF8F3] border border-[#EDE3D2] space-y-2 text-xs text-[#332A20]">
                      <h4 className="font-semibold text-[#11100E] uppercase text-[11px] tracking-wider">
                        Coordonnées bancaires privées (IBAN Suisse & UEMOA) :
                      </h4>
                      <p className="font-mono text-[11px]">
                        IBAN : CH93 0076 2011 6238 5291 0<br />
                        BIC / SWIFT : UBSWCHZH80A<br />
                        Bénéficiaire : MANUFACTURE NICAISE.A GENÈVE SA
                      </p>
                      <p className="text-[11px] text-[#8A8780] pt-2">
                        Votre garde-temps sera réservé pendant 72 heures en attendant la confirmation de compensation des fonds.
                      </p>
                    </div>
                  )}

                  {paymentMethod === 'concierge' && (
                    <div className="p-5 bg-[#FAF8F3] border border-[#EDE3D2] text-xs text-[#332A20] space-y-2">
                      <h4 className="font-semibold text-[#11100E] uppercase text-[11px] tracking-wider">
                        Prise en charge par Conciergerie Privée :
                      </h4>
                      <p>
                        Notre majordome horloger prendra directement contact avec votre Family Office ou votre secrétariat particulier pour organiser la remise et le règlement en mains propres sous scellés diplomatiques.
                      </p>
                    </div>
                  )}

                  <div className="pt-4 flex justify-between items-center">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-6 py-3.5 text-xs uppercase tracking-widest text-[#8A8780] hover:text-[#11100E] flex items-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Retour</span>
                    </button>

                    <button
                      id="btn-checkout-finalize"
                      type="submit"
                      disabled={submitting}
                      className="px-8 py-4 bg-[#C6A15B] hover:bg-[#D8BE7A] text-[#11100E] text-xs uppercase tracking-widest font-semibold transition-colors flex items-center gap-2 shadow-md disabled:opacity-50"
                    >
                      <Lock className="w-4 h-4" />
                      <span>{submitting ? 'Validation du protocole...' : `Valider l'acquisition (${formatFCFA(total)})`}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Right Order Summary (Col 8 to 12) */}
            <div className="lg:col-span-5 bg-white p-6 border border-[#EDE3D2] shadow-sm sticky top-28 space-y-4">
              <h3 className="font-serif text-xl text-[#11100E] pb-3 border-b border-[#EDE3D2]">
                Récapitulatif de l'acquisition
              </h3>

              {/* Promo Code Input Box */}
              <div className="p-3 bg-[#FAF8F3] border border-[#EDE3D2] space-y-2">
                <span className="text-[10px] uppercase tracking-wider text-[#8A8780] font-semibold block">
                  Code Privilège ou Carte Cadeau
                </span>
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                    placeholder="EX: NICAISE5, ROYAL10"
                    className="flex-1 bg-white border border-[#EDE3D2] px-3 py-1.5 text-xs text-[#11100E] font-mono uppercase focus:outline-none focus:border-[#C6A15B]"
                  />
                  <button
                    type="submit"
                    disabled={promoLoading}
                    className="px-4 py-1.5 bg-[#11100E] hover:bg-[#C6A15B] text-white text-[10px] uppercase tracking-wider font-semibold transition-colors"
                  >
                    {promoLoading ? '...' : 'Appliquer'}
                  </button>
                </form>
                {promoError && <p className="text-[10px] text-red-600">{promoError}</p>}
                {appliedPromo && (
                  <p className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                    <Tag className="w-3 h-3" /> {appliedPromo.message}
                  </p>
                )}
              </div>

              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-3 py-2 border-b border-[#EDE3D2]/50">
                    <img
                      src={item.product.images.front}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 object-contain bg-[#FAF8F3] p-1 border border-[#EDE3D2]"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[9px] uppercase tracking-wider text-[#C6A15B]">
                        {item.product.collection}
                      </span>
                      <h4 className="font-serif text-sm text-[#11100E] font-medium truncate">
                        {item.product.name}
                      </h4>
                      <div className="text-[11px] text-[#8A8780]">
                        Qté : {item.quantity} • {item.product.movementType}
                      </div>
                      <div className="text-xs font-semibold text-[#11100E] mt-0.5">
                        {formatFCFA((item.product.promotionalPrice || item.product.price) * item.quantity)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2 text-xs pt-2 border-t border-[#EDE3D2]">
                <div className="flex justify-between text-[#8A8780]">
                  <span>Sous-total montres</span>
                  <span className="font-medium text-[#11100E]">{formatFCFA(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Privilège ({appliedPromo?.code})</span>
                    <span>-{formatFCFA(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#8A8780]">
                  <span>Frais de convoyage</span>
                  <span className="font-medium text-[#11100E]">
                    {shippingCost === 0 ? 'Offert' : formatFCFA(shippingCost)}
                  </span>
                </div>
                <div className="flex justify-between text-[#8A8780]">
                  <span>Écrin prestige & loupe</span>
                  <span className="font-medium text-[#2e7d32]">Inclus</span>
                </div>
                <div className="flex justify-between text-base font-bold text-[#11100E] pt-3 border-t border-[#EDE3D2]">
                  <span className="font-serif text-lg">Total à régler</span>
                  <span className="text-[#C6A15B] text-lg font-sans">{formatFCFA(total)}</span>
                </div>
              </div>

              <div className="p-3 bg-[#FAF8F3] border border-[#EDE3D2] text-[11px] text-[#8A8780] space-y-1">
                <div className="flex items-center gap-1.5 text-[#11100E] font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C6A15B]" />
                  <span>Garantie manufacture 5 ans & certificat</span>
                </div>
                <p>
                  Chaque montre est soumise à un contrôle chronométrique avant scellement diplomatique.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
