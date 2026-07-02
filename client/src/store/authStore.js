import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setAccessToken: (token) => set({ accessToken: token }),

      login: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const response = await api.post('/auth/login', { email, password });
          const { user, accessToken } = response.data;
          set({ user, accessToken, isAuthenticated: true, loading: false });
          return { success: true };
        } catch (error) {
          const message = error.response?.data?.error || 'Failed to login';
          set({ error: message, loading: false });
          return { success: false, error: message };
        }
      },

      register: async (name, email, password) => {
        set({ loading: true, error: null });
        try {
          const response = await api.post('/auth/register', { name, email, password });
          const { user, accessToken } = response.data;
          set({ user, accessToken, isAuthenticated: true, loading: false });
          return { success: true };
        } catch (error) {
          const message = error.response?.data?.error || 'Failed to register';
          set({ error: message, loading: false });
          return { success: false, error: message };
        }
      },

      logout: async () => {
        set({ loading: true });
        try {
          await api.post('/auth/logout');
        } catch (error) {
          console.error('Logout error:', error.message);
        } finally {
          set({ user: null, accessToken: null, isAuthenticated: false, loading: false });
        }
      },

      checkAuth: async () => {
        try {
          const response = await api.post('/auth/refresh');
          const { accessToken } = response.data;
          // Fetch user profile or use cached info
          // Since refresh responds with new access token, we can decode or just mark authenticated
          set({ accessToken, isAuthenticated: true });
        } catch (error) {
          // Token refresh failed or no cookie, clear auth state
          set({ user: null, accessToken: null, isAuthenticated: false });
        }
      },
    }),
    {
      name: 'dlh-auth',
      partialize: (state) => ({ user: state.user }), // only persist user, not token
    }
  )
);

export default useAuthStore;
