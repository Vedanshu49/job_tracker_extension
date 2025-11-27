console.log("AppliTrack: Glassdoor Module Loaded");

document.addEventListener('click', (e) => {
    // Glassdoor mostly uses buttons, but sometimes links for external applies
    const btn = e.target.closest('button') || e.target.closest('a');
    
    if (btn) {
        const text = (btn.innerText || "").toLowerCase();
        const aria = (btn.getAttribute('aria-label') || "").toLowerCase();

        // Check for Apply keywords
        const isApply = text.includes('apply') || 
                        aria.includes('apply') || 
                        text.includes('easy apply');

        if (isApply) {
            const jobTitle = document.querySelector('[data-test="job-title"]')?.innerText || 
                             document.querySelector('div[class*="JobDetails_jobTitle"]')?.innerText ||
                             "Unknown Role";

            const company = document.querySelector('[data-test="employer-name"]')?.innerText || 
                            document.querySelector('div[class*="JobDetails_employerName"]')?.innerText ||
                            "Unknown Company";

            // Clean up: Glassdoor often adds rating numbers to company names text
            const cleanCompany = company.split('\n')[0].trim();

            const jobData = {
                role: jobTitle.trim(),
                company: cleanCompany,
                url: window.location.href,
                platform: "Glassdoor",
                date: new Date().toISOString(),
                status: "Applied",
                description: document.querySelector('[class*="JobDetails_jobDescription"]')?.innerText || ""
            };

            TrackerUtils.saveJobToStorage(jobData);
        }
    }
}, true);