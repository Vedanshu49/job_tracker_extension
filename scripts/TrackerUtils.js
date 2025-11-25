// Shared Utility Functions
// Renamed to 'TrackerUtils' to avoid conflicts with websites like Indeed
const TrackerUtils = {
    log: (msg) => console.log(`[Job Tracker] ${msg}`),
    
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
                TrackerUtils.log("Job already tracked.");
                return;
            }

            // Generate Unique ID
            jobData.id = Date.now().toString();

            jobs.unshift(jobData);
            chrome.storage.local.set({ jobs: jobs }, () => {
                TrackerUtils.log("Job saved successfully!");
                alert(`Job Tracker: Saved application for ${jobData.company}`);
            });
        });
    }
};