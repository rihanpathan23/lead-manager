import {
  Pencil,
  Trash2,
  Mail,
  Phone,
  Building2,
  ChevronLeft,
  ChevronRight,
  Inbox,
} from 'lucide-react';
import { LEAD_STATUSES, STATUS_STYLES } from '../constants/leadOptions';

export default function LeadTable({
  leads,
  loading,
  pagination,
  onPageChange,
  onEdit,
  onDelete,
  onQuickStatusChange,
  updatingStatusId,
}) {
  if (loading) {
    return (
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
        <div className="divide-y divide-slate-100 p-6">
          {[...Array(5)].map((_, idx) => (
            <div key={idx} className="flex items-center justify-between py-4 animate-pulse">
              <div className="space-y-2">
                <div className="h-4 w-40 rounded bg-slate-200" />
                <div className="h-3 w-56 rounded bg-slate-100" />
              </div>
              <div className="h-6 w-24 rounded-full bg-slate-200" />
              <div className="h-8 w-20 rounded bg-slate-100" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!leads.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
          <Inbox className="h-6 w-6" />
        </div>
        <h3 className="mt-4 text-base font-semibold text-slate-900">
          No leads found
        </h3>
        <p className="mt-1 max-w-sm text-sm text-slate-500">
          Try adjusting your search or status filter, or click &ldquo;Add Lead&rdquo; to
          capture your first sales lead.
        </p>
      </div>
    );
  }

  const { page, totalPages, total, limit } = pagination;
  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-5 py-3.5">Lead</th>
              <th className="px-5 py-3.5">Contact</th>
              <th className="px-5 py-3.5">Company</th>
              <th className="px-5 py-3.5">Source</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 bg-white">
            {leads.map((lead) => {
              const style = STATUS_STYLES[lead.status] || STATUS_STYLES.New;
              const isUpdating = updatingStatusId === lead._id;

              return (
                <tr
                  key={lead._id}
                  className="transition hover:bg-slate-50/80"
                >
                  <td className="whitespace-nowrap px-5 py-4">
                    <div className="font-semibold text-slate-900">
                      {lead.name}
                    </div>
                    <div className="text-xs text-slate-400">
                      Added{' '}
                      {new Date(lead.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-5 py-4">
                    <div className="flex items-center gap-1.5 text-slate-700">
                      <Mail className="h-3.5 w-3.5 text-slate-400" />
                      <span>{lead.email}</span>
                    </div>
                    <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                      <Phone className="h-3.5 w-3.5 text-slate-400" />
                      <span>{lead.phone}</span>
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-5 py-4">
                    <div className="flex items-center gap-1.5 font-medium text-slate-800">
                      <Building2 className="h-4 w-4 text-slate-400" />
                      <span>{lead.company}</span>
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-5 py-4">
                    <span className="inline-flex rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                      {lead.source}
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-5 py-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${style.badge}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
                        {lead.status}
                      </span>

                      <select
                        value={lead.status}
                        disabled={isUpdating}
                        onChange={(e) =>
                          onQuickStatusChange(lead._id, e.target.value)
                        }
                        aria-label={`Change status for ${lead.name}`}
                        className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-600 focus:border-indigo-500 focus:outline-none disabled:opacity-50"
                      >
                        {LEAD_STATUSES.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onEdit(lead)}
                        title="Edit lead"
                        className="rounded-lg p-2 text-slate-500 transition hover:bg-indigo-50 hover:text-indigo-600"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(lead)}
                        title="Delete lead"
                        className="rounded-lg p-2 text-slate-500 transition hover:bg-rose-50 hover:text-rose-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-200 bg-slate-50/60 px-5 py-3.5 sm:flex-row">
        <p className="text-xs text-slate-600">
          Showing <span className="font-semibold text-slate-900">{startItem}</span>{' '}
          to <span className="font-semibold text-slate-900">{endItem}</span> of{' '}
          <span className="font-semibold text-slate-900">{total}</span> leads
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>

          <span className="px-2 text-xs font-medium text-slate-700">
            Page {page} of {totalPages}
          </span>

          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}