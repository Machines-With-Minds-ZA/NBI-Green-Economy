import { auth, googleProvider } from '../../Database(FireBase)/Firebase-Config';
import { signInWithEmailAndPassword, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";

const signInBtn = document.getElementById('sign-in-btn');
const googleSignInBtn = document.getElementById('google-sign-in-btn');
const errorMessage = document.getElementById('error-message');

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
}

signInBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        await signInWithEmailAndPassword(auth, email, password);
        window.location.href = '../questionnaire/questionnaire.html';
    } catch (error) {
        showError(error.message);
    }
});

googleSignInBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    try {
        await signInWithPopup(auth, googleProvider);
        window.location.href = '../questionnaire/questionnaire.html';
    } catch (error) {
        showError(error.message);
    }
});