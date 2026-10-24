import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, Sparkles, Copy, Check, ExternalLink, Tag } from 'lucide-react';
import { Button } from './ui/button';
import { PromoPopupConfig } from '../lib/types';
import { getPromoPopup } from '../lib/mock-api';
import { DEFAULT_PROMO_POPUP } from '../lib/mock-data';

export const PromoModal: React.FC = () => {
  const [config, setConfig] = useState<PromoPopupConfig>(DEFAULT_PROMO_POPUP);
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    getPromoPopup().then((res) => {
      if (res) {
        setConfig(res);
        if (res.enabled) {
          const isDismissed = sessionStorage.getItem('yuzersef_promo_dismissed');
          if (!res.showOncePerSession || !isDismissed) {
            // Small entrance delay for natural appearance after page load
            const timer = setTimeout(() => {
              setIsOpen(true);
            }, 1200);
            return () => clearTimeout(timer);
          }
        }
      }
    });

    const handleUpdated = (e: any) => {
      if (e.detail) {
        setConfig(e.detail);
        if (!e.detail.enabled) {
          setIsOpen(false);
        }
      }
    };

    window.addEventListener('yuzersef-popup-updated', handleUpdated);
    return () => window.removeEventListener('yuzersef-popup-updated', handleUpdated);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    if (config.showOncePerSession) {
      sessionStorage.setItem('yuzersef_promo_dismissed', 'true');
    }
  };

  const handleCopyCode = () => {
    if (!config.couponCode) return;
    navigator.clipboard.writeText(config.couponCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen || !config.enabled) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-300"
      dir="rtl"
    >
      <div
        className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-300"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-3 end-3 z-20 w-8 h-8 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white flex items-center justify-center transition-colors cursor-pointer"
          aria-label="إغلاق النافذة"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Image Header with Badge */}
        {config.imageUrl && (
          <div className="relative h-44 sm:h-48 bg-slate-100 overflow-hidden">
            <img
              src={config.imageUrl}
              alt=""
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/services/service-hoodies.jpg';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent" />

            {config.badge && (
              <span className="absolute bottom-3 start-3 px-3 py-1 rounded-full text-xs font-black bg-[#E3A92F] text-[#073B35] shadow-xs flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{config.badge}</span>
              </span>
            )}
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 text-center space-y-4">
          <div className="space-y-1.5">
            <h3 className="text-xl font-black text-slate-900 leading-snug font-display">
              {config.title}
            </h3>
            {config.subtitle && (
              <p className="text-sm font-bold text-[#065E5A]">{config.subtitle}</p>
            )}
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
            {config.description}
          </p>

          {/* Coupon Code Pill if present */}
          {config.couponCode && (
            <div className="p-3 rounded-2xl bg-teal-50 border border-teal-200 max-w-xs mx-auto space-y-1.5">
              <span className="text-[11px] text-teal-800 font-bold block">
                استخدم كود الخصم التالي عند الطلب:
              </span>
              <button
                type="button"
                onClick={handleCopyCode}
                className="w-full py-2 px-3 rounded-xl bg-white border border-teal-300 font-mono font-black text-sm text-[#065E5A] hover:bg-teal-50 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                title="انقر لنسخ الكود"
              >
                <span>{config.couponCode}</span>
                {copied ? (
                  <span className="text-[10px] text-emerald-700 flex items-center gap-0.5">
                    <Check className="w-3.5 h-3.5" />
                    <span>تم النسخ!</span>
                  </span>
                ) : (
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                )}
              </button>
            </div>
          )}

          {/* Action Button */}
          <div className="pt-2">
            <Link to={config.ctaLink || '/request'} onClick={handleClose}>
              <Button className="w-full bg-[#065E5A] hover:bg-[#012C2B] text-white py-2.5 font-bold text-sm shadow-md transition-all hover:scale-[1.02]">
                <span>{config.ctaText || 'ابدأ طلبك الآن'}</span>
                <span className="rtl:rotate-180">←</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
