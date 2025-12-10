console.log("AppliTrack: LinkedIn Module Loaded");

document.addEventListener('mousedown', (e) => {
    const target = e.target;
    
    // 1. Find the clickable element (Button or Link)
    const btn = target.closest('button') || 
                target.closest('a') || 
                target.closest('.artdeco-button');

    if (!btn) return;

    // 2. Check for Apply keywords (Case Insensitive)
    const text = (btn.innerText || "").toLowerCase();
    const aria = (btn.getAttribute('aria-label') || "").toLowerCase();
    
    // "Easy Apply" often has just "Apply" text hidden or in aria-label
    const isApply = text.includes('apply') || 
                    aria.includes('apply') || 
                    text.includes('easy apply');

    if (isApply) {
        console.log("AppliTrack: Apply interaction detected on LinkedIn (mousedown)");

        // 3. Scrape Details Strategy
        // LinkedIn has two main views: Search List vs Single Job Page
        
        let role = "Unknown Role";
        let company = "Unknown Company";

        // Strategy A: Job Details Header (Most common)
        const header = document.querySelector('.job-details-jobs-unified-top-card__job-title') ||
                       document.querySelector('.jobs-unified-top-card__job-title');
        
        if (header) {
            role = header.innerText;
            const companyEl = document.querySelector('.job-details-jobs-unified-top-card__company-name') ||
                              document.querySelector('.jobs-unified-top-card__company-name');
            if (companyEl) company = companyEl.innerText;
        } 
        // Strategy B: Fallback to main H1 (Single page view)
        else {
            const h1 = document.querySelector('h1');
            if (h1) role = h1.innerText;
            
            const companyLink = document.querySelector('a[href*="linkedin.com/company/"]');
            if (companyLink) company = companyLink.innerText;
        }

        // 4. Scrape Description
        const desc = document.querySelector('#job-details')?.innerText || 
                     document.querySelector('.jobs-description__content')?.innerText || "";

        // 5. Save
        const jobData = {
            role: role.replace(/\n/g, ' ').trim(),
            company: company.replace(/\n/g, ' ').trim(),
            url: window.location.href,
            platform: "LinkedIn",
            date: new Date().toISOString(),
            status: "Applied",
            description: desc
        };

        TrackerUtils.saveJobToStorage(jobData);
    }
}, true); // Capture phase enabled