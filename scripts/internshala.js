console.log("AppliTrack: Internshala Module Loaded");

document.addEventListener('click', (e) => {
    const target = e.target;
    
    // 1. Detect "Apply" button OR "Submit" button inside a modal/popup
    const isApplyBtn = target.innerText.includes('Apply') || 
                       target.innerText.includes('Submit') ||
                       target.id === 'apply_now_button' ||
                       target.closest('#apply_now_button') ||
                       target.closest('.modal-footer button') ||
                       target.closest('.btn-primary'); // Generic modal button

    if (isApplyBtn) {
        
        // --- STRATEGY A: Check for MODAL/POPUP Details first (The "Shortcut" View) ---
        let jobTitle = document.querySelector('.modal-content .profile_heading')?.innerText ||
                       document.querySelector('.modal-header .heading_4_5')?.innerText;

        let company = document.querySelector('.modal-content .company_name')?.innerText ||
                      document.querySelector('.modal-content .link_display_like_text')?.innerText;

        let desc = document.querySelector('.modal-content .text-container')?.innerText;

        // --- STRATEGY B: Fallback to MAIN PAGE Details (The "Full" View) ---
        if (!jobTitle) {
            jobTitle = document.querySelector('.profile_on_detail_page')?.innerText || 
                       document.querySelector('.heading_4_5.profile')?.innerText || 
                       "Unknown Role";
        }

        if (!company) {
            company = document.querySelector('.company_name .link_display_like_text')?.innerText || 
                      document.querySelector('.heading_6.company_name')?.innerText || 
                      document.querySelector('.link_display_like_text')?.innerText || 
                      "Unknown Company";
        }

        if (!desc) {
            desc = document.querySelector('.text-container')?.innerText || "";
        }

        const jobData = {
            role: jobTitle.trim(),
            company: company.trim(),
            url: window.location.href,
            platform: "Internshala",
            date: new Date().toISOString(),
            status: "Applied",
            description: desc
        };

        TrackerUtils.saveJobToStorage(jobData);
    }
});