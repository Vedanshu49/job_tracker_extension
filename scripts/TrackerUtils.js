// Shared Utility Functions
const TrackerUtils = {
    log: (msg) => console.log(`[AppliTrack] ${msg}`),
    
    getMeta: (propName) => {
        const meta = document.querySelector(`meta[property="${propName}"]`) || document.querySelector(`meta[name="${propName}"]`);
        return meta ? meta.content : '';
    },

    saveJobToStorage: (jobData) => {
        chrome.storage.local.get(['jobs'], (result) => {
            const jobs = result.jobs || [];
            
            // Duplicate Check
            const exists = jobs.some(j => j.url === jobData.url);
            if (exists) {
                TrackerUtils.showToast("⚠️ Job already tracked", "#F59E0B"); // Warning color
                return;
            }

            // Generate Unique ID
            jobData.id = Date.now().toString();

            jobs.unshift(jobData);
            chrome.storage.local.set({ jobs: jobs }, () => {
                TrackerUtils.log("Job saved successfully!");
                // Show visual feedback
                TrackerUtils.showToast(`✅ Saved: ${jobData.role.substring(0, 20)}...`, "#22C55E");
            });
        });
    },

    // NEW: Professional Toast Notification
    showToast: (message, color) => {
        // Remove existing toast if present
        const existing = document.getElementById('applitrack-toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.id = 'applitrack-toast';
        toast.textContent = message;
        
        Object.assign(toast.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            backgroundColor: color || '#6366F1',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '8px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            zIndex: '2147483647', // Max z-index to be on top of everything
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            fontSize: '14px',
            fontWeight: '600',
            opacity: '0',
            transition: 'opacity 0.3s ease, transform 0.3s ease',
            transform: 'translateY(20px)',
            pointerEvents: 'none'
        });

        document.body.appendChild(toast);

        // Animate In
        requestAnimationFrame(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateY(0)';
        });

        // Remove after 3 seconds
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(20px)';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
};