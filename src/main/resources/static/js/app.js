/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/*
 * Jessica, Johana
 */
/* global Stomp */

/*variables de STOMP*/
stompClient=null;
canvasWidth=600;
canvasHeight=600;
Canvas=null;
ctx=null;
tamano=null;
cwidth=null;
cheight=null;
cont=0;
nombre="Evangeline";
x=null;
y=null;
X= null;
Y=null;
/*
 * 
 *Variables para los eventos del mouse
 */
mx=null;
my=null;

var app= function(){

function connectarJuego(){
      
        console.info('Connecting to WS...');
        var socket = new SockJS('/stompApple');
        stompClient = Stomp.over(socket);
        stompClient.connect({},function (frame){
        console.log('Connected'+frame);
    
        
        /*
         * Crear Jueago
         */
        
        var datos=window.location.search.substr(1);
       // var datos1=datos.split("&");
      //  id=dato1[0];
      //  nombre=dato1[1];
        
        //
         
        
        stompClient.subscribe('/topic/crearCampoJuego/'+nombre, function (datos){
            console.log("3");
            alert("Usted a ingresado al campo de Juego APPLE BAD, Bienvenido"+nombre);
            var nuevoJuego=JSON.parse(datos.body);
            tipPartida=nuevoJuego.tipPartida;
            document.getElementById("jugador").innerHTML=tipPartida.jugador;
            
            if (tipPartida==="Publica"){
                document.getElementById("Partido").innerHTML= "Pública";
                
            }
            else{
                //document.getElementById("Partido").innerHTML=id;
            }
            
            canvas=document.getElementById("canvas");
            ctx=canvas.getContext('2d');
            tamano=cwidth/nuevoJuego.filas;
            width=~~ (canvas.width/tamano);
            height = ~~ (canvas.height/tamano);
            EventosMouse();
            dibujarPantalla();
            mirarTodasCasillas();   
                    
        });
        
         stompClient.subscribe('/topic/vidasJugador'+nombre,function (datos){
             var nuevoJuego=JSON.parse(datos.body);
             document.getElementById("vidajugador").innerHTML=nuevoJuego.vidasJugador;
         });
         
         stompClient.subscribe('/topic/manzanasPodridas'+nombre,function (datos){
             var nuevoJuego=JSON.parse(datos.body);
             document.getElementById("manzanasPodridas").innerHTML=nuevoJuego.manzanasPodridas;
         });
         
          stompClient.subscribe('/topic/casillaVisitada'+nombre,function (datos){
             var casilla=JSON.parse(datos.body);
             var posicionX=casilla.posicionX;
             var posicionY=casilla.posicionY;
             var color=casilla.color;
             var estado = casilla.estado;
             
             nuevasCasillas(posicionX,posicionY,color,estado);
         });
         
          stompClient.subscribe('/topic/finJuegoRetirar'+nombre,function (datos){
             var fin=JSON.parse(datos.body);
             if(!fin.estadoJugador){
                 alert("Has perdido");
                 window.location.replace("/index.html");
             }
            
         });
         
         establecerPartida();
         
              
 });
}


function nuevasCasillas(posicionX,posicionY,color,estado){
    switch (estado){
        case 'true':
            llenar(posicionX,posicionY,'red');
            break;
        case 'false':
            llenar(posicionX,posicionY,color);
            break;
        case '1':
            llenar(posicionX,posicionY,color);
            colocarText(estado,'blue', posicionX, posicionY);
            break;
        case '2':
            llenar(posicionX,posicionY,color);
            colocarText(estado,'yellow', posicionX, posicionY);
            break;
       
        case '3':
            llenar(posicionX,posicionY,color);
            colocarText(estado,'green', posicionX, posicionY);
            break;
       case '4':
            llenar(posicionX,posicionY,color);
            colocarText(estado,'red', posicionX, posicionY);
            break;
            
        case '5':
            llenar(posicionX,posicionY,color);
            colocarText(estado,'gray', posicionX, posicionY);
            break;
        case '6':
            llenar(posicionX,posicionY,color);
            colocarText(estado,'blue', posicionX, posicionY);
            break;
        case '7':
            llenar(posicionX,posicionY,color);
            colocarText(estado,'fuchia', posicionX, posicionY);
            break;
         case '8':
            llenar(posicionX,posicionY,color);
            colocarText(estado,'pink', posicionX, posicionY);
            break;   
    }
    
}
function salirDelJuego(){
        desconectar();
        window.location.replace("/index.html");
}

function llenar(s,x,y) {
    ctx.fillStyle = s;
    ctx.fillRect(x * tamano, y * tamano, tamano, tamano);
}

function colocarText(numero, color, gx, gy){
    ctx.fillStyle = color;
    ctx.font = 0.5*tamano+"px Georgia";

    ctx.colocarText(numero, gx*tamano + tamano/3, gy*tamano+ 2*tamano/3);
}


function desconectar(){
     if (stompClient!==null) {
         stompClient.desconectar();
        
 }
     console.log("Desconectar");
}


function establecerPartida(){
    stompClient.send("/app/establecePartida",{}, JSON.stringify({jugador:nombre}));
}

function mirarCasilla(){
    stompClient.send("/app/cubrirCasilla",{},JSON.stringify({jugador:nombre,posicionX:0,posicionY:0}));

}
function mirarTodasCasillas(){
    console.log("ENTRO A LAS CASILLAS")
    stompClient.send("/app/cubrirCasilla",{},JSON.stringify({jugador:nombre,posicionX:posicionX,posicionY:posicionY}));

}
/*
 * Manejo de eventos en el Mouse;
 */
function EventosMouse(){
    console.log("entro a mouse");
    $('#canvas').mousedown(function(evento) {
        mx= event.offsetX;
        my= event.offsetY;
        
        X= ~~(mx/tamano);
        Y= ~~ (my/tamano);
        
        switch (evento.which){
            case 1:
                mirarCasilla(X,Y);
                break;
            case 2:
                break;
            case 3:
                
                llenar('#00ff00',X,Y);
                break;
            default :
                alert('no correspond');
        }
    });
}
    

/*
 * Dibujar filas y columnas en el CANVAS
 */    

function dibujarPantalla(){
  console.log("ENTRO JOHANITA");
    for (var x=0;x<=canvasWidth;x+=tamano){
        ctx.moveTo(0,5+x+cont,cont);
        ctx.lineTo(0,5+x+cont,canvasHeight+cont);
   }
    for (var x=0;x<=canvasHeight;x+=tamano){
        ctx.moveTo(cont,0,5+x+cont);
        ctx.lineTo(canvasWidth+cont,0,5+x+cont);
   }
    ctx.strokeStyle="black";
    ctx.stroke();
};
  return {

        init: function () {
            var can = document.getElementById("canvas");
            
            //websocket connection
            connectarJuego();
        }
    };
}();
    


