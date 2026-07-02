import { create } from 'zustand';

/**
 * uiStore — global UI state (modals, toasts, loading overlays, etc.)
 */
const useUiStore = create((set) => ({
  // Global loading overlay
  isLoading: false,
  setLoading: (v) => set({ isLoading: v }),

  // Toast notification
  toast: null,
  showToast: (message, type = 'success') =>
    set({ toast: { message, type, id: Date.now() } }),
  clearToast: () => set({ toast: null }),

  // Gallery lightbox
  lightboxImage: null,
  setLightboxImage: (img) => set({ lightboxImage: img }),
  closeLightbox: () => set({ lightboxImage: null }),
}));

export default useUiStore;
