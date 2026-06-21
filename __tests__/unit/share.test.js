/**
 * Unit tests for Share Handler (Task 6.3)
 * Tests Web Share API path, clipboard fallback, error handling,
 * and visual feedback behavior.
 * 
 * Validates: Requirements 8.3
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { handleShare } from '../../public/app.js';

describe('Share Handler', () => {
  let originalShare;
  let originalClipboard;

  beforeEach(() => {
    // Store originals
    originalShare = navigator.share;
    originalClipboard = navigator.clipboard;

    // Set up DOM with a .share-feedback element
    document.body.innerHTML = '<p class="share-feedback"></p>';
  });

  afterEach(() => {
    // Restore navigator APIs
    Object.defineProperty(navigator, 'share', {
      value: originalShare,
      writable: true,
      configurable: true
    });
    Object.defineProperty(navigator, 'clipboard', {
      value: originalClipboard,
      writable: true,
      configurable: true
    });

    document.body.innerHTML = '';
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('Web Share API path when available', () => {
    it('should call navigator.share with title and url when available', async () => {
      const shareMock = vi.fn().mockResolvedValue(undefined);
      Object.defineProperty(navigator, 'share', {
        value: shareMock,
        writable: true,
        configurable: true
      });

      await handleShare();

      expect(shareMock).toHaveBeenCalledTimes(1);
      expect(shareMock).toHaveBeenCalledWith(
        expect.objectContaining({
          title: expect.any(String),
          url: expect.any(String)
        })
      );
    });

    it('should NOT call clipboard when navigator.share succeeds', async () => {
      const shareMock = vi.fn().mockResolvedValue(undefined);
      Object.defineProperty(navigator, 'share', {
        value: shareMock,
        writable: true,
        configurable: true
      });

      const writeTextMock = vi.fn().mockResolvedValue(undefined);
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: writeTextMock },
        writable: true,
        configurable: true
      });

      await handleShare();

      expect(writeTextMock).not.toHaveBeenCalled();
    });
  });

  describe('Web Share API user cancellation (AbortError)', () => {
    it('should not show error when user cancels share (AbortError)', async () => {
      const abortError = new Error('Share cancelled');
      abortError.name = 'AbortError';
      const shareMock = vi.fn().mockRejectedValue(abortError);
      Object.defineProperty(navigator, 'share', {
        value: shareMock,
        writable: true,
        configurable: true
      });

      await handleShare();

      const feedback = document.querySelector('.share-feedback');
      expect(feedback.classList.contains('visible')).toBe(false);
    });

    it('should not show error when share is dismissed (NotAllowedError)', async () => {
      const notAllowedError = new Error('Not allowed');
      notAllowedError.name = 'NotAllowedError';
      const shareMock = vi.fn().mockRejectedValue(notAllowedError);
      Object.defineProperty(navigator, 'share', {
        value: shareMock,
        writable: true,
        configurable: true
      });

      await handleShare();

      const feedback = document.querySelector('.share-feedback');
      expect(feedback.classList.contains('visible')).toBe(false);
    });
  });

  describe('Clipboard fallback when Web Share unavailable', () => {
    it('should copy URL to clipboard when navigator.share is undefined', async () => {
      Object.defineProperty(navigator, 'share', {
        value: undefined,
        writable: true,
        configurable: true
      });

      const writeTextMock = vi.fn().mockResolvedValue(undefined);
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: writeTextMock },
        writable: true,
        configurable: true
      });

      await handleShare();

      expect(writeTextMock).toHaveBeenCalledTimes(1);
      expect(writeTextMock).toHaveBeenCalledWith(window.location.href);
    });

    it('should show "Link copiado! ✓" feedback on successful clipboard copy', async () => {
      Object.defineProperty(navigator, 'share', {
        value: undefined,
        writable: true,
        configurable: true
      });

      const writeTextMock = vi.fn().mockResolvedValue(undefined);
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: writeTextMock },
        writable: true,
        configurable: true
      });

      await handleShare();

      const feedback = document.querySelector('.share-feedback');
      expect(feedback.textContent).toBe('Link copiado! ✓');
      expect(feedback.classList.contains('visible')).toBe(true);
    });
  });

  describe('Failed clipboard operation', () => {
    it('should show error message when clipboard write fails', async () => {
      Object.defineProperty(navigator, 'share', {
        value: undefined,
        writable: true,
        configurable: true
      });

      const writeTextMock = vi.fn().mockRejectedValue(new Error('Clipboard denied'));
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: writeTextMock },
        writable: true,
        configurable: true
      });

      await handleShare();

      const feedback = document.querySelector('.share-feedback');
      expect(feedback.textContent).toBe('Não foi possível copiar');
      expect(feedback.classList.contains('visible')).toBe(true);
    });
  });

  describe('Feedback visibility disappears after timeout', () => {
    it('should remove .visible class after 3000ms', async () => {
      vi.useFakeTimers();

      Object.defineProperty(navigator, 'share', {
        value: undefined,
        writable: true,
        configurable: true
      });

      const writeTextMock = vi.fn().mockResolvedValue(undefined);
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: writeTextMock },
        writable: true,
        configurable: true
      });

      await handleShare();

      const feedback = document.querySelector('.share-feedback');
      expect(feedback.classList.contains('visible')).toBe(true);

      // Advance timers by 3000ms
      vi.advanceTimersByTime(3000);

      expect(feedback.classList.contains('visible')).toBe(false);
    });

    it('should remove .visible class after 3000ms on error too', async () => {
      vi.useFakeTimers();

      Object.defineProperty(navigator, 'share', {
        value: undefined,
        writable: true,
        configurable: true
      });

      const writeTextMock = vi.fn().mockRejectedValue(new Error('fail'));
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: writeTextMock },
        writable: true,
        configurable: true
      });

      await handleShare();

      const feedback = document.querySelector('.share-feedback');
      expect(feedback.classList.contains('visible')).toBe(true);

      vi.advanceTimersByTime(3000);

      expect(feedback.classList.contains('visible')).toBe(false);
    });
  });
});
