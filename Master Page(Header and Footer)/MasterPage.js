class GreenEconomyHeader extends HTMLElement {
  connectedCallback() {
    const isDashboard = window.location.pathname.includes('dashboard.html');

<<<<<<< HEAD
        this.innerHTML = `
            <header class="header">
                <div class="container">
                    <div class="header-content">
                        <div class="logo">
<<<<<<< HEAD
                            <img src="../Images/GET.png" alt="Logo" style="height:65px ; width:240px"/>
=======
                            <a href="../index.html">
                                <img src="../Images/GET.png" alt="Logo" style="height:50px ; width:160px"/>
                            </a>
>>>>>>> a93f7dd6b4853b9592799782e6f5e9d6a9144d83
                        </div>
                        <nav class="nav">
                        
                            <a href="/index.html" data-i18n="header.about">About Green Economy Toolkit</a>
                            <a href="/about.html" data-i18n="header.why_invest">IRM Sector</a>
                            <a href="#" data-i18n="header.opportunities">Opportunities</a>
                            <a href="#" data-i18n="header.tools_resources">Knowledge Hub</a>
                            <a href="/disclaimer.html">Disclaimer</a>
                        </nav>
                        <div class="header-actions">
                            <select id="language-selector" class="language-selector">
                                <option value="en">Select</option>
                                <option value="en">English</option>
                                <option value="zu">IsiZulu</option>
                                <option value="tn">Tswana</option>
                            </select>
                            
                            ${isDashboard ? `
                                <button onclick="logout()" class="logout-button">
                                    <i class="fas fa-sign-out-alt mr-2"></i><span data-i18n="header.logout">Home</span>
                                </button>
                            ` :  `
                            <button onclick="logout()" class="logout-button">
                                    <i class="fas fa-sign-out-alt mr-2"></i><span data-i18n="header.home">Home</span>
                                </button>`}
                        </div>
                    </div>
                </div>
            </header>
        `;
        
        // Add event listener for language selector
        const languageSelector = this.querySelector('#language-selector');
        if (languageSelector) {
            languageSelector.addEventListener('change', (e) => {
                this.switchLanguage(e.target.value);
            });
        }
    }

    switchLanguage(lang) {
        // Implement language switching logic here
        console.log(`Switching to ${lang} language`);
        // This would typically involve fetching translations and updating the DOM
    }
=======
    this.innerHTML = `
      <header class="header">
        <div class="logo">
          <a href="../index.html">
            <img src="../Images/GET.png" alt="Logo" />
          </a>
        </div>
        <nav class="nav">
          <a href="/index.html" data-i18n="header.funding">Funding</a>
          <a href="/opportunities.html" data-i18n="header.opportunities">Opportunities</a>
          <a href="/jobs.html" data-i18n="header.find_a_job">Find a Job</a>
          <a href="/training.html" data-i18n="header.training">Training</a>
          <select class="language-selector" onchange="changeLanguage(this.value)">
            <option value="" disabled selected>Select</option>
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
>>>>>>> NBI2-junior
}

// GreenEconomyFooter remains unchanged as it already uses data-i18n attributes
class GreenEconomyFooter extends HTMLElement {
<<<<<<< HEAD
    connectedCallback() {
        this.innerHTML = `
            <footer class="footer">
                <div class="container">
                    <div class="footer-content">
                        <div class="footer-section">
                              <img src="../Images/GETBG.webp" alt="Logo" style="height:65px ; width:240px"/>
                        </div>
                        <div class="footer-section">
                            <h4 data-i18n="footer.about_us">ABOUT US</h4>
                            <ul>
                                <li><a href="#" data-i18n="footer.about_green_economy">About the green economy</a></li>
                                <li><a href="#" data-i18n="footer.who_we_are">Who we are</a></li>
                                <li><a href="#" data-i18n="footer.our_team">Our team</a></li>
                                <li><a href="#" data-i18n="footer.board_directors">Board of directors</a></li>
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
                        <p data-i18n="footer.copyright">&copy; ${new Date().getFullYear()} Green Economy Network. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        `;
    }
=======
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
                <li><a href="#" data-i18n="footer.who_we_are">Who we are</a></li>
                <li><a href="#" data-i18n="footer.our_team">Our team</a></li>
                <li><a href="#" data-i18n="footer.board_directors">Board of directors</a></li>
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
                <li><a href="#" data-i18n">Contact us</a></li>
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
>>>>>>> NBI2-junior
}

// Register the custom elements
customElements.define('green-economy-header', GreenEconomyHeader);
customElements.define('green-economy-footer', GreenEconomyFooter);

// Global logout function
window.logout = function() {
  console.log('Logging out...');
  window.location.href = '../index.html';
};

// Global home function
window.home = function() {
  window.location.href = '../index.html';
};