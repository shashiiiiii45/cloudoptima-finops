import React from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  hover?: boolean;
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  glow = false,
  hover = true,
  onClick
}) => {
  const cardClasses = `
    glass-panel
    rounded-2xl
    p-6
    relative
    overflow-hidden
    ${glow ? 'border-brand-teal/20 shadow-glass-glow' : 'border-white/5 shadow-glass'}
    ${hover ? 'transition-all duration-300 hover:border-brand-teal/30 hover:shadow-glass-glow hover:-translate-y-1' : ''}
    ${onClick ? 'cursor-pointer' : ''}
    ${className}
  `;

  if (hover) {
    return (
      <motion.div
        className={cardClasses}
        onClick={onClick}
        whileHover={{ scale: 1.01 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {glow && (
          <div className="absolute -inset-px bg-gradient-to-r from-brand-teal/20 via-brand-purple/20 to-brand-teal/20 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-500 -z-10 pointer-events-none" />
        )}
        {children}
      </motion.div>
    );
  }

  return (
    <div className={cardClasses} onClick={onClick}>
      {children}
    </div>
  );
};

export default GlassCard;
