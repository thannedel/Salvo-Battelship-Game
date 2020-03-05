//site = "'http://localhost:8080/api/game_view/1";
var url = window.location.href;
var key_url;
var actualShips = [
  {
    type: "aircraft",
    shipLocation: [],
    length: 5
  },
  {
    type: "battleship",
    shipLocation: [],
    length: 4
  },
  {
    type: "submarine",
    shipLocation: [],
    length: 3
  },
  {
    type: "destroyer",
    shipLocation: [],
    length: 3
  },
  {
    type: "patrolboat",
    shipLocation: [],
    length: 2
  }
];
paramObj(url);
fetching(key_url);
//loadJsonData(key_url);
function paramObj(search) {
  var obj = {};
  var reg = /(?:[?&]([^?&#=]+)(?:=([^&#]*))?)(?:#.*)?/g;

  search.replace(reg, function(match, param, val) {
    obj[decodeURIComponent(param)] =
      val === undefined ? "" : decodeURIComponent(val);
  });
  key_url = obj.gp;
  return key_url;
}

function loadJsonData(param) {
  $.getJSON("/api/game_view/" + param, function(data_json) {
    var data = data_json;
  });
}

function fetching(param) {
  site = "/api/game_view/" + param;
  var fetchConfig = fetch(this.site, {
    method: "GET"
  })
    .then(function(res) {
      console.log(res.status);
      if (res.status == 403) {
        alert("Not allowed to view opponents game");
        window.location.href = "games.html";
      }
      return res.json();
    })
    .then(function(json) {
      data = json;
      games = data;
      ships = data.ships;

      console.log(ships);
      createTable("playerTable");
      createTable("opponentTable");
      //gridBoard();
      markShips();
      checkPlayer(param);
      salvos();
      bingoSalvos(shipLocations);
      console.log("param in get", param);
      //postShips(param)
      console.log(games);
    })
    .catch(function(error) {
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
    if (gamePlayers.length > 1) {
      if (gamePlayers[i].id == param) {
        player = gamePlayers[i].player.email;
      } else {
        opponent = gamePlayers[i].player.email;
      }
    } else {
      player = gamePlayers[i].player.email;
      opponent = "waiting for opponent";
    }

    document.getElementById("player").innerHTML = player;
    document.getElementById("opponent").innerHTML = opponent;
  }
}

function createTable(table) {
  for (i = 0; i < rows.length; i++) {
    var newRow = document.createElement("tr");
    for (y = 0; y < columns.length; y++) {
      newCell = newRow.insertCell(y);

      if (i == 0 || y == 0) {
        newCell.innerHTML = rows[i] + columns[y];
        newRow.insertCell;
      } else {
        newCell.setAttribute("id", rows[i] + columns[y]);

        // newCell.setAttribute("class", "empty");
        newRow.insertCell;
      }
      document.getElementById(table).appendChild(newRow);
    }
  }
}

var shipLocations = [];

function markShips() {
  var cells = document.getElementById("playerTable").getElementsByTagName("td");
  for (i = 0; i < cells.length; i++) {
    cells[i].setAttribute("class", "empty");
  }
  for (i = 0; i < games.ships.length; i++) {
    for (y = 0; y < games.ships[i].locations.length; y++) {
      shipLocations.push(games.ships[i].locations[y]);
    }
  }

  for (z = 0; z < cells.length; z++) {
    if (shipLocations.includes(cells[z].id)) {
      //var id = cells[z].id;
      cells[z].setAttribute("class", "marked");
    }
  }
  // console.log(shipLocations);
}

function salvos() {
  var cells = document
    .getElementById("opponentTable")
    .getElementsByTagName("td");
  //var salvoLocations = [];

  for (i = 0; i < games.salvos.length; i++) {
    for (y = 0; y < games.salvos[i].locations.length; y++) {
      for (z = 0; z < cells.length; z++) {
        if (games.salvos[i].locations[y] == cells[z].id) {
          cells[z].innerHTML = games.salvos[i].turn;
          cells[z].setAttribute("class", "salvo");
        }
      }
    }
  }
}

function bingoSalvos() {
  var cells = document.getElementById("playerTable").getElementsByTagName("td");
  var opponents = games.opponents.opponentSalvos;
  console.log(
    Object.entries(games.opponents).length === 0 &&
      games.opponents.constructor === Object
  );
  let noOpponent =
    Object.entries(games.opponents).length === 0 &&
    games.opponents.constructor === Object;
  if (!noOpponent) {
    for (i = 0; i < opponents.length; i++) {
      for (y = 0; y < opponents[i].locations.length; y++) {
        for (z = 0; z < cells.length; z++) {
          if (opponents[i].locations[y] == cells[z].id) {
            cells[z].innerHTML = opponents[i].turn;

            if (cells[z].className == "marked") {
              cells[z].setAttribute("class", "bingoSalvo");
            } else {
              cells[z].setAttribute("class", "salvo");
            }
          }
        }
      }
    }
  }
}

function postShips() {
  let param = paramObj(url);
  console.log("param in post ships", param);
  if (actualShips.length == 5) {
    fetch("/api/games/players/" + param + "/ships", {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(actualShips)
    })
      .then(response => {
        if (response.status == 201) {
          return response.json();
        } else {
          alert("Your ships are already placed!");
        }
      })
      .then(data => {
        //console.log(data)
        window.location.reload();
      });
  } else {
    alert("Place the rest of the ships!");
  }
}

var dragged;

function drag(event) {
  event.dataTransfer.setData("text/plain", event.target.id);
}

/* events fired on the draggable target */
document.addEventListener("drag", function(event) {}, false);

document.addEventListener(
  "dragstart",
  function(event) {
    // store a ref. on the dragged elem
    dragged = event.target;
    // make it half transparent
    event.target.style.opacity = 0.5;
  },
  false
);

document.addEventListener(
  "dragend",
  function(event) {
    // reset the transparency
    event.target.style.opacity = "";
  },
  false
);

/* events fired on the drop targets */
document.addEventListener(
  "dragover",
  function(event) {
    // prevent default to allow drop
    event.preventDefault();
  },
  false
);

document.addEventListener(
  "dragenter",
  function(event) {
    // highlight potential drop target when the draggable element enters it

    if (event.target.className == "empty") {
      event.target.style.background = "#f4f4f4";
    }
  },
  false
);

document.addEventListener(
  "dragleave",
  function(event) {
    // reset background of potential drop target when the draggable element leaves it
    if (event.target.className == "empty") {
      event.target.style.background = "";
    }
  },
  false
);

document.addEventListener(
  "drop",
  function(event) {
    // prevent default action (open as link for some elements)
    event.preventDefault();
    // move dragged elem to the selected drop target
    var myPosition = "";
    var shipType = "";
    let data = event.dataTransfer.getData("text");
    let draggableElement = document.getElementById(data);

    var firsrtCell = event.target.id;
    var splitNumber = parseInt(event.target.id.slice(1));
    var splitLetter = event.target.id.slice(0, 1);
    /* console.log(splitLetter);
  console.log(splitNumber);
  console.log(firsrtCell); */
    shipType = draggableElement.className;

    for (i = 0; i < actualShips.length; i++) {
      if (shipType == actualShips[i].type) {
        actualShips[i].shipLocation = [];
        for (j = 0; j < actualShips[i].length; j++) {
          var finalShipLocations = splitLetter + (splitNumber + j);
          if (finalShipLocations != isNaN()) {
            actualShips[i].shipLocation.push(finalShipLocations);
          }
          /* console.log(event.target)
                  console.log(dragged) */
        }
        console.log(actualShips[i].shipLocation);
        event.target.style.background = "";

        if (
          event.target.className == "empty" &&
          splitNumber + actualShips[i].length <= 11
        ) {
          dragged.parentNode.removeChild(dragged);
          event.target.appendChild(dragged);
        }
        //console.log(actualShips[i].shipLocation)
      }
    }

    //myPosition = rows.indexOf(splitLetter);
    console.log(myPosition);
  },
  false
);
