const AnalyticsModule = {
    charts: {},

    render: (jobs) => {
        const platformCtx = document.getElementById('platformChart').getContext('2d');
        const statusCtx = document.getElementById('statusChart').getContext('2d');

        // Destroy old charts if they exist
        if (AnalyticsModule.charts.platform) AnalyticsModule.charts.platform.destroy();
        if (AnalyticsModule.charts.status) AnalyticsModule.charts.status.destroy();

        // 1. Process Platform Data
        const platforms = {};
        jobs.forEach(j => platforms[j.platform] = (platforms[j.platform] || 0) + 1);

        // 2. Process Status Data
        const statuses = {};
        jobs.forEach(j => statuses[j.status] = (statuses[j.status] || 0) + 1);

        // Create Platform Chart
        AnalyticsModule.charts.platform = new Chart(platformCtx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(platforms),
                datasets: [{
                    data: Object.values(platforms),
                    backgroundColor: ['#2563eb', '#0ea5e9', '#f59e0b', '#10b981', '#6366f1']
                }]
            },
            options: { plugins: { title: { display: true, text: 'Applications by Platform' } } }
        });

        // Create Status Chart
        AnalyticsModule.charts.status = new Chart(statusCtx, {
            type: 'bar',
            data: {
                labels: Object.keys(statuses),
                datasets: [{
                    label: 'Count',
                    data: Object.values(statuses),
                    backgroundColor: '#3b82f6'
                }]
            },
            options: { plugins: { title: { display: true, text: 'Application Status' } } }
        });
    }
};