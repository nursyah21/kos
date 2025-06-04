import { onAuthStateChanged, type User } from '@firebase/auth';
import { create } from 'zustand';
import { auth } from '../lib/firebase';

interface AuthState {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
}

const useAuthStore = create<AuthState>((set) => {
    onAuthStateChanged(auth, (user) => {
        set({user, loading: false})
    })

    return {
        user: null,
        loading: true,
        setUser: (user) => set({ user }),
        setLoading: (loading) => set({ loading }),
    };
})

export default useAuthStore;