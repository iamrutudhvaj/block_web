document.addEventListener("DOMContentLoaded", () => {
    const blocklistElem = document.getElementById("blocklist");
    const inputElem = document.getElementById("site-input");
    const addBtn = document.getElementById("add-btn");
    const addCurrentBtn = document.getElementById("add-current-btn"); // Button for current tab

    // Load blocklist
    chrome.storage.sync.get("blocklist", ({ blocklist }) => {
        blocklist.forEach((site) => addListItem(site));
    });

    // Add a site manually
    addBtn.addEventListener("click", () => {
        const site = inputElem.value.trim();
        if (!site) return;

        chrome.storage.sync.get("blocklist", ({ blocklist }) => {
            if (!blocklist.includes(site)) {
                blocklist.push(site);
                chrome.storage.sync.set({ blocklist });
                addListItem(site);
            }
        });
    });

    // Add the current tab's site to the blocklist
    addCurrentBtn.addEventListener("click", () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const url = new URL(tabs[0].url); // Get the current tab's URL
            const site = url.hostname; // Extract hostname (e.g., example.com)

            chrome.storage.sync.get("blocklist", ({ blocklist }) => {
                if (!blocklist.includes(site)) {
                    blocklist.push(site);
                    chrome.storage.sync.set({ blocklist });
                    addListItem(site);
                }
            });
        });
    });

    // Helper function to add a site to the UI
    function addListItem(site) {
        const li = document.createElement("li");
        li.textContent = site;
        blocklistElem.appendChild(li);
    }
});
