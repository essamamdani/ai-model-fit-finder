import { buildFinderUrl } from './search-url.js';

const form = document.querySelector('#finder-form');
const input = document.querySelector('#need');
const button = document.querySelector('#search-button');
const status = document.querySelector('#search-status');
const results = document.querySelector('#results');

function showModels(models) {
  results.replaceChildren();
  results.hidden = false;

  if (!models.length) {
    const empty = document.createElement('p');
    empty.className = 'empty';
    empty.textContent = 'No close match found. Try a model name, capability, or broader task description.';
    results.append(empty);
    return;
  }

  const heading = document.createElement('h2');
  heading.textContent = 'Recommended models';
  results.append(heading);

  for (const model of models.slice(0, 5)) {
    const card = document.createElement('article');
    card.className = 'model-card';
    const title = document.createElement('h3');
    title.textContent = model.name;
    const summary = document.createElement('p');
    summary.textContent = model.summary || model.reason || 'Open the model record for details.';
    const link = document.createElement('a');
    link.href = `https://essamamdani.com/ai-models/${encodeURIComponent(model.slug)}`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = 'Model details →';
    card.append(title, summary, link);
    results.append(card);
  }

  const fullFinder = document.createElement('a');
  fullFinder.className = 'full-finder';
  fullFinder.href = buildFinderUrl(input.value);
  fullFinder.target = '_blank';
  fullFinder.rel = 'noopener noreferrer';
  fullFinder.textContent = 'Open full finder with this search →';
  results.append(fullFinder);
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const query = input.value.trim();
  if (query.length < 3) {
    input.setCustomValidity('Describe what you need in at least 3 characters.');
    input.reportValidity();
    return;
  }

  button.disabled = true;
  status.textContent = 'Searching the model directory…';
  results.hidden = true;
  try {
    const nonceResponse = await fetch('https://essamamdani.com/api/ai/nonce', { cache: 'no-store' });
    const noncePayload = await nonceResponse.json();
    if (!nonceResponse.ok || !noncePayload.nonce) throw new Error(noncePayload.error || 'Could not start a secure search.');

    const response = await fetch('https://essamamdani.com/api/ai-model-fit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-ai-nonce': noncePayload.nonce },
      body: JSON.stringify({ query, source: 'hardware-fit', hardware: null }),
    });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error || 'Search is temporarily unavailable.');
    showModels(payload.recommendations ?? []);
    status.textContent = payload.recommendations?.length ? `${payload.recommendations.length} matching models found.` : 'Search complete.';
  } catch (error) {
    status.textContent = error instanceof Error ? error.message : 'Search is temporarily unavailable.';
    status.classList.add('error');
  } finally {
    button.disabled = false;
  }
});

input.addEventListener('input', () => {
  input.setCustomValidity('');
  status.classList.remove('error');
});
