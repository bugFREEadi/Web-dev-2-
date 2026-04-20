// Authentication Context — manages user state, login, signup, and demo mode
import { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { MOCK_USER } from '../utils/mockData';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDemo, setIsDemo] = useState(false);

  // Check for persisted demo session
  useEffect(() => {
    const demoSession = localStorage.getItem('crisisconnect_demo');
    if (demoSession === 'true') {
      setUser(MOCK_USER);
      setIsDemo(true);
      setLoading(false);
      return;
    }

    // Listen for Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Fetch additional user data from Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          const userData = userDoc.exists() ? userDoc.data() : {};
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || userData.displayName || 'User',
            role: userData.role || 'citizen',
            phone: userData.phone || '',
            location: userData.location || '',
            createdAt: userData.createdAt || new Date(),
          });
        } catch (err) {
          // If Firestore fails, use basic auth data
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || 'User',
            role: 'citizen',
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = useCallback(async (email, password) => {
    setError(null);
    setLoading(true);
    
    if (auth.app.options.apiKey === 'demo-api-key') {
      setError('Firebase is not configured! Please see the terminal instructions to add your .env file, or use Demo Mode.');
      setLoading(false);
      throw new Error('unconfigured');
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError(getErrorMessage(err.code));
      setLoading(false);
      throw err;
    }
  }, []);

  const signup = useCallback(async (email, password, displayName, role = 'citizen') => {
    setError(null);
    setLoading(true);

    if (auth.app.options.apiKey === 'demo-api-key') {
      setError('Firebase is not configured! Please see the terminal instructions to add your .env file, or use Demo Mode.');
      setLoading(false);
      throw new Error('unconfigured');
    }

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName });

      // Store additional user data in Firestore
      await setDoc(doc(db, 'users', cred.user.uid), {
        displayName,
        email,
        role,
        phone: '',
        location: '',
        createdAt: new Date(),
      });

      // NEW: If joining as volunteer, sync to volunteers collection
      if (role === 'volunteer') {
        await setDoc(doc(db, 'volunteers', cred.user.uid), {
          name: displayName,
          email,
          phone: 'N/A',
          location: 'Remote',
          skills: ['General Support'],
          available: true,
          assignedRequests: 0,
          completedRequests: 0,
          rating: 4.5,
          joinedAt: new Date(),
        });
      }
    } catch (err) {
      setError(getErrorMessage(err.code));
      setLoading(false);
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    if (isDemo) {
      localStorage.removeItem('crisisconnect_demo');
      setUser(null);
      setIsDemo(false);
      return;
    }
    try {
      await signOut(auth);
    } catch (err) {
      setError(err.message);
    }
  }, [isDemo]);

  const loginAsDemo = useCallback(() => {
    localStorage.setItem('crisisconnect_demo', 'true');
    setUser(MOCK_USER);
    setIsDemo(true);
    setLoading(false);
  }, []);

  const loginWithGoogle = useCallback(async () => {
    setError(null);
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      
      // Check if user exists in Firestore, if not create record
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', result.user.uid), {
          displayName: result.user.displayName,
          email: result.user.email,
          role: 'citizen',
          phone: '',
          location: '',
          createdAt: new Date(),
        });
      }
    } catch (err) {
      setError(getErrorMessage(err.code));
      setLoading(false);
      throw err;
    }
  }, []);

  const updateUserProfile = useCallback(async (updates) => {
    if (isDemo) {
      setUser((prev) => ({ ...prev, ...updates }));
      return;
    }
    try {
      if (auth.currentUser) {
        if (updates.displayName) {
          await updateProfile(auth.currentUser, { displayName: updates.displayName });
        }
        await setDoc(doc(db, 'users', auth.currentUser.uid), updates, { merge: true });
        
        // Sync role change to volunteers collection if needed
        if (updates.role === 'volunteer') {
          await setDoc(doc(db, 'volunteers', auth.currentUser.uid), {
            name: updates.displayName || user.displayName,
            email: user.email,
            phone: updates.phone || user.phone || 'N/A',
            location: updates.location || user.location || 'Remote',
            skills: ['General Support'],
            available: true,
            assignedRequests: 0,
            completedRequests: 0,
            rating: 4.8,
            joinedAt: new Date(),
          }, { merge: true });
        }

        setUser((prev) => ({ ...prev, ...updates }));
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [isDemo]);

  const clearError = useCallback(() => setError(null), []);

  const value = useMemo(
    () => ({
      user,
      loading,
      error,
      isDemo,
      login,
      signup,
      logout,
      loginAsDemo,
      loginWithGoogle,
      updateUserProfile,
      clearError,
    }),
    [user, loading, error, isDemo, login, signup, logout, loginAsDemo, loginWithGoogle, updateUserProfile, clearError]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function getErrorMessage(code) {
  switch (code) {
    case 'auth/user-not-found':
      return 'No account found with this email address.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/email-already-in-use':
      return 'This email is already registered. Please log in instead.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later.';
    case 'auth/invalid-api-key':
      return 'Firebase configuration is missing or invalid. Please check your .env file.';
    default:
      return 'An error occurred. Please try again.';
  }
}
