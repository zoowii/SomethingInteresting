var zhttp = require('./zhttp.js');

var server = zhttp.createServer(function (req, res) {
//    console.log(req);
    res.writeHead(200, {'Server':"nodejsws"});
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Content-Length', 61);
    res.endHead();
    res.write("<html><head><title>hi</title></head><body>hello</body></html>\r\n");
    res.end();
});

server.listen(8000, function () {
    console.log('server stated');
});
