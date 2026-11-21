export const LEAD_SOURCES = [
  'Website',
  'Referral',
  'LinkedIn',
  'Cold Call',
  'Advertisement',
  'Other',
];

export const LEAD_STATUSES = ['New', 'Contacted', 'Qualified', 'Lost'];

export const STATUS_STYLES = {
  New: {
    badge: 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20',
    dot: 'bg-blue-600',
    cardAccent: 'border-l-4 border-l-blue-600',
  },
  Contacted: {
    badge: 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20',
    dot: 'bg-amber-500',
    cardAccent: 'border-l-4 border-l-amber-500',
  },
  Qualified: {
    badge: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20',
    dot: 'bg-emerald-600',
    cardAccent: 'border-l-4 border-l-emerald-600',
  },
  Lost: {
    badge: 'bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/20',
    dot: 'bg-rose-600',
    cardAccent: 'border-l-4 border-l-rose-600',
  },
};