var socket = io.connect();

// Query DOM

$( document ).ready(function () {
    $("#jumbo-text").html(socket.id);   
});

var message = document.getElementById('message'),
      handle = document.getElementById('handle'),
      btn = document.getElementById('send'),
      output = document.getElementById('output'),
      feedback = document.getElementById('feedback');

// Emit events
btn.addEventListener('click', function(){
    socket.emit('chat', {
        message: message.value,
        handle: handle.value
    });
    message.value = "";
});

message.addEventListener('keypress', function(event){
    socket.emit('typing', handle.value);
        if (event.keyCode === 13){
                socket.emit('chat', {
            message: message.value,
            handle: handle.value
         });
        message.value = "";
    }
})


// Listen for events
socket.on('chat', function(data){
    feedback.innerHTML = '';
    output.innerHTML += '<p><strong>' + data.handle + ': </strong>' + data.message + '</p>';
});

socket.on('typing', function(data){
    feedback.innerHTML = '<p><em>' + data + ' is currently typing a message...</em></p>';
});


$( document ).ready(function () {
  
    // var today = new Date();
    // console.log(today.getHours());
    // console.log(today.getMinutes());
    // console.log(today.getSeconds());
    console.log("Running index.js");
    
    var alreadyClickedButton = 0;
    
    // var socket = io.connect();

      
    // $( document ).ready(function () {
    //     $("#jumbo-text").html("working");   
    // });

    function errorReport(){
      alert("Follow the instructions. Here, maybe this'll help.")
      window.location.href = "http://www.readingbear.org/";
    }

    const MIN_PLAYERS = 3;
    const MAX_PLAYERS = 8;
    var loc_list = {};
    var role_list = {};
    var paired_roles = [];
    
    var gameInfo = { 
      roomID: -1,
      location: undefined,
      totConnected: 1, //total connected players (1 for host)
      numPlayers: -1,
      numSpies: -1, 
      spy1: -1,
      spy2: -1,
      roles : [],
      players: [],
      connectedPlayers: []
    };

    // 
    // * Returns a random number between min (inclusive) and max (exclusive)
    // 
    function getRandomArbitrary(min, max) {
        return Math.round(Math.random() * (max - min) + min);
    }
    
    function guid() {
      function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
      }
      // return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      //   s4() + '-' + s4() + s4() + s4();
      return s4();
    };
    
    function selectRandomLocation (location_list){
      // console.log(Object.keys(location_list).length);
      var randomInt = getRandomArbitrary(0, Object.keys(location_list).length); //alternatively, can use _random
      console.log(randomInt);
      
      return _.keys(location_list)[randomInt];
    }
    
    //Knuth shuffle
    function shuffle(array) {
      var currentIndex = array.length, temporaryValue, randomIndex;
    
      // While there remain elements to shuffle...
      while (0 !== currentIndex) {
    
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
    
        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }
      return array;
    }
    
    function selectRandomRoles (role_list){
      
    };
    
    function gameSetup(numPlayers, numSpies){
      $.getJSON("locations.json", function(loc_data){
        loc_list = loc_data; //save location object data
        gameInfo.location = selectRandomLocation(loc_list); //
        gameInfo.numPlayers = numPlayers; //
        
        // _.keys(loc_list).forEach(function(element){
        //   $("#location-list").append("<li>" + element + "</li>");
        // });
        
        $.getJSON("roles.json", function(role_data){
          role_list = role_data;
          // console.log(data);
          
          paired_roles = _.pairs(role_list);
          console.log(paired_roles);
          var id = guid();
          
          gameInfo.numSpies = numSpies; //
          gameInfo.roomID = id; //
          
          //0 signifies innocence, 1 signifies being a spy
          var players = [];
          for (var i = 0; i < numPlayers; ++i){
            players[i] = 0;
          };
          
          if (numSpies === 2){
            players[0] = 1;
            players[1] = 1;
          }
          else{
            players[0] = 1;
          }
          shuffle(players);
          
          var found = 0;
          for (var i=0; i < numPlayers; ++i){
            if (players[i] === 1 && found===1){ 
              gameInfo.spy2 = i; //
            }
            if (players[i] === 1 && found===0){
              gameInfo.spy1 = i; //
              found = 1;
            } 
          }
          
          gameInfo.players = players; //
          
          //TO BE IMPLEMENTED: ROLE STUFF
          socket.emit('create_game', gameInfo);
          console.log(gameInfo);
        });
        
        
      });
      

      
    };//end of gameSetup()
    
    
    $("#start-button").click(function(){
      // console.log(this);
      $("#game-form").toggleClass("invis");
      
    });
    
    $("#join-button").click(function(){
      // console.log(this);
     $("#join-form").toggleClass("invis");
    });
    
    $("#join-game-button").click(function(){
      var x = document.querySelector("#id-input");
      var id = x.value;
      
      socket.emit("join_room", id);
    });
    
    $("#create-game-button").click(function(){
      var x = document.querySelector("#player-input");
      var numPlayers, numSpies;
      if (Number(x.value) >= 3 && Number(x.value) <=8){
        numPlayers = Number(x.value);
      }
      else{
        errorReport();
      }
      x = document.querySelector("#spies-input")
      if (x.value == 1 || x.value ==2){
        numSpies = Number(x.value);
      }
      else{
        errorReport();
      }
      
      gameSetup(numPlayers, numSpies);
      
    });
    // console.log(gameInfo);  
});

socket.on("err", function(msg){
  bootbox.alert(msg);  
});

socket.on('made_room', function(data){
    // alert("Received data!" + data.roomID);
    if (data.spy1 === 0 || data.spy2 === 0){
      $("#game-text").html("You are the spy! Sneaky sneaky..");
    }
    else{
      $("#game-text").html("You are not the spy! The location is the " + data.location.toUpperCase() + ". <br>");
    }
    $("#game-text").append("The room ID is " + data.roomID + ". Share this so everyone else can join! <br>")
    $("#game-text").append("Check that everyone knows their role (can ask in chat) and good luck! <br>");
    $("#game-text").append("There are " + data.numPlayers + " players total with " + data.numSpies + " spies.")
});

socket.on("start-game", function(data){
  bootbox.alert("Starting game!");
});

socket.on("show-spy", function(data){
  bootbox.alert("You're the spy!");

});

socket.on("show-innocent", function(data){
  bootbox.alert("You're innocent!");
});