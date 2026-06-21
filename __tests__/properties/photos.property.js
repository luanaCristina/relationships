import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { getPrimaryPhoto, isValidImageExtension, relationships } from '../../public/app.js';

// ============================================================
// ARBITRARIES
// ============================================================

// Generate valid photo filenames
const validExtArb = fc.constantFrom('.jpg', '.jpeg', '.png', '.JPG', '.JPEG', '.PNG');
const filenameBaseArb = fc.string({ minLength: 1, maxLength: 20 }).filter(s => /^[a-zA-Z0-9]+$/.test(s));

// Photo path with "01" suffix
const photo01Arb = fc.tuple(filenameBaseArb, validExtArb).map(([base, ext]) => `images/${base}01${ext}`);

// Photo path without "01" suffix
const photoNon01Arb = fc.tuple(filenameBaseArb, validExtArb)
  .filter(([base]) => !base.endsWith('01'))
  .map(([base, ext]) => `images/${base}${ext}`);

// Extension arbitrary (both valid and invalid)
const anyExtArb = fc.constantFrom('.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.tiff', '.svg', '.JPG', '.JPEG', '.PNG');

// ============================================================
// PROPERTY 11: Primary photo selection
// ============================================================

describe('Property 11: Primary photo selection (01 suffix priority, then alphabetical)', () => {
  /**
   * Validates: Requirements 5.1
   * 
   * For any non-empty array that contains a photo with "01" suffix,
   * getPrimaryPhoto returns that photo.
   */
  it('should return the photo with "01" suffix when one exists', () => {
    fc.assert(
      fc.property(
        photo01Arb,
        fc.array(photoNon01Arb, { minLength: 0, maxLength: 5 }),
        (photo01, otherPhotos) => {
          // Mix the "01" photo with other photos in random positions
          const allPhotos = [...otherPhotos, photo01];
          const result = getPrimaryPhoto(allPhotos);
          expect(result).toBe(photo01);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Validates: Requirements 5.1
   * 
   * For any non-empty array where NO photo has "01" suffix,
   * getPrimaryPhoto returns the photo with alphabetically first filename.
   */
  it('should return alphabetically first filename when no "01" suffix exists', () => {
    fc.assert(
      fc.property(
        fc.array(photoNon01Arb, { minLength: 1, maxLength: 6 }),
        (photos) => {
          const result = getPrimaryPhoto(photos);
          // Sort by filename (last path segment) alphabetically
          const sorted = [...photos].sort((a, b) => {
            const nameA = a.split('/').pop().toLowerCase();
            const nameB = b.split('/').pop().toLowerCase();
            return nameA.localeCompare(nameB);
          });
          expect(result).toBe(sorted[0]);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Validates: Requirements 5.1
   * 
   * For an empty array, getPrimaryPhoto returns undefined.
   */
  it('should return undefined for an empty array', () => {
    expect(getPrimaryPhoto([])).toBeUndefined();
  });
});

// ============================================================
// PROPERTY 14: File extension validation
// ============================================================

describe('Property 14: File extension validation (.jpg, .jpeg, .png only)', () => {
  /**
   * Validates: Requirements 6.4
   * 
   * For any filename ending in .jpg, .jpeg, or .png (case-insensitive),
   * isValidImageExtension returns true.
   */
  it('should accept filenames with valid extensions (.jpg, .jpeg, .png, case-insensitive)', () => {
    fc.assert(
      fc.property(
        filenameBaseArb,
        validExtArb,
        (base, ext) => {
          const filename = `${base}${ext}`;
          expect(isValidImageExtension(filename)).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Validates: Requirements 6.4
   * 
   * For any filename ending in .gif, .webp, .bmp, .tiff, or .svg,
   * isValidImageExtension returns false.
   */
  it('should reject filenames with invalid extensions (.gif, .webp, .bmp, .tiff, .svg)', () => {
    const invalidExtArb = fc.constantFrom('.gif', '.webp', '.bmp', '.tiff', '.svg');
    fc.assert(
      fc.property(
        filenameBaseArb,
        invalidExtArb,
        (base, ext) => {
          const filename = `${base}${ext}`;
          expect(isValidImageExtension(filename)).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ============================================================
// PROPERTY 17: All image sources use relative paths
// ============================================================

describe('Property 17: All image sources use relative paths', () => {
  /**
   * Validates: Requirements 10.3
   * 
   * For all photos in the relationships data, none starts with
   * "http://", "https://", or "/".
   */
  it('should not have any photo path starting with http://, https://, or /', () => {
    const allPhotos = relationships.flatMap(r => r.photos);
    for (const photo of allPhotos) {
      expect(photo.startsWith('http://')).toBe(false);
      expect(photo.startsWith('https://')).toBe(false);
      expect(photo.startsWith('/')).toBe(false);
    }
  });

  /**
   * Validates: Requirements 10.3
   * 
   * All photo paths in relationships data start with "images/" (relative path).
   */
  it('should have all photo paths starting with "images/"', () => {
    const allPhotos = relationships.flatMap(r => r.photos);
    for (const photo of allPhotos) {
      expect(photo.startsWith('images/')).toBe(true);
    }
  });
});
