const firebaseConfig = {
  apiKey: "AIzaSyCfa827mvCLf1ETts6B_DmCfb7owTohBxk",
  authDomain: "nbi-green-economy.firebaseapp.com",
  projectId: "nbi-green-economy",
  storageBucket: "nbi-green-economy.firebasestorage.app",
  messagingSenderId: "53732340059",
  appId: "1:53732340059:web:3fb3f086c6662e1e9baa7e",
  measurementId: "G-37VRZ5CGE4"
};

console.log("Initializing Firebase...");
try {
  const app = firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  const db = firebase.firestore();
  console.log("Firebase initialized successfully");

  const loader = document.getElementById('loader');
  const loaderOverlay = document.getElementById('loader-overlay');

  function showLoader() {
    if (loader && loaderOverlay) {
      loader.style.display = 'block';
      loaderOverlay.style.display = 'block';
    } else {
      console.error("Loader elements not found");
    }
  }

  function hideLoader() {
    if (loader && loaderOverlay) {
      loader.style.display = 'none';
      loaderOverlay.style.display = 'none';
    } else {
      console.error("Loader elements not found");
    }
  }

  function trackInteraction(userId, category, action, label = "") {
    db.collection('interactions').add({
      userId: userId || `anonymous_${Date.now()}`,
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

  async function hashCode(code) {
    const encoder = new TextEncoder();
    const data = encoder.encode(code);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded for VerifyCode page");

    const verifyBtn = document.getElementById('verify-btn');
    const errorMessage = document.getElementById('error-message');
    if (!verifyBtn || !errorMessage) {
      console.error("Verify button or error-message element not found");
      return;
    }

    verifyBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      const code = document.getElementById('verification-code')?.value.trim();
      const email = window.localStorage.getItem('adminEmail');
      if (!code || !email) {
        errorMessage.textContent = "Code or email not found.";
        errorMessage.classList.remove('hidden');
        setTimeout(() => errorMessage.classList.add('hidden'), 5000);
        return;
      }

      showLoader();
      trackInteraction(null, 'verify', 'attempt', `Email: ${email}`);

      try {
        const codeHash = await hashCode(code);
        const querySnapshot = await db.collection('verification_codes')
          .where('email', '==', email)
          .where('codeHash', '==', codeHash)
          .where('expiresAt', '>=', new Date())
          .orderBy('expiresAt', 'desc')
          .limit(1)
          .get();

        if (querySnapshot.empty) {
          hideLoader();
          errorMessage.textContent = "Invalid or expired verification code.";
          errorMessage.classList.remove('hidden');
          setTimeout(() => errorMessage.classList.add('hidden'), 5000);
          trackInteraction(null, 'verify', 'failure', 'Invalid or expired code');
          return;
        }

        const userCredential = await auth.signInWithEmailAndPassword(email, 'temporaryPassword'); // Use a temporary password
        const user = userCredential.user;
        await db.collection('users').doc(user.uid).set({
          userId: user.uid,
          email: user.email,
          isAdmin: true,
          language: document.documentElement.lang || 'en',
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });

        await querySnapshot.docs[0].ref.delete(); // Delete used code
        window.localStorage.removeItem('adminEmail');
        console.log("User authenticated and admin status set");
        trackInteraction(user.uid, 'verify', 'success', `Email: ${email}`);
        hideLoader();
        window.location.href = '/ADMIN/admin-dashboard.html?userId=' + user.uid;
      } catch (error) {
        hideLoader();
        console.error("Verification error:", error);
        trackInteraction(null, 'verify', 'failure', error.message);
        errorMessage.textContent = error.message;
        errorMessage.classList.remove('hidden');
        setTimeout(() => errorMessage.classList.add('hidden'), 5000);
      }
    });

    if (typeof updateLanguage === 'function') {
      updateLanguage(document.documentElement.lang || 'en');
    }
    trackInteraction(null, 'page', 'loaded', 'VerifyCode page');
  });
} catch (error) {
  console.error("Firebase initialization failed:", error);
  const errorMessage = document.getElementById('error-message');
  if (errorMessage) {
    errorMessage.textContent = "Firebase initialization failed: " + error.message;
    errorMessage.classList.remove('hidden');
    setTimeout(() => errorMessage.classList.add('hidden'), 5000);
  }
  hideLoader();
}
