document.addEventListener('DOMContentLoaded', () => {
    updateStats();
    
    const openDash = document.getElementById('openDash');
    const refreshBtn = document.getElementById('refreshBtn');
    
    if (openDash) {
        openDash.addEventListener('click', () => {
            chrome.tabs.create({ url: 'chrome-extension://' + chrome.runtime.id + '/dashboard/index.html' });
        });
    }

    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            updateStats();
        });
    }
});

function updateStats() {
    chrome.storage.local.get(['jobs'], (result) => {
        const jobs = result.jobs || [];
        const totalCount = jobs.length;
        
        // Calculate stats
        const interviewCount = jobs.filter(j => j.status === 'Interviewing').length;
        const offerCount = jobs.filter(j => j.status === 'Offer').length;
        
        // Update main counter (with null check)
        const jobCountEl = document.getElementById('jobCount');
        if (jobCountEl) jobCountEl.innerText = totalCount;
        
        // Update quick stats (with null checks)
        const quickInterviewEl = document.getElementById('quickInterview');
        const quickOffersEl = document.getElementById('quickOffers');
        
        if (quickInterviewEl) quickInterviewEl.innerText = interviewCount;
        if (quickOffersEl) quickOffersEl.innerText = offerCount;
        
        // Show recent applications (last 3-5)
        renderRecentApplications(jobs);
    });
}

function renderRecentApplications(jobs) {
    const recentList = document.getElementById('recentList');
    const emptyRecent = document.getElementById('emptyRecent');
    
    if (!recentList || !emptyRecent) return;
    
    if (jobs.length === 0) {
        recentList.style.display = 'none';
        emptyRecent.style.display = 'block';
        return;
    }
    
    // Sort by date (most recent first) and get last 5
    const recent = jobs
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);
    
    recentList.innerHTML = recent.map(job => `
        <div class="recent-app-item">
            <div>
                <div class="recent-app-company">${job.company || 'Unknown'}</div>
                <div class="recent-app-role">${job.role || 'No role'}</div>
            </div>
            <div class="recent-app-date">${formatDate(job.date)}</div>
        </div>
    `).join('');
    
    recentList.style.display = 'block';
    emptyRecent.style.display = 'none';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}