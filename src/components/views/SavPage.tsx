import React, { useState } from 'react';
import { ShieldCheck, Wrench, Search, Clock, Award, FileCheck, CheckCircle, AlertCircle, Phone, ArrowRight } from 'lucide-react';
import { api } from '../../services/api';
import { SavTicket } from '../../types';

export const SavPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'request' | 'track'>('request');

  // Form State
  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    phone: '',
    watchModel: '',
    watchReference: '',
    serialNumber: '',
    requestType: 'Garantie' as SavTicket['requestType'],
    description: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [createdTicket, setCreatedTicket] = useState<SavTicket | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Tracking State
  const [trackNumber, setTrackNumber] = useState('');
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackedTicket, setTrackedTicket] = useState<SavTicket | null>(null);
  const [trackError, setTrackError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSubmitting(true);
    try {
      const res = await api.sav.createTicket(formData);
      setCreatedTicket(res.ticket);
    } catch (err: any) {
      setErrorMessage(err.message || 'Une erreur est survenue lors de l’envoi de votre demande.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackNumber.trim()) return;
    setTrackError(null);
    setTrackingLoading(true);
    try {
      const ticket = await api.sav.track(trackNumber.trim());
      setTrackedTicket(ticket);
    } catch (err: any) {
      setTrackedTicket(null);
      setTrackError(err.message || 'Dossier introuvable.');
    } finally {
      setTrackingLoading(false);
    }
  };

  return (
    <div className="bg-[#FAF8F3] min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs uppercase tracking-[0.3em] text-[#C6A15B] font-semibold block">
            Atelier des Complications & Restauration
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl text-[#11100E] tracking-wide uppercase">
            Service Après-Vente & Garantie
          </h1>
          <p className="font-serif italic text-lg sm:text-xl text-[#332A20]">
            « Préserver l’intégrité et la précision chronométrique de votre garde-temps à travers les siècles. »
          </p>
          <div className="w-20 h-[1.5px] bg-[#C6A15B] mx-auto" />
        </div>

        {/* 4 Pillars of Warranty & Maintenance */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          <div className="bg-white p-6 border border-[#EDE3D2] space-y-3">
            <Award className="w-8 h-8 text-[#C6A15B]" />
            <h3 className="font-serif text-lg text-[#11100E]">Garantie 5 Ans</h3>
            <p className="text-xs text-[#8A8780] leading-relaxed font-light">
              Couverture intégrale contre tout vice de fabrication sur tous les calibres assemblés dans nos ateliers.
            </p>
          </div>

          <div className="bg-white p-6 border border-[#EDE3D2] space-y-3">
            <Wrench className="w-8 h-8 text-[#C6A15B]" />
            <h3 className="font-serif text-lg text-[#11100E]">Entretien Complet</h3>
            <p className="text-xs text-[#8A8780] leading-relaxed font-light">
              Démontage intégral, nettoyage ultrasonique, lubrification de haute précision et réglage 5 positions.
            </p>
          </div>

          <div className="bg-white p-6 border border-[#EDE3D2] space-y-3">
            <FileCheck className="w-8 h-8 text-[#C6A15B]" />
            <h3 className="font-serif text-lg text-[#11100E]">Authentification</h3>
            <p className="text-xs text-[#8A8780] leading-relaxed font-light">
              Délivrance de certificat d’authenticité et inscription au grand livre des registres de la Maison.
            </p>
          </div>

          <div className="bg-white p-6 border border-[#EDE3D2] space-y-3">
            <Clock className="w-8 h-8 text-[#C6A15B]" />
            <h3 className="font-serif text-lg text-[#11100E]">Contrôle d'Étanchéité</h3>
            <p className="text-xs text-[#8A8780] leading-relaxed font-light">
              Test sous pression sèche et humide, remplacement systématique des joints de glace et de fond.
            </p>
          </div>
        </div>

        {/* Tabs Switcher */}
        <div className="flex justify-center border-b border-[#EDE3D2] mb-12">
          <button
            onClick={() => setActiveTab('request')}
            className={`pb-4 px-8 text-xs uppercase tracking-[0.2em] font-semibold transition-colors relative ${
              activeTab === 'request'
                ? 'text-[#11100E] border-b-2 border-[#C6A15B]'
                : 'text-[#8A8780] hover:text-[#11100E]'
            }`}
          >
            Ouvrir une Demande d'Intervention
          </button>
          <button
            onClick={() => setActiveTab('track')}
            className={`pb-4 px-8 text-xs uppercase tracking-[0.2em] font-semibold transition-colors relative ${
              activeTab === 'track'
                ? 'text-[#11100E] border-b-2 border-[#C6A15B]'
                : 'text-[#8A8780] hover:text-[#11100E]'
            }`}
          >
            Suivre un Dossier SAV
          </button>
        </div>

        {/* Tab 1: Request Form */}
        {activeTab === 'request' && (
          <div className="max-w-4xl mx-auto bg-white border border-[#EDE3D2] shadow-sm p-8 sm:p-12">
            {createdTicket ? (
              <div className="p-8 bg-[#FAF8F3] border border-[#C6A15B]/40 text-center space-y-4">
                <CheckCircle className="w-16 h-16 text-[#C6A15B] mx-auto" />
                <span className="text-xs uppercase tracking-widest text-[#C6A15B] font-semibold block">
                  Dossier Enregistré
                </span>
                <h3 className="font-serif text-3xl text-[#11100E]">
                  N° de Dossier : {createdTicket.ticketNumber}
                </h3>
                <p className="text-xs text-[#8A8780] max-w-md mx-auto leading-relaxed">
                  Votre demande concernant le modèle <strong>{createdTicket.watchModel}</strong> a bien été transmise à notre chef d’atelier. Un accusé de réception a été envoyé à l'adresse <strong>{createdTicket.email}</strong>.
                </p>
                <div className="pt-4 flex justify-center gap-4">
                  <button
                    onClick={() => {
                      setCreatedTicket(null);
                      setFormData({
                        customerName: '',
                        email: '',
                        phone: '',
                        watchModel: '',
                        watchReference: '',
                        serialNumber: '',
                        requestType: 'Garantie',
                        description: '',
                      });
                    }}
                    className="px-6 py-2.5 bg-[#11100E] text-white text-xs uppercase tracking-widest font-semibold hover:bg-[#C6A15B] transition-colors"
                  >
                    Nouvelle demande
                  </button>
                  <button
                    onClick={() => {
                      setTrackNumber(createdTicket.ticketNumber);
                      setActiveTab('track');
                    }}
                    className="px-6 py-2.5 border border-[#11100E] text-[#11100E] text-xs uppercase tracking-widest font-semibold hover:bg-[#11100E] hover:text-white transition-colors"
                  >
                    Suivre en direct
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 text-xs">
                {errorMessage && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block uppercase tracking-wider text-[#8A8780] font-semibold mb-1.5">
                      Nom et Titre du Propriétaire *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      placeholder="M. Alexandre de Montmirail"
                      className="w-full bg-[#FAF8F3] border border-[#EDE3D2] px-3.5 py-2.5 text-xs text-[#11100E] focus:outline-none focus:border-[#C6A15B]"
                    />
                  </div>
                  <div>
                    <label className="block uppercase tracking-wider text-[#8A8780] font-semibold mb-1.5">
                      Email de contact *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="alexandre@prestige.com"
                      className="w-full bg-[#FAF8F3] border border-[#EDE3D2] px-3.5 py-2.5 text-xs text-[#11100E] focus:outline-none focus:border-[#C6A15B]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block uppercase tracking-wider text-[#8A8780] font-semibold mb-1.5">
                      Téléphone portable *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+225 07 48 92 10 01"
                      className="w-full bg-[#FAF8F3] border border-[#EDE3D2] px-3.5 py-2.5 text-xs text-[#11100E] focus:outline-none focus:border-[#C6A15B]"
                    />
                  </div>
                  <div>
                    <label className="block uppercase tracking-wider text-[#8A8780] font-semibold mb-1.5">
                      Objet de l'intervention *
                    </label>
                    <select
                      value={formData.requestType}
                      onChange={(e) => setFormData({ ...formData, requestType: e.target.value as any })}
                      className="w-full bg-[#FAF8F3] border border-[#EDE3D2] px-3.5 py-2.5 text-xs text-[#11100E] focus:outline-none focus:border-[#C6A15B]"
                    >
                      <option value="Garantie">Garantie Manufacture (Réparation sous garantie)</option>
                      <option value="Entretien">Entretien & Révision Métrologique</option>
                      <option value="Réparation">Réparation / Remplacement de composants</option>
                      <option value="Authentification">Authentification & Certificat officiel</option>
                      <option value="Information">Question technique / Documentation</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div>
                    <label className="block uppercase tracking-wider text-[#8A8780] font-semibold mb-1.5">
                      Modèle de la montre *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.watchModel}
                      onChange={(e) => setFormData({ ...formData, watchModel: e.target.value })}
                      placeholder="Ex: Nicaise.a Automatic Prestige"
                      className="w-full bg-[#FAF8F3] border border-[#EDE3D2] px-3.5 py-2.5 text-xs text-[#11100E] focus:outline-none focus:border-[#C6A15B]"
                    />
                  </div>
                  <div>
                    <label className="block uppercase tracking-wider text-[#8A8780] font-semibold mb-1.5">
                      Numéro de référence (sur fond de boîte)
                    </label>
                    <input
                      type="text"
                      value={formData.watchReference}
                      onChange={(e) => setFormData({ ...formData, watchReference: e.target.value })}
                      placeholder="Ex: REF-NC-AUT-01"
                      className="w-full bg-[#FAF8F3] border border-[#EDE3D2] px-3.5 py-2.5 text-xs text-[#11100E] focus:outline-none focus:border-[#C6A15B]"
                    />
                  </div>
                  <div>
                    <label className="block uppercase tracking-wider text-[#8A8780] font-semibold mb-1.5">
                      Numéro de série gravé
                    </label>
                    <input
                      type="text"
                      value={formData.serialNumber}
                      onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                      placeholder="Ex: SN-NCA-9841"
                      className="w-full bg-[#FAF8F3] border border-[#EDE3D2] px-3.5 py-2.5 text-xs text-[#11100E] focus:outline-none focus:border-[#C6A15B]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-[#8A8780] font-semibold mb-1.5">
                    Description détaillée du besoin ou symptôme constaté *
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Précisez tout comportement inhabituel (ex: avance ou retard anormal, frottement du remontoir, besoin de polissage après micro-rayures...)"
                    className="w-full bg-[#FAF8F3] border border-[#EDE3D2] px-3.5 py-2.5 text-xs text-[#11100E] focus:outline-none focus:border-[#C6A15B]"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-8 py-3.5 bg-[#11100E] hover:bg-[#C6A15B] text-white text-xs uppercase tracking-widest font-semibold transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    <span>{submitting ? 'Envoi en cours...' : 'Ouvrir le dossier SAV'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Tab 2: Track Ticket */}
        {activeTab === 'track' && (
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="bg-white border border-[#EDE3D2] p-8">
              <h3 className="font-serif text-2xl text-[#11100E] mb-2">
                Rechercher un dossier en atelier
              </h3>
              <p className="text-xs text-[#8A8780] mb-6">
                Saisissez le numéro de dossier attribué lors de l'enregistrement de votre demande (ex : SAV-2026-0001).
              </p>

              <form onSubmit={handleTrack} className="flex gap-3">
                <input
                  type="text"
                  required
                  value={trackNumber}
                  onChange={(e) => setTrackNumber(e.target.value)}
                  placeholder="Ex : SAV-2026-0001"
                  className="flex-1 bg-[#FAF8F3] border border-[#EDE3D2] px-4 py-3 text-xs uppercase tracking-wider text-[#11100E] focus:outline-none focus:border-[#C6A15B]"
                />
                <button
                  type="submit"
                  disabled={trackingLoading}
                  className="px-6 py-3 bg-[#11100E] hover:bg-[#C6A15B] text-white text-xs uppercase tracking-widest font-semibold transition-colors flex items-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  <span>{trackingLoading ? 'Recherche...' : 'Consulter'}</span>
                </button>
              </form>

              {trackError && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{trackError}</span>
                </div>
              )}
            </div>

            {trackedTicket && (
              <div className="bg-white border border-[#C6A15B]/50 p-8 space-y-6">
                <div className="flex justify-between items-start border-b border-[#EDE3D2] pb-4">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-[#C6A15B] font-semibold block">
                      Dossier d'Atelier
                    </span>
                    <h4 className="font-serif text-2xl text-[#11100E]">
                      {trackedTicket.ticketNumber}
                    </h4>
                    <p className="text-xs text-[#8A8780]">
                      Inscrit le {new Date(trackedTicket.createdAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-[#11100E] text-[#C6A15B] text-xs uppercase tracking-wider font-semibold">
                    {trackedTicket.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[#8A8780] block">Modèle :</span>
                    <strong className="text-[#11100E]">{trackedTicket.watchModel}</strong>
                  </div>
                  <div>
                    <span className="text-[#8A8780] block">Type d'intervention :</span>
                    <strong className="text-[#11100E]">{trackedTicket.requestType}</strong>
                  </div>
                  <div>
                    <span className="text-[#8A8780] block">Référence :</span>
                    <strong className="text-[#11100E]">{trackedTicket.watchReference}</strong>
                  </div>
                  <div>
                    <span className="text-[#8A8780] block">Numéro de série :</span>
                    <strong className="text-[#11100E]">{trackedTicket.serialNumber || 'Non renseigné'}</strong>
                  </div>
                </div>

                <div className="p-4 bg-[#FAF8F3] border border-[#EDE3D2] text-xs space-y-1">
                  <span className="text-[#8A8780] uppercase tracking-wider font-semibold text-[10px]">
                    Observations de l'Atelier :
                  </span>
                  <p className="text-[#332A20] leading-relaxed">
                    {trackedTicket.notes || 'Votre garde-temps est pris en charge selon les normes de haute horlogerie. Nos maîtres horlogers procèdent aux contrôles requis.'}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
