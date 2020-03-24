package com.codeoftheweb.salvo;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Ship {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "native")
    @GenericGenerator(name = "native", strategy = "native")
    private long id;
    private String type;

    public String getPosition() {
        return position;
    }

    @Override
    public String toString() {
        return "Ship{" +
                "id=" + id +
                ", type='" + type + '\'' +
                ", position='" + position + '\'' +
                ", gamePlayer=" + gamePlayer +
                ", shipLocation=" + shipLocation +
                '}';
    }

    public void setPosition(String position) {
        this.position = position;
    }

    private String position;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="gamePlayer_id")
    GamePlayer gamePlayer;

    @ElementCollection
    @Column(name="shipLocation")
    private List<String> shipLocation = new ArrayList<>();



    public Ship(){}

    public Ship(String type, List<String> shipLocation,String position) {
        this.type = type;
        this.shipLocation = shipLocation;
        this.position = position;
    }

    public long getId() {
        return id;
    }

    public String getType() {
        return type;
    }

    public GamePlayer getGamePlayer() {
        return gamePlayer;
    }


    public void setType(String type) {
        this.type = type;
    }

    public void setGamePlayer(GamePlayer gamePlayer) {
        this.gamePlayer = gamePlayer;
    }
    public List<String> getShipLocation() {
        return shipLocation;
    }
    public void setShipLocation(List<String> shipLocation) {
        this.shipLocation = shipLocation;
    }

}