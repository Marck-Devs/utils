( function ( w ) {
    function extend( model, object ) {
        var out = model;
        for ( const key in object ) {
            if ( out.hasOwnProperty( key ) ) {
                const ob = object[ key ];
                out[ key ] = ob;
            }
        }
        return out;
    }
    const extensions = [".html", ".js", ".css"];
    // incrusta en el documento el html del archivo eliminando la etiqueta
    function incrutsHTML(tag, html) {
        var label = document.querySelectorAll(tag);
        var body = document.createDocumentFragment();
        var div = document.createElement("div");
        div.innerHTML = html;
        var data = div.childNodes;
        for (let i = 0; i < data.length; i++) {
            const d = data[i];
            body.append(d);            
        }
        for (let i = 0; i < label.length; i++) {
            const tg = label[i];
            document.body.insertBefore(body,tg);
            document.body.removeChild(tg);
        }
    }
    /* 
     * Lee el archivo de configuracion donde se colocaran los componentes con su descripcion:
     * {
     *  config: {
     *      "baseUrl": "", => url de la carpeta donde se encuentran los archivos de los componentes
     *      "folderMode": true|false => si los componentes contienen archivos de javascript y estilos separados, estan separados en carpetas independientes:
     *      - componentsFolder
     *      |- component1
     *          |- component1.html
     *          |- comopent1.css
     *          |- component1.js
     * }
     *  components: [
     *      {
     *          name: "",
     *          tag: "",
     *          desc: ""
     *      } 
     * ]
     * } 
     */
    /**
     * Carga un componente en la pagina
     * @param {Object} config configuracion del loader
     */
    function Loader( config ) {
        // configuracion por defecto
        this.__default = {
            configFile: "/components.json",
            baseUrl: "/",
            folderMode: true
        };
        // se almacena la info de los componentes
        this.components = [];
        // comparamos las opciones por defecto con las que se le pasa
        if(config)
            this.config = extend( this.__default, config );
        else
            this.config = this.__default;
        var self = this;
        // leemos el archivo de configuracion
        this.loadPromise = fetch( this.config.configFile )
            .then( function ( res ) {
                return res.json()
            } )
            .then( function ( data ) {
                self.data = data;
                // guardamos la info de los componentes
                self.components = data.components;
                // comprobamos si hay configuraciones en el archivo
                if(data.config)
                    self.config = extend(self.config, data.config)
            } );
    }
    Loader.prototype = {
        http : function(){
            // TODO: agregar opcion para IE
            return new XMLHttpRequest();
        },
        init: function(){
            var self = this;
            // una vez que se realiza la lectura del archivo de configuracion
            this.loadPromise.then(function(){
                for(var i = 0; i < self.components.length; i++){
                    // trabajamos con los componentes
                    const file = self.config.baseUrl + self.components[i].name  + "/" + self.components[i].name;
                    const rq = self.http();
                    const index = i;
                    rq.onreadystatechange = function(ev) {
                        if(rq.readyState == 4){
                            // recuperamos el contenido del html
                            var html = rq.responseText;
                            // lo procesamos y lo incrustamos
                            incrutsHTML(self.components[index].tag, html);
                            // metemos el script
                            var script = document.createElement("script");
                            script.src =  file + extensions[1];
                            script.async = true;
                            // metemos los estilos
                            var link = document.createElement("link");
                            link.rel="stylesheet";
                            link.href = file + extensions[2];
                            document.head.append(link);
                            document.body.append(script);
                        }
                    }
                    rq.open("GET", file + extensions[0])
                    rq.send()
                        
                    }
                }
            )
        }
    }
    // solo existira un objeto por lo que la clase no sera  publica
    w.cpLoader = function(config){
        return new Loader(config).init();
    }
} )( window )