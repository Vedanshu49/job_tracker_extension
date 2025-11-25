const KanbanModule = {
    render: (jobs) => {
        const board = document.getElementById('kanbanBoard');
        board.innerHTML = '';

        const columns = ['Applied', 'Interviewing', 'Assignment', 'Offer', 'Rejected'];

        columns.forEach(status => {
            const col = document.createElement('div');
            col.className = 'kanban-column';
            col.innerHTML = `<h3>${status} <span style="font-weight:normal; font-size:12px">(${jobs.filter(j => j.status === status).length})</span></h3>`;
            
            // Drop Zone Logic
            col.ondragover = (e) => e.preventDefault();
            col.ondrop = (e) => KanbanModule.handleDrop(e, status);

            const filtered = jobs.filter(j => j.status === status);
            filtered.forEach(job => {
                const card = document.createElement('div');
                card.className = 'kanban-card';
                card.draggable = true;
                card.innerHTML = `
                    <span class="k-role">${job.role}</span>
                    <span class="k-company">${job.company}</span>
                `;
                card.ondragstart = (e) => e.dataTransfer.setData('text/plain', job.id);
                col.appendChild(card);
            });

            board.appendChild(col);
        });
    },

    handleDrop: (e, newStatus) => {
        e.preventDefault();
        const jobId = e.dataTransfer.getData('text/plain');
        
        // Call global update function from dashboard/logic.js
        if (window.updateJobStatus) {
            window.updateJobStatus(jobId, newStatus);
            
            // Re-render Kanban immediately to show change
            // We need to fetch latest jobs state
            chrome.storage.local.get(['jobs'], (result) => {
                KanbanModule.render(result.jobs || []);
            });
        }
    }
};