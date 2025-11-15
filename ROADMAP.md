# **Hoja de Ruta Detallada: Short2Long \-\> "Orcio" Asistente**

Este documento desglosa todas las características discutidas para transformar la v1.0 (un simple conversor de Shorts) en un asistente de YouTube completo y personalizable.

**Punto de Partida (v1.0):** El código base actual \[cite: horacio-utn/short2long/short2long-67eb6c5b92f4c13937b442c4a67d00ad034da312\].

### **Milestone 1: Profesionalización y Marca ("El Traslado")**

*(Mover el proyecto a su identidad profesional "Orcio")*

1. **Nuevo Repositorio:** Crear un nuevo repositorio de GitHub (ej. youtube-assistant) bajo un nuevo usuario (ej. Orcio).  
2. **Traducción (i18n):**  
   * Traducir README.md al inglés (usar la versión ya generada \[cite: previous\_response\]).  
   * Traducir todos los comentarios de código en background.js \[cite: horacio-utn/short2long/short2long-67eb6c5b92f4c13937b442c4a67d00ad034da312/background.js\] al inglés.  
   * Traducir todos los textos de notificación (chrome.notifications.create) al inglés.

### **Milestone 2: La Base de la Configuración ("El Panel de Control")**

*(Crear la interfaz donde vivirá toda la personalización)*

3. **Permisos:** Modificar manifest.json \[cite: horacio-utn/short2long/short2long-67eb6c5b92f4c13937b442c4a67d00ad034da312/manifest.json\] para agregar "bookmarks" y "storage".  
4. **Página de Opciones:**  
   * Crear options.html: un formulario simple.  
   * Registrarlo en manifest.json ("options\_page": "options.html").  
5. **Mapa de Intereses:**  
   * En options.html, agregar un \<textarea id="interest-map"\> para que el usuario escriba sus categorías personales (ej. "Ejercicio para 40-50", "Estrategias de negocio").  
   * Agregar un botón \<button id="save-options"\>.  
   * Crear options.js para guardar el contenido del textarea en chrome.storage.sync.

### **Milestone 3: El Cerebro de Clasificación ("El Asistente")**

*(Implementar la lógica principal de guardado de marcadores)*

6. **El "Lector" (content.js):**  
   * Crear content.js para leer el título y la descripción del video de la página de YouTube.  
   * Registrarlo en manifest.json para que se inyecte en youtube.com/\*.  
7. **Comunicación (Background \<-\> Content):**  
   * Modificar background.js \[cite: horacio-utn/short2long/short2long-67eb6c5b92f4c13937b442c4a67d00ad034da312/background.js\] para que el onClicked primero envíe un mensaje a content.js pidiendo los detalles del video.  
8. **Lógica de Marcadores (background.js):**  
   * Crear la función findOrCreateBookmarkFolder(folderName, callback).  
   * Crear la función categorizeAndSave(videoTitle, videoUrl).  
9. **El "Emparejador" (Matcher) (background.js):**  
   * Dentro de categorizeAndSave, esta lógica debe:  
     * Leer el "Mapa de Intereses" desde chrome.storage.sync.  
     * Comparar videoTitle con la lista de intereses.  
     * Si hay coincidencia, llamar a findOrCreateBookmarkFolder y chrome.bookmarks.create.  
     * Enviar una notificación de éxito ("¡Guardado en 'Ejercicio 40-50'\!").  
   * *Nota: La conversión de Short \[cite: horacio-utn/short2long/short2long-67eb6c5b92f4c13937b442c4a67d00ad034da312/background.js\] se ejecuta en paralelo o después de esta lógica.*

### **Milestone 4: Mejoras de UX ("Los Toques Finales")**

*(Añadir las características que hacen que la extensión sea cómoda de usar)*

10. **Atajo de Teclado:**  
    * Agregar la sección "commands" al manifest.json.  
    * Definir un atajo (ej. Ctrl+Shift+L) para \_execute\_action (simular clic en el ícono).  
11. **Botón en la Página:**  
    * Modificar content.js para que inyecte un botón con tu icon.svg \[cite: horacio-utn/short2long/short2long-67eb6c5b92f4c13937b442c4a67d00ad034da312/icons/icon.svg\] en la interfaz de YouTube (en el área que marcaste \[cite: image\_cf12a4.jpg\]).  
    * Hacer que el clic en *ese* botón envíe el mensaje a background.js para iniciar el guardado (igual que el ícono de la barra).  
12. **Estadísticas Locales:**  
    * En background.js, al guardar un marcador, incrementar un contador en chrome.storage.local (ej. {"saved\_recetas": 5}).  
    * En options.html, leer estas estadísticas y mostrarlas al usuario.

### **Milestone 5: IA Opcional ("El Modo Pro")**

*(Implementar la funcionalidad de IA que el usuario puede activar)*

13. **UI de Opciones de IA:**  
    * En options.html, agregar un "toggle" (checkbox) para "Habilitar Asistente IA".  
    * Agregar un campo de texto para la "Gemini API Key".  
    * Guardar esto en chrome.storage.sync (junto con el Mapa de Intereses).  
14. **Lógica de IA (background.js):**  
    * Modificar el "Emparejador" (Punto 9):  
    * **Si la IA está activa:**  
      * Hacer un fetch() a la API de Gemini.  
      * **Prompt:** "Dado este título: '\[Título del Video\]', ¿cuál de mis intereses coincide mejor? Intereses: \['Interés 1', 'Interés 2', ...\]. Responde solo con el nombre del interés."  
      * Usar la respuesta de la IA para guardar el marcador.  
      * **Manejo de nuevas categorías:** Si la IA sugiere una categoría que no existe, notificar al usuario para confirmar la creación.  
    * **Si la IA está inactiva:**  
      * Usar la búsqueda de palabras clave simple (la lógica del Punto 9).

### **Milestone 6: Lanzamiento ("El Producto")**

15. **Cuenta de Desarrollador:** Pagar los 5 USD para la cuenta de la Chrome Web Store.  
16. **Política de Privacidad:** Escribir un PRIVACY.md simple que declare que todos los datos (API key, intereses) se guardan localmente.  
17. **Empaquetado:** Crear el .zip para la tienda.  
18. **Publicación:** Subir la extensión, redactar la ficha de la tienda y enviarla a revisión.