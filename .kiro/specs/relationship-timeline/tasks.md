# Implementation Plan: Relationship Timeline

## Overview

Implementação de um site estático interativo estilo scrapbook com timeline horizontal de 18 relacionamentos passados. Construído com HTML, CSS e JavaScript vanilla, servido do diretório `/public/`. A implementação segue arquitetura data-driven com rendering dinâmico do DOM, molduras alternadas (OS/Polaroid), galeria modal, e visual artesanal com fontes manuscritas e corações decorativos. Testes com Vitest + fast-check para property-based testing.

## Tasks

- [x] 1. Set up project structure and core files
  - [x] 1.1 Create index.html with semantic structure
    - Create `/public/index.html` with HTML5 boilerplate
    - Include `<link>` to styles.css and `<script defer>` to app.js
    - Add Google Fonts link for handwriting/script fonts with `cursive` fallback
    - Define semantic containers: header, main (timeline container), and footer (seção final)
    - Add meta viewport for responsiveness
    - _Requirements: 10.1, 10.2, 10.4, 7.1_

  - [x] 1.2 Create styles.css with CSS custom properties and base theme
    - Define CSS custom properties for colors, fonts, spacing (scrapbook theme)
    - Set page background between #FFFFFF and #FAFAFA
    - Define font-family stacks with handwriting/script fonts and `cursive` fallback
    - Set up responsive base styles for viewports 320px to 1920px
    - Style the horizontal timeline line (2-4px black, centered vertically)
    - Style timeline dots (10-16px diameter circles)
    - Style decorative hearts (red, positioned near timeline)
    - Style vertical connectors between cards and dots
    - _Requirements: 7.4, 9.1, 1.1, 1.2, 1.3, 1.6_

  - [x] 1.3 Create app.js with data layer and module structure
    - Define `relationships` array with all 18 entries (id, name, photos, hasFallback)
    - Implement exact photo mappings per Requirement 6.2
    - Set up DOMContentLoaded entry point that triggers full render
    - Export/expose module functions for testability
    - _Requirements: 2.1, 6.1, 6.2, 6.3, 6.4, 10.1_

  - [x] 1.4 Set up Vitest + fast-check testing infrastructure
    - Initialize package.json with Vitest and fast-check dependencies
    - Create vitest.config.js with jsdom environment
    - Create test directory structure: `__tests__/unit/` and `__tests__/properties/`
    - Verify test runner executes with a placeholder test
    - _Requirements: 10.1_

- [x] 2. Implement Header and Timeline Renderer
  - [x] 2.1 Implement Header component
    - Render header as first visible element, full viewport width
    - Apply handwriting/script typography (min 32px mobile, 48px desktop)
    - Set minimum height of 120px
    - Add decorative elements consistent with scrapbook style
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

  - [x] 2.2 Implement Timeline Renderer (`renderTimeline`)
    - Create scrollable container with horizontal scroll (CSS scroll-behavior: smooth)
    - Render the horizontal black line (2-4px, centered vertically)
    - Iterate over relationships array and invoke Card Factory for each
    - Position cards alternately: odd index above, even index below
    - Create circular dot nodes at each card position on the line
    - Create vertical connectors linking cards to their dots
    - Distribute decorative hearts (minimum 1 per 2 cards)
    - Ensure responsive layout across 320px-1920px viewports
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 2.2, 2.3, 9.3_

  - [x] 2.3 Write property tests for timeline structure (Properties 1-5)
    - **Property 1: Rendering produces one dot per relationship**
    - **Property 2: Decorative hearts density (≥ ⌈N/2⌉)**
    - **Property 3: Rendering preserves chronological order**
    - **Property 4: Alternating card positions (odd=above, even=below)**
    - **Property 5: Every card has a vertical connector**
    - **Validates: Requirements 1.2, 1.3, 2.1, 2.2, 2.3, 9.3**

- [x] 3. Implement Card Factory and Card Components
  - [x] 3.1 Implement Card Factory (`createCard`)
    - Determine card type based on `hasFallback` boolean
    - Calculate position (above/below) based on 1-based index
    - Calculate frame type: odd index = 'os', even index = 'polaroid'
    - Generate random rotation between -3 and +3 degrees
    - Delegate to `createPhotoCard` or `createFallbackCard`
    - _Requirements: 2.2, 9.2, 9.4_

  - [x] 3.2 Implement Card_Foto Component (`createPhotoCard`)
    - Render img element with primary photo using `getPrimaryPhoto` logic
    - Apply object-fit: cover for image filling
    - Display name as caption in handwriting/script typography
    - Implement Moldura_OS: title bar with 3 colored circles (red, yellow, green, 8-14px diameter)
    - Implement Moldura_Polaroid: rotation -5 to +5 degrees, white bottom border ≥30px
    - Apply hover transition (200-400ms): scale 1.03-1.08 or translateY -3px to -8px
    - Attach click handler to open modal (gallery or single photo view)
    - Implement image load error handler with 5-second timeout triggering fallback
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 4.5, 5.1_

  - [x] 3.3 Implement Card_Fallback Component (`createFallbackCard`)
    - Render name centered (horizontal and vertical), largest text element
    - Truncate name at 40 characters with ellipsis if exceeding
    - Include at least 1 humorous visual element (silhouette, "?", or themed message)
    - Match dimensions, borders, and spacing of Card_Foto
    - Generate fallback cards for: Erick, Valmir vôlei, Fabio Jaboatão, Fábio amigo de Jacó
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

  - [x] 3.4 Implement primary photo selection logic (`getPrimaryPhoto`)
    - Search for photo with filename containing "01" before extension (case-insensitive)
    - If no "01" match, return first photo sorted alphabetically by filename
    - Handle empty arrays gracefully
    - _Requirements: 5.1_

  - [x] 3.5 Write property tests for card components (Properties 6-9, 15-16)
    - **Property 6: Photo card structural completeness (img + name)**
    - **Property 7: OS frame title bar structure (3 colored circles)**
    - **Property 8: Polaroid frame rotation and border**
    - **Property 9: Fallback card structure (name + humorous element)**
    - **Property 15: Card rotation within range (-3 to +3 degrees)**
    - **Property 16: Frame type alternation (odd=OS, even=Polaroid)**
    - **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 4.2, 4.3, 9.2, 9.4**

  - [x] 3.6 Write property tests for photo logic (Properties 11, 14, 17)
    - **Property 11: Primary photo selection (01 suffix priority, then alphabetical)**
    - **Property 14: File extension validation (.jpg, .jpeg, .png only)**
    - **Property 17: All image sources use relative paths**
    - **Validates: Requirements 5.1, 6.4, 10.3**

- [x] 4. Checkpoint - Ensure timeline renders correctly
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Implement Modal/Lightbox Controller
  - [x] 5.1 Implement Modal Controller structure and state
    - Create modal overlay element with dark background
    - Implement `modalState` object (isOpen, photos, currentIndex, triggerElement, type)
    - Create close button (X) element
    - Implement `closeModal()`: remove overlay, return focus to trigger element
    - Bind close actions: click outside, close button, Escape key
    - _Requirements: 5.4, 5.5_

  - [x] 5.2 Implement Gallery navigation (`openGallery`, `navigateGallery`)
    - Open modal with all photos for relationship, starting at primary photo
    - Render prev/next navigation buttons
    - Implement keyboard navigation (arrow left/right)
    - Clamp navigation: disable prev at index 0, disable next at index T-1
    - Display position indicator in "N de T" format (1-based display)
    - _Requirements: 5.2, 5.3, 5.6_

  - [x] 5.3 Implement Single Photo View (`openSinglePhoto`)
    - Display single photo centered, max 90% width and 90% height of viewport
    - Dark overlay background
    - Close on click outside, close button, or Escape key
    - _Requirements: 5.5_

  - [x] 5.4 Write property tests for gallery logic (Properties 12-13)
    - **Property 12: Gallery navigation bounds (clamped to 0..T-1)**
    - **Property 13: Gallery position indicator format ("N de T")**
    - **Validates: Requirements 5.3, 5.6**

  - [x] 5.5 Write unit tests for modal interactions
    - Test click outside closes modal
    - Test Escape key closes modal
    - Test focus returns to trigger element
    - Test gallery opens with correct start index
    - _Requirements: 5.4, 5.5_

- [x] 6. Implement Seção Final and Share Handler
  - [x] 6.1 Implement Seção Final component
    - Position as last element after 18th card (Izaac)
    - Display "CONTINUA..." text in handwriting/script typography
    - Include share button with consistent scrapbook styling
    - Add decorative elements (hearts) matching timeline visual
    - _Requirements: 8.1, 8.2, 8.4_

  - [x] 6.2 Implement Share Handler (`handleShare`)
    - Attempt `navigator.share({ title, url })` when available
    - Fallback: copy URL to clipboard via `navigator.clipboard.writeText()`
    - Show visual feedback "Link copiado! ✓" on successful clipboard copy
    - Handle errors: share cancellation (no-op), clipboard failure (error message)
    - _Requirements: 8.3_

  - [x] 6.3 Write unit tests for Share Handler
    - Test Web Share API path when available
    - Test clipboard fallback when Web Share unavailable
    - Test error handling for failed clipboard operation
    - _Requirements: 8.3_

- [x] 7. Integration, styling polish, and wiring
  - [x] 7.1 Wire all components together in app.js entry point
    - Connect DOMContentLoaded → renderHeader → renderTimeline → renderFinalSection
    - Set up event delegation on timeline container for card clicks
    - Wire share button click to handleShare
    - Ensure all 18 cards render with correct data, order, and visual styles
    - _Requirements: 1.5, 2.1, 10.1, 10.4_

  - [x] 7.2 Polish CSS styles for scrapbook visual consistency
    - Verify font stacks include handwriting/script with cursive fallback
    - Ensure hover transitions on Card_Foto (200-400ms, scale/translateY)
    - Verify responsive layout at 320px, 768px, 1024px, 1920px breakpoints
    - Confirm scroll-behavior: smooth on timeline container
    - Validate all colors, spacing, and decorative elements match scrapbook theme
    - _Requirements: 3.5, 7.3, 9.1, 9.2, 9.3, 1.4, 1.6_

  - [x] 7.3 Write unit tests for data validation and DOM structure
    - Test exactly 18 relationships in correct chronological order
    - Test correct photo mappings match Requirement 6.2
    - Test fallback targets: Erick, Valmir vôlei, Fabio Jaboatão, Fábio amigo de Jacó
    - Test header is first element, timeline follows, final section is last
    - Test relative paths for all image sources
    - _Requirements: 2.1, 4.4, 6.2, 7.1, 10.3_

- [x] 8. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document (17 properties total)
- Unit tests validate specific examples and edge cases
- The implementation uses HTML, CSS, and JavaScript vanilla only — no frameworks
- Testing uses Vitest with jsdom environment and fast-check for property-based tests
- All files live in `/public/` except test infrastructure (package.json, vitest.config.js, __tests__/)

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2", "1.3", "1.4"] },
    { "id": 1, "tasks": ["2.1", "2.2", "3.4"] },
    { "id": 2, "tasks": ["3.1"] },
    { "id": 3, "tasks": ["3.2", "3.3"] },
    { "id": 4, "tasks": ["2.3", "3.5", "3.6"] },
    { "id": 5, "tasks": ["5.1"] },
    { "id": 6, "tasks": ["5.2", "5.3"] },
    { "id": 7, "tasks": ["5.4", "5.5", "6.1", "6.2"] },
    { "id": 8, "tasks": ["6.3", "7.1"] },
    { "id": 9, "tasks": ["7.2"] },
    { "id": 10, "tasks": ["7.3"] }
  ]
}
```
