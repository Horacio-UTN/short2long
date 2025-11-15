Propósito: Automatizar la tarea repetitiva de crear todas las issues de GitHub basadas en el archivo ISSUES_PLAN.md [cite: ISSUES_PLAN.md].

Herramienta: Un agente de UI (como Comet) que pueda leer un archivo de texto y operar en la interfaz web de GitHub.

Requisitos Previos:

Debes estar logueado en GitHub.

El repositorio (https://github.com/Horacio-UTN/short2long/) ya debe estar creado.

El archivo ISSUES_PLAN.md [cite: ISSUES_PLAN.md] debe estar accesible para que el agente lo lea (ej. en esta conversación o en un editor de texto).

Guion de Ejecución para el Agente:

Objetivo General: Para cada una de las 18 tareas listadas en ISSUES_PLAN.md [cite: ISSUES_PLAN.md], realiza el siguiente bucle de acciones:

Bucle de Tarea (Repetir 18 veces):

Leer la Fuente:

Navega al archivo ISSUES_PLAN.md [cite: ISSUES_PLAN.md].

Localiza la siguiente tarea que no se ha procesado (ej. "Tarea 1: Nuevo Repositorio").

Copia el texto del campo Título: (ej. M1 (T1): Crear nuevo repositorio "Orcio"). Almacénalo como VAR_TITULO.

Copia todo el texto del campo Cuerpo: (ej. Crear un nuevo repositorio... v1.0). Almacénalo como VAR_CUERPO.

Copia la lista de Labels: (ej. milestone-1, setup). Almacénalo como VAR_LABELS.

Navegar a GitHub:

Abre una nueva pestaña del navegador.

Escribe la URL de la sección "Issues" de tu repositorio. (Ejemplo:https://github.com/Horacio-UTN/short2long/issues). Presiona Enter.

Espera a que la página cargue.

Crear el Issue:

Localiza y haz clic en el botón verde "New Issue".

Espera a que la página del formulario cargue.

Localiza el campo de texto "Title".

Pega el contenido de VAR_TITULO en el campo "Title".

Localiza el campo de texto del cuerpo (que dice "Leave a comment").

Pega el contenido de VAR_CUERPO en el campo del cuerpo.

Asignar Labels:

Localiza el ícono de engranaje (Configuración) junto a la sección "Labels" en la barra lateral derecha. Haz clic en él.

Aparecerá un cuadro de búsqueda de "Labels".

Para cada etiqueta en VAR_LABELS (ej. milestone-1, setup):

Escribe el nombre de la etiqueta en el cuadro de búsqueda (ej. milestone-1).

Haz clic en la etiqueta que aparece en la lista para seleccionarla.

(Si la etiqueta no existe, tendrás que crearla manualmente primero, pero para este guion asumimos que ya existen o que las escribirás y crearás sobre la marcha).

Haz clic fuera del pop-up de "Labels" para cerrarlo.

Finalizar:

Localiza y haz clic en el botón verde "Submit new issue".

Espera a que la página del nuevo issue cargue (confirmando la creación).

Cierra la pestaña del navegador.

Repetir:

Vuelve al Paso 1 y procesa la siguiente tarea en ISSUES_PLAN.md [cite: ISSUES_PLAN.md] (ej. "Tarea 2: Traducción (i18n)") hasta terminar con la ultima y no queden mas issues.
