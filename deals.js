// Home page deal cards — built from PRODUCTS so prices and discounts stay in sync.

function discountPercent(product) {
  return product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;
}

function byDiscount(a, b) {
  return discountPercent(b) - discountPercent(a);
}

function pickProducts(filter, count) {
  return PRODUCTS.filter(filter).sort(byDiscount).slice(0, count);
}

// Simple line icons for products that don't have a photo yet.
const DEAL_ICONS = {
  camera: '<circle cx="24" cy="26" r="13"/><circle cx="24" cy="26" r="5"/><path d="M14 10h20"/><path d="M24 10v3"/>',
  keyboard: '<rect x="4" y="14" width="40" height="20" rx="3"/><path d="M10 20h2M16 20h2M22 20h2M28 20h2M34 20h2M10 26h2M34 26h2M16 28h16"/>',
  speaker: '<rect x="12" y="4" width="24" height="40" rx="5"/><circle cx="24" cy="29" r="7"/><circle cx="24" cy="13" r="3"/>',
  monitor: '<rect x="4" y="8" width="40" height="24" rx="2"/><path d="M24 32v8M14 40h20"/>',
  charger: '<rect x="14" y="16" width="20" height="26" rx="4"/><path d="M19 16V6M29 16V6"/><path d="M25 22l-4 7h6l-4 7"/>',
  car: '<path d="M6 30l4-12a4 4 0 0 1 4-3h20a4 4 0 0 1 4 3l4 12"/><rect x="4" y="30" width="40" height="8" rx="3"/><circle cx="13" cy="38" r="3"/><circle cx="35" cy="38" r="3"/>',
  phone: '<rect x="14" y="4" width="20" height="40" rx="4"/><path d="M21 38h6"/>',
  dvr: '<rect x="4" y="16" width="40" height="16" rx="3"/><circle cx="12" cy="24" r="2"/><path d="M20 24h18"/>',
  gauge: '<path d="M8 34a16 16 0 1 1 32 0"/><path d="M24 34l8-10"/><circle cx="24" cy="34" r="2.5"/><path d="M6 40h36"/>',
  radio: '<rect x="4" y="16" width="40" height="22" rx="3"/><circle cx="14" cy="27" r="5"/><path d="M26 23h12M26 29h8M10 16l20-8"/>',
  box: '<path d="M6 14l18-8 18 8v20l-18 8-18-8z"/><path d="M6 14l18 8 18-8M24 22v20"/>'
};

function iconFor(product) {
  const name = product.name.toLowerCase();
  if (name.includes('dvr')) return 'dvr';
  if (name.includes('camera')) return 'camera';
  if (name.includes('keyboard')) return 'keyboard';
  if (name.includes('inflator')) return 'gauge';
  if (name.includes('stereo') || name.includes('fm ')) return 'radio';
  if (name.includes('speaker')) return 'speaker';
  if (name.includes('stand') || name.includes('monitor')) return 'monitor';
  if (name.includes('charger')) return 'charger';
  if (name.includes('mount') || name.includes('iphone')) return 'phone';
  if (product.category === 'Automotive') return 'car';
  return 'box';
}

function dealTileHTML(product) {
  const discount = discountPercent(product);
  const visual = product.image
    ? `<img src="${product.image}" alt="" loading="lazy">`
    : `<svg viewBox="0 0 48 48" aria-hidden="true">${DEAL_ICONS[iconFor(product)]}</svg>`;
  const badge = discount
    ? `<span class="deal-badge">${discount}% off</span>`
    : `<span class="deal-badge deal-badge-price">${formatCatalogPrice(product.price)}</span>`;

  return `
    <a class="deal-tile" href="${product.categoryUrl}" title="${escapeHtml(product.name)}">
      <span class="deal-visual">${visual}</span>
      ${badge}
      <span class="sr-only">${escapeHtml(product.name)}</span>
    </a>`;
}

const FEATURE_ART = `
  <svg class="deal-art" viewBox="0 0 260 250" aria-hidden="true">
    <defs>
      <radialGradient id="dealArch" cx="0.5" cy="0.35" r="0.7">
        <stop offset="0" stop-color="#b9d4ea"/>
        <stop offset="1" stop-color="#5a86ab"/>
      </radialGradient>
      <radialGradient id="dealDome" cx="0.35" cy="0.3" r="0.8">
        <stop offset="0" stop-color="#5d7891"/>
        <stop offset="1" stop-color="#1e2d3a"/>
      </radialGradient>
      <radialGradient id="dealLens" cx="0.4" cy="0.35" r="0.7">
        <stop offset="0" stop-color="#9fd0ff"/>
        <stop offset="0.5" stop-color="#2f6ea3"/>
        <stop offset="1" stop-color="#0d1b27"/>
      </radialGradient>
      <filter id="dealBlur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="5"/></filter>
    </defs>

    <!-- Glowing arch -->
    <path d="M40 250V115a90 90 0 0 1 180 0v135z" fill="url(#dealArch)"/>
    <path class="deal-glow" d="M40 250V115a90 90 0 0 1 180 0v135" fill="none" stroke="#fff" stroke-width="8" filter="url(#dealBlur)"/>
    <path d="M40 250V115a90 90 0 0 1 180 0v135" fill="none" stroke="#fff" stroke-width="2.5"/>
    <path d="M62 250V120a68 68 0 0 1 136 0v130" fill="none" stroke="#fff" stroke-opacity="0.35" stroke-width="1.5"/>

    <!-- Gift boxes -->
    <rect x="52" y="160" width="58" height="60" rx="3" fill="#324758"/>
    <rect x="77" y="160" width="8" height="60" fill="#d85a30"/>
    <rect x="62" y="128" width="40" height="34" rx="3" fill="#4d6d88"/>
    <rect x="79" y="128" width="6" height="34" fill="#d85a30"/>
    <rect x="180" y="176" width="42" height="44" rx="3" fill="#4d6d88"/>
    <rect x="198" y="176" width="6" height="44" fill="#d85a30"/>

    <!-- Security dome camera -->
    <g class="deal-float">
      <rect x="148" y="102" width="14" height="22" rx="3" fill="#dbe7f1"/>
      <ellipse cx="155" cy="102" rx="30" ry="7" fill="#eef4f9"/>
      <circle cx="155" cy="168" r="50" fill="url(#dealDome)"/>
      <circle cx="160" cy="165" r="22" fill="#0d1b27"/>
      <circle cx="160" cy="165" r="17" fill="url(#dealLens)"/>
      <circle cx="154" cy="158" r="4" fill="#fff" opacity="0.8"/>
      <circle class="deal-led" cx="182" cy="140" r="3" fill="#d85a30"/>
      <path d="M120 140a50 50 0 0 1 30-26" fill="none" stroke="#fff" stroke-opacity="0.35" stroke-width="4" stroke-linecap="round"/>
    </g>

    <!-- Stage -->
    <rect x="0" y="220" width="260" height="30" fill="#6f98bd"/>
    <path d="M0 220h260" stroke="#fff" stroke-opacity="0.5" stroke-width="2"/>
  </svg>`;

const RIBBON_BOW = `
  <svg class="deal-bow" viewBox="0 0 120 50" aria-hidden="true">
    <path d="M60 30C42 4 14 6 22 22s28 10 38 8z" fill="#e7b75f" stroke="#b9862f" stroke-width="2"/>
    <path d="M60 30C78 4 106 6 98 22S70 32 60 30z" fill="#e7b75f" stroke="#b9862f" stroke-width="2"/>
    <path d="M56 32L44 50M64 32l12 18" stroke="#e7b75f" stroke-width="6" stroke-linecap="round"/>
    <circle cx="60" cy="30" r="7" fill="#d9a441" stroke="#b9862f" stroke-width="2"/>
  </svg>`;

const PHONE_ART = `
  <svg class="deal-art" viewBox="0 0 260 250" aria-hidden="true">
    <defs>
      <linearGradient id="phoneScreen" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#b9d4ea"/>
        <stop offset="0.55" stop-color="#709ec4"/>
        <stop offset="1" stop-color="#324758"/>
      </linearGradient>
      <linearGradient id="phoneStand" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#324758"/>
        <stop offset="0.5" stop-color="#5a86ab"/>
        <stop offset="1" stop-color="#324758"/>
      </linearGradient>
      <filter id="phoneBlur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="10"/></filter>
    </defs>

    <!-- Halo and orbit rings -->
    <circle class="deal-glow" cx="130" cy="115" r="78" fill="#fff" opacity="0.45" filter="url(#phoneBlur)"/>
    <ellipse cx="130" cy="120" rx="118" ry="34" fill="none" stroke="#fff" stroke-opacity="0.45" stroke-width="2" transform="rotate(-14 130 120)"/>
    <ellipse cx="130" cy="120" rx="100" ry="24" fill="none" stroke="#fff" stroke-opacity="0.25" stroke-width="1.5" transform="rotate(10 130 120)"/>

    <!-- Sparkles -->
    <g class="hero-sparkles" fill="#fff">
      <circle cx="40" cy="70" r="2.5"/>
      <circle cx="220" cy="55" r="2"/>
      <circle cx="205" cy="160" r="2.5"/>
      <circle cx="58" cy="150" r="1.8"/>
    </g>

    <!-- Stand -->
    <rect x="45" y="212" width="170" height="40" fill="url(#phoneStand)"/>
    <ellipse cx="130" cy="212" rx="85" ry="13" fill="#8fb8dc"/>
    <ellipse class="deal-glow" cx="130" cy="220" rx="82" ry="12" fill="none" stroke="#fff" stroke-width="4" filter="url(#phoneBlur)"/>
    <ellipse cx="130" cy="220" rx="82" ry="12" fill="none" stroke="#fff" stroke-width="1.5"/>

    <!-- Smartphone -->
    <g class="deal-float">
      <rect x="93" y="38" width="74" height="160" rx="15" fill="#1e2d3a"/>
      <rect x="99" y="45" width="62" height="146" rx="10" fill="url(#phoneScreen)"/>
      <rect x="118" y="51" width="24" height="7" rx="3.5" fill="#1e2d3a"/>
      <path d="M99 150c14-12 26 8 40-4s22-6 22-6v41a10 10 0 0 1-10 10h-42a10 10 0 0 1-10-10z" fill="#d85a30" opacity="0.85"/>
      <g fill="#fff" opacity="0.9">
        <rect x="109" y="72" width="12" height="12" rx="3"/>
        <rect x="124" y="72" width="12" height="12" rx="3"/>
        <rect x="139" y="72" width="12" height="12" rx="3"/>
        <rect x="109" y="88" width="12" height="12" rx="3"/>
        <rect x="124" y="88" width="12" height="12" rx="3"/>
      </g>
      <path d="M104 50l10 0-14 60z" fill="#fff" opacity="0.12"/>
    </g>
  </svg>`;

const BOLT_ICON = '<svg class="deal-bolt" viewBox="0 0 24 24" aria-hidden="true"><path d="M13 2L4 14h7l-1 8 9-12h-7z"/></svg>';

const DEAL_ROWS = {
  main: [
    {
      kind: 'feature',
      eyebrow: 'GGE Big Deal Days',
      title: 'Save on home security',
      href: 'category.html',
      art: FEATURE_ART
    },
    {
      title: "Don't miss these deals",
      products: pickProducts((product) => product.oldPrice, 4)
    },
    {
      kind: 'gift',
      eyebrow: 'GGE Big Deal Days',
      title: 'Tech gifts you’ll love',
      products: pickProducts((product) => ['Electronics', 'Accessories'].includes(product.category), 4)
    },
    {
      title: 'Upgrade your car',
      products: pickProducts((product) => product.category === 'Automotive', 4)
    },
    {
      title: 'Keep your home safe',
      products: pickProducts((product) => product.category === 'Security', 4)
    }
  ],
  more: [
    {
      kind: 'feature',
      eyebrow: 'Just landed',
      title: 'The latest smartphones',
      href: 'electronics.html',
      art: PHONE_ART
    },
    {
      title: 'Great buys under $50',
      products: pickProducts((product) => product.price < 50, 4)
    },
    {
      kind: 'flash',
      eyebrow: 'Today only',
      title: 'Flash deals',
      products: pickProducts((product) => product.oldPrice && product.price >= 50, 4)
    },
    {
      title: 'Everyday accessories',
      products: pickProducts((product) => product.category === 'Accessories', 4)
    }
  ]
};

function dealCardHTML(card) {
  const eyebrow = card.eyebrow ? `<p class="deal-eyebrow">${card.eyebrow}</p>` : '';
  const bolt = card.kind === 'flash' ? BOLT_ICON : '';
  const heading = `${eyebrow}<h3>${bolt}${escapeHtml(card.title)}</h3>`;

  if (card.kind === 'feature') {
    return `<a class="deal-card deal-card-feature" href="${card.href}">${heading}${card.art}</a>`;
  }

  const kindClass = card.kind ? ` deal-card-${card.kind}` : '';
  const bow = card.kind === 'gift' ? RIBBON_BOW : '';
  const countdown = card.kind === 'flash'
    ? '<p class="deal-countdown">Ends in <span data-countdown>--:--:--</span></p>'
    : '';
  return `
    <div class="deal-card${kindClass}">
      ${heading}
      ${countdown}
      ${bow}
      <div class="deal-grid">${card.products.map(dealTileHTML).join('')}</div>
    </div>`;
}

// Flash deals count down to midnight, then start again.
function updateCountdowns() {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  const seconds = Math.floor((midnight - now) / 1000);
  const parts = [Math.floor(seconds / 3600), Math.floor(seconds / 60) % 60, seconds % 60];
  const text = parts.map((part) => String(part).padStart(2, '0')).join(':');
  document.querySelectorAll('[data-countdown]').forEach((element) => { element.textContent = text; });
}

function renderDealRow(section) {
  const track = section.querySelector('.deals-track');
  track.innerHTML = DEAL_ROWS[section.dataset.deals].map(dealCardHTML).join('');

  const prevButton = section.querySelector('.deals-prev');
  const nextButton = section.querySelector('.deals-next');

  function updateArrows() {
    prevButton.hidden = track.scrollLeft <= 4;
    nextButton.hidden = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
  }

  prevButton.addEventListener('click', () => track.scrollBy({ left: -track.clientWidth * 0.8, behavior: 'smooth' }));
  nextButton.addEventListener('click', () => track.scrollBy({ left: track.clientWidth * 0.8, behavior: 'smooth' }));
  track.addEventListener('scroll', updateArrows, { passive: true });
  window.addEventListener('resize', updateArrows);
  updateArrows();
}

document.querySelectorAll('[data-deals]').forEach(renderDealRow);
updateCountdowns();
setInterval(updateCountdowns, 1000);
