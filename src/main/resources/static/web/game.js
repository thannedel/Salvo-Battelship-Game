//site = "'http://localhost:8080/api/game_view/1";
var url = window.location.href;
var key_url;

paramObj(url);
fetching(key_url);
//loadJsonData(key_url);
function paramObj(search) {
  var obj = {};
  var reg = /(?:[?&]([^?&#=]+)(?:=([^&#]*))?)(?:#.*)?/g;

  search.replace(reg, function (match, param, val) {
    obj[decodeURIComponent(param)] =
      val === undefined ? "" : decodeURIComponent(val);
  });
  key_url = obj.gp;
  return key_url;
}

function loadJsonData(param) {
  $.getJSON("/api/game_view/" + param, function (data_json) {
    var data = data_json;
    loadJsonShipData(param, data);
    loadJsonSalvoData(param, data);
    createShips(data);
  });
}
//var members;

function fetching(param) {
  site = "/api/game_view/" + param;
  var fetchConfig = fetch(this.site, {
      method: "GET"
    })
    .then(function (res) {
      if (res.ok) return res.json();
    })
    .then(function (json) {
      data = json;
      games = data;
      createTable();
      createTable2();
      //gridBoard();
      markShips();
      checkPlayer(param);
      salvos();
      bingoSalvos(playerLocations);
      console.log(games);
    })
    .catch(function (error) {
      console.log(error);
    });
}

var rows = ["", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
var columns = ["", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

//check player & opponent
var player = "";
var opponent = "";

function checkPlayer(param) {
  var gamePlayers = games.gamePlayers;

  for (i = 0; i < gamePlayers.length; i++) {
    if (gamePlayers[i].id == param) {
      player = gamePlayers[i].player.email;
    } else {
      opponent = gamePlayers[i].player.email;
    }
  }

  document.getElementById("player").innerHTML = player;
  document.getElementById("opponent").innerHTML = opponent;
}

function createTable() {
  for (i = 0; i < rows.length; i++) {
    var newRow = document.createElement("tr");
    for (y = 0; y < columns.length; y++) {
      newCell = newRow.insertCell(y);
      if (i == 0 || y == 0) {
        newCell.innerHTML = rows[i] + columns[y];
        newRow.insertCell;
      } else {
        newCell.setAttribute("id", rows[i] + columns[y]);
        newRow.insertCell;
      }
    }
    document.getElementById("playerTable").appendChild(newRow);
  }
}

function createTable2() {
  for (i = 0; i < rows.length; i++) {
    var newRow = document.createElement("tr");
    for (y = 0; y < columns.length; y++) {
      newCell = newRow.insertCell(y);
      if (i == 0 || y == 0) {
        newCell.innerHTML = rows[i] + columns[y];
        newRow.insertCell;
      } else {
        newCell.setAttribute("id", rows[i] + columns[y]);
        newRow.insertCell;
      }
    }
    document.getElementById("opponentTable").appendChild(newRow);
  }
}
var playerLocations = [];

function markShips() {
  var cells = document.getElementById("playerTable").getElementsByTagName("td");

  for (i = 0; i < games.ships.length; i++) {
    for (y = 0; y < games.ships[i].locations.length; y++) {
      playerLocations.push(games.ships[i].locations[y]);
    }
  }

  for (z = 0; z < cells.length; z++) {
    if (playerLocations.includes(cells[z].id)) {
      var id = cells[z].id;
      cells[z].setAttribute("class", "marked");
    }
  }
}

function bingoSalvos(playerLocations) {
  var cells = document
    .getElementById("opponentTable")
    .getElementsByTagName("td");
  var opponentSalvo = [];
  var opponents = games.opponents.opponentSalvos;
  for (i = 0; i < opponents.length; i++) {
    for (y = 0; y < opponents[i].locations.length; y++) {
      opponentSalvo.push(opponents[i].locations[y]);
    }
  }
  console.log(opponents[0].locations.length);
  console.log(opponentSalvo);
  console.log(playerLocations);
  const objMap = {};

  opponentSalvo.forEach(e1 =>
    playerLocations.forEach(e2 => {
      if (e1 === e2) {
        objMap[e1] = objMap[e1] + 1 || 1;
      }
    })
  );
  var hit = Object.keys(objMap).map(e => String(e));
  console.log(hit);
  var cells = document.getElementById("playerTable").getElementsByTagName("td");

  for (z = 0; z < cells.length; z++) {
    if (hit.includes(cells[z].id)) {
      var id = cells[z].id;
      cells[z].setAttribute("class", "bingoSalvo");
    }
  }
}

function salvos() {
  var cells = document
    .getElementById("opponentTable")
    .getElementsByTagName("td");
  var salvoLocations = [];
  for (i = 0; i < games.salvos.length; i++) {
    for (y = 0; y < games.salvos[i].locations.length; y++) {
      salvoLocations.push(games.salvos[i].locations[y]);
    }

    for (z = 0; z < cells.length; z++) {
      if (salvoLocations.includes(cells[z].id)) {
        var id = cells[z].id;
        cells[z].setAttribute("class", "salvo");
      }
    }
  }
}




























/*gridBoard();
function gridBoard() {
  var gridNumbers = ["", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
  var gridLetters = ["", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

  for (var i = 0; i < gridLetters.length; i++) {
    for (var j = 0; j < gridNumbers.length; j++) {

      let card = document.createElement("div");
      if(i==0||j==0){
     card.innerHTML = `${gridLetters[i] + gridNumbers[j]} `;
     }else
     {
                  card.setAttribute("id", gridLetters[i] + gridNumbers[j]);
                  card.setAttribute("class", "content");
                card.innerHTML;
                }
      playerTable.appendChild(card);
    }
  }
}*/

/*gridBoard();
function gridBoard(){
var numbers = ["", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
var letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

for (var i = 0; i<numbers.length; i++){
let lettersRow = document.createElement("div");
lettersRow.innerHTML = `${numbers[i]}`;
playerTable.appendChild(lettersRow);

}
for (var i = 0; i < letters.length; i++) {
    for (var j = 0; j < numbers.length; j++) {

      let card = document.createElement("div");
      if( j==0){
     card.innerHTML = `${letters[i] + numbers[j]} `;
     }else
     {
                  card.setAttribute("id", letters[i] + numbers[j]);
                  card.setAttribute("class", "content");
                card.innerHTML;
                }
      playerTable.appendChild(card);

    }
  }
}


gridBoard2();
function gridBoard2(){
var numbers = ["", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
var letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

for (var i = 0; i<numbers.length; i++){
let lettersRow = document.createElement("div");
lettersRow.innerHTML = `${numbers[i]}`;
opponentTable.appendChild(lettersRow);
}
for (var i = 0; i < letters.length; i++) {
    for (var j = 0; j < numbers.length; j++) {

      let card = document.createElement("div");
      if( j==0){
     card.innerHTML = `${letters[i] + numbers[j]} `;
     }else
     {
                  card.setAttribute("id", letters[i] + numbers[j]);
                  card.setAttribute("class", "content");
                card.innerHTML;
                }
      opponentTable.appendChild(card);
    }
  }
}*/