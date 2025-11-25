console.log("Job Tracker: Internshala Module Loaded");

document.addEventListener('click', (e) => {
    const target = e.target;
    const isApplyBtn = target.innerText.includes('Apply') || 
                       target.id === 'apply_now_button' ||
                       target.closest('#apply_now_button');

    if (isApplyBtn) {
        const jobTitle = document.querySelector('.profile_on_detail_page')?.innerText || 
                         document.querySelector('.heading_4_5.profile')?.innerText || 
                         "Unknown Role";

        const company = document.querySelector('.company_name .link_display_like_text')?.innerText || 
                        document.querySelector('.heading_6.company_name')?.innerText || 
                        document.querySelector('.link_display_like_text')?.innerText || 
                        "Unknown Company";

        const jobData = {
            role: jobTitle.trim(),
            company: company.trim(),
            url: window.location.href,
            platform: "Internshala",
            date: new Date().toISOString(),
            status: "Applied"
        };

        TrackerUtils.saveJobToStorage(jobData);
    }
});