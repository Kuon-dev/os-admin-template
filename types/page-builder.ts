// Core component types
export type ComponentType =
  // Basic components
  | 'text'
  | 'heading'
  | 'button'
  | 'image'
  | 'divider'
  // Layout components
  | 'container'
  | 'grid'
  | 'column'
  | 'spacer'
  // Media components
  | 'video'
  | 'icon'
  | 'gallery'
  | 'carousel';

export type DeviceMode = 'mobile' | 'tablet' | 'desktop';
export type PageStatus = 'draft' | 'published';
export type AlignmentType = 'left' | 'center' | 'right' | 'justify';
export type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
export type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
export type DividerStyle = 'solid' | 'dashed' | 'dotted';

// New type definitions
export type AnimationType = 'none' | 'fadeIn' | 'slideInUp' | 'slideInDown' | 'slideInLeft' | 'slideInRight' | 'zoomIn' | 'bounceIn';
export type TextTransform = 'none' | 'uppercase' | 'lowercase' | 'capitalize';
export type TextDecoration = 'none' | 'underline' | 'line-through';
export type LoadingType = 'lazy' | 'eager';
export type AspectRatio = '16:9' | '4:3' | '1:1' | 'custom';
export type ObjectPosition = 'center' | 'top' | 'bottom' | 'left' | 'right';
export type ImageFilter = 'none' | 'grayscale' | 'sepia' | 'brightness' | 'contrast';
export type BackgroundSize = 'cover' | 'contain' | 'auto';
export type BackgroundPosition = 'center' | 'top' | 'bottom' | 'left' | 'right';
export type BackgroundAttachment = 'scroll' | 'fixed';
export type DisplayType = 'block' | 'flex';
export type AlignItems = 'start' | 'center' | 'end' | 'stretch';
export type JustifyContent = 'start' | 'center' | 'end' | 'space-between' | 'space-around';
export type IconPosition = 'left' | 'right' | 'none';
export type DividerWidth = 'full' | 'percentage' | 'px';
export type DividerAlignment = 'left' | 'center' | 'right';

// Component property interfaces
export interface BaseComponentProps {
  id: string;
  type: ComponentType;
  parentId?: string;
  children?: Component[];
}

// ============================================================================
// SOLID Principle: Interface Segregation
// Segregated interfaces allow components to depend only on what they need
// ============================================================================

/**
 * Spacing properties interface
 * Components that need spacing extend this
 */
export interface SpacingPropsInterface {
  marginTop?: string;
  marginBottom?: string;
  marginLeft?: string;
  marginRight?: string;
  paddingTop?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  paddingRight?: string;
}

/**
 * Visibility/Responsive properties interface
 * Components that need responsive visibility extend this
 */
export interface VisibilityPropsInterface {
  visibility?: {
    mobile: boolean;
    tablet: boolean;
    desktop: boolean;
  };
}

/**
 * Animation properties interface
 * Components that need animations extend this
 */
export interface AnimationPropsInterface {
  animation?: AnimationType;
  animationDuration?: number; // in ms
  animationDelay?: number; // in ms
}

/**
 * Custom styling properties interface
 * Components that allow custom CSS extend this
 */
export interface CustomStylingPropsInterface {
  customCssClasses?: string[];
  customCss?: string;
}

/**
 * Typography properties interface
 * Text-based components extend this
 */
export interface TypographyPropsInterface {
  fontSize?: string;
  fontWeight?: string;
  fontFamily?: string;
  color?: string;
  alignment?: AlignmentType;
  lineHeight?: string;
  letterSpacing?: string;
  textTransform?: TextTransform;
  textDecoration?: TextDecoration;
}

/**
 * Link behavior properties interface
 * Components that can act as links extend this
 */
export interface LinkPropsInterface {
  link?: string;
  openInNewTab?: boolean;
}

/**
 * Border properties interface
 * Components with borders extend this
 */
export interface BorderPropsInterface {
  border?: string;
  borderRadius?: string;
  borderColor?: string;
  borderWidth?: string;
  borderStyle?: string;
}

/**
 * Effect properties interface
 * Components with visual effects extend this
 */
export interface EffectPropsInterface {
  opacity?: number;
  shadow?: string;
}

/**
 * Common properties shared by all components
 * Legacy interface maintained for backward compatibility
 * New components should use the segregated interfaces above
 * @deprecated Use segregated interfaces instead
 */
export interface CommonComponentProps
  extends SpacingPropsInterface,
    VisibilityPropsInterface,
    AnimationPropsInterface,
    CustomStylingPropsInterface {}

export interface TextProps extends CommonComponentProps {
  content: string;
  // Typography
  fontSize?: string;
  fontWeight?: string;
  fontFamily?: string;
  color?: string;
  alignment?: AlignmentType;
  lineHeight?: string;
  letterSpacing?: string;
  textTransform?: TextTransform;
  textDecoration?: TextDecoration;
  // Effects
  textShadow?: string;
  opacity?: number;
  // Link
  link?: string;
  openInNewTab?: boolean;
}

export interface HeadingProps extends CommonComponentProps {
  content: string;
  level: HeadingLevel;
  // Typography
  fontSize?: string;
  fontWeight?: string;
  fontFamily?: string;
  color?: string;
  alignment?: AlignmentType;
  lineHeight?: string;
  letterSpacing?: string;
  textTransform?: TextTransform;
  textDecoration?: TextDecoration;
  // Effects
  textShadow?: string;
  opacity?: number;
  // SEO
  anchorId?: string; // for anchor links
}

export interface ButtonProps extends CommonComponentProps {
  text: string;
  variant?: ButtonVariant;
  size?: 'sm' | 'md' | 'lg';
  // Link Behavior
  href?: string;
  openInNewTab?: boolean;
  disabled?: boolean;
  // Icon Support
  icon?: string;
  iconPosition?: IconPosition;
  // Custom Styling
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  borderWidth?: string;
  borderRadius?: string;
  // Hover States
  hoverBackgroundColor?: string;
  hoverTextColor?: string;
  hoverBorderColor?: string;
  // Effects
  shadow?: string;
  hoverShadow?: string;
  // Spacing
  paddingX?: string;
  paddingY?: string;
  fullWidth?: boolean;
}

export interface ImageProps extends CommonComponentProps {
  src?: string;
  alt: string;
  width?: string;
  height?: string;
  // Fit & Position
  objectFit?: 'cover' | 'contain' | 'fill' | 'none';
  objectPosition?: ObjectPosition;
  aspectRatio?: AspectRatio;
  // Border & Effects
  border?: string;
  borderRadius?: string;
  shadow?: string;
  opacity?: number;
  filter?: ImageFilter;
  // Link
  link?: string;
  openInNewTab?: boolean;
  // Performance
  loading?: LoadingType;
}

export interface DividerProps extends CommonComponentProps {
  style?: DividerStyle;
  thickness?: string;
  color?: string;
  // Layout
  width?: string; // can be '100%', '50%', '200px', etc.
  widthType?: DividerWidth;
  alignment?: DividerAlignment;
  // Effects
  opacity?: number;
  gradient?: boolean; // if true, applies gradient instead of solid color
}

export interface ContainerProps extends CommonComponentProps {
  maxWidth?: string;
  // Background
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundSize?: BackgroundSize;
  backgroundPosition?: BackgroundPosition;
  backgroundRepeat?: boolean;
  backgroundAttachment?: BackgroundAttachment;
  // Border & Effects
  border?: string;
  borderStyle?: DividerStyle;
  borderRadius?: string;
  shadow?: string;
  opacity?: number;
  // Layout
  minHeight?: string;
  height?: string;
  display?: DisplayType;
  alignItems?: AlignItems;
  justifyContent?: JustifyContent;
}

export interface GridProps extends CommonComponentProps {
  columns: number;
  // Gap Control
  gap?: string;
  rowGap?: string;
  columnGap?: string;
  // Alignment
  alignItems?: AlignItems;
  justifyItems?: AlignItems;
  // Responsive
  minColumnWidth?: string;
  autoRows?: string;
  // Styling
  backgroundColor?: string;
  borderRadius?: string;
}

export interface ColumnProps extends CommonComponentProps {
  span?: number;
  // Positioning
  offset?: number;
  order?: number;
  // Alignment
  alignSelf?: AlignItems | 'auto';
  justifySelf?: AlignItems | 'auto';
  // Styling
  backgroundColor?: string;
  border?: string;
  borderRadius?: string;
  shadow?: string;
}

export interface SpacerProps extends CommonComponentProps {
  height: string;
  // Responsive Heights
  heightMobile?: string;
  heightTablet?: string;
  heightDesktop?: string;
  // Debug
  showDebugOutline?: boolean;
}

export interface VideoProps {
  src?: string;
  poster?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
}

export interface IconProps {
  name: string;
  size?: string;
  color?: string;
}

export interface GalleryProps {
  images: Array<{
    src: string;
    alt: string;
    caption?: string;
  }>;
  columns?: number;
  gap?: string;
}

export interface CarouselProps {
  items: Array<{
    type: 'image' | 'video';
    src: string;
    alt?: string;
    caption?: string;
  }>;
  autoPlay?: boolean;
  interval?: number;
  showControls?: boolean;
  showIndicators?: boolean;
}

// Union type for all component props
export type ComponentProps =
  | TextProps
  | HeadingProps
  | ButtonProps
  | ImageProps
  | DividerProps
  | ContainerProps
  | GridProps
  | ColumnProps
  | SpacerProps
  | VideoProps
  | IconProps
  | GalleryProps
  | CarouselProps;

// Component structure
export interface Component extends BaseComponentProps {
  props: ComponentProps;
}

// Page metadata
export interface PageMetadata {
  title: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
  canonicalUrl?: string;
}

// Page structure
export interface Page {
  id: string;
  name: string;
  slug: string;
  components: Component[];
  metadata: PageMetadata;
  status: PageStatus;
  createdAt: string;
  updatedAt: string;
}

// History state for undo/redo
export interface PageState {
  components: Component[];
  timestamp: number;
}

// UI state
export interface UIState {
  deviceMode: DeviceMode;
  isPreviewMode: boolean;
  isDragging: boolean;
  showGrid: boolean;
  propertiesPanelWidth: number;
  propertiesPanelCollapsed: boolean;
  componentPaletteCollapsed: boolean;
  activeDropZone: { position: number; parentId?: string } | null;
}

// Store actions
export interface PageBuilderActions {
  // Page actions
  createPage: (name: string, slug: string) => void;
  loadPage: (id: string) => Promise<void>;
  savePage: () => Promise<void>;
  deletePage: (id: string) => Promise<void>;
  duplicatePage: (id: string) => void;
  updatePageMetadata: (metadata: Partial<PageMetadata>) => void;
  setPages: (pages: Page[]) => void;

  // Component actions
  addComponent: (type: ComponentType, position: number, parentId?: string) => void;
  removeComponent: (id: string) => void;
  updateComponent: (id: string, props: Partial<ComponentProps>) => void;
  moveComponent: (componentId: string, newPosition: number, newParentId?: string) => void;
  duplicateComponent: (id: string) => void;
  selectComponent: (id: string | null) => void;

  // History actions
  undo: () => void;
  redo: () => void;
  clearHistory: () => void;
  saveToHistory: () => void;

  // UI actions
  setDeviceMode: (mode: DeviceMode) => void;
  togglePreviewMode: () => void;
  setIsDragging: (isDragging: boolean) => void;
  toggleGrid: () => void;
  setPropertiesPanelWidth: (width: number) => void;
  togglePropertiesPanel: () => void;
  toggleComponentPalette: () => void;
  setActiveDropZone: (position: number, parentId?: string) => void;
  clearActiveDropZone: () => void;
}

// Full store state
export interface PageBuilderStore {
  currentPage: Page | null;
  pages: Page[];
  selectedComponentId: string | null;
  history: {
    past: PageState[];
    present: PageState | null;
    future: PageState[];
  };
  ui: UIState;
  actions: PageBuilderActions;
}

// Component palette item
export interface ComponentPaletteItem {
  type: ComponentType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  category: 'basic' | 'layout' | 'media';
  defaultProps: Partial<ComponentProps>;
}

// DnD types
export interface DragItem {
  type: 'component' | 'new-component';
  componentType?: ComponentType;
  componentId?: string;
  index?: number;
}

export interface DropResult {
  position: number;
  parentId?: string;
}
