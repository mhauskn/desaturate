// Shared between onboarding and options pages (loaded as a plain script).

const PRESETS = [
  { label: 'Facebook', domains: ['facebook.com'] },
  { label: 'Instagram', domains: ['instagram.com'] },
  { label: 'X / Twitter', domains: ['x.com', 'twitter.com'] },
  { label: 'TikTok', domains: ['tiktok.com'] },
  { label: 'Reddit', domains: ['reddit.com'] },
  { label: 'YouTube', domains: ['youtube.com'] },
  { label: 'Threads', domains: ['threads.com', 'threads.net'] },
  { label: 'LinkedIn', domains: ['linkedin.com'] },
  { label: 'Pinterest', domains: ['pinterest.com'] },
  { label: 'Twitch', domains: ['twitch.tv'] },
];

const PRESET_DOMAINS = new Set(PRESETS.flatMap((p) => p.domains));

function patternsFor(domains) {
  return domains.map((d) => `*://*.${d}/*`);
}

// "https://www.News.example.com/feed" -> "news.example.com"; null if invalid.
function normalizeDomain(input) {
  let s = input.trim().toLowerCase();
  s = s.replace(/^[a-z][a-z0-9+.-]*:\/\//, '');
  s = s.split('/')[0].split(':')[0].split('?')[0];
  s = s.replace(/^www\./, '');
  if (!/^[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(s)) return null;
  return s;
}

async function getSites() {
  const { sites = [] } = await chrome.storage.sync.get('sites');
  return sites;
}

async function setSites(sites) {
  await chrome.storage.sync.set({ sites: [...new Set(sites)].sort() });
}

// Apply or remove the filter on already-open tabs so changes are instant.
// Requires host permission for the domains, which the caller has just
// obtained (or still holds, when removing).
async function applyToOpenTabs(domains, on) {
  if (domains.length === 0) return;
  let tabs = [];
  try {
    tabs = await chrome.tabs.query({ url: patternsFor(domains) });
  } catch (e) {
    return;
  }
  await Promise.all(
    tabs.map((tab) => {
      const injection = { target: { tabId: tab.id }, files: ['desaturate.css'] };
      const call = on
        ? chrome.scripting.insertCSS(injection)
        : chrome.scripting.removeCSS(injection);
      return call.catch(() => {});
    })
  );
}
