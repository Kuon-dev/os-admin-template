"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { useDrag } from 'react-dnd';
import {
  Type,
  Heading,
  MousePointer,
  Image as ImageIcon,
  Minus,
  Box,
  LayoutGrid,
  Columns,
  Space,
  Video,
  Sparkles,
  Images,
  ListVideo,
  ChevronDown,
  GripVertical,
  Search,
  X,
  Hash,
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';
import usePageBuilderStore from '@/stores/page-builder-store';
import type { ComponentType, ComponentPaletteItem } from '@/types/page-builder';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { motion } from 'motion/react';
import { COMPONENT_DEFAULTS } from '@/config/cms/component-defaults';

// Component palette data with metadata (icons, labels, categories)
// Default props are now centralized in config/cms/component-defaults.ts
const componentPaletteData: ComponentPaletteItem[] = [
  // Basic Components
  {
    type: 'text',
    label: 'Text',
    icon: Type,
    category: 'basic',
    defaultProps: COMPONENT_DEFAULTS.text,
  },
  {
    type: 'heading',
    label: 'Heading',
    icon: Heading,
    category: 'basic',
    defaultProps: COMPONENT_DEFAULTS.heading,
  },
  {
    type: 'button',
    label: 'Button',
    icon: MousePointer,
    category: 'basic',
    defaultProps: COMPONENT_DEFAULTS.button,
  },
  {
    type: 'image',
    label: 'Image',
    icon: ImageIcon,
    category: 'basic',
    defaultProps: COMPONENT_DEFAULTS.image,
  },
  {
    type: 'divider',
    label: 'Divider',
    icon: Minus,
    category: 'basic',
    defaultProps: COMPONENT_DEFAULTS.divider,
  },
  // Layout Components
  {
    type: 'container',
    label: 'Container',
    icon: Box,
    category: 'layout',
    defaultProps: COMPONENT_DEFAULTS.container,
  },
  {
    type: 'grid',
    label: 'Grid',
    icon: LayoutGrid,
    category: 'layout',
    defaultProps: COMPONENT_DEFAULTS.grid,
  },
  {
    type: 'column',
    label: 'Column',
    icon: Columns,
    category: 'layout',
    defaultProps: COMPONENT_DEFAULTS.column,
  },
  {
    type: 'spacer',
    label: 'Spacer',
    icon: Space,
    category: 'layout',
    defaultProps: COMPONENT_DEFAULTS.spacer,
  },
  // Media Components
  {
    type: 'video',
    label: 'Video',
    icon: Video,
    category: 'media',
    defaultProps: COMPONENT_DEFAULTS.video,
  },
  {
    type: 'icon',
    label: 'Icon',
    icon: Sparkles,
    category: 'media',
    defaultProps: COMPONENT_DEFAULTS.icon,
  },
  {
    type: 'gallery',
    label: 'Gallery',
    icon: Images,
    category: 'media',
    defaultProps: COMPONENT_DEFAULTS.gallery,
  },
  {
    type: 'carousel',
    label: 'Carousel',
    icon: ListVideo,
    category: 'media',
    defaultProps: COMPONENT_DEFAULTS.carousel,
  },
];

const componentDescriptions: Record<ComponentType, string> = {
  text: 'Add editable text content with customizable styling and formatting options.',
  heading: 'Create headings from H1 to H6 with alignment and styling controls.',
  button: 'Interactive button with multiple variants, sizes, and click actions.',
  image: 'Display images with customizable sizing, borders, and object fit options.',
  divider: 'Visual separator with customizable style, color, and thickness.',
  container: 'Wrapper element with max-width, padding, and responsive controls.',
  grid: 'Flexible grid layout with configurable columns and gap spacing.',
  column: 'Grid column with span control for responsive layouts.',
  spacer: 'Adjustable vertical spacing between components.',
  video: 'Embed videos with playback controls and autoplay options.',
  icon: 'Display icons from various icon libraries with size and color controls.',
  gallery: 'Image gallery with multiple layout options and lightbox functionality.',
  carousel: 'Sliding carousel for images or content with navigation controls.',
};

interface ComponentItemProps {
  item: ComponentPaletteItem;
  onAddComponent: (type: ComponentType) => void;
  isFocused?: boolean;
  onFocus?: () => void;
  searchQuery?: string;
}

function ComponentItem({ item, onAddComponent, isFocused, onFocus, searchQuery }: ComponentItemProps) {
  const Icon = item.icon;
  const { actions } = usePageBuilderStore();
  const [justAdded, setJustAdded] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: 'new-component',
    item: { type: 'new-component', componentType: item.type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: () => {
      // Clear active dropzone when drag ends
      actions.clearActiveDropZone();
    },
  });

  // Attach drag to the button ref
  useEffect(() => {
    if (buttonRef.current) {
      drag(buttonRef.current);
    }
  }, [drag]);

  const handleClick = () => {
    onAddComponent(item.type);
    // Show success feedback
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 600);
  };

  // Highlight matching text in search
  const highlightText = (text: string) => {
    if (!searchQuery) return text;

    const parts = text.split(new RegExp(`(${searchQuery})`, 'gi'));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === searchQuery.toLowerCase() ? (
            <mark key={i} className="bg-[var(--search-highlight)] rounded px-0.5">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  return (
    <HoverCard openDelay={500}>
      <HoverCardTrigger asChild>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              ref={buttonRef}
              type="button"
              role="option"
              aria-label={`Add ${item.label} component to canvas`}
              aria-selected={isFocused}
              className={cn(
                'flex items-center w-full rounded-lg',
                'transition-all duration-150',
                'text-left focus-visible-ring',
                'min-h-[44px]', // Touch-friendly target
                isDragging && 'opacity-50 cursor-grabbing',
                !isDragging && 'cursor-grab hover:bg-[var(--component-item-hover)]',
                isFocused && 'bg-[var(--component-item-focus)] ring-2 ring-primary/20',
                justAdded && 'bg-[var(--component-item-active)] scale-105'
              )}
              style={{
                padding: 'var(--spacing-4)',
                gap: 'var(--spacing-3)',
              }}
              onClick={handleClick}
              onFocus={onFocus}
              tabIndex={0}
            >
              <GripVertical className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <div
                className={cn(
                  "rounded-md border-2 shadow-sm transition-all",
                  isFocused && "border-primary bg-primary/5",
                  !isFocused && "border-border bg-background"
                )}
                style={{ padding: 'var(--spacing-2)' }}
              >
                <Icon className={cn(
                  "h-6 w-6 transition-colors",
                  isFocused && "text-primary",
                  !isFocused && "text-foreground"
                )} />
              </div>
              <span className="text-sm font-medium flex-1">
                {highlightText(item.label)}
              </span>
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Drag to canvas, click to add, or press Enter</p>
          </TooltipContent>
        </Tooltip>
      </HoverCardTrigger>
      <HoverCardContent side="right" className="w-80">
        <div className="space-y-2" style={{ gap: 'var(--spacing-2)' }}>
          <div className="flex items-center gap-2" style={{ gap: 'var(--spacing-2)' }}>
            <Icon className="h-5 w-5" />
            <h4 className="font-semibold">{item.label}</h4>
          </div>
          <p className="text-sm text-muted-foreground">
            {componentDescriptions[item.type]}
          </p>
          {/* Preview thumbnail would go here */}
          <div className="aspect-video bg-muted rounded-md flex items-center justify-center text-xs text-muted-foreground">
            Component Preview
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

export function ComponentPalette() {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([
    'basic',
    'layout',
    'media',
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const paletteRef = useRef<HTMLDivElement>(null);

  const handleAddComponent = useCallback((type: ComponentType) => {
    // Component added - no tracking needed
  }, []);

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const categories = [
    { id: 'basic', label: 'Basic Components' },
    { id: 'layout', label: 'Layout Components' },
    { id: 'media', label: 'Media Components' },
  ];

  const getComponentsByCategory = (category: string) => {
    return componentPaletteData.filter((item) => item.category === category);
  };

  // Filter components based on search
  const filteredComponents = componentPaletteData.filter((item) =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get visible components list for keyboard navigation
  const visibleComponents = searchQuery
    ? filteredComponents
    : componentPaletteData;

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't interfere if user is typing in search
      if (document.activeElement === searchInputRef.current) {
        if (e.key === 'Escape') {
          setSearchQuery('');
          searchInputRef.current?.blur();
          return;
        }
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setFocusedIndex(0);
          return;
        }
        return;
      }

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setFocusedIndex((prev) =>
            prev < visibleComponents.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setFocusedIndex((prev) =>
            prev > 0 ? prev - 1 : visibleComponents.length - 1
          );
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          if (focusedIndex >= 0 && visibleComponents[focusedIndex]) {
            handleAddComponent(visibleComponents[focusedIndex].type);
          }
          break;
        case 'Home':
          e.preventDefault();
          setFocusedIndex(0);
          break;
        case 'End':
          e.preventDefault();
          setFocusedIndex(visibleComponents.length - 1);
          break;
        case '/':
          e.preventDefault();
          searchInputRef.current?.focus();
          break;
        case 'Escape':
          setFocusedIndex(-1);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    focusedIndex,
    visibleComponents,
    handleAddComponent,
  ]);

  const handleClearSearch = () => {
    setSearchQuery('');
    searchInputRef.current?.focus();
  };

  return (
    <TooltipProvider>
      <div
        ref={paletteRef}
        className="w-64 h-full border-r bg-background flex flex-col overflow-hidden"
        role="navigation"
        aria-label="Component palette"
      >
        {/* Header */}
        <div
          className="border-b"
          style={{ padding: 'var(--spacing-4)' }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-base">Components</h3>
              <p className="text-xs text-muted-foreground mt-1" style={{ marginTop: 'var(--spacing-1)' }}>
                Press / to search
              </p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div
          className="border-b"
          style={{ padding: 'var(--spacing-4)' }}
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              ref={searchInputRef}
              placeholder="Search components..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-8 h-9 focus-visible-ring"
              aria-label="Search components"
              aria-controls="component-list"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-accent rounded transition-colors"
                aria-label="Clear search"
              >
                <X className="h-3 w-3 text-muted-foreground" />
              </button>
            )}
          </div>
          {searchQuery && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-muted-foreground mt-2"
              role="status"
              aria-live="polite"
            >
              {filteredComponents.length} {filteredComponents.length === 1 ? 'result' : 'results'}
            </motion.p>
          )}
        </div>

        {/* Component List */}
        <ScrollArea className="flex-1 min-h-0">
          <div
            id="component-list"
            className="space-y-2"
            style={{
              padding: 'var(--spacing-4)',
              gap: 'var(--spacing-2)',
            }}
            role="listbox"
            aria-label="Available components"
          >
            {/* Search Results or Categorized List */}
            {searchQuery ? (
              <div>
                <div className="flex items-center justify-between mb-2" style={{ marginBottom: 'var(--spacing-2)' }}>
                  <h4 className="text-xs font-semibold text-primary uppercase tracking-wide">
                    Results
                  </h4>
                  <span className="text-xs text-muted-foreground">
                    {filteredComponents.length}
                  </span>
                </div>
                <div className="space-y-1" style={{ gap: 'var(--spacing-1)' }}>
                  {filteredComponents.length > 0 ? (
                    filteredComponents.map((item, idx) => (
                      <ComponentItem
                        key={item.type}
                        item={item}
                        onAddComponent={handleAddComponent}
                        isFocused={focusedIndex === idx}
                        onFocus={() => setFocusedIndex(idx)}
                        searchQuery={searchQuery}
                      />
                    ))
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-8 text-sm text-muted-foreground"
                    >
                      <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      No components found
                    </motion.div>
                  )}
                </div>
              </div>
            ) : (
              categories.map((category) => {
                const components = getComponentsByCategory(category.id);
                const isExpanded = expandedCategories.includes(category.id);
                const categoryStartIndex = categories
                  .slice(
                    0,
                    categories.findIndex((c) => c.id === category.id)
                  )
                  .reduce(
                    (acc, cat) =>
                      acc +
                      (expandedCategories.includes(cat.id)
                        ? getComponentsByCategory(cat.id).length
                        : 0),
                    0
                  );

                return (
                  <Collapsible
                    key={category.id}
                    open={isExpanded}
                    onOpenChange={() => toggleCategory(category.id)}
                  >
                    <CollapsibleTrigger
                      className="flex items-center justify-between w-full rounded-md hover:bg-accent transition-colors focus-visible-ring"
                      style={{ padding: 'var(--spacing-2)' }}
                      aria-expanded={isExpanded}
                    >
                      <div className="flex items-center gap-2" style={{ gap: 'var(--spacing-2)' }}>
                        <Hash className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm font-semibold">{category.label}</span>
                      </div>
                      <div className="flex items-center gap-2" style={{ gap: 'var(--spacing-2)' }}>
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                          {components.length}
                        </span>
                        <ChevronDown
                          className={cn(
                            'h-4 w-4 transition-transform duration-200',
                            isExpanded && 'rotate-180'
                          )}
                        />
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent
                      className="space-y-1 mt-1"
                      style={{
                        gap: 'var(--spacing-1)',
                        marginTop: 'var(--spacing-1)',
                      }}
                    >
                      {components.map((item, idx) => (
                        <ComponentItem
                          key={item.type}
                          item={item}
                          onAddComponent={handleAddComponent}
                          isFocused={
                            focusedIndex === categoryStartIndex + idx
                          }
                          onFocus={() =>
                            setFocusedIndex(categoryStartIndex + idx)
                          }
                          searchQuery={searchQuery}
                        />
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                );
              })
            )}
          </div>
        </ScrollArea>
      </div>
    </TooltipProvider>
  );
}
