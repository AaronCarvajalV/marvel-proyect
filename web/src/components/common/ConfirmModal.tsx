import React from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName?: string;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  itemName = 'STARK_NODE_7X' 
}) => {
  if (!isOpen) return null;

  return (
    <>
      <style>
        {`
          .glow-amber {
              box-shadow: 0 0 12px rgba(255, 178, 41, 0.4);
          }
          .scan-line-amber {
              background: linear-gradient(90deg, transparent, rgba(255, 178, 41, 0.8), transparent);
          }
        `}
      </style>

      {/* Overlay backdrop */}
      <div 
        className="fixed inset-0 bg-[#0e0e10]/80 backdrop-blur-xl z-40 transition-opacity"
        onClick={onClose}
      ></div>
      
      {/* Confirmation Dialog Container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <main className="relative w-full max-w-md bg-surface-charcoal border border-outline-variant shadow-[0_0_30px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden pointer-events-auto">
          
          {/* Header / Scan Line */}
          <div className="h-1 w-full scan-line-amber"></div>
          
          <div className="p-6 md:p-8 flex flex-col items-center text-center">
            {/* Icon */}
            <div className="w-16 h-16 rounded-full border border-tertiary-container/30 bg-tertiary-container/10 flex items-center justify-center mb-6 glow-amber">
              <span className="material-symbols-outlined text-tertiary-container" style={{fontSize: "32px", fontVariationSettings: "'FILL' 1"}}>
                warning
              </span>
            </div>
            
            {/* Content */}
            <h1 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-on-surface mb-2 tracking-tight">
              CONFIRM_TERMINATION
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-4 max-w-sm">
              Are you sure you want to remove <span className="font-data-mono text-data-mono text-tertiary-container border-b border-tertiary-container/50">{itemName}</span>?
            </p>
            <div className="font-label-caps text-label-caps text-error bg-error/10 px-3 py-1.5 border border-error/20 mb-8 flex items-center gap-2">
              <span className="material-symbols-outlined" style={{fontSize: "14px"}}>bolt</span>
              Action permanent
            </div>
            
            {/* Metadata footer inside dialog */}
            <div className="w-full font-metadata text-metadata text-outline text-left mb-6 flex justify-between border-t border-outline-variant/50 pt-4">
              <span>REQ_ID: 0x9A4B.F21</span>
              <span>AUTH_LEVEL: OMEGA</span>
            </div>
            
            {/* Actions */}
            <div className="flex flex-col sm:flex-row w-full gap-4">
              <button 
                onClick={onClose}
                className="flex-1 font-label-caps text-label-caps text-primary border border-primary/50 hover:bg-primary/5 hover:border-primary transition-colors py-3 px-4 flex items-center justify-center gap-2 group focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer" 
                type="button"
              >
                <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform" style={{fontSize: "16px"}}>close</span>
                CANCEL
              </button>
              <button 
                onClick={onConfirm}
                className="flex-1 font-label-caps text-label-caps bg-tertiary-container text-on-tertiary-container hover:bg-tertiary transition-colors py-3 px-4 flex items-center justify-center gap-2 glow-amber active:scale-95 focus:outline-none focus:ring-2 focus:ring-tertiary-container cursor-pointer" 
                type="button"
              >
                PERMANENTLY_TERMINATE
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform" style={{fontSize: "16px", fontVariationSettings: "'FILL' 1"}}>delete_forever</span>
              </button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};
