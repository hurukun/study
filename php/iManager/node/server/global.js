//---Global requirements
Config = require('./config/config');
Render = require( './core/render' ).class;
Router = require('./core/route');
iUtil = require( './core/iutil' );  

//---Config
var path = require('path');
ROOT_PATH = __dirname;//path.dirname( __dirname ); //网站根目录
APPLICATION_PATH = path.join(ROOT_PATH, 'application');
TEMPLATE_PATH = path.join( path.dirname( ROOT_PATH ), 'template');