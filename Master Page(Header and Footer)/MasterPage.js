class GreenEconomyHeader extends HTMLElement {
  connectedCallback() {
    const currentPath = window.location.pathname;
    const isDashboard = currentPath === '/Dashboard/dashboard.html';

    this.innerHTML = `
      <div class="header-outer">
        <header class="header">
          <div class="logo">
            <a href="/index.html" id="logo-link">
              <img src="/Images/GET.png" alt="Logo" />
            </a>
          </div>
          <nav class="nav">
            ${isDashboard ? '<a href="/index.html">Home</a>' : ''}
            ${!isDashboard ? `
              <a href="/LandingPage/About Page/about.html" data-i18n="header.funding">About the green economy</a>
              <a href="/LandingPage/Opportunities/opportunities.html" data-i18n="header.opportunities">Opportunities</a>
              <a href="/LandingPage/IRM-Sector/IRMSector.html" data-i18n="header.find_a_job">IRM Sector</a>
              <a href="/LandingPage/Knowledge-Hub/knowledge-hub.html" data-i18n="header.training">Knowledge HUB</a>
            ` : ''}
            <select class="language-selector" onchange="changeLanguage(this.value)">
              <option value="" disabled selected data-i18n="header.select">Select</option>
              <option value="en">English</option>
              <option value="zu">isiZulu</option>
              <option value="tn">Tswana</option>
            </select>
            <i class="fas fa-search search-icon" id="search-toggle"></i>
            <div class="blue-section"></div>
          </nav>
        </header>
        <section class="search-section" id="search-popup" style="display: none;">
          <div class="search-container">
            <div class="search-header">
              <h3>Enhanced Search</h3>
              <span class="search-close" id="search-close">×</span>
            </div>
            <div class="search-input-wrapper">
              <svg class="search-input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              <input type="text" class="search-input" id="smartSearch" data-i18n="[placeholder]header.search-placeholder" placeholder="Search green funding, businesses, tools...">
            </div>
            <div id="search-results" class="search-results max-h-96 overflow-y-auto"></div>
          </div>
        </section>
      </div>
    `;

    // Add event listener for logo click to handle logout
    const logoLink = this.querySelector('#logo-link');
    if (logoLink) {
      logoLink.addEventListener('click', async (e) => {
        e.preventDefault();
        try {
          const user = firebase.auth().currentUser;
          if (user) {
            console.log('User is logged in, initiating logout...');
            await firebase.auth().signOut();
            window.localStorage.removeItem('emailForSignIn');
            trackInteraction(user.uid, 'logout', 'logo_click');
            console.log('User logged out successfully');
          } else {
            console.log('No user is logged in, redirecting to index...');
          }
          window.location.href = '/index.html';
        } catch (error) {
          console.error('Error during logo click logout:', error);
          window.location.href = '/index.html';
        }
      });
    }

    // Add event listener for search toggle
    const searchToggle = this.querySelector('#search-toggle');
    const searchPopup = this.querySelector('#search-popup');
    const searchClose = this.querySelector('#search-close');
    if (searchToggle && searchPopup && searchClose) {
      searchToggle.addEventListener('click', () => {
        const isHidden = searchPopup.style.display === 'none';
        searchPopup.style.display = isHidden ? 'block' : 'none';
        if (isHidden) {
          searchPopup.classList.add('animate-in');
          searchPopup.classList.remove('animate-out');
        } else {
          searchPopup.classList.add('animate-out');
          searchPopup.classList.remove('animate-in');
          setTimeout(() => {
            searchPopup.style.display = 'none';
          }, 300);
        }
      });

      searchClose.addEventListener('click', () => {
        searchPopup.classList.add('animate-out');
        searchPopup.classList.remove('animate-in');
        setTimeout(() => {
          searchPopup.style.display = 'none';
        }, 300);
      });
    }

    // Setup search functionality with web scraping
    const smartSearch = this.querySelector('#smartSearch');
    const resultsDiv = this.querySelector('#search-results');
    let index;

    // Function to scrape content from a single page
    async function scrapePageContent(url, isCurrentPage = false) {
      try {
        let content;
        if (isCurrentPage) {
          content = document;
        } else {
          const response = await fetch(url);
          if (!response.ok) throw new Error(`Failed to fetch ${url}`);
          const text = await response.text();
          const parser = new DOMParser();
          content = parser.parseFromString(text, 'text/html');
        }

        const mainContent = content.querySelector('main') || content.querySelector('body');
        if (!mainContent) return [];

        const documents = [];
        const elements = mainContent.querySelectorAll('h1, h2, h3, p, div[data-i18n]');
        elements.forEach((element, idx) => {
          const text = element.textContent.trim();
          if (text) {
            documents.push({
              id: `${url.replace(/[^a-zA-Z0-9]/g, '-')}-${idx}`,
              title: element.tagName.toLowerCase().startsWith('h') ? text : `Content ${idx + 1}`,
              body: text,
              url: url + (element.id ? `#${element.id}` : '')
            });
          }
        });
        return documents;
      } catch (error) {
        console.error(`Error scraping ${url}:`, error);
        return [];
      }
    }

    // Build Lunr index from multiple pages
    async function buildIndex() {
      const pages = [
        { url: window.location.pathname, isCurrentPage: true },
        { url: '/LandingPage/IRM-Sector/IRMSector.html', isCurrentPage: false },
        { url: '/LandingPage/Knowledge-Hub/knowledge-hub.html', isCurrentPage: false }
      ];

      const allDocuments = [];
      for (const page of pages) {
        const documents = await scrapePageContent(page.url, page.isCurrentPage);
        allDocuments.push(...documents);
      }

      index = lunr(function () {
        this.ref('id');
        this.field('title', { boost: 10 });
        this.field('body');
        this.metadataWhitelist = ['position'];
        allDocuments.forEach(doc => this.add(doc), this);
      });
    }

    // Perform search
    function performSearch(query) {
      if (!index) return [];
      const enhancedQuery = query.split(' ').map(term => term + '~1').join(' ');
      return index.search(enhancedQuery);
    }

    // Highlight matches
    function highlightText(text, positions) {
      let highlighted = '';
      let lastEnd = 0;
      positions.sort((a, b) => a.start - b.start);
      positions.forEach(pos => {
        const start = pos.start;
        const end = pos.start + pos.length;
        highlighted += text.substring(lastEnd, start) + '<mark>' + text.substring(start, end) + '</mark>';
        lastEnd = end;
      });
      highlighted += text.substring(lastEnd);
      return highlighted;
    }

    // Debounce function
    function debounce(func, delay) {
      let timeout;
      return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
      };
    }

    if (smartSearch && resultsDiv) {
      smartSearch.addEventListener('input', debounce(async (e) => {
        const query = e.target.value.trim();
        resultsDiv.innerHTML = '';
        if (!query) {
          resultsDiv.innerHTML = '<p class="p-4 text-gray-600">Start typing to see suggestions...</p>';
          return;
        }

        if (!index) await buildIndex();
        const results = performSearch(query);
        if (results.length === 0) {
          resultsDiv.innerHTML = '<p class="p-4 text-gray-600">No results found.</p>';
          return;
        }

        const pages = [
          { url: window.location.pathname },
          { url: '/LandingPage/IRM-Sector/IRMSector.html' },
          { url: '/LandingPage/Knowledge-Hub/knowledge-hub.html' }
        ];

        const allDocuments = [];
        for (const page of pages) {
          allDocuments.push(...await scrapePageContent(page.url, page.url === window.location.pathname));
        }

        results.slice(0, 5).forEach(result => {
          const doc = allDocuments.find(d => d.id === result.ref);
          if (!doc) return;

          let snippet = doc.body.substring(0, 150) + (doc.body.length > 150 ? '...' : '');
          const bodyMetadata = result.matchData.metadata;
          if (bodyMetadata && Object.keys(bodyMetadata).length > 0) {
            const positions = [];
            Object.values(bodyMetadata).forEach(meta => {
              if (meta.body && meta.body.position) {
                meta.body.position.forEach(pos => positions.push({ start: pos[0], length: pos[1] }));
              }
            });
            if (positions.length > 0) {
              snippet = highlightText(doc.body.substring(0, 150) + (doc.body.length > 150 ? '...' : ''), positions);
            }
          }

          const div = document.createElement('div');
          div.classList.add('p-4', 'border-b', 'border-gray-200', 'hover:bg-gray-50', 'cursor-pointer');
          div.innerHTML = `
            <a href="${doc.url}" class="text-blue-600 font-semibold block">${doc.title}</a>
            <p class="text-sm text-gray-600">${snippet}</p>
          `;
          div.addEventListener('click', () => {
            window.location.href = doc.url;
            searchPopup.style.display = 'none';
          });
          resultsDiv.appendChild(div);
        });
      }, 300));
    }

    // Build index on load
    buildIndex();
  }
}

class GreenEconomyDashboardHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="header-outer">
        <header class="header">
          <div class="logo">
            <a href="/index.html" id="logo-link">
              <img src="/Images/GET.png" alt="Logo" />
            </a>
          </div>
          <nav class="nav">
            <a href="/index.html">Home</a>
            <select class="language-selector" onchange="changeLanguage(this.value)">
              <option value="" disabled selected data-i18n="header.select">Select</option>
              <option value="en">English</option>
              <option value="zu">isiZulu</option>
              <option value="tn">Tswana</option>
            </select>
            <i class="fas fa-search search-icon" id="search-toggle"></i>
            <div class="blue-section"></div>
          </nav>
        </header>
        <section class="search-section" id="search-popup" style="display: none;">
          <div class="search-container">
            <div class="search-header">
              <h3 data-i18n="header.ai-search-title">Enhanced Search</h3>
              <span class="search-close" id="search-close">×</span>
            </div>
            <div class="search-input-wrapper">
              <svg class="search-input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              <input type="text" class="search-input" id="smartSearch" data-i18n="[placeholder]header.search-placeholder" placeholder="Search green funding, businesses, tools...">
            </div>
            <div id="search-results" class="search-results max-h-96 overflow-y-auto"></div>
          </div>
        </section>
      </div>
    `;

    // Add event listener for logo click to handle logout
    const logoLink = this.querySelector('#logo-link');
    if (logoLink) {
      logoLink.addEventListener('click', async (e) => {
        e.preventDefault();
        try {
          const user = firebase.auth().currentUser;
          if (user) {
            console.log('User is logged in, initiating logout...');
            await firebase.auth().signOut();
            window.localStorage.removeItem('emailForSignIn');
            trackInteraction(user.uid, 'logout', 'logo_click');
            console.log('User logged out successfully');
          } else {
            console.log('No user is logged in, redirecting to index...');
          }
          window.location.href = '/index.html';
        } catch (error) {
          console.error('Error during logo click logout:', error);
          window.location.href = '/index.html';
        }
      });
    }

    // Add event listener for search toggle
    const searchToggle = this.querySelector('#search-toggle');
    const searchPopup = this.querySelector('#search-popup');
    const searchClose = this.querySelector('#search-close');
    if (searchToggle && searchPopup && searchClose) {
      searchToggle.addEventListener('click', () => {
        const isHidden = searchPopup.style.display === 'none';
        searchPopup.style.display = isHidden ? 'block' : 'none';
        if (isHidden) {
          searchPopup.classList.add('animate-in');
          searchPopup.classList.remove('animate-out');
        } else {
          searchPopup.classList.add('animate-out');
          searchPopup.classList.remove('animate-in');
          setTimeout(() => {
            searchPopup.style.display = 'none';
          }, 300);
        }
      });

      searchClose.addEventListener('click', () => {
        searchPopup.classList.add('animate-out');
        searchPopup.classList.remove('animate-in');
        setTimeout(() => {
          searchPopup.style.display = 'none';
        }, 300);
      });
    }

    // Setup search functionality with web scraping
    const smartSearch = this.querySelector('#smartSearch');
    const resultsDiv = this.querySelector('#search-results');
    let index;

    // Function to scrape content from a single page
    async function scrapePageContent(url, isCurrentPage = false) {
      try {
        let content;
        if (isCurrentPage) {
          content = document;
        } else {
          const response = await fetch(url);
          if (!response.ok) throw new Error(`Failed to fetch ${url}`);
          const text = await response.text();
          const parser = new DOMParser();
          content = parser.parseFromString(text, 'text/html');
        }

        const mainContent = content.querySelector('main') || content.querySelector('body');
        if (!mainContent) return [];

        const documents = [];
        const elements = mainContent.querySelectorAll('h1, h2, h3, p, div[data-i18n]');
        elements.forEach((element, idx) => {
          const text = element.textContent.trim();
          if (text) {
            documents.push({
              id: `${url.replace(/[^a-zA-Z0-9]/g, '-')}-${idx}`,
              title: element.tagName.toLowerCase().startsWith('h') ? text : `Content ${idx + 1}`,
              body: text,
              url: url + (element.id ? `#${element.id}` : '')
            });
          }
        });
        return documents;
      } catch (error) {
        console.error(`Error scraping ${url}:`, error);
        return [];
      }
    }

    // Build Lunr index from multiple pages
    async function buildIndex() {
      const pages = [
        { url: window.location.pathname, isCurrentPage: true },
        { url: '/LandingPage/IRM-Sector/IRMSector.html', isCurrentPage: false },
        { url: '/LandingPage/Knowledge-Hub/knowledge-hub.html', isCurrentPage: false }
      ];

      const allDocuments = [];
      for (const page of pages) {
        const documents = await scrapePageContent(page.url, page.isCurrentPage);
        allDocuments.push(...documents);
      }

      index = lunr(function () {
        this.ref('id');
        this.field('title', { boost: 10 });
        this.field('body');
        this.metadataWhitelist = ['position'];
        allDocuments.forEach(doc => this.add(doc), this);
      });
    }

    // Perform search
    function performSearch(query) {
      if (!index) return [];
      const enhancedQuery = query.split(' ').map(term => term + '~1').join(' ');
      return index.search(enhancedQuery);
    }

    // Highlight matches
    function highlightText(text, positions) {
      let highlighted = '';
      let lastEnd = 0;
      positions.sort((a, b) => a.start - b.start);
      positions.forEach(pos => {
        const start = pos.start;
        const end = pos.start + pos.length;
        highlighted += text.substring(lastEnd, start) + '<mark>' + text.substring(start, end) + '</mark>';
        lastEnd = end;
      });
      highlighted += text.substring(lastEnd);
      return highlighted;
    }

    // Debounce function
    function debounce(func, delay) {
      let timeout;
      return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
      };
    }

    if (smartSearch && resultsDiv) {
      smartSearch.addEventListener('input', debounce(async (e) => {
        const query = e.target.value.trim();
        resultsDiv.innerHTML = '';
        if (!query) {
          resultsDiv.innerHTML = '<p class="p-4 text-gray-600">Start typing to see suggestions...</p>';
          return;
        }

        if (!index) await buildIndex();
        const results = performSearch(query);
        if (results.length === 0) {
          resultsDiv.innerHTML = '<p class="p-4 text-gray-600">No results found.</p>';
          return;
        }

        const pages = [
          { url: window.location.pathname },
          { url: '/LandingPage/IRM-Sector/IRMSector.html' },
          { url: '/LandingPage/Knowledge-Hub/knowledge-hub.html' }
        ];

        const allDocuments = [];
        for (const page of pages) {
          allDocuments.push(...await scrapePageContent(page.url, page.url === window.location.pathname));
        }

        results.slice(0, 5).forEach(result => {
          const doc = allDocuments.find(d => d.id === result.ref);
          if (!doc) return;

          let snippet = doc.body.substring(0, 150) + (doc.body.length > 150 ? '...' : '');
          const bodyMetadata = result.matchData.metadata;
          if (bodyMetadata && Object.keys(bodyMetadata).length > 0) {
            const positions = [];
            Object.values(bodyMetadata).forEach(meta => {
              if (meta.body && meta.body.position) {
                meta.body.position.forEach(pos => positions.push({ start: pos[0], length: pos[1] }));
              }
            });
            if (positions.length > 0) {
              snippet = highlightText(doc.body.substring(0, 150) + (doc.body.length > 150 ? '...' : ''), positions);
            }
          }

          const div = document.createElement('div');
          div.classList.add('p-4', 'border-b', 'border-gray-200', 'hover:bg-gray-50', 'cursor-pointer');
          div.innerHTML = `
            <a href="${doc.url}" class="text-blue-600 font-semibold block">${doc.title}</a>
            <p class="text-sm text-gray-600">${snippet}</p>
          `;
          div.addEventListener('click', () => {
            window.location.href = doc.url;
            searchPopup.style.display = 'none';
          });
          resultsDiv.appendChild(div);
        });
      }, 300));
    }

    // Build index on load
    buildIndex();
  }
}

class GreenEconomyFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer class="footer">
        <div class="container">
          <div class="footer-content">
            <div class="footer-section"></div>
            <div class="footer-section">
              <h4 data-i18n="footer.about_us">ABOUT US</h4>
              <ul>
                <li><a href="/LandingPage/About Page/about.html" data-i18n="footer.about_green_economy">About the green economy</a></li>
                <li><a href="/LandingPage/IRM-Sector/IRMSector.html" data-i18n="footer.irm_sector">IRM sector</a></li>
                <li><a href="/LandingPage/Opportunities/opportunities.html" data-i18n="footer.opportunities">Opportunities</a></li>
                <li><a href="/LandingPage/Knowledge-Hub/knowledge-hub.html" data-i18n="footer.knowledge_hub">Knowledge hub</a></li>
              </ul>
            </div>
            <div class="footer-section">
              <h4 data-i18n="footer.services">SERVICES</h4>
              <ul>
                <li><a href="#" data-i18n="footer.green_economy_network">Green economy network</a></li>
                <li><a href="#" data-i18n="footer.live_events_calendar">Live events calendar</a></li>
                <li><a href="#" data-i18n="footer.green_opportunities">Green opportunities</a></li>
                <li><a href="#" data-i18n="footer.news_updates">News and updates</a></li>
              </ul>
            </div>
            <div class="footer-section">
              <h4 data-i18n="footer.quick_links">QUICK LINKS</h4>
              <ul>
                <li><a href="#" data-i18n="footer.news_events">News & events</a></li>
                <li><a href="#" data-i18n="footer.contact_us">Contact us</a></li>
                <li><a href="/LandingPage/Knowledge-Hub/knowledge-hub.html" data-i18n="footer.knowledge_hub">Knowledge hub</a></li>
                <li><a href="#" data-i18n="footer.terms_reference">Terms of reference</a></li>
              </ul>
            </div>
          </div>
          <div class="footer-bottom">
            <p data-i18n="footer.copyright">© ${new Date().getFullYear()} Green Economy Network. All rights reserved.</p>
          </div>
        </div>
      </footer>
    `;
  }
}

customElements.define('green-economy-header', GreenEconomyHeader);
customElements.define('green-economy-dashboard-header', GreenEconomyDashboardHeader);
customElements.define('green-economy-footer', GreenEconomyFooter);

function navigateToFocusArea(areaId) {
//  window.location.href = `/LandingPage/Focus-Area/focus-area.html?area=${areaId}`;
   window.location.href = `/LandingPage/Focus-Area/focus-area.html?area=${areaId}`;
}

document.addEventListener('DOMContentLoaded', () => {
  console.log("DOM fully loaded for MasterPage.js");

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
        });
      }
    });
  });

  document.querySelectorAll(".hero-button").forEach((button) => {
    if (button) {
      button.addEventListener("click", function () {
        console.log("Button clicked:", this.textContent);
      });
    }
  });

  document.querySelectorAll(".business-card-button").forEach((button) => {
    if (button) {
      button.addEventListener("click", function () {
        console.log("Business card button clicked");
      });
    }
  });

  document.querySelectorAll(".event-button").forEach((button) => {
    if (button) {
      button.addEventListener("click", function () {
        console.log("Event button clicked");
      });
    }
  });

  const loginButton = document.querySelector(".login-button");
  if (loginButton) {
    loginButton.addEventListener("click", function () {
      console.log("Login button clicked");
      window.location.href = '/SignIn.html';
    });
  } else {
    console.log("No login button found on this page");
  }

  const playBtn = document.querySelector(".play-button");
  const heroVideo = document.querySelector(".hero-video");
  if (playBtn && heroVideo) {
    playBtn.addEventListener("click", function () {
      if (heroVideo.paused) {
        heroVideo.play();
        playBtn.classList.add("hidden");
      }
    });
    heroVideo.addEventListener("pause", function () {
      playBtn.classList.remove("hidden");
    });
  }
});

window.logout = function() {
  console.log('Logging out...');
  firebase.auth().signOut().then(() => {
    window.location.href = '/index.html';
  }).catch(error => {
    console.error("Logout error:", error);
  });
};

window.home = async function() {
  console.log('Logging out via Home...');
  try {
    const user = firebase.auth().currentUser;
    if (user) {
      await firebase.auth().signOut();
      window.localStorage.removeItem('emailForSignIn');
      window.history.pushState(null, document.title, window.location.href);
      window.onpopstate = async function() {
        await firebase.auth().signOut();
        window.localStorage.removeItem('emailForSignIn');
        window.location.href = '/index.html';
      };
    }
    window.location.href = '/index.html';
  } catch (error) {
    console.error('Error during home logout:', error);
    window.location.href = '/index.html';
  }
};