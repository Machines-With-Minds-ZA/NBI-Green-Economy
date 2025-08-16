// Activity Logger Service
class ActivityLogger {
    constructor() {
        // Initialize Firebase if not already initialized
        if (!firebase.apps.length) {
            const firebaseConfig = {
                apiKey: "AIzaSyCfa827mvCLf1ETts6B_DmCfb7owTohBxk",
                authDomain: "nbi-green-economy.firebaseapp.com",
                projectId: "nbi-green-economy",
                storageBucket: "nbi-green-economy.firebasestorage.app",
                messagingSenderId: "53732340059",
                appId: "1:53732340059:web:3fb3f086c6662e1e9baa7e"
            };
            firebase.initializeApp(firebaseConfig);
        }
        
        this.db = firebase.firestore();
        this.auth = firebase.auth();
        this.currentPage = window.location.pathname.split('/').pop() || 'home';
        this.sessionId = this.generateSessionId();
        this.startTime = new Date();
        // Initialize session
        this.initializeSession();
    }
    
    async authenticateAndInitialize() {
        try {
            // Try to sign in anonymously first
            await this.auth.signInAnonymously();
            this.isAuthenticated = true;
            console.log('Authenticated anonymously');
            this.initializeSession();
        } catch (error) {
            console.error('Error authenticating:', error);
            // If anonymous auth fails, try with admin token
            await this.signInWithAdminToken();
        }
    }
    
    generateSessionId() {
        return 'session_' + Math.random().toString(36).substr(2, 9);
    }
    
    async initializeSession() {
        // Get user info if logged in
        let userId = 'anonymous';
        let userEmail = 'anonymous';
        
        if (this.auth.currentUser) {
            userId = this.auth.currentUser.uid;
            userEmail = this.auth.currentUser.email || 'no-email';
        }
        
        // Store session data
        this.sessionData = {
            sessionId: this.sessionId,
            userId,
            userEmail,
            startTime: new Date(),
            currentPage: this.currentPage,
            userAgent: navigator.userAgent,
            screenResolution: `${window.screen.width}x${window.screen.height}`,
            language: navigator.language,
            actions: []
        };
        
        // Add page view action
        this.logAction('page_view', { page: this.currentPage });
        
        // Set up page unload handler
        window.addEventListener('beforeunload', () => this.endSession());
    }
    
    async logAction(actionType, details = {}) {
        if (!this.isAuthenticated) {
            console.warn('Not authenticated, skipping action logging');
            return;
        }

        const action = {
            type: actionType,
            timestamp: new Date(),
            page: this.currentPage,
            details: details
        };
        
        // Add to session data
        this.sessionData.actions.push(action);
        
        // Send to Firestore with retry logic
        const maxRetries = 3;
        let attempts = 0;
        
        while (attempts < maxRetries) {
            try {
                await this.db.collection('interactions').add({
                    type: 'user_activity',
                    action: actionType,
                    page: this.currentPage,
                    timestamp: new Date(),
                    userAgent: navigator.userAgent,
                    screenResolution: `${window.screen.width}x${window.screen.height}`,
                    ...details
                });
                
                // Also update the session document
                await this.db.collection('userSessions').doc(this.sessionId).set({
                    ...this.sessionData,
                    lastActivity: new Date(),
                    ['actions.' + action.timestamp.getTime()]: action
                }, { merge: true });
                
                break; // Success, exit retry loop
            } catch (error) {
                attempts++;
                console.error(`Error logging action (attempt ${attempts}/${maxRetries}):`, error);
                
                if (attempts >= maxRetries) {
                    console.error('Max retries reached, giving up');
                    break;
                }
                
                // Wait before retrying
                await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
            }
        }
    }
    
    async endSession() {
        const endTime = new Date();
        const sessionDuration = (endTime - this.startTime) / 1000; // in seconds
        
        try {
            // Update session with end time and duration
            await this.db.collection('userSessions').doc(this.sessionId).update({
                endTime: endTime,
                sessionDuration: sessionDuration,
                isActive: false
            });
            
            // Log session summary
            await this.logAction('session_end', { 
                duration: sessionDuration,
                pageCount: this.sessionData.actions.filter(a => a.type === 'page_view').length
            });
            
        } catch (error) {
            console.error('Error ending session:', error);
        }
    }
}

// Initialize and expose the logger
window.activityLogger = new ActivityLogger();

// Track common user interactions
document.addEventListener('DOMContentLoaded', () => {
    // Track clicks
    document.addEventListener('click', (e) => {
        const target = e.target;
        let details = {
            tagName: target.tagName,
            id: target.id || null,
            className: target.className || null,
            text: target.textContent?.substring(0, 100) || null,
            href: target.href || null
        };
        
        // Clean up details
        Object.keys(details).forEach(key => {
            if (details[key] === null || details[key] === '') {
                delete details[key];
            }
        });
        
        window.activityLogger.logAction('click', details);
    });
    
    // Track form interactions
    document.addEventListener('submit', (e) => {
        const form = e.target;
        const formData = new FormData(form);
        const formValues = {};
        
        for (let [key, value] of formData.entries()) {
            // Don't log passwords
            formValues[key] = key.toLowerCase().includes('password') ? '***' : value;
        }
        
        window.activityLogger.logAction('form_submit', {
            formId: form.id || null,
            formAction: form.action || null,
            formMethod: form.method || 'get',
            values: formValues
        });
    });
    
    // Track outbound links
    document.addEventListener('click', (e) => {
        let target = e.target;
        // Handle cases where the click might be on a child element of the link
        while (target && target.tagName !== 'A' && target !== document.body) {
            target = target.parentNode;
        }
        
        if (target && target.tagName === 'A' && target.href) {
            const url = new URL(target.href);
            if (url.hostname !== window.location.hostname) {
                window.activityLogger.logAction('outbound_click', {
                    url: target.href,
                    text: target.textContent?.substring(0, 100) || null
                });
            }
        }
    });
});
