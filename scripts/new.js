   // Language switching functionality
      function switchLanguage(lang) {
        const languages = {
          en: "English",
          zu: "IsiZulu",
          tn: "Tswana",
        };

        console.log(`Switching to ${languages[lang]}`);
        // Here you would implement actual language switching logic
        // This could involve API calls to get translated content
        alert(`Language switched to ${languages[lang]}`);
      }