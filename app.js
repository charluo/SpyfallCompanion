var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    favicon = require('serve-favicon'),
    async = require('async'),
    socketio = require('socket.io'),
    http = require('http');
    
mongoose.connect("mongodb://localhost/spyfall_v1");
app.use(favicon('./public/spyfall_favicon.ico'));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

//MODELS
var gameroomSchema = new mongoose.Schema({ //Gameroom
    roomID: Number,
    playerCount: Number
});

var Gameroom = mongoose.model("Gameroom", gameroomSchema);

var playerSchema = new mongoose.Schema({ //Players
    name: String,
    // id: {
    //     type: mongoose.Schema.Types.ObjectID,
    //     ref: "Gameroom"
    // }
    roomID: Number
})

var Player = mongoose.model("Player", playerSchema);

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

var messages = [];
var sockets = [];
var rooms = [];

io.on('connection', function(socket){
    console.log("Connected socket");
    console.log(socket.id);
    
    // Handle chat event
    socket.on('chat', function(data){
        // console.log(data);
        io.sockets.emit('chat', data);
    });

    // Handle typing event
    socket.on('typing', function(data){
        socket.broadcast.emit('typing', data);
    });
    
    var room_id, player_id;
    
    socket.on('create_game', function(data){ //data = room num
        
        
    })
    
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
    