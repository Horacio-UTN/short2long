// Listener para cuando se hace clic en el ícono de la extensión
chrome.action.onClicked.addListener((tab) => {
  // Verificar que la pestaña actual tiene una URL
  if (!tab.url) {
    console.error('No se pudo obtener la URL de la pestaña');
    return;
  }

  // Intentar convertir la URL de YouTube Short a URL normal
  const convertedUrl = convertShortToWatch(tab.url);

  // Si la URL fue convertida, redirigir a la nueva URL
  if (convertedUrl && convertedUrl !== tab.url) {
    chrome.tabs.update(tab.id, { url: convertedUrl });
    console.log(`URL convertida: ${tab.url} -> ${convertedUrl}`);
  } else {
    console.log('La URL actual no es un YouTube Short o ya es una URL normal');
    // Opcionalmente, puedes mostrar una notificación al usuario
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon48.png',
      title: 'Short2Long',
      message: 'Esta página no es un YouTube Short'
    });
  }
});

/**
 * Convierte una URL de YouTube Short a URL de watch normal
 * @param {string} url - La URL a convertir
 * @returns {string|null} - La URL convertida o null si no es un Short
 */
function convertShortToWatch(url) {
  try {
    const urlObj = new URL(url);

    // Verificar que es una URL de YouTube
    if (!urlObj.hostname.includes('youtube.com')) {
      return null;
    }

    // Verificar si es una URL de Short (formato: /shorts/VIDEO_ID)
    const shortsPattern = /\/shorts\/([a-zA-Z0-9_-]+)/;
    const match = urlObj.pathname.match(shortsPattern);

    if (match && match[1]) {
      // Extraer el ID del video
      const videoId = match[1];

      // Construir la URL de watch normal
      const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;

      // Preservar cualquier parámetro adicional de la URL original
      const searchParams = urlObj.searchParams;
      if (searchParams.toString()) {
        return `${watchUrl}&${searchParams.toString()}`;
      }

      return watchUrl;
    }

    return null;
  } catch (error) {
    console.error('Error al convertir la URL:', error);
    return null;
  }
}

// Opcional: Listener para mostrar un estado diferente del ícono según la página
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    const isShort = tab.url.includes('/shorts/');

    // Cambiar el título del action según si es un Short o no
    if (isShort) {
      chrome.action.setTitle({
        tabId: tabId,
        title: 'Convertir a video normal'
      });
    } else {
      chrome.action.setTitle({
        tabId: tabId,
        title: 'Esta página no es un YouTube Short'
      });
    }
  }
});
