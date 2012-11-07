var util = require('util');

exports.inArray = function (value, array) {
    if (!util.isArray(array)) {
        return false;
    }
    for (var i = 0; i < array.length; i++) {
        if (array[i] === value) {
            return true;
        }
    }
    return false;
};