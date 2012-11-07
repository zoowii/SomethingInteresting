var net = require('net'),
    httpUtil = require('./util/http.util.js'),
    langUtil = require('./util/lang.util.js');

var statusCodeMap = {
    200:'OK',
    301:'Moved Permanently',
    302:'Found',
    304:'Not Modified',
    307:'Temporary Redirect',
    400:'Bad Request',
    401:'Unauthorized',
    403:'Forbidden',
    404:'Not Found',
    410:'Gone',
    500:'Internal Server Error',
    501:'Not Implemented'
};

function HttpResponse(conn, async) {
    this.conn = conn;
    this.async = async || false;  // 是否开启缓冲区（是否异步传输）
    this.headers = {};
    this.headers_size = 0;
    this.buffer = [];
    this.firstLine = null;
    this.write = function (data) {
        if (this.async) {
            this.conn.write(data);
        } else {
            this.buffer.push(data);
        }
    };
    this.setHeader = function (name, value) {
        if (this.async) {
            this.conn.write(name + ':' + value + '\r\n');
        } else {
            this.headers[name] = value;
            this.headers_size += 1;
        }
    };
    this.writeHead = function (statusCode, headers) {
        if (this.async) {
            this.write(headers['HTTP_PROTOCOL'] || 'HTTP/1.1' + ' ' + statusCode + ' ' + statusCodeMap[statusCode] || '' + '\r\n');
            for (var name in headers) {
                this.write(name + ':' + headers[name] + '\r\n');
            }
        } else {
            var httpProtocol = headers['HTTP_PROTOCOL'] || 'HTTP/1.1';
            this.firstLine = httpProtocol + ' ' + statusCode + ' ' + statusCodeMap[statusCode] || '' + '\r\n';
            this.headers = headers;
            this.headers_size = 0;
            for (var name in headers) {
                if (langUtil.inArray(typeof headers[name], ['string', 'number', 'boolean'])) {
                    this.headers_size += 1;
                }
            }
        }
    };
    this.endHead = function () {
        if (this.async) {
            this.write('\r\n');
        }
    };
    this.end = function () {
        if (this.async) {
            this.conn.end();
        } else {
            if (this.firstLine) {
                this.conn.write(this.firstLine + '\r\n');
            }
            if (this.headers_size > 0) {
                for (var name in this.headers) {
                    this.conn.write(name + ':' + this.headers[name] + '\r\n');
                }
                this.conn.write('\r\n');
            }
            for (var i = 0; i < this.buffer.length; i++) {
                this.conn.write(this.buffer[i]);
            }
            this.conn.end();
        }
    }
}

function HttpServer(callback) {
    this.callback = callback;
    this.tcpServer = net.createServer(function (conn) {
        var res = new HttpResponse(conn, false);
        conn.on('data', function (data) {
            var req = httpUtil.splitHttpRequest(data);
            callback(req, res);
        });
    });
    this.listen = function (port, listenCallback) {
        this.tcpServer.listen(port, listenCallback);
    };
}

exports.createServer = function (callback) {
    return new HttpServer(callback);
};