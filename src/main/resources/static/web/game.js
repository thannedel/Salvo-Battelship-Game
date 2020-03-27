//site = "'http://localhost:8080/api/game_view/1";
var url = window.location.href;
var key_url;
var actualShips = [{
    type: "aircraft horizontal",
    shipLocation: [],
    length: 5,
    position: "horizontal"
  },
  {
    type: "battleship horizontal",
    shipLocation: [],
    length: 4,
    position: "horizontal"
  },
  {
    type: "submarine horizontal",
    shipLocation: [],
    length: 3,
    position: "horizontal"
  },
  {
    type: "destroyer horizontal",
    shipLocation: [],
    length: 3,
    position: "horizontal"
  },
  {
    type: "patrolboat horizontal",
    shipLocation: [],
    length: 2,
    position: "horizontal"
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
      displayShips();
      checkPlayer(param);
      crosshair();
      playerSalvos();
      salvos();
      gameStatus();
      bingoSalvos(shipLocations);
      bingoOpponentsSalvo();
      //markShipLocations()
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



function displayShips() {
  var cells = document.getElementById("playerTable").getElementsByTagName("td");
  let desthor = [];
  let pathor = [];
  let airhor = [];
  let bathor = [];
  let subhor = [];
  let destver = [];
  let patver = [];
  let airver = [];
  let batver = [];
  let subver = [];
  for (i = 0; i < cells.length; i++) {
    // give name to the classes for the drag n drop
    cells[i].setAttribute("class", "empty");
  }

  for (i = 0; i < games.ships.length; i++) {
    type = games.ships[i].type;
    position = games.ships[i].position;
    if (position == "horizontal") {
      switch (type) {
        case "aircraft horizontal":
          airhor.push(games.ships[i].locations[0]);
          break;
        case "battleship horizontal":
          bathor.push(games.ships[i].locations[0]);
          break;
        case "submarine horizontal":
          subhor.push(games.ships[i].locations[0]);
          break;
        case "destroyer horizontal":
          desthor.push(games.ships[i].locations[0]);
          break;
        case "patrolboat horizontal":
          pathor.push(games.ships[i].locations[0]);
          break;
      }
    } else if (position == "vertical") {
      switch (type) {
        case "aircraft horizontal":
          airver.push(games.ships[i].locations[0]);
          break;
        case "battleship horizontal":
          batver.push(games.ships[i].locations[0]);
          break;
        case "submarine horizontal":
          subver.push(games.ships[i].locations[0]);
          break;
        case "destroyer horizontal":
          destver.push(games.ships[i].locations[0]);
          break;
        case "patrolboat horizontal":
          patver.push(games.ships[i].locations[0]);
          break;
      }
    }
  }
  console.log(airver);
  console.log(airhor);




  for (z = 0; z < cells.length; z++) {
    switch (cells[z].id) {
      case pathor[0]:
        cells[z].setAttribute("class", "pathor");
        //document.getElementById("patrolboat").setAttribute("draggable", false);
        document.getElementById("patrolboat").style.display = "none";
        break;
      case subhor[0]:
        cells[z].setAttribute("class", "subhor");
        document.getElementById("submarine").style.display = "none";
        break;
      case airhor[0]:
        cells[z].setAttribute("class", "airhor");
        document.getElementById("aircraft").style.display = "none";
        break;
      case bathor[0]:
        cells[z].setAttribute("class", "bathor");
        document.getElementById("battleship").style.display = "none";
        break;
      case desthor[0]:
        cells[z].setAttribute("class", "desthor");
        document.getElementById("destroyer").style.display = "none";
        break;
      case patver[0]:
        cells[z].setAttribute("class", "patver");
        document.getElementById("patrolboat").style.display = "none";
        break;
      case subver[0]:
        cells[z].setAttribute("class", "subver");
        document.getElementById("submarine").style.display = "none";
        break;
      case airver[0]:
        cells[z].setAttribute("class", "airver");
        document.getElementById("aircraft").style.display = "none";
        break;
      case batver[0]:
        cells[z].setAttribute("class", "batver");
        document.getElementById("battleship").style.display = "none";
        break;
      case destver[0]:
        cells[z].setAttribute("class", "destver");
        document.getElementById("destroyer").style.display = "none";
        break;
    }
  }
}


var shipLocations = [];

/* function markShipLocations() {
  var cells = document.getElementById("playerTable").getElementsByTagName("td");
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

} */

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

            if (cells[z].className.includes("marked")) {
              cells[z].classList.add("bingoSalvo");
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

    var firstCell = event.target.id;
    console.log(firstCell);
    var splitNumber = parseInt(event.target.id.slice(1));
    var splitLetter = event.target.id.slice(0, 1);
    indexOfLetter = rows.indexOf(splitLetter);

    //console.log(splitNumber);
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
        console.log(previousLocations);
        console.log(actualShips[i].shipLocation);
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
      event.target.className == "empty" &&
      checkShipsPositions(shipType) == false
    ) {
      console.log(splitLetter);
      console.log(splitNumber);
      let letterInCharCode = splitLetter.charCodeAt();
      let strlet = String.fromCharCode(letterInCharCode);
      console.log(strlet);
      for (i = 0; i < actualShips.length; i++) {
        if (actualShips[i].type.includes(shipId)) {
          let locations = [];
          // na liso shipType
          actualShips[i].position = "vertical";

          for (j = 0; j < actualShips[i].length; j++) {
            finalShipLocations =
              String.fromCharCode(letterInCharCode + j) + splitNumber;

            if (indexOfLetter + actualShips[i].length <= 11) {
              actualShips[i].position = "vertical";
              console.log(actualShips[i].position);
              locations.push(finalShipLocations);
              console.log(locations);
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
            //event.target.tranform = "rotate(90deg)";
            event.target.style.background = "";
          } else {
            event.target.style.background = "";
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
        element.classList.contains("vertical") &&
        number + actualShips[i].length <= 11 &&
        checkShipsPositionsVertical(shipId) == false
      ) {
        console.log(number)
        element.classList.remove("vertical");
        element.classList.add("horizontal");

        element.style.marginLeft = "0px";
        element.style.marginTop = "0px";
        //actualShips[i].position = "horizontal";
      } else {
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
      let letter = firstCell.slice(0, 1);;
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
          //element.setAttribute("draggable", false);
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
        //element.setAttribute("draggable", true);

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
        // alert("Your ships are successfully placed!");
      });
  } else {
    alert("Place the rest of the ships!");
  }
}

function gameStatus() {
  if (games.playerHasShips == true) {
    document.getElementById("sendShips").style.display = "none";
  }
  if (games.gameStatus == "shooting") {
    document.getElementById("sendSalvos").style.display = "block";
  } else if (
    games.gameStatus == "waiting" ||
    games.gameStatus == "waiting for opponent"
  ) {
    document.getElementById("sendSalvos").style.display = "none";
  } else {
    document.getElementById("sendSalvos").style.display = "block";
  }
}

function saveShips() {
  for (i = 0; i < games.ships.length; i++) {
    games[i].ships[0].setAttribute("class", games[i].type);
  }
}

function bingoOpponentsSalvo() {
  var cells = document
    .getElementById("opponentTable")
    .getElementsByTagName("td");
  if (games.hits != null) {
    var hits = games.hits;
    console.log(hits);
    for (j = 0; j < hits.length; j++) {
      for (i = 0; i < cells.length; i++) {
        if (cells[i].id == hits[j]) {
          cells[i].setAttribute("class", "bingoSalvo");
        }
      }
    }
  }
}


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