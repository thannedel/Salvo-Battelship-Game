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

@SpringBootApplication

public class SalvoApplication {

	public static void main(String[] args) {
		SpringApplication.run(SalvoApplication.class, args);
	}

	@Bean
	public CommandLineRunner initData(PlayerRepository playerRepository, GameRepository gameRepository, GamePlayerRepository gamePlayerRepository, ShipRepository shipRepository, SalvoRepository salvoRepository, ScoreRepository scoreRepository, PostRepository postRepository) {
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
			Ship ship1 = new Ship("Cruiser", new ArrayList<>(Arrays.asList("A9", "B9", "C9")),"vertical");
			gamePlayer1.addShip(ship1);
			shipRepository.save(ship1);


			Ship ship6 = new Ship("Destroyer", new ArrayList<>(Arrays.asList("F4", "F5","F6")),"horizontal");
			gamePlayer1.addShip((ship6));
			shipRepository.save(ship6);



			Ship ship2 = new Ship("Destroyer", new ArrayList<>(Arrays.asList("H2", "H3", "H4")),"horizontal");
			gamePlayer2.addShip((ship2));
			shipRepository.save(ship2);



			Ship ship3 = new Ship("Submarine", new ArrayList<>(Arrays.asList("E1", "F1", "G1")),"vertical");
			gamePlayer2.addShip(ship3);
			shipRepository.save(ship3);



			Ship ship4 = new Ship("Patrol Boat", new ArrayList<>(Arrays.asList("A7", "A8", "A9")),"horizontal");
			gamePlayer4.addShip((ship4));
			shipRepository.save(ship4);



			Ship ship5 = new Ship("Patrol Boat", new ArrayList<>(Arrays.asList("B7", "B8", "B9")),"horizontal");
			gamePlayer5.addShip(ship5);
			shipRepository.save(ship5);



			Ship ship7 = new Ship("Patrol Boat",  new ArrayList<>(Arrays.asList("D7", "D8", "D9")),"horizontal");
			gamePlayer8.addShip(ship7);
			shipRepository.save(ship7);

			//Salvos(turnNumber, gamePlayer, salvoLocations(List))

			Salvo salvo1 = new Salvo(1, new ArrayList<>(Arrays.asList("H1","A9")));
			gamePlayer1.addSalvo(salvo1);
			salvoRepository.save(salvo1);


			Salvo salvo2 = new Salvo(2, new ArrayList<>(Arrays.asList("J5","A8")));
			gamePlayer1.addSalvo(salvo2);
			salvoRepository.save(salvo2);


			Salvo salvo3 = new Salvo(3, new ArrayList<>(Arrays.asList("J5","H4")));
			gamePlayer2.addSalvo(salvo3);
			salvoRepository.save(salvo3);


			Salvo salvo4 = new Salvo(2, new ArrayList<>(Arrays.asList("C5","E6")));
			gamePlayer2.addSalvo(salvo4);
			salvoRepository.save(salvo4);


			Salvo salvo5 = new Salvo(3, new ArrayList<>(Arrays.asList("D3","F6")));
			gamePlayer4.addSalvo(salvo5);
			salvoRepository.save(salvo5);


			Salvo salvo6 = new Salvo(2, new ArrayList<>(Arrays.asList("J7","D2")));
			gamePlayer5.addSalvo(salvo6);
			salvoRepository.save(salvo6);


			Salvo salvo7 = new Salvo(2, new ArrayList<>(Arrays.asList("J7","D2")));
			gamePlayer7.addSalvo(salvo7);
			salvoRepository.save(salvo7);

			Salvo salvo8 = new Salvo(2, new ArrayList<>(Arrays.asList("J7","D2")));
			gamePlayer8.addSalvo(salvo8);
			salvoRepository.save(salvo8);




			Date secondCommentDate = Date.from(date.toInstant().plusSeconds(50));
			Date thirdCommentDate = Date.from(date.toInstant().plusSeconds(70));
			Post post1 = new Post(new Date(), "first comment");
			gamePlayer1.addPost(post1);
			postRepository.save(post1);
			Post post2 = new Post(secondCommentDate,"proto comment b paikti");
			gamePlayer4.addPost(post2);
			postRepository.save(post2);
			Post post3 = new Post(thirdCommentDate,"second comment a paikti");
			gamePlayer1.addPost(post3);
			postRepository.save(post3);
//-------------------------------------scores-------------------------------------------------------
			//Date firstFinish = Date.from(date.toInstant().plusSeconds(1800));
			Score score1 = new Score(1.0,game1, p1);
			Score score3 = new Score(0.0,game1, p4);
			scoreRepository.save(score3);
			scoreRepository.save(score1);
			//Date secondFinish = Date.from(date1hLater.toInstant().plusSeconds(1800));
			Score score2 = new Score(0.5,game2, p2);
			scoreRepository.save(score2);
			Score score4 = new Score(0.5,game2, p5);
			scoreRepository.save(score4);
			Score score5 = new Score(1.0,game4, p5);
			scoreRepository.save(score5);
			Score score6 = new Score(0.0,game4, p3 );
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
				.antMatchers("/web/leaderBoard.html").permitAll()
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

