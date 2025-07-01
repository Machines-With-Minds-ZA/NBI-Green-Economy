import { auth, db, googleProvider } from '../../Database(FireBase)/Firebase-Config';
import { createUserWithEmailAndPassword, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

const signUpBtn = document.getElementById('sign-up-btn');
const googleSignUpBtn = document.getElementById('google-sign-up-btn');
const errorMessage = document.getElementById('error-message');

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
}

signUpBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (password !== confirmPassword) {
        showError('Passwords do not match');
        return;
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await setDoc(doc(db, 'users', user.uid), {
            email: user.email,
            createdAt: new Date().toISOString()
        });
        window.location.href = '../questionnaire/questionnaire.html';
    } catch (error) {
        showError(error.message);
    }
});

googleSignUpBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    try {
        const userCredential = await signInWithPopup(auth, googleProvider);
        const user = userCredential.user;
        await setDoc(doc(db, 'users', user.uid), {
            email: user.email,
            createdAt: new Date().toISOString()
        }, { merge: true });
        window.location.href = '../questionnaire/questionnaire.html';
    } catch (error) {
        showError(error.message);
    }
});