# Product Requirements Document: CMS Page Builder

**Version:** 1.0
**Date:** October 22, 2025
**Status:** Draft
**Author:** Product Team
**Project:** Admin Dashboard - CMS Page Builder Module

---

## Executive Summary

This document outlines the requirements for a drag-and-drop CMS page builder to be integrated into the Admin Dashboard application. The page builder will enable content creators to design and publish public-facing web pages using a visual, no-code interface with pre-built components.

### Key Objectives
- Empower non-technical users to create professional web pages
- Reduce development time for standard page creation by 80%
- Provide a flexible, component-based design system
- Enable responsive design without code knowledge
- Streamline content management workflow

---

## Product Overview

### Vision
Create an intuitive, powerful page builder that democratizes web page creation while maintaining design consistency and brand standards across all published pages.

### Target Users
- **Primary:** Content creators and marketing teams creating public-facing web pages
- **Secondary:** Administrators managing page templates and component libraries
- **Tertiary:** Developers extending the component library

### Success Criteria
- Users can create a complete landing page in under 15 minutes
- 90% of common page layouts achievable without custom code
- Zero technical knowledge required for basic page creation
- Pages render correctly across all device sizes

---

## Core Features

### 1. Drag-and-Drop Canvas

**Description:** Visual canvas where users can drag components and see real-time updates.

**Requirements:**
- Grid-based layout system for alignment
- Visual guides for component positioning
- Smooth drag-and-drop interactions
- Component highlighting on hover
- Visual feedback during drag operations
- Auto-scroll when dragging near edges
- Snap-to-grid functionality

**User Actions:**
- Drag components from component palette to canvas
- Reorder components by dragging
- Drag to resize components (where applicable)
- Click to select components
- Delete components (Delete key or context menu)

### 2. Component Library

**Description:** Comprehensive set of pre-built, configurable components organized by category.

#### Basic Components
| Component | Description | Configurable Properties |
|-----------|-------------|------------------------|
| **Text** | Paragraph text block | Content, font size, color, alignment, line height, margin/padding |
| **Heading** | H1-H6 headings | Content, level (H1-H6), color, alignment, font weight, margin |
| **Button** | Interactive CTA button | Label, variant (primary/secondary/outline), size, link URL, icon |
| **Image** | Image display | URL/upload, alt text, width/height, object-fit, border radius, caption |
| **Divider** | Horizontal separator | Color, thickness, margin, style (solid/dashed/dotted) |

#### Layout Components
| Component | Description | Configurable Properties |
|-----------|-------------|------------------------|
| **Container** | Wrapper with max-width | Max width, padding, background color, border |
| **Grid** | Multi-column layout | Columns (1-12), gap, alignment, responsive breakpoints |
| **Column** | Grid child element | Span (cols), offset, order, alignment |
| **Spacer** | Vertical spacing | Height, responsive sizes |

#### Media Components
| Component | Description | Configurable Properties |
|-----------|-------------|------------------------|
| **Video** | Video embed/player | URL (YouTube/Vimeo/direct), autoplay, controls, loop, muted |
| **Icon** | Icon display | Icon name (Lucide), size, color, stroke width |
| **Gallery** | Image grid | Images array, columns, gap, lightbox, captions |
| **Carousel** | Image slider | Images array, autoplay, interval, indicators, arrows |

### 3. Component Properties Panel

**Description:** Right sidebar panel for editing selected component properties.

**Requirements:**
- Context-aware: shows properties for selected component
- Organized into sections (Content, Style, Layout, Advanced)
- Real-time preview of changes
- Type-appropriate inputs:
  - Text: textarea
  - Numbers: number input with increment/decrement
  - Colors: color picker with presets
  - Select: dropdown with options
  - Toggle: switch/checkbox
- Reset to default option
- Copy/paste component styles

**Sections:**
1. **Content:** Text, URLs, media sources
2. **Style:** Colors, fonts, spacing
3. **Layout:** Width, height, positioning, margins
4. **Advanced:** Custom CSS classes, data attributes

### 4. Page Management

**Description:** CRUD operations for managing multiple pages.

**Requirements:**
- **Create:** New blank page or from template
- **Read:** List all pages with search/filter
- **Update:** Edit existing pages
- **Delete:** Remove pages (with confirmation)
- **Duplicate:** Clone existing pages
- **Organize:** Folders/categories for pages

**Page List View:**
- Grid/list toggle view
- Search by page name
- Filter by status (draft/published)
- Sort by date created/modified
- Thumbnail preview
- Quick actions (Edit, Duplicate, Delete, Preview)

**Page Metadata Editor:**
- Page title (browser tab title)
- URL slug (for routing)
- Meta description (SEO)
- Open Graph tags (social sharing)
  - OG title
  - OG description
  - OG image
- Published status (draft/published)
- Created/modified timestamps

### 5. Responsive Design System

**Description:** Multi-device preview and responsive configuration.

**Requirements:**
- Device mode switcher (Mobile / Tablet / Desktop)
- Breakpoints:
  - Mobile: 375px (iPhone SE)
  - Tablet: 768px (iPad)
  - Desktop: 1440px (standard laptop)
- Device-specific component properties
- Hide/show components per breakpoint
- Responsive spacing adjustments
- Visual device frame in preview mode

**Responsive Properties:**
- Font sizes per breakpoint
- Margins/padding per breakpoint
- Grid columns per breakpoint
- Image sizes per breakpoint
- Component visibility per breakpoint

### 6. History & Undo/Redo

**Description:** Time-travel functionality for reverting changes.

**Requirements:**
- Unlimited undo/redo (within session)
- Keyboard shortcuts:
  - Undo: Cmd+Z (Mac) / Ctrl+Z (Windows)
  - Redo: Cmd+Shift+Z / Ctrl+Y
- Visual history timeline (optional)
- Auto-save drafts every 30 seconds
- Restore from auto-save on crash recovery

**State Tracking:**
- Component addition/removal
- Property changes
- Component reordering
- Layout changes

### 7. Live Preview

**Description:** Real-time preview of page as it's being built.

**Requirements:**
- Instant updates on property changes (< 100ms)
- Preview mode toggle (edit/preview)
- Full-screen preview mode
- Share preview link (temporary URL)
- Preview in new tab/window

**Preview Features:**
- Interactive components (buttons, links work)
- Accurate responsive rendering
- Same styling as published pages
- Performance metrics display (optional)

---

## Technical Architecture

### Tech Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Framework** | Next.js | 15.5.4 | App framework with App Router |
| **UI Library** | React | 19.1.0 | Component rendering |
| **State Management** | Zustand | 5.0.8 | Global state (page, components, history) |
| **Drag & Drop** | react-dnd | 16.0.1 | Drag-and-drop interactions |
| **UI Components** | Radix UI | Latest | Accessible UI primitives |
| **Styling** | Tailwind CSS | 4.0 | Utility-first CSS |
| **Forms** | react-hook-form + Zod | Latest | Form handling and validation |
| **Icons** | Lucide React | Latest | Icon library |
| **Animation** | Motion (Framer Motion) | 12.23.22 | Smooth animations |

### State Management Architecture (Zustand)

#### Store Structure

```typescript
// stores/page-builder-store.ts

interface PageBuilderStore {
  // Current page being edited
  currentPage: Page | null;

  // All pages
  pages: Page[];

  // Components on canvas
  components: Component[];

  // Selected component ID
  selectedComponentId: string | null;

  // History for undo/redo
  history: {
    past: PageState[];
    present: PageState;
    future: PageState[];
  };

  // UI state
  ui: {
    deviceMode: 'mobile' | 'tablet' | 'desktop';
    isPreviewMode: boolean;
    isDragging: boolean;
    showGrid: boolean;
  };

  // Actions
  actions: {
    // Page actions
    createPage: (name: string) => void;
    loadPage: (id: string) => void;
    savePage: () => Promise<void>;
    deletePage: (id: string) => void;
    duplicatePage: (id: string) => void;
    updatePageMetadata: (metadata: Partial<PageMetadata>) => void;

    // Component actions
    addComponent: (type: ComponentType, position: number) => void;
    removeComponent: (id: string) => void;
    updateComponent: (id: string, props: Partial<ComponentProps>) => void;
    moveComponent: (fromIndex: number, toIndex: number) => void;
    duplicateComponent: (id: string) => void;
    selectComponent: (id: string | null) => void;

    // History actions
    undo: () => void;
    redo: () => void;
    clearHistory: () => void;

    // UI actions
    setDeviceMode: (mode: 'mobile' | 'tablet' | 'desktop') => void;
    togglePreviewMode: () => void;
    setIsDragging: (isDragging: boolean) => void;
  };
}
```

#### Data Models

```typescript
// types/page-builder.ts

interface Page {
  id: string;
  name: string;
  slug: string;
  components: Component[];
  metadata: PageMetadata;
  status: 'draft' | 'published';
  createdAt: Date;
  updatedAt: Date;
}

interface PageMetadata {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  keywords?: string[];
}

interface Component {
  id: string;
  type: ComponentType;
  props: ComponentProps;
  children?: Component[];
  order: number;
}

type ComponentType =
  // Basic
  | 'text'
  | 'heading'
  | 'button'
  | 'image'
  | 'divider'
  // Layout
  | 'container'
  | 'grid'
  | 'column'
  | 'spacer'
  // Media
  | 'video'
  | 'icon'
  | 'gallery'
  | 'carousel';

interface ComponentProps {
  // Common
  id?: string;
  className?: string;
  style?: React.CSSProperties;

  // Responsive
  responsive?: {
    mobile?: Partial<ComponentProps>;
    tablet?: Partial<ComponentProps>;
    desktop?: Partial<ComponentProps>;
  };

  // Component-specific
  [key: string]: any;
}

interface PageState {
  components: Component[];
  selectedComponentId: string | null;
  timestamp: number;
}
```

### Data Persistence (Mock API)

**Implementation:** JSON file-based mock API simulating backend.

```
/admin-dashboard/
  data/
    pages/
      index.json          # List of all pages
      {page-id}.json      # Individual page data
    templates/
      landing.json
      article.json
```

**API Endpoints (Simulated):**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/pages` | List all pages |
| GET | `/api/pages/:id` | Get single page |
| POST | `/api/pages` | Create new page |
| PUT | `/api/pages/:id` | Update page |
| DELETE | `/api/pages/:id` | Delete page |
| POST | `/api/pages/:id/duplicate` | Duplicate page |
| GET | `/api/templates` | List templates |

**Implementation Approach:**
- Next.js API routes reading/writing JSON files
- File system operations using `fs/promises`
- Simulated latency (200-500ms) for realistic UX
- Error handling for missing files
- Data validation with Zod schemas

### Component Architecture

```
/app/
  (dashboard)/
    cms/
      page.tsx                    # CMS page list
      [id]/
        page.tsx                  # Editor page

/components/
  cms/
    editor/
      Canvas.tsx                  # Drag-drop canvas
      ComponentPalette.tsx        # Component library sidebar
      PropertiesPanel.tsx         # Properties editor
      Toolbar.tsx                 # Top toolbar (save, preview, etc.)
      DeviceModeSwitch.tsx        # Responsive mode switcher

    components/
      registry/
        basic/
          Text.tsx
          Heading.tsx
          Button.tsx
          Image.tsx
          Divider.tsx
        layout/
          Container.tsx
          Grid.tsx
          Column.tsx
          Spacer.tsx
        media/
          Video.tsx
          Icon.tsx
          Gallery.tsx
          Carousel.tsx

      ComponentRenderer.tsx       # Renders component by type
      ComponentWrapper.tsx        # Wrapper with selection/drag handlers

    pages/
      PageList.tsx                # Grid/list of pages
      PageCard.tsx                # Single page preview card
      CreatePageDialog.tsx        # New page modal
      PageMetadataEditor.tsx      # SEO/metadata form

/stores/
  page-builder-store.ts           # Zustand store

/lib/
  cms/
    component-registry.ts         # Component type definitions
    api-client.ts                 # Mock API client
    serializer.ts                 # JSON serialization
    validator.ts                  # Schema validation
```

---

## User Interface & Experience

### Layout Structure

```
┌─────────────────────────────────────────────────────────────────┐
│ Header: Breadcrumb | Device Mode | Preview | Save | Publish    │
├─────────┬───────────────────────────────────────────┬───────────┤
│         │                                           │           │
│ Compo-  │                                           │  Proper-  │
│ nent    │             Canvas                        │  ties     │
│ Palette │          (Drag & Drop)                    │  Panel    │
│         │                                           │           │
│ - Basic │                                           │  Selected:│
│ - Layout│                                           │  Button   │
│ - Media │                                           │           │
│         │                                           │  Content  │
│         │                                           │  Style    │
│         │                                           │  Layout   │
└─────────┴───────────────────────────────────────────┴───────────┘
```

### User Workflows

#### Creating a New Page

1. Navigate to CMS section from sidebar
2. Click "Create New Page" button
3. Enter page name and slug
4. Choose template (blank or preset)
5. Redirected to editor with empty/template canvas
6. Drag components from palette to canvas
7. Click component to edit properties in right panel
8. Preview page in different device modes
9. Save as draft or publish immediately

#### Editing a Component

1. Click component on canvas → highlights with selection border
2. Properties panel updates with component-specific fields
3. Edit properties (text, colors, spacing, etc.)
4. Changes reflect in real-time on canvas
5. Click outside or press Escape to deselect

#### Responsive Design

1. Toggle device mode (Mobile → Tablet → Desktop)
2. Canvas resizes to device width
3. Adjust component properties for current breakpoint
4. Properties panel shows breakpoint-specific fields
5. Preview changes across all devices

#### Publishing a Page

1. Click "Publish" button in toolbar
2. Review page metadata (title, description, OG tags)
3. Edit metadata if needed
4. Confirm publish action
5. Page status changes to "published"
6. Shareable URL generated

---

## Implementation Phases

### Phase 1: Foundation (Week 1)
**Goal:** Core infrastructure and basic functionality

**Tasks:**
- Set up Zustand store with basic state
- Create page list view with mock data
- Implement routing (`/app/cms` and `/app/cms/[id]`)
- Basic canvas with grid layout
- Add CMS section to sidebar navigation

**Deliverables:**
- Empty CMS page accessible from dashboard
- Page list displaying mock pages
- Clicking page opens editor (empty canvas)

### Phase 2: Component System (Week 2)
**Goal:** Component library and drag-drop

**Tasks:**
- Implement component registry
- Create 5 basic components (Text, Heading, Button, Image, Divider)
- Component palette sidebar
- Drag-and-drop functionality with react-dnd
- Component rendering on canvas

**Deliverables:**
- Functional component palette
- Drag components to canvas
- Components render correctly
- Component selection (click to select)

### Phase 3: Properties & Editing (Week 2-3)
**Goal:** Component configuration

**Tasks:**
- Properties panel component
- Property input components (text, color, select, number)
- Real-time property updates
- Component deletion
- Component duplication

**Deliverables:**
- Edit component properties
- Changes reflect immediately
- Delete/duplicate components
- Property validation

### Phase 4: Layout Components (Week 3)
**Goal:** Layout system

**Tasks:**
- Container component
- Grid component with column system
- Column component (nested in Grid)
- Spacer component
- Nested drag-drop support

**Deliverables:**
- All 4 layout components functional
- Drag components into containers/grids
- Responsive grid columns

### Phase 5: Media Components (Week 4)
**Goal:** Rich media

**Tasks:**
- Video component (YouTube/Vimeo embed)
- Icon component (Lucide icons)
- Gallery component (image grid)
- Carousel component (image slider)

**Deliverables:**
- All 4 media components functional
- Image upload/URL support
- Video embed working
- Gallery and carousel interactive

### Phase 6: History & Persistence (Week 4-5)
**Goal:** Undo/redo and save/load

**Tasks:**
- History stack implementation
- Undo/redo actions
- Keyboard shortcuts
- Mock API endpoints
- Save/load functionality
- Auto-save drafts

**Deliverables:**
- Undo/redo working
- Save pages to JSON
- Load pages from JSON
- Auto-save every 30s

### Phase 7: Responsive & Preview (Week 5)
**Goal:** Multi-device support

**Tasks:**
- Device mode switcher
- Responsive canvas resizing
- Breakpoint-specific properties
- Live preview mode
- Preview in new tab

**Deliverables:**
- Switch between device modes
- Canvas resizes correctly
- Set properties per breakpoint
- Preview mode toggle

### Phase 8: Metadata & SEO (Week 6)
**Goal:** Page metadata and SEO

**Tasks:**
- Page metadata editor component
- SEO fields (title, description)
- Open Graph tags
- URL slug editor
- Publish/draft status

**Deliverables:**
- Edit page metadata
- Preview OG tags
- Change page status
- Generate preview URLs

### Phase 9: Polish & UX (Week 6-7)
**Goal:** Refinement and user experience

**Tasks:**
- Animations and transitions
- Loading states
- Error handling
- Toast notifications
- i18n translations
- Empty states
- Onboarding tooltips

**Deliverables:**
- Smooth animations
- Helpful error messages
- Loading indicators
- Polished UX throughout

### Phase 10: Testing & Documentation (Week 7)
**Goal:** Quality assurance

**Tasks:**
- Unit tests for components
- Integration tests for store
- E2E tests for workflows
- User documentation
- Developer documentation
- Performance optimization

**Deliverables:**
- Test coverage > 80%
- User guide
- Developer docs
- Optimized performance

---

## Success Metrics

### Key Performance Indicators (KPIs)

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Time to Create Page** | < 15 minutes | Average time from "New Page" to "Publish" |
| **Component Library Usage** | 100% components used | Track which components are most/least used |
| **User Satisfaction** | > 4.5/5 stars | User survey after using CMS |
| **Bug Rate** | < 1 bug per 100 pages | Track errors during page creation |
| **Page Load Performance** | < 2s | Lighthouse score for published pages |
| **Mobile Responsiveness** | 100% pages responsive | Automated responsive tests |

### Analytics to Track

- Pages created per user
- Most used components
- Average components per page
- Draft-to-publish ratio
- Undo/redo usage frequency
- Device mode usage (Mobile vs Tablet vs Desktop)
- Time spent in editor
- Property edit frequency
- Template usage vs blank pages

---

## Future Enhancements (Post-MVP)

### Phase 2 Features (3-6 months)

1. **Advanced Components**
   - Form builder with validation
   - Accordion/tabs
   - Modal/popup
   - Countdown timer
   - Pricing tables
   - Testimonial sliders

2. **Component Marketplace**
   - Community-contributed components
   - Premium component packs
   - Component ratings and reviews
   - One-click component installation

3. **Collaboration Features**
   - Real-time co-editing (WebSockets)
   - Comments and annotations
   - Version history with diffs
   - User permissions (view/edit/publish)
   - Activity log

4. **Advanced Design Tools**
   - Custom CSS editor
   - CSS animation builder
   - Custom fonts upload
   - Brand color palette manager
   - Design system variables

5. **Integrations**
   - Analytics integration (Google Analytics, Plausible)
   - A/B testing
   - Form submission webhooks
   - Email marketing integrations
   - CRM integrations

6. **Performance & SEO**
   - Image optimization pipeline
   - Lazy loading
   - Critical CSS extraction
   - Structured data editor (JSON-LD)
   - Sitemap generation
   - Accessibility checker (WCAG compliance)

7. **Export & Deployment**
   - Export as HTML/CSS
   - Deploy to Vercel/Netlify
   - Custom domain mapping
   - CDN integration
   - Preview environments

---

## Technical Constraints

### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- No IE11 support

### Performance Requirements
- Canvas render time: < 100ms
- Property update latency: < 50ms
- Auto-save operation: < 500ms
- Page load (10 components): < 1s
- Smooth 60fps drag-and-drop

### Accessibility Requirements
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader compatible
- Focus management
- Color contrast ratios
- ARIA labels

### Security Considerations
- XSS protection (sanitize user input)
- CSRF tokens for API calls
- Content Security Policy headers
- Image upload validation
- Rate limiting on saves
- User permission checks

---

## Open Questions & Decisions Needed

1. **Component Nesting:** Should all components support nesting, or only layout components?
   - **Recommendation:** Only layout components (Container, Grid) support children

2. **Custom Code:** Should power users have access to custom HTML/CSS?
   - **Recommendation:** Not in MVP, add in Phase 2 with sandboxing

3. **Asset Management:** How should images be stored (CDN, local, cloud storage)?
   - **Recommendation:** Start with URLs, add upload to cloud storage (S3/Cloudinary) later

4. **URL Structure:** What URL pattern for published pages?
   - **Recommendation:** `/pages/{slug}` or custom subdomain `{slug}.yourdomain.com`

5. **Draft Sharing:** Should drafts be shareable with preview links?
   - **Recommendation:** Yes, generate temporary tokens for preview URLs

6. **Component Versioning:** How to handle component library updates?
   - **Recommendation:** Snapshot component version with page, allow manual updates

---

## Risks & Mitigation

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| **Complex drag-drop bugs** | High | Medium | Extensive testing, use battle-tested react-dnd library |
| **Performance with many components** | High | Medium | Virtualization, lazy loading, performance budgets |
| **State management complexity** | Medium | High | Clear Zustand patterns, thorough documentation |
| **Browser compatibility issues** | Medium | Low | Polyfills, progressive enhancement, browser testing |
| **Scope creep** | High | High | Strict phase gates, MVP feature lockdown |
| **User adoption** | High | Medium | User testing, onboarding, documentation |

---

## Appendix

### Glossary

- **Canvas:** The visual editing area where components are placed
- **Component:** A reusable UI building block (button, text, image, etc.)
- **Component Palette:** Sidebar showing available components to drag
- **Properties Panel:** Sidebar for editing selected component properties
- **Breakpoint:** Screen width at which responsive design changes (mobile/tablet/desktop)
- **Slug:** URL-friendly page identifier (e.g., "about-us")
- **OG Tags:** Open Graph meta tags for social media sharing

### References

- **Design Inspiration:**
  - Webflow: webflow.com
  - Framer: framer.com
  - WordPress Gutenberg: wordpress.org/gutenberg
  - Wix Editor: wix.com

- **Technical Documentation:**
  - Zustand: https://github.com/pmndrs/zustand
  - react-dnd: https://react-dnd.github.io/react-dnd
  - Next.js App Router: https://nextjs.org/docs/app

### Changelog

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-10-22 | Product Team | Initial PRD draft |

---

## Approval & Sign-off

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Product Owner | | | |
| Tech Lead | | | |
| Design Lead | | | |
| Engineering Manager | | | |

---

**End of Document**
