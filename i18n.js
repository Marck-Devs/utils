( function ( w, d ) {
    function I18n( config ) {
        this.configuration = {
            writable: false, // si se puede modificar el contenido
            location: "/"
        };
        this.__fileTemplate = "app.i18n.%lang.json"; // nombre del archivo, template
        this.currLang = "es"; // lenguage actual
        this.avalibleLang = []; // todos los lenguajes: ["es", "en", "rus",...]
        this.avaliableLangMap = {}; // eschema: {"es" : "español"}
        this.app = {}; // textos de la aplicacion
        this.onrender = null; // evento
        this.onload = null; // evento
        this.ongenerate = null; // evento
        this.onlangchange = null;
        this.loaded = false; // controlamos el estado de la carga
        this.rendered = false; // controlamos el estado del renderizado
        Object.defineProperty( this, "app", {
            enumerable: false
        } );
    }

    I18n.prototype = {
        name: "i18n",
        description: "Ofrece internazionalización a la web de forma sencilla",
        author: "Marck C. Guzm&aacute;m marck.guzman.dev@gmail.com",
        date: "03/2020",
        version: "v0.1.0",
        license: "LICENSE",
        settings: {
            attr: "data-i18n"
        },
        /**
         * Muestra un mensaje en consola
         * @param {String} grade grado del mensaje
         * @param {String} msg mensaje a mostrar
         */
        console: function ( grade, msg ) {
            var template = "I18n - $date - $grade: $msg";
            template = template.replace( "$grade", grade ).replace( "$msg", msg );
            template = template.replace( "$date", new Date().toJSON() );
            console[ grade.toLowerCase() ]( template );
            return template;
        },
        /**
         * renderiza el texto en su correspondiente etiqueta
         * @param {(currElm: number, total: number) => void} proccessCallBack  callback para monitorear el avance
         */
        render: function ( proccessCallBack ) {
            if ( this.loaded ) {
                var elements = d.querySelectorAll( "[" + this.settings.attr + "]" );
                for ( let i = 0; i < elements.length; i++ ) {
                    if ( proccessCallBack && typeof proccessCallBack == "function" )
                        proccessCallBack( i + 1, elements.length );

                    var ltm = elements[ i ];
                    ltm.innerHTML = this.app[ ltm.getAttribute( this.settings.attr ) ];
                }
                return true;
            } else {
                this.console( "WARN", "No se ha cargado el archivo" );
                return false;
            }
        },
        /**
         * renderiza el texto desde el archivo de forma asincrona
         * @param {(currEle :number, total :number) => void} proccessCallBack 
         * @returns {Promise<boolean>} si se ha renderizado el texto
         */
        renderAsync: function ( proccessCallBack ) {
            var self = this;
            return new Promise( function ( res, rej ) {
                if ( !self.loaded ) {
                    var err = new Error( "No se ha cargado el archivo." );
                    rej( err );
                    return false;
                }
                setTimeout( function () {
                    res( self.render( proccessCallBack ) )
                }, 500 );
            } )
        },
        /**
         * Carga el archivo de forma sincrona
         * @param {(currElm: number, total: number) => void} proccessCallBack  callback para monitorear el avance
         * @returns si se ha podido cargar
         */
        load: function ( proccessCallBack ) {
            var out = false;
            this.loaded = false;
            var file = this.__fileTemplate.replace( "%lang", this.currLang );
            if ( file.indexOf( ".." ) != -1 ) {
                this.console( "ERROR", "No se ha encontrado el archivo" );
                return out;
            }
            w.console.log( typeof file )
            var self = this;
            return fetch( this.configuration.location + file ).then( function ( res ) {
                return res.json();
            } ).then( function ( json ) {
                self.app = json;
                self.loaded = true;
                out = true;

                if ( self.onload != null && typeof self.onload == "object" ) {
                    if ( self.onload.length != 0 ) {
                        var ks = Object.keys( self.onload );
                        ks.forEach( function ( val ) {
                            self.onload[ val ]();
                        } )
                    }
                } else if ( typeof self.onload == "function" ) {
                    self.onload();
                }
                return self.render();
            } );

        },
        /**
         * Carga el archivo de forma asincrona
         * @param {(currElm: number, total: number) => void} proccessCallBack  callback para monitorear el avance
         * @returns si se ha podido cargar
         */
        loadAsync: function ( proccessCallBack ) {
            var self = this;
            return new Promise( function ( res, rej ) {
                setTimeout( function () {
                    res( self.load( proccessCallBack ) );
                }, 400 )
            } );
        },
        /**
         * cambia el lenguaje actual
         * @param {String} lang lenguaje
         */
        setLang: function ( lang ) {
            var pre = this.currLang;
            if ( !( lang.toLowerCase() in this.avalibleLang || lang.toLowerCase() in Object.keys( this.avaliableLangMap ) ) ) {
                this.console( "WARN", "El idioma no se encuentra en los disponibles" );
                return false;
            }
            this.currLang = lang.toLowerCase();
            var out = this.load();
            if ( !out ) {
                this.currLang = pre;
                this.console( "ERROR", "No se pudo cambiar el idoma" );
                this.load();
                return false;
            }
            if ( typeof this.onlangchange == "function" )
                this.onlangchange( {
                    previus: pre,
                    current: this.currLang
                } );
            else if ( this.onlangchange != null && typeof this.onlangchange == "object" ) {
                var ks = Object.keys( this.onlangchange );
                for ( let i = 0; i < ks.length; i++ ) {
                    const evt = ks[ i ];
                    this.onlangchange[ evt ]( {
                        previus: pre,
                        current: this.currLang
                    } );
                }
            }
        },
        /**
         * @method
         * Establece los lenguajes que tendrá la app
         * @param {Array | Object} data array o json con los datos de los lenguajes
         * @returns {boolean} si se a podido realizar la operacion
         */
        setAvailableLangs: function ( data ) {
            if ( !data || data == null ) {
                this.console( "INFO", "Array de idiomas vacios" )
            }
            if ( data instanceof Array ) {
                this.avalibleLang = data;
                this.avaliableLangMap = {};
                for ( let i = 0; i < data.length; i++ ) {
                    const lang = data[ i ];
                    this.avaliableLangMap[ lang ] = lang;
                }
                return true;
            } else if ( typeof data == "object" ) {
                this.avalibleLang = [];
                this.avaliableLangMap = data;
                for ( const key in data ) {
                    if ( data.hasOwnProperty( key ) ) {
                        const lang = data[ key ];
                        this.avalibleLang.push( lang );
                    }
                }
                return true;
            }
            return false;
        }

    } // end prototype
    w.i18n = new I18n();
    w.i18n.load();

} )( window, document );