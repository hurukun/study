var Http_Server = require('./http/server').class,
    File_Service = require('./http/srv_file').class;
    Http_Service = require('./http/srv_http').class;

//---New one server to run a application
(new Http_Server(8080)).runApplication(Http_Service); //为以后可扩展出各种application,这里直接将类作为参数传给server
(new Http_Server(8081)).runApplication(File_Service);