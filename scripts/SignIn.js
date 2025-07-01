        document.querySelectorAll('a[href="/"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = '/index.html';
            });
        });

        document.querySelectorAll('a[href="/about"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = '/about.html';
            });
        });

        document.querySelectorAll('a[href="/SignUp.html"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = '/SignUp.html';
            });
        });



        // For Moving To The Questionaire:

                document.querySelector('.sign-in-btn').addEventListener('click', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            // Simulate authentication (replace with actual authentication logic)
            if (email && password) {
                window.location.href = '../questionnaire/questionnaire.html';
            } else {
                alert('Please enter both email and password.');
            }
        });

        document.querySelector('.google-btn').addEventListener('click', (e) => {
            e.preventDefault();
            // Simulate Google sign-in (replace with actual Google auth logic)
            window.location.href = '../questionnaire/questionnaire.html';
        });