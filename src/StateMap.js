/**
 * Created by Florin on 25-Dec-16.
 */

function StateMap() {
    this._data = Object.create(null);
    this._programs = Object.create(null);
}

StateMap.prototype.constructor = StateMap;

StateMap.prototype.get = function (key) {
    return this._data[key];
};

StateMap.prototype.set = function (key, value) {
    this._data[key] = value;
};

module.exports = StateMap;