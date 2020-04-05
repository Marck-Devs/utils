# Cargador de componentes
[:arrow_left:](https://github.com/Marck-Devs/utils)
## Presentaci&oacute;n
Permite a&ntilde;adir un sistema de templating a la p&aacute;gina web o aplicaci&oacute;n, per a diferenc&iacute;a de otros sistemas, este se ejecuta en el lado del cliente, independizandose del servidor.

## Funcionamiento
Funciona mediante m&oacute;dulos, que los importa de forma din&aacute;mica y los incrusta en el DOM. Estos módulos no son más que carpetas que contienen los archivos del componente:
```
    components/
        - miModulo
            | miModulo.html
            | miModulo.css
            | miModulo.js
```
Dichos módulos se declaran en un archivo de configuración, por defecto se llamará `components.json` pero se podrá modificar en la configuración de la librería. En este archivo se declaran los módulos que se usarán y las etiquetas que les harán referencia.

Si en el html tenemos:
```html
    <html>
        ...
        <body>
            <miModulo></miModulo>
        </body>
    </html>
```

Y en en archivo `components/miModulo/miModulo.html` tenemos:
```html
    <h1>Mi Modulo</h1>
```
El resultado será:
```html
    <html>
        ...
        <body>
            <h1>Mi Modulo</h1>
        </body>
    </html>
```

:exclamation:**Tanto la carpeta como los archivos deberán tener el mismo nombre.**

## Archivo de configuración
Como antes se ha mencionado, el nombre por defecto sera **components.json** pero se podrá cambiar en la configuación de la librería.
```json
{
    "config":{},
    "components": [
        {
            "name": "nombre_del_modulo",
            "tag": "etiqueta_de_referencia"
        }
    ] 
}
```
- `name`: nombre del módulo, este es el nombre de la carpeta
- `tag`: etiqueta que se buscará en el DOM, si la etiqueta es *micomponente*, se buscara en el DOM el elemento `<micomponente/>` o `<micomponente></micomponente>`.

## Iniciaci&oacute;n y configuraci&oacute;n de la librería
La librería ofrece un objeto global llamado `cpLoader`, al cual le podemos pasar la configuración:
```javascript
document.onload = () => {
        window.cpLoader({
            baseUrl: "/components/",
            folderMode: true,
            configFile: "/components.json"
            });
    }
```
- `baseUrl`: carpeta donde se encuentran los módulos, siempre direcciones absolutas respecto al servido y terminadas en /.
- `configFile`: el archivo de configuración, donde se encontrará la de declaración de componentes.
- `folderMode`: indica si los archivos se encuentran en subcarpetas o son archivos independientes, **de momento la opción de archivos simples no está implementada**.

## Extras
Con la librería también hay un peque&ntilde;o programa en python que automatiza la creación de nuevos componentes, de momento no dispone de opciones de configuración por lo que si no se mantiene los valores por defecto, habrá que cambiarlos en el código.

El programa irá pidiendo los datos necesarios para crear la nueva entrada del módulo:
```
Add new component

******************************

Name: <nombre_del_modulo>
Tag for component (enter to get from name): <nombre_de_la_etiqueta>
```