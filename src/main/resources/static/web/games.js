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
      boardObject();
      totalScore(playersArray);
      createTable(playersArray);

      console.log(games);
    })
    .catch(function (error) {
      console.log(error);
    });
}

function getcurrentplayer(currentPlayerId) {
  for (i = 0; i < games.length; i++) {
    if (user != null) {
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

  console.log(getcurrentplayer());
  //console.log(Object.entries(games.gamePlayers.player).length === 0 && games.gamePlayers.player.constructor === Object)
  for (var i = 0; i < games.length; i++) {
    var row = document.createElement("tr");
    var date = new Date(games[i].created);
    var localDate = date.toLocaleString();

    var player1 = games[i].gamePlayers[0].player.email;
    var player2 = games[i].gamePlayers[1].player.email;


    var currentGamePlayerId;
    if (games[i].gamePlayers[0].player.id == getcurrentplayer()) {
      // gameplayer id of loggedin player
      currentGamePlayerId = games[i].gamePlayers[0].id;
    }
    if (games[i].gamePlayers[1].player.id == getcurrentplayer()) {
      // gameplayer id of loggedin player
      currentGamePlayerId = games[i].gamePlayers[1].id;
    }
    var backtogame = document.createElement("a");
    backtogame.setAttribute("href", "/web/game.html?gp=" + currentGamePlayerId);
    backtogame.innerHTML = "Go to Game";

    if (
      currentGamePlayerId == games[i].gamePlayers[0].id ||
      currentGamePlayerId == games[i].gamePlayers[1].id
    ) {
      var action = backtogame;
    } else {
      var action = "-";
    }

    var kelia = [localDate, player1, player2, action];

    kelia.forEach(keli => {
      var tablekelia = document.createElement("td");
      tablekelia.append(keli);
      row.append(tablekelia);
    });

    document.getElementById("output").append(row);
  }
  console.log("current game player id", currentGamePlayerId);
}

function boardObject() {
  playersArray = [];
  let playersIds = [];

  for (i = 0; i < games.length; i++) {
    for (j = 0; j < games[i].gamePlayers.length; j++) {
      if (!playersIds.includes(games[i].gamePlayers[j].player.id)) {
        playersIds.push(games[i].gamePlayers[j].player.id);
        let playerScoreData = {
          id: games[i].gamePlayers[j].player.id,
          email: games[i].gamePlayers[j].player.email,
          scores: [],
          total: 0.0,
          win: 0.0,
          loss: 0.0,
          tie: 0.0
        };
        playersArray.push(playerScoreData);
      }
    }
  }
  return playersArray;
}

function totalScore(playersArray) {
  for (i = 0; i < games.length; i++) {
    for (j = 0; j < games[i].scores.length; j++) {
      let scorePlayerId = games[i].scores[j].playerID;

      for (k = 0; k < playersArray.length; k++) {
        if (playersArray[k].id == scorePlayerId) {
          playersArray[k].scores.push(games[i].scores[j].score);
          playersArray[k].total += games[i].scores[j].score;
        }
      }
    }
  }
  for (i = 0; i < playersArray.length; i++) {
    if (playersArray[i].scores.length > 0) {
      for (j = 0; j < playersArray[i].scores.length; j++) {
        if (playersArray[i].scores[j] == 0.0) {
          playersArray[i].loss++;
        } else if (playersArray[i].scores[j] == 0.5) {
          playersArray[i].tie++;
        } else {
          playersArray[i].win++;
        }
      }
    }
  }
}

function createTable(playersArray) {
  playersArray.sort(function (a, b) {
    return b.total - a.total;
  });
  console.log(playersArray[2].scores);
  var leaderBoard = document.getElementById("leaderBoard");
  leaderBoard.innerHTML = "";
  for (i = 0; i < playersArray.length; i++) {
    var tableRow = document.createElement("tr");
    var user = playersArray[i].email;
    var total = playersArray[i].total;
    var win = playersArray[i].win;
    var loss = playersArray[i].loss;
    var tie = playersArray[i].tie;
    var cells = [user, total, win, loss, tie];
    for (var j = 0; j < cells.length; j++) {
      var tableCell = document.createElement("td");
      tableCell.append(cells[j]);
      tableRow.append(tableCell);
    }
    document.getElementById("leaderBoard").append(tableRow);
  }
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

$('#createGame').click(function (event) {
  event.preventDefault();
  $.post("/api/createGame")
    .done(function (games) {
      console.log(games);
      console.log("game created");
      gameViewUrl = "/web/game.html?gp=" + games.gpid;


      location.href = gameViewUrl;

    })
    .fail(function (data) {
      console.log("game creation failed");


    })
    .always(function () {

    });
});