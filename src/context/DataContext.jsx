// Data Context — manages all application data (requests, volunteers, resources)
// Demonstrates: Context API, useReducer pattern, CRUD operations
import { createContext, useState, useEffect, useCallback, useMemo, useContext, useRef } from 'react';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../services/firebase';
import { AuthContext } from './AuthContext';
import {
  MOCK_REQUESTS,
  MOCK_VOLUNTEERS,
  MOCK_RESOURCES,
} from '../utils/mockData';
import { generateId } from '../utils/formatters';

export const DataContext = createContext(null);

export function DataProvider({ children }) {
  const { user, isDemo } = useContext(AuthContext);

  // State for all data entities
  const [requests, setRequests] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);

  // useRef — track if initial data is loaded (demonstrates useRef)
  const isInitialLoad = useRef(true);

  // Load data — demo mode uses mock data, otherwise Firebase
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    if (isDemo) {
      // Load mock data for demo mode
      setRequests(MOCK_REQUESTS);
      setVolunteers(MOCK_VOLUNTEERS);
      setResources(MOCK_RESOURCES);
      setLoading(false);
      isInitialLoad.current = false;
      return;
    }

    // Firebase real-time listeners
    setLoading(true);
    const unsubRequests = onSnapshot(
      query(collection(db, 'requests'), orderBy('createdAt', 'desc')),
      (snapshot) => {
        const data = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
          createdAt: d.data().createdAt?.toDate?.() || new Date(),
          updatedAt: d.data().updatedAt?.toDate?.() || new Date(),
        }));
        setRequests(data);
        if (isInitialLoad.current) {
          isInitialLoad.current = false;
          setLoading(false);
        }
      },
      (err) => {
        console.error('Requests listener error:', err);
        setLoading(false);
      }
    );

    const unsubVolunteers = onSnapshot(
      collection(db, 'volunteers'),
      (snapshot) => {
        setVolunteers(
          snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
        );
      }
    );

    const unsubResources = onSnapshot(
      collection(db, 'resources'),
      (snapshot) => {
        setResources(
          snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
        );
      }
    );

    return () => {
      unsubRequests();
      unsubVolunteers();
      unsubResources();
    };
  }, [user, isDemo]);

  // ---- Toast notifications ----
  const addToast = useCallback((toast) => {
    const id = generateId();
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // ---- REQUEST CRUD ----
  const addRequest = useCallback(async (requestData) => {
    if (isDemo) {
      const newRequest = {
        ...requestData,
        id: generateId(),
        status: 'pending',
        assignedTo: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: user?.uid,
      };
      setRequests((prev) => [newRequest, ...prev]);
      addToast({ type: 'success', title: 'Request Created', message: 'SOS request has been submitted successfully.' });
      return newRequest;
    }

    const docRef = await addDoc(collection(db, 'requests'), {
      ...requestData,
      status: 'pending',
      assignedTo: null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      createdBy: user?.uid,
    });
    addToast({ type: 'success', title: 'Request Created', message: 'SOS request has been submitted.' });
    return { id: docRef.id, ...requestData };
  }, [isDemo, user, addToast]);

  const updateRequest = useCallback(async (id, updates) => {
    // Permission Check: Ensure only creator can update or it's a status change from creator/admin/assigned volunteer
    const originalRequest = requests.find(r => r.id === id);
    const isOwner = originalRequest?.createdBy === user?.uid;
    const isAdmin = user?.role === 'admin';
    const isAssignedVolunteer = originalRequest?.assignedTo === user?.uid;

    if (!isOwner && !isAdmin && !isAssignedVolunteer) {
      addToast({ type: 'error', title: 'Permission Denied', message: 'You do not have permission to modify this request.' });
      return;
    }

    // Only owners or admins can change details like description/location
    if (!isOwner && !isAdmin && (updates.title || updates.description || updates.location)) {
      addToast({ type: 'error', title: 'Permission Denied', message: 'Only the creator can modify request details.' });
      return;
    }

    if (isDemo) {
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, ...updates, updatedAt: new Date() } : r))
      );
      addToast({ type: 'success', title: 'Request Updated', message: 'Request has been updated.' });
      return;
    }

    await updateDoc(doc(db, 'requests', id), {
      ...updates,
      updatedAt: serverTimestamp(),
    });
    addToast({ type: 'success', title: 'Request Updated', message: 'Request has been updated.' });
  }, [isDemo, addToast, user, requests]);

  const acceptRequest = useCallback(async (requestId, volunteerId) => {
    const updates = {
      status: 'assigned',
      assignedTo: volunteerId,
      updatedAt: isDemo ? new Date() : serverTimestamp()
    };

    if (isDemo) {
      setRequests((prev) =>
        prev.map((r) => (r.id === requestId ? { ...r, ...updates } : r))
      );
      addToast({ type: 'success', title: 'Mission Accepted', message: 'You have been assigned to this request.' });
      return;
    }

    await updateDoc(doc(db, 'requests', requestId), updates);
    addToast({ type: 'success', title: 'Mission Accepted', message: 'You have been assigned to this mission.' });
  }, [isDemo, addToast]);

  const promptVolunteer = useCallback(async (requestId) => {
    const originalRequest = requests.find(r => r.id === requestId);
    if (originalRequest?.createdBy !== user?.uid) {
      addToast({ type: 'error', title: 'Action Failed', message: 'Only the requester can prompt the volunteer.' });
      return;
    }

    addToast({ type: 'info', title: 'Volunteer Prompted', message: 'A notification has been sent to the assigned volunteer.' });
    // In a real app, this would trigger a push notification or email
  }, [user, requests, addToast]);

  const deleteRequest = useCallback(async (id) => {
    const originalRequest = requests.find(r => r.id === id);
    if (originalRequest && originalRequest.createdBy !== user?.uid) {
      addToast({ type: 'error', title: 'Permission Denied', message: 'Only the creator can delete this request.' });
      return;
    }

    if (isDemo) {
      setRequests((prev) => prev.filter((r) => r.id !== id));
      addToast({ type: 'warning', title: 'Request Deleted', message: 'Request has been removed.' });
      return;
    }

    await deleteDoc(doc(db, 'requests', id));
    addToast({ type: 'warning', title: 'Request Deleted', message: 'Request has been removed.' });
  }, [isDemo, addToast, user, requests]);

  // ---- VOLUNTEER CRUD ----
  const addVolunteer = useCallback(async (volunteerData) => {
    if (isDemo) {
      const newVolunteer = {
        ...volunteerData,
        id: generateId(),
        assignedRequests: 0,
        completedRequests: 0,
        rating: 0,
        joinedAt: new Date(),
      };
      setVolunteers((prev) => [newVolunteer, ...prev]);
      addToast({ type: 'success', title: 'Volunteer Added', message: `${volunteerData.name} has been registered.` });
      return newVolunteer;
    }

    const docRef = await addDoc(collection(db, 'volunteers'), {
      ...volunteerData,
      assignedRequests: 0,
      completedRequests: 0,
      rating: 0,
      joinedAt: serverTimestamp(),
    });
    addToast({ type: 'success', title: 'Volunteer Added', message: `${volunteerData.name} has been registered.` });
    return { id: docRef.id, ...volunteerData };
  }, [isDemo, addToast]);

  const updateVolunteer = useCallback(async (id, updates) => {
    if (isDemo) {
      setVolunteers((prev) =>
        prev.map((v) => (v.id === id ? { ...v, ...updates } : v))
      );
      addToast({ type: 'success', title: 'Volunteer Updated', message: 'Volunteer profile updated.' });
      return;
    }

    await updateDoc(doc(db, 'volunteers', id), updates);
    addToast({ type: 'success', title: 'Volunteer Updated', message: 'Volunteer profile updated.' });
  }, [isDemo, addToast]);

  const deleteVolunteer = useCallback(async (id) => {
    if (isDemo) {
      setVolunteers((prev) => prev.filter((v) => v.id !== id));
      addToast({ type: 'warning', title: 'Volunteer Removed', message: 'Volunteer has been removed.' });
      return;
    }

    await deleteDoc(doc(db, 'volunteers', id));
    addToast({ type: 'warning', title: 'Volunteer Removed', message: 'Volunteer has been removed.' });
  }, [isDemo, addToast]);

  const toggleVolunteerAvailability = useCallback(async (volunteerId) => {
    const v = volunteers.find(vol => vol.id === volunteerId);
    if (!v) return;

    const newStatus = !v.available;
    const update = { available: newStatus };

    if (isDemo) {
      setVolunteers(prev => prev.map(vol => vol.id === volunteerId ? { ...vol, available: newStatus } : vol));
      addToast({ type: 'info', title: 'Status Updated', message: `You are now ${newStatus ? 'available' : 'unavailable'}.` });
      return;
    }

    await updateDoc(doc(db, 'volunteers', volunteerId), update);
    addToast({ type: 'info', title: 'Status Updated', message: `Your status is now ${newStatus ? 'available' : 'unavailable'}.` });
  }, [isDemo, volunteers, addToast]);

  // ---- RESOURCE CRUD ----
  const addResource = useCallback(async (resourceData) => {
    if (isDemo) {
      const newResource = {
        ...resourceData,
        id: generateId(),
        lastUpdated: new Date(),
      };
      setResources((prev) => [newResource, ...prev]);
      addToast({ type: 'success', title: 'Resource Added', message: `${resourceData.name} added to inventory.` });
      return newResource;
    }

    const docRef = await addDoc(collection(db, 'resources'), {
      ...resourceData,
      lastUpdated: serverTimestamp(),
    });
    addToast({ type: 'success', title: 'Resource Added', message: `${resourceData.name} added to inventory.` });
    return { id: docRef.id, ...resourceData };
  }, [isDemo, addToast]);

  const updateResource = useCallback(async (id, updates) => {
    if (isDemo) {
      setResources((prev) =>
        prev.map((r) => (r.id === id ? { ...r, ...updates, lastUpdated: new Date() } : r))
      );
      addToast({ type: 'success', title: 'Resource Updated', message: 'Inventory has been updated.' });
      return;
    }

    await updateDoc(doc(db, 'resources', id), {
      ...updates,
      lastUpdated: serverTimestamp(),
    });
    addToast({ type: 'success', title: 'Resource Updated', message: 'Inventory has been updated.' });
  }, [isDemo, addToast]);

  const deleteResource = useCallback(async (id) => {
    if (isDemo) {
      setResources((prev) => prev.filter((r) => r.id !== id));
      addToast({ type: 'warning', title: 'Resource Removed', message: 'Resource removed from inventory.' });
      return;
    }

    await deleteDoc(doc(db, 'resources', id));
    addToast({ type: 'warning', title: 'Resource Removed', message: 'Resource removed from inventory.' });
  }, [isDemo, addToast]);

  // ---- Computed stats (demonstrates useMemo) ----
  const stats = useMemo(() => {
    const totalRequests = requests.length;
    const pendingRequests = requests.filter((r) => r.status === 'pending').length;
    const activeRequests = requests.filter((r) => ['assigned', 'in_progress'].includes(r.status)).length;
    const resolvedRequests = requests.filter((r) => r.status === 'resolved').length;
    const criticalRequests = requests.filter((r) => r.priority === 'critical' && r.status !== 'resolved').length;
    const totalVolunteers = volunteers.length;
    const activeVolunteers = volunteers.filter((v) => v.available).length;
    const totalPeopleAffected = requests.reduce((sum, r) => sum + (r.peopleAffected || 0), 0);
    const totalResources = resources.reduce((sum, r) => sum + r.quantity, 0);

    return {
      totalRequests,
      pendingRequests,
      activeRequests,
      resolvedRequests,
      criticalRequests,
      totalVolunteers,
      activeVolunteers,
      totalPeopleAffected,
      totalResources,
    };
  }, [requests, volunteers, resources]);

  // Volunteers Map — for quick O(1) lookups by ID
  const volunteersMap = useMemo(() => {
    const map = {};
    volunteers.forEach(v => { map[v.id] = v; });
    return map;
  }, [volunteers]);

  const value = useMemo(
    () => ({
      requests,
      volunteers,
      resources,
      volunteersMap,
      loading,
      stats,
      toasts,
      addToast,
      removeToast,
      addRequest,
      updateRequest,
      deleteRequest,
      acceptRequest,
      promptVolunteer,
      addVolunteer,
      updateVolunteer,
      deleteVolunteer,
      toggleVolunteerAvailability,
      addResource,
      updateResource,
      deleteResource,
    }),
    [
      requests, volunteers, resources, volunteersMap, loading, stats, toasts,
      addToast, removeToast,
      addRequest, updateRequest, deleteRequest,
      acceptRequest, promptVolunteer,
      addVolunteer, updateVolunteer, deleteVolunteer,
      toggleVolunteerAvailability,
      addResource, updateResource, deleteResource,
    ]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
