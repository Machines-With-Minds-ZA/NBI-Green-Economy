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
        const auth = firebase.auth();

        // Translations
        window.translations = {
            en: {
                "api-management-title": "API Management",
                "api-management-subtitle": "Manage and configure API integrations for the Green Economy Toolkit.",
                "api-management-section-title": "API Configurations",
                "export-logs": "Export Interaction Logs",
                "news-api-title": "News API",
                "news-api-desc": "Fetches real-time green economy news from NewsAPI.",
                "funding-api-title": "Funding Hub API",
                "funding-api-desc": "Provides funding opportunities for the Funding Hub.",
                "smme-api-title": "SMME Directory API",
                "smme-api-desc": "Manages SMME business profiles and certifications."
            },
            zu: {
                "api-management-title": "Ukuphatha i-API",
                "api-management-subtitle": "Phatha futhi uhlele ukuhlanganiswa kwe-API ye-Green Economy Toolkit.",
                "api-management-section-title": "Ukuhlelwa kwe-API",
                "export-logs": "Thumela Ngaphandle Amalogi Okuxhumana",
                "news-api-title": "I-API Yezindaba",
                "news-api-desc": "Ilanda izindaba zesikhathi sangempela zomnotho oluhlaza kusuka ku-NewsAPI.",
                "funding-api-title": "I-API Yendawo Yezimali",
                "funding-api-desc": "Inikeza amathuba ezimali e-Hub Yezimali.",
                "smme-api-title": "I-API Yohlu Lwamabhizinisi Amancane",
                "smme-api-desc": "Iphatha amaphrofayela amabhizinisi e-SMME kanye nezitifiketi."
            },
            tn: {
                "api-management-title": "Tsamaiso ya API",
                "api-management-subtitle": "Tsamaisa le go rulaganya dikgolagano tsa API tsa Green Economy Toolkit.",
                "api-management-section-title": "Dipeelano tsa API",
                "export-logs": "Romela kwa ntle Ditlaleletso tsa Tirisano",
                "news-api-title": "API ya Ditaba",
                "news-api-desc": "E tseela ditaba tsa nako ya nnete tsa ikonomi e tala go tswa kwa NewsAPI.",
                "funding-api-title": "API ya Lefelo la Madi",
                "funding-api-desc": "E naya ditšhono tsa madi a tala bakeng sa Lefelo la Madi.",
                "smme-api-title": "API ya Lenaane la Dikgwebo Dinnye",
                "smme-api-desc": "E tsamaisa diprofaele tsa dikgwebo tsa SMME le dinetefatso."
            }
        };

        let currentLanguage = "en";
        const urlParams = new URLSearchParams(window.location.search);
        const tempUserId = urlParams.get('tempUserId');

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

        // Interaction Tracking
        function trackUserInteraction(tempUserId, category, action, label = "") {
            db.collection('interactions').add({
                tempUserId: tempUserId,
                category: category,
                action: action,
                label: label,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                language: currentLanguage || 'en',
                userAgent: navigator.userAgent
            }).catch(error => {
                console.error("Error logging interaction:", error);
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
                    window.location.href = '../../index.html';
                } catch (error) {
                    console.error("Error deleting temp user:", error);
                }
            }, 4 * 60 * 1000); // 4 minutes
        }

        // Update Language
        function updateLanguage(lang) {
            currentLanguage = lang;
            const elements = document.querySelectorAll("[data-translate]");
            elements.forEach(element => {
                const key = element.getAttribute("data-translate");
                if (window.translations[lang] && window.translations[lang][key]) {
                    element.textContent = window.translations[lang][key];
                }
            });
        }

        // Initialize APIs
        const sampleApis = [
            {
                id: "news-api",
                title: "news-api-title",
                description: "news-api-desc",
                endpoint: "https://newsapi.org/v2/everything",
                key: "e00b07155a6c49aa90b8f84ad3115ec1",
                enabled: true
            },
            {
                id: "funding-api",
                title: "funding-api-title",
                description: "funding-api-desc",
                endpoint: "https://api.green-economy-example.com/v1/funding-opportunities",
                key: "",
                enabled: false
            },
            {
                id: "smme-api",
                title: "smme-api-title",
                description: "smme-api-desc",
                endpoint: "https://api.green-economy-example.com/v1/smme-directory",
                key: "",
                enabled: false
            }
        ];

        async function initializeApiManagement() {
            showLoader();
            const apiGrid = document.getElementById("apiGrid");
            if (!apiGrid) {
                console.error("API Grid element not found");
                hideLoader();
                return;
            }

            try {
                // Wait for auth state to resolve
                await new Promise((resolve, reject) => {
                    const unsubscribe = auth.onAuthStateChanged(user => {
                        unsubscribe(); // Unsubscribe after first call
                        if (user) {
                            console.log("User authenticated:", user.email);
                            resolve(user);
                        } else {
                            console.log("No authenticated user, redirecting to sign-in...");
                            //window.location.href = '../LADINGPAGES/SignAndSignUp/SignIn.html';
                            reject(new Error("No authenticated user"));
                        }
                    }, reject);
                });

                // Check admin access
                const userDoc = await db.collection('temp_users').doc(tempUserId).get();
                if (!userDoc.exists) {
                    console.log("User document not found, redirecting to sign-in...");
                    displayErrorMessage("User not found. Please sign in again.");
                    setTimeout(() => {
                        //window.location.href = '../LADINGPAGES/SignAndSignUp/SignIn.html';
                    }, 3000);
                    return;
                }
                if (!userDoc.data().isAdmin) {
                    console.log("Access denied: Admin privileges required.");
                    displayErrorMessage("Access denied: Admin privileges required.");
                    setTimeout(() => {
                        //window.location.href = '../Dashboard/dashboard.html?tempUserId=' + tempUserId;
                    }, 3000);
                    return;
                }

                // Fetch APIs from Firestore or use sampleApis
                let apis = [];
                const apiSnapshot = await db.collection('apis').get();
                if (apiSnapshot.empty) {
                    for (const api of sampleApis) {
                        await db.collection('apis').doc(api.id).set(api);
                    }
                    apis = sampleApis;
                } else {
                    apiSnapshot.forEach(doc => apis.push(doc.data()));
                }

                // Render APIs
                apiGrid.innerHTML = apis.map(api => `
                    <div class="api-card">
                        <h3 class="api-title" data-translate="${api.title}">${window.translations[currentLanguage][api.title]}</h3>
                        <p class="api-description" data-translate="${api.description}">${window.translations[currentLanguage][api.description]}</p>
                        <div class="api-toggle">
                            <label class="api-toggle-label">${api.enabled ? 'Enabled' : 'Disabled'}</label>
                            <label class="api-toggle-switch">
                                <input type="checkbox" ${api.enabled ? 'checked' : ''} data-api-id="${api.id}">
                                <span class="api-toggle-slider"></span>
                            </label>
                        </div>
                        <input type="text" class="api-key-input" placeholder="API Key" value="${api.key}" data-api-id="${api.id}">
                    </div>
                `).join('');

                // Add toggle event listeners
                document.querySelectorAll('.api-toggle-switch input').forEach(input => {
                    input.addEventListener('change', async (e) => {
                        const apiId = e.target.getAttribute('data-api-id');
                        const enabled = e.target.checked;
                        const label = e.target.parentElement.previousElementSibling;
                        label.textContent = enabled ? 'Enabled' : 'Disabled';
                        try {
                            await db.collection('apis').doc(apiId).update({ enabled });
                            trackUserInteraction(tempUserId, 'api', `toggle_${apiId}`, enabled ? 'Enabled' : 'Disabled');
                        } catch (error) {
                            console.error("Error updating API status:", error);
                            displayErrorMessage("Failed to update API status: " + error.message);
                        }
                    });
                });

                // Add API key update listeners
                document.querySelectorAll('.api-key-input').forEach(input => {
                    input.addEventListener('change', async (e) => {
                        const apiId = e.target.getAttribute('data-api-id');
                        const key = e.target.value.trim();
                        try {
                            await db.collection('apis').doc(apiId).update({ key });
                            trackUserInteraction(tempUserId, 'api', `update_key_${apiId}`, 'Key updated');
                        } catch (error) {
                            console.error("Error updating API key:", error);
                            displayErrorMessage("Failed to update API key: " + error.message);
                        }
                    });
                });

                // Export logs
                document.getElementById('exportLogs').addEventListener('click', async () => {
                    try {
                        const logsSnapshot = await db.collection('interactions').where('tempUserId', '==', tempUserId).get();
                        const logs = [];
                        logsSnapshot.forEach(doc => logs.push(doc.data()));
                        const blob = new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'api-interaction-logs.json';
                        a.click();
                        URL.revokeObjectURL(url);
                        trackUserInteraction(tempUserId, 'api', 'export_logs');
                    } catch (error) {
                        console.error("Error exporting logs:", error);
                        displayErrorMessage("Failed to export interaction logs: " + error.message);
                    }
                });

                trackUserInteraction(tempUserId, 'page', 'loaded', 'API Management page');
                resetInactivityTimer(tempUserId);
            } catch (error) {
                console.error("Error initializing API management:", error);
                displayErrorMessage("Initialization failed: " + error.message);
                setTimeout(() => {
                    //window.location.href = '../LADINGPAGES/SignAndSignUp/SignIn.html';
                }, 3000);
            } finally {
                hideLoader();
            }
        }

        function displayErrorMessage(message) {
            const apiGrid = document.getElementById("apiGrid");
            if (!apiGrid) return;
            const errorDiv = document.createElement("div");
            errorDiv.className = "api-error";
            errorDiv.style = "color: red; text-align: center; padding: 1rem; font-weight: 500;";
            errorDiv.textContent = message;
            apiGrid.prepend(errorDiv);
            setTimeout(() => errorDiv.remove(), 5000);
        }

        // Initialize
        document.addEventListener("DOMContentLoaded", () => {
            if (!tempUserId) {
                console.log("No temp user ID, redirecting to sign-in...");
                showLoader();
                //window.location.href = '../LADINGPAGES/SignAndSignUp/SignIn.html';
                return;
            }
            initializeApiManagement();
            if (typeof updateLanguage === 'function') {
                updateLanguage(currentLanguage);
            }
        });