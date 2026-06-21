import { describe, it, expect, beforeEach } from 'vitest';
import { renderTimeline, createCard, relationships } from '../../public/app.js';

describe('createCard (placeholder)', () => {
  it('should return a div element with class "card"', () => {
    const rel = { id: 1, name: 'Test', photos: [], hasFallback: true };
    const card = createCard(rel, 1);
    expect(card.tagName).toBe('DIV');
    expect(card.classList.contains('card')).toBe(true);
  });

  it('should set data-id attribute from relationship id', () => {
    const rel = { id: 5, name: 'Test', photos: [], hasFallback: false };
    const card = createCard(rel, 5);
    expect(card.getAttribute('data-id')).toBe('5');
  });

  it('should set data-index attribute from the index parameter', () => {
    const rel = { id: 3, name: 'Test', photos: [], hasFallback: true };
    const card = createCard(rel, 3);
    expect(card.getAttribute('data-index')).toBe('3');
  });

  it('should display the relationship name', () => {
    const rel = { id: 1, name: 'Pedro Codai', photos: [], hasFallback: false };
    const card = createCard(rel, 9);
    const nameEl = card.querySelector('.card-name');
    expect(nameEl).not.toBeNull();
    expect(nameEl.textContent).toBe('Pedro Codai');
  });
});

describe('renderTimeline', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('main');
    container.id = 'timeline-container';
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('should not throw when container is null', () => {
    expect(() => renderTimeline(null, relationships)).not.toThrow();
  });

  it('should not throw when data is empty', () => {
    expect(() => renderTimeline(container, [])).not.toThrow();
  });

  it('should create a .timeline-scroll wrapper', () => {
    renderTimeline(container, relationships);
    const scroll = container.querySelector('.timeline-scroll');
    expect(scroll).not.toBeNull();
  });

  it('should create a .timeline-line element', () => {
    renderTimeline(container, relationships);
    const line = container.querySelector('.timeline-line');
    expect(line).not.toBeNull();
  });

  it('should create one .timeline-item for each relationship', () => {
    renderTimeline(container, relationships);
    const items = container.querySelectorAll('.timeline-item');
    expect(items.length).toBe(18);
  });

  it('should create one .timeline-dot for each relationship', () => {
    renderTimeline(container, relationships);
    const dots = container.querySelectorAll('.timeline-dot');
    expect(dots.length).toBe(18);
  });

  it('should create one .timeline-connector for each relationship', () => {
    renderTimeline(container, relationships);
    const connectors = container.querySelectorAll('.timeline-connector');
    expect(connectors.length).toBe(18);
  });

  it('should position odd-indexed cards (1-based) above the line', () => {
    renderTimeline(container, relationships);
    const items = container.querySelectorAll('.timeline-item');
    // index 0 in DOM → position 1 (odd → above)
    expect(items[0].classList.contains('above')).toBe(true);
    // index 2 in DOM → position 3 (odd → above)
    expect(items[2].classList.contains('above')).toBe(true);
  });

  it('should position even-indexed cards (1-based) below the line', () => {
    renderTimeline(container, relationships);
    const items = container.querySelectorAll('.timeline-item');
    // index 1 in DOM → position 2 (even → below)
    expect(items[1].classList.contains('below')).toBe(true);
    // index 3 in DOM → position 4 (even → below)
    expect(items[3].classList.contains('below')).toBe(true);
  });

  it('should alternate above/below for all 18 items', () => {
    renderTimeline(container, relationships);
    const items = container.querySelectorAll('.timeline-item');
    items.forEach((item, i) => {
      const expectedClass = (i + 1) % 2 === 1 ? 'above' : 'below';
      expect(item.classList.contains(expectedClass)).toBe(true);
    });
  });

  it('should create at least ceil(N/2) decorative hearts', () => {
    renderTimeline(container, relationships);
    const hearts = container.querySelectorAll('.timeline-heart');
    const minHearts = Math.ceil(relationships.length / 2);
    expect(hearts.length).toBeGreaterThanOrEqual(minHearts);
  });

  it('should preserve chronological order via data-id attributes', () => {
    renderTimeline(container, relationships);
    const items = container.querySelectorAll('.timeline-item');
    items.forEach((item, i) => {
      expect(item.getAttribute('data-id')).toBe(String(i + 1));
    });
  });

  it('should contain a card with the name inside each timeline item', () => {
    renderTimeline(container, relationships);
    const items = container.querySelectorAll('.timeline-item');
    items.forEach((item, i) => {
      const card = item.querySelector('.card');
      expect(card).not.toBeNull();
      // Photo cards use .card-name, fallback cards use .fallback-name
      const nameEl = card.querySelector('.card-name') || card.querySelector('.fallback-name');
      expect(nameEl).not.toBeNull();
      expect(nameEl.textContent).toBe(relationships[i].name);
    });
  });

  it('should work with a subset of relationships', () => {
    const subset = relationships.slice(0, 3);
    renderTimeline(container, subset);
    const items = container.querySelectorAll('.timeline-item');
    expect(items.length).toBe(3);
    const dots = container.querySelectorAll('.timeline-dot');
    expect(dots.length).toBe(3);
    const hearts = container.querySelectorAll('.timeline-heart');
    expect(hearts.length).toBeGreaterThanOrEqual(Math.ceil(3 / 2));
  });

  it('should clear container before rendering', () => {
    container.innerHTML = '<div class="old-content">old</div>';
    renderTimeline(container, relationships);
    expect(container.querySelector('.old-content')).toBeNull();
    expect(container.querySelector('.timeline-scroll')).not.toBeNull();
  });
});
