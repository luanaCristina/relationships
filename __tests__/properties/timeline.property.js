import { describe, it, expect, beforeEach } from 'vitest';
import fc from 'fast-check';
import { renderTimeline } from '../../public/app.js';

/**
 * Property-Based Tests for Timeline Structure (Properties 1-5)
 * 
 * Validates: Requirements 1.2, 1.3, 2.1, 2.2, 2.3, 9.3
 * 
 * Uses fast-check to generate random arrays of relationships and verify
 * structural invariants hold for ANY valid input.
 */

// Arbitrary: generates a single relationship object
const relationshipArb = fc.record({
  id: fc.nat(),
  name: fc.string({ minLength: 1, maxLength: 30 }),
  photos: fc.array(fc.constant('images/test.jpg'), { minLength: 0, maxLength: 5 }),
  hasFallback: fc.boolean()
});

// Arbitrary: generates arrays of 1-30 relationships
const relationshipsArrayArb = fc.array(relationshipArb, { minLength: 1, maxLength: 30 });

describe('Feature: relationship-timeline, Timeline Structure Properties', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
  });

  it('Property 1: Rendering produces one dot per relationship', () => {
    /**
     * Validates: Requirements 1.2
     * 
     * For any array of relationships passed to the timeline renderer,
     * the number of rendered dot elements should equal the length of the array.
     */
    fc.assert(
      fc.property(relationshipsArrayArb, (data) => {
        container.innerHTML = '';
        renderTimeline(container, data);

        const dots = container.querySelectorAll('.timeline-dot');
        expect(dots.length).toBe(data.length);
      }),
      { numRuns: 100 }
    );
  });

  it('Property 2: Decorative hearts density (≥ ⌈N/2⌉)', () => {
    /**
     * Validates: Requirements 1.3, 9.3
     * 
     * For any set of N rendered cards, the number of decorative heart
     * elements should be at least ⌈N/2⌉ (ceiling of N divided by 2).
     */
    fc.assert(
      fc.property(relationshipsArrayArb, (data) => {
        container.innerHTML = '';
        renderTimeline(container, data);

        const hearts = container.querySelectorAll('.timeline-heart');
        const minHearts = Math.ceil(data.length / 2);
        expect(hearts.length).toBeGreaterThanOrEqual(minHearts);
      }),
      { numRuns: 100 }
    );
  });

  it('Property 3: Rendering preserves chronological order', () => {
    /**
     * Validates: Requirements 2.1
     * 
     * For any ordered array of relationships, the rendered card elements
     * in the DOM should appear in the same order as the input array
     * (verifiable by data-id attributes matching array indices).
     */
    fc.assert(
      fc.property(relationshipsArrayArb, (data) => {
        container.innerHTML = '';
        renderTimeline(container, data);

        const items = container.querySelectorAll('.timeline-item');
        const renderedIds = Array.from(items).map(item => item.getAttribute('data-id'));
        const expectedIds = data.map(r => String(r.id));

        expect(renderedIds).toEqual(expectedIds);
      }),
      { numRuns: 100 }
    );
  });

  it('Property 4: Alternating card positions (odd=above, even=below)', () => {
    /**
     * Validates: Requirements 2.2
     * 
     * For each .timeline-item at DOM index i (0-based), if (i+1) is odd
     * the item has class 'above', if (i+1) is even it has class 'below'.
     */
    fc.assert(
      fc.property(relationshipsArrayArb, (data) => {
        container.innerHTML = '';
        renderTimeline(container, data);

        const items = container.querySelectorAll('.timeline-item');
        items.forEach((item, i) => {
          const oneBasedIndex = i + 1;
          if (oneBasedIndex % 2 === 1) {
            expect(item.classList.contains('above')).toBe(true);
          } else {
            expect(item.classList.contains('below')).toBe(true);
          }
        });
      }),
      { numRuns: 100 }
    );
  });

  it('Property 5: Every card has a vertical connector', () => {
    /**
     * Validates: Requirements 2.3
     * 
     * For any rendered card in the timeline, there should exist a
     * corresponding vertical connector element (.timeline-connector) as a child.
     */
    fc.assert(
      fc.property(relationshipsArrayArb, (data) => {
        container.innerHTML = '';
        renderTimeline(container, data);

        const items = container.querySelectorAll('.timeline-item');
        items.forEach((item) => {
          const connector = item.querySelector('.timeline-connector');
          expect(connector).not.toBeNull();
        });
      }),
      { numRuns: 100 }
    );
  });
});
