var StringDecoder = require('string_decoder').StringDecoder,
    querystring = require('querystring'),
    langUtil = require('./lang.util.js');

var decoder = new StringDecoder('utf8');

function splitHttpHeaders(header_lines) {
    var headers = {};
    var line, tmpPos, firstLineArray;
    for (var i = 0; i < header_lines.length; i++) {
        line = header_lines[i];
        tmpPos = line.indexOf(':');
        if (tmpPos > 0 && tmpPos < line.length) {
            headers[line.substring(0, tmpPos).trim()] = line.substring(tmpPos + 1).trim();
        } else {
            firstLineArray = line.split(' ');
            if (firstLineArray.length >= 3) {
                var httpMethod = 'GET';
                if (langUtil.inArray(firstLineArray[0], ['GET', 'POST', 'PUT', 'DELETE'])) {
                    httpMethod = firstLineArray[0];
                }
                headers['HTTP_METHOD'] = httpMethod;
                var httpPath = '/', query_string = '';
                if (firstLineArray[1].length > 0 && firstLineArray[1][0] === '/') {
                    httpPath = firstLineArray[1];
                }
                tmpPos = httpPath.indexOf('?');
                if (tmpPos > 0) {
                    query_string = querystring.parse(httpPath.substring(tmpPos + 1));
                    httpPath = httpPath.substr(0, tmpPos);
                }
                headers['HTTP_PATH'] = httpPath;
                headers['QUERY_STRING'] = query_string;
                var httpProtocol = 'HTTP/1.1';
                headers['HTTP_PROTOCOL'] = firstLineArray[2];
            }
        }
    }
    return headers;
}

exports.splitHttpRequest = function (data) {
    data = decoder.write(data);
    var len = data.length;
    var i = 0;
    var header_lines = [];
    var current_header_line = '';
    var content = '';
    while (i < len) {
        if (current_header_line === '' && i < len - 1 && data[i] === '\r' && data[i + 1] === '\n') {
            i += 2;
            current_header_line = null;
            break;
        } else if (i < len - 1 && data[i] === '\r' && data[i + 1] === '\n') {
            header_lines.push(current_header_line);
            current_header_line = '';
            i += 2;
        } else {
            current_header_line += data[i];
            i += 1;
        }
    }
    content = data.substring(i);
    var headers = splitHttpHeaders(header_lines);
    if (headers['Content-Length']) {
        content = content.substr(0, parseInt(headers['Content-Length']));
    }
    // TODO: parse content to json
    return {
        headers:headers,
        content:content
    };
};