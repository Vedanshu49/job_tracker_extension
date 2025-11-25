console.log("Job Tracker: Internshala Module Loaded");

document.addEventListener('click', (e) => {
    if (e.target.innerText.includes('Apply now') || e.target.id === 'apply_now_button') {
        
        const jobTitle = document.querySelector('.profile_on_detail_page')?.innerText || "Unknown Role";
        const company = document.querySelector('.link_display_like_text')?.innerText || "Unknown Company";

        const jobData = {
            role: jobTitle,
            company: company,
            url: window.location.href,
            platform: "Internshala",
            date: new Date().toISOString(),
            status: "Applied"
        };

        Utils.saveJobToStorage(jobData);
    }
});