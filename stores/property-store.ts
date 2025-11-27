import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Property, PropertyFilters, PropertyFormData, DEFAULT_PROPERTY_FILTERS } from '@/types/property';
import { DEFAULT_PROPERTY_FILTERS as DEFAULT_FILTERS } from '@/types/property';

interface PropertyStore {
  properties: Property[];
  filters: PropertyFilters;
  selectedPropertyIds: string[];
  isLoading: boolean;
  actions: {
    // Fetch properties
    fetchProperties: () => Promise<void>;

    // CRUD operations
    createProperty: (propertyData: PropertyFormData) => Promise<Property>;
    updateProperty: (id: string, propertyData: PropertyFormData) => Promise<Property>;
    deleteProperty: (id: string) => Promise<void>;
    deleteProperties: (ids: string[]) => Promise<void>;

    // Filters
    setFilters: (filters: Partial<PropertyFilters>) => void;
    resetFilters: () => void;

    // Selection
    togglePropertySelection: (id: string) => void;
    selectAllProperties: () => void;
    clearSelection: () => void;

    // Utility
    refreshProperties: () => Promise<void>;
    getPropertyById: (id: string) => Property | undefined;
  };
}

export const usePropertyStore = create<PropertyStore>()(
  devtools(
    (set, get) => ({
      properties: [],
      filters: DEFAULT_FILTERS,
      selectedPropertyIds: [],
      isLoading: false,

      actions: {
        // Fetch all properties from API
        fetchProperties: async () => {
          set({ isLoading: true });
          try {
            const response = await fetch('/api/properties');
            if (!response.ok) throw new Error('Failed to fetch properties');
            const properties = await response.json();
            set({ properties, isLoading: false });
          } catch (error) {
            console.error('Error fetching properties:', error);
            set({ isLoading: false });
          }
        },

        // Create a new property
        createProperty: async (propertyData) => {
          const response = await fetch('/api/properties', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(propertyData),
          });

          if (!response.ok) throw new Error('Failed to create property');

          const newProperty = await response.json();
          set((state) => ({
            properties: [newProperty, ...state.properties],
          }));

          return newProperty;
        },

        // Update an existing property
        updateProperty: async (id, propertyData) => {
          const response = await fetch('/api/properties', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, ...propertyData }),
          });

          if (!response.ok) throw new Error('Failed to update property');

          const updatedProperty = await response.json();
          set((state) => ({
            properties: state.properties.map((prop) =>
              prop.id === id ? updatedProperty : prop
            ),
          }));

          return updatedProperty;
        },

        // Delete a single property
        deleteProperty: async (id) => {
          const response = await fetch(`/api/properties?id=${id}`, {
            method: 'DELETE',
          });

          if (!response.ok) throw new Error('Failed to delete property');

          set((state) => ({
            properties: state.properties.filter((prop) => prop.id !== id),
            selectedPropertyIds: state.selectedPropertyIds.filter(
              (pid) => pid !== id
            ),
          }));
        },

        // Delete multiple properties
        deleteProperties: async (ids) => {
          await Promise.all(
            ids.map((id) => get().actions.deleteProperty(id))
          );
          get().actions.clearSelection();
        },

        // Set filters
        setFilters: (newFilters) => {
          set((state) => {
            const mergedFilters = { ...state.filters, ...newFilters };
            // Only update if values actually changed
            if (JSON.stringify(mergedFilters) === JSON.stringify(state.filters)) {
              return state;
            }
            return { filters: mergedFilters };
          });
        },

        // Reset filters to default
        resetFilters: () => {
          set({ filters: DEFAULT_FILTERS });
        },

        // Toggle property selection
        togglePropertySelection: (id) => {
          set((state) => ({
            selectedPropertyIds: state.selectedPropertyIds.includes(id)
              ? state.selectedPropertyIds.filter((pid) => pid !== id)
              : [...state.selectedPropertyIds, id],
          }));
        },

        // Select all visible properties
        selectAllProperties: () => {
          set((state) => ({
            selectedPropertyIds: state.properties.map((prop) => prop.id),
          }));
        },

        // Clear selection
        clearSelection: () => {
          set({ selectedPropertyIds: [] });
        },

        // Refresh properties (alias for fetchProperties)
        refreshProperties: async () => {
          await get().actions.fetchProperties();
        },

        // Get a specific property by ID
        getPropertyById: (id) => {
          return get().properties.find((prop) => prop.id === id);
        },
      },
    }),
    { name: 'PropertyStore' }
  )
);

// Selector hooks for better performance
export const useProperties = () =>
  usePropertyStore((state) => state.properties);
export const usePropertyFilters = () =>
  usePropertyStore((state) => state.filters);
export const useSelectedPropertyIds = () =>
  usePropertyStore((state) => state.selectedPropertyIds);
export const usePropertyActions = () =>
  usePropertyStore((state) => state.actions);
export const useIsLoadingProperties = () =>
  usePropertyStore((state) => state.isLoading);
