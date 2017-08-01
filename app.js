var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    // mongoose    = require("mongoose"),
    favicon = require('serve-favicon'),
    async = require('async'),
    socketio = require('socket.io'),
    http = require('http');
    
// mongoose.connect("mongodb://localhost/spyfall_v1");
app.use(favicon('./public/favicon.ico'));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

//MODELS
// var gameroomSchema = new mongoose.Schema({ //Gameroom
//     roomID: Number,
//     playerCount: Number
// });

// var Gameroom = mongoose.model("Gameroom", gameroomSchema);

// var playerSchema = new mongoose.Schema({ //Players
//     name: String,
//     // id: {
//     //     type: mongoose.Schema.Types.ObjectID,
//     //     ref: "Gameroom"
//     // }
//     roomID: Number
// })

// var Player = mongoose.model("Player", playerSchema);

// Gameroom.create({roomID: 69, playerCount: 1}, function(err, newlyCreated){
//     if (err){
//         console.log(err);
//     }
//     else{
//       console.log("Created gameroom");
//     }
// })

//SOCKET IO CHAT

var server = http.createServer(app);
var io = socketio.listen(server);

//var messages = {};
//var sockets = {};
var gameRooms = {};

io.on('connection', function(socket){
    console.log("Connected socket", "id: ", socket.id);
   // console.log(io.manager.rooms);
    // var clients = io.clients();
    // console.log(clients);
    
    // Handle chat event
    socket.on('chat', function(data){
        // console.log(data);
        io.sockets.emit('chat', data);
    });

    // Handle typing event
    socket.on('typing', function(data){
        socket.broadcast.emit('typing', data);
    });
    
    socket.on('create_game', function(data){ //data = gameInfo obj
        // console.log(data);
        // console.log("You are in room " + data.roomID);
        
        socket.join(data.roomID);
        
        data.connectedPlayers[0] = 1; //marking first connected player
        gameRooms[data.roomID] = data;
        
        io.sockets.in(data.roomID).emit('made_room', data);
        // console.log(io.sockets.manager.rooms)
    })
    
    socket.on("join_room", function(data){ //data = room id
        if (!gameRooms[data]){
            socket.emit("err", "Sorry, error joining that room.");
        }
        else{
            console.log(gameRooms);
            var playerNum = gameRooms[data].totConnected;
            socket.join(data); //join room
            var gameObj = gameRooms[data];
            
            gameRooms[data].connectedPlayers[gameObj.totConnected] = 1;
            ++gameRooms[data].totConnected;
            
            if(gameObj.players[playerNum] === 1){ //spy
                socket.emit("show-spy", gameObj);
            }
            else {
                socket.emit("show-innocent", gameObj);
            }
            
            ++playerNum;
            if(playerNum === gameRooms[data].numPlayers){ //everyone connected
                io.sockets.in(data).emit("start-game", gameRooms[data]);
            }
        }
        
        
    });
    
    socket.on('disconnect', function(socket){
        console.log("Disconnected socket");
    });
});


//ROUTES
app.get("/", function(request, response){
    response.render("landing");
});

app.get("/:id", function(req, res){
   res.render("gamepage"); 
});

app.get("/gamepage", function(req, res){
    res.render("gamepage");
});

app.get("*", function(req, res){
    res.send("You done fucked up. Page not found - 404 error.")
})

//START SERVER
// app.listen(process.env.PORT, process.env.IP, function(){
server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
   console.log("Spyfall Server Has Come Online!");
});
    