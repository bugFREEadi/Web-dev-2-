// Volunteers Page - displays volunteer profiles and skills
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Phone, Mail, Star, CheckCircle, XCircle } from 'lucide-react';
import { useData } from '../hooks/useData';
import { useAuth } from '../hooks/useAuth';
import { getInitials } from '../utils/formatters';
import { Plus } from 'lucide-react';

export default function VolunteersPage() {
  const { user, updateUserProfile } = useAuth();
  const { volunteers, addVolunteer, addToast, toggleVolunteerAvailability } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [filterAvailability, setFilterAvailability] = useState('all');

  const filteredVolunteers = useMemo(() => {
    return volunteers.filter((v) => {
      const matchesSearch = !searchQuery || 
        v.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        v.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesAvailability = filterAvailability === 'all' || 
        (filterAvailability === 'available' ? v.available : !v.available);

      return matchesSearch && matchesAvailability;
    });
  }, [volunteers, searchQuery, filterAvailability]);

  return (
    <div className="page-container">
      <motion.div className="page-header" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1>Volunteers Roster</h1>
            <p>{volunteers.length} total registered volunteers · {volunteers.filter(v => v.available).length} currently available</p>
          </div>
          
          {user?.role === 'citizen' && (
            <button 
              className="btn btn-primary" 
              onClick={async () => {
                setIsJoining(true);
                try {
                  await updateUserProfile({ role: 'volunteer' });
                  await addVolunteer({
                    name: user.displayName,
                    email: user.email,
                    phone: user.phone || 'N/A',
                    location: user.location || 'Remote',
                    skills: ['General Support'],
                    available: true
                  });
                  addToast({ type: 'success', title: 'Welcome aboard!', message: 'You are now registered as a crisis volunteer.' });
                } finally {
                  setIsJoining(false);
                }
              }}
              disabled={isJoining}
            >
              <Plus size={18} /> {isJoining ? 'Joining...' : 'Become a Volunteer'}
            </button>
          )}
        </div>
      </motion.div>

      <motion.div className="filter-bar" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        <div className="search-input">
          <Search size={16} />
          <input 
            type="text" 
            placeholder="Search by name or skills..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <select 
          className="select" 
          style={{ maxWidth: '150px', padding: '7px 12px', fontSize: 'var(--font-size-xs)' }}
          value={filterAvailability}
          onChange={(e) => setFilterAvailability(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="available">Available</option>
          <option value="busy">Busy / Unavailable</option>
        </select>
      </motion.div>

      <AnimatePresence mode="popLayout">
        <motion.div className="volunteer-grid" layout>
          {filteredVolunteers.map((volunteer, index) => (
            <motion.div 
              key={volunteer.id}
              className="volunteer-card"
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="volunteer-card-header">
                <div className="volunteer-avatar">{getInitials(volunteer.name)}</div>
                <div className="volunteer-info">
                  <h4>{volunteer.name}</h4>
                  <p style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {volunteer.available ? (
                      <><CheckCircle size={12} color="var(--status-low)" /> available</>
                    ) : (
                      <><XCircle size={12} color="var(--status-critical)" /> unavailable</>
                    )}
                  </p>
                </div>
                
                {user?.uid === volunteer.id && (
                  <button 
                    className="btn btn-ghost btn-sm" 
                    style={{ marginLeft: 'auto', background: 'var(--bg-hover)', fontSize: '11px' }}
                    onClick={() => toggleVolunteerAvailability(volunteer.id)}
                  >
                    Go {volunteer.available ? 'Offline' : 'Online'}
                  </button>
                )}
              </div>

              <div className="volunteer-skills">
                {volunteer.skills.map((skill, i) => (
                  <span key={i} className="skill-tag">{skill}</span>
                ))}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px', fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={14} /> {volunteer.location}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Phone size={14} /> {volunteer.phone}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Mail size={14} /> {volunteer.email}
                </div>
              </div>

              <div className="volunteer-stats">
                <div className="volunteer-stat">
                  <span className="volunteer-stat-value">{volunteer.completedRequests}</span>
                  <span className="volunteer-stat-label">Missions</span>
                </div>
                <div className="volunteer-stat">
                  <span className="volunteer-stat-value" style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                    {volunteer.rating} <Star size={14} fill="var(--status-medium)" color="var(--status-medium)" />
                  </span>
                  <span className="volunteer-stat-label">Rating</span>
                </div>
                <div className="volunteer-stat">
                  <span className="volunteer-stat-value">{volunteer.assignedRequests}</span>
                  <span className="volunteer-stat-label">Active</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
