console.log("AppliTrack: Indeed Module Loaded");

document.addEventListener('click', (e) => {
    const target = e.target;
    
    // Catch Buttons AND Links (<a> tags) - crucial for "Apply on company site"
    const btn = target.closest('button') || 
                target.closest('a') || 
                target.closest('.jobsearch-IndeedApplyButton-newDesign') ||
                target.closest('#indeedApplyButton') ||
                target.closest('#viewJobButtonLinkContainer');

    if (btn) {
        const text = (btn.innerText || "").toLowerCase();
        const aria = (btn.getAttribute('aria-label') || "").toLowerCase();
        
        // Keywords for both internal apply and external company sites
        const isApply = text.includes('apply') || 
                        text.includes('continue') ||
                        text.includes('company site') ||
                        aria.includes('apply');

        if (isApply) {
            console.log("AppliTrack: Apply detected on Indeed");

            // Indeed usually shows details in a right-side pane or a main header
            // We specifically look for the *Detail* header, not the *Search Result* header
            let titleEl = document.querySelector('.jobsearch-JobInfoHeader-title') || 
                          document.querySelector('[data-testid="job-title"]');
            
            let companyEl = document.querySelector('[data-company-name="true"]') || 
                            document.querySelector('[data-testid="company-name"]') ||
                            document.querySelector('.jobsearch-CompanyReview--heading');

            const jobData = {
                role: titleEl ? titleEl.innerText.replace(/\n/g, " ").trim() : "Unknown Role",
                company: companyEl ? companyEl.innerText.replace(/\n/g, " ").trim() : "Unknown Company",
                url: window.location.href,
                platform: "Indeed",
                date: new Date().toISOString(),
                status: "Applied",
                description: document.querySelector('#jobDescriptionText')?.innerText || ""
            };

            TrackerUtils.saveJobToStorage(jobData);
        }
    }
}, true); // Use Capture phase to catch the click before the new tab opens