 // Get URL parameters to show specific focus area if needed
      function getUrlParameter(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
        var results = regex.exec(location.search);
        return results === null
          ? ""
          : decodeURIComponent(results[1].replace(/\+/g, " "));
      }

      // You could use this to highlight a specific focus area based on URL parameter
      const areaParam = getUrlParameter("area");
      if (areaParam) {
        console.log("Showing focus area:", areaParam);
        // Add logic here to highlight or scroll to specific focus area
      }

      // Add click handlers for buttons
      document
        .querySelector(".dashboard-button")
        .addEventListener("click", function () {
          console.log("Dashboard button clicked");
          // Add your dashboard functionality here
        });

      // Add smooth scrolling for anchor links
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

      // Parallax effect for hero
      const hero = document.querySelector(".hero");
      if (hero) {
        window.addEventListener("scroll", function () {
          const scrollPercentage = window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight);
          hero.style.backgroundPositionY = `${-50 + scrollPercentage * 50}px`;
        });
      }

      // Add animation on scroll for focus and partner items
      const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      };

      const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            entry.target.style.transform = "translateX(0)";
            entry.target.style.opacity = "1";
            entry.target.style.animation = `slideInRight 0.6s ease ${index * 0.1}s forwards`;
          }
        });
      }, observerOptions);

      // Observe focus items and partner items
      document.querySelectorAll(".focus-item").forEach((item, index) => {
        item.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(item);
      });

      document.querySelectorAll(".partner-item").forEach((item, index) => {
        item.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(item);
      });