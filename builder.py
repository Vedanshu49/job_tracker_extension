import os

# The name of the main folder
ROOT_DIR = "job-tracker-extension"

# The file contents
files = {
    "manifest.json": """{
  "manifest_version": 3,
  "name": "Job Application Manager",
  "version": "1.0",
  "description": "Track job applications across multiple platforms",
  "permissions": [
    "storage",
    "activeTab",
    "scripting"
  ],
  "action": {
    "default_title": "Open Job Manager",
    "default_popup": "dashboard/index.html"
  },
  "content_scripts": [
    {
      "matches": ["*://*.linkedin.com/*"],
      "js": ["scripts/utils.js", "scripts/linkedin.js"],
      "run_at": "document_idle"
    },
    {
      "matches": ["*://*.indeed.com/*", "*://*.indeed.co.in/*"],
      "js": ["scripts/utils.js", "scripts/indeed.js"],
      "run_at": "document_idle"
    },
    {
      "matches": ["*://internshala.com/*"],
      "js": ["scripts/utils.js", "scripts/internshala.js"],
      "run_at": "document_idle"
    },
    {
      "matches": ["*://*.glassdoor.com/*", "*://*.glassdoor.co.in/*"],
      "js": ["scripts/utils.js", "scripts/glassdoor.js"],
      "run_at": "document_idle"
    }
  ]
}""",

    "dashboard/index.html": """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Job Application Manager</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <header>
            <div class="header-left">
                <h1>My Applications</h1>
                <p>Manage your job search journey</p>
            </div>
            <div class="header-right">
                <button id="exportBtn" class="btn btn-primary">Download CSV</button>
            </div>
        </header>

        <div class="stats-container">
            <div class="stat-card">
                <span class="stat-label">Total Applied</span>
                <span class="stat-value" id="totalCount">0</span>
            </div>
            <div class="stat-card">
                <span class="stat-label">Interviews</span>
                <span class="stat-value" id="interviewCount">0</span>
            </div>
            <div class="stat-card">
                <span class="stat-label">Offers</span>
                <span class="stat-value" id="offerCount">0</span>
            </div>
        </div>

        <div class="table-card">
            <table>
                <thead>
                    <tr>
                        <th>Company & Role</th>
                        <th>Date</th>
                        <th>Platform</th>
                        <th>Status</th>
                        <th>Notes & Offer Details</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="jobTableBody">
                </tbody>
            </table>
            <div id="emptyState" class="empty-state" style="display: none;">
                No applications tracked yet. Go to LinkedIn or Indeed to start.
            </div>
        </div>
    </div>
    <script src="logic.js"></script>
</body>
</html>""",

    "dashboard/style.css": """:root {
    --primary: #2563eb;
    --primary-hover: #1d4ed8;
    --bg: #f8fafc;
    --card: #ffffff;
    --text: #1e293b;
    --border: #e2e8f0;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    background-color: var(--bg);
    color: var(--text);
    margin: 0;
    padding: 24px;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
}

header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32px;
}

h1 {
    margin: 0;
    font-size: 24px;
    font-weight: 700;
}

p {
    margin: 4px 0 0;
    color: #64748b;
    font-size: 14px;
}

.btn {
    padding: 10px 20px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    font-weight: 600;
    font-size: 14px;
    transition: all 0.2s;
}

.btn-primary {
    background: var(--primary);
    color: white;
}

.btn-primary:hover {
    background: var(--primary-hover);
}

.btn-danger {
    background: transparent;
    color: #ef4444;
    padding: 6px;
    cursor: pointer;
    border: 1px solid #ef4444;
    border-radius: 4px;
}

.btn-danger:hover {
    background: #fee2e2;
}

.stats-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    margin-bottom: 24px;
}

.stat-card {
    background: var(--card);
    padding: 20px;
    border-radius: 12px;
    border: 1px solid var(--border);
    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}

.stat-label {
    display: block;
    font-size: 13px;
    color: #64748b;
    font-weight: 500;
    margin-bottom: 8px;
}

.stat-value {
    font-size: 24px;
    font-weight: 700;
    color: var(--text);
}

.table-card {
    background: var(--card);
    border-radius: 12px;
    border: 1px solid var(--border);
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    overflow: hidden;
}

table {
    width: 100%;
    border-collapse: collapse;
}

th {
    background: #f1f5f9;
    padding: 16px 24px;
    text-align: left;
    font-size: 12px;
    text-transform: uppercase;
    color: #64748b;
    font-weight: 600;
    border-bottom: 1px solid var(--border);
}

td {
    padding: 16px 24px;
    border-bottom: 1px solid var(--border);
    vertical-align: top;
}

tr:last-child td {
    border-bottom: none;
}

.role-text {
    font-weight: 600;
    color: var(--text);
    display: block;
    margin-bottom: 4px;
}

.company-text {
    font-size: 13px;
    color: #64748b;
}

.platform-badge {
    display: inline-block;
    padding: 4px 8px;
    background: #f1f5f9;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 500;
    color: #475569;
}

select {
    padding: 6px 12px;
    border-radius: 6px;
    border: 1px solid var(--border);
    font-size: 13px;
    background: white;
    cursor: pointer;
    width: 100%;
}

textarea {
    width: 100%;
    padding: 8px;
    border: 1px solid var(--border);
    border-radius: 6px;
    font-family: inherit;
    font-size: 13px;
    resize: vertical;
    min-height: 40px;
    margin-bottom: 8px;
}

.offer-box {
    background: #ecfdf5;
    border: 1px solid #6ee7b7;
    padding: 8px;
    border-radius: 6px;
    margin-top: 8px;
}

.offer-label {
    font-size: 11px;
    font-weight: 700;
    color: #059669;
    margin-bottom: 4px;
    display: block;
}

.offer-input {
    width: 100%;
    border: 1px solid #a7f3d0;
    border-radius: 4px;
    padding: 4px 8px;
    font-size: 12px;
}

.empty-state {
    padding: 48px;
    text-align: center;
    color: #94a3b8;
}""",

    "dashboard/logic.js": """let jobs = [];

document.addEventListener('DOMContentLoaded', () => {
    loadJobs();
    document.getElementById('exportBtn').addEventListener('click', exportToCSV);
});

function loadJobs() {
    chrome.storage.local.get(['jobs'], (result) => {
        jobs = result.jobs || [];
        renderTable();
        updateStats();
    });
}

function saveJobs() {
    chrome.storage.local.set({ jobs: jobs }, () => {
        updateStats();
    });
}

function renderTable() {
    const tbody = document.getElementById('jobTableBody');
    const emptyState = document.getElementById('emptyState');
    tbody.innerHTML = '';

    if (jobs.length === 0) {
        emptyState.style.display = 'block';
        return;
    }
    emptyState.style.display = 'none';

    jobs.forEach((job, index) => {
        const tr = document.createElement('tr');
        
        tr.innerHTML = `
            <td>
                <a href="${job.url}" target="_blank" style="text-decoration:none;">
                    <span class="role-text">${job.role}</span>
                </a>
                <span class="company-text">${job.company}</span>
            </td>
            <td style="font-size: 13px; color: #64748b;">${new Date(job.date).toLocaleDateString()}</td>
            <td><span class="platform-badge">${job.platform}</span></td>
            <td style="width: 160px;">
                <select onchange="window.updateJobStatus(${index}, this.value)">
                    <option value="Applied" ${job.status === 'Applied' ? 'selected' : ''}>Applied</option>
                    <option value="Interviewing" ${job.status === 'Interviewing' ? 'selected' : ''}>Interviewing</option>
                    <option value="Assignment" ${job.status === 'Assignment' ? 'selected' : ''}>Assignment</option>
                    <option value="Offer" ${job.status === 'Offer' ? 'selected' : ''}>Offer</option>
                    <option value="Rejected" ${job.status === 'Rejected' ? 'selected' : ''}>Rejected</option>
                </select>
            </td>
            <td style="width: 300px;">
                <textarea placeholder="Add notes..." onchange="window.updateNotes(${index}, this.value)">${job.note || ''}</textarea>
                ${job.status === 'Offer' ? `
                <div class="offer-box">
                    <span class="offer-label">OFFER DETAILS</span>
                    <input type="text" class="offer-input" placeholder="CTC, Joining Date..." 
                           value="${job.offerDetails || ''}" 
                           onchange="window.updateOfferDetails(${index}, this.value)">
                </div>
                ` : ''}
            </td>
            <td>
                <button class="btn btn-danger" onclick="window.deleteJob(${index})">✕</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function updateStats() {
    document.getElementById('totalCount').innerText = jobs.length;
    document.getElementById('interviewCount').innerText = jobs.filter(j => j.status === 'Interviewing').length;
    document.getElementById('offerCount').innerText = jobs.filter(j => j.status === 'Offer').length;
}

function exportToCSV() {
    const headers = ['Company', 'Role', 'Date', 'Platform', 'Link', 'Status', 'Notes', 'Offer Details'];
    const csvContent = [
      headers.join(','),
      ...jobs.map(job => [
        `"${job.company}"`,
        `"${job.role}"`,
        job.date,
        job.platform,
        job.url,
        job.status,
        `"${(job.note || '').replace(/"/g, '""')}"`,
        `"${(job.offerDetails || '').replace(/"/g, '""')}"`
      ].join(','))
    ].join('\\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'my_job_applications.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Make functions global for HTML onclick events
window.updateJobStatus = (index, newStatus) => {
    jobs[index].status = newStatus;
    saveJobs();
    renderTable(); 
};

window.updateNotes = (index, val) => {
    jobs[index].note = val;
    saveJobs();
};

window.updateOfferDetails = (index, val) => {
    jobs[index].offerDetails = val;
    saveJobs();
};

window.deleteJob = (index) => {
    if(confirm('Delete this application?')) {
        jobs.splice(index, 1);
        saveJobs();
        renderTable(); 
    }
};""",

    "scripts/utils.js": """// Shared Utility Functions
const Utils = {
    log: (msg) => console.log(`[Job Tracker] ${msg}`),
    
    // Helper to scrape common meta tags if specific selectors fail
    getMeta: (propName) => {
        const meta = document.querySelector(`meta[property="${propName}"]`) || document.querySelector(`meta[name="${propName}"]`);
        return meta ? meta.content : '';
    },

    saveJobToStorage: (jobData) => {
        chrome.storage.local.get(['jobs'], (result) => {
            const jobs = result.jobs || [];
            
            // Duplicate Check (by URL)
            const exists = jobs.some(j => j.url === jobData.url);
            if (exists) {
                Utils.log("Job already tracked.");
                return;
            }

            jobs.unshift(jobData); // Add to top
            chrome.storage.local.set({ jobs: jobs }, () => {
                Utils.log("Job saved successfully!");
                alert(`Job Tracker: Saved application for ${jobData.company}`);
            });
        });
    }
};""",

    "scripts/linkedin.js": """// LinkedIn Specific Logic
console.log("Job Tracker: LinkedIn Module Loaded");

// Example listener (You will refine this logic as we go)
document.addEventListener('click', (e) => {
    // Logic to detect "Easy Apply" or "Apply" buttons
    const btn = e.target.closest('button');
    if (btn && (btn.innerText.includes('Apply') || btn.innerText.includes('Easy Apply'))) {
        
        // Basic scraping attempt
        const jobTitle = document.querySelector('.job-details-jobs-unified-top-card__job-title')?.innerText || "Unknown Role";
        const company = document.querySelector('.job-details-jobs-unified-top-card__company-name')?.innerText || "Unknown Company";

        const jobData = {
            role: jobTitle,
            company: company,
            url: window.location.href,
            platform: "LinkedIn",
            date: new Date().toISOString(),
            status: "Applied"
        };

        Utils.saveJobToStorage(jobData);
    }
});""",

    "scripts/indeed.js": """// Indeed Specific Logic
console.log("Job Tracker: Indeed Module Loaded");

// Logic placeholder for Indeed
""",

    "scripts/internshala.js": """// Internshala Specific Logic
console.log("Job Tracker: Internshala Module Loaded");

// Logic placeholder for Internshala
""",

    "scripts/glassdoor.js": """// Glassdoor Specific Logic
console.log("Job Tracker: Glassdoor Module Loaded");

// Logic placeholder for Glassdoor
"""
}

def create_project():
    print(f"Creating project in: {ROOT_DIR}")
    
    if not os.path.exists(ROOT_DIR):
        os.makedirs(ROOT_DIR)

    for file_path, content in files.items():
        full_path = os.path.join(ROOT_DIR, file_path)
        
        # Create directory if it doesn't exist
        os.makedirs(os.path.dirname(full_path), exist_ok=True)
        
        # Write content
        with open(full_path, "w", encoding="utf-8") as f:
            f.write(content)
            
        print(f"Created: {file_path}")

    print("\\nSUCCESS! Project created.")
    print(f"1. Open Chrome and go to chrome://extensions")
    print(f"2. Enable 'Developer Mode' (top right)")
    print(f"3. Click 'Load unpacked' and select the '{ROOT_DIR}' folder.")

if __name__ == "__main__":
    create_project()