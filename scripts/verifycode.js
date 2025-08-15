const firebaseConfig = {
  apiKey: "AIzaSyCfa827mvCLf1ETts6B_DmCfb7owTohBxk",
  authDomain: "nbi-green-economy.firebaseapp.com",
  projectId: "nbi-green-economy",
  storageBucket: "nbi-green-economy.firebasestorage.app",
  messagingSenderId: "53732340059",
  appId: "1:53732340059:web:3fb3f086c6662e1e9baa7e",
  measurementId: "G-37VRZ5CGE4"
};

console.log("Initializing Firebase at 10:37 PM SAST, Aug 15, 2025...");
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

  const HARDCODED_CODE = 'K7mP!qR9@wT#xY'; // Hardcoded 14-character verification code and password

  async function hashCode(code) {
    const encoder = new TextEncoder();
    const data = encoder.encode(code);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded for VerifyCode page at 10:37 PM SAST, Aug 15, 2025");

    const verifyBtn = document.getElementById('verify-btn');
    const errorMessage = document.getElementById('error-message');
    if (!verifyBtn || !errorMessage) {
      console.error("Verify button or error-message element not found");
      return;
    }

    // Get email from URL query parameter or localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email') || window.localStorage.getItem('adminEmail');

    if (!email || email !== 'nbigreeneconomy@gmail.com') {
      errorMessage.textContent = "Invalid or unauthorized email.";
      errorMessage.classList.remove('hidden');
      setTimeout(() => errorMessage.classList.add('hidden'), 5000);
      return;
    }

    verifyBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      const code = document.getElementById('verification-code')?.value.trim();
      if (!code) {
        errorMessage.textContent = "Please enter the verification code.";
        errorMessage.classList.remove('hidden');
        setTimeout(() => errorMessage.classList.add('hidden'), 5000);
        return;
      }

      showLoader();
      trackInteraction(null, 'verify', 'attempt', `Email: ${email}`);

      try {
        const codeHash = await hashCode(code);
        const codeDoc = await db.collection('verification_codes').doc(email).get();

        if (!codeDoc.exists || codeDoc.data().codeHash !== codeHash || codeDoc.data().expiresAt.toDate() < new Date()) {
          hideLoader();
          errorMessage.textContent = "Invalid or expired verification code.";
          errorMessage.classList.remove('hidden');
          setTimeout(() => errorMessage.classList.add('hidden'), 5000);
          trackInteraction(null, 'verify', 'failure', 'Invalid or expired code');
          return;
        }

        // Store the hashed password in the authentication collection
        const passwordHash = await hashCode(HARDCODED_CODE);
        await db.collection('authentication').doc(email).set({
          email: email,
          passwordHash: passwordHash,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });

        // Sign in or create the admin user using the hardcoded password
        let userCredential;
        try {
          userCredential = await auth.signInWithEmailAndPassword(email, HARDCODED_CODE);
          console.log("User signed in with stored password");
        } catch (error) {
          if (error.code === 'auth/user-not-found') {
            userCredential = await auth.createUserWithEmailAndPassword(email, HARDCODED_CODE);
            console.log("User created with hardcoded password");
          } else if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
            // Update the password if it exists but is incorrect
            const user = auth.currentUser;
            if (user) {
              await user.updatePassword(HARDCODED_CODE);
              userCredential = await auth.signInWithEmailAndPassword(email, HARDCODED_CODE);
              console.log("Password updated and user signed in");
            } else {
              await auth.sendPasswordResetEmail(email);
              hideLoader();
              errorMessage.textContent = "Password issue detected. A password reset email has been sent.";
              errorMessage.classList.remove('hidden');
              setTimeout(() => errorMessage.classList.add('hidden'), 5000);
              trackInteraction(null, 'verify', 'failure', 'Password issue');
              return;
            }
          } else {
            throw error;
          }
        }

        const user = userCredential.user;
        await db.collection('users').doc(user.uid).set({
          userId: user.uid,
          email: user.email,
          isAdmin: true,
          language: document.documentElement.lang || 'en',
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });

        await db.collection('verification_codes').doc(email).delete(); // Delete used code
        window.localStorage.removeItem('adminEmail');
        window.localStorage.removeItem('verificationPending');
        console.log("User authenticated and admin status set");
        trackInteraction(user.uid, 'verify', 'success', `Email: ${email}`);
        hideLoader();
        window.location.href = '/ADMIN/admin-dashboard.html?userId=' + user.uid;
      } catch (error) {
        hideLoader();
        console.error("Verification error:", error);
        trackInteraction(null, 'verify', 'failure', error.message);
        errorMessage.textContent = error.message || "Verification failed.";
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