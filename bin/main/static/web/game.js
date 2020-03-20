//site = "'http://localhost:8080/api/game_view/1";
var url = window.location.href;
var key_url;
var actualShips = [{
    type: "aircraft horizontal",
    shipLocation: [],
    length: 5
  },
  {
    type: "battleship horizontal",
    shipLocation: [],
    length: 4
  },
  {
    type: "submarine horizontal",
    shipLocation: [],
    length: 3
  },
  {
    type: "destroyer horizontal",
    shipLocation: [],
    length: 3
  },
  {
    type: "patrolboat horizontal",
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
  });
}

function fetching(param) {
  site = "/api/game_view/" + param;
  var fetchConfig = fetch(this.site, {
      method: "GET"
    })
    .then(function (res) {
      console.log(res.status);
      if (res.status == 403) {
        alert("Not allowed to view opponents game");
        window.location.href = "games.html";
      }
      return res.json();
    })
    .then(function (json) {
      data = json;
      games = data;
      ships = data.ships;

      console.log(ships);
      createTable("playerTable");
      createTable("opponentTable");
      //gridBoard();
      markShips();
      checkPlayer(param);
      crosshair();
      playerSalvos();
      salvos();
      gameStatus();
      bingoSalvos(shipLocations);
      console.log("param in get", param);
      //postShips(param)
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
        cellId = rows[i] + columns[y];
        newCell.setAttribute("id", cellId);
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
      document.getElementById("patrolboat").setAttribute("draggable", false);
      document.getElementById("battleship").setAttribute("draggable", false);
      document.getElementById("submarine").setAttribute("draggable", false);
      document.getElementById("aircraft").setAttribute("draggable", false);
      document.getElementById("destroyer").setAttribute("draggable", false);
    }
  }
}

function crosshair() {
  let cells = document
    .getElementById("opponentTable")
    .getElementsByTagName("td");
  for (i = 0; i < cells.length; i++) {
    cells[i].setAttribute("class", "crosshair");
  }
}
var salvoLocations = [];

function salvos() {
  var counter = 0;
  var cells = document
    .getElementById("opponentTable")
    .getElementsByTagName("td");
  var node = document.getElementsByClassName("salvo");
  textContent = node.textContent;
  if (games.gameStatus == "shooting") {
    for (i = 0; i < cells.length; i++) {
      let keli = cells[i];
      keli.addEventListener("click", function () {
        let type = keli.getAttribute("class");
        let location = keli.getAttribute("id");

        if (type == "crosshair" && this.textContent == "") {
          counter++;

          if (counter > 5) {
            alert("you can only fire 5 salvos at one turn");
            counter--;
          } else {
            keli.setAttribute("class", "salvo");

            salvoLocations.push(location);
          }
        } else if (type == "salvo" && this.textContent == "") {
          counter--;
          for (j = 0; j < salvoLocations.length; j++) {
            let salvo = salvoLocations[j];
            if (salvo == location) {
              salvoLocations.splice(j, 1);
            }
          }
          keli.setAttribute("class", "crosshair");
        }
        console.log(salvoLocations);
        console.log(counter);
      });
    }
  }
}

function playerSalvos() {
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

function postSalvos() {
  let param = paramObj(url);
  console.log("param in post salvos", param);
  console.log(salvoLocations);
  if (salvoLocations.length == 5) {
    let salvoData = {
      turnNumber: "",
      salvoLocation: salvoLocations
    };
    fetch("/api/games/players/" + param + "/salvos", {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(salvoData)
      })
      .then(response => {
        if (response.status == 201) {
          return response.json();
        }
      })
      .then(data => {
        console.log(data);

        window.location.reload();
      })
      .catch(error => {
        console.log("Request failure: ", error);
      });
  } else {
    alert("You have more Salvos to shoot");
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

var dragged;

function drag(event) {
  event.dataTransfer.setData("text/plain", event.target.id);
}

/* events fired on the draggable target */
document.addEventListener("drag", function (event) {}, false);

document.addEventListener(
  "dragstart",
  function (event) {
    // store a ref. on the dragged elem
    dragged = event.target;
    // make it half transparent
    event.target.style.opacity = 0.5;
  },
  false
);

document.addEventListener(
  "dragend",
  function (event) {
    // reset the transparency
    event.target.style.opacity = "";
  },
  false
);

/* events fired on the drop targets */
document.addEventListener(
  "dragover",
  function (event) {
    // prevent default to allow drop
    event.preventDefault();
  },
  false
);

document.addEventListener(
  "dragenter",
  function (event) {
    // highlight potential drop target when the draggable element enters it

    if (event.target.className == "empty") {
      event.target.style.background = "#f4f4f4";
    }
  },
  false
);

document.addEventListener(
  "dragleave",
  function (event) {
    // reset background of potential drop target when the draggable element leaves it
    if (event.target.className == "empty") {
      event.target.style.background = "";
    }
  },
  false
);

document.addEventListener(
  "drop",
  function (event) {
    console.log("dropping");
    // prevent default action (open as link for some elements)
    event.preventDefault();
    // move dragged elem to the selected drop target
    let indexOfLetter = "";
    var shipType = "";
    let data = event.dataTransfer.getData("text");
    let draggableElement = document.getElementById(data);

    //var firsrtCell = event.target.id;
    var splitNumber = parseInt(event.target.id.slice(1));
    var splitLetter = event.target.id.slice(0, 1);
    indexOfLetter = rows.indexOf(splitLetter);

    //console.log(splitNumber);
    console.log(indexOfLetter);
    shipType = draggableElement.className;
    let previousLocations = [];
    console.log(shipType);

    for (i = 0; i < actualShips.length; i++) {
      if (shipType == actualShips[i].type) {
        console.log(draggableElement.classList);
        let locations = [];
        for (j = 0; j < actualShips[i].length; j++) {
          let finalShipLocations = splitLetter + (splitNumber + j);
          if (
            finalShipLocations != isNaN() &&
            splitNumber + actualShips[i].length <= 11
          ) {
            locations.push(finalShipLocations);
            //actualShips[i].shipLocation.push(finalShipLocations);
          }
          console.log(event.target);
          console.log(dragged);
        }
        previousLocations = actualShips[i].shipLocation;
        actualShips[i].shipLocation = locations;
        console.log(previousLocations);
        console.log(actualShips[i].shipLocation);
        event.target.style.background = "";

        if (
          event.target.className == "empty" &&
          splitNumber + actualShips[i].length <= 11 &&
          checkShipsPositions(shipType) == false
        ) {
          dragged.parentNode.removeChild(dragged);
          event.target.appendChild(dragged);
        } else {
          for (i = 0; i < actualShips.length; i++) {
            //when the ship is found
            if (shipType == actualShips[i].type) {
              actualShips[i].shipLocation = previousLocations;
            }
          }
        }
      }
    }
  },
  false
);

function checkShipsPositions(shipType) {
  let duplicate = false;
  for (i = 0; i < actualShips.length; i++) {
    if (shipType == actualShips[i].type) {
      for (p = 0; p < actualShips[i].shipLocation.length; p++) {
        let checkedLocation = actualShips[i].shipLocation[p];
        console.log(checkedLocation);
        for (y = 0; y < actualShips.length; y++) {
          if (actualShips[y].type !== shipType) {
            if (actualShips[y].shipLocation.includes(checkedLocation)) {
              duplicate = true;
            }
          }
        }
      }
    }
  }
  if (duplicate == true) {
    return true;
  } else {
    return false;
  }
}

function vertical(element) {
  var shipType = element.getAttribute("class");
  var shipId = element.getAttribute("id");
  console.log(shipId);
  console.log(shipType);
  //if (element.classList.contains("horizontal")) {
  //element.classList.remove("horizontal");
  //element.classList.add("vertical");}

  if (element.classList.contains("vertical")) {
    element.classList.remove("vertical");
    element.classList.add("horizontal");
    element.setAttribute("draggable", true);
    var shipType1 = shipId + " horizontal";
    console.log(shipType1);
    element.style.marginLeft = "0px";
    element.style.marginTop = "0px";
    for (i = 0; i < actualShips.length; i++) {
      let ship = actualShips[i];
      if (ship.type == shipType1 && ship.shipLocation.length !== 0) {
        let firstCell = ship.shipLocation[0];
        console.log(firstCell);
        let number = parseInt(firstCell[1]);
        let letter = firstCell[0];
        let locations = [];
        for (j = 0; j < actualShips[i].length; j++) {
          let finalShipLocations = letter + (number + j);
          console.log(finalShipLocations);
          locations.push(finalShipLocations);
        }
        actualShips[i].shipLocation = locations;
      }
    }
  } {
    let locations = [];
    for (i = 0; i < actualShips.length; i++) {
      let ship = actualShips[i];
      if (ship.type == shipType && ship.shipLocation.length !== 0) {
        let firstCell = ship.shipLocation[0];
        console.log(firstCell);
        let number = firstCell[1];
        let letter = firstCell[0];
        indexOfLetter = rows.indexOf(letter); //converting the letter in rows number
        console.log(indexOfLetter);
        let letterInCharCode = letter.charCodeAt();
        for (j = 0; j < actualShips[i].length; j++) {
          let finalShipLocations =
            String.fromCharCode(letterInCharCode + j) + number;
          if (
            indexOfLetter + actualShips[i].length <= 11 &&
            element.classList.contains("horizontal")
          ) {
            element.classList.remove("horizontal");
            element.classList.add("vertical");
            element.setAttribute("draggable", false);

            switch (
              ship.length //positioning the vertical
            ) {
              case 2:
                element.style.marginLeft = "-17px";
                element.style.marginTop = "17px";
                break;
              case 3:
                element.style.marginLeft = "-35px";
                element.style.marginTop = "35px";
                break;
              case 4:
                element.style.marginLeft = "-52px";
                element.style.marginTop = "52px";
                break;
              case 5:
                element.style.marginLeft = "-70px";
                element.style.marginTop = "70px";
                break;
            }
          }
          if (
            finalShipLocations != isNaN() &&
            indexOfLetter + actualShips[i].length <= 11
          ) {
            locations.push(finalShipLocations);
            //actualShips[i].shipLocation.push(finalShipLocations);
          }
        }
        previousLocations = actualShips[i].shipLocation;
        actualShips[i].shipLocation = locations;

        event.target.style.background = "";

        console.log(indexOfLetter);
        console.log(actualShips[i].length);
        if (
          //checking the borders of the board and the ships positions
          indexOfLetter + actualShips[i].length > 11 ||
          checkShipsPositions(shipType) == true
        ) {
          element.classList.remove("vertical");
          element.classList.add("horizontal");
          element.style.marginLeft = "0px";
          element.style.marginTop = "0px";
          element.setAttribute("draggable", true);
          for (i = 0; i < actualShips.length; i++) {
            //when the ship is found
            if (shipType == actualShips[i].type) {
              actualShips[i].shipLocation = previousLocations;
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
  console.log(actualShips);

  let result = 0;

  for (i = 0; i < actualShips.length; i++) {
    result += actualShips[i].shipLocation.length;
  }
  console.log(result);

  if (result == 17) {
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
        alert("Your ships are successfully placed!");
      });
  } else {
    alert("Place the rest of the ships!");
  }
}

function gameStatus() {
  if (games.gameStatus == "shooting") {
    document.getElementById("sendSalvos").style.display = "block";
  } else if (
    games.gameStatus == "waiting" ||
    games.gameStatus == "waiting for opponent"
  ) {
    document.getElementById("sendSalvos").style.display = "none";
  }
}

function saveShips() {
  for (i = 0; i < games.ships.length; i++) {
    games[i].ships[0].setAttribute("class", games[i].type);
  }
}