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

const componentPaletteData: ComponentPaletteItem[] = [
  // Basic Components
  {
    type: 'text',
    label: 'Text',
    icon: Type,
    category: 'basic',
    defaultProps: {
      content: 'Click to edit text',
      fontSize: '16px',
      alignment: 'left',
    },
  },
  {
    type: 'heading',
    label: 'Heading',
    icon: Heading,
    category: 'basic',
    defaultProps: {
      content: 'Heading',
      level: 'h2',
      alignment: 'left',
    },
  },
  {
    type: 'button',
    label: 'Button',
    icon: MousePointer,
    category: 'basic',
    defaultProps: {
      text: 'Button',
      variant: 'default',
      size: 'md',
    },
  },
  {
    type: 'image',
    label: 'Image',
    icon: ImageIcon,
    category: 'basic',
    defaultProps: {
      alt: 'Image',
      objectFit: 'cover',
    },
  },
  {
    type: 'divider',
    label: 'Divider',
    icon: Minus,
    category: 'basic',
    defaultProps: {
      style: 'solid',
      thickness: '1px',
    },
  },
  // Layout Components
  {
    type: 'container',
    label: 'Container',
    icon: Box,
    category: 'layout',
    defaultProps: {
      maxWidth: '1200px',
      padding: '1rem',
    },
  },
  {
    type: 'grid',
    label: 'Grid',
    icon: LayoutGrid,
    category: 'layout',
    defaultProps: {
      columns: 2,
      gap: '1rem',
    },
  },
  {
    type: 'column',
    label: 'Column',
    icon: Columns,
    category: 'layout',
    defaultProps: {
      span: 1,
    },
  },
  {
    type: 'spacer',
    label: 'Spacer',
    icon: Space,
    category: 'layout',
    defaultProps: {
      height: '2rem',
    },
  },
  // Media Components
  {
    type: 'video',
    label: 'Video',
    icon: Video,
    category: 'media',
    defaultProps: {
      autoPlay: false,
      controls: true,
    },
  },
  {
    type: 'icon',
    label: 'Icon',
    icon: Sparkles,
    category: 'media',
    defaultProps: {
      name: 'star',
      size: '24px',
    },
  },
  {
    type: 'gallery',
    label: 'Gallery',
    icon: Images,
    category: 'media',
    defaultProps: {
      images: [],
      columns: 3,
    },
  },
  {
    type: 'carousel',
    label: 'Carousel',
    icon: ListVideo,
    category: 'media',
    defaultProps: {
      items: [],
      autoPlay: false,
    },
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
            <motion.button
              ref={drag}
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
                !isDragging && 'cursor-grab',
                isFocused && 'bg-[var(--component-item-focus)] ring-2 ring-primary/20',
                !isFocused && 'hover:bg-[var(--component-item-hover)]',
                justAdded && 'bg-[var(--component-item-active)]'
              )}
              style={{
                padding: 'var(--spacing-4)',
                gap: 'var(--spacing-3)',
              }}
              onClick={handleClick}
              onFocus={onFocus}
              tabIndex={0}
              whileHover={!isDragging ? { scale: 1.02 } : undefined}
              whileTap={{ scale: 0.98 }}
              animate={justAdded ? {
                scale: [1, 1.05, 1],
                backgroundColor: [
                  'var(--component-item-active)',
                  'var(--palette-active-bg)',
                  'transparent'
                ]
              } : undefined}
              transition={{ duration: 0.3, ease: 'easeOut' }}
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
            </motion.button>
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
  const [recentComponents, setRecentComponents] = useState<ComponentPaletteItem[]>([]);
  const [isPaletteActive, setIsPaletteActive] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const paletteRef = useRef<HTMLDivElement>(null);

  const handleAddComponent = useCallback((type: ComponentType) => {
    // Track recently used components
    const component = componentPaletteData.find(c => c.type === type);
    if (component) {
      setRecentComponents(prev => {
        const filtered = prev.filter(c => c.type !== type);
        return [component, ...filtered].slice(0, 5); // Keep last 5
      });
    }
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
    : [
        ...recentComponents,
        ...componentPaletteData.filter(
          (c) => !recentComponents.some((r) => r.type === c.type)
        ),
      ];

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

      if (!isPaletteActive) return;

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
          setIsPaletteActive(false);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isPaletteActive,
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
        className={cn(
          "w-64 border-r bg-background flex flex-col transition-all duration-200",
          isPaletteActive && "palette-active"
        )}
        onFocus={() => setIsPaletteActive(true)}
        onBlur={(e) => {
          // Only deactivate if focus is leaving the palette entirely
          if (!paletteRef.current?.contains(e.relatedTarget as Node)) {
            setIsPaletteActive(false);
            setFocusedIndex(-1);
          }
        }}
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
                {isPaletteActive ? 'Use ↑↓ to navigate, Enter to add' : 'Press / to search'}
              </p>
            </div>
            {isPaletteActive && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-2 h-2 rounded-full bg-primary"
                aria-label="Palette active indicator"
              />
            )}
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
        <ScrollArea className="flex-1">
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
            {/* Recently Used Section */}
            {recentComponents.length > 0 && !searchQuery && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="pb-4 border-b mb-4"
                style={{
                  paddingBottom: 'var(--spacing-4)',
                  marginBottom: 'var(--spacing-4)',
                }}
              >
                <div className="flex items-center justify-between mb-2" style={{ marginBottom: 'var(--spacing-2)' }}>
                  <h4 className="text-xs font-semibold text-primary uppercase tracking-wide">
                    Recently Used
                  </h4>
                  <span className="text-xs text-muted-foreground">{recentComponents.length}</span>
                </div>
                <div className="space-y-1" style={{ gap: 'var(--spacing-1)' }}>
                  {recentComponents.map((item, idx) => (
                    <ComponentItem
                      key={`recent-${item.type}`}
                      item={item}
                      onAddComponent={handleAddComponent}
                      isFocused={focusedIndex === idx}
                      onFocus={() => setFocusedIndex(idx)}
                      searchQuery={searchQuery}
                    />
                  ))}
                </div>
              </motion.div>
            )}

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
                const categoryStartIndex =
                  recentComponents.length +
                  categories
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
