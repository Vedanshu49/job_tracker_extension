// scripts/background.js

chrome.runtime.onInstalled.addListener((details) => {
    // Check if the reason is 'install' (first time download or loading unpacked)
    if (details.reason === 'install') {
        // Open the website in a new tab
        chrome.tabs.create({
            url: "https://appliitrack.vercel.app",
            active: true
        });
    }
});