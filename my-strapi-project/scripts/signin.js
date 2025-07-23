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
    console.log(`Interaction: ${category}, ${action}, ${label}`);
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
        const response = await axios.post('http://localhost:1337/api/auth/local', {
            identifier: email,
            password: password
        });

        const { jwt, user } = response.data;
        localStorage.setItem('jwt', jwt);
        console.log("Sign-in successful, user:", user.email);
        trackInteraction('login', 'success', `Email: ${email}`);

        setTimeout(() => {
            hideLoader();
            window.location.href = '../../Dashboard/dashboard.html?userId=' + user.id;
        }, 2000);
    } catch (error) {
        hideLoader();
        console.error("Sign-in error:", error.response?.data?.error?.message || error.message);
        trackInteraction('login', 'failure', error.response?.data?.error?.message || error.message);
        errorMessage.textContent = error.response?.data?.error?.message || "Sign-in failed";
        errorMessage.classList.remove('hidden');
        setTimeout(() => errorMessage.classList.add('hidden'), 5000);
    }
});

// Google Sign In
document.getElementById('google-sign-in-btn').addEventListener('click', async (e) => {
    e.preventDefault();
    trackInteraction('login', 'attempt', 'Google');
    showLoader();
    window.location.href = 'http://localhost:1337/connect/google';
});

// Monitor Auth State
document.addEventListener('DOMContentLoaded', () => {
    console.log("SignIn.js DOMContentLoaded event triggered");
    if (typeof updateLanguage === 'function') {
        updateLanguage(document.documentElement.lang || 'en');
    }
    trackInteraction('page', 'loaded', 'SignIn page');

    const urlParams = new URLSearchParams(window.location.search);
    const fromSignup = urlParams.get('fromSignup');
    console.log("fromSignup parameter:", fromSignup);

    if (fromSignup === 'true') {
        console.log("Clearing JWT due to fromSignup=true");
        localStorage.removeItem('jwt');
        return;
    }

    const jwt = localStorage.getItem('jwt');
    if (jwt) {
        console.log("JWT found, checking user...");
        axios.get('http://localhost:1337/api/users/me', {
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        }).then(response => {
            console.log("User already logged in:", response.data.email);
            window.location.href = '../../Dashboard/dashboard.html?userId=' + response.data.id;
        }).catch(error => {
            console.error("Invalid JWT, clearing:", error);
            localStorage.removeItem('jwt');
            console.log("Staying on SignIn page after clearing invalid JWT");
        });
    } else {
        console.log("No JWT found, staying on SignIn page");
    }
});