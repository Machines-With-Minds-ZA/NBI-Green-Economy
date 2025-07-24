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

        // Initialize Firebase
        const app = firebase.initializeApp(firebaseConfig);
        const auth = firebase.auth();
        const db = firebase.firestore();
        const googleProvider = new firebase.auth.GoogleAuthProvider();

        // Loader Functions
        const loader = document.getElementById('loader');
        const loaderOverlay = document.getElementById('loader-overlay');

        function showLoader() {
            if (loader && loaderOverlay) {
                loader.style.display = 'block';
                loaderOverlay.style.display = 'block';
            }
        }

        function hideLoader() {
            if (loader && loaderOverlay) {
                loader.style.display = 'none';
                loaderOverlay.style.display = 'none';
            }
        }

        // Interaction Tracking
        function trackInteraction(category, action, label = "") {
            const user = auth.currentUser;
            const tempUserId = user ? `temp_${user.uid}_${Date.now()}` : `anonymous_${Date.now()}`;
            db.collection('interactions').add({
                userId: user ? user.uid : tempUserId,
                category: category,
                action: action,
                label: label,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                language: document.documentElement.lang || 'en',
                userAgent: navigator.userAgent
            }).catch(error => {
                console.error("Error logging interaction:", error);
            });
        }

        // Set session persistence and monitor auth state
        if (firebase.apps.length) {
            auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
                .then(() => {
                    console.log("Persistence set to LOCAL");
                    // Monitor auth state
                    auth.onAuthStateChanged(user => {
                        console.log("Auth state changed:", user ? `User ${user.email} logged in` : "No user logged in");
                        if (user) {
                            // User is signed in, redirect to api-management
                            const tempUserId = `temp_${user.uid}_${Date.now()}`;
                            console.log("Writing temp_users doc with ID:", tempUserId);
                            db.collection('temp_users').doc(tempUserId).set({
                                userId: user.uid,
                                email: user.email,
                                isAdmin: true,
                                language: document.documentElement.lang || 'en',
                                createdAt: firebase.firestore.FieldValue.serverTimestamp()
                            }, { merge: true }).then(() => {
                                console.log("temp_users doc written successfully");
                                console.log("Redirect URL:", `../../api-management/api-management.html?tempUserId=${tempUserId}`);
                                window.location.href = `../../api-management/api-management.html?tempUserId=${tempUserId}`;
                            }).catch(error => {
                                console.error("Error writing temp_users doc:", error);
                                document.getElementById('error-message').textContent = "Failed to save user data: " + error.message;
                                document.getElementById('error-message').classList.remove('hidden');
                                setTimeout(() => document.getElementById('error-message').classList.add('hidden'), 5000);
                            });
                        }
                    });
                })
                .catch(error => {
                    console.error("Error setting persistence:", error);
                    document.getElementById('error-message').textContent = "Failed to initialize session: " + error.message;
                    document.getElementById('error-message').classList.remove('hidden');
                    setTimeout(() => document.getElementById('error-message').classList.add('hidden'), 5000);
                });
        } else {
            console.error("Firebase initialization failed");
            document.getElementById('error-message').textContent = "Firebase initialization failed";
            document.getElementById('error-message').classList.remove('hidden');
            setTimeout(() => document.getElementById('error-message').classList.add('hidden'), 5000);
        }

        // Email Sign In
        document.getElementById('sign-in-btn').addEventListener('click', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const errorMessage = document.getElementById('error-message');
            trackInteraction('login', 'attempt', `Email: ${email}`);
            showLoader();
            try {
                const userCredential = await auth.signInWithEmailAndPassword(email, password);
                const user = userCredential.user;
                console.log("Sign-in successful, user:", user.email);
                trackInteraction('login', 'success', `Email: ${email}`);
            } catch (error) {
                hideLoader();
                console.error("Sign-in error:", error);
                trackInteraction('login', 'failure', error.message);
                errorMessage.textContent = error.message;
                errorMessage.classList.remove('hidden');
                setTimeout(() => errorMessage.classList.add('hidden'), 5000);
            }
        });

        // Google Sign In
        document.getElementById('google-sign-in-btn').addEventListener('click', async (e) => {
            e.preventDefault();
            trackInteraction('login', 'attempt', 'Google');
            showLoader();
            try {
                const userCredential = await auth.signInWithPopup(googleProvider);
                const user = userCredential.user;
                console.log("Google sign-in successful, user:", user.email);
                trackInteraction('login', 'success', 'Google');
            } catch (error) {
                hideLoader();
                console.error("Google sign-in error:", error);
                trackInteraction('login', 'failure', error.message);
                errorMessage.textContent = error.message;
                errorMessage.classList.remove('hidden');
                setTimeout(() => errorMessage.classList.add('hidden'), 5000);
            }
        });

        // Initialize
        document.addEventListener('DOMContentLoaded', () => {
            if (typeof updateLanguage === 'function') {
                updateLanguage(document.documentElement.lang || 'en');
            }
            trackInteraction('page', 'loaded', 'SignIn page');
        });