/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package edu.eci.arsw.persistence.impl;

import edu.eci.arsw.model.Jugador;
import edu.eci.arsw.model.Partida;
import edu.eci.arsw.persistencia.applePersistence;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Service;

/**
 *
 * @author
 */
@Service
public class InMemoryApple implements applePersistence {
 private final Map<String,Partida> partidas= new ConcurrentHashMap();

    public InMemoryApple() {
        Partida p=new Partida("Dificil","Juego1","Publica","Johana");
        partidas.put("juego1", p);
        Partida pn=new Partida("Facil","Juego2","Privada","Jessica");
        partidas.put("juego2", pn);
    }
    
    @Override
    public Set<Partida> getTodaslasPartidas() {
        Collection<Partida> part = partidas.values();
        Set<Partida> p = new HashSet<>();
        for (Partida pn : part) {

            p.add(pn);
        }
        return p;
    }
    
    
    @Override
    public Set<Partida> getPartidasByTipo(String tipoPartida) {
        Collection<Partida> part = partidas.values();
        Set<Partida> p=new HashSet<>();
        for(Partida pn:part){
            if(pn.getTipoPartda().equals(tipoPartida)){
                p.add(pn);
            }
        }
        return p;
    }
    
    @Override
    public List<Jugador> getJugadores(Partida pn) {
        //Estamos convirtiendo array list en lista
     List<Jugador> j= pn.getJugadores();
     return j;
    }
    
    @Override
    public Partida getPartidaJugador(String j) {
     
        Partida retornar=null;
        Collection<Partida> part = partidas.values();
        for (Partida pn : part) {
            ArrayList<Jugador>  jugadores= pn.getJugadores();
            for (int i=0;i<jugadores.size();i++){
               if( jugadores.get(i).getNombre().equals(j)){
                 retornar=pn;
               }
            }
      
            
        }
        return retornar;
    }
    
 @Override
    public boolean agregarJugador(Partida pn,String nombre) {
      boolean agrego=false;
      agrego=pn.agregarJugador(nombre, pn.getNombrePartida());
      
       return agrego;
    }


        



    @Override
    public void eliminar(Partida p) {
         if (partidas.containsKey(p.getNombrePartida())) {
          partidas.remove(p.getNombrePartida());
        }
    }

    @Override
    public void crearNuevoPartida(Partida p) {
      partidas.put(p.getNombrePartida(),p);
    }

    @Override
    public int getFilas_columnas(String nombreP) {
        int filas_columnas = 0;
        Collection<Partida> part = partidas.values();
        for (Partida pn : part) {
            if (pn.getNombrePartida().equals(nombreP)) {
                filas_columnas = pn.getColumnas();
            }

        }

        return filas_columnas;
    }

    @Override
    public Partida getPartida(String nombreP) {
        Partida retorno=null;
        Collection<Partida> part = partidas.values();
       for(Partida p:part){
           if(p.getNombrePartida().equals(nombreP))
               retorno=p;
       }
       return retorno;
    }

    @Override
    public void actualizar(Partida b) {
      String nombre=b.getNombrePartida();
        if (partidas.containsKey(nombre)) {
            partidas.replace(nombre,b);
        }
      
    }

    @Override
    public List<String> getUsuarios() {
        
       List<String> users = null;
        Collection<Partida> part = partidas.values();
        Set<Partida> p = new HashSet<>();
        for (Partida pn : part) {
            
            List<Jugador> jugadores = pn.getJugadores();
            for (int j = 0; j < jugadores.size(); j++) {
                users.add(jugadores.get(j).getNombre());
                System.out.println("entro");
                //    System.out.println("jugadores.get(j).getNombre()");

            }
           
        }
         return users;
    }
        
    

    @Override
    public List<Jugador> getJugador(String nombreP) {
        Partida p=getPartida(nombreP);
        return p.getJugadores();
    }
}
