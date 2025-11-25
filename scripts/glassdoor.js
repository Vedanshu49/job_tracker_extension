console.log("Job Tracker: Glassdoor Module Loaded");

document.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (btn && btn.innerText.includes('Apply')) {
        
        const jobTitle = document.querySelector('[data-test="job-title"]')?.innerText || "Unknown Role";
        const company = document.querySelector('[data-test="employer-name"]')?.innerText || "Unknown Company";

        const jobData = {
            role: jobTitle,
            company: company,
            url: window.location.href,
            platform: "Glassdoor",
            date: new Date().toISOString(),
            status: "Applied"
        };

        Utils.saveJobToStorage(jobData);
    }
});