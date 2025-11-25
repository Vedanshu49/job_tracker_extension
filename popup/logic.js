document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get(['jobs'], (result) => {
        const count = result.jobs ? result.jobs.length : 0;
        document.getElementById('jobCount').innerText = count;
    });

    document.getElementById('openDash').addEventListener('click', () => {
        chrome.tabs.create({ url: 'dashboard/index.html' });
    });
});