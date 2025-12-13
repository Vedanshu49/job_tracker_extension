if (!window.RemindersModule) {
    window.RemindersModule = {
        render: (jobs) => {
            const list = document.getElementById('remindersList');
            if (!list) {
                console.error("remindersList element not found");
                return;
            }
            list.textContent = ''; // Safe clear

            const now = new Date();
            const sevenDaysAgo = new Date(now.setDate(now.getDate() - 7));

            const staleJobs = jobs.filter(j => {
                return j.status === 'Applied' && new Date(j.date) < sevenDaysAgo;
            });

            if (staleJobs.length === 0) {
                const emptyDiv = document.createElement('div');
                Object.assign(emptyDiv.style, {
                    textAlign: 'center',
                    padding: '20px',
                    color: '#64748b'
                });
                emptyDiv.textContent = 'No follow-ups needed! Great job.';
                list.appendChild(emptyDiv);
                return;
            }

            staleJobs.forEach(job => {
                const subject = encodeURIComponent(`Application Follow-up: ${job.role} - ${job.company}`);
                const body = encodeURIComponent(`Dear Hiring Team at ${job.company},\n\nI applied for the ${job.role} position last week and wanted to reiterate my strong interest...\n\nBest,\n[Your Name]`);
                const mailto = `mailto:?subject=${subject}&body=${body}`;

                const item = document.createElement('div');
                item.className = 'reminder-item';

                const infoDiv = document.createElement('div');
                infoDiv.className = 'reminder-info';

                const h4 = document.createElement('h4');
                h4.textContent = `${job.role} @ ${job.company}`;
                
                const p = document.createElement('p');
                p.textContent = `Applied on: ${new Date(job.date).toLocaleDateString()}`;

                infoDiv.appendChild(h4);
                infoDiv.appendChild(p);

                const btn = document.createElement('a');
                btn.href = mailto;
                btn.className = 'btn-email';
                btn.textContent = 'Send Email';

                item.appendChild(infoDiv);
                item.appendChild(btn);
                list.appendChild(item);
            });
        }
    };
}