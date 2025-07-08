        // Firebase Config
        const firebaseConfig = {
            apiKey: "AIzaSyAIlr8Y249Yu_1JPbUjNX7cQtJYlkbV3eY",
            authDomain: "nbi-database.firebaseapp.com",
            projectId: "nbi-database",
            storageBucket: "nbi-database.appspot.com",
            messagingSenderId: "497517200595",
            appId: "1:497517200595:web:c862996d49fba97baf8026",
            measurementId: "G-NHZB2WJF9L"
        };

        firebase.initializeApp(firebaseConfig);
        const db = firebase.firestore();

        // Loader Functions
        function showLoader() {
            const loader = document.getElementById('loader');
            const loaderOverlay = document.getElementById('loader-overlay');
            if (loader && loaderOverlay) {
                loader.style.display = 'block';
                loaderOverlay.style.display = 'block';
            }
        }

        function hideLoader() {
            const loader = document.getElementById('loader');
            const loaderOverlay = document.getElementById('loader-overlay');
            if (loader && loaderOverlay) {
                loader.style.display = 'none';
                loaderOverlay.style.display = 'none';
            }
        }

        // Interaction Tracking Function
        function trackUserInteraction(tempUserId, category, action, label = "") {
            db.collection('interactions').add({
                tempUserId: tempUserId,
                category: category,
                action: action,
                label: label,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                language: currentLanguage || 'en',
                userAgent: navigator.userAgent
            }).catch((error) => {
                console.error("Error logging interaction to Firestore: ", error);
            });
        }

        // Inactivity Timeout
        let inactivityTimeout;
        function resetInactivityTimer(tempUserId) {
            clearTimeout(inactivityTimeout);
            inactivityTimeout = setTimeout(async () => {
                try {
                    await db.collection('temp_users').doc(tempUserId).delete();
                    trackUserInteraction(tempUserId, 'session', 'timeout', 'Redirected to index due to inactivity');
                    window.location.href = '../index.html';
                } catch (error) {
                    console.error("Error deleting temp user:", error);
                }
            }, 4 * 60 * 1000); // 4 minutes
        }

        // Get Temporary User ID from URL
        const urlParams = new URLSearchParams(window.location.search);
        const tempUserId = urlParams.get('tempUserId');

        // Initialize Dashboard
        document.addEventListener("DOMContentLoaded", async () => {
            if (!tempUserId) {
                console.log("No temp user ID, redirecting to index...");
                showLoader();
                window.location.href = '../index.html';
                return;
            }

            try {
                const userDoc = await db.collection('temp_users').doc(tempUserId).get();
                if (!userDoc.exists) {
                    console.log("Invalid temp user ID, redirecting to index...");
                    showLoader();
                    window.location.href = '../index.html';
                    return;
                }

                trackUserInteraction(tempUserId, 'page', 'loaded', 'Dashboard page');
                resetInactivityTimer(tempUserId);

                // Track all user interactions
                document.addEventListener('click', (e) => {
                    const target = e.target.closest('button, select, input, a, .dashboard-card, .news-item, .news-category-btn, .btn');
                    if (target) {
                        trackUserInteraction(tempUserId, 'interaction', 'click', target.id || target.className || target.tagName);
                    }
                    resetInactivityTimer(tempUserId);
                });

                document.addEventListener('input', (e) => {
                    if (e.target.matches('input, select')) {
                        trackUserInteraction(tempUserId, 'interaction', 'input', `${e.target.id}: ${e.target.value}`);
                    }
                    resetInactivityTimer(tempUserId);
                });

                initializeSearch();
                initializeDashboard();
                initializeNews();
                updateLanguage(currentLanguage);
            } catch (error) {
                console.error("Error validating temp user:", error);
                window.location.href = '../index.html';
            }
        });

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
                "personas-title": "Built for Every Green Economy Participant",
                "ai-assistant-title": "AI Assistant",
                "ai-welcome": "Sawubona! Hello! Dumelang! 🌱 I'm your Green Economy AI Assistant. I can help you in isiZulu, English, or Tswana. How can I assist you with green economy opportunities today?",
                "ai-input-placeholder": "Ask me about green economy opportunities..."
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
                "personas-title": "Yakhelwe Bonke Abahlanganyeli Bomnotho Oluhlaza",
                "ai-assistant-title": "Umsizi we-AI",
                "ai-welcome": "Sawubona! 🌱 NginguMsizi wakho we-AI womnotho oluhlaza. Ngingakusiza ngesiZulu, isiNgisi, noma isiTswana. Ngingakusiza kanjani namathuba omnotho oluhlaza namuhla?",
                "ai-input-placeholder": "Ngibuze ngamathuba omnotho oluhlaza..."
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
                "personas-title": "E Agilwe Batšeakarolo Botlhe ba Ikonomi e Tala",
                "ai-assistant-title": "Mothusi wa AI",
                "ai-welcome": "Dumelang! 🌱 Ke Mothusi wa gago wa AI wa ikonomi e tala. Nka go thuša ka Setswana, Sekgowa kgotsa isiZulu. Nka go thuša jang ka ditšhono tsa ikonomi e tala gompieno?",
                "ai-input-placeholder": "Mpotse ka ditšhono tsa ikonomi e tala..."
            }
        };

        let newsData = [];
        let currentLanguage = "en";
        let currentNewsCategory = "all";
        let displayedNewsCount = 4;
        let chatMessages = [];
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

        function initializeDashboard() {
            const dashboardCards = document.querySelectorAll(".dashboard-card");
            dashboardCards.forEach((card) => {
                card.removeEventListener("click", handleCardClick);
                card.addEventListener("click", handleCardClick);
            });
        }

        function handleCardClick(event) {
            event.preventDefault();
            event.stopPropagation();
            const section = this.getAttribute("data-section");
            navigateToSection(section);
        }

        function navigateToSection(section) {
            trackUserInteraction(tempUserId, "navigation", `click_${section}`);
            const paths = {
                funding: "../Funding Hub/Funding-Hub.html",
                smme: "../SMME/smme.html",
                toolkits: "../ToolKits/toolkits.html",
                legal: "../Legal/legal.html"
            };
            if (paths[section]) {
                showLoader();
                fetch(paths[section], { method: 'HEAD' })
                    .then(response => {
                        if (response.ok) {
                            window.location.href = `${paths[section]}?tempUserId=${tempUserId}`;
                        } else {
                            console.error(`Navigation failed: ${paths[section]} not found`);
                            displayErrorMessage(`Cannot navigate to ${section}: Page not found.`);
                            hideLoader();
                        }
                    })
                    .catch(error => {
                        console.error(`Navigation error for ${section}:`, error);
                        displayErrorMessage(`Navigation error: Unable to access ${section}.`);
                        hideLoader();
                    });
            } else {
                displayErrorMessage("Navigation error: Section not found.");
                hideLoader();
            }
        }

        async function initializeNews() {
            const newsGrid = document.getElementById("newsGrid");
            if (!newsGrid) return;
            await fetchNews();
            renderNews();
            setupNewsEventListeners();
            // Only set interval if News API is enabled
            const apiDoc = await db.collection('apis').doc('news-api').get();
            if (apiDoc.exists && apiDoc.data().enabled) {
                setInterval(updateNews, 30000);
            }
        }

        async function fetchNews() {
            try {
                showLoader();
                
                // Check if News API is enabled in Firestore
                const apiDoc = await db.collection('apis').doc('news-api').get();
                if (!apiDoc.exists || !apiDoc.data().enabled) {
                    newsData = [];
                    displayErrorMessage("News API is disabled. Please enable it in API Management.");
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

        function displayErrorMessage(message) {
            const newsGrid = document.getElementById("newsGrid");
            if (!newsGrid) return;
            const errorDiv = document.createElement("div");
            errorDiv.className = "news-error";
            errorDiv.style = "color: red; text-align: center; padding: 1rem; font-weight: 500;";
            errorDiv.textContent = message;
            newsGrid.prepend(errorDiv);
            setTimeout(() => errorDiv.remove(), 5000);
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

        async function updateNews() {
            const apiDoc = await db.collection('apis').doc('news-api').get();
            if (!apiDoc.exists || !apiDoc.data().enabled) {
                newsData = [];
                renderNews();
                displayErrorMessage("News API is disabled. Auto-refresh stopped.");
                return;
            }
            await fetchNews();
            renderNews();
            trackUserInteraction(tempUserId, "news", "auto_update");
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

        function openAIAssistant() {
            const modal = document.getElementById("aiModal");
            if (modal) {
                modal.style.display = "flex";
                trackUserInteraction(tempUserId, "ai_assistant", "opened");
            }
        }

        function closeAIAssistant() {
            const modal = document.getElementById("aiModal");
            if (modal) {
                modal.style.display = "none";
                trackUserInteraction(tempUserId, "ai_assistant", "closed");
            }
        }

        function sendMessage() {
            const input = document.getElementById("chatInput");
            if (!input) return;
            const message = input.value.trim();
            if (!message) return;

            addMessage(message, "user");
            input.value = "";
            trackUserInteraction(tempUserId, "ai_chat", "message_sent");

            setTimeout(() => {
                const aiResponse = generateAIResponse(message);
                addMessage(aiResponse, "ai");
            }, 1000);
        }

        function addMessage(content, sender) {
            const messagesContainer = document.getElementById("chatMessages");
            if (!messagesContainer) return;
            const messageDiv = document.createElement("div");
            messageDiv.className = `message ${sender}`;
            messageDiv.innerHTML = `<div class="message-content">${content}</div>`;
            messagesContainer.appendChild(messageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            chatMessages.push({ content, sender, timestamp: new Date() });
        }

        function generateAIResponse(userMessage) {
            const responses = {
                en: [
                    "I can help you find green funding opportunities. What type of project are you working on?",
                    "Let me connect you with relevant SMME businesses in your area. What industry are you interested in?",
                    "I can guide you to the right sustainability toolkit. What environmental challenge are you facing?",
                    "Great question! I can help you understand the legal requirements for green business certification."
                ],
                zu: [
                    "Ngingakusiza ukuthola amathuba ezimali eziluhlaza. Yiluphi uhlobo lwephrojekthi osebenza ngalo?",
                    "Ake ngikuxhumanise namabhizinisi afanele endaweni yakho. Yimuphi umkhakha onomdla ngawo?",
                    "Ngingakuqondisa kutulusi efanele. Yiyiphi inselelo yendalo obhekane nayo?",
                    "Umbuzo omuhle! Ngingakusiza ukuqonda izidingo zomthetho zokuqinisekisa ibhizinisi eliluhlaza."
                ],
                tn: [
                    "Nka go thuša go bona ditšhono tsa madi a tala. Ke morojwa ofe o o sebetsang ka ona?",
                    "A ke go golagane le dikgwebo tše di maleba mo kgaolong ya gago. Ke intasteri efe e o nang le kgatlhego go yona?",
                    "Nka go dira gore o itekanele le sebereka se se maleba. Ke tlhohlo efe ya tikologo e o lebaneng le yona?",
                    "Potšišo e botse! Nka go thuša go tlhaloganya ditlhokwa tsa semolao tsa netefatso ya dikgwebo tše di tala."
                ]
            };
            const langResponses = responses[currentLanguage] || responses.en;
            return langResponses[Math.floor(Math.random() * langResponses.length)];
        }

        document.addEventListener("DOMContentLoaded", function () {
            const chatInput = document.getElementById("chatInput");
            if (chatInput) {
                chatInput.addEventListener("keypress", function (e) {
                    if (e.key === "Enter") {
                        sendMessage();
                    }
                });
            }

            window.addEventListener("click", function (e) {
                const modal = document.getElementById("aiModal");
                if (e.target === modal) {
                    closeAIAssistant();
                }
            });

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