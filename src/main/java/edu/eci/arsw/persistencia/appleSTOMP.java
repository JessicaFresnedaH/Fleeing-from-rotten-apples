/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package edu.eci.arsw.persistencia;

import edu.eci.arsw.model.Casilla;
import edu.eci.arsw.model.Jugador;
import edu.eci.arsw.model.Partida;
import edu.eci.arsw.model.CampoJuego;
import edu.eci.arsw.services.appleServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

/**
 *
 * @author
 */
@Controller
public class appleSTOMP {

@Autowired
appleServices juego;
@Autowired
SimpMessagingTemplate msgt;


    @MessageMapping("/crearJuego")
    public void NuevoJuego(String nombreP, String tipoPartida,Jugador jugador, String nivel)throws Exception {
        Partida p= juego.getPartida(nombreP, tipoPartida);
        p.agregarJugador(jugador);
        juego.crearNuevoPartida(nombreP, p);
        //Subscribirse.
        
////       msgt.convertAndSend("/topic/partidaNueva"+datos.getNombreP()+datos.getJugador(),datos);
//        msgt.convertAndSend("/topic/partidaNueva",datos);
    }
     @MessageMapping("/establecePartida")
    public void entrarPartida(String nombreP)throws Exception {
//        DatosJuegoNuevo djn=juego.entrarPartida(datos);
//        djn.setJugador(datos.getJugador());
//        msgt.convertAndSend("/topic/partidaNueva"+datos.getNombreP()+datos.getJugador(),djn);
//        Partida p= juego.getPartida(datos.getNombreP());
//        DatosPartida dp=new DatosPartida(p.getManzanasPodridas(),p.getJugador(datos.getJugador()).getNumVidas(), true);
//         msgt.convertAndSend("/topic/estadoPartida"+datos.getNombreP()+datos.getJugador(),djn);
    }
    @MessageMapping("/destaparCasilla")
    public void poblarCasillas(String nombreP,String jugador , int X,int Y){
        Partida p= juego.getPartidaByJugador(jugador);
        Jugador jugador1 = p.getJugador(jugador);
        Casilla c= p.getTablero().consultarCasilla(X, Y);
        if(c.isManzanaPodrida()){
        jugador1.setNumVidas(jugador1.getNumVidas()-1);
        if(jugador1.getNumVidas()==0)jugador1.setEstadoVivo(false);
        //Falta eliminar jugador y paartida en caso de que sea el unico jugdor
        }
      //  p.getTablero().
     
       // Casilla c= new Casilla(j.getColor(),datos.getpX(),datos.getpY());
        msgt.convertAndSend("topic/casillaVisitada",c);
    }
//    Casilla[][] casillasJuego =juego.consultarCasilla(datos);
//    Casilla c=null;
//    int filas=juego.getPartida(datos.getPartida()).getFilas();
//    int columnas=juego.getPartida(datos.getPartida()).getColumnas();
//        for(int i=0;i<filas;i++){
//            for(int j=0;j<columnas;j++){
//            c=casillasJuego[i][j];
//            if(c.isEstado()) 
//                msgt.convertAndSend("topic/casillaVisitada"+datos.getPartida()+datos.getJugador(),c);
//                    
//            }
//        }
//    }

            
}

