  class GreenEconomyHeader extends HTMLElement {
        connectedCallback() {
          const isDashboard = window.location.pathname.includes('dashboard.html');

          this.innerHTML = `
            <header class="header">
              <div class="logo">
                <a href="/index.html">
                  <img src="/Images/GET.png" alt="Logo" />
                </a>
              </div>
              <nav class="nav">
                <a href="/LandingPage/About Page/about.html" data-i18n="header.funding">About the green economy</a>
                <a href="/LandingPage/Opportunities/opportunities.html" data-i18n="header.opportunities">Opportunities</a>
                <a href="/LandingPage/IRM-Sector/IRMSector.html" data-i18n="header.find_a_job">IRM sector</a>
                <a href="/LandingPage/Knowledge-Hub/knowledge-hub.html" data-i18n="header.training">Knowledge hub</a>
                <select class="language-selector" onchange="changeLanguage(this.value)">
                  <option value="" disabled selected data-i18n="header.select">Select</option>
                  <option value="en">English</option>
                  <option value="zu">isiZulu</option>
                  <option value="tn">Tswana</option>
                </select>
                <span class="search-icon">🔍</span>
                <div class="blue-section"></div>
              </nav>
            </header>
          `;
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
                      <li><a href="#" data-i18n="footer.about_green_economy">About the green economy</a></li>
                      <li><a href="#" data-i18n="footer.irm_sector">IRM sector</a></li>
                      <li><a href="#" data-i18n="footer.opportunities">Opportunities</a></li>
                      <li><a href="#" data-i18n="footer.knowledge_hub">Knowledge hub</a></li>
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
                      <li><a href="#" data-i18n="footer.knowledge_hub">Knowledge hub</a></li>
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
      customElements.define('green-economy-footer', GreenEconomyFooter);

      function navigateToFocusArea(areaId) {
        window.location.href = `LADINGPAGES/Focus-Area/focus-area.html?area=${areaId}`;
      }

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
        button.addEventListener("click", function () {
          console.log("Button clicked:", this.textContent);
        });
      });

      document.querySelectorAll(".business-card-button").forEach((button) => {
        button.addEventListener("click", function () {
          console.log("Business card button clicked");
        });
      });

      document.querySelectorAll(".event-button").forEach((button) => {
        button.addEventListener("click", function () {
          console.log("Event button clicked");
        });
      });

      document.querySelector(".login-button").addEventListener("click", function () {
        console.log("Login button clicked");
      });

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

      window.logout = function() {
        console.log('Logging out...');
        window.location.href = '/index.html';
      };

      window.home = function() {
        window.location.href = '/index.html';
      };