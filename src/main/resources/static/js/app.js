/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/*
 * Jessica, Johana
 */
/* global Stomp */

cwidth=null;
cheight=null;
cont=0;
nombre=null;
x=null;
y=null;
X= null;
Y=null;
tamano=null;

/*variables de STOMP*/
stompClient=null;
Canvas=null;
ctx=null;
canvasHeight=600;
canvasWidth=600;

tamano=null;
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
        var datos1=datos.split("&");
        id=dato1[0];
        nombre=dato1[1];
        
        //
        
        stompClient.subscribe('/topic/crearCampoJuego'+id+nombre, function (datos){
            alert("Usted a ingresado al campo de Juego APPLE BAD, Bienvenido"+nombre);
            var nuevoJuego=JSON.parse(datos.body);
            tipPartida=nuevoJuego.tipPartida;
            document.getElementById("jugador").innerHTML=tipPartida.jugador;
            if (tipPartida=="Publica"){
                document.getElementById("Partido").innerHTML= "Pública";
                
            }
            else{
                document.getElementById("Partido").innerHTML=id;
            }
            
            canvas=document.getElementById("tabla");
            ctx=canvas.getContext('2d');
            tamano=cwidth/nuevoJuego.filas;
            width=~~ (canvas.width/tamano);
            height = ~~ (canvas.height/tamano);
            eventosJuegos();
            dibujarPantalla();
            mirarTodasCAsillas();   
            
        });
        
         stompClient.subscribe('/topic/vidasJUgador'+id+nombre,function (datos){
             var nuevoJuego=JSON.parse(datos.body);
             document.getElementById("vidajugador").innerHTML=nuevoJuego.vidasJugador;
         });
         
         stompClient.subscribe('/topic/manzanasPodridas'+id+nombre,function (datos){
             var nuevoJuego=JSON.parse(datos.body);
             document.getElementById("manzanasPodridas").innerHTML=nuevoJuego.vidasJugador;
         });
         
          stompClient.subscribe('/topic/casillaVisitada'+id+nombre,function (datos){
             var casilla=JSON.parse(datos.body);
             var posicionX=casilla.posicionX;
             var posicionY=casilla.posicionY;
             var color=casilla.color;
             var estado = casilla.estado;
             
             nuevasCasillas(posicionX,posicionY,color,estado)
         });
         
          stompClient.subscribe('/topic/finJuegoRetirar'+id+nombre,function (datos){
             var fin=JSON.parse(datos.body);
             if(!fin.estadoJugador){
                 alert("Has perdido");
                 window.location.replace("/index.html");
             }
            
         });
         
         iniciarPartida();
         
              
 });
}


function nuevasCasillas(posicionX,posicionY,color,estado){
    switch (estado){
        case 'true':
            llenar(posicionX,posicionY,color);
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

function llenar(s,x,y) {
    ctx.fillStyle = s;
    ctx.fillRect(gx * tamano, gy * tamano, tamano, tamano);
}

function colocarText(numero, color, gx, gy){
    ctx.fillStyle = color;
    ctx.font = 0.5*tamano+"px Georgia";
    ctx.colocarText(numero, gx*tamano + tamano/3, gy*tamano+ 2*tamanosize/3);
}

function prconectar(){
    var datos=window.location.search.substr(1);
    var datos1=datos.split ("&");
    id=dato1[0];
    nombre=dato1[1];
}

function desconectar(){
     if (stompClient != null) {
         stompClient.desconectar();
        
     }
     console.log("Desconectar");
}
function dibujarPantalla(){
  console.log("ENTRO JOHANITA");
    for (var x=0;x<=canvasWidth;x+=tamano){
        ctx.moveTo(0,5+x+cont,cont);
        ctx.lineTo(0,5+x+cont,canvasHeight+cont);
   }
    for (var x=0;x<=canvasHeigth;x+=tamano){
        ctx.moveTo(cont,0,5+x+cont);
        ctx.lineTo(canvasWidth+cont,0,5+x+cont);
   }
    ctx.strokeStyle="black";
    ctx.strocke();
}
  return {

        init: function () {
            var can = document.getElementById("canvas");
            
            //websocket connection
            connectarJuego();
        }
    };
}();
    



    