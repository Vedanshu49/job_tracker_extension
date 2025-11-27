console.log("AppliTrack: LinkedIn Module Loaded");

document.addEventListener('click', (e) => {
    const target = e.target;
    
    // Check for BUTTON or A tag (Link)
    const btn = target.closest('button') || 
                target.closest('a.job-details-jobs-unified-top-card__apply-button') ||
                target.closest('a.jobs-apply-button') ||
                target.closest('.artdeco-button') ||
                target.closest('a[href*="linkedin.com/jobs/"]'); // Generic fallback

    if (btn) {
        // Clean text for checking
        const text = (btn.innerText || "").toLowerCase().trim();
        const aria = (btn.getAttribute('aria-label') || "").toLowerCase();

        // Check for keywords
        const isApply = text.includes('apply') || 
                        aria.includes('apply') ||
                        text.includes('easy apply');

        if (isApply) {
            console.log("AppliTrack: Apply detected on LinkedIn");

            // Scrape Details
            const jobTitle = document.querySelector('.job-details-jobs-unified-top-card__job-title h1')?.innerText || 
                             document.querySelector('.job-details-jobs-unified-top-card__job-title')?.innerText ||
                             document.querySelector('h1')?.innerText || 
                             "Unknown Role";

            const company = document.querySelector('.job-details-jobs-unified-top-card__company-name')?.innerText || 
                            document.querySelector('.jobs-unified-top-card__company-name')?.innerText || 
                            "Unknown Company";

            // Scrape Description
            const desc = document.querySelector('#job-details')?.innerText || 
                         document.querySelector('.jobs-description-content__text')?.innerText || "";

            const jobData = {
                role: jobTitle.replace(/\n/g, ' ').trim(),
                company: company.replace(/\n/g, ' ').trim(),
                url: window.location.href,
                platform: "LinkedIn",
                date: new Date().toISOString(),
                status: "Applied",
                description: desc
            };

            TrackerUtils.saveJobToStorage(jobData);
        }
    }
});