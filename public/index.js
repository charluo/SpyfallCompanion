$( document ).ready(function () {
  
    var locations  = {
        //spyfall 1
        "airplane":1,
        "bank":1,
        "beach":1,
        "broadway_theater":1,
        "casino":1,
        "cathedral":1,
        "circus_tent":1,
        "corporate_party":1,
        "crusader_army":1,
        "day_spa":1,
        "embassy":1,
        "hospital":1,
        "hotel":1,
        "military_base":1,
        "movie_studio":1,
        "ocean_liner":1,
        "passenger_train":1,
        "pirate_ship":1,
        "polar_station":1,
        "police_station":1,
        "restaurant":1,
        "school":1,
        "service_station":1,
        "space_station":1,
        "submarine":1,
        "supermarket":1,
        "university":1,
        
        //spyfall 2
        "amusement_park":2,
        "art_museum":2,
        "candy_factory":2,
        "cat_show":2,
        "cemetery":2,
        "coal_mine":2,
        "construction_site":2,
        "gaming_convention":2,
        "gas_station":2,
        "harbor_docks":2,
        "ice_hockey_stadium":2,
        "jail":2,
        "jazz_club":2,
        "library":2,
        "night_club":2,
        "race_track":2,
        "retirement_home":2,
        "rock_concert":2,
        "sightseeing_bus":2,
        "stadium":2,
        "subway":2,
        "the_un":2,
        "vineyard":2,
        "wedding":2,
        "zoo":2
    };
    
    var today = new Date();
    console.log(today.getHours());
    console.log(today.getMinutes());
    console.log(today.getSeconds());
    console.log("Running index.js");
    
    // $("#jump-text").html("Inserting jQuery text.");


    $("#start-button").click(function(){
      // console.log(this);
      $("#game-form").toggleClass("invis");
    });
    
    $("#join-button").click(function(){
      // console.log(this);
     $("#join-form").toggleClass("invis");
    });

    const MIN_PLAYERS = 3;
    const MAX_PLAYERS = 12;
    
    var role_list = {};
    
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
      $.getJSON("en-US.json", function(data){
        gameInfo.location = selectRandomLocation(locations);
        role_list = data;
        // console.log(data);
        
        var paired_data = _.pairs(data);
        console.log(paired_data);
      });
      
      
    };

    gameSetup();
    
    // console.log(gameInfo);  
});