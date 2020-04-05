/*
fetch("/api/games").then(function (response) {
    console.log(response)
    console.log('Request succeeded: ' + response);
    return response.json();
  }).then(games => console.log(games))
  .catch(function (error) {
    console.log("Request failed: " + error.message);
  });
*/

site = " http://localhost:8080/api/games";

var i, j, k;
var index = 1;
fetching();

//var members;

function fetching() {
  var fetchConfig = fetch(this.site, {
      method: "GET"
    })
    .then(function (res) {
      console.log(res);
      if (res.ok) return res.json();
    })
    .then(function (json) {
      data = json;
      user = data.player;
      games = data.games;

      console.log(user);

      createList(games);


      console.log(games);
    })
    .catch(function (error) {
      console.log(error);
    });
}

function getcurrentplayer(currentPlayerId) {
  for (i = 0; i < games.length; i++) {
    if (user != null && games[i].gamePlayers.length > 1) {
      if (
        user.id == games[i].gamePlayers[0].player.id ||
        user.id == games[i].gamePlayers[1].player.id
      ) {
        var currentPlayerId = user.id;
      }
    }
  }
  return currentPlayerId;
}

function createList(games) {
  var output = document.getElementById("output");
  output.innerHTML = "";
  console.log(games);

  for (var i = 0; i < games.length; i++) {
    var row = document.createElement("tr");
    var date = new Date(games[i].created);
    var localDate = date.toLocaleString();

    var player1 = games[i].gamePlayers[0].player.email;
    var player2;
    var action = "-";
    var currentGamePlayerId;

    var backtogame;

    if (games[i].gamePlayers.length > 1) {
      player2 = games[i].gamePlayers[1].player.email;
      if (games[i].gamePlayers[0].player.id == getcurrentplayer()) {
        // gameplayer id of loggedin player
        currentGamePlayerId = games[i].gamePlayers[0].id;
      }
      if (games[i].gamePlayers[1].player.id == getcurrentplayer()) {
        // gameplayer id of loggedin player
        currentGamePlayerId = games[i].gamePlayers[1].id;
      }

      backtogame = document.createElement("a");
      backtogame.setAttribute(
        "href",
        "/web/game.html?gp=" + currentGamePlayerId
      );
      backtogame.setAttribute(
        "class",
        "backButton");
      backtogame.innerHTML = "Play";

      if (
        currentGamePlayerId == games[i].gamePlayers[0].id ||
        currentGamePlayerId == games[i].gamePlayers[1].id
      ) {
        action = backtogame;
      }
    } else if (user != null && user.id != games[i].gamePlayers[0].player.id) {
      player2 = "-";
      var joinButton = document.createElement("button");
      joinButton.innerHTML = "Join the Game";
      var gameid = games[i].id;
      joinButton.setAttribute("data-gameid", gameid);
      joinButton.setAttribute("class", "joinButton");
      joinButton.addEventListener("click", function () {
        joinGame(gameid);
      });
      action = joinButton;
    } else {
      player2 = "-";
      action = "waiting for opponent";
    }

    console.log(action);
    index = i + 1;
    var kelia = [index, localDate, player1, player2, action];

    kelia.forEach(keli => {
      var tablekelia = document.createElement("td");
      tablekelia.append(keli);
      row.append(tablekelia);
    });

    document.getElementById("output").append(row);
  }
  console.log("current game player id", currentGamePlayerId);
}


login();
//loginPost();

function login() {
  $("#loginButton").click(function (event) {
    event.preventDefault();

    let username = document.getElementById("usernameLogin").value;
    let password = document.getElementById("passwordLogin").value;
    console.log(username);
    loginPost(username, password);

  });
}

function loginPost(username, password) {
  $.post("/api/login", {
      username: username,
      password: password
    })
    .done(function () {
      console.log("Logged in!");

      window.location.reload();

    })
    .fail(function () {
      alert("You have to sign up first!");
    });
}



//logOut();

function logOut() {
  fetch("http://localhost:8080/api/logout", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded"
      }
    })
    .then(function (response) {
      console.log("logged out", response);
      return response.status;
    })
    .then(status => {
      if (status == 200) {
        window.location.href = "games.html";
      } else {
        alert("something went wrong");
      }
    })
    .catch(error => console.log(error));
}
//signUp();

function signUp() {
  var newName = document.getElementById("username").value;
  var newPassword = document.getElementById("password").value;
  var eMail = document.getElementById("email").value;
  fetch("/api/players", {
      credentials: "include",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      body: "username=" + newName + "&password=" + newPassword + "&email=" + eMail
    })
    .then(function (res) {
      return res.json();
    })
    .then(data => {
      console.log("Request success: ", data);
      if (data.username) {
        alert("Welcome " + newName + ", you can login now");
        window.location.reload();
      } else {
        alert(data.error);
      }
    })
    .catch(function (error) {
      console.log("Request failure: ", error);
    });
}

function joinGame(gameid) {
  console.log(gameid);
  fetch(`http://localhost:8080/api/game/${gameid}/players`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        credentials: "include"
      }
    })
    .then(response => {
      console.log(response);
      return response.json();
    })
    .then(games => {
      if (games.gpid) {
        window.location.href = "game.html?gp=" + games.gpid;
      }
    })
    .catch(error => console.log(error));
}

$("#createGame").click(function (event) {
  event.preventDefault();
  $.post("/api/games")
    .done(function (games) {
      console.log(games);
      console.log("game created");
      gameViewUrl = "/web/game.html?gp=" + games.gpId;

      location.href = gameViewUrl;
    })
    .fail(function (data) {
      console.log("game creation failed");
    })
    .always(function () {});
});