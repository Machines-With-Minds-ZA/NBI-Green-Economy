document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const jwt = urlParams.get('jwt');
    const userId = urlParams.get('userId');

    if (jwt && userId) {
        localStorage.setItem('jwt', jwt);
        console.log("OAuth login successful, user ID:", userId);

        // Save temp user data
        await axios.post(
            'http://localhost:1337/api/temp-users',
            {
                data: {
                    userId: userId,
                    email: 'google-user@example.com', // Fetch email from Strapi if needed
                    isAdmin: true,
                    language: document.documentElement.lang || 'en',
                    createdAt: new Date().toISOString()
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${jwt}`
                }
            }
        );

        window.location.href = `../../api-management/api-management.html?userId=${userId}`;
    } else {
        console.error("OAuth login failed: No JWT or userId");
        // Optionally, show an error message or redirect to sign-in page
        const errorMessage = document.createElement('div');
        errorMessage.textContent = 'OAuth login failed. Please try again.';
        errorMessage.style.color = 'red';
        errorMessage.style.textAlign = 'center';
        errorMessage.style.marginTop = '20px';
        document.body.appendChild(errorMessage);
        setTimeout(() => {
            window.location.href = 'SignIn.html';
        }, 3000);
    }
});