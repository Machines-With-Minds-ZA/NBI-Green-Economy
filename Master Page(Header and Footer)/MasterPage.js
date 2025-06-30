class GreenEconomyHeader extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <nav class="bg-white shadow-sm border-b border-gray-100">
                <div class="px-4 sm:px-6 lg:px-8">
                    <div class="flex flex-col md:flex-row md:items-center h-auto md:h-16">
                        <div class="flex items-center justify-between w-full md:w-auto mb-4 md:mb-0">
                            <div class="flex items-center space-x-2">
                                <div class="w-8 h-8 bg-green-primary rounded-full"></div>
                                <span class="font-bold text-lg text-gray-900">Green Economy Toolkit</span>
                            </div>
                            <div class="md:hidden">
                                <button id="mobile-menu-toggle" class="w-6 h-6 text-gray-600 focus:outline-none">
                                    <svg fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div id="mobile-menu" class="hidden md:flex flex-col md:flex-row md:items-center md:justify-center space-y-2 md:space-y-0 md:space-x-8 text-center w-full">
                            <a href="/" class="text-gray-900 hover:text-green-primary px-3 py-2 text-sm font-medium transition-colors duration-200">About Green Economy Toolkit</a>
                            <a href="/about" class="text-gray-600 hover:text-green-primary px-3 py-2 text-sm font-medium transition-colors duration-200">Why Invest</a>
                            <a href="#" class="text-gray-600 hover:text-green-primary px-3 py-2 text-sm font-medium transition-colors duration-200">Opportunities</a>
                            <a href="#" class="text-gray-600 hover:text-green-primary px-3 py-2 text-sm font-medium transition-colors duration-200">Tools and Resources</a>
                            <a href="#" class="text-gray-600 hover:text-green-primary px-3 py-2 text-sm font-medium transition-colors duration-200">News and Press</a>
                            <select id="language-selector" class="border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-md px-4 py-2 text-sm font-medium md:mx-2">
                                <option value="en">English</option>
                                <option value="zu">isiZulu</option>
                                <option value="tn">Setswana</option>
                            </select>
                            <button class="border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-md px-4 py-2 text-sm font-medium">Sign In</button>
                        </div>
                    </div>
                </div>
            </nav>
        `;
        this.querySelector('#mobile-menu-toggle').addEventListener('click', () => {
            const mobileMenu = this.querySelector('#mobile-menu');
            mobileMenu.classList.toggle('hidden');
            mobileMenu.classList.toggle('block');
        });
    }
}

class GreenEconomyFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <footer class="green-gradient text-white">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <div class="flex items-center space-x-2 mb-4">
                                <div class="w-8 h-8 bg-white rounded-full"></div>
                                <span class="font-bold text-lg">Green Economy Toolkit</span>
                            </div>
                        </div>
                        <div>
                            <h3 class="font-semibold text-lg mb-4">COMPANY</h3>
                            <ul class="space-y-2 text-sm opacity-90">
                                <li><a href="#" class="hover:text-white transition-colors">About us</a></li>
                                <li><a href="#" class="hover:text-white transition房</li>
                                <li><a href="#" class="hover:text-white transition-colors">Services</a></li>
                                <li><a href="#" class="hover:text-white transition-colors">Portfolio</a></li>
                                <li><a href="#" class="hover:text-white transition-colors">Pricing</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 class="font-semibold text-lg mb-4">SUPPORT</h3>
                            <ul class="space-y-2 text-sm opacity-90">
                                <li><a href="#" class="hover:text-white transition-colors">FAQ</a></li>
                                <li><a href="#" class="hover:text-white transition-colors">Support Center</a></li>
                                <li><a href="#" class="hover:text-white transition-colors">Contact Us</a></li>
                                <li><a href="#" class="hover:text-white transition-colors">Status</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 class="font-semibold text-lg mb-4">QUICK LINKS</h3>
                            <ul class="space-y-2 text-sm opacity-90">
                                <li><a href="#" class="hover:text-white transition-colors">Privacy Policy</a></li>
                                <li><a href="#" class="hover:text-white transition-colors">Terms of service</a></li>
                                <li><a href="#" class="hover:text-white transition-colors">Disclaimer</a></li>
                                <li><a href="#" class="hover:text-white transition-colors">Credits</a></li>
                            </ul>
                        </div>
                    </div>
                    <div class="border-t border-white/20 mt-8 pt-8">
                        <div class="flex flex-col md:flex-row justify-between items-center">
                            <p class="text-sm opacity-90">© 2024 Green Economy Toolkit</p>
                            <div class="flex space-x-6 mt-4 md:mt-0">
                                <div class="flex items-center space-x-4">
                                    <img src="/placeholder.svg" alt="Logo 1" class="h-8 opacity-80">
                                    <img src="/placeholder.svg" alt="Logo 2" class="h-8 opacity-80">
                                    <img src="/placeholder.svg" alt="Logo 3" class="h-8 opacity-80">
                                    <img src="/placeholder.svg" alt="Logo 4" class="h-8 opacity-80">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        `;
    }
}

customElements.define('green-economy-header', GreenEconomyHeader);
customElements.define('green-economy-footer', GreenEconomyFooter);