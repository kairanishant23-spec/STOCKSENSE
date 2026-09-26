import React from 'react';
import { motion } from 'framer-motion';

export interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  let colors = 'bg-gray-100 text-gray-800 border-gray-200';
  
  const normalizedStatus = status.toLowerCase();

  if (normalizedStatus === 'draft') {
    colors = 'bg-gray-100 text-gray-800 border-gray-200';
  } else if (normalizedStatus === 'waiting' || normalizedStatus === 'pending') {
    colors = 'bg-yellow-100 text-yellow-800 border-yellow-200';
  } else if (normalizedStatus === 'ready' || normalizedStatus === 'in_progress') {
    colors = 'bg-blue-100 text-blue-800 border-blue-200';
  } else if (normalizedStatus === 'done' || normalizedStatus === 'completed') {
    colors = 'bg-green-100 text-green-800 border-green-200';
  } else if (normalizedStatus === 'canceled' || normalizedStatus === 'cancelled') {
    colors = 'bg-red-100 text-red-800 border-red-200';
  }

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';

  return (
    <motion.span
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`inline-flex items-center rounded-full font-medium border ${colors} ${sizeClasses}`}
    >
      {status}
    </motion.span>
  );
};
