if (!window.appState) {
    window.appState = {
        jobs: []
    };
}

let jobs = window.appState.jobs;

document.addEventListener('DOMContentLoaded', () => {
    loadJobs();
    
    // --- EXISTING BUTTONS (Safe handlers) ---
    const exportBtn = document.getElementById('exportBtn');
    const importBtn = document.getElementById('importBtn');
    const importFile = document.getElementById('importFile');
    const saveDotBtn = document.getElementById('saveDotBtn');
    const deleteBtn = document.getElementById('deleteBtn');
    
    if (exportBtn) exportBtn.addEventListener('click', exportToCSV);
    if (importBtn) importBtn.addEventListener('click', triggerImport);
    if (importFile) importFile.addEventListener('change', handleFileImport);
    if (saveDotBtn) saveDotBtn.addEventListener('click', saveDescriptionModal);
    if (deleteBtn) deleteBtn.addEventListener('click', deleteJobFromModal);

    // --- FILTERS ---
    const searchInput = document.getElementById('searchInput');
    const platformFilter = document.getElementById('platformFilter');
    const statusFilter = document.getElementById('statusFilter');
    
    if (searchInput) searchInput.addEventListener('input', renderTable);
    if (platformFilter) platformFilter.addEventListener('change', renderTable);
    if (statusFilter) statusFilter.addEventListener('change', renderTable);

    // --- NEW FEATURE BUTTONS (Open Modals) ---
    const btnAnalytics = document.getElementById('btnAnalytics');
    const btnKanban = document.getElementById('btnKanban');
    const btnReminders = document.getElementById('btnReminders');
    
    if (btnAnalytics) {
        btnAnalytics.addEventListener('click', () => {
            document.getElementById('analyticsContainer').style.display = 'block';
            if (window.AnalyticsModule) window.AnalyticsModule.render(jobs);
        });
    }

    if (btnKanban) {
        btnKanban.addEventListener('click', () => {
            document.getElementById('kanbanContainer').style.display = 'block';
            if (window.KanbanModule) window.KanbanModule.render(jobs);
        });
    }

    if (btnReminders) {
        btnReminders.addEventListener('click', () => {
            document.getElementById('remindersContainer').style.display = 'block';
            if (window.RemindersModule) window.RemindersModule.render(jobs);
        });
    }

    // --- CLOSE MODALS (Features & Description) ---
    document.querySelectorAll('.close-feature').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = e.target.closest('.feature-modal');
            if (modal) modal.style.display = 'none';
            // Refresh table when closing Kanban in case drag-drop changed statuses
            loadJobs(); 
        });
    });

    const closeModal = document.querySelector('.close-modal');
    if (closeModal) closeModal.addEventListener('click', closeDescModal);
    
    window.onclick = (event) => {
        const modal = document.getElementById('descModal');
        if (modal && event.target === modal) closeDescModal();
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
    const tbody = document.getElementById('jobsTableBody');
    if (!tbody) {
        console.error("jobsTableBody element not found");
        return;
    }
    tbody.innerHTML = '';

    // Get Filter Values
    const searchInput = document.getElementById('searchInput');
    const platformFilter = document.getElementById('platformFilter');
    const statusFilter = document.getElementById('statusFilter');
    
    const searchText = searchInput ? searchInput.value.toLowerCase() : '';
    const platformVal = platformFilter ? platformFilter.value : '';
    const statusVal = statusFilter ? statusFilter.value : '';

    // Filter Logic
    const filteredJobs = jobs.filter(job => {
        const matchesSearch = (job.company || '').toLowerCase().includes(searchText) || 
                              (job.role || '').toLowerCase().includes(searchText);
        const matchesPlatform = platformVal === '' || job.platform === platformVal;
        const matchesStatus = statusVal === '' || job.status === statusVal;
        
        return matchesSearch && matchesPlatform && matchesStatus;
    });

    // Show empty state if no jobs
    if (filteredJobs.length === 0) {
        if (jobs.length > 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 40px; color: #64748b;">No jobs match your filters.</td></tr>';
        } else {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 40px; color: #64748b;">No applications tracked yet. Start by visiting job boards to auto-track!</td></tr>';
        }
        return;
    }

    filteredJobs.forEach((job) => {
        const tr = document.createElement('tr');
        
        // Show "View Desc" link only if description exists
        const descLink = job.description ? `<span class="view-desc-link" data-id="${job.id}">View Desc</span>` : '';

        // NEW: Generate Calendar Button HTML
        const calendarBtn = (typeof CalendarModule !== 'undefined') ? CalendarModule.createButton(job) : '';

        tr.innerHTML = `
            <td class="td-company-position">
                <a href="${job.url}" target="_blank" style="text-decoration:none;">
                    <span class="role-text">${job.role}</span>
                </a>
                <span class="company-text">${job.company}</span>
                ${descLink}
            </td>
            <td class="td-date">${new Date(job.date).toLocaleDateString()}</td>
            <td class="td-platform"><span class="platform-badge">${job.platform}</span></td>
            <td class="td-status">
                <select class="status-select" data-id="${job.id}">
                    <option value="Applied" ${job.status === 'Applied' ? 'selected' : ''}>Applied</option>
                    <option value="Interviewing" ${job.status === 'Interviewing' ? 'selected' : ''}>Interviewing</option>
                    <option value="Assignment" ${job.status === 'Assignment' ? 'selected' : ''}>Assignment</option>
                    <option value="Offer" ${job.status === 'Offer' ? 'selected' : ''}>Offer</option>
                    <option value="Rejected" ${job.status === 'Rejected' ? 'selected' : ''}>Rejected</option>
                </select>
                ${calendarBtn}
            </td>
            <td class="td-notes">
                <textarea class="notes-input" data-id="${job.id}" placeholder="Add notes...">${job.note || ''}</textarea>
                ${job.status === 'Offer' ? `
                <div class="offer-box">
                    <span class="offer-label">OFFER DETAILS</span>
                    <input type="text" class="offer-input" data-id="${job.id}" placeholder="CTC, Joining Date..." 
                           value="${job.offerDetails || ''}">
                </div>
                ` : ''}
            </td>
            <td class="td-actions">
                <button class="btn btn-danger delete-btn" data-id="${job.id}">✕</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// --- EVENT DELEGATION ---
function setupTableEventListeners() {
    const tbody = document.getElementById('jobsTableBody');
    if (!tbody) {
        console.error("jobsTableBody element not found");
        return;
    }

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
        
        // Delete
        if (e.target.classList.contains('delete-btn')) {
            deleteJob(id);
        }
        // Description
        if (e.target.classList.contains('view-desc-link')) {
            openDescModal(id);
        }
        // NEW: Calendar Button
        if (e.target.classList.contains('btn-calendar')) {
            const job = jobs.find(j => j.id === id);
            if(job && typeof CalendarModule !== 'undefined') CalendarModule.generateICS(job);
        }
    });
}

// --- UPDATE LOGIC (Attached to window for Kanban access) ---
window.updateJobStatus = (id, newStatus) => {
    const job = jobs.find(j => j.id === id);
    if (job) {
        job.status = newStatus;
        updateStats();
        saveJobs();
        renderTable(); 
    }
};

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
    const totalAppsEl = document.getElementById('totalApplications');
    const interviewEl = document.getElementById('totalInterviews');
    const offersEl = document.getElementById('totalOffers');
    const rejectedEl = document.getElementById('totalRejected');
    const pendingEl = document.getElementById('pendingApplications');
    
    if (totalAppsEl) totalAppsEl.innerText = jobs.length;
    if (interviewEl) interviewEl.innerText = jobs.filter(j => j.status === 'Interviewing').length;
    if (offersEl) offersEl.innerText = jobs.filter(j => j.status === 'Offer').length;
    if (rejectedEl) rejectedEl.innerText = jobs.filter(j => j.status === 'Rejected').length;
    if (pendingEl) pendingEl.innerText = jobs.filter(j => j.status === 'Applied').length;
}

// --- MODAL LOGIC ---
function openDescModal(id) {
    const job = jobs.find(j => j.id === id);
    if (!job) return;
    
    const modal = document.getElementById('descModal');
    if (!modal) return;
    
    const companyEl = document.getElementById('descCompany');
    const positionEl = document.getElementById('descPosition');
    const platformEl = document.getElementById('descPlatform');
    const dateEl = document.getElementById('descDate');
    const statusEl = document.getElementById('descStatus');
    const textEl = document.getElementById('descText');
    
    if (companyEl) companyEl.innerText = job.company || '';
    if (positionEl) positionEl.innerText = job.role || '';
    if (platformEl) platformEl.innerText = job.platform || '';
    if (dateEl) dateEl.innerText = new Date(job.date).toLocaleDateString() || '';
    if (statusEl) statusEl.innerText = job.status || '';
    if (textEl) textEl.value = job.description || '';
    
    // Store current job ID for save
    window.currentJobId = id;
    modal.style.display = 'block';
}

function closeDescModal() {
    const modal = document.getElementById('descModal');
    if (modal) modal.style.display = 'none';
}

function saveDescriptionModal() {
    const jobId = window.currentJobId;
    if (!jobId) return;
    
    const textEl = document.getElementById('descText');
    if (!textEl) return;
    
    const job = jobs.find(j => j.id === jobId);
    if (job) {
        job.description = textEl.value;
        saveJobs();
        closeDescModal();
        alert('Description saved successfully!');
    }
}

function deleteJobFromModal() {
    const jobId = window.currentJobId;
    if (!jobId) return;
    
    if (confirm('Are you sure you want to delete this job entry?')) {
        jobs = jobs.filter(j => j.id !== jobId);
        saveJobs();
        closeDescModal();
        renderTable();
        updateStats();
    }
}

// --- IMPORT / EXPORT LOGIC ---
function exportToCSV() {
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
        `"${(job.description || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`
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
            location.reload(); 
        } catch (err) {
            console.error(err);
            alert('Error parsing CSV. Please ensure it matches the export format.');
        }
    };
    reader.readAsText(file);
    event.target.value = '';
}

function parseCSVAndMerge(csvText) {
    const lines = csvText.split('\n');
    if (lines.length < 2) return;

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
        // Schema: ID(0), Company(1), Role(2), Date(3), Platform(4), Link(5), Status(6), Notes(7), Offer(8), Desc(9)
        
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