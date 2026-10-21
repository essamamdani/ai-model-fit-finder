import { buildFinderUrl } from './search-url.js';

document.querySelector('#finder-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const query = document.querySelector('#need').value;
  try {
    chrome.tabs.create({ url: buildFinderUrl(query) });
    window.close();
  } catch (error) {
    document.querySelector('#need').setCustomValidity(error.message);
    document.querySelector('#need').reportValidity();
  }
});

document.querySelector('#need').addEventListener('input', (event) => event.currentTarget.setCustomValidity(''));
