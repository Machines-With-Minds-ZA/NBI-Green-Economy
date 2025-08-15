const firebaseConfig = {
  apiKey: "AIzaSyCfa827mvCLf1ETts6B_DmCfb7owTohBxk",
  authDomain: "nbi-green-economy.firebaseapp.com",
  projectId: "nbi-green-economy",
  storageBucket: "nbi-green-economy.firebasestorage.app",
  messagingSenderId: "53732340059",
  appId: "1:53732340059:web:3fb3f086c6662e1e9baa7e",
  measurementId: "G-37VRZ5CGE4"
};

console.log("Initializing Firebase at 11:07 PM SAST, Aug 15, 2025...");
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

  const HARDCODED_CODE = 'K7mP!qR9@wT#xY'; // Hardcoded 14-character verification code

  async function hashCode(code) {
    const encoder = new TextEncoder();
    const data = encoder.encode(code);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  async function sendAdminVerificationEmail(email, signUpBtn) {
    try {
      // Create the admin user with the hardcoded code as a temporary password
      const userCredential = await auth.createUserWithEmailAndPassword(email, HARDCODED_CODE);
      const user = userCredential.user;

      signUpBtn.disabled = true;
      signUpBtn.textContent = 'Verification Sent';
      signUpBtn.style.backgroundColor = '#9CA3AF'; // Grey out button
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
      console.log(`Verification email sent to ${email}`);

      hideLoader();
      const errorMessage = document.getElementById('error-message');
      if (errorMessage) {
        errorMessage.textContent = "A verification code has been sent to your email. Please check and click the link to enable the button.";
        errorMessage.classList.remove('hidden');
        setTimeout(() => errorMessage.classList.add('hidden'), 5000);
      }
      trackInteraction(null, 'signup', 'code_sent', `Email: ${email}`);
      // Redirect to VerifyCode.html
      window.location.href = `VerifyCode.html?email=${encodeURIComponent(email)}`;
    } catch (error) {
      hideLoader();
      signUpBtn.disabled = false;
      signUpBtn.textContent = 'Sign Up';
      signUpBtn.style.backgroundColor = ''; // Restore original color
      window.localStorage.removeItem('verificationPending');
      window.localStorage.removeItem('adminEmail');
      console.error("Admin sign-up error:", error);
      trackInteraction(null, 'signup', 'failure', error.message);
      const errorMessage = document.getElementById('error-message');
      if (errorMessage) {
        errorMessage.textContent = error.message || "Failed to send verification code. Please try again.";
        errorMessage.classList.remove('hidden');
        setTimeout(() => errorMessage.classList.add('hidden'), 5000);
      }
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded for SignUp page at 11:07 PM SAST, Aug 15, 2025");

    // Check if verification link was clicked to re-enable button
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('enableButton') === 'true') {
      const signUpBtn = document.getElementById('sign-up-btn');
      if (signUpBtn) {
        signUpBtn.disabled = false;
        signUpBtn.textContent = 'Sign Up';
        signUpBtn.style.backgroundColor = ''; // Restore original color
        window.localStorage.removeItem('verificationPending');
        console.log("Button re-enabled via verification link");
      }
    }

    const signUpBtn = document.getElementById('sign-up-btn');
    const googleSignUpBtn = document.getElementById('google-sign-up-btn');
    if (!signUpBtn) console.error("Sign-up button not found");
    if (!googleSignUpBtn) console.error("Google sign-up button not found");

    // Check local storage to keep button disabled and greyed out
    if (window.localStorage.getItem('verificationPending') === 'true') {
      if (signUpBtn) {
        signUpBtn.disabled = true;
        signUpBtn.textContent = 'Verification Sent';
        signUpBtn.style.backgroundColor = '#9CA3AF'; // Grey out button
      }
    }

    if (signUpBtn) {
      signUpBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email')?.value;
        const password = document.getElementById('password')?.value;
        const confirmPassword = document.getElementById('confirm-password')?.value;
        const errorMessage = document.getElementById('error-message');
        if (!email || !password || !confirmPassword || !errorMessage) {
          console.error("Form elements not found");
          return;
        }

        if (email === 'nbigreeneconomy@gmail.com') {
          showLoader();
          await sendAdminVerificationEmail(email, signUpBtn);
          return;
        }

        if (password !== confirmPassword) {
          errorMessage.textContent = "Passwords do not match.";
          errorMessage.classList.remove('hidden');
          setTimeout(() => errorMessage.classList.add('hidden'), 5000);
          return;
        }

        trackInteraction(null, 'signup', 'attempt', `Email: ${email}`);
        showLoader();
        signUpBtn.disabled = true;
        signUpBtn.style.backgroundColor = '#9CA3AF'; // Grey out button

        try {
          const userCredential = await auth.createUserWithEmailAndPassword(email, password);
          const user = userCredential.user;
          await user.sendEmailVerification();
          await db.collection('users').doc(user.uid).set({
            userId: user.uid,
            email: user.email,
            isAdmin: false,
            language: document.documentElement.lang || 'en',
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
          }, { merge: true });

          console.log("User created and email verification sent");
          trackInteraction(user.uid, 'signup', 'success', `Email: ${email}`);
          hideLoader();
          signUpBtn.disabled = false;
          signUpBtn.style.backgroundColor = ''; // Restore original color
          errorMessage.textContent = "Account created! Please verify your email.";
          errorMessage.classList.remove('hidden');
          setTimeout(() => {
            errorMessage.classList.add('hidden');
            window.location.href = 'SignIn.html';
          }, 3000);
        } catch (error) {
          hideLoader();
          signUpBtn.disabled = false;
          signUpBtn.style.backgroundColor = ''; // Restore original color
          console.error("Sign-up error:", error);
          trackInteraction(null, 'signup', 'failure', error.message);
          errorMessage.textContent = error.message;
          errorMessage.classList.remove('hidden');
          setTimeout(() => errorMessage.classList.add('hidden'), 5000);
        }
      });
    }

    if (googleSignUpBtn) {
      googleSignUpBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        trackInteraction(null, 'signup', 'attempt', 'Google');
        showLoader();
        googleSignUpBtn.disabled = true;
        googleSignUpBtn.style.backgroundColor = '#9CA3AF'; // Grey out button
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

          console.log("User created with Google");
          trackInteraction(user.uid, 'signup', 'success', 'Google');
          hideLoader();
          googleSignUpBtn.disabled = false;
          googleSignUpBtn.style.backgroundColor = ''; // Restore original color

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
            console.log(`Verification email sent to ${user.email}`);

            window.localStorage.setItem('adminEmail', user.email);
            window.localStorage.setItem('verificationPending', 'true');
            googleSignUpBtn.disabled = true;
            googleSignUpBtn.textContent = 'Verification Sent';
            googleSignUpBtn.style.backgroundColor = '#9CA3AF'; // Grey out button
            const errorMessage = document.getElementById('error-message');
            if (errorMessage) {
              errorMessage.textContent = "A verification code has been sent to your email. Please check and click the link to enable the button.";
              errorMessage.classList.remove('hidden');
              setTimeout(() => errorMessage.classList.add('hidden'), 5000);
            }
            trackInteraction(null, 'signup', 'code_sent', `Email: ${user.email}`);
            window.location.href = `VerifyCode.html?email=${encodeURIComponent(user.email)}`;
          } else {
            window.location.href = '/questionnaire/questionnaire.html?userId=' + user.uid;
          }
        } catch (error) {
          hideLoader();
          googleSignUpBtn.disabled = false;
          googleSignUpBtn.textContent = 'Sign up with Google';
          googleSignUpBtn.style.backgroundColor = ''; // Restore original color
          console.error("Google sign-up error:", error);
          trackInteraction(null, 'signup', 'failure', error.message);
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
    trackInteraction(null, 'page', 'loaded', 'SignUp page');
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