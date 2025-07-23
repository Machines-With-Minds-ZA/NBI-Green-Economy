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

// Interaction Tracking (Simplified, storing locally or to Strapi later)
function trackInteraction(category, action, label = "") {
    console.log(`Interaction: ${category}, ${action}, ${label}`);
    // Optionally, store interactions in Strapi later
}

// Email Sign Up
document.getElementById('sign-up-btn').addEventListener('click', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const errorMessage = document.getElementById('error-message');

    if (password !== confirmPassword) {
        errorMessage.textContent = "Passwords do not match.";
        errorMessage.classList.remove('hidden');
        trackInteraction('signup', 'failure', 'Passwords do not match');
        setTimeout(() => errorMessage.classList.add('hidden'), 5000);
        return;
    }

    trackInteraction('signup', 'attempt', `Email: ${email}`);
    showLoader();

    try {
        const response = await axios.post('http://localhost:1337/api/auth/local/register', {
            username: email, // Strapi requires a username; using email for simplicity
            email: email,
            password: password
        });

        const { jwt, user } = response.data;
        localStorage.setItem('jwt', jwt); // Store JWT for authenticated requests
        console.log("Sign-up successful, user:", user.email);

        // Save additional user data (e.g., temp_users equivalent)
        try {
            await axios.post(
                'http://localhost:1337/api/temp-users',
                {
                    data: {
                        userId: user.id,
                        email: user.email,
                        isAdmin: true,
                        language: document.documentElement.lang || 'en',
                        createdAt: new Date().toISOString()
                    }
                },
                {
                    headers: {
                        Authorization: `Bearer ${jwt}`
                    }
                }
            );
            console.log("temp-users entry created successfully");
        } catch (error) {
            console.error("Failed to create temp-users entry:", error.response?.data?.error?.message || error.message);
        }

        trackInteraction('signup', 'success', `Email: ${email}`);
        setTimeout(() => {
            hideLoader();
            window.location.href = '../../questionnaire/questionnaire.html'; // Redirect to SignIn.html
        }, 2000);
    } catch (error) {
        hideLoader();
        console.error("Sign-up error:", error.response?.data?.error?.message || error.message);
        trackInteraction('signup', 'failure', error.response?.data?.error?.message || error.message);
        errorMessage.textContent = error.response?.data?.error?.message || "Sign-up failed";
        errorMessage.classList.remove('hidden');
        setTimeout(() => errorMessage.classList.add('hidden'), 5000);
    }
});

// Google Sign Up
document.getElementById('google-sign-up-btn').addEventListener('click', async (e) => {
    e.preventDefault();
    trackInteraction('signup', 'attempt', 'Google');
    showLoader();

    // Redirect to Strapi Google OAuth endpoint
    window.location.href = 'http://localhost:1337/connect/google';
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    if (typeof updateLanguage === 'function') {
        updateLanguage(document.documentElement.lang || 'en');
    }
    trackInteraction('page', 'loaded', 'SignUp page');
});