/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package edu.eci.arsw.controllers.topic;

import edu.eci.arsw.model.*;
import edu.eci.arsw.services.appleServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

    /**
     * Crea nueva partida a partir de la información enviada en
     * crearPartida.js
     * @return
     */
    @MessageMapping("/crearPartida")
    public ResponseEntity<?> nuevaPartida(PartidaBase partidaBase){
        Partida partida = new Partida(partidaBase.getNombreP(), partidaBase.getNivel());
        Jugador jugador = new Jugador(0, partidaBase.getUsuario(), null);
        jugador.setNuevaPartida(partidaBase.getNombreP());
        juego.crearNuevoPartida(partidaBase.getTipoPartida(), partida);
        juego.agregarJugador(partida, jugador, partidaBase.getTipoPartida());
        return new ResponseEntity<>(HttpStatus.ACCEPTED);
    }

    @MessageMapping("/crearJuego")
    public ResponseEntity<?> NuevoJuego(String nombreP, String tipoPartida, Jugador jugador, String nivel, ClientMessage p)throws Exception {
        System.out.println("LLegó a crear juego");
//        Partida partida= juego.getPartida(nombreP, tipoPartida);
//        partida.agregarJugador(jugador);
//        juego.crearNuevoPartida(nombreP, partida);
        
        //Subscribirse.
        //msgt.convertAndSend("/topic/messages",new ServerMessage(p.);
        return new ResponseEntity<>(HttpStatus.ACCEPTED);
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

    /**
     * A partir de una interacción en el canvas, se evalúa el estado de la casilla
     * y se actúa como corresponda, ya sea alterando la casilla y al jugador o ignorando
     * dicho suceso.
     * @param evtC
     */
    @MessageMapping("/destaparCasilla")
    public void destaparCasillas(EventoCasilla evtC){

        Partida p = juego.getPartidaByJugador(evtC.getJugador());

        if(p != null){
            Jugador jugador = p.getJugador(evtC.getJugador());
            Casilla c = p.getTablero().consultarCasilla(evtC.getPosicionX(), evtC.getPosicionY());

            if(!c.isEstado() && jugador.isEstadoVivo()){
                c.setEstado(true);
                c.setJugador(jugador);
                c.setColor(jugador.getColor());
                if(c.isManzanaPodrida()){
                    c.setColor("red");
                    jugador.setNumVidas(jugador.getNumVidas() - 1);
                    if(jugador.getNumVidas() == 0){
                        jugador.setEstadoVivo(false);
                        msgt.convertAndSend("/topic/retirarJugador." + evtC.getNombreP() + "." + evtC.getJugador(), 0);
                        gameOver(p);
                    }
                //Falta eliminar jugador y partida en caso de que sea el único jugador
                }
                msgt.convertAndSend("/topic/casillaVisitada." + evtC.getNombreP(), c);
            }
        }
    }
    @MessageMapping("/abandona")
    public void abandonaPartida(PartidaBase partidaBase){
        Partida p = juego.getPartidaByJugador(partidaBase.getUsuario());
        p.getJugador(partidaBase.getUsuario()).setEstadoVivo(false);
        // Se cambia el nombre para que se pueda usar el mismo en otra partida.
        p.getJugador(partidaBase.getUsuario()).setNombre("");
        gameOver(p);
    }

//    @MessageMapping("/destaparCasilla")
//    public void destaparCasillas(String nombreP, String jugador , int X, int Y){
//        Partida p= juego.getPartidaByJugador(jugador);
//        Jugador jugador1 = p.getJugador(jugador);
//        Casilla c= p.getTablero().consultarCasilla(X, Y);
//        if(c.isManzanaPodrida()){
//            jugador1.setNumVidas(jugador1.getNumVidas()-1);
//        if(jugador1.getNumVidas()==0){
//            jugador1.setEstadoVivo(false);
//            msgt.convertAndSend("/topic/retirarJugador"+nombreP+jugador);
//        }
//        //Falta eliminar jugador y paartida en caso de que sea el unico jugdor
//        }
//      //  p.getTablero().
//
//       // Casilla c= new Casilla(j.getColor(),datos.getpX(),datos.getpY());
//        msgt.convertAndSend("topic/casillaVisitada"+nombreP+jugador+c);
//    }

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

    private void gameOver(Partida partida){
        if(partida.gameOver()){
            msgt.convertAndSend("/topic/finJuego." + partida.getNombrePartida() , 0);
            // ¿Se elimina la partida? Por el momento sólo se cambia el nombre.
            partida.setNombrePartida("");
        }
    }
}
