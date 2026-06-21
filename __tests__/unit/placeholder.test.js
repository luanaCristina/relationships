import { describe, it, expect } from 'vitest';

describe('Test Infrastructure', () => {
  it('should run unit tests successfully', () => {
    expect(1 + 1).toBe(2);
  });

  it('should have jsdom environment available', () => {
    const div = document.createElement('div');
    div.textContent = 'hello';
    expect(div.textContent).toBe('hello');
  });
});
