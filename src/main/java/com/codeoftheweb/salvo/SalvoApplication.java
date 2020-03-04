package com.codeoftheweb.salvo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.authentication.configuration.GlobalAuthenticationConfigurerAdapter;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.WebAttributes;
import org.springframework.security.web.authentication.logout.HttpStatusReturningLogoutSuccessHandler;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.Arrays;
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
			Player p1 = new Player("Jack", "Zadauer@gmail", passwordEncoder().encode("13"));
			playerRepository.save(p1);
			Player p2 = new Player("Chloe", "O'Brian@hotmail", passwordEncoder().encode("12"));
			playerRepository.save(p2);
			Player p3 = new Player("Kim", "Bauer@gmail", passwordEncoder().encode("ki"));
			playerRepository.save(p3);
			Player p4 = new Player("David", "Palmer@yahoo", passwordEncoder().encode("dav"));
			playerRepository.save(p4);
			Player p5 = new Player("Michelle", "Dessler@hotmail", passwordEncoder().encode("123"));
			playerRepository.save(p5);

			//Creating games
			Date date = new Date();
			Date date1hLater = Date.from(date.toInstant().plusSeconds(3600));
			Date date2hLater = Date.from(date.toInstant().plusSeconds(7200));
			Date date2misHLater = Date.from(date.toInstant().plusSeconds(9000));
			Game game1 = new Game(new Date());
			gameRepository.save(game1);
			Game game2 = new Game(date1hLater);
			gameRepository.save(game2);
			Game game3 = new Game(date2hLater);
			gameRepository.save(game3);
			Game game4 = new Game(date2misHLater);
			gameRepository.save(game4);

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
			GamePlayer gamePlayer7 = new GamePlayer(p5, game4);
			gamePlayerRepository.save(gamePlayer7);
			GamePlayer gamePlayer8 = new GamePlayer(p3, game4);
			gamePlayerRepository.save(gamePlayer8);

			//Ship (type, gamePlayer and location)
			Ship ship1 = new Ship("Cruiser", new ArrayList<>(Arrays.asList("A9", "B9", "C9")));
			gamePlayer1.addShip(ship1);
			shipRepository.save(ship1);


			Ship ship6 = new Ship("Destroyer", new ArrayList<>(Arrays.asList("F4", "F5","F6")));
			gamePlayer1.addShip((ship6));
			shipRepository.save(ship6);



			Ship ship2 = new Ship("Destroyer", new ArrayList<>(Arrays.asList("H2", "H3", "H4")));
			gamePlayer2.addShip((ship2));
			shipRepository.save(ship2);



			Ship ship3 = new Ship("Submarine", new ArrayList<>(Arrays.asList("E1", "F1", "G1")));
			gamePlayer2.addShip(ship3);
			shipRepository.save(ship3);



			Ship ship4 = new Ship("Patrol Boat", new ArrayList<>(Arrays.asList("A7", "A8", "A9")));
			gamePlayer4.addShip((ship4));
			shipRepository.save(ship4);



			Ship ship5 = new Ship("Patrol Boat", new ArrayList<>(Arrays.asList("B7", "B8", "B9")));
			gamePlayer5.addShip(ship5);
			shipRepository.save(ship5);



			Ship ship7 = new Ship("Patrol Boat",  new ArrayList<>(Arrays.asList("D7", "D8", "D9")));
			gamePlayer8.addShip(ship7);
			shipRepository.save(ship7);

			//Salvos(turnNumber, gamePlayer, salvoLocations(List))
			List<String> salvoLocation1 = new ArrayList<>();
			salvoLocation1.add("H1");
			salvoLocation1.add("A9");
			Salvo salvo1 = new Salvo(1, gamePlayer1, salvoLocation1);
			salvoRepository.save(salvo1);

			List<String> salvoLocation2 = new ArrayList<>();
			salvoLocation2.add("J5");
			salvoLocation2.add("A8");
			Salvo salvo2 = new Salvo(2, gamePlayer1, salvoLocation2);
			salvoRepository.save(salvo2);

			List<String> salvoLocation3 = new ArrayList<>();
			salvoLocation3.add("J5");
			salvoLocation3.add("H4");
			Salvo salvo3 = new Salvo(3, gamePlayer2, salvoLocation3);
			salvoRepository.save(salvo3);

			List<String> salvoLocation4 = new ArrayList<>();
			salvoLocation4.add("C5");
			salvoLocation4.add("E6");
			Salvo salvo4 = new Salvo(2, gamePlayer2, salvoLocation4);
			salvoRepository.save(salvo4);

			List<String> salvoLocation5 = new ArrayList<>();
			salvoLocation5.add("D3");
			salvoLocation5.add("F6");
			Salvo salvo5 = new Salvo(3, gamePlayer4, salvoLocation5);
			salvoRepository.save(salvo5);

			List<String> salvoLocation6 = new ArrayList<>();
			salvoLocation6.add("J7");
			salvoLocation6.add("D2");
			Salvo salvo6 = new Salvo(2, gamePlayer5, salvoLocation6);
			salvoRepository.save(salvo6);

			List<String> salvoLocation7 = new ArrayList<>();
			salvoLocation6.add("J7");
			salvoLocation6.add("D2");
			Salvo salvo7 = new Salvo(2, gamePlayer7, salvoLocation7);
			salvoRepository.save(salvo7);

			List<String> salvoLocation8 = new ArrayList<>();
			salvoLocation8.add("J7");
			salvoLocation8.add("D2");
			Salvo salvo8 = new Salvo(2, gamePlayer8, salvoLocation8);
			salvoRepository.save(salvo8);
//-------------------------------------scores-------------------------------------------------------
			Date firstFinish = Date.from(date.toInstant().plusSeconds(1800));
			Score score1 = new Score(game1, p1, 1.0, firstFinish);
			Score score3 = new Score(game1, p4, 0.0, firstFinish);
			scoreRepository.save(score3);
			scoreRepository.save(score1);
			Date secondFinish = Date.from(date1hLater.toInstant().plusSeconds(1800));
			Score score2 = new Score(game2, p2, 0.5, secondFinish);
			scoreRepository.save(score2);
			Score score4 = new Score(game2, p5, 0.5, secondFinish);
			scoreRepository.save(score4);
			Score score5 = new Score(game4, p5, 1.0, secondFinish);
			scoreRepository.save(score5);
			Score score6 = new Score(game4, p3, 0.0, secondFinish);
			scoreRepository.save(score6);
		};

	}

	@Bean
	public PasswordEncoder passwordEncoder() {
		return PasswordEncoderFactories.createDelegatingPasswordEncoder();
	}
}
	@Configuration
	class WebSecurityConfiguration extends GlobalAuthenticationConfigurerAdapter {
		@Autowired
		private PlayerRepository playerRepository;
		@Override
		public void init(AuthenticationManagerBuilder auth) throws Exception {
			auth.userDetailsService(inputName-> {
				Player player = playerRepository.findByUsername(inputName);
				if (player != null) {
					return new User(player.getUsername(), player.getPassword(),
							AuthorityUtils.createAuthorityList("USER"));
				} else {
					throw new UsernameNotFoundException("Unknown user: " + inputName);
				}
			});
		}

	}

@EnableWebSecurity
@Configuration
class WebSecurityConfig extends WebSecurityConfigurerAdapter {
	@Override
	protected void configure(HttpSecurity http) throws Exception {
		http.authorizeRequests()
				.antMatchers("/web/games.html").permitAll()
				.antMatchers("api/games").permitAll()
				.antMatchers("/api/game_view/**").hasAuthority("USER")
				.antMatchers("/web/game.html*").hasAuthority("USER")
				.antMatchers("/rest/**").hasAuthority("USER")
				.and()
				.formLogin()
				.loginPage("/api/login")
				.usernameParameter("username")
				.passwordParameter("password")
				.permitAll()
				.and()
				.logout()
				.logoutUrl("/api/logout");


		// turn off checking for CSRF tokens
		http.csrf().disable();

		// if user is not authenticated, just send an authentication failure response
		http.exceptionHandling().authenticationEntryPoint((req, res, exc) -> res.sendError(HttpServletResponse.SC_UNAUTHORIZED));

		// if login is successful, just clear the flags asking for authentication
		http.formLogin().successHandler((req, res, auth) -> clearAuthenticationAttributes(req));

		// if login fails, just send an authentication failure response
		http.formLogin().failureHandler((req, res, exc) -> res.sendError(HttpServletResponse.SC_UNAUTHORIZED));

		// if logout is successful, just send a success response
		http.logout().logoutSuccessHandler(new HttpStatusReturningLogoutSuccessHandler());
	}



private void clearAuthenticationAttributes(HttpServletRequest request) {
		HttpSession session = request.getSession(false);
		if (session != null) {
		session.removeAttribute(WebAttributes.AUTHENTICATION_EXCEPTION);
		}

}
}

