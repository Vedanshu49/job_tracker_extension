const RemindersModule = {
    render: (jobs) => {
        const list = document.getElementById('remindersList');
        list.innerHTML = '';

        const now = new Date();
        const sevenDaysAgo = new Date(now.setDate(now.getDate() - 7));

        const staleJobs = jobs.filter(j => {
            return j.status === 'Applied' && new Date(j.date) < sevenDaysAgo;
        });

        if (staleJobs.length === 0) {
            list.innerHTML = '<div style="text-align:center; padding:20px; color:#64748b;">No follow-ups needed! Great job.</div>';
            return;
        }

        staleJobs.forEach(job => {
            const subject = encodeURIComponent(`Application Follow-up: ${job.role} - ${job.company}`);
            const body = encodeURIComponent(`Dear Hiring Team at ${job.company},\n\nI applied for the ${job.role} position last week and wanted to reiterate my strong interest...\n\nBest,\n[Your Name]`);
            const mailto = `mailto:?subject=${subject}&body=${body}`;

            const item = document.createElement('div');
            item.className = 'reminder-item';
            item.innerHTML = `
                <div class="reminder-info">
                    <h4>${job.role} @ ${job.company}</h4>
                    <p>Applied on: ${new Date(job.date).toLocaleDateString()}</p>
                </div>
                <a href="${mailto}" class="btn-email">Send Email</a>
            `;
            list.appendChild(item);
        });
    }
};