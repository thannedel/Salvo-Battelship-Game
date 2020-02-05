package com.codeoftheweb.salvo;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Salvo {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "native")
    @GenericGenerator(name = "native", strategy = "native")

    private long id;
    private Integer turnNumber;


    @JsonIgnore
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="gamePlayer_id")
    GamePlayer gamePlayer;

    @ElementCollection
    @Column(name="salvoLocation")
    private List<String> salvoLocation = new ArrayList<>();

    public Salvo() {}

    public Salvo(Integer turnNumber, GamePlayer gamePlayer, List<String> salvoLocation) {
        this.turnNumber = turnNumber;
        this.gamePlayer = gamePlayer;
        this.salvoLocation = salvoLocation;
    }

    public long getId() {
        return id;
    }

    public Integer getTurnNumber() {
        return turnNumber;
    }

    public void setTurnNumber(Integer turnNumber) {
        this.turnNumber = turnNumber;
    }

    public GamePlayer getGamePlayer() {
        return gamePlayer;
    }

    public void setGamePlayer(GamePlayer gamePlayer) {
        this.gamePlayer = gamePlayer;
    }

    public List<String> getSalvoLocation() {
        return salvoLocation;
    }

    public void setSalvoLocation(List<String> salvoLocation) {
        this.salvoLocation = salvoLocation;
    }

    @Override
    public String toString() {
        return "Salvo{" +
                "id=" + id +
                ", turnNumber=" + turnNumber +
                ", gamePlayer=" + gamePlayer +
                ", salvoLocation=" + salvoLocation +
                '}';
    }
}
