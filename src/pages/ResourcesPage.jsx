// Resources Page - manage emergency supplies and inventory
import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Search, Plus, MapPin, RefreshCw, Layers, Trash2 } from 'lucide-react';
import { useData } from '../hooks/useData';
import { capitalize, formatRelativeTime } from '../utils/formatters';
import Modal from '../components/common/Modal';

const initialFormState = {
  name: '',
  category: 'medical',
  quantity: 0,
  capacity: 1000,
  unit: 'units',
  location: 'Camp Alpha',
};

export default function ResourcesPage() {
  const { resources, stats, addResource, updateResource, deleteResource } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState(initialFormState);
  const [submitting, setSubmitting] = useState(false);

  const filteredResources = useMemo(() => {
    return resources.filter(r => 
      !searchQuery || r.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [resources, searchQuery]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' || name === 'capacity' ? parseInt(value) || 0 : value
    }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    
    setSubmitting(true);
    try {
      await addResource(formData);
      setShowAddModal(false);
      setFormData(initialFormState);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this resource?')) {
      await deleteResource(id);
    }
  };

  return (
    <div className="page-container">
      <motion.div className="page-header" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1>Resource Inventory</h1>
            <p>{stats.totalResources.toLocaleString()} items in stock across camps</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            <Plus size={18} /> Add Inventory
          </button>
        </div>
      </motion.div>

      <motion.div className="filter-bar" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        <div className="search-input">
          <Search size={16} />
          <input 
            type="text" 
            placeholder="Search resources..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </motion.div>

      <div className="resource-grid">
        <AnimatePresence mode="popLayout">
          {filteredResources.map((resource, index) => {
            const percentage = (resource.quantity / resource.capacity) * 100;
            const barColor = percentage < 20 ? 'var(--status-critical)' : 
                             percentage < 50 ? 'var(--status-medium)' : 
                             'var(--status-low)';
            
            return (
              <motion.div 
                key={resource.id}
                className="resource-card"
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="resource-card-header">
                  <div className="resource-icon" style={{ background: 'var(--bg-hover)' }}>
                    <Layers size={20} color={barColor} />
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span className="badge" style={{ background: 'var(--bg-hover)' }}>
                      {resource.unit}
                    </span>
                    <button 
                      className="btn-ghost btn-sm" 
                      onClick={() => handleDelete(resource.id)}
                      style={{ color: 'var(--status-critical)', padding: '4px' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                
                <div className="resource-quantity" style={{ color: barColor }}>
                  {resource.quantity.toLocaleString()} <span style={{ fontSize: '14px', color: 'var(--text-tertiary)', fontWeight: 500 }}>/ {resource.capacity.toLocaleString()}</span>
                </div>
                <div className="resource-name">{resource.name}</div>
                
                <div className="resource-bar">
                  <div 
                    className="resource-bar-fill" 
                    style={{ width: `${Math.min(100, percentage)}%`, background: barColor }} 
                  />
                </div>
                
                <div className="resource-details" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={12} /> {resource.location || 'Base Camp'}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <RefreshCw size={12} /> {formatRelativeTime(resource.lastUpdated)}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Inventory"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleCreate} disabled={submitting}>
              {submitting ? 'Adding...' : 'Add Resource'}
            </button>
          </>
        }
      >
        <form className="settings-form" onSubmit={handleCreate}>
          <div className="input-group">
            <label className="input-label">Resource Name</label>
            <input 
              type="text" 
              name="name"
              className="input" 
              placeholder="e.g. Medical Kits, Water Bottles"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="input-group">
              <label className="input-label">Unit</label>
              <input 
                type="text" 
                name="unit"
                className="input" 
                placeholder="e.g. units, liters, kg"
                value={formData.unit}
                onChange={handleChange}
              />
            </div>
            <div className="input-group">
              <label className="input-label">Location</label>
              <input 
                type="text" 
                name="location"
                className="input" 
                placeholder="e.g. Camp Alpha"
                value={formData.location}
                onChange={handleChange}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="input-group">
              <label className="input-label">Initial Quantity</label>
              <input 
                type="number" 
                name="quantity"
                className="input" 
                min="0"
                value={formData.quantity}
                onChange={handleChange}
              />
            </div>
            <div className="input-group">
              <label className="input-label">Total Capacity</label>
              <input 
                type="number" 
                name="capacity"
                className="input" 
                min="1"
                value={formData.capacity}
                onChange={handleChange}
              />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}
