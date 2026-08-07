import { ShieldAlert, Phone, Mail, Award } from 'lucide-react';

interface DisclaimerProps {
  variant?: 'card' | 'footer';
  className?: string;
}

export function Disclaimer({ variant = 'card', className = '' }: DisclaimerProps) {
  if (variant === 'footer') {
    return (
      <div className={`border-t border-amber-500/30 pt-6 mt-6 max-w-5xl mx-auto px-4 ${className}`}>
        {/* Contact Info Before Educational & Guidance Disclaimer */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs font-bold text-gray-200 mb-6 bg-[#1a233a] p-3 border border-[#d97706]/40 rounded">
          <div className="flex items-center gap-1.5 text-amber-400">
            <Award className="w-4 h-4 text-[#d97706]" />
            <span>Developed for Professionals</span>
          </div>

          <div className="flex items-center gap-1.5 text-white">
            <Phone className="w-3.5 h-3.5 text-[#d97706] shrink-0" />
            <span className="text-amber-300 font-extrabold">Jignesh Dharia:</span>
            <a href="tel:+919821030140" className="hover:text-[#d97706] transition">+91 9821030140</a>
            <span className="text-gray-500">/</span>
            <a href="tel:+919653100285" className="hover:text-[#d97706] transition">9653100285</a>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-white">
            <Mail className="w-3.5 h-3.5 text-[#d97706] shrink-0" />
            <a href="mailto:eklavyavedicnumerology@gmail.com" className="hover:text-[#d97706] transition text-amber-200">
              eklavyavedicnumerology@gmail.com
            </a>
            <span className="text-gray-500">|</span>
            <a href="mailto:jigneshdharia@hotmail.com" className="hover:text-[#d97706] transition text-amber-200">
              jigneshdharia@hotmail.com
            </a>
          </div>
        </div>

        {/* Educational & Guidance Disclaimer */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-2">
            <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Educational & Guidance Disclaimer</span>
          </div>
          <p className="text-[11px] text-gray-300 leading-relaxed max-w-4xl mx-auto">
            This software and all generated reports are strictly for educational, informational, and guidance purposes in Vedic Numerology. This application does not provide medical, financial, legal, or psychological advice. Always consult certified professionals for health diagnosis, financial planning, or legal matters.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-[#fffcf5] border-2 border-[#3d2b1f] p-5 shadow-[4px_4px_0px_#3d2b1f] my-8 ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className="p-2 bg-amber-100 border border-amber-300 rounded text-amber-800 shrink-0 mt-0.5">
          <ShieldAlert className="w-5 h-5 text-[#d97706]" />
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#3d2b1f] font-serif">
              Disclaimer – Educational & Guidance Purpose
            </h4>
            <span className="text-[9px] font-extrabold px-1.5 py-0.5 bg-amber-200 text-amber-900 border border-amber-400 rounded">
              Vedic Numerology
            </span>
          </div>
          <p className="text-xs text-[#3d2b1f]/90 leading-relaxed font-medium">
            This software and all generated readings (including 135-Year Life Grid Timeline, Pratyantardasha, Yogas, and Medical/Career insights) are strictly designed for <strong>educational, research, and personal guidance purposes in Vedic Numerology</strong>.
          </p>
          <p className="text-[11px] text-gray-700 leading-relaxed">
            This platform <strong>does not provide medical or financial advice</strong>. Users are advised to seek professional opinion from qualified doctors for medical concerns and certified financial advisors for investment or business decisions.
          </p>
        </div>
      </div>
    </div>
  );
}
