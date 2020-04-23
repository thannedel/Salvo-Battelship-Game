//site = "'https://salvo-ship-game.herokuapp.com/api/game_view/1";
var rows = ["", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
var columns = ["", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

createTable("playerTable");
createTable("opponentTable");
crosshair();

var url = window.location.href;
const gpId = paramObj(url);
var key_url;
var actualShips = [
  {
    type: "aircraft horizontal",
    shipLocation: [],
    length: 5,
    position: "horizontal",
  },
  {
    type: "battleship horizontal",
    shipLocation: [],
    length: 4,
    position: "horizontal",
  },
  {
    type: "submarine horizontal",
    shipLocation: [],
    length: 3,
    position: "horizontal",
  },
  {
    type: "destroyer horizontal",
    shipLocation: [],
    length: 3,
    position: "horizontal",
  },
  {
    type: "patrolboat horizontal",
    shipLocation: [],
    length: 2,
    position: "horizontal",
  },
];

fetching();

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

function loadJsonData() {
  $.getJSON("/api/game_view/" + gpId, function (data_json) {
    var data = data_json;
  });
}

function fetching() {
  const site = "/api/game_view/" + gpId;
  fetch(site, {
    method: "GET",
  })
    .then(function (res) {
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

      checkPlayer(gpId);

      gameStatus();
      empty();

      markShipLocations();
      karavia();
      playerSalvos();
      getTurn();
      bingoSalvos(shipLocations);
      bingoOpponentsSalvo();
      PostObject();
      displayMessages();
      checkNewMessage();
      refresh();
    })
    .catch(function (error) {
      console.log(error);
    });
}
salvos();
//PostObject();

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

function crosshair() {
  let cells = document
    .getElementById("opponentTable")
    .getElementsByTagName("td");
  for (i = 0; i < cells.length; i++) {
    cells[i].setAttribute("class", "crosshair");
  }
}
//check player & opponent
var player = "";
var opponent = "";

function checkPlayer(gpId) {
  var gamePlayers = games.gamePlayers;

  for (i = 0; i < gamePlayers.length; i++) {
    if (gamePlayers.length > 1) {
      if (gamePlayers[i].id == gpId) {
        player = gamePlayers[i].player.name;
      } else {
        opponent = gamePlayers[i].player.name;
      }
    } else {
      player = gamePlayers[i].player.name;
      opponent = "waiting for opponent";
    }

    document.getElementById("player").innerHTML = player;
    document.getElementById("opponent").innerHTML = opponent;
  }
}

function refresh() {
  setTimeout(() => {
    listData = [];
    chat = "";
    fetching();
  }, 10000);
}

var shipLocations = [];

function markShipLocations() {
  var cells = document.getElementById("playerTable").getElementsByTagName("td");
  if (games.ships.length > 0) {
    for (i = 0; i < games.ships.length; i++) {
      for (y = 0; y < games.ships[i].locations.length; y++) {
        shipLocations.push(games.ships[i].locations[y]);
      }
    }

    for (z = 0; z < cells.length; z++) {
      for (j = 0; j < shipLocations.length; j++) {
        if (cells[z].id == shipLocations[j]) {
          cells[z].classList.add("marked");
        }
      }
    }
  }
}

function empty() {
  var cells = document.getElementById("playerTable").getElementsByTagName("td");
  for (i = 0; i < cells.length; i++) {
    // give name to the classes for the drag n drop
    cells[i].setAttribute("class", "empty");
  }
}

// -------------    SALVOS   -----------------

var salvoLocations = [];
var counter = 0;

function salvos() {
  var cells = document
    .getElementById("opponentTable")
    .getElementsByTagName("td");
  var node = document.getElementsByClassName("salvo");
  textContent = node.textContent;

  for (i = 0; i < cells.length; i++) {
    let keli = cells[i];
    keli.addEventListener("click", function () {
      let type = keli.getAttribute("class");
      let location = keli.getAttribute("id");
      console.log(games.gameStatus);
      if (
        type == "crosshair" &&
        this.textContent == "" &&
        games.gameStatus == "shooting"
      ) {
        counter++;

        if (counter > 5) {
          alert("you can only fire 5 salvos at one turn");
          counter--;
        } else {
          keli.setAttribute("class", "torpedo");
          salvoLocations.push(location);
        }
      } else if (type == "torpedo" && this.textContent == "") {
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

function postSalvos() {
  let param = paramObj(url);
  console.log("param in post salvos", param);
  console.log(salvoLocations);
  if (salvoLocations.length == 5) {
    let salvoData = {
      turnNumber: "",
      salvoLocation: salvoLocations,
    };
    fetch("/api/games/players/" + param + "/salvos", {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(salvoData),
    })
      .then((response) => {
        if (response.status == 201) {
          return response.json();
        }
      })
      .then((data) => {
        salvoLocations = [];
        counter = 0;
        fetching();
        listData = [];
      })
      .catch((error) => {
        console.log("Request failure: ", error);
      });
  } else {
    alert("You have more Salvos to shoot");
  }
}

function playerSalvos() {
  var cells = document
    .getElementById("opponentTable")
    .getElementsByTagName("td");

  for (i = 0; i < games.salvos.length; i++) {
    for (y = 0; y < games.salvos[i].locations.length; y++) {
      for (z = 0; z < cells.length; z++) {
        if (games.salvos[i].locations[y] == cells[z].id) {
          cells[z].innerHTML = games.salvos[i].turn;
          cells[z].style.color = "red";
          cells[z].classList.remove("torpedo");
          cells[z].setAttribute("class", "salvo");
        }
      }
    }
  }
}

function bingoSalvos(shipLocations) {
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
          if (cells[z].id == opponents[i].locations[y]) {
            if (shipLocations.includes(cells[z].id)) {
              //cells[z].innerHTML = opponents[i].turn;
              //cells[z].innerHTML = "X";
              cells[z].style.color = "white";
              cells[z].classList.add("bingoSalvoPlayer");
            }
          }
        }
      }
    }
  }
}

function bingoOpponentsSalvo() {
  var cells = document
    .getElementById("opponentTable")
    .getElementsByTagName("td");
  if (games.hits != null) {
    var hits = games.hits;

    for (j = 0; j < hits.length; j++) {
      for (i = 0; i < cells.length; i++) {
        if (cells[i].id == hits[j]) {
          cells[i].setAttribute("class", "bingoSalvoOpponent");
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

    var firstCell = event.target.id;
    console.log(firstCell);
    var splitNumber = parseInt(event.target.id.slice(1));
    var splitLetter = event.target.id.slice(0, 1);
    indexOfLetter = rows.indexOf(splitLetter);

    console.log(indexOfLetter);
    shipType = draggableElement.className;
    var shipId = draggableElement.id;
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
          }
          console.log(event.target);
          console.log(dragged);
        }
        previousLocations = actualShips[i].shipLocation;
        actualShips[i].shipLocation = locations;
        event.target.style.background = "";
        var position = actualShips[i].position;
        console.log(position);

        if (position == "horizontal") {
          if (
            event.target.className == "empty" &&
            splitNumber + actualShips[i].length <= 11 &&
            checkShipsPositions(shipType) == false
          ) {
            dragged.parentNode.removeChild(dragged);
            event.target.appendChild(dragged);
          } else {
            alert("invalid position");
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
    if (
      draggableElement.classList.contains("vertical") &&
      event.target.className == "empty"
    ) {
      console.log(splitLetter);
      console.log(splitNumber);
      let letterInCharCode = splitLetter.charCodeAt();
      let strlet = String.fromCharCode(letterInCharCode);
      console.log(strlet);
      for (i = 0; i < actualShips.length; i++) {
        if (actualShips[i].type.includes(shipId)) {
          let locations = [];

          actualShips[i].position = "vertical";

          for (j = 0; j < actualShips[i].length; j++) {
            finalShipLocations =
              String.fromCharCode(letterInCharCode + j) + splitNumber;

            if (indexOfLetter + actualShips[i].length <= 11) {
              actualShips[i].position = "vertical";

              locations.push(finalShipLocations);
            }
          }
          previousLocations = actualShips[i].shipLocation;
          actualShips[i].shipLocation = locations;
          console.log(previousLocations);
          console.log(actualShips[i].shipLocation);

          if (
            indexOfLetter + actualShips[i].length <= 11 &&
            checkShipsPositionsVertical(shipId) == false
          ) {
            dragged.parentNode.removeChild(dragged);
            event.target.appendChild(dragged);
            event.target.style.background = "";
          } else {
            alert("invalid position");
            event.target.style.background = "";
            for (i = 0; i < actualShips.length; i++) {
              //when the ship is found
              if (actualShips[i].type.includes(shipId)) {
                actualShips[i].shipLocation = previousLocations;
              }
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

function checkShipsPositionsVertical(shipId) {
  let duplicate = false;
  for (i = 0; i < actualShips.length; i++) {
    if (actualShips[i].type.includes(shipId)) {
      for (p = 0; p < actualShips[i].shipLocation.length; p++) {
        let checkedLocation = actualShips[i].shipLocation[p];
        console.log(checkedLocation);
        for (y = 0; y < actualShips.length; y++) {
          if (!actualShips[y].type.includes(shipId)) {
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

  var shipType1 = shipId + " horizontal";
  console.log(shipId);
  let previousLocations = [];
  for (i = 0; i < actualShips.length; i++) {
    let ship = actualShips[i];

    if (ship.type == shipType1 && ship.shipLocation.length !== 0) {
      let locations = [];
      let firstCell = ship.shipLocation[0];
      var number = parseInt(firstCell.slice(1));
      console.log(firstCell);
      let letter = firstCell.slice(0, 1);
      for (j = 0; j < actualShips[i].length; j++) {
        let finalShipLocations = letter + (number + j);
        console.log(finalShipLocations);

        if (
          finalShipLocations != isNaN() &&
          number + actualShips[i].length <= 11
        ) {
          locations.push(finalShipLocations);
        }
      }
      previousLocations = actualShips[i].shipLocation;
      actualShips[i].shipLocation = locations;
      console.log(previousLocations);
      console.log(actualShips[i].shipLocation);
      event.target.style.background = "";
      actualShips[i].position = "horizontal";
      console.log(actualShips[i].position);
      if (
        element.classList.contains("horizontal") ||
        (element.classList.contains("vertical") &&
          number + actualShips[i].length <= 11 &&
          checkShipsPositionsVertical(shipId) == false)
      ) {
        console.log(number);
        element.classList.remove("vertical");
        element.classList.add("horizontal");

        element.style.marginLeft = "0px";
        element.style.marginTop = "0px";
        //actualShips[i].position = "horizontal";
      } else {
        alert("invalid position");
        for (i = 0; i < actualShips.length; i++) {
          //when the ship is found
          if (shipType1 == actualShips[i].type) {
            actualShips[i].shipLocation = previousLocations;
            actualShips[i].position = "vertical";
            console.log(actualShips[i].position);
          }
        }
      }
    }
  }

  let locations = [];
  for (i = 0; i < actualShips.length; i++) {
    let ship = actualShips[i];
    if (ship.type == shipType && ship.shipLocation.length !== 0) {
      let firstCell = ship.shipLocation[0];
      console.log(firstCell);
      let number = firstCell.slice(1);
      let letter = firstCell.slice(0, 1);
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
          actualShips[i].position = "vertical";

          console.log(actualShips[i].position);
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
        alert("invalid position");
        element.classList.remove("vertical");
        element.classList.add("horizontal");
        element.style.marginLeft = "0px";
        element.style.marginTop = "0px";

        for (i = 0; i < actualShips.length; i++) {
          //when the ship is found
          if (shipType == actualShips[i].type) {
            actualShips[i].shipLocation = previousLocations;
            actualShips[i].position = "horizontal";
            console.log(actualShips[i].position);
          }
        }
      }
    }
  }
}

function karavia() {
  let cells = document.getElementById("playerTable").getElementsByTagName("td");
  let ships = games.ships;

  for (i = 0; i < ships.length; i++) {
    let image = document.querySelectorAll(
      "[data-type='" + ships[i].type + "']"
    );

    let type = ships[i].type;
    let firstCell = ships[i].locations[0];
    let position = ships[i].position;
    for (j = 0; j < cells.length; j++) {
      if (cells[j].id == firstCell) {
        cells[j].appendChild(image[0]);
        image[0].setAttribute("draggable", "false");
        image[0].setAttribute("class", type);

        if (position == "vertical") {
          image[0].style.transform = "rotate(90deg)";
          switch (
            type //positioning the vertical
          ) {
            case "patrolboat horizontal":
              image[0].style.marginLeft = "-17px";
              image[0].style.marginTop = "17px";
              break;
            case "submarine horizontal":
              image[0].style.marginLeft = "-35px";
              image[0].style.marginTop = "35px";
              break;
            case "destroyer horizontal":
              image[0].style.marginLeft = "-35px";
              image[0].style.marginTop = "35px";
              break;
            case "battleship horizontal":
              image[0].style.marginLeft = "-52px";
              image[0].style.marginTop = "52px";
              break;
            case "aircraft horizontal":
              image[0].style.marginLeft = "-70px";
              image[0].style.marginTop = "70px";
              break;
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
        "Content-Type": "application/json",
      },
      body: JSON.stringify(actualShips),
    })
      .then((response) => {
        if (response.status == 201) {
          return response.json();
        } else {
          alert("Your ships are already placed!");
        }
      })
      .then((data) => {
        //window.location.reload();
        // alert("Your ships are successfully placed!");

        fetching();
        listData = [];
      });
  } else {
    alert("Place the rest of the ships!");
  }
}

function gameStatus() {
  if (games.gameStatus == "waiting for opponent") {
    document.getElementById("text").innerHTML = "WAIT FOR OPPONENT";
    document.getElementById("text").style.display = "block";
    document.getElementById("sendShips").style.display = "none";
    document.getElementById("sendSalvos").style.display = "none";
  }
  if (games.gameStatus == "firstPlayersShips") {
    document.getElementById("sendShips").style.display = "block";
    document.getElementById("sendSalvos").style.display = "none";
    document.getElementById("text").innerHTML =
      "PLACE YOUR SHIPS ON THE GRID (double click: vertical positions)";
    document.getElementById("text").style.display = "block";
  } else if (
    games.gameStatus == "waiting opponents ships" &&
    games.opponentHasShips == false
  ) {
    document.getElementById("sendShips").style.display = "none";
    document.getElementById("sendSalvos").style.display = "none";
    document.getElementById("text").innerHTML =
      "WAIT FOR OPPONENT TO PLACE THE SHIPS";
    document.getElementById("text").style.display = "block";
  }
  if (
    games.gameStatus == "secondsPlayersShips" &&
    games.opponentHasShips == false
  ) {
    document.getElementById("sendShips").style.display = "none";
    document.getElementById("sendSalvos").style.display = "none";
    document.getElementById("text").innerHTML =
      "WAIT FOR OPPONENT TO PLACE THE SHIPS";
    document.getElementById("text").style.display = "block";
  } else if (
    games.gameStatus == "secondsPlayersShips" &&
    games.opponentHasShips == true
  ) {
    document.getElementById("sendShips").style.display = "block";
    document.getElementById("sendSalvos").style.display = "none";
    document.getElementById("text").innerHTML =
      "PLACE YOUR SHIPS ON THE GRID (double click: vertical positions)";
    document.getElementById("text").style.display = "block";
  }

  if (games.gameStatus == "shooting") {
    document.getElementById("sendShips").style.display = "none";
    document.getElementById("sendSalvos").style.display = "block";
    document.getElementById("text").innerHTML =
      "CHOOSE FIVE LOCATIONS ON OPPONENTS GRID";
    document.getElementById("text").style.display = "block";
  } else if (
    games.gameStatus == "waiting" &&
    games.playerHasShips == true &&
    games.opponentHasShips == true
  ) {
    document.getElementById("sendShips").style.display = "none";
    document.getElementById("sendSalvos").style.display = "none";
    document.getElementById("text").innerHTML = "WAIT FOR OPPONENT TO PLAY";
    document.getElementById("text").style.display = "block";
  }

  if (games.gameStatus == "player wins") {
    document.getElementById("text").innerHTML = "You Won";
    document.getElementById("text").style.display = "block";
    document.getElementById("over").innerHTML = "Game Over";
    document.getElementById("over").style.display = "block";
    document.getElementById("sendShips").style.display = "none";
    document.getElementById("sendSalvos").style.display = "none";
  } else if (games.gameStatus == "opponent wins") {
    document.getElementById("text").innerHTML = "You Lost";
    document.getElementById("text").style.display = "block";
    document.getElementById("over").innerHTML = "Game Over";
    document.getElementById("over").style.display = "block";
    document.getElementById("sendShips").style.display = "none";
    document.getElementById("sendSalvos").style.display = "none";
  } else if (games.gameStatus == "tie") {
    document.getElementById("text").innerHTML = "TIE";
    document.getElementById("text").style.display = "block";
    document.getElementById("over").innerHTML = "Game Over";
    document.getElementById("over").style.display = "block";
    document.getElementById("sendShips").style.display = "none";
    document.getElementById("sendSalvos").style.display = "none";
  }
}

function logOut() {
  fetch("https://salvo-ship-game.herokuapp.com/api/logout", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
  })
    .then(function (response) {
      console.log("logged out", response);
      return response.status;
    })
    .then((status) => {
      if (status == 200) {
        window.location.href = "games.html";
      } else {
        alert("something went wrong");
      }
    })
    .catch((error) => console.log(error));
}

function getTurn() {
  let turn;
  if (games.salvos.length == 0) {
    turn = 1;
  } else if (games.salvos.length > 0) {
    turn = games.salvos.length + 1;
  }
  document.getElementById("getTurn").innerHTML = turn;
}

function postComments() {
  let param = paramObj(url);
  console.log("post", param);
  let comments = document.getElementById("message").value;

  console.log(comments);
  //let name = games.gamePlayers[0].player.name;
  var postData = {
    name: name,
    date: new Date(),
    comment: comments,
  };

  console.log(postData);
  fetch("/api/games/players/" + param + "/posts", {
    method: "POST",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postData),
  })
    .then((response) => {
      if (response.status == 201) {
        return response.json();
      }
    })
    .then((data) => {
      fetching();

      setTimeout(() => {
        scrollToBottom();
      }, 500);
      listData = [];
    })
    .catch((error) => {
      console.log("Request failure: ", error);
    });
}
var listData = [];

function PostObject() {
  var posts = games.posts;

  console.log("posts", posts);

  for (j = 0; j < posts.length; j++) {
    for (i = 0; i < posts[j].length; i++) {
      var obj = {
        player_id: "",
        name: "",
        date: "",
        comment: "",
      };
      obj.player_id = posts[j][i]["player_id"];
      obj.name = posts[j][i]["name"];
      obj.date = posts[j][i]["created"];
      obj.comment = posts[j][i]["comment"];
      listData.push(obj);
    }
  }
  listData.sort(function (obj1, obj2) {
    return obj1.date - obj2.date;
  });
  console.log("listData", listData);
}
//chat = "";

function displayMessages() {
  let param = paramObj(url);
  console.log("param in messages", param);
  var chat = document.getElementById("posts");
  chat.innerHTML = "";
  console.log(chat);
  console.log(listData);

  if (listData.length > 0) {
    for (i = 0; i < listData.length; i++) {
      let date = new Date(listData[i].date);
      console.log(date.toLocaleString());
      if (listData[i].player_id == param) {
        chat.innerHTML += `
    <div class="msg left-msg">
        <div class="msg-img" style="background-image: url(https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSPBcCqkGlEgCXsxd5mqDjNoDt0vJqk9jZxhhSBomng4rUmtoDw&usqp=CAU);">
        </div>

          <div class="msg-bubble">
            <div class="msg-info">
              <div class = "msg-info-name" >${listData[i].name}</div>
              <div class = "msg-info-time" >${date.toLocaleString()}</div>
            </div>
            <div class = "msg-text">${listData[i].comment}</div>
          </div>
    </div>`;
      } else {
        chat.innerHTML += `
      <div class="msg right-msg">
          <div class = "msg-img" style = "background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARQAAAC3CAMAAADkUVG/AAAAilBMVEX///8AAABxcXHp6em9vb3R0dHAwMD8/Pzx8fH39/fu7u76+vqJiYnMzMyampri4uKqqqpYWFjk5OSdnZ1AQEAoKCiQkJA5OTk0NDR+fn61tbVnZ2fOzs7b29vFxcVsbGykpKRXV1evr68dHR13d3dPT08MDAwZGRmLi4tEREQkJCQTExMcHBwtLS3N1/bsAAAQpUlEQVR4nN1d6WKyOhAVWQQXBBcUFESLrbaf7/96l50kJCyTKHrPn6ognRyTyWxJRqM3gCPF2NvjeXgJ/KUxtDhvAXsnSf+sW3TefUsZtveD61jacaXPhhZuGEy245EkfRXvZH/hhc7Y3uf8SH8xQeZFUZfTQcV8KaaSNYpJ+aNcMmQ/8MJ5ZD9Kgq4xQZam+sbk5YK+EL6kjhJSvlvuM6Z+oKwdZIj9btz/ad9RJD35E7exx5fyIRZ9SdH/UeWY9+xvP1IKRJJ0FyrOW2Ac5S9iUgBKYixJ9lyoQG+Au1W8ikkBWCcxKatdIFKiwWFsj+VrMCn+TPo/advVv1X1JiZF7/+ImJTjaEGbzD8Uxwc6cYBJiQfPfCxMqIFxOWNvY1IAoyAmRYv/7D0xMg2Nm4u/B5OixH8MSRYi1MA4rIkPYlJW1DsbEZOSdpIjxMh5N2wU8pOYFL//cwpSRjebW6aBoX/V2w8m5ZK92lvNd747lv8o2iMmRe3/qJiUMHtlQDh9HwRbmg8Xk7Lo/6yYlEI5HSFuwrvAontwUmpx9EVMilm8vn2ua+ge6J9LmcXREzEpt/LNzmy4853B9GnBpFQPNCBa6Q3wCFlXpMwM64mYFMQIPEJ8yqGhN7RbKiyOXsBJGTn7/o8YGH5T945JAVgaMSkR+n73aRGnQFo2XJVKi6MGne3YxKRgHrIBmcIGRNjs8EmVxVFCVz3ztCE6A4aYFHw2O35UxMltUYISYnGMpr7ijHdFqqdB2cSk4BGIkfMPfTcNzOv7Kl/70WJvZqTovmeOy8ygdP9NM6jsb8WkXImPNnm/0gPzkD7kXXMgsz0peg1Jfv0uVbg6WmBmnaXB/I9J2dSe5Bk5H4/xhnL9TTCVGGZsjpXnPio6fg9moI9Gyjl/39SqmBRsFp5qt2uWPzybqm/+YoPyreBLLvPaRF3bFR8b9+Knvf04rj5s8hPj2x7lk8JD8ZUkm6rm797TedYkhvEwVeYbZMCU1C1v6KeN9tg40zhxVyvV8iH079LC+srftmWoh0FI7Se+dfopxLZNTU50ipNcMKydhKHR+I8k6QvpauNLagqtKEy/FVyJzD8YgXPNJd6Ow2M+Y2akBAeJRMOzl1alir5cL7Px5PUe/TogSPN02PiUufKivB33uecjk6WR/M7YsMnB0pOyV6md3VzLTTZ5TfSzNwxoz3bSV2GflCr155AMFwyUDlKAZuIbivtb3vC9KKyzOiOkvfsOkL+rRlmFmPYRv8m37FpTKtTsm8niVgyP3TwhM68KI0ZNgbfLkqkSoiZDRNKNG2qL4yJQTPdOawmzUapZaKOzmSqjcUYKrY9keDdPSJFQF3bDkLoFleOyDPMe9R1dyrRZPPtsdSYj72fOmhJa27diyt2IfPTI3inj42oG05GxVDVrPT/ZbDIK1BzvYRElMlXqw4SREibfnReG2P5wuD4a7yfxXuZsOvZP1fstjJTUFuvHA4q3KlwxsnZUCgE4enIrYw1m5Y3C+zkFyIC2mmVnIc+aN83ZjbhDCoGeg2MuEvIR2zhrRG7OQjmRHPVnEAbquOQSXZDPgI3K0mPQsZeI4JzoQr4YTiER8tkS2Khs8vDApMSz3/VCF/OlOBUCoSYCtFmZRnDBpCST1/DT8qQy29FA9RzYqOwZ7TYaC4mRvxq6REOvnFcsuHMGNir98gTMSRbI93YDMFHBR+TBOi20UbWn9kTWR6Ihc6kBIs4Du8JFCtDGSZBHsbaAIg9BwITHPDHwnJr+0uP2+1jIAwfDldniyhSriQUPgLQtv+33sVBk9NWBopK4zYpnOgOGzK1Ios46nJPKSzeHKLOdEDGkG3YVbH0lgxDMqIQa1efXR1amf4Q0eBz2QpW4A5KKAmAkJgUy7bzcYa7rDPw6fP6YwW2cBEgRqfziejitSRg+Ui4cLnICxJhVfl/JCSUEhKsU+PCRfjlc5AToMHZfuFSK5q4R+V+4mysp9W7YB5gt+3hZEogaFSMq/jga9sNhuklEkNZorEQUB4OaliP9Ug7vhRdHXI5XOMzyN1WSB3Ebn17gAp5LDl+wpkFlSFIzH1/KAw48cm3fSNFEg6k/a676K1kgQK7ffHLxMdvUrJnU55dxUAfeVeTnptwjthy1qQ8ajhQBwjrRnukwXxvkqHVRDkOFH0Tgev40h9lozO/WfK8Bp596eeUufA4nLXmcuo1En7pfBKJsbvacpMeiRYp68I/PLuUFQYL/DIe51b+rk6K8ou1M/COksUjrkh9OqxB1UowXNL0BZI3kgb2CCIYOBQSU2DmommK7FaWLyGrcb6EO86StnDEBhZTu4+fnenDDi+aZ89P+q/32jiCCGVPIFhwsTDuJSfPQ2XdvTu76ovmJMWgnGlBXLbSSVFBnIcyEQJzD3DEGQIsR04zaq6P45USQqKqrFaFpgY1rRndRI4j4pZzWZVkd0TXbQHO6ZOKe3RqdKA3Vwsel7WiyoZ0kgSAG9d0RwknY/o8zUFejoA38Myu3TF+sD2hv2EWWGncfwwNXujGB+YYTIQs8unt1Ie3rlan/KEibBqb9g35xE2T6Tw676PMadtfT3DFDy1MULYYSw/PW7rVQhLjDvBTgMPeo5aNHcgqrNp0NZcU5I2SM14tE0ab2xKqhrJyB74Op+OSq0skqsOY2WsBLlEpeeFeNzfoISs8lZEnh8UxWbqWL/Xd2L8fsB0sW+5xGvgPJp4fYP5oma7yrrrZxL2qyxCMkBRqN+Ra+yD8NItXAWCbgpizk9+yTHxf1QRJSHn0Ls/dzhJSZHFg3Gwml391wkTCupD49xVD44dnIqWc4nlH9XSil6KJSRnND0IqFsZ/76/MgdM9oPvseZXQksLILtLGiczjMvd05uhdaaur94RYqC9VfyvLSVxdeOLf7267pdl2rWkx041oLZPKVy39KdXcW4PXt/Uvj6fyLnGPd5Ui+nDDDrhgsCLRzdZm+atUBVgkCylip7taUk4cKG89XsAjN1SLpiKHigjOq9K+gNbqQ35c6J3MUmrho4nUTuYXav8+zh4a1f3Ykf8qv2i05ALseMfKiLaD6FRy1a8fRuXydD5mzoySGXjYF4DmVJW2pJrNDLHtXCZIeS1dQHsUTvMaiVN+HdVAOFoKUxEamP4IdQPF6Jj1YedFWUGwCjnLYpOOlM+DfwQzi33UyMXLMMglNw1945rjJN2iIn0Rn9jUah1BQlk4Al/wkSLp+GiznCCM0tXPbYzsRDs1IMfTJWsEesPg4TdDYGQyicLEBPGmJuvnIUw6r8Ee+m4MnatdldU150XbUhjBYPUlpjTGHRkrRMu+azBkbhQ5cM1ug5mnxpJNjAxlkGSBoK+yyOyyrg65vK1FzynlqhH1+eVpzgrS5AUdbXrQDyGB5ewqNDX9E21mlD8gcYR2rNocZXvdagQxewxcCJtkBXmk6lF8ozQ4z8rNs7djJD46qugiUNR7bawHpqQPCJSUC7p7bxetzm7bQKMLuV/NY427iW13TDgJJ4U91hB1IGe2Zy+ryvKitsDuTv+4SaycSCDwVXjz6KEOn1LHB2jt5mviyP2GbLTO1WnkhjFqe2Ycf3VI8Kt1hTpzOfbdliKu23w+/vXMm7SnoGIoNaS5SEKvWHoWmSmN3wY1IvoUHvOhaY2DXp6mQ6t42wW/w0/BI04D1+VKP/apqNcAuZE/BFXtmwAbosLVMnWP2MlEyYQMzzitWb8E9U05nig/dW6OhDvNs/wfON/vnDqIMWiDZozHzqkpQlri2SThSi40x60CE7wBGn7YU+0HHMzTvShhamzGeB6267pMHnOU/piJg67wJxeXDlBZHPJIbvfar8tPoy1r6FVEWt6xthYjN+kMu5ehXC2lJk0RaQTt/1cYQGvAa0lLpWVxwttPd2QEnptBgENMz5gANOH46m+krzRw/ki6eVhX8CqKFqKBEDTj4xn7c6GCoL7X1qZxDY1U7TVONW0G0YJETtKvwZDk40bQB0STuHSciMJ6GdBdpHl8QLUf08WhXEVoW2wuM4raEDpqFVbhtWd8WNIiQzoKmDrhj8mDUCs6wwVJDOdr0TEeK6S2LKuuLTkDi64W7Ap1ea4Ol6W41qyARQ0vp6qARhOG6SjX9+O2FnnjQIw+PCRlE5TSEJq/pWuXn4Hj+NC3/0kfTlap5luOOr/svcUsPS4+9S1iUmKuM/AcW0Vtmuc2CrvasR1XO5iLvrGmBEB6DWWoX5yxk0U/uhumdyttrkVr/IY6WvNS0In4pYw7SzkQsTSNNwS9U5RLOo8OmsvTEBGKmiEBtoISviwS/gEFkZJq18FEx38i+yKOpf/RC0z1c8Xq4n90hmq895biUE4NBiHpOMv5dQzrUUx2KGVVAb0mLDVwKJ/+uRQ94nA+uGSrHNLQd6EbNNxXiSW66aNgGUuIxVCxP4KdFT+pcljVOEPzsryfXsbwLSx4x63d7UMsqlyz9Xf5BdMnUXLcjFmjuOrREEwxmDemsVIncvUU/xyO647ET2wRkWdGzGs9CQ2Htspy+uHvLXOpXLEaEP3jKOCBorDauBjNfb+nd/4niMJ7tIyForgWbVNqJg5ZZrxVUCUinVmiT29FWQLqq+j14EAE27iae8OKcUXtDtcoBgfUWSO0psdxbQA1eH3RJqCM1FwBagPW4uygMKoUnprFd0akqXT5XX/jqR0unDSPYKNJp7FqYv1t6zY896/U8Gts7Af5jxzqDANGVfXqLzrHIJ0WeeWXMX6lHmboH2H819OlSXQSeE8EO5eq8HSkah+hMC0/teYYi7kBxCs+XrCIgNRywfzuRj97atffQnEr3/b2mqFzdBpGIOrd8eiRV7Ukr/caqp+i+Fs4P8FMqCvQ53n6BjoX23rICHiiHowgNImHV7a2weI2pv9BSe3ftUk4T25/noKO1+p2qhaWzWmgRlTrOCShq5h6Rogae6Y7PD+bouJ8cK8iWx8P0fC9SiLTo95qVg56JqxDNB3iHTNrWdteeijsusNUffbc8U/HooO1RePF5yqtryLpKbVXz1+5+PrmOaaVd8ujTfx/Y7Ne/pousiN056PmtsuIK3v4v0yr67hBTsA49TfWXUzQ6V5+SKwCPwQHsgGBQXJGHfYqik827VomKlpKB+pRcARifAlVE+k9pPAstk0ETKcCSZuDRNy+tKm9eFdlECnDxFGxblaW4bem6oDHq00QKMGcE2tjr1ftjbluFoV+C5q4hmyi+vqSvaQPMBlKgwd3+lMz4VizD0BD3YZMCLZ3qP3qWw+xCzJ4l2aRAK6d614pynArIB+ahRUxSoEuMABudTXvH5gWB1VdYpIDr3iFnRsE23xEAhvXAIAXMCXDlxhCaNgF9PwI6KfDledBNjTk3M4GDZn/TSNE5qlOBnLw+u1tiU9csdVJkrkXQYFK49nPgw9eaWJJBhA78NVcYtMdORHXw7vLCg9/IWshpxZOhrxZpt/A8TbmsnRNn1NrkXOIz7ELjp4CXkpGIpM57gWvglBiufvoJEHbATe1I0w+GuGOzZkMZt+IhjJPRcMataIg94nMw41YsBB86N5hxKxSiT1Medg8dQRB+xPSQxq0oiD93+39g3D7hMPLPN26fcUL7xxu3Tzm2Xv9w4/YppAwXuRWD55Dy4cbts0j5aOP2aaR8snH7PFI+2Lh9Iimfa9w+k5SXL+ISBZKU/wDp2QpVBMWRhAAAAABJRU5ErkJggg==);" >
        </div>

        <div class = "msg-bubble">
        <div class = "msg-info">
        <div class = "msg-info-name" >${listData[i].name} </div> 
        <div class = "msg-info-time" >${date.toLocaleString()}</div> 
        </div> 
        <div class = "msg-text">${listData[i].comment}</div> 
        </div>
        </div>`;
      }
    }
  }
}

var length1 = 0;
var checkLength = [];

function checkNewMessage() {
  length = listData.length;
  if (length > length1) {
    checkLength.push(length);
    length1 = length;
    scrollToBottom();
    mySound.play();
  }
  console.log(checkLength);
  checkLength = [];
}

function scrollToBottom() {
  let box = document.querySelector(".msger-chat");
  box.scrollTop = box.scrollHeight;
}

var input = document.getElementById("message");
input.addEventListener("keyup", function (event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    document.getElementById("postButton").click();
  }
});

var mySound;

function soundNewMessage() {
  mySound = new sound("audio/clearly.mp3");
}

function sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function () {
    this.sound.play();
  };
  this.stop = function () {
    this.sound.pause();
  };
}
