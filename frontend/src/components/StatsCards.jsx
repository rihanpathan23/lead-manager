import { Users, Sparkles, PhoneCall, CheckCircle2, XCircle } from 'lucide-react';

const STAT_CONFIG = [
  {
    key: 'total',
    filterValue: 'All',
    label: 'Total Leads',
    icon: Users,
    iconBg: 'bg-slate-100 text-slate-700',
    border: 'border-l-4 border-l-slate-700',
  },
  {
    key: 'New',
    filterValue: 'New',
    label: 'New',
    icon: Sparkles,
    iconBg: 'bg-blue-50 text-blue-600',
    border: 'border-l-4 border-l-blue-600',
  },
  {
    key: 'Contacted',
    filterValue: 'Contacted',
    label: 'Contacted',
    icon: PhoneCall,
    iconBg: 'bg-amber-50 text-amber-600',
    border: 'border-l-4 border-l-amber-500',
  },
  {
    key: 'Qualified',
    filterValue: 'Qualified',
    label: 'Qualified',
    icon: CheckCircle2,
    iconBg: 'bg-emerald-50 text-emerald-600',
    border: 'border-l-4 border-l-emerald-600',
  },
  {
    key: 'Lost',
    filterValue: 'Lost',
    label: 'Lost',
    icon: XCircle,
    iconBg: 'bg-rose-50 text-rose-600',
    border: 'border-l-4 border-l-rose-600',
  },
];

export default function StatsCards({ stats, activeStatus, onSelectStatus }) {
  return (
    <section aria-label="Lead status summary" className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 sm:gap-4">
      {STAT_CONFIG.map(({ key, filterValue, label, icon: Icon, iconBg, border }) => {
        const isActive = activeStatus === filterValue;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onSelectStatus(filterValue)}
            className={`flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 text-left shadow-xs transition hover:shadow-md ${border} ${
              isActive ? 'ring-2 ring-indigo-500/40 bg-indigo-50/20' : ''
            }`}
          >
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                {label}
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {stats?.[key] ?? 0}
              </p>
            </div>
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${iconBg}`}>
              <Icon className="h-5 w-5" />
            </div>
          </button>
        );
      })}
    </section>
  );
}