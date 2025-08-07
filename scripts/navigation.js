// Handle hero button clicks
document.addEventListener('DOMContentLoaded', function() {
    // Hero buttons
    const heroButtons = document.querySelectorAll('.hero-button');
    heroButtons.forEach(button => {
        button.addEventListener('click', function() {
            const buttonText = this.textContent.trim().toLowerCase();
            switch(buttonText) {
                case 'access funding':
                    window.location.href = '/Funding Hub/Funding-Hub.html';
                    break;
                case 'opportunities':
                    window.location.href = '/LandingPage/Opportunities/opportunities.html';
                    break;
                case 'irm sector':
                    window.location.href = '/LandingPage/IRM-Sector/IRMSector.html';
                    break;
                case 'training':
                    window.location.href = '/LandingPage/Knowledge-Hub/knowledge-hub.html';
                    break;
            }
        });
    });

    // Update footer links
    const footerLinks = {
        'green_economy_network': '#',  // TODO: Add actual link
        'live_events_calendar': '#',   // TODO: Add actual link
        'green_opportunities': '/LandingPage/Opportunities/opportunities.html',
        'news_updates': '#',           // TODO: Add actual link
        'news_events': '#',            // TODO: Add actual link
        'contact_us': '/LandingPage/About Page/about.html#contact',
        'terms_reference': '#'         // TODO: Add actual link
    };

    Object.entries(footerLinks).forEach(([key, url]) => {
        const elements = document.querySelectorAll(`[data-i18n$="${key}"]`);
        elements.forEach(el => {
            const anchor = el.closest('a');
            if (anchor) {
                anchor.href = url;
            }
        });
    });

    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Update URL without adding to history
                if (history.pushState) {
                    history.pushState(null, null, href);
                } else {
                    location.hash = href;
                }
            }
        });
    });

    // Handle back/forward navigation for anchor links
    window.addEventListener('popstate', function(e) {
        const hash = window.location.hash;
        if (hash) {
            const target = document.querySelector(hash);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});
