import React, { useState, useEffect } from 'react';
import { MessageSquare, X, Send, ShieldCheck, Clock } from 'lucide-react';
import { api } from '../services/api';
import { StoreSettings } from '../types';

export const WhatsappConcierge: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<StoreSettings>({
    whatsappNumber: '+237690000000',
    whatsappDefaultMessage: 'Bonjour, je souhaite échanger avec un conseiller de la Maison Horlogère NICAISE.A.',
    whatsappEnabled: true,
    conciergeEmail: 'concierge@nicaise-a.com',
    conciergePhone: '+237 690 00 00 00',
    currency: 'FCFA',
    securityGuaranteeYears: 5,
    allowCashOnDeliveryDiplomatic: true,
  });
  const [customMessage, setCustomMessage] = useState('');

  useEffect(() => {
    api.settings.get()
      .then((s) => {
        if (s) setSettings(s);
      })
      .catch(() => {});
  }, []);

  if (!settings.whatsappEnabled) return null;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');
    const textToSend = customMessage.trim() || settings.whatsappDefaultMessage;
    const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(textToSend)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-20 sm:bottom-8 right-4 sm:right-8 z-40">
      {/* Floating Concierge Popover */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 sm:w-96 bg-[#11100E] border border-[#C6A15B]/40 shadow-2xl text-[#EDE3D2] p-5 sm:p-6 mb-2 animate-fade-in">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#332A20]">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <div>
                <h4 className="font-serif text-sm tracking-widest uppercase text-white font-medium">
                  Conciergerie Privée
                </h4>
                <span className="text-[10px] text-[#C6A15B] tracking-wider block">
                  Maison NICAISE.A en ligne
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-[#8A8780] hover:text-white p-1"
              aria-label="Fermer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-[#8A8780] font-light leading-relaxed mb-4">
            Un maître horloger ou conseiller privé est à votre entière disposition pour vos réservations, présentations en salon ou demandes sur-mesure.
          </p>

          <form onSubmit={handleSendMessage} className="space-y-3">
            <textarea
              rows={2}
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder={settings.whatsappDefaultMessage}
              className="w-full bg-[#1C1A16] border border-[#332A20] focus:border-[#C6A15B] text-xs text-white p-2.5 outline-none resize-none"
            />

            <button
              type="submit"
              className="w-full py-2.5 bg-[#C6A15B] hover:bg-[#D8BE7A] text-[#11100E] text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <span>Démarrer l'échange WhatsApp</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="pt-3 mt-3 border-t border-[#332A20] flex items-center justify-between text-[10px] text-[#8A8780]">
            <span className="flex items-center gap-1 text-[#C6A15B]">
              <ShieldCheck className="w-3 h-3" />
              Échanges confidentiels
            </span>
            <span>7j/7 • 8h - 22h</span>
          </div>
        </div>
      )}

      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2.5 px-4 py-3 bg-[#11100E] hover:bg-[#C6A15B] border border-[#C6A15B]/50 hover:border-[#C6A15B] text-white hover:text-[#11100E] shadow-2xl transition-all duration-300 rounded-none cursor-pointer"
        title="Conciergerie WhatsApp Nicaise.a"
      >
        <div className="relative">
          <MessageSquare className="w-4 h-4 text-[#C6A15B] group-hover:text-[#11100E] transition-colors" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full" />
        </div>
        <div className="text-left hidden sm:block">
          <span className="text-[10px] uppercase tracking-[0.2em] font-semibold block leading-tight">
            Conciergerie VIP
          </span>
          <span className="text-[9px] text-[#8A8780] group-hover:text-[#11100E]/80 tracking-wider block">
            WhatsApp Direct
          </span>
        </div>
      </button>
    </div>
  );
};
