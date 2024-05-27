function getTextElements(minLength) {
  const elements = document.querySelectorAll('p, div');
  const textElements = Array.from(elements).filter(el => el.textContent.trim().length >= minLength && !el.querySelector('p, div'));
  return textElements;
}

function getRandomTextElements(percentage, minLength) {
  const textElements = getTextElements(minLength);
  const numToHighlight = Math.floor(textElements.length * (percentage / 100));
  const shuffled = textElements.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numToHighlight);
}

function createToggleIcon(element) {
  const icon = document.createElement('img');
  icon.src = chrome.runtime.getURL('images/icon.png');
  icon.classList.add('toggle-icon');
  icon.style.position = 'absolute';
  icon.style.cursor = 'pointer';

  element.style.position = 'relative';
  element.appendChild(icon);

  icon.addEventListener('click', () => {
    element.classList.toggle('highlight');
  });

  return icon;
}

function highlightElements(elements) {
  elements.forEach(element => {
    element.classList.add('highlight');
    createToggleIcon(element);
  });
}

function checkAutoHighlight() {
  chrome.storage.sync.get(['autoHighlight', 'highlightPercentage', 'minTextLength'], (result) => {
    if (result.autoHighlight) {
      const percentage = result.highlightPercentage || 30;
      const minLength = result.minTextLength || 20;
      const elements = getRandomTextElements(percentage, minLength);
      highlightElements(elements);
    }
  });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "highlightRandomParagraph") {
    chrome.storage.sync.get(['highlightPercentage', 'minTextLength'], (result) => {
      const percentage = result.highlightPercentage || 30;
      const minLength = result.minTextLength || 20;
      const elements = getRandomTextElements(percentage, minLength);
      highlightElements(elements);
      sendResponse({ success: true });
    });
  }
});

document.addEventListener('DOMContentLoaded', checkAutoHighlight);
