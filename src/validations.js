/**
 * Created by Florin on 29-Dec-16.
 */

var GLEnums = require('./GLEnums');

var glEnums = new GLEnums();

var validClearMasks = [
    glEnums.COLOR_BUFFER_BIT,
    glEnums.DEPTH_BUFFER_BIT,
    glEnums.STENCIL_BUFFER_BIT,
    glEnums.COLOR_BUFFER_BIT | glEnums.DEPTH_BUFFER_BIT,
    glEnums.COLOR_BUFFER_BIT | glEnums.STENCIL_BUFFER_BIT,
    glEnums.DEPTH_BUFFER_BIT | glEnums.STENCIL_BUFFER_BIT,
    glEnums.COLOR_BUFFER_BIT | glEnums.DEPTH_BUFFER_BIT, glEnums.STENCIL_BUFFER_BIT
];

function isUInt(value) {
    return isNumeric(value) && value >= 0 && Math.floor(value) === value;
}

function isClampf(value) {
    return isInRange(value, 0, 1);
}

function isUFloat(value) {
    return isNumeric(value) && value >= 0;
}

function isInRange(value, min, max) {
    return isNumeric(value) && value >= min && value <= max;
}

function isNumeric(value) {
    return typeof value === 'number' && isFinite(value);
}

function isTypedArray(value) {
    return value && isUInt(value.BYTES_PER_ELEMENT);
}

function isValidBlendFunc(factor) {
    return (
        factor === glEnums.ZERO ||
        factor === glEnums.ONE ||
        factor === glEnums.SRC_COLOR ||
        factor === glEnums.ONE_MINUS_SRC_COLOR ||
        factor === glEnums.DST_COLOR ||
        factor === glEnums.ONE_MINUS_DST_COLOR ||
        factor === glEnums.SRC_ALPHA ||
        factor === glEnums.ONE_MINUS_SRC_ALPHA ||
        factor === glEnums.DST_ALPHA ||
        factor === glEnums.ONE_MINUS_DST_ALPHA ||
        factor === glEnums.CONSTANT_COLOR ||
        factor === glEnums.ONE_MINUS_CONSTANT_COLOR ||
        factor === glEnums.CONSTANT_ALPHA ||
        factor === glEnums.ONE_MINUS_CONSTANT_ALPHA ||
        factor === glEnums.SRC_ALPHA_SATURATE
    );
}

function isValidClearMask(mask) {
    return validClearMasks.indexOf(mask) !== -1;
}

function isValidStencilOp(value) {
    return (
        value === glEnums.KEEP ||
        value === glEnums.ZERO ||
        value === glEnums.REPLACE ||
        value === glEnums.INCR ||
        value === glEnums.INCR_WRAP ||
        value === glEnums.DECR ||
        value === glEnums.DECR_WRAP ||
        value === glEnums.INVERT
    );
}


function isValidFace(value) {
    return (
        value === glEnums.FRONT ||
        value === glEnums.BACK ||
        value === glEnums.FRONT_AND_BACK
    );
}

function isValidFunc(value) {
    return (
        value === glEnums.NEVER ||
        value === glEnums.LESS ||
        value === glEnums.EQUAL ||
        value === glEnums.LEQUAL ||
        value === glEnums.GREATER ||
        value === glEnums.NOTEQUAL ||
        value === glEnums.GEQUAL ||
        value === glEnums.ALWAYS
    );
}

function isValidBlendMode(value, ext) {
    if (ext) {
        return (
            value === glEnums.FUNC_ADD ||
            value === glEnums.FUNC_SUBTRACT ||
            value === glEnums.FUNC_REVERSE_SUBTRACT ||
            value === ext.MIN_EXT ||
            value === ext.MAX_EXT
        );
    }
    return (
        value === glEnums.FUNC_ADD ||
        value === glEnums.FUNC_SUBTRACT ||
        value === glEnums.FUNC_REVERSE_SUBTRACT
    );
}

module.exports = {
    isUInt: isUInt,
    isClampf: isClampf,
    isUFloat: isUFloat,
    isInRange: isInRange,
    isNumeric: isNumeric,
    isTypedArray: isTypedArray,
    isValidBlendFunc: isValidBlendFunc,
    isValidBlendMode: isValidBlendMode,
    isValidClearMask: isValidClearMask,
    isValidFace: isValidFace,
    isValidFunc: isValidFunc,
    isValidStencilOp: isValidStencilOp
};