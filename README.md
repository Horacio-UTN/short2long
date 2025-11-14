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

## Estructura del Proyecto

```
short2long/
├── manifest.json       # Configuración de la extensión
├── background.js       # Lógica principal de conversión
├── icons/              # Iconos de la extensión
│   ├── icon.svg       # Icono base en formato SVG
│   ├── icon16.png     # Icono 16x16 (debe ser generado)
│   ├── icon48.png     # Icono 48x48 (debe ser generado)
│   └── icon128.png    # Icono 128x128 (debe ser generado)
└── README.md
```

## Instalación (Manual)

Como esta extensión no está (todavía) en la Chrome Web Store, puedes cargarla manualmente:

### 1. Preparar los iconos

Los iconos PNG deben ser generados desde el archivo SVG incluido. Puedes hacerlo de varias formas:

**Opción A: Usar un convertidor online**
- Sube `icons/icon.svg` a https://cloudconvert.com/svg-to-png
- Genera versiones de 16x16, 48x48 y 128x128 píxeles
- Guárdalos en la carpeta `icons/` con los nombres correspondientes

**Opción B: Usar ImageMagick (si lo tienes instalado)**
```bash
convert icons/icon.svg -resize 16x16 icons/icon16.png
convert icons/icon.svg -resize 48x48 icons/icon48.png
convert icons/icon.svg -resize 128x128 icons/icon128.png
```

**Opción C: Usar tus propios iconos**
- Simplemente coloca tus imágenes PNG en la carpeta `icons/` con los tamaños correctos

### 2. Cargar la extensión en Chrome

1.  Clona o descarga este repositorio en tu computadora.
2.  Asegúrate de tener los iconos PNG en la carpeta `icons/` (ver paso anterior).
3.  Abre Google Chrome y ve a `chrome://extensions/`.
4.  Activa el **"Modo desarrollador"** (usualmente un interruptor en la esquina superior derecha).
5.  Haz clic en **"Cargar descomprimida"**.
6.  Selecciona la carpeta donde descargaste (o clonaste) este proyecto.
7.  ¡Listo! El ícono de la extensión debería aparecer en tu barra de herramientas.

## Características Técnicas

- **Manifest V3**: Utiliza la última versión del manifiesto de Chrome
- **Service Worker**: Background script optimizado para mejor rendimiento
- **Notificaciones**: Feedback visual cuando la extensión se usa en páginas que no son Shorts
- **Título dinámico**: El ícono de la extensión cambia su tooltip según el tipo de página
- **Preservación de parámetros**: Mantiene cualquier parámetro adicional de la URL original

## Cómo Funciona

La extensión:

1. Escucha los clics en el ícono de la extensión (`chrome.action.onClicked`)
2. Verifica si la URL actual es un YouTube Short (formato: `/shorts/VIDEO_ID`)
3. Extrae el ID del video de la URL
4. Construye la URL de watch estándar (`/watch?v=VIDEO_ID`)
5. Redirige la pestaña actual a la nueva URL

## Privacidad

Esta extensión:
- ✅ NO recopila ningún dato
- ✅ NO requiere acceso a tu historial de navegación
- ✅ Solo funciona cuando haces clic en el ícono
- ✅ Solo tiene permisos para youtube.com

## Contribuir

¡Las contribuciones son bienvenidas! Siéntete libre de:
- Reportar bugs
- Sugerir nuevas características
- Enviar pull requests

## Licencia

Este proyecto es de código abierto y está disponible para uso libre.