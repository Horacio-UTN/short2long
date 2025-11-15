# **Plan de Issues del Proyecto (Desde ROADMAP.md)**

Este documento desglosa cada punto del ROADMAP.md en una plantilla de issue de GitHub. Cada issue incluye sus **dependencias** para establecer el orden de trabajo.

## **Milestone 1: Profesionalización y Marca**

### **Tarea 1: Traducción (i18n)**

* **Título:** M1 (T2): Traducir (i18n) código y README al inglés  
* **Cuerpo:** Profesionalizar el proyecto traduciendo todos los assets al inglés.  
  1. Reemplazar README.md con la versión en inglés \[cite: previous\_response\].  
  2. Traducir comentarios en background.js \[cite: horacio-utn/short2long/short2long-67eb6c5b92f4c13937b442c4a67d00ad034da312/background.js\].  
  3. Traducir texto de notificaciones en background.js \[cite: horacio-utn/short2long/short2long-67eb6c5b92f4c13937b442c4a67d00ad034da312/background.js\].  
* **Dependencies:** T1: Nuevo Repositorio  
* **Labels:** milestone-1, documentation, good first issue

## **Milestone 2: La Base de la Configuración**

### **Tarea 3: Permisos**

* **Título:** M2 (T3): Actualizar manifest.json con permisos "bookmarks" y "storage"  
* **Cuerpo:** Modificar manifest.json \[cite: horacio-utn/short2long/short2long-67eb6c5b92f4c13937b442c4a67d00ad034da312/manifest.json\] para agregar "bookmarks" y "storage" a la lista de permissions.  
* **Dependencies:** T1: Nuevo Repositorio  
* **Labels:** milestone-2, config

### **Tarea 4: Página de Opciones**

* **Título:** M2 (T4): Crear la UI de Opciones (options.html)  
* **Cuerpo:** Crear el archivo options.html y registrarlo en manifest.json \[cite: horacio-utn/short2long/short2long-67eb6c5b92f4c13937b442c4a67d00ad034da312/manifest.json\] usando la clave "options\_page". El HTML debe ser un formulario básico por ahora.  
* **Dependencies:** T1: Nuevo Repositorio  
* **Labels:** milestone-2, feature, ui

### **Tarea 5: Mapa de Intereses**

* **Título:** M2 (T5): Implementar lógica del "Mapa de Intereses" (options.js)  
* **Cuerpo:**  
  1. En options.html, agregar un \<textarea id="interest-map"\> y un \<button id="save-options"\>.  
  2. Crear options.js (y enlazarlo a options.html).  
  3. options.js debe guardar el contenido del textarea en chrome.storage.sync al hacer clic en el botón.  
  4. options.js debe leer chrome.storage.sync al cargar para rellenar el textarea.  
* **Dependencies:** T3: Permisos, T4: Página de Opciones  
* **Labels:** milestone-2, feature, storage

## **Milestone 3: El Cerebro de Clasificación**

### **Tarea 6: El "Lector" (content.js)**

* **Título:** M3 (T6): Crear el "Lector" (content.js) para leer título/descripción  
* **Cuerpo:**  
  1. Crear content.js.  
  2. Registrarlo en manifest.json \[cite: horacio-utn/short2long/short2long-67eb6c5b92f4c13937b442c4a67d00ad034da312/manifest.json\] para youtube.com/\*.  
  3. El script debe poder leer el título y la descripción de la página (ej. h1, \#description).  
* **Dependencies:** T1: Nuevo Repositorio  
* **Labels:** milestone-3, feature, content-script

### **Tarea 7: Comunicación (Background \<-\> Content)**

* **Título:** M3 (T7): Establecer comunicación entre background.js y content.js  
* **Cuerpo:**  
  1. En background.js \[cite: horacio-utn/short2long/short2long-67eb6c5b92f4c13937b442c4a67d00ad034da312/background.js\], modificar el onClicked para que envíe un mensaje (ej. getVideoDetails) a la pestaña activa.  
  2. En content.js, añadir un listener (chrome.runtime.onMessage) que escuche ese mensaje y responda con {title: ..., description: ...}.  
* **Dependencies:** T6: El "Lector" (content.js)  
* **Labels:** milestone-3, refactor, core-logic

### **Tarea 8: Lógica de Marcadores**

* **Título:** M3 (T8): Crear funciones de manejo de Marcadores en background.js  
* **Cuerpo:** En background.js \[cite: horacio-utn/short2long/short2long-67eb6c5b92f4c13937b442c4a67d00ad034da312/background.js\], crear las funciones base findOrCreateBookmarkFolder(folderName, callback) y chrome.bookmarks.create (dentro de un wrapper).  
* **Dependencies:** T3: Permisos  
* **Labels:** milestone-3, feature, bookmarks

### **Tarea 9: El "Emparejador" (Matcher)**

* **Título:** M3 (T9): Implementar el "Emparejador" (Matcher) de Heurísticas  
* **Cuerpo:** Esta es la tarea de integración central.  
  1. Modificar el callback del onClicked en background.js \[cite: horacio-utn/short2long/short2long-67eb6c5b92f4c13937b442c4a67d00ad034da312/background.js\].  
  2. Leer el "Mapa de Intereses" desde chrome.storage.sync.  
  3. Comparar el título (recibido del content.js) con los intereses.  
  4. Si hay match, llamar a findOrCreateBookmarkFolder y chrome.bookmarks.create.  
  5. Enviar notificación de éxito.  
* **Dependencies:** T5: Mapa de Intereses, T7: Comunicación, T8: Lógica de Marcadores  
* **Labels:** milestone-3, feature, core-logic

## **Milestone 4: Mejoras de UX**

### **Tarea 10: Atajo de Teclado**

* **Título:** M4 (T10): Agregar atajo de teclado configurable  
* **Cuerpo:** Agregar la sección "commands" al manifest.json \[cite: horacio-utn/short2long/short2long-67eb6c5b92f4c13937b442c4a67d00ad034da312/manifest.json\] y definir una suggested\_key para \_execute\_action.  
* **Dependencies:** T9: El "Emparejador" (Matcher) (El atajo debe *disparar* la lógica principal).  
* **Labels:** milestone-4, feature, ux, good first issue

### **Tarea 11: Botón en la Página**

* **Título:** M4 (T11): Inyectar botón de guardado en la UI de YouTube  
* **Cuerpo:**  
  1. Modificar content.js para inyectar un \<button\> en la página (área de la derecha \[cite: image\_cf12a4.jpg\]).  
  2. Estilizar el botón (quizás usar el icon.svg \[cite: horacio-utn/short2long/short2long-67eb6c5b92f4c13937b442c4a67d00ad034da312/icons/icon.svg\]).  
  3. Hacer que el clic en este botón envíe un mensaje a background.js \[cite: horacio-utn/short2long/short2long-67eb6c5b92f4c13937b442c4a67d00ad034da312/background.js\] para disparar la lógica de guardado.  
* **Dependencies:** T6: El "Lector" (content.js), T9: El "Emparejador" (Matcher)  
* **Labels:** milestone-4, feature, ui

### **Tarea 12: Estadísticas Locales**

* **Título:** M4 (T12): Implementar y mostrar estadísticas locales  
* **Cuerpo:**  
  1. En background.js \[cite: horacio-utn/short2long/short2long-67eb6c5b92f4c13937b442c4a67d00ad034da312/background.js\], al guardar un marcador, incrementar un contador en chrome.storage.local.  
  2. En options.js, leer chrome.storage.local y mostrar las estadísticas en options.html.  
* **Dependencies:** T5: Mapa de Intereses, T8: Lógica de Marcadores  
* **Labels:** milestone-4, feature, storage, ux

## **Milestone 5: IA Opcional**

### **Tarea 13: UI de Opciones de IA**

* **Título:** M5 (T13): Agregar UI de IA (toggle y API key) en options.html  
* **Cuerpo:**  
  1. En options.html, agregar \<input type="checkbox" id="aiToggle"\>.  
  2. Agregar \<input type="password" id="apiKey"\>.  
  3. En options.js, guardar estos valores en chrome.storage.sync.  
* **Dependencies:** T5: Mapa de Intereses  
* **Labels:** milestone-5, feature, ui, config

### **Tarea 14: Lógica de IA**

* **Título:** M5 (T14): Implementar lógica de "Emparejador" IA en background.js  
* **Cuerpo:**  
  1. Modificar el "Emparejador" (T9).  
  2. Al inicio, verificar chrome.storage.sync por el toggle de IA y la API key.  
  3. **Si IA=true:** Construir un prompt para Gemini (con el título y el Mapa de Intereses) y usar fetch().  
  4. Usar la respuesta de la IA para llamar a findOrCreateBookmarkFolder.  
  5. **Si IA=false:** Usar la lógica de heurísticas existente (T9).  
* **Dependencies:** T9: El "Emparejador" (Matcher), T13: UI de Opciones de IA  
* **Labels:** milestone-5, feature, ia, core-logic

## **Milestone 6: Lanzamiento**

### **Tarea 15: Cuenta de Desarrollador**

* **Título:** M6 (T15): Registrar cuenta de desarrollador de Chrome  
* **Cuerpo:** Pagar los 5 USD en el dashboard de la Chrome Web Store.  
* **Dependencies:** Ninguna (se puede hacer en cualquier momento).  
* **Labels:** milestone-6, admin

### **Tarea 16: Política de Privacidad**

* **Título:** M6 (T16): Escribir y alojar una Política de Privacidad  
* **Cuerpo:** Crear un archivo PRIVACY.md en el repositorio. Debe declarar que todos los datos (intereses, API key) se guardan localmente y no son recolectados por el desarrollador.  
* **Dependencies:** T1: Nuevo Repositorio  
* **Labels:** milestone-6, documentation

### **Tarea 17: Empaquetado**

* **Título:** M6 (T17): Crear script o documentación para empaquetado  
* **Cuerpo:** Crear el archivo .zip de producción, asegurándose de excluir archivos de desarrollo (.git, .gitignore \[cite: horacio-utn/short2long/short2long-67eb6c5b92f4c13937b442c4a67d00ad034da312/gitignore\], ROADMAP.md, ISSUES\_PLAN.md).  
* **Dependencies:** (Al final de todos los Milestones de features)  
* **Labels:** milestone-6, build

### **Tarea 18: Publicación**

* **Título:** M6 (T18): Redactar ficha de la tienda y publicar  
* **Cuerpo:** Escribir la descripción, tomar capturas de pantalla y subir el .zip al Developer Dashboard para revisión.  
* **Dependencies:** T15: Cuenta de Desarrollador, T16: Política de Privacidad, T17: Empaquetado  
* **Labels:** milestone-6, admin
