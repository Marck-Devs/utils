# i18n
[:arrow_left:](https://github.com/Marck-Devs/utils)

## Presentaci&oacute;n
Sistema de internazionalizaci&oacute;n para p&aacute;ginas web y aplicaciones web. Facilitando el uso del i18n y agilizando la edici&oacute;n de textos en p&aacute;ginas y aplicaciones.

## Funcionamiento

La librer&iacute;a busca los archivos de la siguiente l&iacute;nea: app.i18n.{lang}.json donde lang ser&aacute; el lenguaje correspondiente.

La libreria busca los elementos del DOM que tengan el atributo `data-i18n=""` y tomar&aacute; como clave el valor de su interior. Este atributo se podr&aacute; cambiar.

## Archivo `app.i18n.{lang}.json`
En este JSON se situan los literales donde las claves son los que permiten identificarlos.

En esta primera versi&oacute;n los literales no se pueden anidar por lo que el json ser&aacute; simple:
```json
{
    "document.title": "Mi t&iacute;tulo",
    "page.title": "T&iacute;tulo de la p&aacute;gina"
}
```
Luego en el html:
```html
<html>
    <head>
        <title data-i18n="document.title"></title>
    </head>
    <body>
        <h1 data-i18n="page.title"></h1>
    </body>
</html>
```

Admite uso de HTML directamente en el JSON por lo que podemos colocar entidades HTML o etiquetas.

## Iniciaci&oacute;n y configuraci&oacute;n del objeto i18n
Para tener acceso al objeto, la librer&iacute;a nos deja el objeto gobal i18n. Para iniciarlo bastar&aacute; con llamar al objeto:
```javascript
    document.onload = () => {
        window.i18n({
            location: "/strings/",
            attr: "data-i18n"
        });
    }
```
En la configuraci&oacute;n:
- `location` hace referencia a d&oacute;nde est&aacute;n los json de los literales. La ruta siempre deber&aacute; ser absoluta(empezar&aacute; por "/" ) y finalizar con el separador de directorios: `/`.
- `attr` define cual ser&aacute; el atributo donde buscar&aacute; la clave del literal, en este caso buscar&aacute; todos los elementos que tengan un atributo `data-i18n`, pero si lo cambiamos a `lit` buscara aquellos que tengan dicho atributo.