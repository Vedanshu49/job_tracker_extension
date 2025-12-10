console.log("AppliTrack: Glassdoor Module Loaded");

document.addEventListener('mousedown', (e) => {
    const target = e.target;

    // Glassdoor buttons are often styled divs or spans inside buttons
    const btn = target.closest('button') || target.closest('a');

    if (!btn) return;

    const text = (btn.innerText || "").toLowerCase();
    const aria = (btn.getAttribute('aria-label') || "").toLowerCase();
    const id = (btn.id || "").toLowerCase();

    // Check for "Apply", "Easy Apply", "Continue"
    const isApply = text.includes('apply') || 
                    aria.includes('apply') || 
                    id.includes('apply') ||
                    text.includes('easy apply');

    if (isApply) {
        console.log("AppliTrack: Apply interaction detected on Glassdoor (mousedown)");

        // 1. Scrape Role
        const jobTitle = document.querySelector('[data-test="job-title"]')?.innerText || 
                         document.querySelector('div[class*="JobDetails_jobTitle"]')?.innerText ||
                         document.querySelector('h1')?.innerText ||
                         "Unknown Role";

        // 2. Scrape Company
        let company = "Unknown Company";
        const companyEl = document.querySelector('[data-test="employer-name"]') || 
                          document.querySelector('div[class*="JobDetails_employerName"]');
        
        if (companyEl) {
            // Glassdoor often includes rating in the text (e.g. "Google 4.5 ★")
            // We split by newline or just take the first part
            company = companyEl.innerText.split('\n')[0]; 
            // Remove star ratings if they leaked into the first line
            company = company.replace(/\d\.\d.*/, ''); 
        }

        // 3. Scrape Description
        const desc = document.querySelector('[class*="JobDetails_jobDescription"]')?.innerText || 
                     document.querySelector('#JobDescriptionContainer')?.innerText || "";

        const jobData = {
            role: jobTitle.trim(),
            company: company.trim(),
            url: window.location.href,
            platform: "Glassdoor",
            date: new Date().toISOString(),
            status: "Applied",
            description: desc
        };

        TrackerUtils.saveJobToStorage(jobData);
    }
}, true); // Capture phase enabled