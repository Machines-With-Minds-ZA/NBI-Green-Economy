// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyCfa827mvCLf1ETts6B_DmCfb7owTohBxk",
  authDomain: "nbi-green-economy.firebaseapp.com",
  projectId: "nbi-green-economy",
  storageBucket: "nbi-green-economy.firebasestorage.app",
  messagingSenderId: "53732340059",
  appId: "1:53732340059:web:3fb3f086c6662e1e9baa7e",
  measurementId: "G-37VRZ5CGE4"
};

// Initialize Firebase (optional, for interaction tracking)
let db;
try {
  firebase.initializeApp(firebaseConfig);
  db = firebase.firestore();
} catch (error) {
  console.error("Firebase initialization failed:", error);
}

// Loader Functions
function showLoader() {
  const loader = document.getElementById('loader');
  const loaderOverlay = document.getElementById('loader-overlay');
  if (loader && loaderOverlay) {
    loader.style.display = 'block';
    loaderOverlay.style.display = 'block';
  } else {
    console.warn("Loader elements not found");
  }
}

function hideLoader() {
  const loader = document.getElementById('loader');
  const loaderOverlay = document.getElementById('loader-overlay');
  if (loader && loaderOverlay) {
    loader.style.display = 'none';
    loaderOverlay.style.display = 'none';
  } else {
    console.warn("Loader elements not found");
  }
}

// Interaction Tracking Function (optional)
function trackUserInteraction(tempUserId, category, action, label = "") {
  if (db) {
    db.collection('interactions').add({
      tempUserId: tempUserId,
      category: category,
      action: action,
      label: label,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      language: 'en',
      userAgent: navigator.userAgent
    }).catch((error) => {
      console.error("Error logging interaction to Firestore: ", error);
      console.log(`Local log: tempUserId=${tempUserId}, category=${category}, action=${action}, label=${label}`);
    });
  } else {
    console.log(`Local log: tempUserId=${tempUserId}, category=${category}, action=${action}, label=${label}`);
  }
}

// Get Temporary User ID from URL or generate a guest ID
let tempUserId = new URLSearchParams(window.location.search).get('tempUserId');
if (!tempUserId) {
  tempUserId = 'guest_' + Math.random().toString(36).substr(2, 9);
  console.log("Generated guest tempUserId:", tempUserId);
}

// Navigation Paths
const paths = {
  funding: "../Funding Hub/Funding-Hub.html",
  smme: "../Sections/SMME/smme.html",
  toolkits: "../ToolKits/toolkits.html",
  legal: "../Legal/legal.html"
};

// Initialize Dashboard
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded, initializing dashboard...");
  showLoader();
  try {
    trackUserInteraction(tempUserId, 'page', 'loaded', 'Dashboard page');
    initializeDashboard();
  } catch (error) {
    console.error("Error initializing dashboard:", error);
    displayErrorMessage("Failed to initialize dashboard: " + error.message);
  } finally {
    hideLoader();
  }
});

function initializeDashboard() {
  console.log("Initializing dashboard cards...");
  const dashboardCards = document.querySelectorAll(".dashboard-card");
  console.log(`Found ${dashboardCards.length} dashboard cards`);
  if (dashboardCards.length === 0) {
    console.error("No dashboard cards found! Check HTML for .dashboard-card elements.");
    displayErrorMessage("No dashboard cards found. Please check the page structure.");
    return;
  }
  dashboardCards.forEach((card, index) => {
    const section = card.getAttribute("data-section");
    console.log(`Binding click handler for card ${index + 1}: ${section}`);
    // Remove any existing listeners to prevent duplicates
    card.removeEventListener("click", handleCardClick);
    card.addEventListener("click", handleCardClick);
    // Ensure card is interactive
    card.style.cursor = "pointer";
    card.style.pointerEvents = "auto";
    card.style.position = "relative";
    card.style.zIndex = "1";
    // Debug: Log current listeners
    console.log(`Card ${section} listener attached`);
  });
}

function handleCardClick(event) {
  event.preventDefault();
  event.stopPropagation();
  const section = this.getAttribute("data-section");
  console.log(`Card clicked: ${section}`);
  if (!section) {
    console.error("No data-section attribute found on clicked card");
    displayErrorMessage("Navigation error: Invalid card section.");
    return;
  }
  navigateToSection(section);
}

function navigateToSection(section) {
  console.log(`Navigating to section: ${section}`);
  trackUserInteraction(tempUserId, "navigation", `click_${section}`);
  if (paths[section]) {
    showLoader();
    console.log(`Attempting to navigate to ${paths[section]}?tempUserId=${tempUserId}`);
    try {
      window.location.href = `${paths[section]}?tempUserId=${tempUserId}`;
    } catch (error) {
      console.error(`Navigation error for ${section}:`, error);
      displayErrorMessage(`Navigation error: Unable to access ${section}.`);
      hideLoader();
    }
  } else {
    console.error(`Invalid section: ${section}`);
    displayErrorMessage("Navigation error: Section not found.");
    hideLoader();
  }
}

function displayErrorMessage(message) {
  const container = document.querySelector(".dashboard-grid") || document.querySelector(".container-full");
  if (!container) {
    console.error("No container found for error message");
    return;
  }
  const errorDiv = document.createElement("div");
  errorDiv.className = "error-message";
  errorDiv.style = "color: red; text-align: center; padding: 1rem; font-weight: 500;";
  errorDiv.textContent = message;
  container.prepend(errorDiv);
  setTimeout(() => errorDiv.remove(), 5000);
}

// Translations
const translations = {
  en: {
    "dashboard-title": "Dashboard Overview",
    "dashboard-subtitle": "Welcome to your personalized Green Economy Toolkit dashboard",
    "ai-search-title": "AI-Enhanced Search",
    "search-placeholder": "Search green funding, businesses, tools...",
    "funding-hub-title": "Funding Hub",
    "funding-hub-desc": "Explore green funding opportunities with real-time updates and eligibility filters.",
    "smme-directory-title": "SMME Directory",
    "smme-directory-desc": "Searchable database with business profiles and green certification statuses.",
    "toolkits-title": "Integrated Toolkits",
    "toolkits-desc": "Access green economy tools and seamless redirects to external applications.",
    "legal-title": "Legal & Compliance",
    "legal-desc": "Clearly defined policies and limited liability statements integrated into the platform.",
    "personas-title": "Built for Every Green Economy Participant"
  },
  zu: {
    "dashboard-title": "Ukubuka Idashboard",
    "dashboard-subtitle": "Wamukelekile ku-Green Economy Toolkit dashboard yakho",
    "ai-search-title": "Ukusesha Okuhlakanipha nge-AI",
    "search-placeholder": "Sesha amathuba okuphila okuluhlaza...",
    "funding-hub-title": "Indawo Yezimali",
    "funding-hub-desc": "Hlola amathuba ezimali eziluhlaza ngokubuyekezwa kwesikhathi sangempela.",
    "smme-directory-title": "Uhlu Lwamabhizinisi Amancane",
    "smme-directory-desc": "Isizindalwazi esiseshekayo namaphrofayela amabhizinisi nezimo zokuqinisekisa okuluhlaza.",
    "toolkits-title": "Amatulusi Ahlanganisiwe",
    "toolkits-desc": "Finyelela amatulusi omnotho oluhlaza kanye nokudlulisela ngaphandle koluleko.",
    "legal-title": "Ezomthetho Nokulandela",
    "legal-desc": "Izinqubomgomo ezicacile nezitatimende zomthwalo ohlinzekwe endaweni.",
    "personas-title": "Yakhelwe Bonke Abahlanganyeli Bomnotho Oluhlaza"
  },
  tn: {
    "dashboard-title": "Ponopesiso ya Dashboard",
    "dashboard-subtitle": "Amogelesegang ko dashboard ya gago ya Green Economy Toolkit",
    "ai-search-title": "Batla ka AI e e Botlhale",
    "search-placeholder": "Batla ditšhono tsa ikonomi e tala...",
    "funding-hub-title": "Lefelo la Madi",
    "funding-hub-desc": "Sekaseka ditšhono tsa madi a tala ka diphetogo tsa nako ya nnete.",
    "smme-directory-title": "Lenaane la Dikgwebo Dinnye",
    "smme-directory-desc": "Database e e batlang le diprofaele tsa dikgwebo le maemo a netefatso e tala.",
    "toolkits-title": "Didirišwa tše di Kopantšwego",
    "toolkits-desc": "Hwetša didirišwa tsa ikonomi e tala le diphetišetšo tše di se nago bothata.",
    "legal-title": "Semolao le Go Latela",
    "legal-desc": "Melawana e e tlhalogantšegago le dipego tsa boikarabelo tše di akaretšweng.",
    "personas-title": "E Agilwe Batšeakarolo Botlhe ba Ikonomi e Tala"
  }
};

let newsData = [];
let currentLanguage = "en";
let currentNewsCategory = "all";
let displayedNewsCount = 4;
const DEFAULT_IMAGE = "https://images.pexels.com/photos/371917/pexels-photo-371917.jpeg";

const fallbackNewsData = [
  {
    id: "1",
    title: "South Africa Launches New Green Energy Initiative",
    description: "The government announces a R10 billion investment in renewable energy projects across the country, focusing on solar and wind power development.",
    category: "Energy",
    source: "Green Economy SA",
    time: "2h ago",
    image: "https://images.pexels.com/photos/371917/pexels-photo-371917.jpeg",
    url: "#"
  },
  {
    id: "2",
    title: "New Carbon Credit Trading Platform Launched",
    description: "A groundbreaking platform connects South African businesses with international carbon credit markets, enabling sustainable revenue streams.",
    category: "Finance",
    source: "Carbon Market News",
    time: "4h ago",
    image: "https://images.pexels.com/photos/371917/pexels-photo-371917.jpeg",
    url: "#"
  },
  {
    id: "3",
    title: "SMME Green Certification Program Expands",
    description: "Over 1,000 small businesses have now received green economy certifications, boosting their market competitiveness and sustainability credentials.",
    category: "Business",
    source: "SMME Today",
    time: "6h ago",
    image: "https://images.pexels.com/photos/371917/pexels-photo-371917.jpeg",
    url: "#"
  },
  {
    id: "4",
    title: "Revolutionary Water Conservation Technology",
    description: "Local innovators develop smart irrigation systems that reduce water usage by 40% while maintaining crop yields, attracting international investment.",
    category: "Technology",
    source: "AgriTech News",
    time: "8h ago",
    image: "https://images.pexels.com/photos/371917/pexels-photo-371917.jpeg",
    url: "#"
  },
  {
    id: "5",
    title: "Green Skills Training Centers Opening Nationwide",
    description: "TVET colleges across South Africa launch specialized green economy training programs, preparing youth for sustainable career opportunities.",
    category: "Education",
    source: "Education Herald",
    time: "1d ago",
    image: "https://images.pexels.com/photos/371917/pexels-photo-371917.jpeg",
    url: "#"
  },
  {
    id: "6",
    title: "Clean Energy Jobs Surge in Western Cape",
    description: "The renewable energy sector creates over 5,000 new jobs in the Western Cape, providing opportunities for local communities and driving economic growth.",
    category: "Energy",
    source: "Cape Business News",
    time: "1d ago",
    image: "https://images.pexels.com/photos/371917/pexels-photo-371917.jpeg",
    url: "#"
  }
];

function changeLanguage(lang) {
  currentLanguage = lang;
  updateLanguage(lang);
  trackUserInteraction(tempUserId, "language", "changed", lang);
}

function updateLanguage(lang) {
  const elements = document.querySelectorAll("[data-translate]");
  elements.forEach((element) => {
    const key = element.getAttribute("data-translate");
    if (translations[lang] && translations[lang][key]) {
      element.textContent = translations[lang][key];
    }
  });

  const placeholderElements = document.querySelectorAll("[data-translate-placeholder]");
  placeholderElements.forEach((element) => {
    const key = element.getAttribute("data-translate-placeholder");
    if (translations[lang] && translations[lang][key]) {
      element.placeholder = translations[lang][key];
    }
  });
}

function initializeSearch() {
  const searchInput = document.getElementById("smartSearch");
  if (!searchInput) return;
  let searchTimeout;

  searchInput.addEventListener("input", function (e) {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      performSearch(e.target.value);
    }, 300);
  });

  searchInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      performSearch(e.target.value);
    }
  });
}

function performSearch(query) {
  if (query.length < 2) return;
  trackUserInteraction(tempUserId, "search", "query", query);
}

async function initializeNews() {
  const newsGrid = document.getElementById("newsGrid");
  if (!newsGrid) return;
  await fetchNews();
  renderNews();
  setupNewsEventListeners();
  // Only set interval if News API is enabled
  try {
    const apiDoc = await db.collection('apis').doc('news-api').get();
    if (apiDoc.exists && apiDoc.data().enabled) {
      setInterval(updateNews, 30000);
    }
  } catch (error) {
    console.error("Error checking News API status:", error);
    displayErrorMessage("Unable to verify News API status. News may not update automatically.");
  }
}

async function fetchNews() {
  try {
    showLoader();
    
    // Check if News API is enabled in Firestore
    const apiDoc = await db.collection('apis').doc('news-api').get();
    if (!apiDoc.exists || !apiDoc.data().enabled) {
      newsData = [...fallbackNewsData];
      displayErrorMessage("News API is disabled. Showing cached content.");
      return;
    }

    // Fetch API key from Firestore
    const apiKey = apiDoc.data().key || "e00b07155a6c49aa90b8f84ad3115ec1";
    const query = "green economy OR sustainability OR renewable energy OR carbon credit OR green technology OR environmental education";
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&apiKey=${apiKey}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const data = await response.json();

    if (!data.articles || data.articles.length === 0) {
      throw new Error("No articles found");
    }

    newsData = data.articles
      .filter(article => article.title && article.description && article.url && article.source.name)
      .map((article, index) => {
        const content = `${article.title.toLowerCase()} ${article.description.toLowerCase()}`;
        let category = "Business";
        if (content.includes("energy") || content.includes("solar") || content.includes("wind") || content.includes("renewable")) category = "Energy";
        else if (content.includes("finance") || content.includes("funding") || content.includes("carbon credit")) category = "Finance";
        else if (content.includes("technology") || content.includes("innovation")) category = "Technology";
        else if (content.includes("education") || content.includes("training") || content.includes("skills")) category = "Education";

        const publishedAt = new Date(article.publishedAt);
        const now = new Date();
        const diffMs = now - publishedAt;
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const time = diffHours < 24 ? `${diffHours}h ago` : `${Math.floor(diffHours / 24)}d ago`;

        return {
          id: `news-${index}-${Date.now()}`,
          title: article.title,
          description: article.description.length > 150 ? article.description.substring(0, 147) + "..." : article.description,
          category: category,
          source: article.source.name,
          time: time,
          image: article.urlToImage || DEFAULT_IMAGE,
          url: article.url
        };
      })
      .slice(0, 20);

    if (newsData.length === 0) {
      newsData = [...fallbackNewsData];
      displayErrorMessage("No news articles available. Showing cached content.");
    }
  } catch (error) {
    console.error("Error fetching news:", error);
    newsData = [...fallbackNewsData];
    displayErrorMessage("Failed to load news. Showing cached content.");
  } finally {
    hideLoader();
  }
}

function renderNews() {
  const newsGrid = document.getElementById("newsGrid");
  if (!newsGrid) return;
  const filteredNews = currentNewsCategory === "all" ? newsData : newsData.filter((news) => news.category === currentNewsCategory);
  const newsToShow = filteredNews.slice(0, displayedNewsCount);

  if (newsToShow.length === 0) {
    newsGrid.innerHTML = '<p style="text-align: center; color: #666;">No news available. The News API may be disabled or no articles match the selected category.</p>';
    return;
  }

  newsGrid.innerHTML = newsToShow
    .map(
      (news) => `
        <div class="news-item" onclick="openNewsArticle('${news.id}')">
          <img src="${news.image}" alt="${news.title}" class="news-image" onerror="this.src='${DEFAULT_IMAGE}'">
          <div class="news-content">
            <div class="news-category ${news.category}">${news.category}</div>
            <h4 class="news-title">${news.title}</h4>
            <p class="news-description">${news.description}</p>
            <div class="news-meta">
              <span class="news-source">${news.source}</span>
              <div class="news-time">
                <svg style="width: 0.75rem; height: 0.75rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                ${news.time}
              </div>
            </div>
          </div>
        </div>
      `
    )
    .join("");

  const loadMoreBtn = document.getElementById("loadMoreNews");
  if (loadMoreBtn) {
    loadMoreBtn.style.display = displayedNewsCount >= filteredNews.length ? "none" : "inline-block";
  }
}

function setupNewsEventListeners() {
  const categoryBtns = document.querySelectorAll(".news-category-btn");
  categoryBtns.forEach((btn) => {
    btn.removeEventListener("click", handleCategoryClick);
    btn.addEventListener("click", handleCategoryClick);
  });

  const loadMoreBtn = document.getElementById("loadMoreNews");
  if (loadMoreBtn) {
    loadMoreBtn.removeEventListener("click", handleLoadMoreClick);
    loadMoreBtn.addEventListener("click", handleLoadMoreClick);
  }

  const refreshBtn = document.getElementById("refreshNews");
  if (refreshBtn) {
    refreshBtn.removeEventListener("click", handleRefreshClick);
    refreshBtn.addEventListener("click", handleRefreshClick);
  }
}

function handleCategoryClick() {
  const categoryBtns = document.querySelectorAll(".news-category-btn");
  categoryBtns.forEach((b) => b.classList.remove("active"));
  this.classList.add("active");
  currentNewsCategory = this.getAttribute("data-category");
  displayedNewsCount = 4;
  renderNews();
  trackUserInteraction(tempUserId, "news", "category_filter", currentNewsCategory);
}

function handleLoadMoreClick() {
  displayedNewsCount += 2;
  renderNews();
  trackUserInteraction(tempUserId, "news", "load_more");
}

function handleRefreshClick() {
  fetchNews().then(() => {
    renderNews();
    trackUserInteraction(tempUserId, "news", "refresh");
  });
}

function openNewsArticle(newsId) {
  const news = newsData.find((n) => n.id === newsId);
  if (news && news.url) {
    trackUserInteraction(tempUserId, "news", "article_click", news.title);
    window.open(news.url, "_blank");
  } else {
    displayErrorMessage("Unable to open article.");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
});