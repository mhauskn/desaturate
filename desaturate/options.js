const grid = document.getElementById('grid');
const customList = document.getElementById('custom-list');
const customEmpty = document.getElementById('custom-empty');
const addForm = document.getElementById('add-form');
const addInput = document.getElementById('add-input');
const errorEl = document.getElementById('error');

function showError(msg) {
  errorEl.textContent = msg;
  errorEl.hidden = !msg;
}

async function addDomains(domains) {
  const granted = await chrome.permissions.request({
    origins: patternsFor(domains),
  });
  if (!granted) {
    showError('Chrome permission was declined, so the site was not added.');
    return false;
  }
  const sites = await getSites();
  await setSites([...sites, ...domains]);
  await applyToOpenTabs(domains, true);
  return true;
}

async function removeDomains(domains) {
  // Restore open tabs while we still hold the host permission.
  await applyToOpenTabs(domains, false);
  const sites = await getSites();
  await setSites(sites.filter((s) => !domains.includes(s)));
  await chrome.permissions.remove({ origins: patternsFor(domains) }).catch(() => {});
}

async function render() {
  const sites = await getSites();
  const siteSet = new Set(sites);

  grid.replaceChildren();
  PRESETS.forEach((preset) => {
    const label = document.createElement('label');
    label.className = 'site';
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = preset.domains.every((d) => siteSet.has(d));
    box.addEventListener('change', async () => {
      showError('');
      if (box.checked) {
        const ok = await addDomains(preset.domains);
        if (!ok) box.checked = false;
      } else {
        await removeDomains(preset.domains);
      }
      render();
    });
    const span = document.createElement('span');
    span.textContent = preset.label;
    label.append(box, span);
    grid.append(label);
  });

  const custom = sites.filter((s) => !PRESET_DOMAINS.has(s));
  customList.replaceChildren();
  customEmpty.hidden = custom.length > 0;
  custom.forEach((domain) => {
    const row = document.createElement('div');
    row.className = 'row';
    const span = document.createElement('span');
    span.textContent = domain;
    const remove = document.createElement('button');
    remove.textContent = 'Restore color';
    remove.addEventListener('click', async () => {
      showError('');
      await removeDomains([domain]);
      render();
    });
    row.append(span, remove);
    customList.append(row);
  });
}

addForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  showError('');
  const domain = normalizeDomain(addInput.value);
  if (!domain) {
    showError('That does not look like a site. Try something like "example.com".');
    return;
  }
  const sites = await getSites();
  if (sites.includes(domain)) {
    showError(`${domain} is already desaturated.`);
    return;
  }
  const ok = await addDomains([domain]);
  if (ok) addInput.value = '';
  render();
});

render();
