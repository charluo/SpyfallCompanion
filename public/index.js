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
      alert("Follow the instructions. Here, this'll help.")
      window.location.href = "http://www.readingbear.org/";
    }

    const MIN_PLAYERS = 3;
    const MAX_PLAYERS = 8;
    var loc_list = {};
    var role_list = {};
    var paired_roles = [];
    
    var gameInfo = { 
      location: undefined,
      spy1: undefined,
      spy2: undefined,
      innocent: []
    };

    // 
    // * Returns a random number between min (inclusive) and max (exclusive)
    // 
    function getRandomArbitrary(min, max) {
        return Math.round(Math.random() * (max - min) + min);
    }
    
    function selectRandomLocation (location_list){
      // console.log(Object.keys(location_list).length);
      var randomInt = getRandomArbitrary(0, Object.keys(location_list).length); //alternatively, can use _random
      console.log(randomInt);
      
      return _.keys(location_list)[randomInt];
    }
    
    function selectRandomRoles (role_list){
      
    };
    
    function gameSetup(){
      $.getJSON("locations.json", function(loc_data){
        loc_list = loc_data; //save location object data
        gameInfo.location = selectRandomLocation(loc_list);
        
        $.getJSON("roles.json", function(role_data){
          role_list = role_data;
          // console.log(data);
          
          paired_roles = _.pairs(role_list);
          console.log(paired_roles);
        });
        
      });
      
      
    };
    
    
    $("#start-button").click(function(){
      // console.log(this);
      $("#game-form").toggleClass("invis");
      
    });
    
    $("#join-button").click(function(){
      // console.log(this);
     $("#join-form").toggleClass("invis");
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
      if (x.value == 0 || x.value ==1){
        numSpies = Number(x.value);
      }
      else{
        errorReport();
      }
      
      gameSetup();
      
    });
    // console.log(gameInfo);  
});