import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { createPhotoCard, createFallbackCard, createCard, getCardConfig } from '../../public/app.js';

// ============================================================
// ARBITRARIES
// ============================================================

const photoRelArb = fc.record({
  id: fc.nat({ max: 100 }),
  name: fc.string({ minLength: 1, maxLength: 30 }),
  photos: fc.array(fc.constant('images/test01.jpg'), { minLength: 1, maxLength: 5 }),
  hasFallback: fc.constant(false)
});

const fallbackRelArb = fc.record({
  id: fc.nat({ max: 100 }),
  name: fc.string({ minLength: 1, maxLength: 50 }),
  photos: fc.constant([]),
  hasFallback: fc.constant(true)
});

const indexArb = fc.integer({ min: 1, max: 50 });

// ============================================================
// PROPERTY 6: Photo card structural completeness (img + name)
// ============================================================

describe('Feature: relationship-timeline, Property 6: Photo card structural completeness', () => {
  /**
   * Validates: Requirements 3.1, 3.2
   *
   * For any photo relationship, createPhotoCard produces a card with:
   * - An img element inside
   * - A .card-name element with the relationship name
   */
  it('should produce a card with an img element and a .card-name element displaying the name', () => {
    fc.assert(
      fc.property(photoRelArb, fc.constantFrom('os', 'polaroid'), fc.double({ min: -3, max: 3 }), (rel, frameType, rotation) => {
        const card = createPhotoCard(rel, frameType, rotation);

        // Card must contain an img element
        const img = card.querySelector('img');
        expect(img).not.toBeNull();

        // Card must contain a .card-name element with the relationship name
        const nameEl = card.querySelector('.card-name');
        expect(nameEl).not.toBeNull();
        expect(nameEl.textContent).toBe(rel.name);
      }),
      { numRuns: 100 }
    );
  });
});

// ============================================================
// PROPERTY 7: OS frame title bar structure (3 colored circles)
// ============================================================

describe('Feature: relationship-timeline, Property 7: OS frame title bar structure', () => {
  /**
   * Validates: Requirements 3.3
   *
   * For any photo relationship with frameType 'os', the card contains
   * a .os-titlebar with exactly 3 .os-btn elements.
   */
  it('should contain a .os-titlebar with exactly 3 .os-btn elements when frameType is os', () => {
    fc.assert(
      fc.property(photoRelArb, fc.double({ min: -3, max: 3 }), (rel, rotation) => {
        const card = createPhotoCard(rel, 'os', rotation);

        // Must have an .os-titlebar
        const titlebar = card.querySelector('.os-titlebar');
        expect(titlebar).not.toBeNull();

        // Must have exactly 3 .os-btn elements inside the titlebar
        const buttons = titlebar.querySelectorAll('.os-btn');
        expect(buttons.length).toBe(3);
      }),
      { numRuns: 100 }
    );
  });
});

// ============================================================
// PROPERTY 8: Polaroid frame rotation and border
// ============================================================

describe('Feature: relationship-timeline, Property 8: Polaroid frame class', () => {
  /**
   * Validates: Requirements 3.4
   *
   * For any photo relationship with frameType 'polaroid', the card
   * has the class `frame-polaroid` (rotation and border are CSS-based).
   */
  it('should have class frame-polaroid when frameType is polaroid', () => {
    fc.assert(
      fc.property(photoRelArb, fc.double({ min: -3, max: 3 }), (rel, rotation) => {
        const card = createPhotoCard(rel, 'polaroid', rotation);

        // Must have the frame-polaroid class
        expect(card.classList.contains('frame-polaroid')).toBe(true);
      }),
      { numRuns: 100 }
    );
  });
});

// ============================================================
// PROPERTY 9: Fallback card structure (name + humorous element)
// ============================================================

describe('Feature: relationship-timeline, Property 9: Fallback card structure', () => {
  /**
   * Validates: Requirements 4.2, 4.3
   *
   * For any fallback relationship, createFallbackCard produces a card with:
   * - A .fallback-name element displaying the name (truncated to 40 chars if needed)
   * - A .fallback-visual element (the humorous element)
   */
  it('should produce a card with .fallback-name (truncated if >40 chars) and .fallback-visual', () => {
    fc.assert(
      fc.property(fallbackRelArb, fc.double({ min: -3, max: 3 }), (rel, rotation) => {
        const card = createFallbackCard(rel, rotation);

        // Must have a .fallback-name element
        const nameEl = card.querySelector('.fallback-name');
        expect(nameEl).not.toBeNull();

        // Name should be truncated to 40 chars with ellipsis if exceeding
        if (rel.name.length > 40) {
          expect(nameEl.textContent).toBe(rel.name.substring(0, 40) + '...');
        } else {
          expect(nameEl.textContent).toBe(rel.name);
        }

        // Must have a .fallback-visual element (humorous element)
        const visualEl = card.querySelector('.fallback-visual');
        expect(visualEl).not.toBeNull();
        expect(visualEl.textContent.length).toBeGreaterThan(0);
      }),
      { numRuns: 100 }
    );
  });
});

// ============================================================
// PROPERTY 15: Card rotation within range (-3 to +3 degrees)
// ============================================================

describe('Feature: relationship-timeline, Property 15: Card rotation within range', () => {
  /**
   * Validates: Requirements 9.2
   *
   * For any index, getCardConfig(index).rotation is between -3 and +3.
   */
  it('should produce rotation between -3 and +3 degrees for any index', () => {
    fc.assert(
      fc.property(indexArb, (index) => {
        const config = getCardConfig(index);

        expect(config.rotation).toBeGreaterThanOrEqual(-3);
        expect(config.rotation).toBeLessThanOrEqual(3);
      }),
      { numRuns: 100 }
    );
  });
});

// ============================================================
// PROPERTY 16: Frame type alternation (odd=OS, even=Polaroid)
// ============================================================

describe('Feature: relationship-timeline, Property 16: Frame type alternation', () => {
  /**
   * Validates: Requirements 9.4
   *
   * For any odd index, getCardConfig(index).frameType === 'os';
   * for any even index, frameType === 'polaroid'.
   */
  it('should return frameType os for odd indices and polaroid for even indices', () => {
    const oddIndexArb = fc.integer({ min: 1, max: 50 }).filter(n => n % 2 === 1);
    const evenIndexArb = fc.integer({ min: 2, max: 50 }).filter(n => n % 2 === 0);

    // Test odd indices → 'os'
    fc.assert(
      fc.property(oddIndexArb, (index) => {
        const config = getCardConfig(index);
        expect(config.frameType).toBe('os');
      }),
      { numRuns: 100 }
    );

    // Test even indices → 'polaroid'
    fc.assert(
      fc.property(evenIndexArb, (index) => {
        const config = getCardConfig(index);
        expect(config.frameType).toBe('polaroid');
      }),
      { numRuns: 100 }
    );
  });
});
