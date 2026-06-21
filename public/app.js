/**
 * Relationship Timeline - Data Layer and Module Structure
 * 
 * Data-driven rendering: all relationship data is defined here,
 * and the DOM is built dynamically from this data.
 */

// ============================================================
// DATA LAYER
// ============================================================

const relationships = [
  { id: 1,  name: "Erick",               photos: [],                                                                                                              hasFallback: true },
  { id: 2,  name: "Ismael",              photos: ["images/Ismael.jpg"],                                                                                           hasFallback: false },
  { id: 3,  name: "Valmir vôlei",        photos: [],                                                                                                              hasFallback: true },
  { id: 4,  name: "Fabio Jaboatão",      photos: [],                                                                                                              hasFallback: true },
  { id: 5,  name: "Otacílio",            photos: ["images/otacilio.jpg", "images/otacilioCasório.jpeg"],                                                           hasFallback: false },
  { id: 6,  name: "Fábio amigo de Jacó", photos: [],                                                                                                              hasFallback: true },
  { id: 7,  name: "Stenio",              photos: ["images/stenio.jpg", "images/stenio03.JPG", "images/stenio06.jpeg"],                                             hasFallback: false },
  { id: 8,  name: "Fábio Vôlei",         photos: ["images/FabioVôlei01.jpg", "images/fabioVôlei02.jpg", "images/fabioVôlei03.jpg", "images/fabioVôlei05.jpeg"],    hasFallback: false },
  { id: 9,  name: "Pedro Codai",         photos: ["images/pedro01.jpg", "images/pedro04.jpeg", "images/pedro05.jpeg", "images/pedro07.jpeg", "images/pedro6.jpg", "images/pedro7.jpg"], hasFallback: false },
  { id: 10, name: "Henderson",           photos: ["images/Henderson05.jpg", "images/Henderson5.jpg", "images/henderson.JPG"],                                     hasFallback: false },
  { id: 11, name: "Leandro",             photos: ["images/Leandro.jpg"],                                                                                          hasFallback: false },
  { id: 12, name: "Márcio",              photos: ["images/marcio.jpg", "images/marcio01.jpg", "images/marcio04.jpg"],                                              hasFallback: false },
  { id: 13, name: "Nathan",              photos: ["images/Natan.JPG", "images/natan02.jpg", "images/natan03.JPG", "images/natan06.jpeg"],                          hasFallback: false },
  { id: 14, name: "Azevedo",             photos: ["images/azevedo.jpg", "images/azevedo02.jpg", "images/Azevedo07.jpg", "images/azevedo05.jpeg", "images/azevedo05.jpg", "images/azevedo06.jpg"], hasFallback: false },
  { id: 15, name: "Jairo",               photos: ["images/jairo&Eu01.jpg", "images/jairo02.jpg", "images/jairo03.jpg", "images/jairo06.jpeg", "images/jairoCasório.jpg"], hasFallback: false },
  { id: 16, name: "Robyson",             photos: ["images/robyson.jpg", "images/robyson02.jpg"],                                                                  hasFallback: false },
  { id: 17, name: "Patrick",             photos: ["images/Patrick.jpg", "images/patrick02.jpg", "images/patrick05.jpg", "images/patric05.jpg"],                    hasFallback: false },
  { id: 18, name: "Izaac",               photos: ["images/izaac willians.jpg"],                                                                                   hasFallback: false }
];

// ============================================================
// PHOTO LOGIC
// ============================================================

/**
 * Selects the primary photo from an array of photo paths.
 * Priority: filename containing "01" before extension (case-insensitive).
 * Fallback: first photo sorted alphabetically by filename.
 * 
 * @param {string[]} photos - Array of photo paths
 * @returns {string|undefined} The selected primary photo path, or undefined if empty
 */
function getPrimaryPhoto(photos) {
  if (!photos || photos.length === 0) return undefined;

  // 1. Look for photo with "01" suffix before extension (case-insensitive)
  const primary = photos.find(p => /01\.(jpg|jpeg|png)$/i.test(p));
  if (primary) return primary;

  // 2. Fallback: first photo sorted alphabetically by filename
  return [...photos].sort((a, b) => {
    const nameA = a.split('/').pop().toLowerCase();
    const nameB = b.split('/').pop().toLowerCase();
    return nameA.localeCompare(nameB);
  })[0];
}

/**
 * Validates whether a filename has a valid image extension.
 * Accepts .jpg, .jpeg, .png (case-insensitive).
 * 
 * @param {string} filename - The filename to validate
 * @returns {boolean} True if the file has a valid image extension
 */
function isValidImageExtension(filename) {
  return /\.(jpg|jpeg|png)$/i.test(filename);
}

// ============================================================
// CARD CONFIGURATION
// ============================================================

/**
 * Determines card configuration based on 1-based chronological index.
 * 
 * @param {number} index - 1-based position in the timeline
 * @returns {{ position: string, frameType: string, rotation: number }}
 */
function getCardConfig(index) {
  return {
    position: index % 2 === 1 ? 'above' : 'below',
    frameType: index % 2 === 1 ? 'os' : 'polaroid',
    rotation: (Math.random() * 6 - 3) // -3 to +3 degrees
  };
}

// ============================================================
// RENDERING (stubs for future tasks)
// ============================================================

/**
 * Renders the header section with scrapbook-style title and decorative elements.
 * Creates a fun, diary/gossip-page aesthetic with handwriting typography
 * and decorative hearts.
 * 
 * @param {HTMLElement} container - The header container element
 */
function renderHeader(container) {
  if (!container) return;

  // Main title - fun scrapbook diary style
  const title = document.createElement('h1');
  title.textContent = 'Meus Amores Passados 💕';

  // Decorative subtitle for diary/gossip vibe
  const subtitle = document.createElement('p');
  subtitle.className = 'header-subtitle';
  subtitle.textContent = '~ um diário de erros e acertos ~';

  // Decorative hearts row
  const heartsRow = document.createElement('div');
  heartsRow.className = 'header-hearts';
  heartsRow.setAttribute('aria-hidden', 'true');
  heartsRow.textContent = '♡ ❤ ♡ ❤ ♡';

  // Append elements to the header container
  container.appendChild(title);
  container.appendChild(subtitle);
  container.appendChild(heartsRow);
}

/**
 * Creates a photo card element for a relationship with photos.
 * Renders an image inside a styled frame (OS or Polaroid) with caption,
 * error handling with 5-second timeout fallback, and click-to-open modal.
 * 
 * @param {Object} relationship - The relationship data object
 * @param {string} frameType - 'os' or 'polaroid'
 * @param {number} rotation - Rotation in degrees (-3 to +3)
 * @returns {HTMLElement} A card div with photo frame styling
 */
function createPhotoCard(relationship, frameType, rotation) {
  const card = document.createElement('div');
  card.classList.add('card');
  card.classList.add(`frame-${frameType}`);
  card.setAttribute('data-id', String(relationship.id));

  // Store relationship data on the element for modal use
  card._relationshipData = {
    photos: relationship.photos,
    name: relationship.name,
    id: relationship.id
  };

  // Build frame structure based on type
  if (frameType === 'os') {
    // OS Frame: title bar with 3 colored circles, then image, then name
    const titlebar = document.createElement('div');
    titlebar.classList.add('os-titlebar');

    const btnRed = document.createElement('span');
    btnRed.classList.add('os-btn', 'os-btn--red');
    const btnYellow = document.createElement('span');
    btnYellow.classList.add('os-btn', 'os-btn--yellow');
    const btnGreen = document.createElement('span');
    btnGreen.classList.add('os-btn', 'os-btn--green');

    titlebar.appendChild(btnRed);
    titlebar.appendChild(btnYellow);
    titlebar.appendChild(btnGreen);
    card.appendChild(titlebar);

    // Image area
    const imageContainer = document.createElement('div');
    imageContainer.classList.add('card-image');
    const img = createCardImage(relationship, card);
    imageContainer.appendChild(img);
    card.appendChild(imageContainer);

    // Name caption
    const nameEl = document.createElement('div');
    nameEl.classList.add('card-name');
    nameEl.textContent = relationship.name;
    card.appendChild(nameEl);

  } else {
    // Polaroid Frame: image, then name caption (white bottom ≥30px handled by CSS)
    const imageContainer = document.createElement('div');
    imageContainer.classList.add('card-image');
    const img = createCardImage(relationship, card);
    imageContainer.appendChild(img);
    card.appendChild(imageContainer);

    // Name caption
    const nameEl = document.createElement('div');
    nameEl.classList.add('card-name');
    nameEl.textContent = relationship.name;
    card.appendChild(nameEl);
  }

  // Click handler to open modal (gallery or single photo view)
  card.addEventListener('click', function () {
    if (relationship.photos.length > 1) {
      // Open gallery modal with the card as trigger element for focus return
      openGallery(relationship.photos, 0, card);
    } else if (relationship.photos.length === 1) {
      // Open single photo view - stub for now, implemented in task 5.3
      if (typeof openSinglePhoto === 'function') {
        openSinglePhoto(relationship.photos[0]);
      }
    }
  });

  return card;
}

/**
 * Creates the img element for a photo card with error/timeout handling.
 * If the image fails to load or doesn't load within 5 seconds,
 * the card is replaced with a fallback card.
 * 
 * @param {Object} relationship - The relationship data object
 * @param {HTMLElement} card - The card element to potentially replace on error
 * @returns {HTMLImageElement} The configured img element
 */
function createCardImage(relationship, card) {
  const img = document.createElement('img');
  const primaryPhoto = getPrimaryPhoto(relationship.photos);
  img.src = primaryPhoto || '';
  img.alt = relationship.name;

  let timeoutId = null;
  let loaded = false;

  // Start a 5-second timeout — if image hasn't loaded by then, show fallback
  timeoutId = setTimeout(function () {
    if (!loaded) {
      replaceCardWithFallback(card, relationship);
    }
  }, 5000);

  // On successful load, clear the timeout
  img.addEventListener('load', function () {
    loaded = true;
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  });

  // On error, trigger fallback replacement
  img.addEventListener('error', function () {
    if (!loaded) {
      loaded = true; // prevent double replacement
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      replaceCardWithFallback(card, relationship);
    }
  });

  return img;
}

/**
 * Replaces a photo card with a fallback card in the DOM.
 * 
 * @param {HTMLElement} card - The photo card to replace
 * @param {Object} relationship - The relationship data object
 */
function replaceCardWithFallback(card, relationship) {
  const fallback = createFallbackCard(relationship, 0);
  if (card.parentNode) {
    card.parentNode.replaceChild(fallback, card);
  }
}

/**
 * Creates a fallback card element for a relationship without photos.
 * Displays name centered as the largest text element, with a humorous visual.
 * Matches dimensions and styling of Card_Foto (handled by CSS .card-fallback).
 * 
 * Requirements: 4.1, 4.2, 4.3, 4.4
 * 
 * @param {Object} relationship - The relationship data object
 * @param {number} rotation - Rotation in degrees (-3 to +3)
 * @returns {HTMLElement} A card div with fallback styling
 */
function createFallbackCard(relationship, rotation) {
  const card = document.createElement('div');
  card.classList.add('card');
  card.classList.add('card-fallback');
  card.setAttribute('data-id', String(relationship.id));

  // Humorous visual element (Req 4.3)
  const visualEl = document.createElement('div');
  visualEl.classList.add('fallback-visual');

  // Pick a humorous message/element based on relationship id for variety
  const humorousElements = [
    '📸 Foto não encontrada',
    '🤷 Arquivo perdido',
    '❓',
    '💔 Sem registro',
    '👤'
  ];
  const visualContent = humorousElements[relationship.id % humorousElements.length];
  visualEl.textContent = visualContent;

  // Name element - centered, largest text (Req 4.2)
  const nameEl = document.createElement('div');
  nameEl.classList.add('fallback-name');

  // Truncate name at 40 characters with ellipsis if exceeding (Req 4.2)
  const displayName = relationship.name.length > 40
    ? relationship.name.substring(0, 40) + '...'
    : relationship.name;
  nameEl.textContent = displayName;

  // Assemble card: visual on top, name below (both centered via CSS flexbox)
  card.appendChild(visualEl);
  card.appendChild(nameEl);

  return card;
}

/**
 * Card Factory: creates the appropriate card type for a relationship.
 * Uses getCardConfig to determine position, frame type, and rotation.
 * Delegates to createPhotoCard or createFallbackCard based on hasFallback.
 * Applies rotation as inline CSS transform on the returned card.
 * 
 * @param {Object} relationship - The relationship data object
 * @param {number} index - 1-based chronological position
 * @returns {HTMLElement} The rendered card element
 */
function createCard(relationship, index) {
  const config = getCardConfig(index);
  let card;

  if (relationship.hasFallback) {
    card = createFallbackCard(relationship, config.rotation);
  } else {
    card = createPhotoCard(relationship, config.frameType, config.rotation);
  }

  // Apply rotation as inline CSS transform
  card.style.transform = `rotate(${config.rotation}deg)`;

  // Set data-index attribute for tracking chronological position
  card.setAttribute('data-index', String(index));

  return card;
}

/**
 * Renders the full timeline with all cards, dots, connectors, and hearts.
 * 
 * @param {HTMLElement} container - The #timeline-container element
 * @param {Array} data - The relationships array
 */
function renderTimeline(container, data) {
  if (!container || !data || data.length === 0) return;

  // Clear any existing content
  container.innerHTML = '';

  // Create the scrollable wrapper
  const scrollWrapper = document.createElement('div');
  scrollWrapper.classList.add('timeline-scroll');

  // Create the horizontal line
  const line = document.createElement('div');
  line.classList.add('timeline-line');
  scrollWrapper.appendChild(line);

  // Render each relationship as a timeline item
  data.forEach((relationship, arrayIndex) => {
    const index = arrayIndex + 1; // 1-based index
    const config = getCardConfig(index);

    // Create the timeline item wrapper
    const item = document.createElement('div');
    item.classList.add('timeline-item');
    item.classList.add(config.position); // 'above' or 'below'
    item.setAttribute('data-id', String(relationship.id));

    // Create the card (placeholder for now, replaced by full Card Factory in task 3.1)
    const card = createCard(relationship, index);
    item.appendChild(card);

    // Create the vertical connector
    const connector = document.createElement('div');
    connector.classList.add('timeline-connector');
    item.appendChild(connector);

    // Create the dot on the timeline line
    const dot = document.createElement('div');
    dot.classList.add('timeline-dot');
    scrollWrapper.appendChild(dot);

    // Add the timeline item to the scroll wrapper
    scrollWrapper.appendChild(item);
  });

  // Distribute decorative hearts (minimum ceil(N/2))
  const heartsCount = Math.ceil(data.length / 2);
  for (let i = 0; i < heartsCount; i++) {
    const heart = document.createElement('div');
    heart.classList.add('timeline-heart');
    scrollWrapper.appendChild(heart);
  }

  container.appendChild(scrollWrapper);

  // Position dots and hearts after elements are in the DOM
  positionTimelineElements(scrollWrapper, data.length, heartsCount);
}

/**
 * Positions dots and hearts along the timeline based on card positions.
 * Called after DOM elements are added so we can calculate positions.
 * 
 * @param {HTMLElement} scrollWrapper - The .timeline-scroll element
 * @param {number} cardCount - Total number of cards
 * @param {number} heartsCount - Total number of hearts to distribute
 */
function positionTimelineElements(scrollWrapper, cardCount, heartsCount) {
  const items = scrollWrapper.querySelectorAll('.timeline-item');
  const dots = scrollWrapper.querySelectorAll('.timeline-dot');
  const hearts = scrollWrapper.querySelectorAll('.timeline-heart');

  items.forEach((item, i) => {
    if (dots[i]) {
      // Position dot at the horizontal center of each timeline item
      const itemLeft = item.offsetLeft;
      const itemWidth = item.offsetWidth;
      const dotLeft = itemLeft + itemWidth / 2;
      dots[i].style.left = `${dotLeft}px`;
    }
  });

  // Distribute hearts evenly between card positions
  if (items.length > 0 && hearts.length > 0) {
    const positions = [];
    items.forEach((item) => {
      const itemLeft = item.offsetLeft;
      const itemWidth = item.offsetWidth;
      positions.push(itemLeft + itemWidth / 2);
    });

    for (let i = 0; i < hearts.length; i++) {
      // Place hearts between pairs of cards
      const posIndex = Math.min(i * 2 + 1, positions.length - 1);
      const prevPos = positions[Math.max(0, posIndex - 1)];
      const nextPos = positions[Math.min(posIndex, positions.length - 1)];
      const heartLeft = (prevPos + nextPos) / 2;
      hearts[i].style.left = `${heartLeft}px`;
    }
  }
}

/**
 * Renders the final section after the last card.
 * Displays "CONTINUA..." text in handwriting/script typography,
 * decorative hearts, a share button, and feedback element.
 * 
 * Requirements: 8.1, 8.2, 8.4
 * 
 * @param {HTMLElement} container - The footer/final section container
 */
function renderFinalSection(container) {
  if (!container) return;

  // 1. "CONTINUA..." text in handwriting/script typography (Req 8.2)
  const finalText = document.createElement('p');
  finalText.className = 'final-text';
  finalText.textContent = 'CONTINUA...';

  // 2. Decorative hearts matching timeline visual (Req 8.4)
  const hearts = document.createElement('div');
  hearts.className = 'final-hearts';
  hearts.setAttribute('aria-hidden', 'true');
  hearts.textContent = '♡ ❤ ♡ ❤ ♡';

  // 3. Share button with scrapbook styling (Req 8.3)
  const shareButton = document.createElement('button');
  shareButton.className = 'share-button';
  shareButton.textContent = 'Compartilhar 💌';
  shareButton.addEventListener('click', function () {
    handleShare();
  });

  // 4. Share feedback element (hidden by default)
  const shareFeedback = document.createElement('p');
  shareFeedback.className = 'share-feedback';
  shareFeedback.textContent = 'Link copiado! ✓';

  // Append all elements to container
  container.appendChild(finalText);
  container.appendChild(hearts);
  container.appendChild(shareButton);
  container.appendChild(shareFeedback);
}

// ============================================================
// MODAL / LIGHTBOX CONTROLLER
// ============================================================

/**
 * State object for the modal/lightbox component.
 * Tracks whether the modal is open, which photos are shown,
 * current index for gallery navigation, and the trigger element for focus return.
 */
const modalState = {
  isOpen: false,
  photos: [],
  currentIndex: 0,
  triggerElement: null,
  type: 'gallery' // 'gallery' | 'single'
};

/** @type {HTMLElement|null} Reference to the modal overlay element */
let modalOverlay = null;

/**
 * Initializes the modal by creating the overlay element and appending it to the body.
 * Sets up event listeners for closing: click outside, close button, Escape key.
 */
function initModal() {
  // Create the modal overlay element
  modalOverlay = document.createElement('div');
  modalOverlay.classList.add('modal-overlay');
  modalOverlay.setAttribute('role', 'dialog');
  modalOverlay.setAttribute('aria-modal', 'true');

  // Create modal content container
  const modalContent = document.createElement('div');
  modalContent.classList.add('modal-content');

  // Create close button
  const closeBtn = document.createElement('button');
  closeBtn.classList.add('modal-close');
  closeBtn.setAttribute('aria-label', 'Fechar');
  closeBtn.textContent = '×';

  // Assemble the overlay structure
  modalOverlay.appendChild(modalContent);
  modalOverlay.appendChild(closeBtn);

  // Append to body
  document.body.appendChild(modalOverlay);

  // --- Event Listeners ---

  // Close button click
  closeBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    closeModal();
  });

  // Click on overlay (outside content) → close modal
  modalOverlay.addEventListener('click', function (e) {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });

  // Escape key → close modal
  // Arrow keys → gallery navigation
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modalState.isOpen) {
      closeModal();
    }
    if (modalState.isOpen && modalState.type === 'gallery') {
      if (e.key === 'ArrowLeft') {
        navigateGallery('prev');
      } else if (e.key === 'ArrowRight') {
        navigateGallery('next');
      }
    }
  });
}

/**
 * Opens a single photo centered in the modal with dark overlay.
 * Used when a relationship has only one photo.
 * 
 * Requirements: 5.5
 * - Display single photo centered, max 90% width and 90% height of viewport
 * - Dark overlay background
 * - Close on click outside, close button, or Escape key
 * 
 * @param {string} photoSrc - The source path for the single photo
 */
function openSinglePhoto(photoSrc) {
  if (!modalOverlay || !photoSrc) return;

  // Update modal state
  modalState.isOpen = true;
  modalState.photos = [photoSrc];
  modalState.currentIndex = 0;
  modalState.type = 'single';
  modalState.triggerElement = document.activeElement;

  // Activate overlay
  modalOverlay.classList.add('active');

  // Clear modal content
  const content = modalOverlay.querySelector('.modal-content');
  if (content) {
    content.innerHTML = '';

    // Create img element
    const img = document.createElement('img');
    img.src = photoSrc;
    img.alt = 'Foto';
    img.style.maxWidth = '90vw';
    img.style.maxHeight = '90vh';
    img.style.objectFit = 'contain';

    // Append to modal content
    content.appendChild(img);
  }
}

/**
 * Closes the modal: removes .active class, resets state,
 * clears content, and returns focus to the trigger element.
 */
function closeModal() {
  if (!modalOverlay) return;

  // Remove active class to hide overlay
  modalOverlay.classList.remove('active');

  // Update state
  modalState.isOpen = false;

  // Return focus to the element that triggered the modal
  if (modalState.triggerElement && modalState.triggerElement.focus) {
    modalState.triggerElement.focus();
  }

  // Clear modal content
  const content = modalOverlay.querySelector('.modal-content');
  if (content) {
    content.innerHTML = '';
  }

  // Reset state
  modalState.photos = [];
  modalState.currentIndex = 0;
  modalState.triggerElement = null;
}

// ============================================================
// GALLERY NAVIGATION (Task 5.2)
// ============================================================

/**
 * Opens the gallery modal with all photos for a relationship.
 * Starts display at the given index (typically 0 for primary photo).
 * 
 * Requirements: 5.2, 5.3, 5.6
 * 
 * @param {string[]} photos - Array of photo paths for the relationship
 * @param {number} startIndex - Index to start the gallery at (0-based)
 * @param {HTMLElement} [triggerEl] - The card element that triggered the gallery (for focus return)
 */
function openGallery(photos, startIndex, triggerEl) {
  if (!modalOverlay || !photos || photos.length === 0) return;

  // Set modal state
  modalState.isOpen = true;
  modalState.photos = photos;
  modalState.currentIndex = startIndex || 0;
  modalState.type = 'gallery';
  modalState.triggerElement = triggerEl || document.activeElement;

  // Activate overlay
  modalOverlay.classList.add('active');

  // Render the gallery content
  renderGalleryContent();
}

/**
 * Navigates the gallery in the given direction.
 * Clamps navigation to valid bounds (0 to photos.length - 1).
 * 
 * Requirements: 5.3
 * 
 * @param {'prev'|'next'} direction - Navigation direction
 */
function navigateGallery(direction) {
  if (!modalState.isOpen || modalState.type !== 'gallery') return;

  if (direction === 'next') {
    modalState.currentIndex = Math.min(modalState.currentIndex + 1, modalState.photos.length - 1);
  } else if (direction === 'prev') {
    modalState.currentIndex = Math.max(modalState.currentIndex - 1, 0);
  }

  renderGalleryContent();
}

/**
 * Renders (or re-renders) the gallery content inside the modal.
 * Displays the current photo, prev/next buttons, and position indicator.
 * 
 * Requirements: 5.2, 5.3, 5.6
 */
function renderGalleryContent() {
  if (!modalOverlay) return;

  const content = modalOverlay.querySelector('.modal-content');
  if (!content) return;

  // Clear existing content
  content.innerHTML = '';

  const photos = modalState.photos;
  const currentIndex = modalState.currentIndex;

  // Create the gallery image
  const img = document.createElement('img');
  img.src = photos[currentIndex];
  img.alt = `Foto ${currentIndex + 1} de ${photos.length}`;
  img.classList.add('gallery-image');
  content.appendChild(img);

  // Create prev button
  const prevBtn = document.createElement('button');
  prevBtn.classList.add('modal-nav', 'modal-nav--prev');
  prevBtn.setAttribute('aria-label', 'Foto anterior');
  prevBtn.textContent = '‹';
  prevBtn.disabled = currentIndex === 0;
  prevBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    navigateGallery('prev');
  });
  content.appendChild(prevBtn);

  // Create next button
  const nextBtn = document.createElement('button');
  nextBtn.classList.add('modal-nav', 'modal-nav--next');
  nextBtn.setAttribute('aria-label', 'Próxima foto');
  nextBtn.textContent = '›';
  nextBtn.disabled = currentIndex === photos.length - 1;
  nextBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    navigateGallery('next');
  });
  content.appendChild(nextBtn);

  // Create position indicator "N de T" format (1-based)
  const indicator = document.createElement('div');
  indicator.classList.add('modal-indicator');
  indicator.textContent = `${currentIndex + 1} de ${photos.length}`;
  content.appendChild(indicator);
}

// ============================================================
// SHARE HANDLER
// ============================================================

/**
 * Handles sharing the page via Web Share API or clipboard fallback.
 * 
 * 1. Tries navigator.share() first (mobile/supported browsers)
 * 2. Falls back to clipboard copy if share not available
 * 3. Shows visual feedback on successful clipboard copy
 * 4. Handles errors gracefully (cancellation = no-op, clipboard failure = error message)
 * 
 * Requirements: 8.3
 */
async function handleShare() {
  const url = window.location.href;
  const title = 'Meus Amores Passados';

  // Try Web Share API first
  if (navigator.share) {
    try {
      await navigator.share({ title, url });
      return; // Success — done
    } catch (err) {
      // User cancelled or share was dismissed — no-op
      if (err.name === 'AbortError' || err.name === 'NotAllowedError') {
        return;
      }
      // Other share errors: fall through to clipboard
    }
  }

  // Fallback: copy URL to clipboard
  const feedbackEl = document.querySelector('.share-feedback');

  try {
    await navigator.clipboard.writeText(url);
    // Show success feedback
    if (feedbackEl) {
      feedbackEl.textContent = 'Link copiado! ✓';
      feedbackEl.classList.add('visible');
      // Hide feedback after ~3 seconds
      setTimeout(() => {
        feedbackEl.classList.remove('visible');
      }, 3000);
    }
  } catch (err) {
    // Clipboard failure: show error message
    if (feedbackEl) {
      feedbackEl.textContent = 'Não foi possível copiar';
      feedbackEl.classList.add('visible');
      setTimeout(() => {
        feedbackEl.classList.remove('visible');
      }, 3000);
    }
  }
}

// ============================================================
// ENTRY POINT
// ============================================================

/**
 * Initializes the application when DOM is ready.
 * Triggers full render of header, timeline, and final section.
 */
function initApp() {
  const header = document.getElementById('site-header');
  const timeline = document.getElementById('timeline-container');
  const finalSection = document.getElementById('final-section');

  renderHeader(header);
  renderTimeline(timeline, relationships);
  renderFinalSection(finalSection);
  initModal();
}

document.addEventListener('DOMContentLoaded', initApp);

// ============================================================
// MODULE EXPORTS (for testability)
// ============================================================

export {
  relationships,
  getPrimaryPhoto,
  isValidImageExtension,
  getCardConfig,
  createCard,
  createPhotoCard,
  createCardImage,
  replaceCardWithFallback,
  createFallbackCard,
  renderHeader,
  renderTimeline,
  renderFinalSection,
  handleShare,
  modalState,
  initModal,
  openSinglePhoto,
  closeModal,
  openGallery,
  navigateGallery,
  renderGalleryContent,
  initApp
};
