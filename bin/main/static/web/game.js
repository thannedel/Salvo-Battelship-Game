< !DOCTYPE html >
  <
  html lang = "en" >

  <
  head >
  <
  meta charset = "UTF-8" / >
  <
  script src = "https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js" > < /script> <
  link href = "https://fonts.googleapis.com/css?family=Open+Sans"
rel = "stylesheet" / >
  <
  link href = "https://fonts.googleapis.com/css?family=Quicksand"
rel = "stylesheet" / >
  <
  link href = "fonts/PressStart2P-Regular.ttf"
rel = "stylesheet" / >

  <
  link rel = "stylesheet"
href = "css/styles.css" / >
  <
  title > Ship Locations! < /title> <
  /head>

  <
  body >
  <
  div class = "header" >
  <
  !-- < p class = "logo" > BATTLESHIP < /p> --> <
  button type = "button"
id = "logoutButton"
onclick = "logOut()" >
  Log Out <
  /button> <
  /div>

  <
  div class = "table" >
  <
  div class = "ships" >
  <
  div class = "shipHeader" > Ships < /div> <
  div >
  <
  img id = "aircraft"
src = "img/aircraftabove.png"
class = "aircraft horizontal"
data - type = "aircraft horizontal"
draggable = "true"
ondragstart = "drag(event)"
ondblclick = "vertical(this)" / >
  <
  /div> <
  div >
  <
  img id = "battleship"
src = "img/battleship.png"
class = "battleship horizontal"
data - type = "battleship horizontal"
ondragstart = "drag(event)"
ondblclick = "vertical(this)" / >
  <
  /div> <
  div >
  <
  img id = "submarine"
src = "img/submarine.png"
class = "submarine horizontal"
data - type = "submarine horizontal"
draggable = "true"
ondragstart = "drag(event)"
ondblclick = "vertical(this)" / >
  <
  /div> <
  div >
  <
  img id = "destroyer"
src = "img/destroyer.png"
class = "destroyer horizontal"
data - type = "destroyer horizontal"
draggable = "true"
ondragstart = "drag(event)"
ondblclick = "vertical(this)" / >
  <
  /div> <
  div >
  <
  img id = "patrolboat"
src = "img/patrolboat.png"
class = "patrolboat horizontal"
data - type = "patrolboat horizontal"
draggable = "true"
ondragstart = "drag(event)"
ondblclick = "vertical(this)" / >
  <
  /div> <
  /div> <
  div id = "playerTable"
class = "playerTable" >
  <
  div id = "player" > < /div> <
  /div>

  <
  div class = "vs" >
  <
  h4 > vs < /h4> <
  div class = "turn" >
  <
  h3 > TURN: < /h3> <
  h3 id = "getTurn" > < /h3> <
  /div> <
  p id = "text" > < /p> <
  p id = "over" > < /p> <
  /div>

  <
  div id = "opponentTable" >
  <
  div id = "opponent" > < /div> <
  /div>

  <
  div class = "gamePannel" >
  <
  button type = "button"
id = "sendShips"
onclick = "postShips()" >
  Confirm Ships <
  /button> <
  button type = "button"
id = "sendSalvos"
onclick = "postSalvos()" >
  Salvo <
  /button> <
  !-- < p id = "text" > < /p> --> <
  /div> <
  /div>

  <
  section class = "chat" >
  <
  div class = "msger" >
  <
  header class = "msger-header" >
  <
  div class = "msger-header-title" >
  <
  i class = "fas fa-comment-alt" > < /i> SimpleChat <
  /div> <
  div class = "msger-header-options" >
  <
  span > < i class = "fas fa-cog" > < /i></span >
  <
  /div> <
  /header>

  <
  main id = "posts"
class = "msger-chat" >

  <
  /main>

  <
  div class = "msger-inputarea" >
  <
  input id = "message"
class = "msger-input"
type = "text"
placeholder = "Enter your message..." / >
  <
  button type = "submit"
class = "msger-send-btn"
onclick = "postComments()" >
  Send post <
  /button> <
  /div> <
  /div> <
  /section> <
  div class = "background" >
  <
  div class = "water" > < /div> <
  /div> <
  svg >
  <
  filter id = "turbulence"
x = "0"
y = "0"
width = "100%"
height = "100%" >
  <
  feTurbulence id = "sea-filter"
numOctaves = "3"
seed = "2"
baseFrequency = "0.02 0.05" > < /feTurbulence> <
  feDisplacementMap scale = "20" in = "SourceGraphic" > < /feDisplacementMap> <
  animate xlink: href = "#sea-filter"
attributeName = "baseFrequency"
dur = "60s"
keyTimes = "0;0.5;1"
values = "0.02 0.06;0.04 0.08;0.02 0.06"
repeatCount = "indefinite" / >
  <
  /filter> <
  /svg>

  <
  script src = "https://code.jquery.com/jquery-2.2.0.js" > < /script>

  <
  script src = "game.js" > < /script> <
  /body>

  <
  /html>