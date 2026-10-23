import React from 'react';
import { Calendar, CheckCircle2, FlaskConical, Cpu, FileCheck } from 'lucide-react';

const statusConfig = {
  'Booked': {
    label: 'Booked',
    bg: 'bg-blue-50 text-blue-700 border-blue-200',
    dotBg: 'bg-blue-500',
    icon: Calendar
  },
  'Confirmed': {
    label: 'Confirmed',
    bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    dotBg: 'bg-indigo-500',
    icon: CheckCircle2
  },
  'Sample Collected': {
    label: 'Sample Collected',
    bg: 'bg-amber-50 text-amber-700 border-amber-200',
    dotBg: 'bg-amber-500',
    icon: FlaskConical
  },
  'Processing': {
    label: 'Processing',
    bg: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    dotBg: 'bg-cyan-500',
    icon: Cpu
  },
  'Report Ready': {
    label: 'Report Ready',
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dotBg: 'bg-emerald-500',
    icon: FileCheck
  }
};

const StatusBadge = ({ status, showIcon = true, size = 'md' }) => {
  const config = statusConfig[status] || {
    label: status || 'Unknown',
    bg: 'bg-slate-100 text-slate-700 border-slate-200',
    dotBg: 'bg-slate-400',
    icon: Calendar
  };

  const IconComponent = config.icon;
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${config.bg} ${sizeClasses} transition-all`}
    >
      <span className={`w-2 h-2 rounded-full mr-1.5 ${config.dotBg} animate-pulse`}></span>
      {showIcon && <IconComponent className="w-3.5 h-3.5 mr-1" />}
      {config.label}
    </span>
  );
};

export default StatusBadge;
