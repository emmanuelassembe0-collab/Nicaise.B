import React from 'react';
import { ShieldCheck, Package, Award, Clock, ArrowRight } from 'lucide-react';
import { PageView } from '../types';

interface FooterProps {
  onNavigate: (page: PageView) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer id="main-footer" className="bg-[#11100E] text-[#EDE3D2] pt-16 pb-24 lg:pb-16 border-t border-[#332A20]">
      {/* Guarantees Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 border-b border-[#332A20]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex items-start gap-4">
            <Award className="w-6 h-6 text-[#C6A15B] flex-shrink-0 mt-1" />
            <div>
              <h4 className="text-xs uppercase tracking-[0.18em] text-white font-semibold mb-1">
                Authenticité Certifiée
              </h4>
              <p className="text-xs text-[#8A8780] leading-relaxed">
                Chaque garde-temps est accompagné de son certificat manufacture et numéro d’immatriculation unique.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <Package className="w-6 h-6 text-[#C6A15B] flex-shrink-0 mt-1" />
            <div>
              <h4 className="text-xs uppercase tracking-[0.18em] text-white font-semibold mb-1">
                Écrin & Présentation
              </h4>
              <p className="text-xs text-[#8A8780] leading-relaxed">
                Livré dans un coffret précieux en noyer laqué et feutre de laine avec loupe d’horloger gravée.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <ShieldCheck className="w-6 h-6 text-[#C6A15B] flex-shrink-0 mt-1" />
            <div>
              <h4 className="text-xs uppercase tracking-[0.18em] text-white font-semibold mb-1">
                Garantie Manufacture
              </h4>
              <p className="text-xs text-[#8A8780] leading-relaxed">
                Couverture internationale de 24 à 84 mois et prise en charge prioritaire dans nos salons partenaires.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <Clock className="w-6 h-6 text-[#C6A15B] flex-shrink-0 mt-1" />
            <div>
              <h4 className="text-xs uppercase tracking-[0.18em] text-white font-semibold mb-1">
                Conciergerie Privée
              </h4>
              <p className="text-xs text-[#8A8780] leading-relaxed">
                Nos conseillers horlogers vous accompagnent 7j/7 pour des présentations privées sur rendez-vous.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-serif text-3xl tracking-[0.25em] text-white">
              NICAISE.A
            </h3>
            <p className="font-serif italic text-lg text-[#C6A15B]">
              « Le temps devient une signature. »
            </p>
            <p className="text-xs text-[#8A8780] leading-relaxed max-w-md font-light">
              Maison horlogère dédiée aux connaisseurs en quête d’exclusivité, de prestige mécanique et de beauté intemporelle. Conçues pour traverser les époques avec majesté.
            </p>
            <div className="pt-2">
              <span className="text-[10px] tracking-[0.2em] uppercase text-[#C6A15B] block mb-2">
                Rejoindre le Cercle Privé Nicaise.a
              </span>
              <div className="flex max-w-md">
                <input
                  id="footer-email-input"
                  type="email"
                  placeholder="Votre adresse email personnelle"
                  className="bg-[#1C1A16] border border-[#332A20] text-xs text-white px-4 py-3 flex-1 focus:outline-none focus:border-[#C6A15B]"
                />
                <button
                  id="footer-newsletter-btn"
                  type="button"
                  className="bg-[#C6A15B] hover:bg-[#D8BE7A] text-[#11100E] px-4 py-3 text-xs uppercase tracking-wider font-semibold transition-colors flex items-center gap-1"
                >
                  <span>Invitation</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Collections */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-[#C6A15B] font-semibold mb-4">
              Collections
            </h4>
            <ul className="space-y-2.5 text-xs text-[#8A8780]">
              <li>
                <button onClick={() => onNavigate('catalog')} className="hover:text-white transition-colors">
                  Heritage
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('catalog')} className="hover:text-white transition-colors">
                  Prestige
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('catalog')} className="hover:text-white transition-colors">
                  Royal
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('catalog')} className="hover:text-white transition-colors">
                  Ocean Submariner
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('catalog')} className="hover:text-white transition-colors">
                  Sport & Titane
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('limited-editions')} className="hover:text-white transition-colors text-[#D8BE7A]">
                  Private Collection
                </button>
              </li>
            </ul>
          </div>

          {/* Maison */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-[#C6A15B] font-semibold mb-4">
              La Maison
            </h4>
            <ul className="space-y-2.5 text-xs text-[#8A8780]">
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors">
                  L’Art du Temps
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors">
                  Atelier & Savoir-faire
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('new-arrivals')} className="hover:text-white transition-colors">
                  Nouveautés de l’Année
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors">
                  Salons Privés & Rendez-vous
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('sav')} className="hover:text-[#C6A15B] transition-colors">
                  Service Après-Vente & Garantie
                </button>
              </li>
            </ul>
          </div>

          {/* Conciergerie */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-[#C6A15B] font-semibold mb-4">
              Conciergerie
            </h4>
            <ul className="space-y-2.5 text-xs text-[#8A8780]">
              <li className="text-white font-medium">Salon Principal :</li>
              <li>Avenue de la Concorde, Suite 12</li>
              <li>Douala & Yaoundé, Cameroun</li>
              <li className="pt-2 text-white font-medium">Assistance VIP :</li>
              <li>contact@nicaise-a.com</li>
              <li>+237 690 00 00 00</li>
              <li className="text-[#C6A15B]">Disponible sur WhatsApp Business</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-[#332A20]/60 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#8A8780]">
        <p>© 2026 NICAISE.A Haute Horlogerie. Tous droits réservés.</p>
        <div className="flex gap-6 mt-4 sm:mt-0 items-center">
          <span className="hover:text-[#C6A15B] cursor-pointer">Conditions Générales de Vente</span>
          <span className="hover:text-[#C6A15B] cursor-pointer">Protection des Données</span>
          <span className="hover:text-[#C6A15B] cursor-pointer">Mentions Légales</span>
          <button
            onClick={() => onNavigate('admin')}
            className="text-[#8A8780] hover:text-[#C6A15B] uppercase text-[10px] tracking-wider transition-colors border-l border-[#332A20] pl-4"
          >
            Portail Atelier
          </button>
        </div>
      </div>
    </footer>
  );
};
