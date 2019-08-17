const fs = require('fs');
const liveServer = require('live-server');
const path  =  require('path');


var params = {
	open: false,
    port:8080, // Set the server port. Defaults to 8080.
    host: "0.0.0.0", // Set the address to bind to. Defaults to 0.0.0.0 or process.env.IP.
    root: path.normalize(__dirname+"/dist"), // Set root directory that's being served. Defaults to cwd.
    file: "404.html",
    //open: true, // When false, it won't load your browser by default.
    //wait: 100, // Waits for all changes, before reloading. Defaults to 0 sec.
    logLevel: 1, // 0 = errors only, 1 = some, 2 = lots
};
liveServer.start(params);
