import React from 'react';
import { ArrowRight, Award, Compass, ShieldCheck, Sparkles, Clock } from 'lucide-react';
import { ATELIER_IMAGE, HERO_IMAGE } from '../../data/products';

interface AboutPageProps {
  onNavigateToCatalog: () => void;
  onNavigateToContact: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({
  onNavigateToCatalog,
  onNavigateToContact,
}) => {
  return (
    <div className="bg-[#FAF8F3] min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <span className="text-xs uppercase tracking-[0.3em] text-[#C6A15B] font-semibold block">
            Maison Fondée en 1952
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl text-[#11100E] tracking-wide uppercase">
            La Maison NICAISE.A
          </h1>
          <p className="font-serif italic text-xl sm:text-2xl text-[#C6A15B]">
            « Le temps devient une signature. »
          </p>
          <div className="w-20 h-[1.5px] bg-[#C6A15B] mx-auto" />
          <p className="text-sm sm:text-base text-[#8A8780] font-light leading-relaxed max-w-2xl mx-auto">
            Plus qu'une manufacture, un sanctuaire de la haute horlogerie où chaque seconde est façonnée à la main pour traverser les générations.
          </p>
        </div>

        {/* Hero Atelier Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24">
          <div className="lg:col-span-6 relative">
            <div className="p-3 bg-white border border-[#EDE3D2] shadow-2xl">
              <img
                src={ATELIER_IMAGE}
                alt="L'Atelier des Complications Nicaise.a"
                className="w-full h-[500px] object-cover"
              />
              <div className="p-4 bg-[#FAF8F3] border-t border-[#EDE3D2] flex justify-between items-center text-xs">
                <span className="font-serif text-base text-[#11100E]">Atelier Nicaise.a — Genève</span>
                <span className="text-[#C6A15B] font-mono">Calibres Manufacturés</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C6A15B] font-semibold block">
              Notre Philosophie
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#11100E] leading-tight">
              Quand la Mécanique Devient une Œuvre d'Art
            </h2>
            <p className="text-sm text-[#332A20] leading-relaxed font-light">
              Née de la fascination pour la trajectoire céleste des astres et la précision mathématique du balancier-spiral, la Maison <strong>NICAISE.A</strong> cultive un esprit d'indépendance farouche et d'intransigeance qualitative.
            </p>
            <p className="text-sm text-[#8A8780] leading-relaxed font-light">
              Dans nos ateliers, chaque pont est anglé à la main avec de la moelle de sureau, chaque vis est bleuie au feu à 290°C selon la tradition séculaire, et chaque mouvement est assemblé et réglé par le même maître horloger du premier au dernier composant.
            </p>

            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-[#EDE3D2]">
              <div>
                <span className="font-serif text-3xl text-[#11100E] block font-bold">1000 h</span>
                <span className="text-xs text-[#8A8780] uppercase tracking-wider">
                  De test chronométrique par pièce
                </span>
              </div>
              <div>
                <span className="font-serif text-3xl text-[#C6A15B] block font-bold">100 %</span>
                <span className="text-xs text-[#8A8780] uppercase tracking-wider">
                  Matériaux nobles certifiés
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Pillars of Excellence */}
        <div className="mb-24">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h3 className="font-serif text-3xl text-[#11100E]">Les Quatre Piliers Nicaise.a</h3>
            <p className="text-xs text-[#8A8780] mt-2">
              Les engagements fondamentaux qui guident chacune de nos créations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 border border-[#EDE3D2] space-y-3">
              <Award className="w-8 h-8 text-[#C6A15B]" />
              <h4 className="font-serif text-xl text-[#11100E]">Le Prestige</h4>
              <p className="text-xs text-[#8A8780] leading-relaxed font-light">
                Une aura distinguée et intemporelle reconnue par les collectionneurs les plus avertis à travers le monde.
              </p>
            </div>

            <div className="bg-white p-8 border border-[#EDE3D2] space-y-3">
              <Clock className="w-8 h-8 text-[#C6A15B]" />
              <h4 className="font-serif text-xl text-[#11100E]">La Précision</h4>
              <p className="text-xs text-[#8A8780] leading-relaxed font-light">
                Des calibres haute fréquence et des balanciers à inertie variable garantissant une déviation inférieure à -2/+2 secondes par jour.
              </p>
            </div>

            <div className="bg-white p-8 border border-[#EDE3D2] space-y-3">
              <Sparkles className="w-8 h-8 text-[#C6A15B]" />
              <h4 className="font-serif text-xl text-[#11100E]">Le Savoir-Faire</h4>
              <p className="text-xs text-[#8A8780] leading-relaxed font-light">
                L’héritage vivant des artisans émailleurs, sertisseurs et guillocheurs appliquant des gestes transmis depuis des générations.
              </p>
            </div>

            <div className="bg-white p-8 border border-[#EDE3D2] space-y-3">
              <ShieldCheck className="w-8 h-8 text-[#C6A15B]" />
              <h4 className="font-serif text-xl text-[#11100E]">L'Éternité</h4>
              <p className="text-xs text-[#8A8780] leading-relaxed font-light">
                Un garde-temps Nicaise.a est conçu pour être transmis de père en fils, comme le témoin silencieux des plus grandes victoires.
              </p>
            </div>
          </div>
        </div>

        {/* Call to action */}
        <div className="bg-[#11100E] text-white p-12 text-center max-w-4xl mx-auto space-y-6">
          <span className="text-xs uppercase tracking-[0.3em] text-[#C6A15B] font-semibold block">
            Prenez Part à la Légende
          </span>
          <h3 className="font-serif text-3xl sm:text-4xl">
            Découvrez la Signature qui Vous Ressemble
          </h3>
          <p className="text-xs sm:text-sm text-[#EDE3D2]/80 max-w-md mx-auto">
            Consultez notre collection en ligne ou réservez une entrevue avec un conseiller de la Maison.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
            <button
              onClick={onNavigateToCatalog}
              className="px-8 py-3.5 bg-[#C6A15B] hover:bg-[#D8BE7A] text-[#11100E] text-xs uppercase tracking-widest font-semibold transition-colors"
            >
              Consulter le catalogue
            </button>
            <button
              onClick={onNavigateToContact}
              className="px-8 py-3.5 border border-white/40 hover:border-white text-white text-xs uppercase tracking-widest font-medium transition-colors"
            >
              Contacter un conseiller
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
