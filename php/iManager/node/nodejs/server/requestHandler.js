var exec = require( 'child_process' ).exec,
    querystring = require( 'querystring' ),
    fs = require( 'fs' );

function index( response ){
    fs.readFile("./template/index.html", "binary", function(error, file) {
        if(error) {
            response.writeHead(500, {"Content-Type": "text/plain"});
            response.write(error + "\n");
            response.end();
        } 
        else {
            response.writeHead(200, {"Content-Type": "text/html"});
            response.write(file, "binary");
            response.end();
        }
    });
}
function list( response ){
    exec( 'ls -lh', function( err, stdout, stderr ){
        response.writeHead( 200, {'Content-Type': 'text/plain'} );
        response.write( stdout );
        response.end();
    } );
}
function upload( response ){
    response.writeHead( 200, {'Content-Type': 'text/plain'} );
    response.write( 'welcome to upload page.' );
    response.end();
}

function memusage( response ){
    fs.readFile("./template/socket/memusage.html", "binary", function(error, file) {
        if(error) {
            response.writeHead(500, {"Content-Type": "text/plain"});
            response.write(error + "\n");
            response.end();
        } 
        else {
            response.writeHead(200, {"Content-Type": "text/html"});
            response.write(file, "binary");
            response.end();
        }
    });
}

exports.handle = {
    '/': index,
    '/list': list,
    '/upload': upload,
    '/memusage': memusage
}