console.log("Job Tracker: Indeed Module Loaded");

document.addEventListener('click', (e) => {
    const target = e.target;
    const btn = target.closest('button') || 
                target.closest('a') || 
                target.closest('.jobsearch-IndeedApplyButton-newDesign') ||
                target.closest('#indeedApplyButton') ||
                target.closest('[id*="Apply"]');

    if (btn) {
        const text = (btn.innerText || "").toLowerCase();
        const aria = (btn.getAttribute('aria-label') || "").toLowerCase();
        const id = (btn.id || "").toLowerCase();

        const isApply = text.includes('apply') || 
                        aria.includes('apply') || 
                        id.includes('continue') ||
                        id.includes('apply');

        if (isApply) {
            console.log("Job Tracker: Apply detected on Indeed");

            let role = "Unknown Role";
            const titleEl = document.querySelector('.jobsearch-JobInfoHeader-title') || 
                            document.querySelector('h1') ||
                            document.querySelector('[data-testid="job-title"]');
            if (titleEl) role = titleEl.innerText.replace(/\n/g, " ").trim();

            let company = "Unknown Company";
            const companyEl = document.querySelector('[data-company-name="true"]') || 
                              document.querySelector('[data-testid="company-name"]') ||
                              document.querySelector('.jobsearch-CompanyReview--heading') ||
                              document.querySelector('.jobsearch-CompanyInfoContainer');
            if (companyEl) company = companyEl.innerText.replace(/\n/g, " ").trim();

            // NEW: Scrape Description
            const desc = document.querySelector('#jobDescriptionText')?.innerText || "";

            const jobData = {
                role: role,
                company: company,
                url: window.location.href,
                platform: "Indeed",
                date: new Date().toISOString(),
                status: "Applied",
                description: desc // Save description
            };

            TrackerUtils.saveJobToStorage(jobData);
        }
    }
}, true);