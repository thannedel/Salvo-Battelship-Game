$(function() {

  // display text in the output area
  function showOutput(text) {
    $("#output").text(text);
  }

  // load and display JSON sent by server for /players


  function loadData() {
    $.get("/rest/players")
    .done(function(data) {
      showOutput(JSON.stringify(data, null, 2));
    })
    .fail(function( jqXHR, textStatus ) {
      showOutput( "Failed: " + textStatus );
    });
  }

  // handler for when user clicks add person

  function addPlayer() {
    var name = $("#username").val();
    var pwd = $("#password").val();
    if (name && pwd) {
      //postPlayer(name);
      postPlayer(name, pwd)
    }
  }
function postPlayerPwD(usrname, pwd){
$.post("/api/players", { username: usrname, password: pwd })
}

  // code to post a new player using AJAX
  // on success, reload and display the updated data from the server

  function postPlayer(username, password) {
    $.post({
      headers: {
          'Content-Type': 'application/json'
      },
      dataType: "text",
      url: "api/player",
      data: JSON.stringify({ "username": username , "password": password })

    })
    .done(function( ) {
      showOutput( "Saved -- reloading");
      loadData();
    })
    .fail(function( jqXHR, textStatus ) {
      showOutput( "Failed: " + textStatus );
    });
  }

  $("#add_player").on("click", addPlayer);

  loadData();
});