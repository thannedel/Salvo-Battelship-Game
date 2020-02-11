package com.codeoftheweb.salvo;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@SpringBootApplication

public class SalvoApplication {

	public static void main(String[] args) {
		SpringApplication.run(SalvoApplication.class, args);
	}
	@Bean
	public CommandLineRunner initData(PlayerRepository playerRepository, GameRepository gameRepository, GamePlayerRepository gamePlayerRepository, ShipRepository shipRepository, SalvoRepository salvoRepository, ScoreRepository scoreRepository) {
		return (args) -> {
			//  players
			Player p1 = new Player("Jack", "Bauer@gmail");
			playerRepository.save(p1);
			Player p2 = new Player("Chloe", "O'Brian@hotmail");
			playerRepository.save(p2);
			Player p3 = new Player("Kim", "Bauer@gmail");
			playerRepository.save(p3);
			Player p4 = new Player("David", "Palmer@yahoo");
			playerRepository.save(p4);
			Player p5 = new Player("Michelle", "Dessler@hotmail");
			playerRepository.save(p5);

			//Creating games
			Date date = new Date();
			Date date1hLater = Date.from(date.toInstant().plusSeconds(3600));
			Date date2hLater = Date.from(date.toInstant().plusSeconds(7200));
			Game game1 = new Game(new Date());
			gameRepository.save(game1);
			Game game2 = new Game(date1hLater);
			gameRepository.save(game2);
			Game game3 = new Game(date2hLater);
			gameRepository.save(game3);

			//a game must have max two players
			GamePlayer gamePlayer1 = new GamePlayer(p1, game1);
			gamePlayerRepository.save(gamePlayer1);
			GamePlayer gamePlayer2 = new GamePlayer(p2, game2);
			gamePlayerRepository.save(gamePlayer2);
			GamePlayer gamePlayer3 = new GamePlayer(p3, game3);
			gamePlayerRepository.save(gamePlayer3);
			GamePlayer gamePlayer4 = new GamePlayer(p2, game1);
			gamePlayerRepository.save(gamePlayer4);
			GamePlayer gamePlayer5 = new GamePlayer(p5, game2);
			gamePlayerRepository.save(gamePlayer5);
			GamePlayer gamePlayer6 = new GamePlayer(p2, game3);
			gamePlayerRepository.save(gamePlayer6);

			//Ship (type, gamePlayer and location)
			List<String> firstShipLocation = new ArrayList<>();
			firstShipLocation.add("A9");
			firstShipLocation.add("B9");
			firstShipLocation.add("C9");
			Ship ship1 = new Ship("Cruiser", gamePlayer1,firstShipLocation);
			shipRepository.save(ship1);

			List<String> fifthShipLocation = new ArrayList<>();
			fifthShipLocation.add("F4");
			fifthShipLocation.add("F5");
			fifthShipLocation.add("F6");
			Ship ship5 = new Ship("Destroyer", gamePlayer1,fifthShipLocation);
			shipRepository.save(ship5);

			List<String> secondShipLocation = new ArrayList<>();
			secondShipLocation.add("H2");
			secondShipLocation.add("H3");
			secondShipLocation.add("H4");
			Ship ship2 = new Ship("Destroyer", gamePlayer2,secondShipLocation);
			shipRepository.save(ship2);

			List<String> thirdShipLocation = new ArrayList<>();
			thirdShipLocation.add("E1");
			thirdShipLocation.add("F1");
			thirdShipLocation.add("G1");
			Ship ship3 = new Ship("Submarine", gamePlayer2,thirdShipLocation);
			shipRepository.save(ship3);

			List<String> fourthShipLocation = new ArrayList<>();
			fourthShipLocation.add("A7");
			fourthShipLocation.add("A8");
			fourthShipLocation.add("A9");
			Ship ship4 = new Ship("Patrol Boat", gamePlayer4,fourthShipLocation);
			shipRepository.save(ship4);

			//Salvos(turnNumber, gamePlayer, salvoLocations(List))
		List<String> salvoLocation1 = new ArrayList<>();
		salvoLocation1.add("H1");
		salvoLocation1.add("A9");
		Salvo salvo1= new Salvo(1,gamePlayer1,salvoLocation1);
		salvoRepository.save(salvo1);

			List<String> salvoLocation2 = new ArrayList<>();
			salvoLocation2.add("J5");
			salvoLocation2.add("A8");
		    Salvo salvo2 = new Salvo(2,gamePlayer1,salvoLocation2);
		    salvoRepository.save(salvo2);

			List<String> salvoLocation3 = new ArrayList<>();
			salvoLocation3.add("J5");
			salvoLocation3.add("H4");
			Salvo salvo3 = new Salvo(3,gamePlayer2,salvoLocation3);
            salvoRepository.save(salvo3);

			List<String> salvoLocation4 = new ArrayList<>();
			salvoLocation4.add("C5");
			salvoLocation4.add("E6");
			Salvo salvo4 = new Salvo(2,gamePlayer2,salvoLocation4);
            salvoRepository.save(salvo4);

			List<String> salvoLocation5 = new ArrayList<>();
			salvoLocation5.add("D3");
			salvoLocation5.add("F6");
			Salvo salvo5 = new Salvo(3,gamePlayer4,salvoLocation5);
			salvoRepository.save(salvo5);

//-------------------------------------scores-------------------------------------------------------
			Date firstFinish = Date.from(date.toInstant().plusSeconds(1800));
			Score score1 = new Score(game1,p1,1.0,firstFinish);
			Score score3 = new Score(game1, p4, 0.0, firstFinish);
			scoreRepository.save(score3);
			scoreRepository.save(score1);
			Date secondFinish = Date.from(date1hLater.toInstant().plusSeconds(1800));
			Score score2 = new Score(game2,p2,0.5,secondFinish);
			scoreRepository.save(score2);
			Score score4 = new Score(game2, p5, 0.5, secondFinish);
			scoreRepository.save(score4);
		};
	}

}
