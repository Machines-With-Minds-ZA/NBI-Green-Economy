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
              <a href="/LandingPage/IRM-Sector/IRMSector.html" data-i18n="header.find_a_job">IRM sector</a>
              <a href="/LandingPage/Knowledge-Hub/knowledge-hub.html" data-i18n="header.training">Knowledge hub</a>
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
          <div class="search-header">
            <h3 data-i18n="header.ai-search-title">AI-Enhanced Search</h3>
            <span class="search-close" id="search-close">×</span>
          </div>
          <div class="search-container">
            <svg class="search-input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <input type="text" class="search-input" id="smartSearch" data-i18n="[placeholder]header.search-placeholder" placeholder="Search green funding, businesses, tools...">
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
          }, 300); // Match animation duration
        }
      });

      searchClose.addEventListener('click', () => {
        searchPopup.classList.add('animate-out');
        searchPopup.classList.remove('animate-in');
        setTimeout(() => {
          searchPopup.style.display = 'none';
        }, 300); // Match animation duration
      });
    }
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
          <div class="search-header">
            <h3 data-i18n="header.ai-search-title">AI-Enhanced Search</h3>
            <span class="search-close" id="search-close">×</span>
          </div>
          <div class="search-container">
            <svg class="search-input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <input type="text" class="search-input" id="smartSearch" data-i18n="[placeholder]header.search-placeholder" placeholder="Search green funding, businesses, tools...">
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
          }, 300); // Match animation duration
        }
      });

      searchClose.addEventListener('click', () => {
        searchPopup.classList.add('animate-out');
        searchPopup.classList.remove('animate-in');
        setTimeout(() => {
          searchPopup.style.display = 'none';
        }, 300); // Match animation duration
      });
    }
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
  window.location.href = `/LADINGPAGES/Focus-Area/focus-area.html?area=${areaId}`;
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