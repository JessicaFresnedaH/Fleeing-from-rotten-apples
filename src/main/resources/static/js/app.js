/* global Stomp, apiClient */
var app = (function(){

    var api= apiClient;
    var stompClient = null;

//    Variables del canvas

    var canvasWidth = 600;
    var canvasHeight = 600;
    var canvas = null;
    var ctx = null;
    var tamano = null;
    var cwidth = null;
    var cheight = null;
    var cont = 0;
    var x = null;
    var y = null;
    var X = null;
    var Y = null;
    var vidas=3;
    var puntaje=0;

//    Variables para los eventos del mouse

    var mx = null;
    var my = null;

//    Variables datos del usuario actual
    var usuario = null;
    var nombreP = null;
    var tipoPartida = null;

    function connectarJuego() {

        console.info('Connecting to WS... /tableroJuego');
        var socket = new SockJS('/stompApple');
        stompClient = Stomp.over(socket);
        stompClient.connect({}, function (frame) {

            console.log('Connected' + frame);
            var parametros = window.location.search.substr(1);
            var parametros1 = parametros.split("&");
            nombreP = parametros1[0];
            usuario = parametros1[1];
            alert("Bienvenid@ " + usuario + ", ha ingresado al campo de juego: " + nombreP);

            canvas = document.getElementById("canvas");
            ctx = canvas.getContext('2d');
            var img = new Image();
//            img.src = "/images/logo1.jpg";
//            img.onload = function () {
//                ctx.drawImage(img, 0, 0);
//            };

            tamano = canvas.width / 10;
            cwidth = ~~(canvas.width / tamano);
            cheight = ~~(canvas.height / tamano);
            EventosMouse();
            dibujarPantalla();

            stompClient.subscribe('/topic/partidaNueva.' + nombreP , function (datos) {

                tipoPartida = JSON.parse(datos.body);
                document.getElementById("Usuario").innerHTML = usuario;

                if (tipoPartida === "Publica") {
                    document.getElementById("Partida").innerHTML = "Publica";

                } else{
                    document.getElementById("Partida").innerHTML = nombreP;
                }
            } ),

            stompClient.subscribe('/topic/vidasJugador.' + nombreP + "." + usuario , (function (data) {
                var user = JSON.parse(data.body);
                $("#vidas").text("Vidas: " + user.numVidas);
            }));

            stompClient.subscribe('/topic/puntosJugador.' + nombreP + "." + usuario, function (data){
                var user = JSON.parse(data.body);
                $("#puntaje").text("Puntaje: " + user.puntaje);
            });

            stompClient.subscribe('/topic/manzanasPodridas.' + nombreP , function (datos) {
                
                var nuevoJuego = JSON.parse(datos.body);
                document.getElementById("manzanasPodridas").innerHTML = nuevoJuego.manzanasPodridas;
            });

            stompClient.subscribe('/topic/casillaVisitada.' + nombreP , function (datos) {
                cambiaCasilla(JSON.parse(datos.body));
            });

            stompClient.subscribe('/topic/llenarTablero.' + nombreP + "." + usuario, function (data) {
                cambiaCasilla(JSON.parse(data.body));
            });

            stompClient.subscribe('/topic/retirarJugador.' + nombreP + "." + usuario , function(data){
                alert("Lo siento, te has quedado sin vidas.");
            });

            stompClient.subscribe('/topic/finJuego.' + nombreP , function (data) {
                var fin = JSON.parse(data.body);
                alert("Sólo queda un jugador en pie. Fin de la partida");
                alert("El jugador con mayor puntaje fue: " + fin[0].nombre + " con " + fin[0].puntaje);
                alert("El último jugador en pie fue: " + fin[1].nombre);
            });

            cargarTablero();
//            establecerPartida();
        });

    };

    function disconnect() {
        if (stompClient !== null) {
            stompClient.disconnect();
        }
        console.log("Desconectando...");
    };

    function cambiaCasilla(casilla){
        var posicionX = casilla.x;
        var posicionY = casilla.y;
        var color = casilla.color;
        prueba=casilla;
        
//        if (color==="red" && sessionStorage.getItem("nombreuser")=== casilla.username){
//            //se quitó una vida
//            vidas=vidas-1;
//            $("#vidas").text("Vidas:"+vidas);
//        }
        
        var indicador = casilla.indicador;
        if(indicador > 0 ){
            colocarText(indicador, color, posicionX, posicionY);
        } else{
//            if (sessionStorage.getItem("nombreuser")=== casilla.username){
//                //se quitó una vida
//                puntaje=puntaje+5;
//                $("#puntaje").text("Puntaje: "+puntaje);
//            }
            llenar(posicionX, posicionY, color);
        }

    };

//    x: Coordenada X
//    y: Coordenada Y
//    c: Color
    function llenar(x, y, c) {
        ctx.fillStyle = c;
        ctx.fillRect(x * tamano, y * tamano, tamano, tamano);
    };

    function colocarText(numero, color, gx, gy) {
        ctx.fillStyle = color;
        ctx.font = 0.5 * tamano + "px Georgia";
        ctx.fillText(numero, gx * tamano + tamano / 3, gy * tamano + 2 * tamano / 3);
    };

//    Evalúa el contenido de la casilla seleccionada.
    function mirarCasilla(X, Y) {
        stompClient.send("/app/destaparCasilla", {}, JSON.stringify({nombreP: nombreP, jugador: usuario, posicionX: X, posicionY: Y}));
    };

//    Tan pronto se conecte a una nueva partida, se requiere obtener el estado actual del tablero
    function cargarTablero() {
        stompClient.send("/app/llenarTablero", {}, JSON.stringify({nombreP: nombreP, tipoPartida: null, nivel: null, usuario: usuario}))
    };

//    Manejo de eventos en el Mouse;
    function EventosMouse() {
        $('#canvas').mousedown(function (evento) {
            mx = evento.offsetX;
            my = evento.offsetY;

            X = ~~(mx / tamano);
            Y = ~~(my / tamano);

            switch (evento.which) {
                case 1:
                    mirarCasilla(X, Y);
                    break;
                case 2:
                    break;
                case 3:
                    break;
                default :
                    alert('No corresponde');
            }
        });
    };

//    Dibujar filas y columnas en el CANVAS
    function dibujarPantalla() {

        for (var x = 0; x <= canvasWidth; x += tamano) {
            ctx.moveTo(x, 0);
        ctx.lineTo(x, canvasWidth);
        }

        for (var x = 0; x <= canvasHeight; x += tamano) {
            ctx.moveTo(0, x);
        ctx.lineTo(canvasHeight, x);
        }
        ctx.strokeStyle = "white";
        ctx.stroke();
    };

//////////////////////////////////////////////////////////////////

    function nuevasCasillas(posicionX, posicionY, color, estado) {
        llenar(posicionX, posicionY, 'red');
//    switch (true) {
//        case true:
//            llenar(posicionX, posicionY, 'red');
//            break;
//        case 'false':
//            llenar(posicionX, posicionY, 'verde');
//            break;
//        case '1':
//            llenar(posicionX, posicionY, color);
//            colocarText(estado, 'blue', posicionX, posicionY);
//            break;
//        case '2':
//            llenar(posicionX, posicionY, color);
//            colocarText(estado, 'yellow', posicionX, posicionY);
//            break;
//
//        case '3':
//            llenar(posicionX, posicionY, color);
//            colocarText(estado, 'green', posicionX, posicionY);
//            break;
//        case '4':
//            llenar(posicionX, posicionY, color);
//            colocarText(estado, 'red', posicionX, posicionY);
//            break;
//
//        case '5':
//            llenar(posicionX, posicionY, color);
//            colocarText(estado, 'gray', posicionX, posicionY);
//            break;
//        case '6':
//            llenar(posicionX, posicionY, color);
//            colocarText(estado, 'blue', posicionX, posicionY);
//            break;
//        case '7':
//            llenar(posicionX, posicionY, color);
//            colocarText(estado, 'fuchia', posicionX, posicionY);
//            break;
//        case '8':
//            llenar(posicionX, posicionY, color);
//            colocarText(estado, 'pink', posicionX, posicionY);
//            break;
//    }

    };

    function establecerPartida() {
        stompClient.send("/app/establecePartida", {}, JSON.stringify({partida: nombreP, jugador: usuario}));
    };

//

    $(document).ready(
        function () {
            connectarJuego();
            $("#nombrejugador").text("Nombre:" + sessionStorage.getItem("nombreuser"));
            $("#vidas").text("Vidas: " + vidas);
            $("#puntaje").text("Puntaje: " + puntaje);
        }
    );

    return {
        salirDelJuego: function () {
            stompClient.send("/app/abandona", {}, JSON.stringify({nombreP: nombreP, tipoPartida: null, nivel: null, usuario: usuario}))
            window.location.replace("/index.html");
            //desconectar();
            //Intentar desconectar y redireccionar mediante promesas ;)
        }
    };

})();
