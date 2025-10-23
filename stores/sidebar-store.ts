import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface SidebarStore {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  toggle: () => void;
}

export const useSidebarStore = create<SidebarStore>()(
  persist(
    (set) => ({
      isOpen: true,
      setIsOpen: (open) => set({ isOpen: open }),
      toggle: () => set((state) => ({ isOpen: !state.isOpen })),
    }),
    {
      name: 'sidebar-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
