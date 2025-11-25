let jobs = [];

document.addEventListener('DOMContentLoaded', () => {
    loadJobs();
    document.getElementById('exportBtn').addEventListener('click', exportToCSV);
    setupTableEventListeners();
});

function loadJobs() {
    chrome.storage.local.get(['jobs'], (result) => {
        jobs = result.jobs || [];
        
        // ID Migration Check
        let needsSave = false;
        jobs.forEach(job => {
            if (!job.id) {
                job.id = Date.now() + Math.random().toString(16).slice(2);
                needsSave = true;
            }
        });
        
        if (needsSave) saveJobs();

        renderTable();
        updateStats();
    });
}

function saveJobs() {
    chrome.storage.local.set({ jobs: jobs }, () => {
        if (chrome.runtime.lastError) {
            console.error("Save failed:", chrome.runtime.lastError);
        }
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

    jobs.forEach((job) => {
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
                <select class="status-select" data-id="${job.id}">
                    <option value="Applied" ${job.status === 'Applied' ? 'selected' : ''}>Applied</option>
                    <option value="Interviewing" ${job.status === 'Interviewing' ? 'selected' : ''}>Interviewing</option>
                    <option value="Assignment" ${job.status === 'Assignment' ? 'selected' : ''}>Assignment</option>
                    <option value="Offer" ${job.status === 'Offer' ? 'selected' : ''}>Offer</option>
                    <option value="Rejected" ${job.status === 'Rejected' ? 'selected' : ''}>Rejected</option>
                </select>
            </td>
            <td style="width: 300px;">
                <textarea class="notes-input" data-id="${job.id}" placeholder="Add notes...">${job.note || ''}</textarea>
                ${job.status === 'Offer' ? `
                <div class="offer-box">
                    <span class="offer-label">OFFER DETAILS</span>
                    <input type="text" class="offer-input" data-id="${job.id}" placeholder="CTC, Joining Date..." 
                           value="${job.offerDetails || ''}">
                </div>
                ` : ''}
            </td>
            <td>
                <button class="btn btn-danger delete-btn" data-id="${job.id}">✕</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Event Delegation
function setupTableEventListeners() {
    const tbody = document.getElementById('jobTableBody');

    tbody.addEventListener('change', (e) => {
        const id = e.target.dataset.id;
        if (!id) return;

        if (e.target.classList.contains('status-select')) {
            updateJobStatus(id, e.target.value);
        } 
        else if (e.target.classList.contains('notes-input')) {
            updateNotes(id, e.target.value);
        } 
        else if (e.target.classList.contains('offer-input')) {
            updateOfferDetails(id, e.target.value);
        }
    });

    tbody.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-btn')) {
            const id = e.target.dataset.id;
            deleteJob(id);
        }
    });
}

function updateJobStatus(id, newStatus) {
    const job = jobs.find(j => j.id === id);
    if (job) {
        job.status = newStatus;
        updateStats();
        saveJobs();
        renderTable(); 
    }
}

function updateNotes(id, val) {
    const job = jobs.find(j => j.id === id);
    if (job) {
        job.note = val;
        saveJobs();
    }
}

function updateOfferDetails(id, val) {
    const job = jobs.find(j => j.id === id);
    if (job) {
        job.offerDetails = val;
        saveJobs();
    }
}

function deleteJob(id) {
    if(confirm('Delete this application?')) {
        jobs = jobs.filter(j => j.id !== id);
        updateStats();
        saveJobs();
        renderTable(); 
    }
}

// --- UPDATED STATS FUNCTION ---
function updateStats() {
    document.getElementById('totalCount').innerText = jobs.length;
    document.getElementById('interviewCount').innerText = jobs.filter(j => j.status === 'Interviewing').length;
    document.getElementById('assignmentCount').innerText = jobs.filter(j => j.status === 'Assignment').length;
    document.getElementById('offerCount').innerText = jobs.filter(j => j.status === 'Offer').length;
    document.getElementById('rejectedCount').innerText = jobs.filter(j => j.status === 'Rejected').length;
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
    ].join('\n');

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