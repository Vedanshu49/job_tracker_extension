console.log("Job Tracker: LinkedIn Module Loaded");

document.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (btn && (btn.innerText.includes('Apply') || btn.innerText.includes('Easy Apply'))) {
        
        const jobTitle = document.querySelector('.job-details-jobs-unified-top-card__job-title')?.innerText || "Unknown Role";
        const company = document.querySelector('.job-details-jobs-unified-top-card__company-name')?.innerText || "Unknown Company";

        // NEW: Scrape Description
        const desc = document.querySelector('#job-details')?.innerText || 
                     document.querySelector('.jobs-description-content__text')?.innerText || "";

        const jobData = {
            role: jobTitle,
            company: company,
            url: window.location.href,
            platform: "LinkedIn",
            date: new Date().toISOString(),
            status: "Applied",
            description: desc // Save description
        };

        TrackerUtils.saveJobToStorage(jobData);
    }
});