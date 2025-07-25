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

  async function checkQuestionnaireCompletion(user) {
    try {
      const userDoc = await db.collection('users').doc(user.uid).get();
      if (userDoc.exists) {
        const data = userDoc.data();
        return data.questionnaireCompleted || false;
      }
      return false;
    } catch (error) {
      console.error("Error checking questionnaire completion:", error);
      return false;
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
    console.log("DOM fully loaded for SignIn page");

    const signInBtn = document.getElementById('sign-in-btn');
    const googleSignInBtn = document.getElementById('google-sign-in-btn');
    if (!signInBtn) console.error("Sign-in button not found");
    if (!googleSignInBtn) console.error("Google sign-in button not found");

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

        trackInteraction(null, 'login', 'attempt', `Email: ${email}`);
        showLoader();

        if (email === 'nbigreeneconomy@gmail.com') {
          const actionCodeSettings = {
            url: 'https://nbigreeneconomy.netlify.app/LandingPage/Signup&SignIn/Signin.html',
            handleCodeInApp: true
          };
          try {
            console.log("Sending sign-in link to:", email);
            await auth.sendSignInLinkToEmail(email, actionCodeSettings);
            window.localStorage.setItem('emailForSignIn', email);
            hideLoader();
            errorMessage.textContent = "A sign-in link has been sent to your email.";
            errorMessage.classList.remove('hidden');
            setTimeout(() => errorMessage.classList.add('hidden'), 5000);
            trackInteraction(null, 'login', 'email_link_sent', `Email: ${email}`);
          } catch (error) {
            hideLoader();
            console.error("Passwordless sign-in error:", error);
            trackInteraction(null, 'login', 'failure', error.message);
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
            console.log("Attempting email/password sign-in for:", email);
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            const user = userCredential.user;
            if (!user.emailVerified) {
              await auth.signOut();
              hideLoader();
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
              questionnaireCompleted: false,
              language: document.documentElement.lang || 'en',
              createdAt: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });

            console.log("users doc written successfully");
            trackInteraction(user.uid, 'login', 'success', `Email: ${email}`);
            hideLoader();

            const questionnaireCompleted = await checkQuestionnaireCompletion(user);
            const redirectUrl = user.email === 'nbigreeneconomy@gmail.com'
              ? '/interactions/interactions.html?userId=' + user.uid
              : questionnaireCompleted
                ? '/Dashboard/dashboard.html?userId=' + user.uid
                : '/questionnaire/questionnaire.html?userId=' + user.uid;
            window.location.href = redirectUrl;
          } catch (error) {
            hideLoader();
            console.error("Sign-in error:", error);
            trackInteraction(null, 'login', 'failure', error.message);
            errorMessage.textContent = error.message;
            errorMessage.classList.remove('hidden');
            setTimeout(() => errorMessage.classList.add('hidden'), 5000);
          }
        }
      });
    }

    if (googleSignInBtn) {
      googleSignInBtn.addEventListener('click', async (e) => {
        console.log("Google sign-in button clicked");
        e.preventDefault();
        trackInteraction(null, 'login', 'attempt', 'Google');
        showLoader();
        try {
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
          trackInteraction(user.uid, 'login', 'success', 'Google');
          hideLoader();

          const questionnaireCompleted = await checkQuestionnaireCompletion(user);
          const redirectUrl = user.email === 'nbigreeneconomy@gmail.com'
            ? '/interactions/interactions.html?userId=' + user.uid
            : questionnaireCompleted
              ? '/Dashboard/dashboard.html?userId=' + user.uid
              : '/questionnaire/questionnaire.html?userId=' + user.uid;
          window.location.href = redirectUrl;
        } catch (error) {
          hideLoader();
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

    if (auth.isSignInWithEmailLink(window.location.href)) {
      const email = window.localStorage.getItem('emailForSignIn');
      if (email) {
        console.log("Handling email link sign-in for:", email);
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
            trackInteraction(user.uid, 'login', 'success', `Email: ${email}`);
            hideLoader();

            const questionnaireCompleted = await checkQuestionnaireCompletion(user);
            const redirectUrl = user.email === 'nbigreeneconomy@gmail.com'
              ? '/interactions/interactions.html?userId=' + user.uid
              : questionnaireCompleted
                ? '/Dashboard/dashboard.html?userId=' + user.uid
                : '/questionnaire/questionnaire.html?userId=' + user.uid;
            window.location.href = redirectUrl;
          })
          .catch(error => {
            hideLoader();
            console.error("Error completing passwordless sign-in:", error);
            trackInteraction(null, 'login', 'failure', error.message);
            const errorMessage = document.getElementById('error-message');
            if (errorMessage) {
              errorMessage.textContent = error.message;
              errorMessage.classList.remove('hidden');
              setTimeout(() => errorMessage.classList.add('hidden'), 5000);
            }
          });
      } else {
        console.error("No email found in localStorage for email link sign-in");
        const errorMessage = document.getElementById('error-message');
        if (errorMessage) {
          errorMessage.textContent = "No email found for sign-in. Please try again.";
          errorMessage.classList.remove('hidden');
          setTimeout(() => errorMessage.classList.add('hidden'), 5000);
        }
        hideLoader();
      }
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