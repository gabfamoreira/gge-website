// "All" side menu — built here once so every page gets the same sidebar.
const SIDEBAR_SECTIONS = [
  {
    title: 'Trending',
    links: [
      { label: 'New arrivals', href: 'index.html#new-arrivals' },
      { label: 'Promotions', href: 'promotions.html' }
    ]
  },
  {
    title: 'Shop by category',
    links: [
      { label: 'Accessories', href: 'accessories.html', arrow: true },
      { label: 'Automotive', href: 'automotive.html', arrow: true },
      { label: 'Electronics', href: 'electronics.html', arrow: true },
      { label: 'Computing', href: 'computing.html', arrow: true },
      { label: 'Security', href: 'category.html', arrow: true }
    ]
  },
  {
    title: 'Help & settings',
    links: [
      { label: 'Your account', href: 'account.html' },
      { label: 'Your basket', href: 'cart.html' },
      { label: 'About us', href: 'about.html' },
      { label: 'Contact', href: 'contact.html' },
      { label: 'Returns & exchanges', href: 'contact.html#returns' }
    ]
  }
];

function sidebarGreeting() {
  const user = typeof currentUser === 'function' ? currentUser() : null;
  return user ? `Hello, ${user.name.split(' ')[0]}` : 'Hello, sign in';
}

function buildSidebar() {
  const navList = document.querySelector('.main-nav ul');
  if (!navList) return;

  const openItem = document.createElement('li');
  openItem.innerHTML = '<button type="button" class="sidebar-open" aria-controls="sidebar" aria-expanded="false">All</button>';
  navList.prepend(openItem);

  const sectionsHTML = SIDEBAR_SECTIONS.map((section) => `
    <section class="sidebar-section">
      <h2>${section.title}</h2>
      <ul>
        ${section.links.map((link) => `<li><a href="${link.href}"${link.arrow ? ' class="has-arrow"' : ''}>${escapeSidebarText(link.label)}</a></li>`).join('')}
      </ul>
    </section>`).join('');

  document.body.insertAdjacentHTML('beforeend', `
    <div class="sidebar-overlay" hidden></div>
    <aside class="sidebar" id="sidebar" aria-label="All categories" hidden>
      <a class="sidebar-header" href="account.html">${escapeSidebarText(sidebarGreeting())}</a>
      <button type="button" class="sidebar-close" aria-label="Close menu">&times;</button>
      <nav class="sidebar-body">${sectionsHTML}</nav>
    </aside>`);

  const openButton = openItem.querySelector('.sidebar-open');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.querySelector('.sidebar-overlay');
  const closeButton = sidebar.querySelector('.sidebar-close');
  let hideTimer;

  function openSidebar() {
    sidebar.querySelector('.sidebar-header').textContent = sidebarGreeting();
    clearTimeout(hideTimer);
    sidebar.hidden = false;
    overlay.hidden = false;
    sidebar.offsetWidth; // apply the closed position first so the slide-in animates
    document.body.classList.add('sidebar-is-open');
    openButton.setAttribute('aria-expanded', 'true');
    closeButton.focus();
  }

  function closeSidebar() {
    document.body.classList.remove('sidebar-is-open');
    openButton.setAttribute('aria-expanded', 'false');
    hideTimer = setTimeout(() => { sidebar.hidden = true; overlay.hidden = true; }, 250);
    openButton.focus();
  }

  openButton.addEventListener('click', openSidebar);
  closeButton.addEventListener('click', closeSidebar);
  overlay.addEventListener('click', closeSidebar);
  sidebar.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    document.body.classList.remove('sidebar-is-open');
  }));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && document.body.classList.contains('sidebar-is-open')) closeSidebar();
  });
}

function escapeSidebarText(value) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

buildSidebar();
