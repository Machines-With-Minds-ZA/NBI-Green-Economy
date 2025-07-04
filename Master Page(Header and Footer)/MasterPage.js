        class GreenEconomyHeader extends HTMLElement {
            connectedCallback() {
                const isDashboard = window.location.pathname.includes('dashboard.html');

                this.innerHTML = `
                    <header class="header">
                        <div class="logo">
                            <a href="../index.html">
                                <img src="../Images/GET.png" alt="Logo" />
                            </a>
                        </div>
                        <nav class="nav">
                            <a href="/index.html">Funding</a>
                            <a href="/opportunities.html">Opportunities</a>
                            <a href="/jobs.html">Find a Job</a>
                            <a href="/training.html">Training</a>
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
        }
// Define the custom footer element
class GreenEconomyFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <footer class="footer">
                <div class="container">
                    <div class="footer-content">
                        <div class="footer-section">
                            
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
                        <p data-i18n="footer.copyright">© ${new Date().getFullYear()} Green Economy Network. All rights reserved.</p>
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

window.home = function() {
    window.location.href = '../index.html'; // Fixed typo: 'locate' to 'location'
}