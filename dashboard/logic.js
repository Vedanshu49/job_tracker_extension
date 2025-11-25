let jobs = [];

document.addEventListener('DOMContentLoaded', () => {
    loadJobs();
    
    // Buttons
    document.getElementById('exportBtn').addEventListener('click', exportToCSV);
    document.getElementById('importBtn').addEventListener('click', triggerImport);
    document.getElementById('importFile').addEventListener('change', handleFileImport);

    // Filters
    document.getElementById('searchInput').addEventListener('input', renderTable);
    document.getElementById('platformFilter').addEventListener('change', renderTable);
    document.getElementById('statusFilter').addEventListener('change', renderTable);

    // Modal Close
    document.querySelector('.close-modal').addEventListener('click', closeDescModal);
    window.onclick = (event) => {
        const modal = document.getElementById('descModal');
        if (event.target === modal) closeDescModal();
    };

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

// --- RENDERING WITH FILTERS ---
function renderTable() {
    const tbody = document.getElementById('jobTableBody');
    const emptyState = document.getElementById('emptyState');
    tbody.innerHTML = '';

    // Get Filter Values
    const searchText = document.getElementById('searchInput').value.toLowerCase();
    const platformFilter = document.getElementById('platformFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;

    // Filter Logic
    const filteredJobs = jobs.filter(job => {
        const matchesSearch = (job.company || '').toLowerCase().includes(searchText) || 
                              (job.role || '').toLowerCase().includes(searchText);
        const matchesPlatform = platformFilter === 'All' || job.platform === platformFilter;
        const matchesStatus = statusFilter === 'All' || job.status === statusFilter;
        
        return matchesSearch && matchesPlatform && matchesStatus;
    });

    if (filteredJobs.length === 0) {
        emptyState.style.display = 'block';
        if (jobs.length > 0) emptyState.innerText = "No jobs match your filters.";
        else emptyState.innerText = "No applications tracked yet.";
        return;
    }
    emptyState.style.display = 'none';

    filteredJobs.forEach((job) => {
        const tr = document.createElement('tr');
        
        // Show "View Desc" link only if description exists
        const descLink = job.description ? `<span class="view-desc-link" data-id="${job.id}">View Desc</span>` : '';

        tr.innerHTML = `
            <td>
                <a href="${job.url}" target="_blank" style="text-decoration:none;">
                    <span class="role-text">${job.role}</span>
                </a>
                <span class="company-text">${job.company}</span>
                ${descLink}
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

// --- EVENT DELEGATION ---
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
        const id = e.target.dataset.id;
        if (e.target.classList.contains('delete-btn')) {
            deleteJob(id);
        }
        // NEW: Handle Description Click
        if (e.target.classList.contains('view-desc-link')) {
            openDescModal(id);
        }
    });
}

// --- UPDATE LOGIC ---
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

function updateStats() {
    document.getElementById('totalCount').innerText = jobs.length;
    document.getElementById('interviewCount').innerText = jobs.filter(j => j.status === 'Interviewing').length;
    document.getElementById('assignmentCount').innerText = jobs.filter(j => j.status === 'Assignment').length;
    document.getElementById('offerCount').innerText = jobs.filter(j => j.status === 'Offer').length;
    document.getElementById('rejectedCount').innerText = jobs.filter(j => j.status === 'Rejected').length;
}

// --- MODAL LOGIC ---
function openDescModal(id) {
    const job = jobs.find(j => j.id === id);
    if (job && job.description) {
        document.getElementById('modalTitle').innerText = `${job.role} at ${job.company}`;
        document.getElementById('modalBody').innerText = job.description;
        document.getElementById('descModal').style.display = 'block';
    }
}

function closeDescModal() {
    document.getElementById('descModal').style.display = 'none';
}

// --- IMPORT / EXPORT LOGIC ---
function exportToCSV() {
    // Added Description to Export
    const headers = ['ID', 'Company', 'Role', 'Date', 'Platform', 'Link', 'Status', 'Notes', 'Offer Details', 'Description'];
    const csvContent = [
      headers.join(','),
      ...jobs.map(job => [
        `"${job.id}"`,
        `"${job.company}"`,
        `"${job.role}"`,
        job.date,
        job.platform,
        job.url,
        job.status,
        `"${(job.note || '').replace(/"/g, '""')}"`,
        `"${(job.offerDetails || '').replace(/"/g, '""')}"`,
        `"${(job.description || '').replace(/"/g, '""').replace(/\n/g, ' ')}"` // Sanitize description
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

function triggerImport() {
    document.getElementById('importFile').click();
}

function handleFileImport(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const text = e.target.result;
        try {
            parseCSVAndMerge(text);
            alert('Import successful! Duplicate URLs were skipped.');
            location.reload(); // Refresh to show data
        } catch (err) {
            console.error(err);
            alert('Error parsing CSV. Please ensure it matches the export format.');
        }
    };
    reader.readAsText(file);
    // Reset input so same file can be selected again
    event.target.value = '';
}

function parseCSVAndMerge(csvText) {
    const lines = csvText.split('\n');
    if (lines.length < 2) return;

    // Simple CSV parser (handles quoted strings)
    const parseLine = (line) => {
        const result = [];
        let startValueIndex = 0;
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
            if (line[i] === '"') inQuotes = !inQuotes;
            else if (line[i] === ',' && !inQuotes) {
                let val = line.substring(startValueIndex, i).trim();
                if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1).replace(/""/g, '"');
                result.push(val);
                startValueIndex = i + 1;
            }
        }
        let lastVal = line.substring(startValueIndex).trim();
        if (lastVal.startsWith('"') && lastVal.endsWith('"')) lastVal = lastVal.slice(1, -1).replace(/""/g, '"');
        result.push(lastVal);
        return result;
    };

    let newJobsCount = 0;

    for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        
        const cols = parseLine(lines[i]);
        // Map columns based on Export header order
        // ID(0), Company(1), Role(2), Date(3), Platform(4), Link(5), Status(6), Notes(7), Offer(8), Desc(9)
        
        const job = {
            id: cols[0] || Date.now() + Math.random().toString(),
            company: cols[1],
            role: cols[2],
            date: cols[3],
            platform: cols[4],
            url: cols[5],
            status: cols[6],
            note: cols[7],
            offerDetails: cols[8],
            description: cols[9] || ""
        };

        // Duplicate Check by URL
        if (!jobs.some(j => j.url === job.url)) {
            jobs.unshift(job);
            newJobsCount++;
        }
    }
    
    if (newJobsCount > 0) saveJobs();
}