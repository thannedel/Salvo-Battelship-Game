site = " https://salvo-ship-game.herokuapp.com/api/games";

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


            boardObject();
            totalScore(playersArray);
            createTable(playersArray);

            console.log(games);
        })
        .catch(function (error) {
            console.log(error);
        });
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
                    name: games[i].gamePlayers[j].player.name,
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
        var user = playersArray[i].name;
        var total = playersArray[i].total;
        var win = playersArray[i].win;
        var loss = playersArray[i].loss;
        var tie = playersArray[i].tie;
        index = i + 1;
        var cells = [index, user, total, win, loss, tie];
        for (var j = 0; j < cells.length; j++) {
            var tableCell = document.createElement("td");
            tableCell.append(cells[j]);
            tableRow.append(tableCell);
        }
        document.getElementById("leaderBoard").append(tableRow);
    }
}