var formidable = require('./server/formidable');

function upload( request, ffilename ){
    var form = new formidable.IncomingForm();
    console.log("about to parse uploaded file.");
    form.parse(request, function(error, fields, files) {
        console.log("uploaded file parsing done");
        fs.renameSync(files.upload.path, ffilename);
        response.writeHead(200, {"Content-Type": "text/html"});
        response.end();
    });
}