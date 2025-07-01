   document.querySelector('.sign-up-btn').addEventListener('click', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            if (email && password && confirmPassword) {
                if (password === confirmPassword) {
                    // Simulate sign-up (replace with actual backend logic)
                    window.location.href = '../questionnaire/questionnaire.html';
                } else {
                    alert('Passwords do not match.');
                }
            } else {
                alert('Please fill in all fields.');
            }
        });

        document.querySelector('.google-btn').addEventListener('click', (e) => {
            e.preventDefault();
            // Simulate Google sign-up (replace with actual Google auth logic)
            window.location.href = '../questionnaire/questionnaire.html';
        });