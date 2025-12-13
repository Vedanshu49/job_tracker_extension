if (!window.KanbanModule) {
    window.KanbanModule = {
        render: (jobs) => {
            const board = document.getElementById('kanbanBoard');
            if (!board) {
                console.error("kanbanBoard element not found");
                return;
            }
            board.textContent = ''; // Safe clear

            const columns = ['Applied', 'Interviewing', 'Assignment', 'Offer', 'Rejected'];

            columns.forEach(status => {
                const count = jobs.filter(j => j.status === status).length;

                const col = document.createElement('div');
                col.className = 'kanban-column';
                
                // Header
                const h3 = document.createElement('h3');
                h3.textContent = status + ' ';
                const countSpan = document.createElement('span');
                countSpan.style.fontWeight = 'normal';
                countSpan.style.fontSize = '12px';
                countSpan.textContent = `(${count})`;
                h3.appendChild(countSpan);
                col.appendChild(h3);
                
                // Drop Zone Logic
                col.ondragover = (e) => e.preventDefault();
                col.ondrop = (e) => window.KanbanModule.handleDrop(e, status);

                const filtered = jobs.filter(j => j.status === status);
                filtered.forEach(job => {
                    const card = document.createElement('div');
                    card.className = 'kanban-card';
                    card.draggable = true;
                    
                    const roleSpan = document.createElement('span');
                    roleSpan.className = 'k-role';
                    roleSpan.textContent = job.role;
                    
                    const compSpan = document.createElement('span');
                    compSpan.className = 'k-company';
                    compSpan.textContent = job.company;

                    card.appendChild(roleSpan);
                    card.appendChild(compSpan);
                    
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
                    window.KanbanModule.render(result.jobs || []);
                });
            }
        }
    };
}