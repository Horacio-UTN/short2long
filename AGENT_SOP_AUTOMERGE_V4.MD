# **Guion de Orquestación del Agente Maestro (Comet) v4 \- ¡MODO DE FUSIÓN AUTOMÁTICA\!**

**Propósito:** Este es el bucle de trabajo principal del proyecto. Tu trabajo, Comet, es actuar como mi Gerente de Proyecto. Tu objetivo es encontrar la próxima tarea válida, delegarla a Claude, y luego **automáticamente aprobar y fusionar (merge)** el Pull Request resultante, para luego repetir el ciclo.

**ADVERTENCIA: Este guindo fusionará código en main sin revisión humana. ¡Es el plan "YOLO" de Horacio\!**

### **Bucle de Orquestación Maestro (Ejecutar en loop):**

**Fase 1: Leer el Estado del Tablero (GitHub)**

1. **Acción:** Ve a la pestaña de "Issues" de GitHub del repositorio Horacio-UTN/short2long.  
2. **Acción:** Escanea la lista de *issues*.  
3. **Acción:** Crea una variable (o lista mental) VAR\_LISTA\_CERRADAS con los números de todas las *issues* "Closed" (ej. \["\#12"\]).

**Fase 2: Encontrar la Próxima Tarea Válida (Lógica de Decisión)**

1. **Acción:** Ve a la pestaña que tiene el AGENT\_SOP\_LITERAL.md$$cite: AGENT\_SOP\_LITERAL.md$$  
   (nuestro plan maestro).  
2. **Acción:** Itera por las 17 tareas, empezando por la TAREA 1\.  
3. **Acción (Bucle de Decisión):**  
   * **Para cada Tarea (ej. TAREA 2, Issue \#13):**  
   * **Pregunta 1:** ¿El ID de esta *issue* (\#13) está en VAR\_LISTA\_CERRADAS?  
   * **Respuesta SÍ:** Esta tarea está terminada. Pasa a la siguiente Tarea.  
   * **Respuesta NO:** (La *issue* está "Open"). Procede a la Pregunta 2\.  
   * **Pregunta 2 (Dependencias):** ¿Todas las dependencias de esta Tarea (ej. Tarea 1 / Issue \#12) están en VAR\_LISTA\_CERRADAS?  
   * **Respuesta SÍ:** ¡ACCIÓN ENCONTRADA\! Has encontrado la próxima tarea válida. Almacena este número de *issue* (ej. \#13) en VAR\_ISSUE\_ACTUAL. Almacena el Título y Cuerpo en VAR\_TITULO y VAR\_CUERPO. Salta a la Fase 3\.  
   * **Respuesta NO:** (Bloqueada). Pasa a la siguiente Tarea.  
4. **Acción (Fin del Bucle):**  
   * **Si (no encontraste VAR\_ISSUE\_ACTUAL):** DETENTE. Notifica a Horacio: "Jefe, no hay tareas válidas para iniciar. Esperando que se completen las dependencias. Me voy a dormir por 10 minutos."

**Fase 3: Delegar la Tarea Válida (A Claude)**

1. **Acción:** (Has determinado que la próxima tarea es VAR\_ISSUE\_ACTUAL, ej. \#13).  
2. **Acción:** Ve a la pestaña de Claude Code.  
3. **Acción:** Inicia una nueva conversación.  
4. **Acción:** Pega el siguiente prompt literal en Claude Code:  
   Hola Claude,  
   Necesito tu ayuda para implementar esta issue de GitHub. El trabajo previo ya está fusionado.

   \*\*Issue a Implementar (ID de GitHub):\*\* \[Pegar VAR\_ISSUE\_ACTUAL aquí, ej. \#13\]  
   \*\*Título:\*\* \[Pegar VAR\_TITULO aquí\]  
   \*\*Descripción y Tareas:\*\*  
   \[Pegar VAR\_CUERPO aquí\]

   \*\*Instrucciones de Git OBLIGATORIAS:\*\*  
   1\.  Crea una nueva branch para esta tarea (ej. \`feature/\[ID-del-issue\]\`).  
   2\.  Crea un commit con un mensaje claro que INCLUYA la palabra mágica "Closes \#\[ID-del-issue\]" (ej. "Closes \#13: Agrega permisos al manifest").  
   3\.  Crea el Pull Request.  
   4\.  Fusionalo y cierra el issue.

   Por favor, procede.

5. **Acción:** Envía el prompt a Claude.  
6. **Acción:** Pasa a la Fase 4\.

**Fase 4: Supervisar y Auto-Fusionar (El Bucle de Confianza)**

1. **Acción:** Ahora entras en modo "Supervisión" para la VAR\_ISSUE\_ACTUAL (ej. \#13).  
2. **Acción:** Ve a la pestaña principal de "Pull Requests" del repositorio en GitHub.  
3. **Acción (Bucle de Espera):**  
   * **Pregunta:** ¿Ves un Pull Request "Open" que mencione "Closes \#$$VAR\_ISSUE\_ACTUAL$$  
     " (ej. "Closes \#13") en su título o descripción?  
   * **Respuesta NO:** (Claude sigue trabajando). Espera 1 minuto. Refresca la página. Repite la pregunta.  
   * **Respuesta SÍ:** ¡PR DETECTADO\! (ej. "Closes \#13: Agrega permisos...").  
   * **Acción:** Haz clic en ese Pull Request para abrirlo.  
   * **Acción:** (Omitir Revisión de Código) Desplázate hasta el final de la página.  
   * **Acción:** Localiza y haz clic en el botón verde "Merge pull request".  
   * **Acción:** Localiza y haz clic en el botón verde "Confirm merge".  
   * **Acción:** ¡Fusión completada\! El PR está cerrado. La Issue (\#13) se cerrará automáticamente.  
4. **Acción:** Notifica a Horacio: "¡Éxito\! El PR de Claude para la Tarea \#13 ha sido auto-fusionado. Volviendo a la Fase 1 para encontrar la próxima tarea."  
5. **Acción:** Vuelve a la Fase 1 de este guion, hasta completar todas las issues pendientes.
