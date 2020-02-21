package com.codeoftheweb.salvo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;
import java.util.stream.Collectors;

//import org.apache.tomcat.util.net.openssl.ciphers.Authentication;

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
    public Map<String, Object> returnGames(Authentication authentication) {
        Map<String, Object> gamesMap = new LinkedHashMap<>();
        if (!(isGuest(authentication))) {
            gamesMap.put("player", PlayersDTO(getLoggedInPlayer(authentication)));
        } else {
            gamesMap.put("player", null);
        }
        gamesMap.put("games", getGames(authentication));
        return gamesMap;
    }


    private List<Object> getGames(Authentication authentication) {
        System.out.println(gameRepository);
        return gameRepository
                .findAll()
                .stream()
                .map(game -> gamePlayersList(game))
                .collect(Collectors.toList());
    }


    private Player getLoggedInPlayer(Authentication authentication) {
        return playerRepository.findByUsername(authentication.getName());
    }


    private boolean isGuest(Authentication authentication) {
        return authentication == null || authentication instanceof AnonymousAuthenticationToken;
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
        dto.put("name", player.getUsername());
        dto.put("email", player.getEmail());
        return dto;
    }

    @RequestMapping(path = "/games", method = RequestMethod.POST)
    public ResponseEntity<Map<String, Object>> createGame(Authentication authentication) {
        if (!isGuest(authentication)) {
            Player player = playerRepository.findByUsername(authentication.getName());
            Game newGame = new Game(new Date());

            gameRepository.save(newGame);
            GamePlayer newGamePlayer = new GamePlayer(player, newGame);
            gamePlayerRepository.save(newGamePlayer);
            return new ResponseEntity<>(makeMap("gpid", newGamePlayer.getId()), HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>(makeMap("error", "you are not logged in"), HttpStatus.UNAUTHORIZED);
        }
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
            Map<String, Object> salvoes = new HashMap<>();


            salvoes.put("turn", salvo.getTurnNumber());

            salvoes.put("playerId", salvo.getGamePlayer().getId());
            salvoes.put("locations", salvo.getSalvoLocation());

            salvos.add(salvoes);
        });
        return salvos;
    }


    @RequestMapping("/game_view/{gamePlayerId}")
    public ResponseEntity<Map<String, Object>> getGame(@PathVariable Long gamePlayerId, Authentication authentication)
     {
        Map<String, Object> gameViewInfo = new LinkedHashMap<>();
         if (!isGuest(authentication)) {
             Player player = playerRepository.findByUsername(authentication.getName());
             GamePlayer currentGamePlayer = gamePlayerRepository.getOne(gamePlayerId);
             if (player.getId() == currentGamePlayer.getPlayer().getId()) {
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
            return new ResponseEntity<>(gameViewInfo, HttpStatus.CREATED);
        }else {
            return new ResponseEntity<>(makeMap("error", "Not allowed to view opponents game"), HttpStatus.FORBIDDEN);
        }
         } else {
             return new ResponseEntity<>(makeMap("error", "You are not logged in"), HttpStatus.UNAUTHORIZED);
         }
     }

    public Map<String, Object> getOpponentInfo(GamePlayer you) {

        Map<String, Object> opponent = new LinkedHashMap<>();

        you.getGame().getGamePlayers().forEach(player -> {
            if (player.getId() != you.getId()) {
                opponent.put("opponentSalvos", opponentSalvoInfo(player));

            }
        });
        return opponent;
    }


    @Autowired
    private PasswordEncoder passwordEncoder;
    @RequestMapping(path = "/players", method = RequestMethod.POST)
    public ResponseEntity<Map<String, Object>> createNewPlayer(String username,String email, String password) {
        //add the code for empty strings
        if (username.trim().isEmpty() || email.trim().isEmpty() || password.trim().isEmpty()) {
            return new ResponseEntity<>(makeMap("error", "Wrong Data"), HttpStatus.FORBIDDEN);

        }
        if(!email.contains("@") || !email.contains(".") ){
            return new ResponseEntity<>(makeMap("error", "wrong email address"), HttpStatus.FORBIDDEN);
        }

            if (playerRepository.findByUsername(username) == null) {

                Player newPlayer = new Player(username, email, passwordEncoder.encode(password));
                playerRepository.save(newPlayer);
                return new ResponseEntity<>(makeMap("username", newPlayer.getUsername()), HttpStatus.CREATED);
            } else {
                return new ResponseEntity<>(makeMap("error", "This username already exists, please try with a different one"), HttpStatus.FORBIDDEN);
            }
        }


    private Map<String, Object> makeMap(String key, Object value) {
        Map<String, Object> map = new HashMap<>();
        map.put(key, value);
        return map;
    }
    @RequestMapping(path = "/game/{gameID}/players", method = RequestMethod.POST)
    public ResponseEntity<Map<String, Object>> joinGame(@PathVariable long gameID, Authentication authentication) {
        if (!isGuest(authentication)) {
            Player player = playerRepository.findByUsername(authentication.getName());
            if (gameRepository.getOne(gameID) == null) {

                return new ResponseEntity<>(makeMap("error", "No game"), HttpStatus.FORBIDDEN);
            } else {
                //if the game has 2 players send FORBIDDEN and text: game is full
                if (gameRepository.getOne(gameID).getGamePlayers().size() == 2) {
                    return new ResponseEntity<>(makeMap("error", "game is full"), HttpStatus.FORBIDDEN);
                } else {
                    //create and save a new game player, with this game and the current user
                    GamePlayer newGamePlayer = new GamePlayer(player, gameRepository.getOne(gameID));
                    gamePlayerRepository.save(newGamePlayer);
                    return new ResponseEntity<>(makeMap("gpid", newGamePlayer.getId()), HttpStatus.CREATED);
                }
            }
        } else {
            //if no current user - Unauthorized response
            return new ResponseEntity<>(makeMap("error", "not logged in"), HttpStatus.UNAUTHORIZED);
        }
    }
}

/*
@Autowired
private PasswordEncoder passwordEncoder;
@RequestMapping(path = "/players", method = RequestMethod.POST)
public ResponseEntity<Object> register (
        @RequestParam String username,
        @RequestParam String email, @RequestParam String password) {

    if (username.isEmpty() || email.isEmpty() || password.isEmpty()) {
        return new ResponseEntity<>("Missing data", HttpStatus.FORBIDDEN);
    }

    if (playerRepository.findByUsername(username) !=  null) {
        return new ResponseEntity<>("Name already in use", HttpStatus.FORBIDDEN);
    }

    playerRepository.save(new Player(username, email, passwordEncoder.encode(password)));
    return new ResponseEntity<>(HttpStatus.CREATED);
}
}
*/



//-----------------------------------------------------------------------------------------------------------
   /* public Map<String, Object> getSalvo(Salvo salvo) {
        Map<String, Object> salvoTurnAndLocations = new LinkedHashMap<>();
        salvoTurnAndLocations.put("player_id", salvo.getGamePlayer().getPlayer().getId());
        salvoTurnAndLocations.put("turn", salvo.getTurn());
        salvoTurnAndLocations.put("locations", salvo.getLocations());
        return salvoTurnAndLocations;
    }

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