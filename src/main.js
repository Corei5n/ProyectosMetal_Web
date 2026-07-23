import './styles.css';
import logoUrl from './assets/logo/logo.png';
import whatsappIconUrl from './assets/icons/whatsapp.png';
import phoneIconUrl from './assets/icons/phone.png';

const businessName = 'Proyectos De Metal';
const locationText = 'Cuernavaca, Morelos';
const phoneDisplay = '777 509 35 69';
const phoneInternational = '527775093569';
const emailAddress = 'herreriamoderna2010@gmail.com';
const waBase = `https://wa.me/${phoneInternational}`;
const siteUrl =
  import.meta.env.VITE_SITE_URL || new URL(import.meta.env.BASE_URL || './', window.location.href).href;
const siteTitle = `${businessName} | Herrería en Cuernavaca, Morelos`;
const siteDescription =
  'Fabricación e instalación de portones, escaleras, techados, pergolados y estructuras metálicas a medida en Cuernavaca, Morelos.';

const EXPECTED_CATEGORIES = [
  'portones',
  'escaleras',
  'pergolados',
  'techados',
  'barandales',
  'protecciones',
  'puertas',
  'estructuras',
  'otros'
];

const HERO_TEXT = {
  title: 'Herrería y estructuras hechas para durar',
  description:
    'Fabricamos e instalamos portones, escaleras, techados, pergolados y estructuras metálicas a medida en Cuernavaca, Morelos.',
  ctaProjects: 'Ver proyectos',
  ctaQuote: 'Solicitar cotización'
};

const CONTACT_MESSAGE =
  'Hola, vi el sitio web de Proyectos De Metal y me gustaría solicitar una cotización.';

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: businessName,
  telephone: '+52 777 509 3569',
  email: emailAddress,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Cuernavaca',
    addressRegion: 'Morelos',
    addressCountry: 'MX'
  }
};

const heroImages = import.meta.glob('/src/assets/hero/*.{jpg,jpeg,png,webp,avif}', {
  eager: true,
  import: 'default'
});

const projectImages = import.meta.glob('/src/assets/proyectos/**/*.{jpg,jpeg,png,webp,avif}', {
  eager: true,
  import: 'default'
});

const app = document.querySelector('#app');
const state = {
  filter: 'all',
  lightboxIndex: 0,
  lightboxItems: [],
  allLightboxItems: [],
  lastFocus: null,
  menuOpen: false
};

let revealObserver = null;

const slugToTitle = (slug) => {
  const replacements = {
    metalicas: 'metálicas',
    metalico: 'metálico',
    metalicos: 'metálicos',
    porton: 'portón',
    portones: 'portones',
    pergolado: 'pergolado',
    pergolados: 'pergolados',
    techado: 'techado',
    techados: 'techados',
    barandal: 'barandal',
    barandales: 'barandales',
    proteccion: 'protección',
    protecciones: 'protecciones',
    estructura: 'estructura',
    estructuras: 'estructuras',
    puertas: 'puertas'
  };

  return slug
    .replace(/[-_]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => replacements[word.toLowerCase()] || word.toLowerCase())
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const filenameToAlt = (filename) => {
  const base = filename
    .replace(/\.[^.]+$/, '')
    .replace(/^\d+[-_.\s]*/g, '')
    .replace(/[-_]+/g, ' ')
    .trim();

  const replacements = {
    porton: 'portón',
    portones: 'portones',
    pergolado: 'pergolado',
    pergolados: 'pergolados',
    techado: 'techado',
    techados: 'techados',
    barandal: 'barandal',
    barandales: 'barandales',
    proteccion: 'protección',
    protecciones: 'protecciones',
    estructura: 'estructura',
    estructuras: 'estructuras',
    metalica: 'metálica',
    metalicas: 'metálicas'
  };

  return base
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => replacements[word.toLowerCase()] || word.toLowerCase())
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const naturalSort = (a, b) => a.localeCompare(b, 'es', { numeric: true, sensitivity: 'base' });
const encodeWhatsAppMessage = (message) => encodeURIComponent(message);
const createWhatsAppLink = (message) => `${waBase}?text=${encodeWhatsAppMessage(message)}`;
const escapeHtml = (value) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const heroImage = Object.values(heroImages)[0] || '';

const projectItems = Object.entries(projectImages)
  .map(([path, src]) => {
    const normalizedPath = path.replace(/\\/g, '/');
    const afterRoot = normalizedPath.split('/src/assets/proyectos/')[1] || '';
    const [categorySlug] = afterRoot.split('/');
    const filename = normalizedPath.split('/').pop() || '';

    return {
      path: normalizedPath,
      src,
      categorySlug,
      category: slugToTitle(categorySlug),
      filename,
      alt: filenameToAlt(filename),
      orderKey: `${categorySlug}/${filename}`
    };
  })
  .sort((a, b) => naturalSort(a.orderKey, b.orderKey));

const detectedCategories = [...new Set(projectItems.map((item) => item.categorySlug))].sort(naturalSort);
const categoryItems = detectedCategories.length ? detectedCategories : EXPECTED_CATEGORIES;

async function buildApp() {
  if (!app) return;

  app.innerHTML = `
    <a class="skip-link" href="#contenido">Saltar al contenido</a>
    <header class="site-header" data-header>
      <div class="container header-inner">
        <a class="brand" href="#inicio" aria-label="${escapeHtml(businessName)}">
          <img class="brand-logo" src="${logoUrl}" alt="${escapeHtml(businessName)}" />
          <span class="brand-copy">
            <strong>${escapeHtml(businessName)}</strong>
            <span>${escapeHtml(locationText)}</span>
          </span>
        </a>

        <nav class="desktop-nav" aria-label="Navegación principal">
          <a href="#inicio">Inicio</a>
          <a href="#servicios">Servicios</a>
          <a href="#proyectos">Proyectos</a>
          <a href="#nosotros">Nosotros</a>
          <a href="#contacto">Contacto</a>
        </nav>

        <div class="header-actions">
          <a class="btn btn-ghost desktop-only" href="${createWhatsAppLink(CONTACT_MESSAGE)}" target="_blank" rel="noreferrer">
            WhatsApp
          </a>
          <button
            class="menu-toggle"
            type="button"
            aria-expanded="false"
            aria-controls="mobile-menu"
            aria-label="Abrir menú de navegación"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>

    <div class="mobile-menu-backdrop" data-menu-backdrop hidden></div>
    <aside class="mobile-menu" id="mobile-menu" aria-hidden="true">
      <div class="mobile-menu-top">
        <span class="mobile-menu-title">${escapeHtml(businessName)}</span>
        <button class="icon-button" type="button" data-close-menu aria-label="Cerrar menú">×</button>
      </div>
      <nav class="mobile-nav" aria-label="Navegación móvil">
        <a href="#inicio" data-menu-link>Inicio</a>
        <a href="#servicios" data-menu-link>Servicios</a>
        <a href="#proyectos" data-menu-link>Proyectos</a>
        <a href="#nosotros" data-menu-link>Nosotros</a>
        <a href="#contacto" data-menu-link>Contacto</a>
      </nav>
      <a class="btn btn-primary mobile-menu-whatsapp" href="${createWhatsAppLink(CONTACT_MESSAGE)}" target="_blank" rel="noreferrer">
        WhatsApp
      </a>
    </aside>

    <main id="contenido">
      <section class="hero section-shell" id="inicio">
        <div class="hero-grid container">
          <div class="hero-copy reveal">
            <div class="hero-logo-wrap">
              <img class="hero-logo" src="${logoUrl}" alt="${escapeHtml(businessName)}" />
            </div>
            <p class="eyebrow">Herrería premium en ${escapeHtml(locationText)}</p>
            <h1>${escapeHtml(HERO_TEXT.title)}</h1>
            <p class="hero-description">${escapeHtml(HERO_TEXT.description)}</p>
            <div class="hero-actions">
              <a class="btn btn-primary" href="#proyectos">${escapeHtml(HERO_TEXT.ctaProjects)}</a>
              <a class="btn btn-secondary" href="${createWhatsAppLink(CONTACT_MESSAGE)}" target="_blank" rel="noreferrer">
                ${escapeHtml(HERO_TEXT.ctaQuote)}
              </a>
            </div>
            <ul class="hero-points" aria-label="Ventajas principales">
              <li>Diseño a medida</li>
              <li>Acabados resistentes</li>
              <li>Instalación profesional</li>
            </ul>
          </div>

          <figure class="hero-media reveal">
            ${
              heroImage
                ? `<img src="${heroImage}" alt="Trabajo destacado de herrería de ${escapeHtml(businessName)}" />`
                : `<div class="hero-fallback" role="img" aria-label="Espacio destacado para una fotografía principal de herrería">
                    <span>Agrega <strong>src/assets/hero/hero.jpg</strong> para mostrar tu imagen principal</span>
                  </div>`
            }
            <figcaption>
              <span>Cuernavaca, Morelos</span>
              <span>Fabricación e instalación</span>
            </figcaption>
          </figure>
        </div>
      </section>

      <section class="section-shell services-section" id="servicios">
        <div class="container section-heading reveal">
          <p class="eyebrow">Servicios</p>
          <h2>Categorías pensadas para encontrar la solución ideal para tu proyecto</h2>
          <p>Explora trabajos reales, compara estilos y descubre ideas para tu próximo portón, escalera, techado o estructura metálica.</p>
        </div>
        <div class="container services-grid" data-services-grid></div>
      </section>

      <section class="section-shell portfolio-section" id="proyectos">
        <div class="container section-heading reveal">
          <p class="eyebrow">Portafolio</p>
          <h2 class="portfolio-title">Portafolio de trabajos realizado</h2>
        </div>

        <div class="container filters-wrap">
          <div class="filters" role="tablist" aria-label="Filtros de categorías" data-filters></div>
        </div>

        <div class="container">
          <div class="portfolio-grid" data-portfolio-grid></div>
        </div>
      </section>

      <section class="section-shell about-section" id="nosotros">
        <div class="container about-grid">
          <div class="about-copy reveal">
            <p class="eyebrow">Nosotros</p>
            <h2>Una herrería con presencia, precisión y buenos acabados</h2>
            <p>
              En Proyectos De Metal fabricamos trabajos de herrería y estructuras metálicas a medida,
              combinando resistencia, funcionalidad y buenos acabados. Atendemos proyectos en Cuernavaca,
              Morelos, desde la fabricación hasta la instalación.
            </p>
          </div>
          <div class="advantages-card reveal">
            <h3>Ventajas</h3>
            <div class="advantages-list">
              <article>
                <span>01</span>
                <h4>Fabricación a medida</h4>
              </article>
              <article>
                <span>02</span>
                <h4>Materiales resistentes</h4>
              </article>
              <article>
                <span>03</span>
                <h4>Atención directa</h4>
              </article>
              <article>
                <span>04</span>
                <h4>Instalación profesional</h4>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section class="section-shell contact-section" id="contacto">
        <div class="container section-heading reveal">
          <p class="eyebrow">Contacto</p>
          <h2>Hablemos de tu próximo proyecto</h2>
          <p>Elige el canal que prefieras y solicita tu cotización directamente.</p>
        </div>
        <div class="container contact-grid">
          <article class="contact-card reveal">
            <div class="contact-icon contact-icon--whatsapp" aria-hidden="true">
              <img src="${whatsappIconUrl}" alt="" />
            </div>
            <h3>WhatsApp</h3>
            <p>${escapeHtml(phoneDisplay)}</p>
            <a class="btn btn-primary" href="${createWhatsAppLink(CONTACT_MESSAGE)}" target="_blank" rel="noreferrer">Abrir chat</a>
          </article>
          <article class="contact-card reveal">
            <div class="contact-icon contact-icon--phone" aria-hidden="true">
              <img src="${phoneIconUrl}" alt="" />
            </div>
            <h3>Teléfono</h3>
            <p>${escapeHtml(phoneDisplay)}</p>
            <a class="btn btn-secondary" href="tel:+${phoneInternational}">Llamar</a>
          </article>
          <article class="contact-card reveal">
            <div class="contact-icon" aria-hidden="true">@</div>
            <h3>Correo</h3>
            <p>${escapeHtml(emailAddress)}</p>
            <a class="btn btn-secondary" href="mailto:${escapeHtml(emailAddress)}">Enviar correo</a>
          </article>
          <article class="contact-card reveal">
            <div class="contact-icon" aria-hidden="true">📍</div>
            <h3>Ubicación</h3>
            <p>${escapeHtml(locationText)}</p>
            <span class="contact-note">Atención en Cuernavaca, Morelos</span>
          </article>
        </div>
      </section>
    </main>

    <a
      class="whatsapp-fab"
      href="${createWhatsAppLink(CONTACT_MESSAGE)}"
      target="_blank"
      rel="noreferrer"
      aria-label="Cotizar por WhatsApp"
    >
      <span class="whatsapp-fab-icon" aria-hidden="true">
        <img src="${whatsappIconUrl}" alt="" />
      </span>
      <span class="whatsapp-fab-text">Cotizar por WhatsApp</span>
    </a>

    <footer class="site-footer">
      <div class="container footer-grid">
        <div class="footer-brand">
          <img class="footer-logo" src="${logoUrl}" alt="${escapeHtml(businessName)}" />
          <div>
            <strong>${escapeHtml(businessName)}</strong>
            <p>${escapeHtml(locationText)}</p>
          </div>
        </div>
        <div class="footer-links" aria-label="Navegación del pie">
          <a href="#servicios">Servicios</a>
          <a href="#proyectos">Proyectos</a>
          <a href="#nosotros">Nosotros</a>
          <a href="#contacto">Contacto</a>
        </div>
        <div class="footer-contact">
          <a href="tel:+${phoneInternational}">${escapeHtml(phoneDisplay)}</a>
          <a href="${createWhatsAppLink(CONTACT_MESSAGE)}" target="_blank" rel="noreferrer">WhatsApp</a>
          <a href="mailto:${escapeHtml(emailAddress)}">${escapeHtml(emailAddress)}</a>
        </div>
      </div>
      <div class="container footer-bottom">
        <p>© <span data-year></span> ${escapeHtml(businessName)}. Todos los derechos reservados.</p>
      </div>
    </footer>

    <div class="lightbox" hidden aria-hidden="true" role="dialog" aria-modal="true" aria-labelledby="lightbox-title">
      <div class="lightbox-backdrop" data-lightbox-close></div>
      <div class="lightbox-panel" tabindex="-1">
        <div class="lightbox-toolbar">
          <div class="lightbox-meta">
            <span class="lightbox-category" id="lightbox-title"></span>
            <span class="lightbox-counter" data-lightbox-counter></span>
          </div>
          <div class="lightbox-actions">
            <a class="btn btn-secondary lightbox-whatsapp" data-lightbox-whatsapp href="${createWhatsAppLink(CONTACT_MESSAGE)}" target="_blank" rel="noreferrer">
              WhatsApp
            </a>
            <button class="icon-button" type="button" data-lightbox-close aria-label="Cerrar visor">×</button>
          </div>
        </div>
        <div class="lightbox-stage">
          <button class="lightbox-nav lightbox-prev" type="button" data-lightbox-prev aria-label="Imagen anterior">‹</button>
          <figure class="lightbox-figure">
            <img data-lightbox-image alt="" />
            <figcaption data-lightbox-caption></figcaption>
          </figure>
          <button class="lightbox-nav lightbox-next" type="button" data-lightbox-next aria-label="Imagen siguiente">›</button>
        </div>
        <div class="lightbox-footer">
          <a class="btn btn-primary" data-lightbox-similar href="${createWhatsAppLink(CONTACT_MESSAGE)}" target="_blank" rel="noreferrer">
            Quiero un trabajo similar
          </a>
        </div>
      </div>
    </div>
  `;

  setupSeo();
  wireInteractions();
  renderFilters();
  await Promise.all([renderServices(), renderPortfolio()]);
  setYear();
  observeReveals();
  document.body.classList.add('is-loaded');
}

function setYear() {
  const year = new Date().getFullYear();
  document.querySelectorAll('[data-year]').forEach((node) => {
    node.textContent = year;
  });
}

function setupSeo() {
  const canonical = document.querySelector('#canonical-link');
  const ogTitle = document.querySelector('meta[property="og:title"]');
  const ogDescription = document.querySelector('meta[property="og:description"]');
  const ogImage = document.querySelector('#og-image');
  const ogUrl = document.querySelector('#og-url');
  const twitterTitle = document.querySelector('meta[name="twitter:title"]');
  const twitterDescription = document.querySelector('meta[name="twitter:description"]');
  const twitterImage = document.querySelector('#twitter-image');
  const descriptionMeta = document.querySelector('meta[name="description"]');
  const faviconLink = document.querySelector('#site-favicon');
  const structuredDataNode = document.querySelector('#structured-data');

  if (canonical) canonical.href = siteUrl;
  if (ogTitle) ogTitle.content = siteTitle;
  if (ogDescription) ogDescription.content = siteDescription;
  if (ogImage) ogImage.content = logoUrl;
  if (ogUrl) ogUrl.content = siteUrl;
  if (twitterTitle) twitterTitle.content = siteTitle;
  if (twitterDescription) twitterDescription.content = siteDescription;
  if (twitterImage) twitterImage.content = logoUrl;
  if (descriptionMeta) descriptionMeta.content = siteDescription;
  if (faviconLink) faviconLink.href = new URL('favicon.ico', siteUrl).href;
  if (structuredDataNode) structuredDataNode.textContent = JSON.stringify(structuredData);
  document.title = siteTitle;
}

async function getImageSize(src) {
  return await new Promise((resolve) => {
    const image = new Image();
    image.onload = () => {
      const ratio =
        image.naturalWidth && image.naturalHeight ? image.naturalWidth / image.naturalHeight : 1;
      resolve({ width: image.naturalWidth, height: image.naturalHeight, ratio });
    };
    image.onerror = () => resolve({ width: 1, height: 1, ratio: 1 });
    image.src = src;
  });
}

async function renderServices() {
  const servicesGrid = document.querySelector('[data-services-grid]');
  if (!servicesGrid) return;

  const categoryMap = new Map();
  projectItems.forEach((item) => {
    if (!categoryMap.has(item.categorySlug)) {
      categoryMap.set(item.categorySlug, item);
    }
  });

  const cards = await Promise.all(
    categoryItems.map(async (categorySlug) => {
      const imageItem = categoryMap.get(categorySlug);
      const categoryName = slugToTitle(categorySlug);
      const ratio = imageItem ? (await getImageSize(imageItem.src)).ratio : 1.18;
      const preview = imageItem
        ? `<img src="${imageItem.src}" alt="${escapeHtml(imageItem.alt)}" loading="lazy" />`
        : `<div class="service-fallback" aria-hidden="true">${escapeHtml(categoryName)}</div>`;

      return `
        <article class="service-card reveal" style="--card-ratio:${ratio}">
          <button type="button" class="service-card-inner" data-service-filter="${escapeHtml(categorySlug)}">
            <div class="service-media">
              ${preview}
              <span class="service-overlay">${escapeHtml(categoryName)}</span>
            </div>
            <div class="service-meta">
              <h3>${escapeHtml(categoryName)}</h3>
              <span>Ver proyectos</span>
            </div>
          </button>
        </article>
      `;
    })
  );

  servicesGrid.innerHTML = cards.join('');
  observeReveals(servicesGrid);
}

function renderFilters() {
  const filtersNode = document.querySelector('[data-filters]');
  if (!filtersNode) return;

  const filters = ['all', ...categoryItems];
  filtersNode.innerHTML = filters
    .map((filter) => {
      const label = filter === 'all' ? 'Todos' : slugToTitle(filter);
      const active = filter === state.filter ? 'is-active' : '';
      return `
        <button
          type="button"
          class="filter-chip ${active}"
          data-filter="${escapeHtml(filter)}"
          role="tab"
          aria-selected="${filter === state.filter ? 'true' : 'false'}"
        >
          ${escapeHtml(label)}
        </button>
      `;
    })
    .join('');
}

async function renderPortfolio() {
  const grid = document.querySelector('[data-portfolio-grid]');
  if (!grid) return;

  if (!projectItems.length) {
    grid.innerHTML = `
      <div class="empty-state reveal">
        <h3>No hay imágenes todavía</h3>
        <p>Agrega fotografías dentro de <code>src/assets/proyectos/</code> para ver la galería y los filtros automáticos.</p>
      </div>
    `;
    observeReveals(grid);
    return;
  }

  const sizedItems = await Promise.all(
    projectItems.map(async (item, index) => {
      const size = await getImageSize(item.src);
      return { ...item, index, ratio: size.ratio };
    })
  );

  state.allLightboxItems = sizedItems;
  state.lightboxItems = sizedItems;

  grid.innerHTML = sizedItems
    .map(
      (item) => `
        <article class="portfolio-card reveal" data-category="${escapeHtml(item.categorySlug)}" style="--card-ratio:${item.ratio}">
          <button type="button" class="portfolio-button" data-project-index="${item.index}">
            <img src="${item.src}" alt="${escapeHtml(item.alt)}" loading="lazy" />
            <div class="portfolio-overlay">
              <span>${escapeHtml(item.category)}</span>
              <strong>Ver proyecto</strong>
            </div>
          </button>
        </article>
      `
    )
    .join('');

  applyFilter(state.filter);
  observeReveals(grid);
}

function applyFilter(filter) {
  state.filter = filter;

  document.querySelectorAll('[data-filter]').forEach((button) => {
    const active = button.getAttribute('data-filter') === filter;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-selected', String(active));
  });

  document.querySelectorAll('[data-category]').forEach((card) => {
    const match = filter === 'all' || card.getAttribute('data-category') === filter;
    card.classList.toggle('is-hidden', !match);
  });
}

function openLightbox(index) {
  const lightbox = document.querySelector('.lightbox');
  if (!lightbox || !state.lightboxItems.length) return;

  state.lastFocus = document.activeElement;
  state.lightboxIndex = index;
  lightbox.hidden = false;
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.classList.add('no-scroll');
  updateLightbox();

  lightbox.querySelector('.lightbox-panel')?.focus();
}

function closeLightbox() {
  const lightbox = document.querySelector('.lightbox');
  if (!lightbox) return;

  lightbox.hidden = true;
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('no-scroll');

  if (state.lastFocus instanceof HTMLElement) {
    state.lastFocus.focus();
  }
}

function updateLightbox() {
  const lightbox = document.querySelector('.lightbox');
  if (!lightbox || !state.lightboxItems.length) return;

  const item = state.lightboxItems[state.lightboxIndex];
  if (!item) return;

  const image = lightbox.querySelector('[data-lightbox-image]');
  const caption = lightbox.querySelector('[data-lightbox-caption]');
  const counter = lightbox.querySelector('[data-lightbox-counter]');
  const categoryNode = lightbox.querySelector('.lightbox-category');
  const similar = lightbox.querySelector('[data-lightbox-similar]');
  const whatsapp = lightbox.querySelector('[data-lightbox-whatsapp]');

  if (image) {
    image.src = item.src;
    image.alt = item.alt;
  }

  if (caption) caption.textContent = item.category;
  if (counter) counter.textContent = `${state.lightboxIndex + 1} / ${state.lightboxItems.length}`;
  if (categoryNode) categoryNode.textContent = item.category;

  const message = `Hola, vi uno de sus trabajos de ${item.category} en su sitio web y me gustaría solicitar una cotización para algo similar.`;
  const waLink = createWhatsAppLink(message);
  if (similar) similar.href = waLink;
  if (whatsapp) whatsapp.href = waLink;
}

function nextLightboxItem() {
  if (!state.lightboxItems.length) return;
  state.lightboxIndex = (state.lightboxIndex + 1) % state.lightboxItems.length;
  updateLightbox();
}

function previousLightboxItem() {
  if (!state.lightboxItems.length) return;
  state.lightboxIndex = (state.lightboxIndex - 1 + state.lightboxItems.length) % state.lightboxItems.length;
  updateLightbox();
}

function wireInteractions() {
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const backdrop = document.querySelector('[data-menu-backdrop]');
  const closeMenuButtons = document.querySelectorAll('[data-close-menu]');
  const menuLinks = document.querySelectorAll('[data-menu-link]');
  const filtersNode = document.querySelector('[data-filters]');
  const servicesGrid = document.querySelector('[data-services-grid]');
  const portfolioGrid = document.querySelector('[data-portfolio-grid]');
  const lightbox = document.querySelector('.lightbox');
  const lightboxCloseButtons = document.querySelectorAll('[data-lightbox-close]');
  const lightboxPrev = document.querySelector('[data-lightbox-prev]');
  const lightboxNext = document.querySelector('[data-lightbox-next]');
  const lightboxPanel = document.querySelector('.lightbox-panel');

  const openMenu = () => {
    state.menuOpen = true;
    mobileMenu?.classList.add('is-open');
    mobileMenu?.setAttribute('aria-hidden', 'false');
    backdrop?.removeAttribute('hidden');
    menuToggle?.setAttribute('aria-expanded', 'true');
    document.body.classList.add('no-scroll');
  };

  const closeMenu = () => {
    state.menuOpen = false;
    mobileMenu?.classList.remove('is-open');
    mobileMenu?.setAttribute('aria-hidden', 'true');
    backdrop?.setAttribute('hidden', '');
    menuToggle?.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
  };

  menuToggle?.addEventListener('click', () => {
    if (state.menuOpen) closeMenu();
    else openMenu();
  });

  closeMenuButtons.forEach((button) => button.addEventListener('click', closeMenu));
  backdrop?.addEventListener('click', closeMenu);
  menuLinks.forEach((link) =>
    link.addEventListener('click', () => {
      closeMenu();
    })
  );

  filtersNode?.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    const filter = target.getAttribute('data-filter');
    if (!filter) return;

    applyFilter(filter);
  });

  servicesGrid?.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    const button = target.closest('[data-service-filter]');
    if (!button) return;

    const category = button.getAttribute('data-service-filter');
    if (!category) return;

    applyFilter(category);
    document.querySelector('#proyectos')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  portfolioGrid?.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    const button = target.closest('[data-project-index]');
    if (!button) return;

    const index = Number(button.getAttribute('data-project-index'));
    if (!Number.isFinite(index)) return;

    const allItems = state.allLightboxItems;
    const clickedItem = allItems[index];
    if (!clickedItem) return;

    const visibleItems =
      state.filter === 'all'
        ? allItems
        : allItems.filter((item) => item.categorySlug === state.filter);
    const filteredIndex = visibleItems.findIndex((entry) => entry.path === clickedItem.path);
    state.lightboxItems = visibleItems;
    openLightbox(filteredIndex >= 0 ? filteredIndex : 0);
  });

  lightboxCloseButtons.forEach((button) => button.addEventListener('click', closeLightbox));
  lightboxPrev?.addEventListener('click', previousLightboxItem);
  lightboxNext?.addEventListener('click', nextLightboxItem);

  lightbox?.addEventListener('click', (event) => {
    if (event.target instanceof HTMLElement && event.target.matches('[data-lightbox-close]')) {
      closeLightbox();
    }
  });

  window.addEventListener('keydown', (event) => {
    if (mobileMenu?.classList.contains('is-open') && event.key === 'Escape') {
      closeMenu();
      return;
    }

    if (lightbox && !lightbox.hidden) {
      if (event.key === 'Escape') {
        closeLightbox();
      } else if (event.key === 'ArrowRight') {
        nextLightboxItem();
      } else if (event.key === 'ArrowLeft') {
        previousLightboxItem();
      }
    }
  });

  document.addEventListener('click', (event) => {
    if (!mobileMenu?.classList.contains('is-open')) return;
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    if (!target.closest('.mobile-menu') && !target.closest('.menu-toggle')) {
      closeMenu();
    }
  });

  setupLightboxGestures(lightboxPanel);
}

function setupLightboxGestures(panel) {
  if (!panel) return;

  let startX = 0;
  let startY = 0;
  let isTracking = false;

  panel.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    startX = event.clientX;
    startY = event.clientY;
    isTracking = true;
  });

  panel.addEventListener('pointerup', (event) => {
    if (!isTracking) return;
    isTracking = false;

    const diffX = event.clientX - startX;
    const diffY = event.clientY - startY;

    if (Math.abs(diffX) > 40 && Math.abs(diffY) < 80) {
      if (diffX < 0) nextLightboxItem();
      else previousLightboxItem();
    }
  });

  panel.addEventListener('pointercancel', () => {
    isTracking = false;
  });
}

function observeReveals(scope = document) {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const nodes = scope.querySelectorAll('.reveal:not(.is-visible)');

  if (reduceMotion) {
    nodes.forEach((node) => node.classList.add('is-visible'));
    return;
  }

  if (!revealObserver) {
    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
  }

  nodes.forEach((node) => revealObserver?.observe(node));
}

async function init() {
  if (!app) return;
  await buildApp();
}

init().catch((error) => {
  console.error('No se pudo inicializar el sitio:', error);
  if (app) {
    app.innerHTML = `
      <main class="section-shell">
        <div class="container">
          <h1>Proyectos De Metal</h1>
          <p>Ocurrió un error al cargar la interfaz.</p>
        </div>
      </main>
    `;
  }
});

document.addEventListener('click', (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;

  const anchor = target.closest('a[href^="#"]');
  if (!anchor) return;

  const href = anchor.getAttribute('href');
  if (!href || href === '#') return;

  const section = document.querySelector(href);
  if (section) {
    event.preventDefault();
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
});
