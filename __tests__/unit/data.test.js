import { describe, it, expect, beforeEach } from 'vitest';
import { relationships, getPrimaryPhoto, isValidImageExtension, getCardConfig, initApp } from '../../public/app.js';

describe('Data Layer', () => {
  it('should have exactly 18 relationships', () => {
    expect(relationships).toHaveLength(18);
  });

  it('should have relationships in correct chronological order', () => {
    const expectedNames = [
      "Erick", "Ismael", "Valmir vôlei", "Fabio Jaboatão",
      "Otacílio", "Fábio amigo de Jacó", "Stenio", "Fábio Vôlei",
      "Pedro Codai", "Henderson", "Leandro", "Márcio",
      "Nathan", "Azevedo", "Jairo", "Robyson", "Patrick", "Izaac"
    ];
    const names = relationships.map(r => r.name);
    expect(names).toEqual(expectedNames);
  });

  it('should have sequential ids from 1 to 18', () => {
    relationships.forEach((r, i) => {
      expect(r.id).toBe(i + 1);
    });
  });

  it('should mark correct relationships as hasFallback', () => {
    const fallbackNames = relationships.filter(r => r.hasFallback).map(r => r.name);
    expect(fallbackNames).toEqual(["Erick", "Valmir vôlei", "Fabio Jaboatão", "Fábio amigo de Jacó"]);
  });

  it('should have empty photo arrays for fallback relationships', () => {
    const fallbacks = relationships.filter(r => r.hasFallback);
    fallbacks.forEach(r => {
      expect(r.photos).toEqual([]);
    });
  });

  it('should have hasFallback: true for all 4 fallback relationships', () => {
    const erick = relationships.find(r => r.name === "Erick");
    const valmir = relationships.find(r => r.name === "Valmir vôlei");
    const fabioJ = relationships.find(r => r.name === "Fabio Jaboatão");
    const fabioA = relationships.find(r => r.name === "Fábio amigo de Jacó");

    expect(erick.hasFallback).toBe(true);
    expect(valmir.hasFallback).toBe(true);
    expect(fabioJ.hasFallback).toBe(true);
    expect(fabioA.hasFallback).toBe(true);
  });

  it('should use relative paths for all photos', () => {
    relationships.forEach(r => {
      r.photos.forEach(photo => {
        expect(photo).not.toMatch(/^https?:\/\//);
        expect(photo).not.toMatch(/^\//);
        expect(photo).toMatch(/^images\//);
      });
    });
  });

  it('should not include exemplo.png in any photo mapping', () => {
    const allPhotos = relationships.flatMap(r => r.photos);
    const hasExemplo = allPhotos.some(p => p.toLowerCase().includes('exemplo'));
    expect(hasExemplo).toBe(false);
  });
});

describe('Complete Photo Mappings (Requirement 6.2)', () => {
  it('should have correct photos for Ismael (1 photo)', () => {
    const r = relationships.find(r => r.name === "Ismael");
    expect(r.photos).toEqual(["images/Ismael.jpg"]);
  });

  it('should have correct photos for Otacílio (2 photos)', () => {
    const r = relationships.find(r => r.name === "Otacílio");
    expect(r.photos).toHaveLength(2);
    expect(r.photos).toContain("images/otacilio.jpg");
    expect(r.photos).toContain("images/otacilioCasório.jpeg");
  });

  it('should have correct photos for Stenio (3 photos)', () => {
    const r = relationships.find(r => r.name === "Stenio");
    expect(r.photos).toHaveLength(3);
    expect(r.photos).toContain("images/stenio.jpg");
    expect(r.photos).toContain("images/stenio03.JPG");
    expect(r.photos).toContain("images/stenio06.jpeg");
  });

  it('should have correct photos for Fábio Vôlei (4 photos)', () => {
    const r = relationships.find(r => r.name === "Fábio Vôlei");
    expect(r.photos).toHaveLength(4);
    expect(r.photos).toContain("images/FabioVôlei01.jpg");
    expect(r.photos).toContain("images/fabioVôlei02.jpg");
    expect(r.photos).toContain("images/fabioVôlei03.jpg");
    expect(r.photos).toContain("images/fabioVôlei05.jpeg");
  });

  it('should have correct photos for Pedro Codai (6 photos)', () => {
    const r = relationships.find(r => r.name === "Pedro Codai");
    expect(r.photos).toHaveLength(6);
    expect(r.photos).toContain("images/pedro01.jpg");
    expect(r.photos).toContain("images/pedro04.jpeg");
    expect(r.photos).toContain("images/pedro05.jpeg");
    expect(r.photos).toContain("images/pedro07.jpeg");
    expect(r.photos).toContain("images/pedro6.jpg");
    expect(r.photos).toContain("images/pedro7.jpg");
  });

  it('should have correct photos for Henderson (3 photos)', () => {
    const r = relationships.find(r => r.name === "Henderson");
    expect(r.photos).toHaveLength(3);
    expect(r.photos).toContain("images/Henderson05.jpg");
    expect(r.photos).toContain("images/Henderson5.jpg");
    expect(r.photos).toContain("images/henderson.JPG");
  });

  it('should have correct photos for Leandro (1 photo)', () => {
    const r = relationships.find(r => r.name === "Leandro");
    expect(r.photos).toEqual(["images/Leandro.jpg"]);
  });

  it('should have correct photos for Márcio (3 photos)', () => {
    const r = relationships.find(r => r.name === "Márcio");
    expect(r.photos).toHaveLength(3);
    expect(r.photos).toContain("images/marcio.jpg");
    expect(r.photos).toContain("images/marcio01.jpg");
    expect(r.photos).toContain("images/marcio04.jpg");
  });

  it('should have correct photos for Nathan (4 photos)', () => {
    const r = relationships.find(r => r.name === "Nathan");
    expect(r.photos).toHaveLength(4);
    expect(r.photos).toContain("images/Natan.JPG");
    expect(r.photos).toContain("images/natan02.jpg");
    expect(r.photos).toContain("images/natan03.JPG");
    expect(r.photos).toContain("images/natan06.jpeg");
  });

  it('should have correct photos for Azevedo (6 photos)', () => {
    const r = relationships.find(r => r.name === "Azevedo");
    expect(r.photos).toHaveLength(6);
    expect(r.photos).toContain("images/azevedo.jpg");
    expect(r.photos).toContain("images/azevedo02.jpg");
    expect(r.photos).toContain("images/Azevedo07.jpg");
    expect(r.photos).toContain("images/azevedo05.jpeg");
    expect(r.photos).toContain("images/azevedo05.jpg");
    expect(r.photos).toContain("images/azevedo06.jpg");
  });

  it('should have correct photos for Jairo (5 photos)', () => {
    const r = relationships.find(r => r.name === "Jairo");
    expect(r.photos).toHaveLength(5);
    expect(r.photos).toContain("images/jairo&Eu01.jpg");
    expect(r.photos).toContain("images/jairo02.jpg");
    expect(r.photos).toContain("images/jairo03.jpg");
    expect(r.photos).toContain("images/jairo06.jpeg");
    expect(r.photos).toContain("images/jairoCasório.jpg");
  });

  it('should have correct photos for Robyson (2 photos)', () => {
    const r = relationships.find(r => r.name === "Robyson");
    expect(r.photos).toHaveLength(2);
    expect(r.photos).toContain("images/robyson.jpg");
    expect(r.photos).toContain("images/robyson02.jpg");
  });

  it('should have correct photos for Patrick (4 photos)', () => {
    const r = relationships.find(r => r.name === "Patrick");
    expect(r.photos).toHaveLength(4);
    expect(r.photos).toContain("images/Patrick.jpg");
    expect(r.photos).toContain("images/patrick02.jpg");
    expect(r.photos).toContain("images/patrick05.jpg");
    expect(r.photos).toContain("images/patric05.jpg");
  });

  it('should have correct photos for Izaac (1 photo)', () => {
    const r = relationships.find(r => r.name === "Izaac");
    expect(r.photos).toEqual(["images/izaac willians.jpg"]);
  });
});

describe('DOM Structure after initApp', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <header id="site-header"></header>
      <main id="timeline-container"></main>
      <footer id="final-section"></footer>
    `;
    initApp();
  });

  it('should have header as first child element of body', () => {
    const firstElement = document.body.children[0];
    expect(firstElement.tagName.toLowerCase()).toBe('header');
    expect(firstElement.id).toBe('site-header');
  });

  it('should have timeline (main) following the header', () => {
    const secondElement = document.body.children[1];
    expect(secondElement.tagName.toLowerCase()).toBe('main');
    expect(secondElement.id).toBe('timeline-container');
  });

  it('should have final section (footer) as last semantic section before modal', () => {
    // Footer should be the third structural element (modal overlay is appended after)
    const footer = document.getElementById('final-section');
    expect(footer).not.toBeNull();
    expect(footer.tagName.toLowerCase()).toBe('footer');
    // Footer should come after the main/timeline
    const main = document.getElementById('timeline-container');
    const bodyChildren = Array.from(document.body.children);
    const mainIndex = bodyChildren.indexOf(main);
    const footerIndex = bodyChildren.indexOf(footer);
    expect(footerIndex).toBeGreaterThan(mainIndex);
  });

  it('should render exactly 18 timeline items inside the timeline', () => {
    const timeline = document.getElementById('timeline-container');
    const items = timeline.querySelectorAll('.timeline-item');
    expect(items).toHaveLength(18);
  });

  it('should render timeline items in correct chronological order by data-id', () => {
    const timeline = document.getElementById('timeline-container');
    const items = timeline.querySelectorAll('.timeline-item');
    const ids = Array.from(items).map(item => Number(item.getAttribute('data-id')));
    const expected = Array.from({ length: 18 }, (_, i) => i + 1);
    expect(ids).toEqual(expected);
  });

  it('should render header content (title exists)', () => {
    const header = document.getElementById('site-header');
    const h1 = header.querySelector('h1');
    expect(h1).not.toBeNull();
    expect(h1.textContent.length).toBeGreaterThan(0);
  });

  it('should render final section content (CONTINUA... text)', () => {
    const footer = document.getElementById('final-section');
    const finalText = footer.querySelector('.final-text');
    expect(finalText).not.toBeNull();
    expect(finalText.textContent).toContain('CONTINUA');
  });
});

describe('getPrimaryPhoto', () => {
  it('should return undefined for empty array', () => {
    expect(getPrimaryPhoto([])).toBeUndefined();
  });

  it('should return undefined for null/undefined', () => {
    expect(getPrimaryPhoto(null)).toBeUndefined();
    expect(getPrimaryPhoto(undefined)).toBeUndefined();
  });

  it('should select photo with "01" suffix', () => {
    const photos = ["images/fabioVôlei02.jpg", "images/FabioVôlei01.jpg", "images/fabioVôlei03.jpg"];
    expect(getPrimaryPhoto(photos)).toBe("images/FabioVôlei01.jpg");
  });

  it('should fall back to alphabetically first filename when no "01" exists', () => {
    const photos = ["images/henderson.JPG", "images/Henderson05.jpg", "images/Henderson5.jpg"];
    expect(getPrimaryPhoto(photos)).toBe("images/henderson.JPG");
  });

  it('should return single photo when array has one element', () => {
    expect(getPrimaryPhoto(["images/Ismael.jpg"])).toBe("images/Ismael.jpg");
  });

  it('should handle "01" match case-insensitively for extension', () => {
    const photos = ["images/photo02.JPG", "images/photo01.JPEG"];
    expect(getPrimaryPhoto(photos)).toBe("images/photo01.JPEG");
  });
});

describe('isValidImageExtension', () => {
  it('should accept .jpg', () => {
    expect(isValidImageExtension("photo.jpg")).toBe(true);
  });

  it('should accept .jpeg', () => {
    expect(isValidImageExtension("photo.jpeg")).toBe(true);
  });

  it('should accept .png', () => {
    expect(isValidImageExtension("photo.png")).toBe(true);
  });

  it('should accept uppercase extensions', () => {
    expect(isValidImageExtension("photo.JPG")).toBe(true);
    expect(isValidImageExtension("photo.JPEG")).toBe(true);
    expect(isValidImageExtension("photo.PNG")).toBe(true);
  });

  it('should reject other extensions', () => {
    expect(isValidImageExtension("photo.gif")).toBe(false);
    expect(isValidImageExtension("photo.webp")).toBe(false);
    expect(isValidImageExtension("photo.txt")).toBe(false);
  });
});

describe('getCardConfig', () => {
  it('should position odd-indexed cards above', () => {
    expect(getCardConfig(1).position).toBe('above');
    expect(getCardConfig(3).position).toBe('above');
    expect(getCardConfig(17).position).toBe('above');
  });

  it('should position even-indexed cards below', () => {
    expect(getCardConfig(2).position).toBe('below');
    expect(getCardConfig(4).position).toBe('below');
    expect(getCardConfig(18).position).toBe('below');
  });

  it('should assign OS frame to odd-indexed cards', () => {
    expect(getCardConfig(1).frameType).toBe('os');
    expect(getCardConfig(7).frameType).toBe('os');
  });

  it('should assign Polaroid frame to even-indexed cards', () => {
    expect(getCardConfig(2).frameType).toBe('polaroid');
    expect(getCardConfig(8).frameType).toBe('polaroid');
  });

  it('should generate rotation between -3 and +3 degrees', () => {
    for (let i = 0; i < 100; i++) {
      const config = getCardConfig(1);
      expect(config.rotation).toBeGreaterThanOrEqual(-3);
      expect(config.rotation).toBeLessThanOrEqual(3);
    }
  });
});
