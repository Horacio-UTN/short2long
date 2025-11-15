function save_options() {
  const interestMap = document.getElementById('interest-map').value;
  chrome.storage.sync.set({
    userInterestMap: interestMap
  }, () => {
    const status = document.getElementById('status');
    status.textContent = '¡Opciones guardadas!';
    setTimeout(() => { status.textContent = ''; }, 1500);
  });
}

function restore_options() {
  chrome.storage.sync.get(['userInterestMap'], (items) => {
    if (items.userInterestMap) {
      document.getElementById('interest-map').value = items.userInterestMap;
    }
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save-options').addEventListener('click', save_options);
