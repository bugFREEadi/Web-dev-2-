// SOS Requests Page — full CRUD with filtering, search, modals
// Demonstrates: useState, useCallback, useMemo, controlled components, lists & keys,
// conditional rendering, lifting state up, component composition
import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Filter,
  MapPin,
  Clock,
  Users as UsersIcon,
  Edit3,
  Trash2,
  ChevronDown,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';
import { useData } from '../hooks/useData';
import { useAuth } from '../hooks/useAuth';
import { AlertCircle, BellRing } from 'lucide-react';
import Modal from '../components/common/Modal';
import { formatRelativeTime, capitalize } from '../utils/formatters';
import { REQUEST_CATEGORIES, PRIORITY_LEVELS, REQUEST_STATUSES } from '../utils/constants';

const initialFormState = {
  title: '',
  description: '',
  category: 'rescue',
  priority: 'high',
  location: '',
  contactName: '',
  contactPhone: '',
  peopleAffected: 0,
};

const getStatusColor = (status) => {
  switch (status) {
    case 'resolved': return 'resolved';
    case 'in_progress': return 'info';
    case 'assigned': return 'medium';
    default: return 'pending';
  }
};

export default function RequestsPage() {
  const { user } = useAuth();
  const { requests, addRequest, updateRequest, deleteRequest, volunteers, volunteersMap, acceptRequest, promptVolunteer } = useData();

  // UI State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [formData, setFormData] = useState(initialFormState);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  // Filtered requests (demonstrates useMemo for performance)
  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      const matchesSearch =
        !searchQuery ||
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = filterStatus === 'all' || r.status === filterStatus;
      const matchesPriority = filterPriority === 'all' || r.priority === filterPriority;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [requests, searchQuery, filterStatus, filterPriority]);

  // Count by status for filter chips
  const statusCounts = useMemo(() => {
    const counts = { all: requests.length };
    requests.forEach((r) => {
      counts[r.status] = (counts[r.status] || 0) + 1;
    });
    return counts;
  }, [requests]);

  // Form handlers (demonstrates controlled components)
  const handleFormChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'peopleAffected' ? parseInt(value) || 0 : value,
    }));
  }, []);

  const handleCreate = useCallback(async () => {
    if (!formData.title.trim() || !formData.location.trim()) return;
    await addRequest(formData);
    setFormData(initialFormState);
    setShowCreateModal(false);
  }, [formData, addRequest]);

  const handleEditClick = useCallback((request) => {
    setSelectedRequest(request);
    setFormData({
      title: request.title,
      description: request.description,
      category: request.category,
      priority: request.priority,
      location: request.location,
      contactName: request.contactName || '',
      contactPhone: request.contactPhone || '',
      peopleAffected: request.peopleAffected || 0,
    });
    setShowEditModal(true);
  }, []);

  const handleUpdate = useCallback(async () => {
    if (!selectedRequest) return;
    await updateRequest(selectedRequest.id, formData);
    setShowEditModal(false);
    setSelectedRequest(null);
    setFormData(initialFormState);
  }, [selectedRequest, formData, updateRequest]);

  const handleStatusChange = useCallback(
    async (id, newStatus) => {
      await updateRequest(id, { status: newStatus });
    },
    [updateRequest]
  );

  const handleAssign = useCallback(
    async (requestId, volunteerId) => {
      await updateRequest(requestId, {
        assignedTo: volunteerId,
        status: 'assigned',
      });
    },
    [updateRequest]
  );

  const handleAccept = useCallback(async (requestId) => {
    await acceptRequest(requestId, user.uid);
  }, [acceptRequest, user]);

  const handlePrompt = useCallback(async (requestId) => {
    await promptVolunteer(requestId);
  }, [promptVolunteer]);

  const getVolunteerName = useCallback((id) => {
    return volunteersMap[id]?.name || 'Unknown Volunteer';
  }, [volunteersMap]);

  const handleDeleteClick = useCallback((request) => {
    setSelectedRequest(request);
    setShowDeleteConfirm(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!selectedRequest) return;
    await deleteRequest(selectedRequest.id);
    setShowDeleteConfirm(false);
    setSelectedRequest(null);
  }, [selectedRequest, deleteRequest]);

  const openCreateModal = useCallback(() => {
    setFormData(initialFormState);
    setShowCreateModal(true);
  }, []);

  const availableVolunteers = useMemo(
    () => volunteers.filter((v) => v.available),
    [volunteers]
  );

  // Shared form fields component (demonstrates component composition / reuse)
  const renderFormFields = () => (
    <>
      <div className="input-group">
        <label className="input-label">Title *</label>
        <input
          type="text"
          name="title"
          className="input"
          placeholder="Brief description of the emergency"
          value={formData.title}
          onChange={handleFormChange}
          required
        />
      </div>

      <div className="input-group">
        <label className="input-label">Description</label>
        <textarea
          name="description"
          className="textarea"
          placeholder="Detailed description of the situation, specific needs, etc."
          value={formData.description}
          onChange={handleFormChange}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div className="input-group">
          <label className="input-label">Category</label>
          <select name="category" className="select" value={formData.category} onChange={handleFormChange}>
            {REQUEST_CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>
        <div className="input-group">
          <label className="input-label">Priority</label>
          <select name="priority" className="select" value={formData.priority} onChange={handleFormChange}>
            {PRIORITY_LEVELS.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="input-group">
        <label className="input-label">Location *</label>
        <input
          type="text"
          name="location"
          className="input"
          placeholder="Address or landmark"
          value={formData.location}
          onChange={handleFormChange}
          required
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div className="input-group">
          <label className="input-label">Contact Name</label>
          <input
            type="text"
            name="contactName"
            className="input"
            placeholder="Name"
            value={formData.contactName}
            onChange={handleFormChange}
          />
        </div>
        <div className="input-group">
          <label className="input-label">Contact Phone</label>
          <input
            type="tel"
            name="contactPhone"
            className="input"
            placeholder="+91-XXXXX-XXXXX"
            value={formData.contactPhone}
            onChange={handleFormChange}
          />
        </div>
      </div>

      <div className="input-group">
        <label className="input-label">People Affected</label>
        <input
          type="number"
          name="peopleAffected"
          className="input"
          placeholder="0"
          min="0"
          value={formData.peopleAffected}
          onChange={handleFormChange}
        />
      </div>
    </>
  );

  return (
    <div className="page-container">
      {/* Header */}
      <motion.div
        className="page-header"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1>SOS Requests</h1>
            <p>{requests.length} total requests · {statusCounts.pending || 0} pending</p>
          </div>
          <button className="btn btn-primary" onClick={openCreateModal}>
            <Plus size={18} /> New Request
          </button>
        </div>
      </motion.div>

      {/* Search + Filters */}
      <motion.div
        className="filter-bar"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="search-input">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search requests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Status filter chips */}
        {['all', ...REQUEST_STATUSES.map((s) => s.value)].map((status) => (
          <button
            key={status}
            className={`filter-chip ${filterStatus === status ? 'active' : ''}`}
            onClick={() => setFilterStatus(status)}
          >
            {status === 'all' ? 'All' : capitalize(status)}
            <span style={{ opacity: 0.6 }}>({statusCounts[status] || 0})</span>
          </button>
        ))}

        {/* Priority filter */}
        <select
          className="select"
          style={{ maxWidth: '150px', padding: '7px 12px', fontSize: 'var(--font-size-xs)' }}
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
        >
          <option value="all">All Priorities</option>
          {PRIORITY_LEVELS.map((p) => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>
      </motion.div>

      {/* Request Cards Grid */}
      <AnimatePresence mode="popLayout">
        {filteredRequests.length === 0 ? (
          <motion.div
            className="empty-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="empty-state-icon">
              <AlertTriangle size={28} />
            </div>
            <h3>No requests found</h3>
            <p>
              {searchQuery || filterStatus !== 'all' || filterPriority !== 'all'
                ? 'Try adjusting your search or filters.'
                : 'No SOS requests have been submitted yet.'}
            </p>
            <button className="btn btn-primary" onClick={openCreateModal}>
              <Plus size={16} /> Create Request
            </button>
          </motion.div>
        ) : (
          <motion.div className="request-grid" layout>
            {filteredRequests.map((request, index) => (
              <motion.div
                key={request.id}
                className="request-card"
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.03 }}
              >
                <div className="request-card-header">
                  <span className={`badge ${request.priority}`}>
                    <span className="badge-dot" />
                    {capitalize(request.priority)}
                  </span>
                  <span className={`badge ${request.status === 'resolved' ? 'resolved' : request.status === 'in_progress' ? 'info' : 'medium'}`}>
                    {capitalize(request.status)}
                  </span>
                </div>

                <div className="request-card-title">{request.title}</div>

                <div className="request-card-body">
                  <p className="request-card-description">{request.description}</p>
                </div>

                <div className="request-card-meta">
                  <span className="request-card-meta-item">
                    <MapPin size={12} /> {request.location}
                  </span>
                  <span className="request-card-meta-item">
                    <Clock size={12} /> {formatRelativeTime(request.createdAt)}
                  </span>
                  {request.peopleAffected > 0 && (
                    <span className="request-card-meta-item">
                      <UsersIcon size={12} /> {request.peopleAffected}
                    </span>
                  )}
                  {request.assignedTo && (
                    <span className="request-card-meta-item" style={{ color: 'var(--status-medium)' }}>
                      <CheckCircle size={12} /> Assigned to: {getVolunteerName(request.assignedTo)}
                    </span>
                  )}
                </div>

                <div className="request-card-footer">
                  <div className="request-card-tags">
                    <span className="skill-tag">{capitalize(request.category)}</span>
                  </div>
                    {/* Accept button for volunteers */}
                    {request.status === 'pending' && user?.role === 'volunteer' && (
                      <button className="btn btn-primary btn-sm" onClick={() => handleAccept(request.id)}>
                        Accept Mission
                      </button>
                    )}

                    {/* Prompt button for requesters */}
                    {(request.status === 'assigned' || request.status === 'in_progress') && request.createdBy === user?.uid && (
                      <button className="btn btn-ghost btn-sm" onClick={() => handlePrompt(request.id)} title="Prompt Volunteer">
                        <BellRing size={14} color="#FF6E00" />
                      </button>
                    )}

                    {/* Status change (Admin, Owner, or Assigned Volunteer) */}
                    {(user?.role === 'admin' || request.createdBy === user?.uid || request.assignedTo === user?.uid) && request.status !== 'resolved' && (
                      <select
                        className="select"
                        style={{ padding: '4px 8px', fontSize: '11px', maxWidth: '120px' }}
                        value={request.status}
                        onChange={(e) => handleStatusChange(request.id, e.target.value)}
                      >
                        {REQUEST_STATUSES.map((s) => (
                          <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                      </select>
                    )}

                    {/* Edit/Delete (Creator only) */}
                    {request.createdBy === user?.uid && (
                      <>
                        <button className="btn btn-ghost btn-sm" onClick={() => handleEditClick(request)} title="Edit">
                          <Edit3 size={14} />
                        </button>
                        <button className="btn btn-ghost btn-sm" onClick={() => handleDeleteClick(request)} title="Delete" style={{ color: 'var(--status-critical)' }}>
                          <Trash2 size={14} />
                        </button>
                      </>
                    )}
                  </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create SOS Request"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleCreate} disabled={!formData.title.trim() || !formData.location.trim()}>
              Submit Request
            </button>
          </>
        }
      >
        {renderFormFields()}
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Request"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleUpdate}>Save Changes</button>
          </>
        }
      >
        {renderFormFields()}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Delete Request"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
            <button className="btn btn-danger" onClick={handleDeleteConfirm}>Delete</button>
          </>
        }
      >
        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
          Are you sure you want to delete <strong>&ldquo;{selectedRequest?.title}&rdquo;</strong>?
          This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
}
