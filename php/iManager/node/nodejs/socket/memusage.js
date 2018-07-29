var server = require('socket.io'),
    os = require('os'); 

function start(){
     var io = server.listen( 8088 ); 
     io.on("connection", function(client){ 
        setInterval(function() { 
            client.send(os.freemem() / os.totalmem()); 
        }, 500); 
     });
}

exports.start = start;