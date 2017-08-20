var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    favicon = require('serve-favicon'),
    async = require('async'),
    socketio = require('socket.io'),
    http = require('http');
    
app.use(favicon('./public/favicon.ico'));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));


var server = http.createServer(app);
var io = socketio.listen(server);

var gameRooms = {};

io.on('connection', function(socket){
    console.log("Connected socket", "id: ", socket.id);
    
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

// app.get("/:id", function(req, res){
//   res.render("gamepage"); 
// });

// app.get("/gamepage", function(req, res){
//     res.render("gamepage");
// });

app.get("*", function(req, res){
    res.send("Page not found - 404 error.")
})

//START SERVER
// app.listen(process.env.PORT, process.env.IP, function(){
server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
   console.log("Spyfall Server Has Come Online!");
});
    