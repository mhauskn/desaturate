// Keeps the registered content script in sync with the stored site list.
// Registered scripts persist across browser sessions, so this worker only
// needs to run on install and when the list changes.

const SCRIPT_ID = 'desaturate';

async function syncRegisteredScripts() {
  const { sites = [] } = await chrome.storage.sync.get('sites');
  const existing = await chrome.scripting.getRegisteredContentScripts({
    ids: [SCRIPT_ID],
  });

  if (sites.length === 0) {
    if (existing.length > 0) {
      await chrome.scripting.unregisterContentScripts({ ids: [SCRIPT_ID] });
    }
    return;
  }

  const script = {
    id: SCRIPT_ID,
    matches: sites.map((d) => `*://*.${d}/*`),
    css: ['desaturate.css'],
    runAt: 'document_start',
    persistAcrossSessions: true,
  };

  if (existing.length > 0) {
    await chrome.scripting.updateContentScripts([script]);
  } else {
    await chrome.scripting.registerContentScripts([script]);
  }
}

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    chrome.tabs.create({ url: 'onboarding.html' });
  }
  syncRegisteredScripts();
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync' && changes.sites) {
    syncRegisteredScripts();
  }
});
