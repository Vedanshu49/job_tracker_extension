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

            // Clear container safely
            container.textContent = '';

            // --- Helper to create Chart Card ---
            const createChartCard = (titleText, dataObj, colorMap = null) => {
                const card = document.createElement('div');
                Object.assign(card.style, {
                    background: 'var(--card-color)',
                    padding: '20px',
                    borderRadius: '12px',
                    boxShadow: 'var(--shadow-md)'
                });

                const title = document.createElement('h3');
                title.style.marginBottom = '15px';
                title.style.color = 'var(--text-color)';
                title.textContent = titleText;
                card.appendChild(title);

                const maxVal = Math.max(...Object.values(dataObj), 1);

                Object.entries(dataObj).forEach(([label, count]) => {
                    const row = document.createElement('div');
                    row.style.marginBottom = '12px';

                    const header = document.createElement('div');
                    Object.assign(header.style, {
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '4px'
                    });

                    const labelSpan = document.createElement('span');
                    Object.assign(labelSpan.style, {
                        fontSize: '13px',
                        fontWeight: '600',
                        color: 'var(--text-color)'
                    });
                    labelSpan.textContent = label;

                    const countSpan = document.createElement('span');
                    Object.assign(countSpan.style, {
                        fontSize: '13px',
                        fontWeight: '700'
                    });
                    // Use specific color if map provided, else primary
                    countSpan.style.color = colorMap ? (colorMap[label] || '#6366F1') : 'var(--primary-color)';
                    countSpan.textContent = count;

                    header.appendChild(labelSpan);
                    header.appendChild(countSpan);

                    const barBg = document.createElement('div');
                    Object.assign(barBg.style, {
                        width: '100%',
                        height: '20px',
                        background: 'var(--border-color)',
                        borderRadius: '4px',
                        overflow: 'hidden'
                    });

                    const barFill = document.createElement('div');
                    Object.assign(barFill.style, {
                        height: '100%',
                        width: `${(count / maxVal) * 100}%`,
                        transition: 'width 300ms'
                    });
                    
                    if (colorMap) {
                        barFill.style.background = colorMap[label] || '#6366F1';
                    } else {
                        barFill.style.background = 'linear-gradient(90deg, #6366F1, #8B5CF6)';
                    }

                    barBg.appendChild(barFill);
                    row.appendChild(header);
                    row.appendChild(barBg);
                    card.appendChild(row);
                });

                return card;
            };

            // Platform Chart
            const platformCard = createChartCard('📊 Applications by Platform', platforms);
            container.appendChild(platformCard);

            // Status Chart
            const statusColors = {
                'Applied': '#3B82F6',
                'Interviewing': '#F59E0B',
                'Assignment': '#8B5CF6',
                'Offer': '#10B981',
                'Rejected': '#EF4444'
            };
            const statusCard = createChartCard('📈 Applications by Status', statuses, statusColors);
            container.appendChild(statusCard);
        }
    };
}