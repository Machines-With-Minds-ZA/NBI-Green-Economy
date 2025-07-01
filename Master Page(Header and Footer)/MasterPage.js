// Define the custom header element
class GreenEconomyHeader extends HTMLElement {
    connectedCallback() {
        const isDashboard = window.location.pathname.includes('dashboard.html');
        this.innerHTML = `
            <header class="header">
                <div class="container">
                    <div class="header-content">
                        <div class="logo">
                            <img src="../Images/GET.png" alt="Logo" style="height:50px ; width:160px"/>
                        </div>
                        <nav class="nav">
                            <a href="/index.html" data-i18n="header.about">About Green Economy Toolkit</a>
                            <a href="/about.html" data-i18n="header.why_invest">IRM Sector</a>
                            <a href="#" data-i18n="header.opportunities">Opportunities</a>
                            <a href="#" data-i18n="header.tools_resources">Knowledge Hub</a>
                        </nav>
                        <div class="header-actions">
                            <select id="language-selector" class="language-selector">
                                <option value="en">English</option>
                                <option value="zu">IsiZulu</option>
                                <option value="tn">Tswana</option>
                            </select>
                            ${isDashboard ? `
                                <button onclick="logout()" class="logout-button">
                                    <i class="fas fa-sign-out-alt mr-2"></i><span data-i18n="header.logout">Logout</span>
                                </button>
                            ` : `
                                <a href="../Sign In & Sign Up/SignIn.html" class="logout-button" data-i18n="header.sign_in">Sign In</a>
                            `}
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
}

// Define the custom footer element
class GreenEconomyFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <footer class="footer">
                <div class="container">
                    <div class="footer-content">
                        <div class="footer-section">
                            <div class="logo">
                                <img src="Images/GET.png" alt="Logo" style="height:50px ; width:160px"/>
                            </div>
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
}

// Register the custom elements
customElements.define('green-economy-header', GreenEconomyHeader);
customElements.define('green-economy-footer', GreenEconomyFooter);

// Global logout function
window.logout = function() {
    // Add logout logic here
    console.log('Logging out...');
    window.location.href = '../index.html';
};

