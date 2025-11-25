if (!window.AnalyticsModule) {
    window.AnalyticsModule = {
        render: (jobs) => {
            const container = document.querySelector('.analytics-container');
            if (!container) {
                console.error("Analytics container not found");
                return;
            }

            // 1. Process Platform Data
            const platforms = {};
            jobs.forEach(j => platforms[j.platform] = (platforms[j.platform] || 0) + 1);

            // 2. Process Status Data
            const statuses = {};
            jobs.forEach(j => statuses[j.status] = (statuses[j.status] || 0) + 1);

            // Clear container
            container.innerHTML = '';

            // Create Platform Chart HTML
            const platformMax = Math.max(...Object.values(platforms), 1);
            const platformHTML = `
                <div style="background: var(--card-color); padding: 20px; border-radius: 12px; box-shadow: var(--shadow-md);">
                    <h3 style="margin-bottom: 15px; color: var(--text-color);">📊 Applications by Platform</h3>
                    ${Object.entries(platforms).map(([platform, count]) => `
                        <div style="margin-bottom: 12px;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                                <span style="font-size: 13px; font-weight: 600; color: var(--text-color);">${platform}</span>
                                <span style="font-size: 13px; font-weight: 700; color: var(--primary-color);">${count}</span>
                            </div>
                            <div style="width: 100%; height: 20px; background: var(--border-color); border-radius: 4px; overflow: hidden;">
                                <div style="height: 100%; background: linear-gradient(90deg, #6366F1, #8B5CF6); width: ${(count/platformMax)*100}%; transition: width 300ms;"></div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;

            // Create Status Chart HTML
            const statusMax = Math.max(...Object.values(statuses), 1);
            const statusColors = {
                'Applied': '#3B82F6',
                'Interviewing': '#F59E0B',
                'Assignment': '#8B5CF6',
                'Offer': '#10B981',
                'Rejected': '#EF4444'
            };
            
            const statusHTML = `
                <div style="background: var(--card-color); padding: 20px; border-radius: 12px; box-shadow: var(--shadow-md);">
                    <h3 style="margin-bottom: 15px; color: var(--text-color);">📈 Applications by Status</h3>
                    ${Object.entries(statuses).map(([status, count]) => `
                        <div style="margin-bottom: 12px;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                                <span style="font-size: 13px; font-weight: 600; color: var(--text-color);">${status}</span>
                                <span style="font-size: 13px; font-weight: 700; color: ${statusColors[status] || '#6366F1'};">${count}</span>
                            </div>
                            <div style="width: 100%; height: 20px; background: var(--border-color); border-radius: 4px; overflow: hidden;">
                                <div style="height: 100%; background: ${statusColors[status] || '#6366F1'}; width: ${(count/statusMax)*100}%; transition: width 300ms;"></div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;

            container.innerHTML = platformHTML + statusHTML;
        }
    };
}