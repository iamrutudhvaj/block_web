console.log("Service worker running...");

// Initialize default blocklist
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ blocklist: [] });
});

// Update rules dynamically
function updateBlocklist(blocklist) {
    // Convert blocklist into declarativeNetRequest rules
    const rules = blocklist.map((site, index) => ({
        id: index + 1, // Each rule needs a unique ID
        priority: 1,
        action: {
            type: "redirect",
            redirect: { url: chrome.runtime.getURL("blocked.html") }
        },
        condition: {
            urlFilter: `*://${site}/*`,
            resourceTypes: ["main_frame"]
        }
    }));

    // Clear existing rules and add new ones
    chrome.declarativeNetRequest.updateDynamicRules(
        {
            removeRuleIds: Array.from({ length: blocklist.length }, (_, i) => i + 1),
            addRules: rules
        },
        () => {
            console.log("Blocklist updated:", blocklist);
        }
    );
}

// Watch for changes in blocklist
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === "sync" && changes.blocklist) {
        console.log(`blocklist updated: ${changes.blocklist.newValue}`);
        updateBlocklist(changes.blocklist.newValue);
    }
});
