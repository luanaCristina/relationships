/**
 * Unit tests for Modal Controller structure and state (Task 5.1)
 * Gallery Navigation (Task 5.2), and Modal Interactions (Task 5.5)
 * Tests: modal initialization, state management, close behavior, event bindings,
 * gallery open, navigation, rendering, keyboard navigation,
 * single photo view, and modal cleanup on re-open
 * 
 * Validates: Requirements 5.2, 5.3, 5.4, 5.5, 5.6
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { modalState, initModal, closeModal, openGallery, openSinglePhoto, navigateGallery, renderGalleryContent } from '../../public/app.js';

describe('Modal Controller', () => {
  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = '';
    // Reset modal state
    modalState.isOpen = false;
    modalState.photos = [];
    modalState.currentIndex = 0;
    modalState.triggerElement = null;
    modalState.type = 'gallery';
  });

  afterEach(() => {
    // Clean up any modal overlay appended to body
    const overlay = document.querySelector('.modal-overlay');
    if (overlay) overlay.remove();
  });

  describe('modalState object', () => {
    it('should have isOpen property defaulting to false', () => {
      expect(modalState.isOpen).toBe(false);
    });

    it('should have photos as an empty array', () => {
      expect(modalState.photos).toEqual([]);
    });

    it('should have currentIndex defaulting to 0', () => {
      expect(modalState.currentIndex).toBe(0);
    });

    it('should have triggerElement defaulting to null', () => {
      expect(modalState.triggerElement).toBeNull();
    });

    it('should have type property', () => {
      expect(modalState.type).toBe('gallery');
    });
  });

  describe('initModal()', () => {
    it('should create a modal overlay element and append to body', () => {
      initModal();
      const overlay = document.querySelector('.modal-overlay');
      expect(overlay).not.toBeNull();
      expect(overlay.parentElement).toBe(document.body);
    });

    it('should create overlay with role=dialog and aria-modal=true', () => {
      initModal();
      const overlay = document.querySelector('.modal-overlay');
      expect(overlay.getAttribute('role')).toBe('dialog');
      expect(overlay.getAttribute('aria-modal')).toBe('true');
    });

    it('should create a .modal-content element inside overlay', () => {
      initModal();
      const content = document.querySelector('.modal-overlay .modal-content');
      expect(content).not.toBeNull();
    });

    it('should create a close button with .modal-close class', () => {
      initModal();
      const closeBtn = document.querySelector('.modal-overlay .modal-close');
      expect(closeBtn).not.toBeNull();
      expect(closeBtn.textContent).toBe('×');
    });

    it('should create close button with aria-label', () => {
      initModal();
      const closeBtn = document.querySelector('.modal-close');
      expect(closeBtn.getAttribute('aria-label')).toBe('Fechar');
    });

    it('overlay should not have .active class initially', () => {
      initModal();
      const overlay = document.querySelector('.modal-overlay');
      expect(overlay.classList.contains('active')).toBe(false);
    });
  });

  describe('closeModal()', () => {
    beforeEach(() => {
      initModal();
      // Simulate an open modal
      const overlay = document.querySelector('.modal-overlay');
      overlay.classList.add('active');
      modalState.isOpen = true;
      modalState.photos = ['photo1.jpg', 'photo2.jpg'];
      modalState.currentIndex = 1;
    });

    it('should remove .active class from overlay', () => {
      closeModal();
      const overlay = document.querySelector('.modal-overlay');
      expect(overlay.classList.contains('active')).toBe(false);
    });

    it('should set modalState.isOpen to false', () => {
      closeModal();
      expect(modalState.isOpen).toBe(false);
    });

    it('should return focus to triggerElement', () => {
      const trigger = document.createElement('button');
      document.body.appendChild(trigger);
      trigger.focus = vi.fn();
      modalState.triggerElement = trigger;

      closeModal();
      expect(trigger.focus).toHaveBeenCalled();
    });

    it('should clear modal content', () => {
      const content = document.querySelector('.modal-content');
      content.innerHTML = '<img src="test.jpg" />';

      closeModal();
      expect(content.innerHTML).toBe('');
    });

    it('should reset modalState.photos to empty array', () => {
      closeModal();
      expect(modalState.photos).toEqual([]);
    });

    it('should reset modalState.currentIndex to 0', () => {
      closeModal();
      expect(modalState.currentIndex).toBe(0);
    });

    it('should reset modalState.triggerElement to null', () => {
      modalState.triggerElement = document.createElement('button');
      closeModal();
      expect(modalState.triggerElement).toBeNull();
    });
  });

  describe('Event bindings', () => {
    beforeEach(() => {
      initModal();
      // Simulate an open modal
      const overlay = document.querySelector('.modal-overlay');
      overlay.classList.add('active');
      modalState.isOpen = true;
    });

    it('should close modal on close button click', () => {
      const closeBtn = document.querySelector('.modal-close');
      closeBtn.click();
      expect(modalState.isOpen).toBe(false);
    });

    it('should close modal on overlay click (outside content)', () => {
      const overlay = document.querySelector('.modal-overlay');
      overlay.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      expect(modalState.isOpen).toBe(false);
    });

    it('should NOT close modal when clicking on modal content', () => {
      const content = document.querySelector('.modal-content');
      content.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      // The click on content bubbles to overlay, but e.target won't be the overlay
      expect(modalState.isOpen).toBe(true);
    });

    it('should close modal on Escape key press', () => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      expect(modalState.isOpen).toBe(false);
    });

    it('should NOT close modal on other key presses', () => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      expect(modalState.isOpen).toBe(true);
    });
  });
});

describe('Gallery Navigation (Task 5.2)', () => {
  const testPhotos = ['images/photo1.jpg', 'images/photo2.jpg', 'images/photo3.jpg', 'images/photo4.jpg'];

  beforeEach(() => {
    document.body.innerHTML = '';
    modalState.isOpen = false;
    modalState.photos = [];
    modalState.currentIndex = 0;
    modalState.triggerElement = null;
    modalState.type = 'gallery';
    initModal();
  });

  afterEach(() => {
    const overlay = document.querySelector('.modal-overlay');
    if (overlay) overlay.remove();
  });

  describe('openGallery()', () => {
    it('should set modalState.isOpen to true', () => {
      openGallery(testPhotos, 0);
      expect(modalState.isOpen).toBe(true);
    });

    it('should set modalState.photos to the provided photos array', () => {
      openGallery(testPhotos, 0);
      expect(modalState.photos).toEqual(testPhotos);
    });

    it('should set modalState.currentIndex to startIndex', () => {
      openGallery(testPhotos, 2);
      expect(modalState.currentIndex).toBe(2);
    });

    it('should set modalState.type to gallery', () => {
      openGallery(testPhotos, 0);
      expect(modalState.type).toBe('gallery');
    });

    it('should add .active class to overlay', () => {
      openGallery(testPhotos, 0);
      const overlay = document.querySelector('.modal-overlay');
      expect(overlay.classList.contains('active')).toBe(true);
    });

    it('should set triggerElement to provided element', () => {
      const card = document.createElement('div');
      document.body.appendChild(card);
      openGallery(testPhotos, 0, card);
      expect(modalState.triggerElement).toBe(card);
    });

    it('should not open if photos is empty', () => {
      openGallery([], 0);
      expect(modalState.isOpen).toBe(false);
    });

    it('should not open if photos is null', () => {
      openGallery(null, 0);
      expect(modalState.isOpen).toBe(false);
    });

    it('should render gallery content with image', () => {
      openGallery(testPhotos, 0);
      const img = document.querySelector('.modal-content img');
      expect(img).not.toBeNull();
      expect(img.src).toContain('photo1.jpg');
    });

    it('should render prev and next buttons', () => {
      openGallery(testPhotos, 1);
      const prevBtn = document.querySelector('.modal-nav--prev');
      const nextBtn = document.querySelector('.modal-nav--next');
      expect(prevBtn).not.toBeNull();
      expect(nextBtn).not.toBeNull();
    });

    it('should render position indicator', () => {
      openGallery(testPhotos, 0);
      const indicator = document.querySelector('.modal-indicator');
      expect(indicator).not.toBeNull();
      expect(indicator.textContent).toBe('1 de 4');
    });
  });

  describe('navigateGallery()', () => {
    beforeEach(() => {
      openGallery(testPhotos, 1);
    });

    it('should increment currentIndex on next', () => {
      navigateGallery('next');
      expect(modalState.currentIndex).toBe(2);
    });

    it('should decrement currentIndex on prev', () => {
      navigateGallery('prev');
      expect(modalState.currentIndex).toBe(0);
    });

    it('should clamp next at photos.length - 1', () => {
      modalState.currentIndex = 3; // last photo
      navigateGallery('next');
      expect(modalState.currentIndex).toBe(3);
    });

    it('should clamp prev at 0', () => {
      modalState.currentIndex = 0;
      navigateGallery('prev');
      expect(modalState.currentIndex).toBe(0);
    });

    it('should not navigate when modal is not open', () => {
      modalState.isOpen = false;
      modalState.currentIndex = 1;
      navigateGallery('next');
      expect(modalState.currentIndex).toBe(1);
    });

    it('should not navigate when modal type is not gallery', () => {
      modalState.type = 'single';
      modalState.currentIndex = 1;
      navigateGallery('next');
      expect(modalState.currentIndex).toBe(1);
    });

    it('should update the displayed image after navigation', () => {
      navigateGallery('next');
      const img = document.querySelector('.modal-content img');
      expect(img.src).toContain('photo3.jpg');
    });

    it('should update position indicator after navigation', () => {
      navigateGallery('next');
      const indicator = document.querySelector('.modal-indicator');
      expect(indicator.textContent).toBe('3 de 4');
    });
  });

  describe('renderGalleryContent()', () => {
    beforeEach(() => {
      openGallery(testPhotos, 0);
    });

    it('should disable prev button at index 0', () => {
      const prevBtn = document.querySelector('.modal-nav--prev');
      expect(prevBtn.disabled).toBe(true);
    });

    it('should enable next button at index 0 with multiple photos', () => {
      const nextBtn = document.querySelector('.modal-nav--next');
      expect(nextBtn.disabled).toBe(false);
    });

    it('should disable next button at last index', () => {
      modalState.currentIndex = 3;
      renderGalleryContent();
      const nextBtn = document.querySelector('.modal-nav--next');
      expect(nextBtn.disabled).toBe(true);
    });

    it('should enable prev button when not at first index', () => {
      modalState.currentIndex = 2;
      renderGalleryContent();
      const prevBtn = document.querySelector('.modal-nav--prev');
      expect(prevBtn.disabled).toBe(false);
    });

    it('should show position in "N de T" format (1-based)', () => {
      modalState.currentIndex = 2;
      renderGalleryContent();
      const indicator = document.querySelector('.modal-indicator');
      expect(indicator.textContent).toBe('3 de 4');
    });

    it('should show "1 de 4" when at first photo', () => {
      const indicator = document.querySelector('.modal-indicator');
      expect(indicator.textContent).toBe('1 de 4');
    });

    it('should show "4 de 4" when at last photo', () => {
      modalState.currentIndex = 3;
      renderGalleryContent();
      const indicator = document.querySelector('.modal-indicator');
      expect(indicator.textContent).toBe('4 de 4');
    });
  });

  describe('Keyboard navigation', () => {
    beforeEach(() => {
      openGallery(testPhotos, 0);
    });

    it('should navigate to next photo on ArrowRight', () => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
      expect(modalState.currentIndex).toBeGreaterThan(0);
    });

    it('should navigate to previous photo on ArrowLeft', () => {
      // First go to index 2 manually
      modalState.currentIndex = 2;
      renderGalleryContent();
      const prevIndex = modalState.currentIndex;
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
      expect(modalState.currentIndex).toBeLessThan(prevIndex);
    });

    it('should not navigate on ArrowRight when modal type is single', () => {
      modalState.type = 'single';
      modalState.currentIndex = 1;
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
      expect(modalState.currentIndex).toBe(1);
    });

    it('should not navigate on arrow keys when modal is closed', () => {
      closeModal();
      modalState.currentIndex = 1;
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
      expect(modalState.currentIndex).toBe(1);
    });
  });

  describe('Navigation button clicks', () => {
    beforeEach(() => {
      openGallery(testPhotos, 1);
    });

    it('should navigate next on next button click', () => {
      const nextBtn = document.querySelector('.modal-nav--next');
      nextBtn.click();
      expect(modalState.currentIndex).toBe(2);
    });

    it('should navigate prev on prev button click', () => {
      const prevBtn = document.querySelector('.modal-nav--prev');
      prevBtn.click();
      expect(modalState.currentIndex).toBe(0);
    });
  });
});


describe('Single Photo View (Task 5.5)', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    modalState.isOpen = false;
    modalState.photos = [];
    modalState.currentIndex = 0;
    modalState.triggerElement = null;
    modalState.type = 'gallery';
    initModal();
  });

  afterEach(() => {
    const overlay = document.querySelector('.modal-overlay');
    if (overlay) overlay.remove();
  });

  describe('openSinglePhoto() state', () => {
    it('should set modalState.isOpen to true', () => {
      openSinglePhoto('images/test.jpg');
      expect(modalState.isOpen).toBe(true);
    });

    it('should set modalState.type to single', () => {
      openSinglePhoto('images/test.jpg');
      expect(modalState.type).toBe('single');
    });

    it('should set modalState.photos to single-element array', () => {
      openSinglePhoto('images/test.jpg');
      expect(modalState.photos).toEqual(['images/test.jpg']);
    });

    it('should set modalState.currentIndex to 0', () => {
      openSinglePhoto('images/test.jpg');
      expect(modalState.currentIndex).toBe(0);
    });

    it('should add .active class to overlay', () => {
      openSinglePhoto('images/test.jpg');
      const overlay = document.querySelector('.modal-overlay');
      expect(overlay.classList.contains('active')).toBe(true);
    });

    it('should not open if photoSrc is null', () => {
      openSinglePhoto(null);
      expect(modalState.isOpen).toBe(false);
    });

    it('should not open if photoSrc is empty string', () => {
      openSinglePhoto('');
      expect(modalState.isOpen).toBe(false);
    });
  });

  describe('openSinglePhoto() rendering', () => {
    it('should create an img element with correct src', () => {
      openSinglePhoto('images/photo1.jpg');
      const img = document.querySelector('.modal-content img');
      expect(img).not.toBeNull();
      expect(img.src).toContain('images/photo1.jpg');
    });

    it('should NOT render navigation buttons (prev/next)', () => {
      openSinglePhoto('images/photo1.jpg');
      const prevBtn = document.querySelector('.modal-nav--prev');
      const nextBtn = document.querySelector('.modal-nav--next');
      expect(prevBtn).toBeNull();
      expect(nextBtn).toBeNull();
    });

    it('should NOT render position indicator', () => {
      openSinglePhoto('images/photo1.jpg');
      const indicator = document.querySelector('.modal-indicator');
      expect(indicator).toBeNull();
    });

    it('should apply max-width 90vw to image', () => {
      openSinglePhoto('images/photo1.jpg');
      const img = document.querySelector('.modal-content img');
      expect(img.style.maxWidth).toBe('90vw');
    });

    it('should apply max-height 90vh to image', () => {
      openSinglePhoto('images/photo1.jpg');
      const img = document.querySelector('.modal-content img');
      expect(img.style.maxHeight).toBe('90vh');
    });
  });
});

describe('Modal cleanup on re-open (Task 5.5)', () => {
  const testPhotos = ['images/photo1.jpg', 'images/photo2.jpg', 'images/photo3.jpg'];

  beforeEach(() => {
    document.body.innerHTML = '';
    modalState.isOpen = false;
    modalState.photos = [];
    modalState.currentIndex = 0;
    modalState.triggerElement = null;
    modalState.type = 'gallery';
    initModal();
  });

  afterEach(() => {
    const overlay = document.querySelector('.modal-overlay');
    if (overlay) overlay.remove();
  });

  it('should clear previous content when re-opening gallery', () => {
    // Open gallery first
    openGallery(testPhotos, 0);
    const firstImg = document.querySelector('.modal-content img');
    expect(firstImg.src).toContain('photo1.jpg');

    // Close and re-open with different start index
    closeModal();
    openGallery(testPhotos, 2);
    const secondImg = document.querySelector('.modal-content img');
    expect(secondImg.src).toContain('photo3.jpg');
  });

  it('should clear gallery content when switching to single photo', () => {
    // Open gallery
    openGallery(testPhotos, 1);
    expect(document.querySelector('.modal-nav--prev')).not.toBeNull();

    // Close and open single photo
    closeModal();
    openSinglePhoto('images/solo.jpg');
    expect(document.querySelector('.modal-nav--prev')).toBeNull();
    expect(document.querySelector('.modal-content img').src).toContain('solo.jpg');
  });

  it('should clear single photo content when switching to gallery', () => {
    // Open single photo
    openSinglePhoto('images/solo.jpg');
    expect(document.querySelector('.modal-nav--prev')).toBeNull();

    // Close and open gallery
    closeModal();
    openGallery(testPhotos, 0);
    expect(document.querySelector('.modal-nav--prev')).not.toBeNull();
    expect(document.querySelector('.modal-indicator').textContent).toBe('1 de 3');
  });

  it('should reset state properly between re-opens', () => {
    // Open gallery at index 2
    openGallery(testPhotos, 2);
    expect(modalState.currentIndex).toBe(2);

    // Close
    closeModal();
    expect(modalState.currentIndex).toBe(0);
    expect(modalState.photos).toEqual([]);

    // Re-open at index 0
    openGallery(testPhotos, 0);
    expect(modalState.currentIndex).toBe(0);
    expect(modalState.photos).toEqual(testPhotos);
  });
});
