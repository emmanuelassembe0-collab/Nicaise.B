import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, MessageSquare } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Acquisition d’un garde-temps',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <div className="bg-[#FAF8F3] min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase tracking-[0.3em] text-[#C6A15B] font-semibold block">
            Conciergerie & Salons Privés
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#11100E] tracking-wide uppercase">
            Contacter NICAISE.A
          </h1>
          <div className="w-16 h-[1.5px] bg-[#C6A15B] mx-auto" />
          <p className="font-serif italic text-base sm:text-lg text-[#332A20]">
            « À votre entière disposition pour tout projet d'acquisition, commande sur-mesure ou entretien de vos garde-temps. »
          </p>
        </div>

        {/* 3 Salons Privés Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white p-8 border border-[#EDE3D2] shadow-sm space-y-3">
            <span className="text-[10px] uppercase tracking-widest text-[#C6A15B] font-semibold block">
              Siège & Salons
            </span>
            <h3 className="font-serif text-2xl text-[#11100E]">Genève</h3>
            <p className="text-xs text-[#8A8780] leading-relaxed">
              12, Rue du Rhône<br />
              1204 Genève, Suisse
            </p>
            <div className="pt-2 text-xs text-[#11100E] font-medium space-y-1">
              <p>Tél : +41 22 819 00 00</p>
              <p>geneve@nicaise-a.com</p>
            </div>
            <span className="inline-block text-[10px] uppercase tracking-wider text-[#2e7d32] pt-2">
              Ouvert du lundi au samedi sur rendez-vous
            </span>
          </div>

          <div className="bg-white p-8 border border-[#C6A15B]/50 shadow-sm space-y-3 relative">
            <span className="absolute top-4 right-4 text-[9px] uppercase px-2 py-0.5 bg-[#C6A15B]/15 text-[#C6A15B] font-semibold">
              Salon Privilège
            </span>
            <span className="text-[10px] uppercase tracking-widest text-[#C6A15B] font-semibold block">
              Afrique de l'Ouest
            </span>
            <h3 className="font-serif text-2xl text-[#11100E]">Abidjan</h3>
            <p className="text-xs text-[#8A8780] leading-relaxed">
              Boulevard des Ambassades, Cocody<br />
              Abidjan, Côte d'Ivoire
            </p>
            <div className="pt-2 text-xs text-[#11100E] font-medium space-y-1">
              <p>Tél : +225 07 48 92 10 01</p>
              <p>abidjan@nicaise-a.com</p>
            </div>
            <span className="inline-block text-[10px] uppercase tracking-wider text-[#2e7d32] pt-2">
              Concierge dédié 7j/7
            </span>
          </div>

          <div className="bg-white p-8 border border-[#EDE3D2] shadow-sm space-y-3">
            <span className="text-[10px] uppercase tracking-widest text-[#C6A15B] font-semibold block">
              Suite Horlogère
            </span>
            <h3 className="font-serif text-2xl text-[#11100E]">Paris</h3>
            <p className="text-xs text-[#8A8780] leading-relaxed">
              Place Vendôme<br />
              75001 Paris, France
            </p>
            <div className="pt-2 text-xs text-[#11100E] font-medium space-y-1">
              <p>Tél : +33 1 42 68 00 00</p>
              <p>paris@nicaise-a.com</p>
            </div>
            <span className="inline-block text-[10px] uppercase tracking-wider text-[#2e7d32] pt-2">
              Réception privée uniquement
            </span>
          </div>
        </div>

        {/* Form and VIP Concierge Direct Contact */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Form */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-12 border border-[#EDE3D2] shadow-sm">
            <h3 className="font-serif text-2xl text-[#11100E] mb-2">
              Formulaire de Contact Confidentiel
            </h3>
            <p className="text-xs text-[#8A8780] mb-8">
              Remplissez ce formulaire afin qu'un conseiller de la manufacture prenne contact avec vous sous 24 heures ouvrées.
            </p>

            {formSubmitted ? (
              <div className="p-8 bg-[#FAF8F3] border border-[#2e7d32]/30 text-center space-y-3">
                <CheckCircle className="w-12 h-12 text-[#2e7d32] mx-auto" />
                <h4 className="font-serif text-2xl text-[#11100E]">
                  Message transmis avec succès
                </h4>
                <p className="text-xs text-[#8A8780] max-w-sm mx-auto">
                  Nous vous remercions pour votre intérêt. Votre conseiller dédié vous répondra par le canal souhaité dans les plus brefs délais.
                </p>
                <button
                  onClick={() => setFormSubmitted(false)}
                  className="mt-4 px-6 py-2.5 bg-[#11100E] text-white text-xs uppercase tracking-widest font-semibold"
                >
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block uppercase tracking-wider text-[#8A8780] font-medium mb-1.5">
                      Nom et Titre *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="M. ou Mme..."
                      className="w-full bg-[#FAF8F3] border border-[#EDE3D2] px-3.5 py-2.5 text-xs text-[#11100E] focus:outline-none focus:border-[#C6A15B]"
                    />
                  </div>
                  <div>
                    <label className="block uppercase tracking-wider text-[#8A8780] font-medium mb-1.5">
                      Email confidentiel *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="votre@email.com"
                      className="w-full bg-[#FAF8F3] border border-[#EDE3D2] px-3.5 py-2.5 text-xs text-[#11100E] focus:outline-none focus:border-[#C6A15B]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block uppercase tracking-wider text-[#8A8780] font-medium mb-1.5">
                      Numéro de téléphone
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+225 ..."
                      className="w-full bg-[#FAF8F3] border border-[#EDE3D2] px-3.5 py-2.5 text-xs text-[#11100E] focus:outline-none focus:border-[#C6A15B]"
                    />
                  </div>
                  <div>
                    <label className="block uppercase tracking-wider text-[#8A8780] font-medium mb-1.5">
                      Objet de votre demande *
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full bg-[#FAF8F3] border border-[#EDE3D2] px-3 py-2.5 text-xs text-[#11100E] focus:outline-none focus:border-[#C6A15B]"
                    >
                      <option value="Acquisition d’un garde-temps">Acquisition d’un garde-temps</option>
                      <option value="Private Collection & Pièces Rares">Private Collection & Pièces Rares</option>
                      <option value="Réservation d’un salon privé">Réservation d’un salon privé</option>
                      <option value="Entretien, révision et polissage">Entretien, révision et polissage</option>
                      <option value="Demande de commande sur-mesure">Demande de commande sur-mesure</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-[#8A8780] font-medium mb-1.5">
                    Votre message *
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Détaillez vos souhaits ou questions relatives à nos créations horlogères..."
                    className="w-full bg-[#FAF8F3] border border-[#EDE3D2] px-3.5 py-2.5 text-xs text-[#11100E] focus:outline-none focus:border-[#C6A15B]"
                  />
                </div>

                <button
                  type="submit"
                  className="px-8 py-3.5 bg-[#11100E] hover:bg-[#C6A15B] text-white text-xs uppercase tracking-widest font-semibold transition-colors flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Transmettre ma demande</span>
                </button>
              </form>
            )}
          </div>

          {/* Right Direct Concierge Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#11100E] text-white p-8 border border-[#332A20] space-y-4">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#C6A15B] font-semibold block">
                Service Immédiat
              </span>
              <h3 className="font-serif text-2xl">Ligne Concierge Dédiée</h3>
              <p className="text-xs text-[#EDE3D2]/80 leading-relaxed font-light">
                Pour toute demande urgente ou assistance lors de la commande en ligne, joignez directement notre majordome horloger.
              </p>
              <div className="pt-2 space-y-2 text-xs">
                <p className="flex items-center gap-2 text-[#C6A15B] font-mono text-sm font-semibold">
                  <Phone className="w-4 h-4" />
                  <span>+225 07 48 92 10 01</span>
                </p>
                <p className="flex items-center gap-2 text-[#8A8780]">
                  <MessageSquare className="w-4 h-4" />
                  <span>Disponible sur WhatsApp Business Privé</span>
                </p>
              </div>
            </div>

            <div className="bg-white p-8 border border-[#EDE3D2] space-y-3 text-xs text-[#8A8780]">
              <h4 className="text-sm font-serif text-[#11100E] uppercase tracking-wider font-semibold">
                Atelier de Service & Restauration
              </h4>
              <p className="leading-relaxed">
                Tous les garde-temps de la Maison bénéficient d'un service après-vente permanent : révision du rouage, étanchéité, lubrification fine et polissage des boîtiers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
