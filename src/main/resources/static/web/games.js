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


site = ' http://localhost:8080/api/games';

var i, j, k;



fetching()

//var members;

function fetching() {

  var fetchConfig =
    fetch(this.site, {
      method: "GET",

    }).then(function (res) {
      if (res.ok)
        return res.json();
    }).then(function (json) {

      data = json;
      games = data;

      console.log(games);
      createList();
      listOfPlayers();
      totalScore(playersArray);
      createTable(playersArray);
      console.log(playersArray);
    })
    .catch(function (error) {
      console.log(error);
    })
}

function createList() {
  games.forEach(game => {
    var date = new Date(game.created);
    let testList = document.createElement("li")
    testList.innerHTML = ` ${game.id}, ${date.toLocaleString()}, ${game.gamePlayers[0].player.email} vs ${game.gamePlayers[1].player.email} `
    output.appendChild(testList);
  })

}

function listOfPlayers() {
  playersArray = [];
  let playersIds = [];

  for (i = 0; i < games.length; i++) {

    for (j = 0; j < games[i].gamePlayers.length; j++) {

      if (!playersIds.includes(games[i].gamePlayers[j].player.id)) {
        playersIds.push(games[i].gamePlayers[j].player.id);
        let playerScoreData = {
          "id": games[i].gamePlayers[j].player.id,
          "email": games[i].gamePlayers[j].player.email,
          "scores": [],
          "total": 0.0
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

}

function createTable(playersArray) {
  playersArray.sort(function (a, b) {
    return b.total - a.total;
  });
  console.log(playersArray);
  var leaderBoard = document.getElementById("leaderBoard");
  leaderBoard.innerHTML = "";
  for (i = 0; i < playersArray.length; i++) {
    var tableRow = document.createElement("tr");
    var user = playersArray[i].email;

    var total = playersArray[i].total;
    var cells = [user, total];
    for (var j = 0; j < cells.length; j++) {
      var tableCell = document.createElement("td");
      tableCell.append(cells[j]);
      tableRow.append(tableCell);
    }
    document.getElementById("leaderBoard").append(tableRow);
  }

}







/*  countWon = 0;
 countLost = 0;
 countTied = 0;
 for (i = 0; i < playersArray.length; i++) {


   if (playersArray[i].scores.length > 0) {

     for (j = 0; j < playersArray[i].scores.length; j++) {
       if (playersArray[i].scores[j] == 0.0) {
         countLost++;
       } else if (playersArray[i].scores[j] == 0.5) {
         countTied++;
       } else if (playersArray[i].scores[j] == 1.0) {
         countWon++;
       }
     }

   }
 } */