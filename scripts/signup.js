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
    console.log("DOM fully loaded for SignUp page");

    const signUpBtn = document.getElementById('sign-up-btn');
    const googleSignUpBtn = document.getElementById('google-sign-up-btn');
    if (!signUpBtn) console.error("Sign-up button not found");
    if (!googleSignUpBtn) console.error("Google sign-up button not found");

    if (signUpBtn) {
      signUpBtn.addEventListener('click', async (e) => {
        console.log("Sign-up button clicked");
        e.preventDefault();
        const email = document.getElementById('email')?.value;
        const password = document.getElementById('password')?.value;
        const confirmPassword = document.getElementById('confirm-password')?.value;
        const errorMessage = document.getElementById('error-message');
        if (!email || !errorMessage) {
          console.error("Email or error-message element not found");
          return;
        }

        if (password !== confirmPassword) {
          errorMessage.textContent = "Passwords do not match.";
          errorMessage.classList.remove('hidden');
          trackInteraction(null, 'signup', 'failure', 'Passwords do not match');
          setTimeout(() => errorMessage.classList.add('hidden'), 5000);
          return;
        }

        trackInteraction(null, 'signup', 'attempt', `Email: ${email}`);
        showLoader();

        if (email === 'nbigreeneconomy@gmail.com') {
          const actionCodeSettings = {
            url: 'https://nbi-green-economy.firebaseapp.com/SignUp.html',
            handleCodeInApp: true
          };
          try {
            console.log("Sending sign-up link to:", email);
            await auth.sendSignInLinkToEmail(email, actionCodeSettings);
            window.localStorage.setItem('emailForSignIn', email);
            hideLoader();
            errorMessage.textContent = "A sign-in link has been sent to your email to complete sign-up.";
            errorMessage.classList.remove('hidden');
            setTimeout(() => errorMessage.classList.add('hidden'), 5000);
            trackInteraction(null, 'signup', 'email_link_sent', `Email: ${email}`);
          } catch (error) {
            hideLoader();
            console.error("Passwordless sign-up error:", error);
            trackInteraction(null, 'signup', 'failure', error.message);
            errorMessage.textContent = error.message;
            errorMessage.classList.remove('hidden');
            setTimeout(() => errorMessage.classList.add('hidden'), 5000);
          }
        } else {
          if (!password) {
            hideLoader();
            errorMessage.textContent = "Password is required.";
            errorMessage.classList.remove('hidden');
            setTimeout(() => errorMessage.classList.add('hidden'), 5000);
            return;
          }
          try {
            console.log("Attempting email/password sign-up for:", email);
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;

            await user.sendEmailVerification();
            console.log("Email verification sent to:", user.email);

            await db.collection('users').doc(user.uid).set({
              userId: user.uid,
              email: user.email,
              isAdmin: false,
              questionnaireCompleted: false,
              language: document.documentElement.lang || 'en',
              createdAt: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });

            console.log("users doc written successfully");
            trackInteraction(user.uid, 'signup', 'success', `Email: ${email}`);
            hideLoader();
            errorMessage.textContent = "Account created! Please check your email to verify your account.";
            errorMessage.classList.remove('hidden');
            setTimeout(() => {
              errorMessage.classList.add('hidden');
              auth.signOut().then(() => {
                window.location.href = '../questionnaire/questionnaire.html?userId=' + user.uid;
              });
            }, 5000);
          } catch (error) {
            hideLoader();
            console.error("Sign-up error:", error);
            trackInteraction(null, 'signup', 'failure', error.message);
            errorMessage.textContent = error.message;
            errorMessage.classList.remove('hidden');
            setTimeout(() => errorMessage.classList.add('hidden'), 5000);
          }
        }
      });
    }

    if (googleSignUpBtn) {
      googleSignUpBtn.addEventListener('click', async (e) => {
        console.log("Google sign-up button clicked");
        e.preventDefault();
        try {
          trackInteraction(null, 'signup', 'attempt', 'Google');
          showLoader();
          const userCredential = await auth.signInWithPopup(googleProvider);
          const user = userCredential.user;
          await db.collection('users').doc(user.uid).set({
            userId: user.uid,
            email: user.email,
            isAdmin: user.email === 'nbigreeneconomy@gmail.com',
            questionnaireCompleted: false,
            language: document.documentElement.lang || 'en',
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
          }, { merge: true });

          console.log("users doc written successfully");
          trackInteraction(user.uid, 'signup', 'success', 'Google');
          hideLoader();
          window.location.href = '../questionnaire/questionnaire.html?userId=' + user.uid;
        } catch (error) {
          hideLoader();
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

    if (auth.isSignInWithEmailLink(window.location.href)) {
      const email = window.localStorage.getItem('emailForSignIn');
      if (email) {
        console.log("Handling email link sign-up for:", email);
        showLoader();
        auth.signInWithEmailLink(email, window.location.href)
          .then(async (userCredential) => {
            window.localStorage.removeItem('emailForSignIn');
            const user = userCredential.user;
            await db.collection('users').doc(user.uid).set({
              userId: user.uid,
              email: user.email,
              isAdmin: user.email === 'nbigreeneconomy@gmail.com',
              questionnaireCompleted: false,
              language: document.documentElement.lang || 'en',
              createdAt: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
            console.log("users doc written successfully");
            trackInteraction(user.uid, 'signup', 'success', `Email: ${email}`);
            hideLoader();
            window.location.href = '../questionnaire/questionnaire.html?userId=' + user.uid;
          })
          .catch(error => {
            hideLoader();
            console.error("Error completing passwordless sign-up:", error);
            trackInteraction(null, 'signup', 'failure', error.message);
            const errorMessage = document.getElementById('error-message');
            if (errorMessage) {
              errorMessage.textContent = error.message;
              errorMessage.classList.remove('hidden');
              setTimeout(() => errorMessage.classList.add('hidden'), 5000);
            }
          });
      } else {
        console.error("No email found in localStorage for email link sign-up");
        const errorMessage = document.getElementById('error-message');
        if (errorMessage) {
          errorMessage.textContent = "No email found for sign-up. Please try again.";
          errorMessage.classList.remove('hidden');
          setTimeout(() => errorMessage.classList.add('hidden'), 5000);
        }
        hideLoader();
      }
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