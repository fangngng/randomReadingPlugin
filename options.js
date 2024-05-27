document.addEventListener('DOMContentLoaded', () => {
  const autoHighlightCheckbox = document.getElementById('autoHighlight');
  const highlightPercentageInput = document.getElementById('highlightPercentage');
  const minTextLengthInput = document.getElementById('minTextLength');
  const saveButton = document.getElementById('save');

  chrome.storage.sync.get(['autoHighlight', 'highlightPercentage', 'minTextLength'], (result) => {
    autoHighlightCheckbox.checked = result.autoHighlight || false;
    highlightPercentageInput.value = result.highlightPercentage || 30;
    minTextLengthInput.value = result.minTextLength || 20;
  });

  saveButton.addEventListener('click', () => {
    const autoHighlight = autoHighlightCheckbox.checked;
    const highlightPercentage = parseInt(highlightPercentageInput.value, 10);
    const minTextLength = parseInt(minTextLengthInput.value, 10);
    chrome.storage.sync.set({ autoHighlight, highlightPercentage, minTextLength }, () => {
      alert('Options saved!');
    });
  });
});
