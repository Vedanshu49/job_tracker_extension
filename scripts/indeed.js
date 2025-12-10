console.log("AppliTrack: Indeed Module Loaded");

// Helper to find the job container
function getIndeedJobDetails() {
    // Strategy 1: The Right-Hand Pane (Feed View)
    const rightPane = document.querySelector('.jobsearch-RightPane');
    if (rightPane) {
        return {
            role: rightPane.querySelector('h2.jobsearch-JobInfoHeader-title')?.innerText 
               || rightPane.querySelector('h1')?.innerText 
               || "Unknown Role",
            company: rightPane.querySelector('[data-company-name="true"]')?.innerText 
                  || rightPane.querySelector('[data-testid="company-name"]')?.innerText 
                  || "Unknown Company",
            desc: rightPane.querySelector('#jobDescriptionText')?.innerText || ""
        };
    }

    // Strategy 2: Standalone Page
    return {
        role: document.querySelector('h1.jobsearch-JobInfoHeader-title')?.innerText 
           || document.querySelector('.jobsearch-JobInfoHeader-title')?.innerText 
           || "Unknown Role",
        company: document.querySelector('[data-company-name="true"]')?.innerText 
              || document.querySelector('[data-testid="company-name"]')?.innerText 
              || "Unknown Company",
        desc: document.querySelector('#jobDescriptionText')?.innerText || ""
    };
}

// We use 'mousedown' because it fires BEFORE 'click' and BEFORE the page unloads/redirects.
document.addEventListener('mousedown', (e) => {
    const target = e.target;
    
    // 1. Find the clickable element (Button, Link, or Span inside them)
    const btn = target.closest('button') || 
                target.closest('a') || 
                target.closest('[role="button"]');

    if (!btn) return;

    // 2. Check if it's an Apply button (Case Insensitive, Broad Match)
    const text = (btn.innerText || "").toLowerCase();
    const aria = (btn.getAttribute('aria-label') || "").toLowerCase();
    const id = (btn.id || "").toLowerCase();

    const isApply = text.includes('apply') || 
                    text.includes('continue') || 
                    aria.includes('apply') || 
                    id.includes('apply');

    if (isApply) {
        console.log("AppliTrack: Apply interaction detected (mousedown)");

        // 3. Scrape immediately
        const details = getIndeedJobDetails();

        // 4. Save
        const jobData = {
            role: details.role.replace(/\n/g, ' ').trim(),
            company: details.company.replace(/\n/g, ' ').trim(),
            url: window.location.href,
            platform: "Indeed",
            date: new Date().toISOString(),
            status: "Applied",
            description: details.desc
        };

        TrackerUtils.saveJobToStorage(jobData);
    }
}, true); // Use Capture Phase