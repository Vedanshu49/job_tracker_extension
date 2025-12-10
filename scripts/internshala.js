console.log("AppliTrack: Internshala Module Loaded");

function getInternshalaDetails() {
    // --- STRATEGY A: MODAL / POPUP (The "Quick View") ---
    // Internshala modals usually exist at the bottom of the DOM when active
    const activeModal = document.querySelector('.modal.in') || 
                        document.querySelector('.modal.show') || 
                        document.querySelector('#application_modal');

    if (activeModal) {
        // Scrape from within the modal context
        const role = activeModal.querySelector('.profile_heading')?.innerText || 
                     activeModal.querySelector('.heading_4_5')?.innerText;
        
        const company = activeModal.querySelector('.company_name')?.innerText || 
                        activeModal.querySelector('.link_display_like_text')?.innerText;

        if (role && company) {
            console.log("AppliTrack: Scraped from Modal");
            return { role, company, desc: "See application link" };
        }
    }

    // --- STRATEGY B: MAIN PAGE (Full View) ---
    const role = document.querySelector('.profile_on_detail_page')?.innerText || 
                 document.querySelector('.heading_4_5.profile')?.innerText;

    const company = document.querySelector('.company_name')?.innerText || 
                    document.querySelector('.link_display_like_text')?.innerText;

    return { 
        role: role || "Unknown Role", 
        company: company || "Unknown Company",
        desc: document.querySelector('.text-container')?.innerText || "" 
    };
}

document.addEventListener('mousedown', (e) => {
    const target = e.target;
    
    // Detect Apply Buttons
    const btn = target.closest('button') || target.closest('a') || target.closest('.btn');
    
    if (!btn) return;

    const text = (btn.innerText || "").toLowerCase();
    const id = (btn.id || "").toLowerCase();

    // Internshala uses "Apply now", "Proceed", "Submit"
    const isApply = text.includes('apply') || 
                    text.includes('proceed') || 
                    text.includes('submit') || 
                    id.includes('apply');

    if (isApply) {
        const details = getInternshalaDetails();

        // Safety Check: Don't save if we couldn't find a Role
        if (details.role === "Unknown Role" && !window.location.href.includes('internship')) {
            return; 
        }

        const jobData = {
            role: details.role.trim(),
            company: details.company.trim(),
            url: window.location.href,
            platform: "Internshala",
            date: new Date().toISOString(),
            status: "Applied",
            description: details.desc
        };

        TrackerUtils.saveJobToStorage(jobData);
    }
}, true);