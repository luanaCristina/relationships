import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fc from 'fast-check';
import { openGallery, navigateGallery, modalState, initModal, closeModal, renderGalleryContent } from '../../public/app.js';

// ============================================================
// ARBITRARIES
// ============================================================

// Generate arrays of photo paths (1 to 20 photos)
const photosArb = fc.array(
  fc.string({ minLength: 5, maxLength: 30 }).map(s => `images/${s}.jpg`),
  { minLength: 1, maxLength: 20 }
);

// Generate a valid index for a given photos array
const validIndexArb = (photos) => fc.nat({ max: photos.length - 1 });

// ============================================================
// PROPERTY 12: Gallery navigation bounds (clamped to 0..T-1)
// ============================================================

describe('Property 12: Gallery navigation bounds (clamped to 0..T-1)', () => {
  /**
   * Validates: Requirements 5.3
   */

  beforeEach(() => {
    document.body.innerHTML = '';
    initModal();
    // Reset modalState
    modalState.isOpen = false;
    modalState.photos = [];
    modalState.currentIndex = 0;
    modalState.triggerElement = null;
    modalState.type = 'gallery';
  });

  afterEach(() => {
    closeModal();
    document.body.innerHTML = '';
  });

  it('navigating "next" results in index min(N+1, T-1)', () => {
    fc.assert(
      fc.property(
        photosArb,
        (photos) => {
          return fc.assert(
            fc.property(
              validIndexArb(photos),
              (startIndex) => {
                // Open gallery at the given index
                openGallery(photos, startIndex);

                // Navigate next
                navigateGallery('next');

                const expected = Math.min(startIndex + 1, photos.length - 1);
                expect(modalState.currentIndex).toBe(expected);

                // Reset for next iteration
                closeModal();
                initModal();
                modalState.isOpen = false;
                modalState.photos = [];
                modalState.currentIndex = 0;
                modalState.triggerElement = null;
                modalState.type = 'gallery';
              }
            ),
            { numRuns: 5 }
          );
        }
      ),
      { numRuns: 20 }
    );
  });

  it('navigating "prev" results in index max(N-1, 0)', () => {
    fc.assert(
      fc.property(
        photosArb,
        (photos) => {
          return fc.assert(
            fc.property(
              validIndexArb(photos),
              (startIndex) => {
                // Open gallery at the given index
                openGallery(photos, startIndex);

                // Navigate prev
                navigateGallery('prev');

                const expected = Math.max(startIndex - 1, 0);
                expect(modalState.currentIndex).toBe(expected);

                // Reset for next iteration
                closeModal();
                initModal();
                modalState.isOpen = false;
                modalState.photos = [];
                modalState.currentIndex = 0;
                modalState.triggerElement = null;
                modalState.type = 'gallery';
              }
            ),
            { numRuns: 5 }
          );
        }
      ),
      { numRuns: 20 }
    );
  });

  it('prev button should be disabled when currentIndex is 0', () => {
    fc.assert(
      fc.property(
        photosArb,
        (photos) => {
          // Clean DOM and reinitialize modal for each run
          document.body.innerHTML = '';
          initModal();

          // Open gallery at index 0
          openGallery(photos, 0);

          // Check the prev button is disabled
          const prevBtn = document.querySelector('.modal-nav--prev');
          expect(prevBtn).not.toBeNull();
          expect(prevBtn.disabled).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('next button should be disabled when currentIndex is T-1', () => {
    fc.assert(
      fc.property(
        photosArb,
        (photos) => {
          // Clean DOM and reinitialize modal for each run
          document.body.innerHTML = '';
          initModal();

          // Open gallery at last index
          openGallery(photos, photos.length - 1);

          // Check the next button is disabled
          const nextBtn = document.querySelector('.modal-nav--next');
          expect(nextBtn).not.toBeNull();
          expect(nextBtn.disabled).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ============================================================
// PROPERTY 13: Gallery position indicator format ("N de T")
// ============================================================

describe('Property 13: Gallery position indicator format ("N de T")', () => {
  /**
   * Validates: Requirements 5.6
   */

  beforeEach(() => {
    document.body.innerHTML = '';
    initModal();
    // Reset modalState
    modalState.isOpen = false;
    modalState.photos = [];
    modalState.currentIndex = 0;
    modalState.triggerElement = null;
    modalState.type = 'gallery';
  });

  afterEach(() => {
    closeModal();
    document.body.innerHTML = '';
  });

  it('position indicator displays "${N+1} de ${T}" for any valid index and photo count', () => {
    fc.assert(
      fc.property(
        photosArb,
        (photos) => {
          return fc.assert(
            fc.property(
              validIndexArb(photos),
              (startIndex) => {
                // Open gallery at the given index
                openGallery(photos, startIndex);

                // Check the indicator text
                const indicator = document.querySelector('.modal-indicator');
                const expectedText = `${startIndex + 1} de ${photos.length}`;
                expect(indicator.textContent).toBe(expectedText);

                // Reset for next iteration
                closeModal();
                initModal();
                modalState.isOpen = false;
                modalState.photos = [];
                modalState.currentIndex = 0;
                modalState.triggerElement = null;
                modalState.type = 'gallery';
              }
            ),
            { numRuns: 5 }
          );
        }
      ),
      { numRuns: 20 }
    );
  });

  it('position indicator updates correctly after navigation', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.string({ minLength: 5, maxLength: 30 }).map(s => `images/${s}.jpg`),
          { minLength: 2, maxLength: 20 }
        ),
        (photos) => {
          // Open at index 0
          openGallery(photos, 0);

          // Navigate next
          navigateGallery('next');

          // After navigating next from 0, should be at index 1
          const indicator = document.querySelector('.modal-indicator');
          expect(indicator.textContent).toBe(`2 de ${photos.length}`);

          // Reset
          closeModal();
          initModal();
          modalState.isOpen = false;
          modalState.photos = [];
          modalState.currentIndex = 0;
          modalState.triggerElement = null;
          modalState.type = 'gallery';
        }
      ),
      { numRuns: 100 }
    );
  });
});
