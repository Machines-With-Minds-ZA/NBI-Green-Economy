const firebaseConfig = {
  apiKey: "AIzaSyAIlr8Y249Yu_1JPbUjNX7cQtJYlkbV3eY",
  authDomain: "nbi-database.firebaseapp.com",
  projectId: "nbi-database",
  storageBucket: "nbi-database.appspot.com",
  messagingSenderId: "497517200595",
  appId: "1:497517200595:web:c862996d49fba97baf8026"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const fieldMappings = {
  sector: {
    energy: 'Energy',
    agriculture: 'Agriculture',
    building: 'Climate Finance',
    waste: 'Waste',
    water: 'Water and Sanitation'
  },
  type: {
    grant: 'Grant',
    loan: 'Debt',
    equity: 'Equity',
    'working capital': 'Working Capital'
  },
  target: {
    smme: 'SMMEs',
    'non-smme': 'SMMEs'
  }
};

// Utility functions
function normalizeURL(url) {
  if (!url) return "";
  url = url.trim();
  if (url.startsWith("www.")) return "https://" + url;
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return "https://" + url;
  }
  return url;
}

function getDomain(url) {
  try {
    return new URL(normalizeURL(url)).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

function isValidFieldValue(value) {
  if (!value) return false;
  const trimmed = value.trim();
  return trimmed !== '' && trimmed.toLowerCase() !== 'no';
}

// Pagination variables
let currentPage = 0;
const cardsPerPage = 20;
let allFundingCards = [];
let filteredFundingCards = [];

// Reset filters function
function resetFilters() {
  document.querySelectorAll('.filter-option.selected').forEach(option => {
    option.classList.remove('selected');
    option.querySelector('.check-indicator').textContent = '';
  });
  filteredFundingCards = [...allFundingCards];
  currentPage = 0;
  displayFundingCards(currentPage);
}

// Get selected filters
function getSelectedFilters() {
  const selected = { sector: [], type: [], target: [] };
  
  document.querySelectorAll('.filter-option.selected').forEach(option => {
    const category = option.dataset.category;
    const value = option.dataset.value;
    if (category && value && selected[category]) {
      selected[category].push(value);
    }
  });
  
  return selected;
}

// Apply filters function
function applyFilters() {
  const selectedFilters = getSelectedFilters();
  
  // If no filters are selected, show all valid cards
  if (Object.values(selectedFilters).every(arr => arr.length === 0)) {
    filteredFundingCards = [...allFundingCards];
    displayFundingCards(0);
    return;
  }

  filteredFundingCards = allFundingCards.filter(card => {
    const data = JSON.parse(card.dataset.fundingData);
    
    // Check sector filters (only if any sector is selected)
    if (selectedFilters.sector.length > 0) {
      const sectorValid = selectedFilters.sector.some(sector => {
        const fieldName = fieldMappings.sector[sector];
        return isValidFieldValue(data[fieldName]);
      });
      if (!sectorValid) return false;
    }
    
    // Check funding type filters (only if any type is selected)
    if (selectedFilters.type.length > 0) {
      const typeValid = selectedFilters.type.some(type => {
        const fieldName = fieldMappings.type[type];
        return isValidFieldValue(data[fieldName]);
      });
      if (!typeValid) return false;
    }
    
    // Check target filters (only if any target is selected)
    if (selectedFilters.target.length > 0) {
      const targetValid = selectedFilters.target.some(target => {
        const fieldName = fieldMappings.target[target];
        if (target === 'non-smme') {
          return !isValidFieldValue(data[fieldName]);
        }
        return isValidFieldValue(data[fieldName]);
      });
      if (!targetValid) return false;
    }
    
    return true;
  });

  currentPage = 0;
  displayFundingCards(currentPage);
}

// Display funding cards with pagination
function displayFundingCards(page) {
  const container = document.getElementById('funding-results');
  container.innerHTML = '';

  const startIdx = page * cardsPerPage;
  const endIdx = startIdx + cardsPerPage;
  const cardsToDisplay = filteredFundingCards.slice(startIdx, endIdx);

  if (cardsToDisplay.length === 0) {
    displayTrustedSources();
    return;
  }

  cardsToDisplay.forEach(card => {
    container.appendChild(card.cloneNode(true));
  });

  // Pagination controls
  const totalPages = Math.ceil(filteredFundingCards.length / cardsPerPage);
  if (totalPages > 1) {
    const paginationDiv = document.createElement('div');
    paginationDiv.className = 'col-span-full flex justify-center items-center mt-8 gap-4';
    
    if (currentPage > 0) {
      const prevButton = document.createElement('button');
      prevButton.className = 'px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700';
      prevButton.textContent = 'Previous';
      prevButton.addEventListener('click', () => {
        currentPage--;
        displayFundingCards(currentPage);
      });
      paginationDiv.appendChild(prevButton);
    }

    const pageInfo = document.createElement('span');
    pageInfo.className = 'text-white-700';
    pageInfo.textContent = `Page ${currentPage + 1} of ${totalPages}`;
    paginationDiv.appendChild(pageInfo);

    if (currentPage < totalPages - 1) {
      const nextButton = document.createElement('button');
      nextButton.className = 'px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700';
      nextButton.textContent = 'Next';
      nextButton.addEventListener('click', () => {
        currentPage++;
        displayFundingCards(currentPage);
      });
      paginationDiv.appendChild(nextButton);
    }

    container.appendChild(paginationDiv);
  }
}

// Load funding cards from Firestore
async function loadFundingCards() {
  const snapshot = await db.collection("funding").get();
  allFundingCards = [];

  snapshot.forEach(doc => {
    const data = doc.data();
    const name = data["Name of disbursment channel"];
    
    // Skip records with invalid names
    if (!name || name.trim().toLowerCase() === "no" || name.trim() === "") return;

    const type = data["Type of Disbursement Channel"] || "Unspecified";
    const website = normalizeURL(data["Website"]);
    const domain = getDomain(website);
    const logo = domain ? `https://logo.clearbit.com/${domain}` : "https://via.placeholder.com/64";

    const card = document.createElement("div");
    card.className = "bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:border-teal-600 transition-colors";
    card.innerHTML = `
      <div class="flex items-start">
        <img src="${logo}" alt="Logo" class="w-12 h-12 rounded-md object-contain mr-4" onerror="this.src='https://via.placeholder.com/64'" />
        <div class="flex-1">
          <h3 class="text-lg font-medium text-gray-900">${name}</h3>
          <p class="text-sm text-gray-500 mt-1">${type}</p>
          ${website ? `
          <div class="mt-4">
            <a href="${website}" target="_blank" class="inline-flex items-center text-sm font-medium text-teal-600 hover:text-teal-800">
              <i class="bi bi-box-arrow-up-right mr-1"></i> Visit Website
            </a>
          </div>
          ` : ''}
        </div>
      </div>
    `;

    card.dataset.fundingData = JSON.stringify(data);
    allFundingCards.push(card);
  });

  filteredFundingCards = [...allFundingCards];
  displayFundingCards(currentPage);
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
  // Set up filter option click handlers
  document.querySelectorAll('.filter-option').forEach(option => {
    option.addEventListener('click', function() {
      this.classList.toggle('selected');
      const indicator = this.querySelector('.check-indicator');
      indicator.textContent = this.classList.contains('selected') ? '✓' : '';
    });
  });
  
  // Load initial data
  loadFundingCards();
});