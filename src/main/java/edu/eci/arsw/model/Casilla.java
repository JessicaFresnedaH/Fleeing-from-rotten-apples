/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package edu.eci.arsw.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 *
 * @author Carol Meneses
 * @author Jessica Fresneda
 */
public class Casilla {
    @JsonIgnore
    private boolean manzanaPodrida;
    @JsonIgnore
    private int suma;
    @JsonIgnore
    private boolean estado; // T pisa'o y F no pisa'o
    @JsonIgnore
    private Jugador jugador ;
    private String username;
    private String Color;
    private int x,y;
    private int indicador = 0; // Si no es una manzana podrida, muestra la cantidad adyacente de estas
    
    public Casilla(){
    }
    
    public Casilla(int x, int y){
//        this.Color = "black";
        this.x = x;
        this.y = y;
    }
    
    public Casilla(boolean manzanaPodrida) {
        this.manzanaPodrida = manzanaPodrida;
        estado = false;
    }
    public void  setPosicion(int x, int y){
        setX(x);
        setY(y);
    }      
    public boolean isManzanaPodrida() {
        return manzanaPodrida;
    }

    public void setManzanaPodrida(boolean manzanaPodrida) {
        this.manzanaPodrida = manzanaPodrida;
    }

    public String getColor() {
        return Color;
    }

    public void setColor(String Color) {
        this.Color = Color;
    }

    public int getSuma() {
        return suma;
    }

    public void setSuma(int suma) {
        this.suma = suma;
    }

    public int getX() {
        return x;
    }

    public void setX(int x) {
        this.x = x;
    }

    public int getY() {
        return y;
    }

    public void setY(int y) {
        this.y = y;
    }

    public boolean isEstado() {
        return estado;
    }

    public void setEstado(boolean estado) {
        this.estado = estado;
    }

    public Jugador getJugador() {
        return jugador;
    }

    public void setJugador(Jugador jugador) {
        this.jugador = jugador;
    }

    public int getIndicador() {
        return indicador;
    }

    public void setIndicador(int indicador) {
        this.indicador = indicador;
    }

    /**
     * @return the username
     */
    public String getUsername() {
        return username;
    }

    /**
     * @param username the username to set
     */
    public void setUsername(String username) {
        this.username = username;
    }
}
