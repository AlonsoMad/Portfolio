/* ========================================
   MAIN.JS - Alonso Madroñal Portfolio
   Core functionality and interactions
   ======================================== */

// ----------------------------------------
// CONFIGURATION
// ----------------------------------------
const CONFIG = {
  typewriterSpeed: 80,
  typewriterPause: 2000,
  phrases: [
    "Building intelligent systems",
    "Exploring NLP & LLMs",
    "Creating digital art",
    "Experimenting with code",
    "Detecting multilingual inconsistencies",
    "Processing images artistically"
  ],
  storageKeys: {
    theme: 'portfolio-theme',
    mode: 'portfolio-mode',
    lang: 'portfolio-lang'
  }
};

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
  typewriter: document.getElementById('typewriter'),
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
  currentPhraseIndex: 0,
  typewriterTimeout: null
};

// ----------------------------------------
// THEME TOGGLE
// ----------------------------------------
function initTheme() {
  const savedTheme = localStorage.getItem(CONFIG.storageKeys.theme);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  state.currentTheme = savedTheme || (prefersDark ? 'dark' : 'light');
  applyTheme(state.currentTheme);
  
  if (DOM.themeToggle) {
    DOM.themeToggle.checked = state.currentTheme === 'dark';
    DOM.themeToggle.addEventListener('change', toggleTheme);
  }
}

function toggleTheme() {
  state.currentTheme = state.currentTheme === 'light' ? 'dark' : 'light';
  applyTheme(state.currentTheme);
  localStorage.setItem(CONFIG.storageKeys.theme, state.currentTheme);
}

function applyTheme(theme) {
  DOM.html.setAttribute('data-theme', theme);
  
  // Update toggle icon
  const icon = DOM.themeToggle?.parentElement.querySelector('.toggle__icon');
  if (icon) {
    icon.textContent = theme === 'dark' ? '☀️' : '🌙';
  }
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
  
  // Update toggle icon
  const icon = DOM.modeToggle?.parentElement.querySelector('.toggle__icon');
  if (icon) {
    icon.textContent = mode === 'artistic' ? '🎨' : '✨';
  }
}

// ----------------------------------------
// LANGUAGE TOGGLE
// ----------------------------------------
function initLanguage() {
  const savedLang = localStorage.getItem(CONFIG.storageKeys.lang);
  const browserLang = navigator.language.startsWith('es') ? 'es' : 'en';
  
  state.currentLang = savedLang || browserLang;
  applyLanguage(state.currentLang);
  
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
  
  // In a full implementation, this would update all text content
  // For now, we'll keep the English content as default
}

// ----------------------------------------
// TYPEWRITER EFFECT
// ----------------------------------------
function initTypewriter() {
  if (!DOM.typewriter) return;
  
  typePhrase();
}

function typePhrase() {
  const phrase = CONFIG.phrases[state.currentPhraseIndex];
  let charIndex = 0;
  
  DOM.typewriter.textContent = '';
  
  function typeChar() {
    if (charIndex < phrase.length) {
      DOM.typewriter.textContent += phrase.charAt(charIndex);
      charIndex++;
      state.typewriterTimeout = setTimeout(typeChar, CONFIG.typewriterSpeed);
    } else {
      // Pause, then delete
      state.typewriterTimeout = setTimeout(deletePhrase, CONFIG.typewriterPause);
    }
  }
  
  typeChar();
}

function deletePhrase() {
  const currentText = DOM.typewriter.textContent;
  
  if (currentText.length > 0) {
    DOM.typewriter.textContent = currentText.slice(0, -1);
    state.typewriterTimeout = setTimeout(deletePhrase, CONFIG.typewriterSpeed / 2);
  } else {
    // Move to next phrase
    state.currentPhraseIndex = (state.currentPhraseIndex + 1) % CONFIG.phrases.length;
    state.typewriterTimeout = setTimeout(typePhrase, 500);
  }
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
    anchor.addEventListener('click', function(e) {
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
      project.style.opacity = '1';
    } else {
      project.style.opacity = '0';
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
  } catch (error) {
    console.error('Error loading projects:', error);
    // Fallback: render static content
    renderProjectsFallback();
  }
}

function renderProjects(projects) {
  if (!DOM.projectsTimeline) return;
  
  // Keep the line element
  const lineHtml = '<div class="git-tree__line"></div>';
  
  const projectsHtml = projects.map(project => `
    <div class="git-tree__item ${project.featured ? 'git-tree__item--featured' : ''}" data-category="${project.category}">
      <div class="git-tree__node"></div>
      <div class="git-tree__date">${project.date}</div>
      <div class="git-tree__commit font-mono">${project.commit}</div>
      <div class="project-card ${project.featured ? 'project-card--featured' : ''} hover-lift">
        <div class="project-card__header">
          <span class="project-card__icon">${getCategoryIcon(project.category)}</span>
          <div class="project-card__links">
            <a href="${project.github}" target="_blank" rel="noopener noreferrer" class="project-card__link" title="View on GitHub">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
          </div>
        </div>
        <h3 class="project-card__title">${project.name}</h3>
        <p class="project-card__description">${project.description}</p>
        <div class="project-card__tags">
          ${project.technologies.map(tech => `<span class="project-card__tag">${tech}</span>`).join('')}
        </div>
      </div>
    </div>
  `).join('');
  
  DOM.projectsTimeline.innerHTML = lineHtml + projectsHtml;
}

function getCategoryIcon(category) {
  const icons = {
    nlp: '🧠',
    creative: '🎨',
    research: '📚',
    utilities: '🔧'
  };
  return icons[category] || '📦';
}

function renderProjectsFallback() {
  // Fallback content if JSON fails to load
  // Projects are already in the HTML structure
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
  initTypewriter();
  initMobileNav();
  initSmoothScroll();
  initScrollAnimations();
  initProjectFilter();
  initNavScroll();
  loadProjects();
  
  console.log('🚀 Portfolio initialized');
  console.log('💡 Tip: Try clicking the ✨ toggle for a surprise!');
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
    // Activate artistic mode
    state.currentMode = 'artistic';
    applyMode('artistic');
    if (DOM.modeToggle) DOM.modeToggle.checked = true;
    localStorage.setItem(CONFIG.storageKeys.mode, 'artistic');
    
    console.log('🎉 Konami code activated! Welcome to artistic mode.');
  }
});
