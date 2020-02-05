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
    })
    .catch(function (error) {
      console.log(error);
    })
}

function createList(){
games.forEach(game=>{
var date = new Date(game.created);
let testList = document.createElement("li")
testList.innerHTML= ` ${game.id}, ${date.toLocaleString()}, ${game.gamePlayers[0].player.email} vs ${game.gamePlayers[1].player.email} `
output.appendChild(testList);
})

}
