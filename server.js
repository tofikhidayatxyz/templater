const fs = require('fs');
const liveServer = require('live-server');
const path  =  require('path');
const config =  require('./config')


var params = {
	open: false,
    port: config.port, 
    host: config.host, 
    root: path.normalize(__dirname+"/dist"),
    file: "404.html"
};
liveServer.start(params);
