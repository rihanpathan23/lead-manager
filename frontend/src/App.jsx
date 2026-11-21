import { useState, useEffect, useCallback } from 'react';
import { AlertCircle, RefreshCw, CheckCircle2 } from 'lucide-react';
import Navbar from './components/Navbar';
import StatsCards from './components/StatsCards';
import FilterBar from './components/FilterBar';
import LeadTable from './components/LeadTable';
import LeadFormModal from './components/LeadFormModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import { PageLoader } from './components/Loader';
import {
  fetchLeads,
  fetchLeadStats,
  createLead,
  updateLead,
  deleteLead,
} from './api/leadApi';

export default function App() {
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    New: 0,
    Contacted: 0,
    Qualified: 0,
    Lost: 0,
  });

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('createdAt');
  const [order, setOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 8,
    totalPages: 1,
  });

  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState('');
  const [apiError, setApiError] = useState('');
  const [toast, setToast] = useState('');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [leadToDelete, setLeadToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [updatingStatusId, setUpdatingStatusId] = useState(null);

  // Debounce search input by 300ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Auto-hide toast notifications
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(''), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  const loadData = useCallback(
    async ({ silent = false } = {}) => {
      if (!silent) setLoading(true);
      setApiError('');

      try {
        const [leadsRes, statsRes] = await Promise.all([
          fetchLeads({
            search: debouncedSearch,
            status: statusFilter,
            sortBy,
            order,
            page,
            limit: 8,
          }),
          fetchLeadStats(),
        ]);

        setLeads(leadsRes.data || []);
        setPagination(
          leadsRes.pagination || { total: 0, page: 1, limit: 8, totalPages: 1 }
        );
        setStats(statsRes.data || {});
      } catch (err) {
        setApiError(
          err.response?.data?.message ||
            'Unable to connect to the server. Please make sure the backend API is running.'
        );
      } finally {
        if (!silent) setLoading(false);
        setInitialLoading(false);
      }
    },
    [debouncedSearch, statusFilter, sortBy, order, page]
  );

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleOpenAddModal = () => {
    setEditingLead(null);
    setIsFormOpen(true);
  };

  const handleOpenEditModal = (lead) => {
    setEditingLead(lead);
    setIsFormOpen(true);
  };

  const handleSaveLead = async (formData) => {
    const isEditing = Boolean(editingLead);
    setActionLoading(isEditing ? 'Updating lead...' : 'Adding new lead...');

    try {
      if (isEditing) {
        await updateLead(editingLead._id, formData);
      } else {
        await createLead(formData);
      }

      setIsFormOpen(false);
      setEditingLead(null);
      setActionLoading('Refreshing leads...');
      await loadData({ silent: true });
      setToast(
        isEditing ? 'Lead updated successfully' : 'Lead added successfully'
      );
    } finally {
      setActionLoading('');
    }
  };

  const handleQuickStatusChange = async (id, newStatus) => {
    setUpdatingStatusId(id);
    setActionLoading(`Updating status to ${newStatus}...`);
    setApiError('');

    try {
      await updateLead(id, { status: newStatus });
      await loadData({ silent: true });
      setToast(`Status updated to ${newStatus}`);
    } catch (err) {
      setApiError(
        err.response?.data?.message || 'Failed to update lead status.'
      );
    } finally {
      setUpdatingStatusId(null);
      setActionLoading('');
    }
  };

  const handleConfirmDelete = async (id) => {
    setIsDeleting(true);
    setActionLoading('Deleting lead...');
    setApiError('');

    try {
      await deleteLead(id);
      setLeadToDelete(null);
      if (leads.length === 1 && page > 1) {
        setPage((prev) => prev - 1);
      } else {
        await loadData({ silent: true });
      }
      setToast('Lead deleted successfully');
    } catch (err) {
      setApiError(err.response?.data?.message || 'Failed to delete lead.');
    } finally {
      setIsDeleting(false);
      setActionLoading('');
    }
  };

  const handleStatusChange = (newStatus) => {
    setStatusFilter(newStatus);
    setPage(1);
  };

  const handleSortChange = (newSortBy, newOrder) => {
    setSortBy(newSortBy);
    setOrder(newOrder);
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearch('');
    setDebouncedSearch('');
    setStatusFilter('All');
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar onOpenAddModal={handleOpenAddModal} />

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        {/* Toast Message */}
        {toast && (
          <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-lg">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>{toast}</span>
          </div>
        )}

        {/* Graceful API Error Banner */}
        {apiError && (
          <div className="flex flex-col items-start justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3.5 text-sm text-rose-800 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="h-5 w-5 shrink-0 text-rose-600" />
              <span>{apiError}</span>
            </div>
            <button
              type="button"
              onClick={() => loadData()}
              className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-rose-700"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Retry
            </button>
          </div>
        )}

        {/* Dashboard Status Counts */}
        <StatsCards
          stats={stats}
          activeStatus={statusFilter}
          onSelectStatus={handleStatusChange}
        />

        {/* Search, Filter & Sort Controls */}
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          status={statusFilter}
          onStatusChange={handleStatusChange}
          sortBy={sortBy}
          order={order}
          onSortChange={handleSortChange}
          onResetFilters={handleResetFilters}
        />

        {/* Leads Data Table / Inline Loader */}
        {loading && !initialLoading ? (
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <PageLoader message="Updating leads..." />
          </div>
        ) : (
          <LeadTable
            leads={leads}
            loading={loading}
            pagination={pagination}
            onPageChange={setPage}
            onEdit={handleOpenEditModal}
            onDelete={setLeadToDelete}
            onQuickStatusChange={handleQuickStatusChange}
            updatingStatusId={updatingStatusId}
          />
        )}
      </main>

      {/* Add / Edit Modal */}
      <LeadFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSaveLead}
        initialData={editingLead}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        lead={leadToDelete}
        isDeleting={isDeleting}
        onCancel={() => setLeadToDelete(null)}
        onConfirm={handleConfirmDelete}
      />

      {/* Full-Screen Glassmorphism Loader (Initial Load & Save/Update/Delete Actions) */}
      {(initialLoading || actionLoading) && (
        <PageLoader
          overlay
          message={actionLoading || 'Loading your sales pipeline...'}
        />
      )}
    </div>
  );
}