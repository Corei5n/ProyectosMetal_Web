# Proyectos De Metal

Sitio web profesional, moderno y preparado para GitHub Pages para la herrería **Proyectos De Metal**.

## Requisitos

- Node.js 18 o superior.
- npm.

## Instalación

```bash
npm install
```

## Desarrollo local

```bash
npm run dev
```

Luego abre la URL que muestre Vite.

## Build de producción

```bash
npm run build
```

El resultado se genera en `dist/`.

## Estructura de imágenes

Coloca tus archivos aquí:

```text
src/assets/proyectos/
├── portones/
├── escaleras/
├── pergolados/
├── techados/
├── barandales/
├── protecciones/
├── puertas/
├── estructuras/
└── otros/
```

El sitio detecta automáticamente las imágenes admitidas:

- `.jpg`
- `.jpeg`
- `.png`
- `.webp`
- `.avif`

## Cómo agregar fotografías

1. Copia las imágenes dentro de la carpeta de la categoría.
2. Nómbralas con orden numérico natural, por ejemplo:

```text
01-porton.jpg
02-porton.jpg
10-porton.jpg
```

3. Haz commit y push.
4. GitHub Actions reconstruye el sitio.

No necesitas registrar imágenes en JavaScript.

## Cómo crear una categoría nueva

1. Crea una carpeta nueva dentro de `src/assets/proyectos/`.
2. Agrega imágenes dentro de esa carpeta.
3. Vuelve a ejecutar el build o haz push a GitHub.

La nueva carpeta aparecerá como categoría automáticamente.

## Cómo eliminar fotografías

Elimina el archivo de imagen de la carpeta correspondiente y vuelve a ejecutar el build.

## Logo

El logo debe colocarse en:

```text
src/assets/logo/logo.png
```

El diseño actual está preparado para un logo con fondo negro, sin marcos blancos ni tarjetas claras.

## Imagen principal del hero

Si quieres usar una imagen destacada, colócala en:

```text
src/assets/hero/hero.jpg
```

Si la imagen no existe, el sitio muestra un fondo alternativo y no se rompe.

## Cambiar WhatsApp

Edita estos valores en `src/main.js`:

- `phoneDisplay`
- `phoneInternational`
- `CONTACT_MESSAGE`

El enlace base es:

```text
https://wa.me/527775093569
```

## Cambiar el correo

Edita `emailAddress` en `src/main.js`.

## Cambiar los textos

Los textos principales están en `src/main.js`.

## Contraste y legibilidad

El diseño usa texto claro sobre fondos oscuros con prioridad en la lectura. Si agregas contenido nuevo, conserva estos colores:

- Texto principal: `#f8f7fa`
- Texto secundario: `#d4d0da`
- Texto atenuado: `#aaa4b2`

## GitHub Pages

El proyecto está listo para publicarse en GitHub Pages.

### Archivo de despliegue

- `.github/workflows/deploy.yml`

### Base de Vite

La base está configurada en:

```js
// vite.config.js
base: './'
```

Si alguna vez necesitas cambiarla, edita `vite.config.js`.

### Qué hace el workflow

1. Instala dependencias.
2. Ejecuta el build.
3. Publica la carpeta `dist`.
4. Se ejecuta en cada push a `main`.

## Configuración de GitHub Actions

El workflow usa una URL base calculada con:

```text
https://OWNER.github.io/REPO/
```

Eso permite que funcione aunque el repositorio tenga otro nombre.

## Archivos SEO

Incluye:

- `public/robots.txt`
- `public/sitemap.xml`
- Open Graph
- Twitter Card
- datos estructurados `LocalBusiness`

## Formatos permitidos

- JPG
- JPEG
- PNG
- WebP
- AVIF

## Cómo revisar el build antes de hacer push

```bash
npm run build
```

Revisa que:

- No haya errores en consola.
- El menú móvil abra y cierre bien.
- Los filtros funcionen.
- La galería cargue correctamente.
- El lightbox responda a teclado y toque.
- Los enlaces de WhatsApp, teléfono y correo funcionen.

## Problemas comunes

### El hero no muestra imagen

Agrega `src/assets/hero/hero.jpg`. Si no existe, el sitio usa un fallback visual.

### No aparecen categorías

Agrega al menos una imagen dentro de alguna carpeta bajo `src/assets/proyectos/`.

### El build apunta a una URL incorrecta

Revisa `SITE_URL` y `VITE_SITE_URL` en `.github/workflows/deploy.yml` si cambiaste el dominio o el esquema de publicación.

## Publicación manual

Después de verificar localmente:

```bash
git add .
git commit -m "Sitio web de Proyectos De Metal"
git push
```

GitHub Actions publicará automáticamente el sitio.
