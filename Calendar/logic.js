if (!window.CalendarModule) {
    window.CalendarModule = {
        createButton: (job) => {
            // Only show for Interviewing status
            if (job.status !== 'Interviewing') return null;
            
            // Create DOM Element instead of string
            const btn = document.createElement('button');
            btn.className = 'btn-calendar';
            btn.dataset.id = job.id;
            btn.textContent = '📅 Add to Calendar';
            
            return btn;
        },

        generateICS: (job) => {
            // Create a simple event for tomorrow at 10 AM
            const now = new Date();
            const tomorrow = new Date(now);
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(10, 0, 0);
            
            const dateStr = tomorrow.toISOString().replace(/-|:|\.\d\d\d/g, "");

            const icsContent = 
`BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
URL:${job.url}
DTSTART:${dateStr}
SUMMARY:Interview: ${job.role} at ${job.company}
DESCRIPTION:Notes: ${job.note || ''} | URL: ${job.url}
END:VEVENT
END:VCALENDAR`;

            const blob = new Blob([icsContent], { type: 'text/calendar' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `Interview_${job.company}.ics`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };
}