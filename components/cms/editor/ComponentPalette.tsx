"use client";

import { useState } from 'react';
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
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import type { ComponentType, ComponentPaletteItem } from '@/types/page-builder';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

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

interface ComponentItemProps {
  item: ComponentPaletteItem;
  onAddComponent: (type: ComponentType) => void;
}

function ComponentItem({ item, onAddComponent }: ComponentItemProps) {
  const Icon = item.icon;

  const [{ isDragging }, drag] = useDrag({
    type: 'new-component',
    item: { type: 'new-component', componentType: item.type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className={cn(
        'flex items-center gap-3 w-full p-3 rounded-lg',
        'hover:bg-accent hover:text-accent-foreground',
        'transition-colors cursor-grab active:cursor-grabbing',
        'text-left',
        isDragging && 'opacity-50'
      )}
      onClick={() => onAddComponent(item.type)}
    >
      <GripVertical className="h-4 w-4 text-muted-foreground flex-shrink-0" />
      <div className="p-2 bg-background rounded-md border">
        <Icon className="h-4 w-4" />
      </div>
      <span className="text-sm font-medium">{item.label}</span>
    </div>
  );
}

export function ComponentPalette() {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([
    'basic',
    'layout',
    'media',
  ]);

  const handleAddComponent = (type: ComponentType) => {
    // This will be handled by drag and drop
    console.log('Add component:', type);
  };

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

  return (
    <div className="w-64 border-r bg-background flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <h3 className="font-semibold">Components</h3>
        <p className="text-xs text-muted-foreground mt-1">
          Drag to add to canvas
        </p>
      </div>

      {/* Component List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {categories.map((category) => {
            const components = getComponentsByCategory(category.id);
            const isExpanded = expandedCategories.includes(category.id);

            return (
              <Collapsible
                key={category.id}
                open={isExpanded}
                onOpenChange={() => toggleCategory(category.id)}
              >
                <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-md hover:bg-accent">
                  <span className="text-sm font-medium">{category.label}</span>
                  <ChevronDown
                    className={cn(
                      'h-4 w-4 transition-transform',
                      isExpanded && 'rotate-180'
                    )}
                  />
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-1 mt-1">
                  {components.map((item) => (
                    <ComponentItem
                      key={item.type}
                      item={item}
                      onAddComponent={handleAddComponent}
                    />
                  ))}
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
