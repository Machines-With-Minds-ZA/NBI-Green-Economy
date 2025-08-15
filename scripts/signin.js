const firebaseConfig = {
  apiKey: "AIzaSyCfa827mvCLf1ETts6B_DmCfb7owTohBxk",
  authDomain: "nbi-green-economy.firebaseapp.com",
  projectId: "nbi-green-economy",
  storageBucket: "nbi-green-economy.firebasestorage.app",
  messagingSenderId: "53732340059",
  appId: "1:53732340059:web:3fb3f086c6662e1e9baa7e",
  measurementId: "G-37VRZ5CGE4"
};

console.log("Initializing Firebase at 11:12 PM SAST, Aug 15, 2025...");
try {
  const app = firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  const db = firebase.firestore();
  const googleProvider = new firebase.auth.GoogleAuthProvider();
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

  async function checkQuestionnaireCompletion(user) {
    try {
      const userDoc = await db.collection('users').doc(user.uid).get();
      if (userDoc.exists) {
        const data = userDoc.data();
        if (data.questionnaireCompleted && data.questionnaireResponseId) {
          const responseDoc = await db.collection('questionnaire_responses').doc(data.questionnaireResponseId).get();
          if (responseDoc.exists) {
            console.log(`User ${user.uid} has completed questionnaire with response ID: ${data.questionnaireResponseId}`);
            return true;
          } else {
            console.warn(`Questionnaire response ID ${data.questionnaireResponseId} not found, resetting completion status`);
            await db.collection('users').doc(user.uid).set({
              questionnaireCompleted: false,
              questionnaireResponseId: null
            }, { merge: true });
            return false;
          }
        }
        return false;
      }
      return false;
    } catch (error) {
      console.error("Error checking questionnaire completion:", error);
      trackInteraction(user.uid, 'error', 'check_questionnaire', error.message);
      return false;
    }
  }

  const HARDCODED_CODE = 'K7mP!qR9@wT#xY'; // Hardcoded 14-character verification code

  async function hashCode(code) {
    const encoder = new TextEncoder();
    const data = encoder.encode(code);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  async function sendAdminVerificationEmail(email, signInBtn) {
    try {
      // Check if the admin user exists, or create a temporary user
      let user;
      try {
        const userCredential = await auth.signInWithEmailAndPassword(email, HARDCODED_CODE);
        user = userCredential.user;
      } catch (error) {
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
          // If user doesn't exist or password is incorrect, create a temporary user
          const userCredential = await auth.createUserWithEmailAndPassword(email, HARDCODED_CODE);
          user = userCredential.user;
        } else {
          throw error;
        }
      }

      signInBtn.disabled = true;
      signInBtn.textContent = 'Verification Sent';
      signInBtn.style.backgroundColor = '#9CA3AF'; // Grey out button
      window.localStorage.setItem('verificationPending', 'true');
      window.localStorage.setItem('adminEmail', email);

      // Store the hashed code in Firestore
      const codeHash = await hashCode(HARDCODED_CODE);
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
      await db.collection('verification_codes').doc(email).set({
        email: email,
        codeHash: codeHash,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        expiresAt: expiresAt
      }, { merge: true });

      // Send email with custom verification link
      const actionCodeSettings = {
        url: `http://127.0.0.1:5504/VerifyCode.html?email=${encodeURIComponent(email)}&enableButton=true`,
        handleCodeInApp: true
      };
      await user.sendEmailVerification(actionCodeSettings);
      console.log(`Verification email sent to ${email} at 11:12 PM SAST, Aug 15, 2025`);

      hideLoader();
      const errorMessage = document.getElementById('error-message');
      if (errorMessage) {
        errorMessage.textContent = "A verification code has been sent to your email. Please check and click the link to enable the button.";
        errorMessage.classList.remove('hidden');
        setTimeout(() => errorMessage.classList.add('hidden'), 5000);
      }
      trackInteraction(null, 'login', 'code_sent', `Email: ${email}`);
      // Redirect to VerifyCode.html
      window.location.href = `VerifyCode.html?email=${encodeURIComponent(email)}`;
    } catch (error) {
      hideLoader();
      signInBtn.disabled = false;
      signInBtn.textContent = 'Sign In';
      signInBtn.style.backgroundColor = ''; // Restore original color
      window.localStorage.removeItem('verificationPending');
      window.localStorage.removeItem('adminEmail');
      console.error("Admin sign-in error:", error);
      trackInteraction(null, 'login', 'failure', error.message);
      const errorMessage = document.getElementById('error-message');
      if (errorMessage) {
        errorMessage.textContent = error.message || "Failed to send verification code. Please try again.";
        errorMessage.classList.remove('hidden');
        setTimeout(() => errorMessage.classList.add('hidden'), 5000);
      }
    }
  }

  auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .then(() => {
      console.log("Persistence set to LOCAL");
    })
    .catch(error => {
      console.error("Error setting persistence:", error);
      const errorMessage = document.getElementById('error-message');
      if (errorMessage) {
        errorMessage.textContent = "Failed to initialize session: " + error.message;
        errorMessage.classList.remove('hidden');
        setTimeout(() => errorMessage.classList.add('hidden'), 5000);
      }
      hideLoader();
    });

  document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded for SignIn page at 11:12 PM SAST, Aug 15, 2025");

    // Check if verification link was clicked to re-enable button
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('enableButton') === 'true') {
      const signInBtn = document.getElementById('sign-in-btn');
      if (signInBtn) {
        signInBtn.disabled = false;
        signInBtn.textContent = 'Sign In';
        signInBtn.style.backgroundColor = ''; // Restore original color
        window.localStorage.removeItem('verificationPending');
        console.log("Button re-enabled via verification link");
      }
    }

    const emailInput = document.getElementById('email');
    if (emailInput) {
      emailInput.addEventListener('blur', (e) => {
        const email = e.target.value.trim();
        const passwordField = document.getElementById('password')?.parentElement;
        if (email === 'nbigreeneconomy@gmail.com') {
          if (passwordField) passwordField.style.display = 'none';
        } else {
          if (passwordField) passwordField.style.display = 'block';
        }
      });
    }

    const signInBtn = document.getElementById('sign-in-btn');
    const googleSignInBtn = document.getElementById('google-sign-in-btn');
    if (!signInBtn) console.error("Sign-in button not found");
    if (!googleSignInBtn) console.error("Google sign-in button not found");

    // Check local storage to keep button disabled and greyed out
    if (window.localStorage.getItem('verificationPending') === 'true') {
      if (signInBtn) {
        signInBtn.disabled = true;
        signInBtn.textContent = 'Verification Sent';
        signInBtn.style.backgroundColor = '#9CA3AF'; // Grey out button
      }
    }

    if (signInBtn) {
      signInBtn.addEventListener('click', async (e) => {
        console.log("Sign-in button clicked");
        e.preventDefault();
        const email = document.getElementById('email')?.value;
        const password = document.getElementById('password')?.value;
        const errorMessage = document.getElementById('error-message');
        if (!email || !errorMessage) {
          console.error("Email or error-message element not found");
          return;
        }

        if (email === 'nbigreeneconomy@gmail.com') {
          showLoader();
          await sendAdminVerificationEmail(email, signInBtn);
          return;
        }

        trackInteraction(null, 'login', 'attempt', `Email: ${email}`);
        showLoader();
        signInBtn.disabled = true;
        signInBtn.style.backgroundColor = '#9CA3AF'; // Grey out button

        if (!password) {
          hideLoader();
          signInBtn.disabled = false;
          signInBtn.style.backgroundColor = ''; // Restore original color
          errorMessage.textContent = "Password is required.";
          errorMessage.classList.remove('hidden');
          setTimeout(() => errorMessage.classList.add('hidden'), 5000);
          return;
        }
        try {
          console.log("Attempting email/password sign-in for:", email);
          const userCredential = await auth.signInWithEmailAndPassword(email, password);
          const user = userCredential.user;
          if (!user.emailVerified) {
            await auth.signOut();
            hideLoader();
            signInBtn.disabled = false;
            signInBtn.style.backgroundColor = ''; // Restore original color
            errorMessage.textContent = "Please verify your email before logging in.";
            errorMessage.classList.remove('hidden');
            setTimeout(() => errorMessage.classList.add('hidden'), 5000);
            trackInteraction(null, 'login', 'failure', 'Email not verified');
            return;
          }
          await db.collection('users').doc(user.uid).set({
            userId: user.uid,
            email: user.email,
            isAdmin: false,
            language: document.documentElement.lang || 'en',
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
          }, { merge: true });

          console.log("users doc written successfully");
          trackInteraction(user.uid, 'login', 'success', `Email: ${email}`);
          hideLoader();
          signInBtn.disabled = false;
          signInBtn.style.backgroundColor = ''; // Restore original color

          const questionnaireCompleted = await checkQuestionnaireCompletion(user);
          const redirectUrl = questionnaireCompleted
            ? '/Dashboard/dashboard.html?userId=' + user.uid
            : '/questionnaire/questionnaire.html?userId=' + user.uid;
          window.location.href = redirectUrl;
        } catch (error) {
          hideLoader();
          signInBtn.disabled = false;
          signInBtn.style.backgroundColor = ''; // Restore original color
          console.error("Sign-in error:", error);
          trackInteraction(null, 'login', 'failure', error.message);
          errorMessage.textContent = error.message;
          errorMessage.classList.remove('hidden');
          setTimeout(() => errorMessage.classList.add('hidden'), 5000);
        }
      });
    }

    if (googleSignInBtn) {
      googleSignInBtn.addEventListener('click', async (e) => {
        console.log("Google sign-in button clicked");
        e.preventDefault();
        trackInteraction(null, 'login', 'attempt', 'Google');
        showLoader();
        googleSignInBtn.disabled = true;
        googleSignInBtn.style.backgroundColor = '#9CA3AF'; // Grey out button
        try {
          const userCredential = await auth.signInWithPopup(googleProvider);
          const user = userCredential.user;
          await db.collection('users').doc(user.uid).set({
            userId: user.uid,
            email: user.email,
            isAdmin: user.email === 'nbigreeneconomy@gmail.com',
            language: document.documentElement.lang || 'en',
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
          }, { merge: true });

          console.log("users doc written successfully");
          trackInteraction(user.uid, 'login', 'success', 'Google');
          hideLoader();
          googleSignInBtn.disabled = false;
          googleSignInBtn.style.backgroundColor = ''; // Restore original color

          if (user.email === 'nbigreeneconomy@gmail.com') {
            const codeHash = await hashCode(HARDCODED_CODE);
            const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
            const verificationLink = `http://127.0.0.1:5504/VerifyCode.html?email=${encodeURIComponent(user.email)}&enableButton=true`;
            await db.collection('verification_codes').doc(user.email).set({
              email: user.email,
              codeHash: codeHash,
              createdAt: firebase.firestore.FieldValue.serverTimestamp(),
              expiresAt: expiresAt
            }, { merge: true });

            const actionCodeSettings = {
              url: verificationLink,
              handleCodeInApp: true
            };
            await user.sendEmailVerification(actionCodeSettings);
            console.log(`Verification email sent to ${user.email} at 11:12 PM SAST, Aug 15, 2025`);

            window.localStorage.setItem('adminEmail', user.email);
            window.localStorage.setItem('verificationPending', 'true');
            googleSignInBtn.disabled = true;
            googleSignInBtn.textContent = 'Verification Sent';
            googleSignInBtn.style.backgroundColor = '#9CA3AF'; // Grey out button
            const errorMessage = document.getElementById('error-message');
            if (errorMessage) {
              errorMessage.textContent = "A verification code has been sent to your email. Please check and click the link to enable the button.";
              errorMessage.classList.remove('hidden');
              setTimeout(() => errorMessage.classList.add('hidden'), 5000);
            }
            trackInteraction(null, 'login', 'code_sent', `Email: ${user.email}`);
            window.location.href = `VerifyCode.html?email=${encodeURIComponent(user.email)}`;
          } else {
            const questionnaireCompleted = await checkQuestionnaireCompletion(user);
            const redirectUrl = questionnaireCompleted
              ? '/Dashboard/dashboard.html?userId=' + user.uid
              : '/questionnaire/questionnaire.html?userId=' + user.uid;
            window.location.href = redirectUrl;
          }
        } catch (error) {
          hideLoader();
          googleSignInBtn.disabled = false;
          googleSignInBtn.textContent = 'Sign in with Google';
          googleSignInBtn.style.backgroundColor = ''; // Restore original color
          console.error("Google sign-in error:", error);
          trackInteraction(null, 'login', 'failure', error.message);
          const errorMessage = document.getElementById('error-message');
          if (errorMessage) {
            errorMessage.textContent = error.message;
            errorMessage.classList.remove('hidden');
            setTimeout(() => errorMessage.classList.add('hidden'), 5000);
          }
        }
      });
    }

    if (typeof updateLanguage === 'function') {
      updateLanguage(document.documentElement.lang || 'en');
    }
    trackInteraction(null, 'page', 'loaded', 'SignIn page');
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