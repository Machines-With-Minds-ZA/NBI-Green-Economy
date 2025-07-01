        document.getElementById('user-questionnaire').addEventListener('submit', (e) => {
            e.preventDefault();
            const userType = document.getElementById('user-type').value;
            const primaryInterest = document.getElementById('primary-interest').value;
            const fundingNeeds = document.getElementById('funding-needs').value;
            const businessSector = document.getElementById('business-sector').value;
            const skillLevel = document.getElementById('skill-level').value;
            const toolAccess = document.getElementById('tool-access').value;
            const language = document.getElementById('language').value;

            // Store user preferences (e.g., in localStorage or send to backend)
            const userPreferences = { userType, primaryInterest, fundingNeeds, businessSector, skillLevel, toolAccess, language };
            console.log('User Preferences:', userPreferences);

            // Redirect to personalized dashboard or content page
            window.location.href = '../Dashboard/dashboard.html';
        });