const grid = document.getElementById('grid');
const goButton = document.getElementById('go');
const errorEl = document.getElementById('error');

PRESETS.forEach((preset, i) => {
  const label = document.createElement('label');
  label.className = 'site';
  const box = document.createElement('input');
  box.type = 'checkbox';
  box.dataset.index = i;
  if (preset.label === 'Facebook') box.checked = true;
  const span = document.createElement('span');
  span.textContent = preset.label;
  label.append(box, span);
  grid.append(label);
});

goButton.addEventListener('click', async () => {
  errorEl.hidden = true;
  const chosen = [...grid.querySelectorAll('input:checked')].flatMap(
    (box) => PRESETS[box.dataset.index].domains
  );

  if (chosen.length === 0) {
    errorEl.textContent = 'Pick at least one site.';
    errorEl.hidden = false;
    return;
  }

  const granted = await chrome.permissions.request({
    origins: patternsFor(chosen),
  });
  if (!granted) {
    errorEl.textContent =
      'Chrome permission was declined — Desaturate can only gray out sites it has access to. Try again.';
    errorEl.hidden = false;
    return;
  }

  await setSites(chosen);
  await applyToOpenTabs(chosen, true);

  document.getElementById('setup').hidden = true;
  document.getElementById('done').hidden = false;
});
