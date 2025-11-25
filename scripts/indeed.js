console.log("Job Tracker: Indeed Module Loaded");

document.addEventListener('click', (e) => {
    const btn = e.target.closest('button') || e.target.closest('a');
    if (btn && (btn.innerText.includes('Apply now') || btn.ariaLabel?.includes('Apply'))) {
        
        const jobTitle = document.querySelector('h1.jobsearch-JobInfoHeader-title')?.innerText || "Unknown Role";
        const company = document.querySelector('[data-company-name="true"]')?.innerText || "Unknown Company";

        const jobData = {
            role: jobTitle,
            company: company,
            url: window.location.href,
            platform: "Indeed",
            date: new Date().toISOString(),
            status: "Applied"
        };

        Utils.saveJobToStorage(jobData);
    }
});