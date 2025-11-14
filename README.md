# YouTube Shorts to Watch Converter

![YouTube](https://img.shields.io/badge/YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white)
![Chrome](https://img.shields.io/badge/Chrome%20Extension-4285F4?style=for-the-badge&logo=googlechrome&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

Esta es una extensión de Chrome simple diseñada para resolver un problema común en la versión de escritorio de YouTube: la interfaz de los Shorts.

## El Problema

Cuando navegas por YouTube Shorts en una PC, la interfaz oculta funciones clave como:
* La sección de comentarios.
* La opción de "Guardar en lista de reproducción" (o guardarlo en "Ver más tarde").
* La descripción completa del video.

## La Solución

Esta extensión detecta si estás en un video de YouTube Short (`youtube.com/shorts/...`) y añade un botón a la página (o se activa al hacer clic en el ícono de la extensión) que te redirige instantáneamente a la interfaz de video estándar (`youtube.com/watch?v=...`).

**¡Con un solo clic, recuperas los comentarios, la opción de guardar y la descripción!**

## Cómo Usar

1.  Navega a cualquier video de YouTube Short (por ejemplo: `https://www.youtube.com/shorts/VIDEO_ID`).
2.  Haz clic en el ícono de la extensión en la barra de tu navegador.
3.  La pestaña se recargará automáticamente con la URL de video estándar (por ejemplo: `https://www.youtube.com/watch?v=VIDEO_ID`).

## Instalación (Manual)

Como esta extensión no está (todavía) en la Chrome Web Store, puedes cargarla manualmente:

1.  Clona o descarga este repositorio en tu computadora.
2.  Abre Google Chrome y ve a `chrome://extensions/`.
3.  Activa el **"Modo desarrollador"** (usualmente un interruptor en la esquina superior derecha).
4.  Haz clic en **"Cargar descomprimida"**.
5.  Selecciona la carpeta donde descargaste (o clonaste) este proyecto.
6.  ¡Listo! El ícono de la extensión debería aparecer en tu barra de herramientas.