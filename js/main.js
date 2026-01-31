/* ========================================
   MAIN.JS - Alonso Madroñal Portfolio
   Core functionality and interactions
   ======================================== */

// ----------------------------------------
// CONFIGURATION
// ----------------------------------------
const CONFIG = {
  typewriterSpeed: 60,
  typewriterDeleteSpeed: 30,
  typewriterPause: 2500,

  // Terminal phrases - EDIT THESE TO CUSTOMIZE
  // Format: { trigger: 'element-id or default', phrases: ['phrase1', 'phrase2'] }
  terminalPhrases: {
    default: [
      "Building intelligent systems...",
      "Exploring NLP & LLMs...",
      "Processing language data...",
      "Training models on multilingual corpora..."
    ],
    // Project-specific phrases (triggered on hover)
    'mind-industry': [
      "git checkout mind-industry",
      "Detecting multilingual inconsistencies...",
      "Polylingual topic modeling active..."
    ],
    'pic-utils': [
      "git checkout pic-utils",
      "Generating artistic textures...",
      "Applying glitch effects..."
    ],
    'tfg-llms': [
      "git checkout tfg-llms",
      "Analyzing LLM architectures...",
      "Running benchmark tests..."
    ],
    'multi-download': [
      "git checkout multi-download",
      "Initializing batch download...",
      "Progress: [████████░░] 80%"
    ],
    'lagrange-squares': [
      "git checkout lagrange-squares",
      "Computing polynomial interpolation...",
      "Fitting least squares..."
    ]
  },

  storageKeys: {
    theme: 'portfolio-theme',
    mode: 'portfolio-mode',
    lang: 'portfolio-lang'
  }
};

// ----------------------------------------
// CONTENT DATA (for language switching)
// ----------------------------------------
let CONTENT = {};

async function loadContent() {
  try {
    const response = await fetch('data/content.json');
    CONTENT = await response.json();
    return true;
  } catch (error) {
    console.error('Error loading content:', error);
    return false;
  }
}

// ----------------------------------------
// DOM ELEMENTS
// ----------------------------------------
const DOM = {
  html: document.documentElement,
  body: document.body,
  nav: document.getElementById('nav'),
  navMenu: document.getElementById('navMenu'),
  mobileToggle: document.getElementById('mobileToggle'),
  themeToggle: document.getElementById('themeToggle'),
  modeToggle: document.getElementById('modeToggle'),
  langToggle: document.getElementById('langToggle'),
  terminalBg: document.getElementById('terminalBg'),
  terminalText: document.getElementById('terminalText'),
  projectFilter: document.getElementById('projectFilter'),
  projectsTimeline: document.getElementById('projectsTimeline'),
  galleryLink: document.getElementById('galleryLink')
};

// ----------------------------------------
// STATE
// ----------------------------------------
const state = {
  currentTheme: 'light',
  currentMode: 'professional',
  currentLang: 'en',
  currentPhraseSet: 'default',
  currentPhraseIndex: 0,
  typewriterTimeout: null,
  isTyping: false
};

// ----------------------------------------
// THEME TOGGLE
// ----------------------------------------
function initTheme() {
  const savedTheme = localStorage.getItem(CONFIG.storageKeys.theme);
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  // Set initial theme
  state.currentTheme = savedTheme || (mediaQuery.matches ? 'dark' : 'light');
  applyTheme(state.currentTheme);

  // Sync toggle state
  if (DOM.themeToggle) {
    DOM.themeToggle.checked = state.currentTheme === 'dark';
    DOM.themeToggle.addEventListener('change', toggleTheme);
  }

  // Listen for system theme changes
  mediaQuery.addEventListener('change', (e) => {
    // Only auto-switch if user hasn't manually set a preference
    if (!localStorage.getItem(CONFIG.storageKeys.theme)) {
      state.currentTheme = e.matches ? 'dark' : 'light';
      applyTheme(state.currentTheme);
      if (DOM.themeToggle) DOM.themeToggle.checked = e.matches;
    }
  });
}

function toggleTheme() {
  state.currentTheme = state.currentTheme === 'light' ? 'dark' : 'light';
  applyTheme(state.currentTheme);
  localStorage.setItem(CONFIG.storageKeys.theme, state.currentTheme);
}

function applyTheme(theme) {
  DOM.html.setAttribute('data-theme', theme);
}

// ----------------------------------------
// ARTISTIC MODE TOGGLE
// ----------------------------------------
function initMode() {
  const savedMode = localStorage.getItem(CONFIG.storageKeys.mode);
  state.currentMode = savedMode || 'professional';
  applyMode(state.currentMode);

  if (DOM.modeToggle) {
    DOM.modeToggle.checked = state.currentMode === 'artistic';
    DOM.modeToggle.addEventListener('change', toggleMode);
  }
}

function toggleMode() {
  state.currentMode = state.currentMode === 'professional' ? 'artistic' : 'professional';
  applyMode(state.currentMode);
  localStorage.setItem(CONFIG.storageKeys.mode, state.currentMode);
}

function applyMode(mode) {
  DOM.html.setAttribute('data-mode', mode);

  // Show/hide gallery link in artistic mode
  if (DOM.galleryLink) {
    DOM.galleryLink.style.display = mode === 'artistic' ? 'block' : 'none';
  }
}

// ----------------------------------------
// LANGUAGE TOGGLE
// ----------------------------------------
async function initLanguage() {
  const savedLang = localStorage.getItem(CONFIG.storageKeys.lang);
  const browserLang = navigator.language.startsWith('es') ? 'es' : 'en';

  state.currentLang = savedLang || browserLang;

  const success = await loadContent();
  if (success) {
    applyLanguage(state.currentLang);
  }

  if (DOM.langToggle) {
    DOM.langToggle.addEventListener('click', toggleLanguage);
  }
}

function toggleLanguage() {
  state.currentLang = state.currentLang === 'en' ? 'es' : 'en';
  applyLanguage(state.currentLang);
  localStorage.setItem(CONFIG.storageKeys.lang, state.currentLang);
}

function applyLanguage(lang) {
  DOM.html.setAttribute('lang', lang);

  if (DOM.langToggle) {
    DOM.langToggle.textContent = lang.toUpperCase();
  }

  const content = CONTENT[lang];
  if (!content) return;

  // Update navigation
  const navLinks = document.querySelectorAll('.nav__link');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === '#projects') link.textContent = content.nav.projects;
    if (href === '#about') link.textContent = content.nav.about;
    if (href === '#contact') link.textContent = content.nav.contact;
  });

  // Update hero section
  const heroGreeting = document.querySelector('.hero__greeting');
  const heroTagline = document.querySelector('.hero__tagline');
  const ctaButtons = document.querySelectorAll('.hero__cta .btn');

  if (heroGreeting) heroGreeting.textContent = content.hero.greeting;
  if (heroTagline) heroTagline.textContent = content.hero.tagline;
  if (ctaButtons[0]) ctaButtons[0].textContent = content.hero.cta.projects;
  if (ctaButtons[1]) ctaButtons[1].textContent = content.hero.cta.resume;

  // Update section titles
  const projectsTitle = document.querySelector('#projects .section__title');
  const projectsSubtitle = document.querySelector('#projects .section__subtitle');
  const aboutTitle = document.querySelector('#about .section__title');
  const aboutSubtitle = document.querySelector('#about .section__subtitle');
  const contactTitle = document.querySelector('#contact .section__title');
  const contactSubtitle = document.querySelector('#contact .section__subtitle');
  const contactText = document.querySelector('.contact__text');

  if (projectsTitle) projectsTitle.textContent = content.projects.title;
  if (projectsSubtitle) projectsSubtitle.textContent = content.projects.subtitle;
  if (aboutTitle) aboutTitle.textContent = content.about.title;
  if (aboutSubtitle) aboutSubtitle.textContent = content.about.subtitle;

  // Update about biography
  const aboutBio1 = document.getElementById('aboutBio1');
  const aboutBio2 = document.getElementById('aboutBio2');
  const aboutBio3 = document.getElementById('aboutBio3');
  const aboutArtisticNote = document.getElementById('aboutArtisticNote');
  const aboutSkillsTitle = document.querySelector('#about .about__skills h3');

  if (aboutBio1 && content.about.bio[0]) aboutBio1.innerHTML = content.about.bio[0];
  if (aboutBio2 && content.about.bio[1]) aboutBio2.innerHTML = content.about.bio[1];
  if (aboutBio3 && content.about.bio[2]) aboutBio3.innerHTML = content.about.bio[2];
  if (aboutArtisticNote) aboutArtisticNote.textContent = content.about.artisticNote;
  if (aboutSkillsTitle) aboutSkillsTitle.textContent = content.about.skillsTitle;

  // Update skills list
  const skillsContainer = document.querySelector('#about .skills');
  if (skillsContainer && content.about.skills) {
    skillsContainer.innerHTML = content.about.skills.map(skill => `
      <div class="skill">
        <span class="skill__icon">></span>
        <span>${skill}</span>
      </div>
    `).join('');
  }

  if (contactTitle) contactTitle.textContent = content.contact.title;
  if (contactSubtitle) contactSubtitle.textContent = content.contact.subtitle;
  if (contactText) contactText.textContent = content.contact.text;

  // Update filter buttons
  const filterBtns = document.querySelectorAll('.filter__btn');
  filterBtns.forEach(btn => {
    const filter = btn.dataset.filter;
    if (content.projects.filters[filter]) {
      btn.textContent = content.projects.filters[filter];
    }
  });

  // Update footer
  const footerText = document.querySelector('.footer__text');
  if (footerText && content.footer) {
    footerText.textContent = `${content.footer.builtWith} ${content.footer.by}`;
  }

  // Update gallery button
  const galleryBtn = document.querySelector('#galleryLink .btn');
  if (galleryBtn) galleryBtn.textContent = content.about.galleryBtn;
}

// ----------------------------------------
// TERMINAL TYPEWRITER EFFECT
// ----------------------------------------
function initTerminal() {
  if (!DOM.terminalText) return;
  startTerminalTyping('default');
}

function startTerminalTyping(phraseSet) {
  state.currentPhraseSet = phraseSet;
  state.currentPhraseIndex = 0;
  typeTerminalPhrase();
}

function typeTerminalPhrase() {
  if (state.isTyping) return;

  const phrases = CONFIG.terminalPhrases[state.currentPhraseSet] || CONFIG.terminalPhrases.default;
  const phrase = phrases[state.currentPhraseIndex];

  state.isTyping = true;
  let charIndex = 0;

  DOM.terminalText.textContent = '';

  function typeChar() {
    if (charIndex < phrase.length) {
      DOM.terminalText.textContent += phrase.charAt(charIndex);
      charIndex++;
      state.typewriterTimeout = setTimeout(typeChar, CONFIG.typewriterSpeed);
    } else {
      state.isTyping = false;
      // Pause, then delete and type next
      state.typewriterTimeout = setTimeout(deleteTerminalPhrase, CONFIG.typewriterPause);
    }
  }

  typeChar();
}

function deleteTerminalPhrase() {
  const currentText = DOM.terminalText.textContent;

  if (currentText.length > 0) {
    DOM.terminalText.textContent = currentText.slice(0, -1);
    state.typewriterTimeout = setTimeout(deleteTerminalPhrase, CONFIG.typewriterDeleteSpeed);
  } else {
    // Move to next phrase
    const phrases = CONFIG.terminalPhrases[state.currentPhraseSet] || CONFIG.terminalPhrases.default;
    state.currentPhraseIndex = (state.currentPhraseIndex + 1) % phrases.length;
    state.typewriterTimeout = setTimeout(typeTerminalPhrase, 300);
  }
}

function changeTerminalPhraseSet(newSet) {
  if (newSet === state.currentPhraseSet) return;

  // Clear current typing
  clearTimeout(state.typewriterTimeout);
  state.isTyping = false;

  // Delete current text first, then start new set
  deleteTerminalPhrase();
  state.currentPhraseSet = newSet;
  state.currentPhraseIndex = 0;
}

// ----------------------------------------
// TERMINAL SCROLL FADE & FROSTED GLASS TRANSITION
// Fades out when reaching Contact section
// Gradually increases frosting from Hero → Projects → About
// ----------------------------------------
function initTerminalScrollFade() {
  if (!DOM.terminalBg) return;

  const heroSection = document.querySelector('.hero');
  const aboutSection = document.getElementById('about');
  const contactSection = document.getElementById('contact');
  const projectsSection = document.getElementById('projects');

  if (!contactSection || !aboutSection || !projectsSection || !heroSection) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // === FROSTED GLASS GRADUAL TRANSITION ===
    const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
    const projectsTop = projectsSection.offsetTop;
    const aboutTop = aboutSection.offsetTop;

    // Phase 1: Hero → Early Projects (0% → 30% frosting)
    const phase1Start = heroBottom - window.innerHeight * 0.5;
    const phase1End = projectsTop + window.innerHeight * 0.3;

    // Phase 2: Mid Projects → About (30% → 100% frosting)
    const phase2Start = aboutTop - window.innerHeight * 0.8;
    const phase2End = aboutTop - window.innerHeight * 0.2;

    if (scrollY < phase1Start) {
      // Hero section: no frosting
      projectsSection.style.setProperty('--dynamic-frost-opacity', '0.5');
      projectsSection.style.setProperty('--dynamic-frost-blur', '0px');
    } else if (scrollY >= phase1Start && scrollY < phase1End) {
      // Phase 1: Gradual introduction of frosting
      const progress1 = (scrollY - phase1Start) / (phase1End - phase1Start);
      const opacity = 0.5 + (progress1 * 0.15); // 0.5 → 0.65
      const blur = 0 + (progress1 * 0.5); // 0px → 0.5px
      projectsSection.style.setProperty('--dynamic-frost-opacity', opacity.toFixed(2));
      projectsSection.style.setProperty('--dynamic-frost-blur', `${blur.toFixed(1)}px`);
    } else if (scrollY >= phase1End && scrollY < phase2Start) {
      // Mid Projects: light frosting
      projectsSection.style.setProperty('--dynamic-frost-opacity', '0.65');
      projectsSection.style.setProperty('--dynamic-frost-blur', '0.5px');
    } else if (scrollY >= phase2Start && scrollY < phase2End) {
      // Phase 2: Increase to full frosting
      const progress2 = (scrollY - phase2Start) / (phase2End - phase2Start);
      const opacity = 0.65 + (progress2 * 0.3); // 0.65 → 0.95
      const blur = 0.5 + (progress2 * 11.5); // 0.5px → 12px
      projectsSection.style.setProperty('--dynamic-frost-opacity', opacity.toFixed(2));
      projectsSection.style.setProperty('--dynamic-frost-blur', `${blur.toFixed(1)}px`);
    } else {
      // About section: full frosting
      projectsSection.style.setProperty('--dynamic-frost-opacity', '0.95');
      projectsSection.style.setProperty('--dynamic-frost-blur', '12px');
    }

    // === TERMINAL FADE OUT ===
    const contactTop = contactSection.offsetTop;
    const fadeStart = contactTop - window.innerHeight * 0.5;
    const fadeEnd = contactTop - window.innerHeight * 0.2;

    if (scrollY < fadeStart) {
      DOM.terminalBg.classList.remove('terminal-bg--faded');
      DOM.terminalBg.style.opacity = '';
    } else if (scrollY > fadeEnd) {
      DOM.terminalBg.classList.add('terminal-bg--faded');
    } else {
      // Calculate opacity during fade
      const progress = (scrollY - fadeStart) / (fadeEnd - fadeStart);
      const baseOpacity = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--terminal-opacity') || 0.9);
      DOM.terminalBg.style.opacity = (1 - progress) * baseOpacity;
    }
  });
}

// ----------------------------------------
// MOBILE NAVIGATION
// ----------------------------------------
function initMobileNav() {
  if (!DOM.mobileToggle || !DOM.navMenu) return;

  DOM.mobileToggle.addEventListener('click', () => {
    DOM.navMenu.classList.toggle('nav__menu--open');

    // Update icon
    const isOpen = DOM.navMenu.classList.contains('nav__menu--open');
    DOM.mobileToggle.innerHTML = isOpen
      ? '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>'
      : '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>';
  });

  // Close menu when clicking a link
  DOM.navMenu.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      DOM.navMenu.classList.remove('nav__menu--open');
    });
  });
}

// ----------------------------------------
// SMOOTH SCROLL & ACTIVE LINKS
// ----------------------------------------
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Update active link on scroll
  window.addEventListener('scroll', updateActiveLink);
}

function updateActiveLink() {
  const sections = document.querySelectorAll('section[id]');
  const scrollPos = window.scrollY + 100;

  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav__link[href="#${id}"]`);

    if (scrollPos >= top && scrollPos < top + height) {
      document.querySelectorAll('.nav__link').forEach(l => l.classList.remove('nav__link--active'));
      if (link) link.classList.add('nav__link--active');
    }
  });
}

// ----------------------------------------
// SCROLL ANIMATIONS
// ----------------------------------------
function initScrollAnimations() {
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in').forEach(el => {
    observer.observe(el);
  });
}

// ----------------------------------------
// PROJECT FILTERING
// ----------------------------------------
function initProjectFilter() {
  if (!DOM.projectFilter) return;

  const filterButtons = DOM.projectFilter.querySelectorAll('.filter__btn');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterButtons.forEach(b => b.classList.remove('filter__btn--active'));
      btn.classList.add('filter__btn--active');

      // Filter projects
      const filter = btn.dataset.filter;
      filterProjects(filter);
    });
  });
}

function filterProjects(category) {
  const projects = DOM.projectsTimeline?.querySelectorAll('.git-tree__item');

  projects?.forEach(project => {
    const projectCategory = project.dataset.category;

    if (category === 'all' || projectCategory === category) {
      project.style.display = 'block';
      setTimeout(() => {
        project.style.opacity = '1';
        project.style.transform = 'translateX(0)';
      }, 50);
    } else {
      project.style.opacity = '0';
      project.style.transform = 'translateX(-20px)';
      setTimeout(() => {
        project.style.display = 'none';
      }, 300);
    }
  });
}

// ----------------------------------------
// LOAD PROJECTS
// ----------------------------------------
async function loadProjects() {
  if (!DOM.projectsTimeline) return;

  try {
    const response = await fetch('data/projects.json');
    const data = await response.json();

    renderProjects(data.projects);
    setupProjectHoverEvents();
  } catch (error) {
    console.error('Error loading projects:', error);
  }
}

function renderProjects(projects) {
  if (!DOM.projectsTimeline) return;

  const lineHtml = '<div class="git-tree__line"></div>';

  const projectsHtml = projects.map(project => `
    <div class="git-tree__item ${project.featured ? 'git-tree__item--featured' : ''}" 
         data-category="${project.category}" 
         data-project-id="${project.id}"
         style="transition: opacity 0.3s, transform 0.3s;">
      <div class="git-tree__node"></div>
      <div class="git-tree__date">${project.date}</div>
      <div class="git-tree__commit font-mono">${project.commit}</div>
      <div class="project-card ${project.featured ? 'project-card--featured' : ''} hover-lift">
        <div class="project-card__header">
          <h3 class="project-card__title">${project.name}</h3>
          <div class="project-card__links">
            <a href="${project.github}" target="_blank" rel="noopener noreferrer" class="project-card__link" title="View on GitHub">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
          </div>
        </div>
        <p class="project-card__description">${project.description}</p>
        <div class="project-card__tags">
          ${project.technologies.map(tech => `<span class="project-card__tag">${tech}</span>`).join('')}
        </div>
      </div>
    </div>
  `).join('');

  DOM.projectsTimeline.innerHTML = lineHtml + projectsHtml;
}

function setupProjectHoverEvents() {
  const projectItems = document.querySelectorAll('.git-tree__item');

  projectItems.forEach(item => {
    const projectId = item.dataset.projectId;

    item.addEventListener('mouseenter', () => {
      if (CONFIG.terminalPhrases[projectId]) {
        changeTerminalPhraseSet(projectId);
      }
    });

    item.addEventListener('mouseleave', () => {
      // Return to default after a delay
      setTimeout(() => {
        if (!document.querySelector('.git-tree__item:hover')) {
          changeTerminalPhraseSet('default');
        }
      }, 500);
    });
  });
}

// ----------------------------------------
// NAV SCROLL EFFECT
// ----------------------------------------
function initNavScroll() {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      DOM.nav?.classList.add('nav--scrolled');
    } else {
      DOM.nav?.classList.remove('nav--scrolled');
    }
  });
}

// ----------------------------------------
// INITIALIZATION
// ----------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMode();
  initLanguage();
  initTerminal();
  initTerminalScrollFade();
  initMobileNav();
  initSmoothScroll();
  initScrollAnimations();
  initProjectFilter();
  initNavScroll();
  loadProjects();
});

// ----------------------------------------
// KEYBOARD SHORTCUTS (Easter Egg)
// ----------------------------------------
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
  konamiCode.push(e.key);
  konamiCode = konamiCode.slice(-10);

  if (konamiCode.join(',') === konamiSequence.join(',')) {
    state.currentMode = 'artistic';
    applyMode('artistic');
    if (DOM.modeToggle) DOM.modeToggle.checked = true;
    localStorage.setItem(CONFIG.storageKeys.mode, 'artistic');
  }
});
