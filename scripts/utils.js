// Shared Utility Functions
const Utils = {
    log: (msg) => console.log(`[Job Tracker] ${msg}`),
    
    // Helper to scrape common meta tags if specific selectors fail
    getMeta: (propName) => {
        const meta = document.querySelector(`meta[property="${propName}"]`) || document.querySelector(`meta[name="${propName}"]`);
        return meta ? meta.content : '';
    },
};

// Inside scripts/utils.js

saveJobToStorage: (jobData) => {
    chrome.storage.local.get(['jobs'], (result) => {
        const jobs = result.jobs || [];
        
        // Check for duplicates
        const exists = jobs.some(j => j.url === jobData.url);
        if (exists) {
            Utils.log("Job already tracked.");
            return;
        }

        // --- ADD THIS LINE ---
        jobData.id = Date.now().toString(); // Generate unique ID
        // --------------------

        jobs.unshift(jobData); 
        chrome.storage.local.set({ jobs: jobs }, () => {
            Utils.log("Job saved successfully!");
            alert(`Job Tracker: Saved application for ${jobData.company}`);
        });
    });
}