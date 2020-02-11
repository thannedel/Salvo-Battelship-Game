package com.codeoftheweb.salvo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;
import java.util.stream.Collectors;
//@CrossOrigin("http://localhost:8081")
@RestController
@RequestMapping("/api")
public class SalvoController {
    @Autowired
    private PlayerRepository playerRepository;
    @Autowired
    private GameRepository gameRepository;
    @Autowired
    private GamePlayerRepository gamePlayerRepository;
    @Autowired
    private ShipRepository shipRepository;
    @Autowired
    private SalvoRepository salvoRepository;

    /* @RequestMapping("/games")
     public List<Long> getGames() {
         List<Long> gamesId = new ArrayList<>();
         gameRepository.findAll().forEach(game ->  gamesId.add(game.getId()));
         return gamesId;
         }
     }*/
    @RequestMapping("/games")

    private List<Object> getGames() {
        return gameRepository
                .findAll()
                .stream()
                .map(game -> gamePlayersList(game))
                .collect(Collectors.toList());
    }

    private Map<String, Object> gamePlayersList(Game game) {
        Map<String, Object> dto = new LinkedHashMap<String, Object>();
        dto.put("id", game.getId());
        dto.put("created", game.created());
        dto.put("finished", getScoreDate(game.getScores()));
        // CREATE A LIST of maps WITH GAME PLAYERS
        List<Object> gamePlayersDTO = game.getGamePlayers()
                .stream()
                .sorted(Comparator.comparing(GamePlayer::getId))
                .map(gamePlayer -> GamePlayerDTO(gamePlayer))
                .collect(Collectors.toList());
        dto.put("gamePlayers", gamePlayersDTO);
        dto.put("scores", GamePlayerScores(game.getScores()));
        return dto;
    }
    private List<Map> GamePlayerScores(Set<Score> scores) {
        Map<String, Object> dto = new LinkedHashMap<String, Object>();
        return scores.stream()
                .map(score -> ScoreToDTO(score))
                .collect(Collectors.toList());
    }

    private Map<String, Object> ScoreToDTO(Score score) {
        Map<String, Object> dto = new LinkedHashMap<String, Object>();
        dto.put("playerID", score.getPlayer().getId());
        dto.put("score", score.getScore());
        //dto.put("finishDate", score.getFinishDate());
        return dto;
    }
    private Date getScoreDate(Set<Score> scores) {
        return scores.stream()
                .findFirst()
                .map(score -> score.getFinishDate())
                .orElse(null);
    }

    private Map<String, Object> GamePlayerDTO(GamePlayer gamePlayer) {
        Map<String, Object> dto = new LinkedHashMap<String, Object>();
        dto.put("id", gamePlayer.getId());
        dto.put("player", PlayersDTO(gamePlayer.getPlayer()));

        return dto;
    }

    private Map<String, Object> PlayersDTO(Player player) {
        Map<String, Object> dto = new LinkedHashMap<String, Object>();
        dto.put("id", player.getId());
        dto.put("email", player.getEmail());
        return dto;


    }


   public Map<String, Object> getShipInfo(Ship ship) {
       Map<String, Object> shipTypeAndLocations = new LinkedHashMap<>();
       shipTypeAndLocations.put("type", ship.getType());
       shipTypeAndLocations.put("locations", ship.getShipLocation());
       return shipTypeAndLocations;
   }

    private Map<String, Object> getSalvoInfo(Salvo salvo) {
        Map<String, Object> dto = new LinkedHashMap<>();
        dto.put("player_id", salvo.getGamePlayer().getId());
        dto.put("turn", salvo.getTurnNumber());
        dto.put("locations", salvo.getSalvoLocation());
        return dto;
    }

   public List<Object> opponentSalvoInfo(GamePlayer gamePlayer) {
       List<Object> salvos = new ArrayList<>();

       gamePlayer.getSalvos().forEach(salvo -> {
           Map<String , Object> salvoes = new HashMap<>();



           salvoes.put("turn",salvo.getTurnNumber());

           salvoes.put("playerId", salvo.getGamePlayer().getId());
           salvoes.put("locations", salvo.getSalvoLocation());

           salvos.add(salvoes);
       });
       return salvos;
   }


   @RequestMapping("/game_view/{gamePlayerId}")
   public Map<String, Object> getGame(@PathVariable Long gamePlayerId) {
       Map<String, Object> gameViewInfo = new LinkedHashMap<>();
       GamePlayer currentGamePlayer = gamePlayerRepository.getOne(gamePlayerId);
       //Player player = (Player) playerRepository.findById(currentGamePlayer.getPlayer().getId());
       gameViewInfo.put("created", currentGamePlayer.getGame().getDate());
       gameViewInfo.put("id", currentGamePlayer.getGame().getId());
       gameViewInfo.put("gamePlayers", currentGamePlayer.getGame().getGamePlayers().stream()
               .map(gamePlayer -> GamePlayerDTO(gamePlayer))
               .collect(Collectors.toList())
       );

       gameViewInfo.put("ships", currentGamePlayer.getShips().stream()
               .map(ship -> getShipInfo(ship))
               .collect(Collectors.toList()));
      gameViewInfo.put("salvos", currentGamePlayer.getSalvos().stream()
               .map(salvo -> getSalvoInfo(salvo))
               .collect(Collectors.toList()));
      // gameViewInfo.put("salvos", salvoInfo(currentGamePlayer));
       gameViewInfo.put("opponents", getOpponentInfo(currentGamePlayer));


       //auto dinei kai ta salvos tou opponent
       /*gameViewInfo.put("salvos", currentGamePlayer.getGame().getGamePlayers().stream()
               .map(gamePlayer -> gamePlayer.getSalvos().stream()
                       .map(salvo -> getSalvoInfo(salvo))
                       .collect(Collectors.toSet())).collect(Collectors.toList()));*/
       return gameViewInfo;
   }
   public Map<String,Object> getOpponentInfo (GamePlayer you){

        Map<String,Object> opponent = new LinkedHashMap<>();

        you.getGame().getGamePlayers().forEach(player -> {
            if (player.getId() != you.getId()){
                opponent.put("opponentSalvos",opponentSalvoInfo(player));

            }
        });
        return opponent;
    }
}

//-----------------------------------------------------------------------------------------------------------
   /* public Map<String, Object> getSalvo(Salvo salvo) {
        Map<String, Object> salvoTurnAndLocations = new LinkedHashMap<>();
        salvoTurnAndLocations.put("player_id", salvo.getGamePlayer().getPlayer().getId());
        salvoTurnAndLocations.put("turn", salvo.getTurn());
        salvoTurnAndLocations.put("locations", salvo.getLocations());
        return salvoTurnAndLocations;
    }
    @CrossOrigin(origins = "http://127.0.0.1:5500")
    @RequestMapping("/game_view/{gameId}")
    public Map<String, Object> getGame(@PathVariable Long gameId) {
        Map<String, Object> gameViewInfo = new LinkedHashMap<>();
        GamePlayer currentGamePlayer = gamePlayerRepository.getOne(gameId);
        //Player player = (Player) playerRepository.findById(currentGamePlayer.getPlayer().getId());
        gameViewInfo.put("created", currentGamePlayer.getGame().getDate());
        gameViewInfo.put("id", currentGamePlayer.getId());
        gameViewInfo.put("gamePlayers", currentGamePlayer.getGame().getGamePlayers().stream()
                .map(gamePlayer -> getGamePlayers(gamePlayer))
                .collect(Collectors.toList())
        );
        gameViewInfo.put("ships", currentGamePlayer.getShips().stream()
                .map(ship -> getShipInfo(ship))
                .collect(Collectors.toList()));
        gameViewInfo.put("salvos", currentGamePlayer.getGame().getGamePlayers().stream()
                .map(gamePlayer -> gamePlayer.getSalvoes().stream()
                        .map(salvo -> getSalvo(salvo))
                        .collect(Collectors.toSet())).collect(Collectors.toList()));
        return gameViewInfo;
    }*/
















   /* @RequestMapping("/game_view/{gamePlayerId}")
   This block creates the JSON from the getters of the GamePlayer
   //--------------------------------------
    Optional<GamePlayer> gameView(@PathVariable long gamePlayerId) {

       Optional<GamePlayer> gamePlayer = gamePlayerRepository.findById(gamePlayerId);

       return gamePlayer.isPresent() ? gamePlayer : null;

   }
//----------------------------------------
    GamePlayer getOpponent(GamePlayer gamePlayer){
       GamePlayer opponent = (GamePlayer) gamePlayer.getGame().getGamePlayers().stream().filter(gp -> {
           return gamePlayer.getId() != gp.getId();
       });
       return opponent;
    }*/







   


























   //Alternative Method for games
/* @RequestMapping("/games")
public List<Object> getGames() {
        List<Object> gamesObject = new ArrayList<>();
        gameRepository.findAll().stream().forEach(game -> {
            Map<String, Object> idCreated = new LinkedHashMap<>();
            idCreated.put("id", game.getId());
            idCreated.put("created", game.created());
            idCreated.put("gamePlayers", gamePlayersList(game));
            gamesObject.add(idCreated);

        });
        return gamesObject;

    }


    public List<Object> gamePlayersList(Game game) {
        List<Object> addThePlayers = new ArrayList<>();
        game.getGamePlayers().forEach(gamePlayer -> {
            Map<String, Object> gamePlayerMap = new HashMap<>();
            gamePlayerMap.put("id", gamePlayer.getId());
            gamePlayerMap.put("player", playersList(gamePlayer));
            addThePlayers.add(gamePlayerMap);
        });
        return addThePlayers;
    }


    public List<Object> playersList(GamePlayer gamePlayer) {
        Player player = gamePlayer.getPlayer();
        List<Object> finPl = new ArrayList<>();
        Map<String,Object> finalPlayer = new HashMap<>();
        finalPlayer.put("id", player.getId());
        finalPlayer.put("email", player.getEmail());
        finPl.add(finalPlayer);

        return finPl;

    }*/