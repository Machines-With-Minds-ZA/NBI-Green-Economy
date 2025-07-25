const firebaseConfig = {
  apiKey: "AIzaSyCfa827mvCLf1ETts6B_DmCfb7owTohBxk",
  authDomain: "nbi-green-economy.firebaseapp.com",
  projectId: "nbi-green-economy",
  storageBucket: "nbi-green-economy.firebasestorage.app",
  messagingSenderId: "53732340059",
  appId: "1:53732340059:web:3fb3f086c6662e1e9baa7e",
  measurementId: "G-37VRZ5CGE4"
};

try {
  const app = firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  const db = firebase.firestore();
  console.log("Firebase initialized successfully for MasterPage");

  class GreenEconomyHeader extends HTMLElement {
    connectedCallback() {
      this.innerHTML = `
        <header class="bg-green-primary text-white shadow-md">
          <div class="container mx-auto px-4 py-4 flex justify-between items-center">
            <div class="flex items-center">
              <img src="../Images/GET.png" alt="Green Economy Logo" class="h-12 mr-4">
              <h1 class="text-xl font-bold">Green Economy Toolkit</h1>
            </div>
            <nav class="hidden md:flex space-x-4">
              <a href="../LandingPage/About Page/about.html" class="hover:underline" data-i18n="header.funding">About the green economy</a>
              <a href="../LandingPage/Opportunities/opportunities.html" class="hover:underline" data-i18n="header.opportunities">Opportunities</a>
              <a href="../LandingPage/IRM-Sector/IRMSector.html" class="hover:underline" data-i18n="header.find_a_job">IRM sector</a>
              <a href="../LandingPage/Knowledge-Hub/knowledge-hub.html" class="hover:underline" data-i18n="header.training">Knowledge hub</a>
            </nav>
            <div class="flex items-center space-x-4">
              <select id="language-selector" class="bg-white text-gray-900 px-2 py-1 rounded-md">
                <option value="en" data-i18n="header.select">English</option>
                <option value="zu" data-i18n="header.select">Zulu</option>
                <option value="tn" data-i18n="header.select">Tswana</option>
              </select>
              <button id="login-btn" class="bg-white text-green-primary px-4 py-2 rounded-md hover:bg-gray-100">Login</button>
            </div>
          </div>
        </header>
      `;
    }
  }

  class GreenEconomyFooter extends HTMLElement {
    connectedCallback() {
      this.innerHTML = `
        <footer class="bg-gray-800 text-white py-8">
          <div class="container mx-auto px-4">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 class="text-lg font-semibold mb-4" data-i18n="footer.about_us">ABOUT US</h3>
                <ul class="space-y-2">
                  <li><a href="../LandingPage/About Page/about.html" class="hover:underline" data-i18n="footer.about_green_economy">About the green economy</a></li>
                  <li><a href="../LandingPage/IRM-Sector/IRMSector.html" class="hover:underline" data-i18n="footer.irm_sector">IRM sector</a></li>
                  <li><a href="../LandingPage/Opportunities/opportunities.html" class="hover:underline" data-i18n="footer.opportunities">Opportunities</a></li>
                  <li><a href="../LandingPage/Knowledge-Hub/knowledge-hub.html" class="hover:underline" data-i18n="footer.knowledge_hub">Knowledge hub</a></li>
                </ul>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-4" data-i18n="footer.services">SERVICES</h3>
                <ul class="space-y-2">
                  <li><a href="#" class="hover:underline" data-i18n="footer.green_economy_network">Green economy network</a></li>
                  <li><a href="#" class="hover:underline" data-i18n="footer.live_events_calendar">Live events calendar</a></li>
                  <li><a href="#" class="hover:underline" data-i18n="footer.green_opportunities">Green opportunities</a></li>
                  <li><a href="#" class="hover:underline" data-i18n="footer.news_updates">News and updates</a></li>
                </ul>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-4" data-i18n="footer.quick_links">QUICK LINKS</h3>
                <ul class="space-y-2">
                  <li><a href="#" class="hover:underline" data-i18n="footer.news_events">News & events</a></li>
                  <li><a href="#" class="hover:underline" data-i18n="footer.contact_us">Contact us</a></li>
                  <li><a href="#" class="hover:underline" data-i18n="footer.terms_reference">Terms of reference</a></li>
                </ul>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-4">Contact</h3>
                <p>Email: <a href="mailto:support@nbigreeneconomy.com" class="hover:underline">support@nbigreeneconomy.com</a></p>
                <p>Phone: +27 123 456 789</p>
              </div>
            </div>
            <div class="mt-8 text-center">
              <p data-i18n="footer.copyright">© ${new Date().getFullYear()} Green Economy Network. All rights reserved.</p>
            </div>
          </div>
        </footer>
      `;
    }
  }

  customElements.define('green-economy-header', GreenEconomyHeader);
  customElements.define('green-economy-footer', GreenEconomyFooter);

  document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded for MasterPage.js");

    const loginBtn = document.getElementById('login-btn');
    const languageSelector = document.getElementById('language-selector');

    if (!loginBtn) {
      console.log("No login button found on this page");
    } else {
      auth.onAuthStateChanged((user) => {
        if (user) {
          loginBtn.textContent = 'Logout';
          loginBtn.classList.remove('bg-white', 'text-green-primary');
          loginBtn.classList.add('bg-red-500', 'text-white');
          loginBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            console.log("Logout button clicked");
            try {
              await auth.signOut();
              console.log("User signed out successfully");
              window.location.href = '../SignIn.html';
            } catch (error) {
              console.error("Logout error:", error);
            }
          });
        } else {
          loginBtn.textContent = 'Login';
          loginBtn.classList.remove('bg-red-500', 'text-white');
          loginBtn.classList.add('bg-white', 'text-green-primary');
          loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log("Login button clicked");
            window.location.href = '../SignIn.html';
          });
        }
      });
    }

    if (languageSelector) {
      languageSelector.addEventListener('change', (e) => {
        const selectedLang = e.target.value;
        console.log("Language changed to:", selectedLang);
        document.documentElement.lang = selectedLang;
        if (typeof updateLanguage === 'function') {
          updateLanguage(selectedLang);
        } else {
          console.error("updateLanguage function not found");
        }
      });
    } else {
      console.log("No language selector found on this page");
    }

    if (typeof updateLanguage === 'function') {
      updateLanguage(document.documentElement.lang || 'en');
    }
  });
} catch (error) {
  console.error("Firebase initialization failed in MasterPage:", error);
}