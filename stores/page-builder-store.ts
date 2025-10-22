import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type {
  Page,
  Component,
  ComponentType,
  ComponentProps,
  PageMetadata,
  PageState,
  PageBuilderStore,
  DeviceMode,
} from '@/types/page-builder';

const generateId = () => Math.random().toString(36).substring(2, 11);

// LocalStorage keys
const STORAGE_KEYS = {
  PROPERTIES_PANEL_WIDTH: 'cms-properties-panel-width',
  PROPERTIES_PANEL_COLLAPSED: 'cms-properties-panel-collapsed',
};

// Helper functions for localStorage
const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn(`Error loading ${key} from localStorage:`, error);
    return defaultValue;
  }
};

const saveToStorage = <T>(key: string, value: T): void => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Error saving ${key} to localStorage:`, error);
  }
};

const usePageBuilderStore = create<PageBuilderStore>()(
  devtools(
    (set, get) => ({
      currentPage: null,
      pages: [],
      selectedComponentId: null,
      history: {
        past: [],
        present: null,
        future: [],
      },
      ui: {
        deviceMode: 'desktop',
        isPreviewMode: false,
        isDragging: false,
        showGrid: true,
        propertiesPanelWidth: loadFromStorage(STORAGE_KEYS.PROPERTIES_PANEL_WIDTH, 350),
        propertiesPanelCollapsed: loadFromStorage(STORAGE_KEYS.PROPERTIES_PANEL_COLLAPSED, false),
        activeDropZone: null,
      },
      actions: {
        // Page actions
        createPage: (name: string, slug: string) => {
          const newPage: Page = {
            id: generateId(),
            name,
            slug,
            components: [],
            metadata: {
              title: name,
              description: '',
              keywords: [],
            },
            status: 'draft',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          set((state) => ({
            pages: [...state.pages, newPage],
            currentPage: newPage,
            history: {
              past: [],
              present: { components: [], timestamp: Date.now() },
              future: [],
            },
          }));
        },

        loadPage: async (id: string) => {
          try {
            const response = await fetch(`/api/cms/pages/${id}`);
            if (!response.ok) throw new Error('Failed to load page');

            const page: Page = await response.json();

            set({
              currentPage: page,
              selectedComponentId: null,
              history: {
                past: [],
                present: { components: page.components, timestamp: Date.now() },
                future: [],
              },
            });
          } catch (error) {
            console.error('Error loading page:', error);
          }
        },

        savePage: async () => {
          const { currentPage } = get();
          if (!currentPage) return;

          const updatedPage = {
            ...currentPage,
            updatedAt: new Date().toISOString(),
          };

          try {
            const response = await fetch(`/api/cms/pages/${currentPage.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(updatedPage),
            });

            if (!response.ok) throw new Error('Failed to save page');

            set((state) => ({
              currentPage: updatedPage,
              pages: state.pages.map((p) =>
                p.id === updatedPage.id ? updatedPage : p
              ),
            }));
          } catch (error) {
            console.error('Error saving page:', error);
          }
        },

        deletePage: async (id: string) => {
          try {
            const response = await fetch(`/api/cms/pages/${id}`, {
              method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete page');

            set((state) => ({
              pages: state.pages.filter((p) => p.id !== id),
              currentPage: state.currentPage?.id === id ? null : state.currentPage,
            }));
          } catch (error) {
            console.error('Error deleting page:', error);
          }
        },

        duplicatePage: (id: string) => {
          const { pages } = get();
          const pageToDuplicate = pages.find((p) => p.id === id);
          if (!pageToDuplicate) return;

          const duplicatedPage: Page = {
            ...pageToDuplicate,
            id: generateId(),
            name: `${pageToDuplicate.name} (Copy)`,
            slug: `${pageToDuplicate.slug}-copy`,
            status: 'draft',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          set((state) => ({
            pages: [...state.pages, duplicatedPage],
          }));
        },

        updatePageMetadata: (metadata: Partial<PageMetadata>) => {
          set((state) => {
            if (!state.currentPage) return state;

            return {
              currentPage: {
                ...state.currentPage,
                metadata: {
                  ...state.currentPage.metadata,
                  ...metadata,
                },
                updatedAt: new Date().toISOString(),
              },
            };
          });
        },

        setPages: (pages: Page[]) => {
          set({ pages });
        },

        // Component actions
        addComponent: (type: ComponentType, position: number, parentId?: string) => {
          const { currentPage } = get();
          if (!currentPage) return;

          const newComponent: Component = {
            id: generateId(),
            type,
            parentId,
            props: getDefaultProps(type),
          };

          set((state) => {
            if (!state.currentPage) return state;

            const components = [...state.currentPage.components];

            if (parentId) {
              // Add to parent component
              const addToParent = (comps: Component[]): Component[] => {
                return comps.map((comp) => {
                  if (comp.id === parentId) {
                    const children = comp.children || [];
                    children.splice(position, 0, newComponent);
                    return { ...comp, children };
                  }
                  if (comp.children) {
                    return { ...comp, children: addToParent(comp.children) };
                  }
                  return comp;
                });
              };

              return {
                currentPage: {
                  ...state.currentPage,
                  components: addToParent(components),
                },
              };
            } else {
              // Add to root level
              components.splice(position, 0, newComponent);
              return {
                currentPage: {
                  ...state.currentPage,
                  components,
                },
              };
            }
          });

          get().actions.saveToHistory();
        },

        removeComponent: (id: string) => {
          set((state) => {
            if (!state.currentPage) return state;

            const removeFromComponents = (comps: Component[]): Component[] => {
              return comps
                .filter((comp) => comp.id !== id)
                .map((comp) => ({
                  ...comp,
                  children: comp.children ? removeFromComponents(comp.children) : undefined,
                }));
            };

            return {
              currentPage: {
                ...state.currentPage,
                components: removeFromComponents(state.currentPage.components),
              },
              selectedComponentId:
                state.selectedComponentId === id ? null : state.selectedComponentId,
            };
          });

          get().actions.saveToHistory();
        },

        updateComponent: (id: string, props: Partial<ComponentProps>) => {
          set((state) => {
            if (!state.currentPage) return state;

            const updateInComponents = (comps: Component[]): Component[] => {
              return comps.map((comp) => {
                if (comp.id === id) {
                  return {
                    ...comp,
                    props: { ...comp.props, ...props },
                  };
                }
                if (comp.children) {
                  return { ...comp, children: updateInComponents(comp.children) };
                }
                return comp;
              });
            };

            return {
              currentPage: {
                ...state.currentPage,
                components: updateInComponents(state.currentPage.components),
              },
            };
          });

          get().actions.saveToHistory();
        },

        moveComponent: (componentId: string, newPosition: number, newParentId?: string) => {
          set((state) => {
            if (!state.currentPage) return state;

            // Find the component's current position and parent before removing
            let componentToMove: Component | null = null;
            let oldPosition = -1;
            let oldParentId: string | undefined = undefined;

            const findPosition = (comps: Component[], currentPos = 0, parentId?: string): { found: boolean; position: number; parentId?: string } => {
              for (let i = 0; i < comps.length; i++) {
                if (comps[i].id === componentId) {
                  return { found: true, position: currentPos + i, parentId };
                }
                if (comps[i].children) {
                  const result = findPosition(comps[i].children!, 0, comps[i].id);
                  if (result.found) return result;
                }
              }
              return { found: false, position: -1 };
            };

            const positionInfo = findPosition(state.currentPage.components);
            if (positionInfo.found) {
              oldPosition = positionInfo.position;
              oldParentId = positionInfo.parentId;
            }

            // Remove the component
            const removeComponent = (comps: Component[]): Component[] => {
              const result: Component[] = [];
              for (const comp of comps) {
                if (comp.id === componentId) {
                  componentToMove = comp;
                } else {
                  const newComp = { ...comp };
                  if (newComp.children) {
                    newComp.children = removeComponent(newComp.children);
                  }
                  result.push(newComp);
                }
              }
              return result;
            };

            let components = removeComponent([...state.currentPage.components]);

            if (!componentToMove) return state;

            // Adjust position if moving forward within the same parent
            // When removing an item, indices shift down by 1, so we need to compensate
            let adjustedPosition = newPosition;
            const sameParent = oldParentId === newParentId || (!oldParentId && !newParentId);
            if (sameParent && oldPosition < newPosition) {
              adjustedPosition = newPosition - 1;
            }

            // Update parent ID
            componentToMove = { ...componentToMove, parentId: newParentId };

            // Insert at adjusted position
            if (newParentId) {
              const insertIntoParent = (comps: Component[]): Component[] => {
                return comps.map((comp) => {
                  if (comp.id === newParentId) {
                    const children = comp.children || [];
                    children.splice(adjustedPosition, 0, componentToMove!);
                    return { ...comp, children };
                  }
                  if (comp.children) {
                    return { ...comp, children: insertIntoParent(comp.children) };
                  }
                  return comp;
                });
              };
              components = insertIntoParent(components);
            } else {
              components.splice(adjustedPosition, 0, componentToMove);
            }

            return {
              currentPage: {
                ...state.currentPage,
                components,
              },
            };
          });

          get().actions.saveToHistory();
        },

        duplicateComponent: (id: string) => {
          const { currentPage } = get();
          if (!currentPage) return;

          const findComponent = (comps: Component[]): Component | null => {
            for (const comp of comps) {
              if (comp.id === id) return comp;
              if (comp.children) {
                const found = findComponent(comp.children);
                if (found) return found;
              }
            }
            return null;
          };

          const component = findComponent(currentPage.components);
          if (!component) return;

          const duplicateWithNewIds = (comp: Component): Component => ({
            ...comp,
            id: generateId(),
            children: comp.children?.map(duplicateWithNewIds),
          });

          const duplicated = duplicateWithNewIds(component);

          // Find position to insert
          const findPosition = (comps: Component[], targetId: string, currentPos = 0): number => {
            for (let i = 0; i < comps.length; i++) {
              if (comps[i].id === targetId) return currentPos + i + 1;
              if (comps[i].children) {
                const pos = findPosition(comps[i].children!, targetId, 0);
                if (pos > 0) return pos;
              }
            }
            return -1;
          };

          const position = findPosition(currentPage.components, id);
          if (position >= 0) {
            get().actions.addComponent(
              duplicated.type,
              position,
              component.parentId
            );
          }
        },

        selectComponent: (id: string | null) => {
          set({ selectedComponentId: id });
        },

        // History actions
        undo: () => {
          set((state) => {
            const { past, present } = state.history;
            if (past.length === 0) return state;

            const previous = past[past.length - 1];
            const newPast = past.slice(0, past.length - 1);

            return {
              currentPage: state.currentPage
                ? { ...state.currentPage, components: previous.components }
                : null,
              history: {
                past: newPast,
                present: previous,
                future: present ? [present, ...state.history.future] : state.history.future,
              },
            };
          });
        },

        redo: () => {
          set((state) => {
            const { future, present } = state.history;
            if (future.length === 0) return state;

            const next = future[0];
            const newFuture = future.slice(1);

            return {
              currentPage: state.currentPage
                ? { ...state.currentPage, components: next.components }
                : null,
              history: {
                past: present ? [...state.history.past, present] : state.history.past,
                present: next,
                future: newFuture,
              },
            };
          });
        },

        clearHistory: () => {
          set((state) => ({
            history: {
              past: [],
              present: state.currentPage
                ? { components: state.currentPage.components, timestamp: Date.now() }
                : null,
              future: [],
            },
          }));
        },

        saveToHistory: () => {
          set((state) => {
            if (!state.currentPage) return state;

            const newPresent: PageState = {
              components: state.currentPage.components,
              timestamp: Date.now(),
            };

            return {
              history: {
                past: state.history.present
                  ? [...state.history.past, state.history.present]
                  : state.history.past,
                present: newPresent,
                future: [], // Clear future on new action
              },
            };
          });
        },

        // UI actions
        setDeviceMode: (mode: DeviceMode) => {
          set((state) => ({
            ui: { ...state.ui, deviceMode: mode },
          }));
        },

        togglePreviewMode: () => {
          set((state) => ({
            ui: { ...state.ui, isPreviewMode: !state.ui.isPreviewMode },
          }));
        },

        setIsDragging: (isDragging: boolean) => {
          set((state) => ({
            ui: { ...state.ui, isDragging },
          }));
        },

        toggleGrid: () => {
          set((state) => ({
            ui: { ...state.ui, showGrid: !state.ui.showGrid },
          }));
        },

        setPropertiesPanelWidth: (width: number) => {
          // Clamp width between min and max
          const clampedWidth = Math.max(250, Math.min(500, width));
          saveToStorage(STORAGE_KEYS.PROPERTIES_PANEL_WIDTH, clampedWidth);
          set((state) => ({
            ui: { ...state.ui, propertiesPanelWidth: clampedWidth },
          }));
        },

        togglePropertiesPanel: () => {
          set((state) => {
            const newCollapsedState = !state.ui.propertiesPanelCollapsed;
            saveToStorage(STORAGE_KEYS.PROPERTIES_PANEL_COLLAPSED, newCollapsedState);
            return {
              ui: { ...state.ui, propertiesPanelCollapsed: newCollapsedState },
            };
          });
        },

        setActiveDropZone: (position: number, parentId?: string) => {
          set((state) => ({
            ui: {
              ...state.ui,
              activeDropZone: { position, parentId: parentId || undefined }
            },
          }));
        },

        clearActiveDropZone: () => {
          set((state) => ({
            ui: { ...state.ui, activeDropZone: null },
          }));
        },
      },
    }),
    { name: 'PageBuilderStore' }
  )
);

// Helper function to get default props for each component type
function getDefaultProps(type: ComponentType): ComponentProps {
  switch (type) {
    case 'text':
      return {
        content: 'Click to edit text',
        fontSize: '16px',
        fontWeight: 'normal',
        color: 'inherit',
        alignment: 'left',
      };
    case 'heading':
      return {
        content: 'Heading',
        level: 'h2',
        fontSize: '2rem',
        fontWeight: 'bold',
        alignment: 'left',
      };
    case 'button':
      return {
        text: 'Button',
        variant: 'default',
        size: 'md',
      };
    case 'image':
      return {
        alt: 'Image',
        objectFit: 'cover',
      };
    case 'divider':
      return {
        style: 'solid',
        thickness: '1px',
        color: 'currentColor',
        spacing: '1rem',
      };
    case 'container':
      return {
        maxWidth: '1200px',
        padding: '1rem',
      };
    case 'grid':
      return {
        columns: 2,
        gap: '1rem',
        padding: '0',
      };
    case 'column':
      return {
        span: 1,
        padding: '0',
      };
    case 'spacer':
      return {
        height: '2rem',
      };
    case 'video':
      return {
        autoPlay: false,
        loop: false,
        muted: false,
        controls: true,
      };
    case 'icon':
      return {
        name: 'star',
        size: '24px',
        color: 'currentColor',
      };
    case 'gallery':
      return {
        images: [],
        columns: 3,
        gap: '1rem',
      };
    case 'carousel':
      return {
        items: [],
        autoPlay: false,
        interval: 5000,
        showControls: true,
        showIndicators: true,
      };
    default:
      return {} as ComponentProps;
  }
}

export default usePageBuilderStore;
