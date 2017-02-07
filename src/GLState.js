/**
 * Created by Florin on 31-Dec-16.
 */

var GLCapabilities = require('./GLCapabilities');
var GLEnums = require('./GLEnums');
var StateMap = require('./StateMap');
var MapKeys = require('./MapKeys');
var validate;
if (!GL_STATE_DISABLE_VALIDATIONS) {
    validate = require('./validations');
}

function GLState(canvas, options) {
    options = options || {};

    GLEnums.call(this);

    this._gl = GLState._get3DContext(canvas, options);
    if (!this._gl) {
        console.warn('Unable to get a WebGL context');
        return this;
    }

    this._stateMap = new StateMap();
    this.capabilities = new GLCapabilities(this._gl);
    this._contextLost = false;
    this._canvas = canvas;

    this._onContextLost = this._onContextLost.bind(this);
    this._onContextRestored = this._onContextRestored.bind(this);

    this._bindEvents(canvas);

}

GLState._get3DContext = function (canvas, options) {
    return canvas.getContext('webgl', options) || canvas.getContext('experimental-webgl', options);
};

GLState.prototype = Object.create(GLEnums.prototype);
GLState.prototype.constructor = GLState;

Object.defineProperties(GLState.prototype, {
    canvas: {
        get: function () {
            return this._gl.canvas
        }
    },

    drawingBufferWidth: {
        get: function () {
            return this._gl.drawingBufferWidth;
        }
    },

    drawingBufferHeight: {
        get: function () {
            return this._gl.drawingBufferHeight
        }
    },

    haveContext: {
        get: function () {
            return this._gl != null;
        }
    }

});

GLState.prototype._bindEvents = function (canvas) {
    canvas.addEventListener('webglcontextlost', this._onContextLost, false);
    canvas.addEventListener('webglcontextrestored', this._onContextRestored, false);
};

GLState.prototype._onContextLost = function (e) {
    this._contextLost = true;
    e.preventDefault();
};

GLState.prototype._onContextRestored = function (e) {
    this._stateMap = new StateMap();
    this._contextLost = false;
    e.preventDefault();
};

GLState.prototype.destroy = function () {
    this._gl = null;
    this._stateMap = null;
    this.capabilities = null;
    this._canvas.removeEventListener('webglcontextlost', this._onContextLost, false);
    this._canvas.removeEventListener('webglcontextrestored', this._onContextRestored, false);
    this._canvas = null;
};

/**
 * Specifies which texture unit to make active.
 * @param {Number} textureUnit. The texture unit to make active.
 * The value is a gl.TEXTUREI where I is within the range from 0 to gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS - 1.
 */
GLState.prototype.activeTexture = function (textureUnit) {
    if (!GL_STATE_DISABLE_VALIDATIONS) {
        var isValid = validate.isInRange(textureUnit, this.TEXTURE0,
            this.TEXTURE0 + this.capabilities.MAX_COMBINED_TEXTURE_IMAGE_UNITS - 1);
        if (!isValid) {
            console.warn('activeTexture - invalid textureUnit, skipping call command');
            return;
        }
    }
    if (this._contextLost) {
        return;
    }
    var key = MapKeys.activeTexture;
    var value = this._stateMap.get(key);
    if (value !== textureUnit) {
        this._gl.activeTexture(textureUnit);
        this._stateMap.set(key, textureUnit);
    }
};

/**
 * Attaches either a fragment or vertex WebGLShader to a WebGLProgram.
 * @param {WebGLProgram} program
 * @param {WebGLShader} shader Fragment or vertex shader
 */
GLState.prototype.attachShader = function (program, shader) {
    if (this._contextLost) {
        return;
    }
    this._gl.attachShader(program, shader);
};

/**
 * Binds a generic vertex index to an attribute variable.
 * @param {WebGLProgram} program
 * @param {Number} index A GLuint specifying the index of the generic vertex to bind.
 * @param {String} name A DOMString specifying the name of the variable to bind to the generic vertex index.
 * This name cannot start with "webgl_" or "_webgl_", as these are reserved for use by WebGL.
 */
GLState.prototype.bindAttribLocation = function (program, index, name) {
    if (this._contextLost) {
        return;
    }
    this._gl.bindAttribLocation(program, index, name);
};

/**
 * Binds a given WebGLBuffer to a target.
 * @param {Number} target A GLenum specifying the binding point (target). Possible values:
 * gl.ARRAY_BUFFER: Buffer containing vertex attributes, such as vertex coordinates, texture coordinate data, or vertex color data
 * gl.ELEMENT_ARRAY_BUFFER: Buffer used for element indices.
 * @param {WebGLBuffer} buffer
 */
GLState.prototype.bindBuffer = function (target, buffer) {
    if (!GL_STATE_DISABLE_VALIDATIONS) {
        if (target !== this.ARRAY_BUFFER && target !== this.ELEMENT_ARRAY_BUFFER) {
            console.warn('bindBuffer - invalid target, must be ARRAY_BUFFER or ELEMENT_ARRAY_BUFFER, skipping call command');
            return;
        }
    }
    if (this._contextLost) {
        return;
    }
    this._gl.bindBuffer(target, buffer);
};

/**
 * Binds a given WebGLFramebuffer to a target.
 * @param {Number} target A GLenum specifying the binding point (target). Possible values:
 * gl.FRAMEBUFFER: Collection buffer data storage of color, alpha, depth and stencil buffers used to render an image.
 * @param {WebGLFramebuffer} framebuffer
 */
GLState.prototype.bindFramebuffer = function (target, framebuffer) {
    if (!GL_STATE_DISABLE_VALIDATIONS) {
        if (target !== this.FRAMEBUFFER) {
            console.warn('bindFramebuffer - invalid target, must be FRAMEBUFFER, skipping call command');
            return;
        }
    }
    if (this._contextLost) {
        return;
    }
    this._gl.bindFramebuffer(target, framebuffer);
};

/**
 * Binds a given WebGLRenderbuffer to a target.
 * @param {Number} target A GLenum specifying the binding point (target). Possible values:
 * gl.RENDERBUFFER: Buffer data storage for single images in a renderable internal format.
 * @param {WebGLRenderbuffer} renderbuffer
 */
GLState.prototype.bindRenderbuffer = function (target, renderbuffer) {
    if (!GL_STATE_DISABLE_VALIDATIONS) {
        if (target !== this.RENDERBUFFER) {
            console.warn('bindRenderbuffer - invalid target, must be RENDERBUFFER, skipping call command');
            return;
        }
    }
    if (this._contextLost) {
        return;
    }
    this._gl.bindRenderbuffer(target, renderbuffer);
};

/**
 * Binds a given WebGLTexture to a target (binding point).
 * @param {Number} target target A GLenum specifying the binding point (target). Possible values:
 * gl.TEXTURE_2D: A two-dimensional texture
 * gl.TEXTURE_CUBE_MAP: A cube-mapped texture
 * @param {WebGLTexture} texture
 */
GLState.prototype.bindTexture = function (target, texture) {
    if (!GL_STATE_DISABLE_VALIDATIONS) {
        if (target !== this.TEXTURE_2D && target !== this.TEXTURE_CUBE_MAP) {
            console.warn('bindTexture - invalid target, must be TEXTURE_2D or TEXTURE_CUBE_MAP, skipping call command');
            return;
        }
    }
    if (this._contextLost) {
        return;
    }
    this._gl.bindTexture(target, texture);
};

/**
 * Set the source and destination blending factors.
 * @param {Number} red A GLclampf for the red component in the range of 0 to 1
 * @param {Number} green A GLclampf for the green component in the range of 0 to 1.
 * @param {Number} blue A GLclampf for the blue component in the range of 0 to 1.
 * @param {Number} alpha A GLclampf for the alpha component in the range of 0 to 1.
 */
GLState.prototype.blendColor = function (red, green, blue, alpha) {
    if (!GL_STATE_DISABLE_VALIDATIONS) {
        if (!validate.isClampf(red)) {
            console.warn('blendColor - invalid red color, must be between 0 and 1, skipping call command');
            return;
        }
        if (!validate.isClampf(green)) {
            console.warn('blendColor - invalid green color, must be between 0 and 1, skipping call command');
            return;
        }
        if (!validate.isClampf(blue)) {
            console.warn('blendColor - invalid blue color, must be between 0 and 1, skipping call command');
            return;
        }
        if (!validate.isClampf(alpha)) {
            console.warn('blendColor - invalid alpha color, must be between 0 and 1, skipping call command');
            return;
        }
    }
    if (this._contextLost) {
        return;
    }
    var key = MapKeys.blendColor;
    var value = this._stateMap.get(key);
    if (!value) {
        this._gl.blendColor(red, green, blue, alpha);
        this._stateMap.set(key, [red, green, blue, alpha]);
    }
    else if (value[0] !== red || value[1] !== green || value[2] !== blue || value[3] !== alpha) {
        this._gl.blendColor(red, green, blue, alpha);
        value[0] = red;
        value[1] = green;
        value[2] = blue;
        value[3] = alpha;
    }
};

/**
 * Set both the RGB blend equation and alpha blend equation to a single equation.
 * @param {Number} mode A GLenum specifying how source and destination colors are combined. Must be either:
 * gl.FUNC_ADD: source + destination (default value),
 * gl.FUNC_SUBTRACT: source - destination,
 * gl.FUNC_REVERSE_SUBTRACT: destination - source
 * When using the EXT_blend_minmax extension:
 * ext.MIN_EXT: Minimum of source and destination,
 * ext.MAX_EXT: Maximum of source and destination.
 */
GLState.prototype.blendEquation = function (mode) {
    if (!GL_STATE_DISABLE_VALIDATIONS) {
        if (!validate.isValidBlendMode(mode, this.capabilities.EXT_blend_minmax)) {
            console.warn('blendEquation - invalid mode, must be FUNC_ADD, FUNC_SUBTRACT or FUNC_REVERSE_SUBTRACT, skipping call command');
            return;
        }
    }
    if (this._contextLost) {
        return;
    }
    var key = MapKeys.blendEquation;
    var value = this._stateMap.get(key);
    if (value !== mode) {
        this._gl.blendEquation(mode);
        this._stateMap.set(key, mode);
    }
};

/**
 * Set the RGB blend equation and alpha blend equation separately.
 * @param {Number} modeRGB
 * @param {Number} modeAlpha
 * Possible values: same as blendEquation
 */
GLState.prototype.blendEquationSeparate = function (modeRGB, modeAlpha) {
    if (!GL_STATE_DISABLE_VALIDATIONS) {
        if (!validate.isValidBlendMode(modeRGB, this.capabilities.EXT_blend_minmax)) {
            console.warn('blendEquationSeparate - invalid modeRGB, must be FUNC_ADD, FUNC_SUBTRACT or FUNC_REVERSE_SUBTRACT, skipping call command');
            return;
        }
        if (!validate.isValidBlendMode(modeAlpha, this.capabilities.EXT_blend_minmax)) {
            console.warn('blendEquationSeparate - invalid modeAlpha, must be FUNC_ADD, FUNC_SUBTRACT or FUNC_REVERSE_SUBTRACT, skipping call command');
            return;
        }
    }
    if (this._contextLost) {
        return;
    }
    var key = MapKeys.blendEquationSeparate;
    var value = this._stateMap.get(key);
    if (!value) {
        this._gl.blendEquationSeparate(modeRGB, modeAlpha);
        this._stateMap.set(key, [modeRGB, modeAlpha]);
    }
    else if (value[0] !== modeRGB || value[1] !== modeAlpha) {
        this._gl.blendEquationSeparate(modeRGB, modeAlpha);
        value[0] = modeRGB;
        value[1] = modeAlpha;
    }
};

/**
 * Defines which function is used for blending pixel arithmetic.
 * @param {Number} sfactor
 * @param {Number} dfactor
 */
GLState.prototype.blendFunc = function (sfactor, dfactor) {
    if (!GL_STATE_DISABLE_VALIDATIONS) {
        if (!validate.isValidBlendFunc(sfactor)) {
            console.warn('blendFunc - invalid sfactor, skipping call command');
            return;
        }
        if (!validate.isValidBlendFunc(dfactor)) {
            console.warn('blendFunc - invalid dfactor, skipping call command');
            return;
        }
        //todo: check more permutations of constant color and constant alpha
        if (sfactor === this.CONSTANT_COLOR && dfactor === this.CONSTANT_ALPHA) {
            console.warn('blendFunc - invalid sfactor and dfactor, can not be CONSTANT_COLOR and CONSTANT_ALPHA, skipping call command');
            return;
        }
    }
    if (this._contextLost) {
        return;
    }
    var key = MapKeys.blendFunc;
    var value = this._stateMap.get(key);
    if (!value) {
        this._gl.blendFunc(sfactor, dfactor);
        this._stateMap.set(key, [sfactor, dfactor]);
    }
    else if (value[0] !== sfactor || value[1] !== dfactor) {
        this._gl.blendFunc(sfactor, dfactor);
        value[0] = sfactor;
        value[1] = dfactor;
    }
};

/**
 * Defines which function is used for blending pixel arithmetic for RGB and alpha components separately.
 * @param {Number} srcRGB
 * @param {Number} dstRGB
 * @param {Number} srcAlpha
 * @param {Number} dstAlpha
 * Possible values: see _checkBlendFunc
 */
GLState.prototype.blendFuncSeparate = function (srcRGB, dstRGB, srcAlpha, dstAlpha) {
    if (!GL_STATE_DISABLE_VALIDATIONS) {
        if (!validate.isValidBlendFunc(srcRGB)) {
            //todo: check if GL_SRC_ALPHA_SATURATE is valid
            console.warn('blendFuncSeparate - invalid srcRGB, skipping call command');
            return;
        }
        if (!validate.isValidBlendFunc(dstRGB)) {
            console.warn('blendFuncSeparate - invalid dstRGB, skipping call command');
            return;
        }
        if (!validate.isValidBlendFunc(srcAlpha)) {
            console.warn('blendFuncSeparate - invalid srcAlpha, skipping call command');
            return;
        }
        if (!validate.isValidBlendFunc(dstAlpha)) {
            console.warn('blendFuncSeparate - invalid dstAlpha, skipping call command');
            return;
        }
        if (srcRGB === this.CONSTANT_COLOR && dstRGB === this.CONSTANT_ALPHA) {
            //todo: check more permutations of constant color and constant alpha
            console.warn('blendFuncSeparate - invalid srcRGB and dstRGB, can not be CONSTANT_COLOR and CONSTANT_ALPHA, skipping call command');
            return;
        }
    }
    if (this._contextLost) {
        return;
    }
    var key = MapKeys.blendFuncSeparate;
    var value = this._stateMap.get(key);
    if (!value) {
        this._gl.blendFuncSeparate(srcRGB, dstRGB, srcAlpha, dstAlpha);
        this._stateMap.set(key, [srcRGB, dstRGB, srcAlpha, dstAlpha]);
    }
    else if (value[0] !== srcRGB || value[1] !== dstRGB || value[2] !== srcAlpha || value[3] !== dstAlpha) {
        this._gl.blendFuncSeparate(srcRGB, dstRGB, srcAlpha, dstAlpha);
        value[0] = srcRGB;
        value[1] = dstRGB;
        value[2] = srcAlpha;
        value[3] = dstAlpha;
    }
};

/**
 * Initializes and creates the buffer object's data store.
 *
 * @param {Number} target A GLenum specifying the binding point (target). Possible values:
 * gl.ARRAY_BUFFER: Buffer containing vertex attributes, such as vertex coordinates, texture coordinate data, or vertex color data
 * gl.ELEMENT_ARRAY_BUFFER: Buffer used for element indices
 *
 * @param {Number | ArrayBufferView | null} sizeOrData A GLsizeiptr setting the size of the buffer object's data store
 * or a typed array that will be copied into the data store.
 * If null, a data store is still created, but the content is uninitialized and undefined.
 *
 * @param{Number} usage A GLenum specifying the usage pattern of the data store. Possible values:
 * gl.STATIC_DRAW: Contents of the buffer are likely to be used often and not change often. Contents are written to the buffer, but not read.
 * gl.DYNAMIC_DRAW: Contents of the buffer are likely to be used often and change often. Contents are written to the buffer, but not read.
 * gl.STREAM_DRAW: Contents of the buffer are likely to not be used often. Contents are written to the buffer, but not read.
 */
GLState.prototype.bufferData = function (target, sizeOrData, usage) {
    if (!GL_STATE_DISABLE_VALIDATIONS) {
        if (target !== this.ARRAY_BUFFER && target !== this.ELEMENT_ARRAY_BUFFER) {
            console.warn('bufferData - invalid target, must be ARRAY_BUFFER or ELEMENT_ARRAY_BUFFER, skipping call command');
            return;
        }
        if (!validate.isUInt(sizeOrData) && !validate.isTypedArray(sizeOrData) && sizeOrData !== null) {
            console.warn('bufferData - invalid sizeOrData, must be natural number, Typed Array or null, skipping call command');
            return;
        }
        if (usage !== this.STATIC_DRAW && usage !== this.DYNAMIC_DRAW && usage !== this.STREAM_DRAW) {
            console.warn('bufferData - invalid usage, must be STATIC_DRAW, DYNAMIC_DRAW or STREAM_DRAW, skipping call command');
            return;
        }
    }
    if (this._contextLost) {
        return;
    }
    this._gl.bufferData(target, sizeOrData, usage);
};

/**
 * Updates a subset of a buffer object's data store.
 *
 * @param {Number} target A GLenum specifying the binding point (target). Possible values:
 * gl.ARRAY_BUFFER: Buffer containing vertex attributes, such as vertex coordinates, texture coordinate data, or vertex color data.
 * gl.ELEMENT_ARRAY_BUFFER: Buffer used for element indices.
 *
 * @param {Number} offset A GLintptr specifying an offset in bytes where the data replacement will start.
 *
 * @param {ArrayBufferView} data Typed array that will be copied into the data store.
 *
 */
GLState.prototype.bufferSubData = function (target, offset, data) {
    if (!GL_STATE_DISABLE_VALIDATIONS) {
        if (target !== this.ARRAY_BUFFER && target !== this.ELEMENT_ARRAY_BUFFER) {
            console.warn('bufferSubData - invalid target, must be ARRAY_BUFFER or ELEMENT_ARRAY_BUFFER, skipping call command');
            return;
        }
        if (!validate.isUInt(offset)) {
            console.warn('bufferSubData - invalid offset, must be a natural number, skipping call command');
            return;
        }
        if (!validate.isTypedArray(data)) {
            console.warn('bufferSubData - invalid data, must be a Typed Array, skipping call command');
            return;
        }
    }
    if (this._contextLost) {
        return;
    }
    this._gl.bufferSubData(target, offset, data);
};

/**
 * Returns the completeness status of the WebGLFramebuffer object.
 *
 * @param {Number} target A GLenum specifying the binding point (target). Possible values:
 * gl.FRAMEBUFFER: Collection buffer data storage of color, alpha, depth and stencil buffers used to render an image.
 *
 * @return {Number | null} A GLenum indicating the completeness status of the framebuffer or 0 if an error occurs. Possible enum return values:
 * gl.FRAMEBUFFER_COMPLETE: The framebuffer is ready to display.
 * gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT: The attachment types are mismatched or not all framebuffer attachment points are framebuffer attachment complete.
 * gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT: There is no attachment.
 * gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS: Height and width of the attachment are not the same.
 * gl.FRAMEBUFFER_UNSUPPORTED: The format of the attachment is not supported or if depth and stencil attachments are not the same renderbuffer.
 * null if the target is invalid
 */
GLState.prototype.checkFramebufferStatus = function (target) {
    if (!GL_STATE_DISABLE_VALIDATIONS) {
        if (target !== this.FRAMEBUFFER) {
            console.warn('checkFramebufferStatus - invalid target, must be FRAMEBUFFER, skipping call command');
            return null;
        }
    }
    if (this._contextLost) {
        return null;
    }
    return this._gl.checkFramebufferStatus(target);
};

/**
 * Clears buffers to preset values.
 * The preset values can be set by clearColor(), clearDepth() or clearStencil().
 * The scissor box, dithering, and buffer writemasks can affect the clear() method.
 *
 * @param {Number} mask A GLbitfield bitwise OR mask that indicates the buffers to be cleared. Possible values are:
 * gl.COLOR_BUFFER_BIT
 * gl.DEPTH_BUFFER_BIT
 * gl.STENCIL_BUFFER_BIT
 */
GLState.prototype.clear = function (mask) {
    if (!GL_STATE_DISABLE_VALIDATIONS) {
        if (!validate.isValidClearMask(mask)) {
            console.warn('clear - invalid mask, must be COLOR_BUFFER_BIT, DEPTH_BUFFER_BIT, STENCIL_BUFFER_BIT or a bitwise OR the values, skipping call command');
            return;
        }
    }
    if (this._contextLost) {
        return;
    }
    this._gl.clear(mask);
};

/**
 * Specifies the color values used when clearing color buffers.
 * This specifies what color values to use when calling the clear() method. The values are clamped between 0 and 1.
 * Default values are 0.
 * @param {Number} red A GLclampf specifying the red color value used when the color buffers are cleared.
 * @param {Number} green A GLclampf specifying the green color value used when the color buffers are cleared.
 * @param {Number} blue A GLclampf specifying the blue color value used when the color buffers are cleared.
 * @param {Number} alpha A GLclampf specifying the alpha color value used when the color buffers are cleared.
 */
GLState.prototype.clearColor = function (red, green, blue, alpha) {
    if (!GL_STATE_DISABLE_VALIDATIONS) {
        if (!validate.isClampf(red)) {
            console.warn('clearColor - invalid red color, must be between 0 and 1, skipping call command');
            return;
        }
        if (!validate.isClampf(green)) {
            console.warn('clearColor - invalid green color, must be between 0 and 1, skipping call command');
            return;
        }
        if (!validate.isClampf(blue)) {
            console.warn('clearColor - invalid blue color, must be between 0 and 1, skipping call command');
            return;
        }
        if (!validate.isClampf(alpha)) {
            console.warn('clearColor - invalid alpha color, must be between 0 and 1, skipping call command');
            return;
        }
    }
    if (this._contextLost) {
        return;
    }
    var key = MapKeys.clearColor;
    var value = this._stateMap.get(key);
    if (!value) {
        this._gl.clearColor(red, green, blue, alpha);
        this._stateMap.set(key, [red, green, blue, alpha]);
    }
    else if (value[0] !== red || value[1] !== green || value[2] !== blue || value[3] !== alpha) {
        this._gl.clearColor(red, green, blue, alpha);
        value[0] = red;
        value[1] = green;
        value[2] = blue;
        value[3] = alpha;
    }
};

/**
 * Specifies the clear value for the depth buffer.
 * This specifies what depth value to use when calling the clear() method. The value is clamped between 0 and 1.
 * @param {Number} depth A GLclampf specifying the depth value used when the depth buffer is cleared. Default value: 1.
 */
GLState.prototype.clearDepth = function (depth) {
    if (!GL_STATE_DISABLE_VALIDATIONS) {
        if (!validate.isClampf(depth)) {
            console.warn('clearDepth - invalid depth, must be between 0 and 1, skipping call command');
            return;
        }
    }
    if (this._contextLost) {
        return;
    }
    var key = MapKeys.clearDepth;
    var value = this._stateMap.get(key);
    if (value !== depth) {
        this._gl.clearDepth(depth);
        this._stateMap.set(key, depth);
    }
};

/**
 * Specifies the clear value for the stencil buffer.
 * This specifies what stencil value to use when calling the clear() method.
 * @param {Number} s A GLint specifying the index used when the stencil buffer is cleared. Default value: 0.
 */
GLState.prototype.clearStencil = function (s) {
    if (!GL_STATE_DISABLE_VALIDATIONS) {
        if (!validate.isUInt(s)) {
            console.warn('clearStencil - invalid value, must be a natural number, skipping call command');
            return;
        }
    }
    if (this._contextLost) {
        return;
    }
    var key = MapKeys.clearStencil;
    var value = this._stateMap.get(key);
    if (value !== s) {
        this._gl.clearStencil(s);
        this._stateMap.set(key, s);
    }
};

/**
 * Sets which color components to enable or to disable when drawing or rendering to a WebGLFramebuffer.
 * Default values: true.
 * @param {Boolean} red
 * @param {Boolean} green
 * @param {Boolean} blue
 * @param {Boolean} alpha
 */
GLState.prototype.colorMask = function (red, green, blue, alpha) {
    if (!GL_STATE_DISABLE_VALIDATIONS) {
        if (typeof red !== 'boolean') {
            console.warn('colorMask - invalid red, must be true or false, skipping call command');
            return;
        }
        if (typeof green !== 'boolean') {
            console.warn('colorMask - invalid green, must be true or false, skipping call command');
            return;
        }
        if (typeof blue !== 'boolean') {
            console.warn('colorMask - invalid blue, must be true or false, skipping call command');
            return;
        }
        if (typeof alpha !== 'boolean') {
            console.warn('colorMask - invalid alpha, must be true or false, skipping call command');
            return;
        }
    }
    if (this._contextLost) {
        return;
    }
    var key = MapKeys.colorMask;
    var value = this._stateMap.get(key);
    if (!value) {
        this._gl.colorMask(red, green, blue, alpha);
        this._stateMap.set(key, [red, green, blue, alpha]);
    }
    else if (value[0] !== red || value[1] !== green || value[2] !== blue || value[3] !== alpha) {
        this._gl.colorMask(red, green, blue, alpha);
        value[0] = red;
        value[1] = green;
        value[2] = blue;
        value[3] = alpha;
    }
};

/**
 * Compiles a GLSL shader into binary data so that it can be used by a WebGLProgram.
 * @param {WebGLShader} shader A fragment or vertex WebGLShader
 */
GLState.prototype.compileShader = function (shader) {
    if (this._contextLost) {
        return;
    }
    this._gl.compileShader(shader);
};

GLState.prototype.compressedTexImage2D = function (target, level, internalformat, width, height, border, pixels) {
    if (this._contextLost) {
        return;
    }
    this._gl.compressedTexImage2D(target, level, internalformat, width, height, border, pixels);
};

GLState.prototype.compressedTexSubImage2D = function (target, level, xoffset, yoffset, width, height, format, pixels) {
    if (this._contextLost) {
        return;
    }
    this._gl.compressedTexSubImage2D(target, level, xoffset, yoffset, width, height, format, pixels);
};

GLState.prototype.copyTexImage2D = function (target, level, internalformat, x, y, width, height, border) {
    if (this._contextLost) {
        return;
    }
    this._gl.copyTexImage2D(target, level, internalformat, x, y, width, height, border);
};

GLState.prototype.copyTexSubImage2D = function (target, level, xoffset, yoffset, x, y, width, height) {
    if (this._contextLost) {
        return;
    }
    this._gl.copyTexSubImage2D(target, level, xoffset, yoffset, x, y, width, height);
};

GLState.prototype.createBuffer = function () {
    if (this._contextLost) {
        return;
    }
    return this._gl.createBuffer();
};

GLState.prototype.createFramebuffer = function () {
    if (this._contextLost) {
        return;
    }
    return this._gl.createFramebuffer();
};

GLState.prototype.createProgram = function () {
    if (this._contextLost) {
        return;
    }
    return this._gl.createProgram();
};

GLState.prototype.createRenderbuffer = function () {
    if (this._contextLost) {
        return;
    }
    return this._gl.createRenderbuffer();
};

/**
 * Creates a WebGLShader that can then be configured further using WebGLRenderingContext.shaderSource() and
 * WebGLRenderingContext.compileShader().
 *
 * @param {Number} type Either gl.VERTEX_SHADER or gl.FRAGMENT_SHADER
 *
 * @return {WebGLShader | null}
 */
GLState.prototype.createShader = function (type) {
    if (!GL_STATE_DISABLE_VALIDATIONS) {
        if (type !== this.VERTEX_SHADER && type !== this.FRAGMENT_SHADER) {
            console.warn('createShader - invalid type, must be VERTEX_SHADER or FRAGMENT_SHADER, skipping call command');
            return null;
        }
    }
    if (this._contextLost) {
        return null;
    }
    return this._gl.createShader(type);
};

GLState.prototype.createTexture = function () {
    if (this._contextLost) {
        return;
    }
    return this._gl.createTexture();
};

/**
 * Specifies whether or not front- and/or back-facing polygons can be culled.
 * @param {Number} mode A GLenum specifying whether front- or back-facing polygons are candidates for culling.
 * The default value is gl.BACK. Possible values are: gl.FRONT, gl.BACK, gl.FRONT_AND_BACK
 */
GLState.prototype.cullFace = function (mode) {
    if (!GL_STATE_DISABLE_VALIDATIONS) {
        if (!validate.isValidFace(mode)) {
            console.warn('cullFace - invalid mode, must be FRONT, BACK or FRONT_AND_BACK, skipping call command');
            return;
        }
    }
    if (this._contextLost) {
        return;
    }
    var key = MapKeys.cullFace;
    var value = this._stateMap.get(key);
    if (value !== mode) {
        this._gl.cullFace(mode);
        this._stateMap.set(key, mode);
    }
};

GLState.prototype.deleteBuffer = function (buffer) {
    if (this._contextLost) {
        return;
    }
    this._gl.deleteBuffer(buffer);
};

GLState.prototype.deleteFramebuffer = function (framebuffer) {
    if (this._contextLost) {
        return;
    }
    this._gl.deleteFramebuffer(framebuffer);
};

GLState.prototype.deleteProgram = function (program) {
    if (this._contextLost) {
        return;
    }
    this._gl.deleteProgram(program);
};

GLState.prototype.deleteRenderbuffer = function (renderbuffer) {
    if (this._contextLost) {
        return;
    }
    this._gl.deleteRenderbuffer(renderbuffer);
};

GLState.prototype.deleteShader = function (shader) {
    if (this._contextLost) {
        return;
    }
    this._gl.deleteShader(shader);
};

GLState.prototype.deleteTexture = function (texture) {
    if (this._contextLost) {
        return;
    }
    this._gl.deleteTexture(texture);
};

/**
 * Specifies a function that compares incoming pixel depth to the current depth buffer value.
 * @param {Number} func A GLenum specifying the depth comparison function, which sets the conditions under which
 * the pixel will be drawn. The default value is gl.LESS. Possible values are:
 * gl.NEVER (never pass)
 * gl.LESS (pass if the incoming value is less than the depth buffer value)
 * gl.EQUAL (pass if the incoming value equals the the depth buffer value)
 * gl.LEQUAL (pass if the incoming value is less than or equal to the depth buffer value)
 * gl.GREATER (pass if the incoming value is greater than the depth buffer value)
 * gl.NOTEQUAL (pass if the incoming value is not equal to the depth buffer value)
 * gl.GEQUAL (pass if the incoming value is greater than or equal to the depth buffer value)
 * gl.ALWAYS (always pass)
 */
GLState.prototype.depthFunc = function (func) {
    if (!GL_STATE_DISABLE_VALIDATIONS) {
        if (!validate.isValidFunc(func)) {
            console.warn('depthFunc - invalid func, skipping call command');
            return;
        }
    }
    if (this._contextLost) {
        return;
    }
    var key = MapKeys.depthFunc;
    var value = this._stateMap.get(key);
    if (value !== func) {
        this._gl.depthFunc(func);
        this._stateMap.set(key, func);
    }
};

/**
 * Sets whether writing into the depth buffer is enabled or disabled.
 * @param {Boolean} flag Default value: true
 */
GLState.prototype.depthMask = function (flag) {
    if (!GL_STATE_DISABLE_VALIDATIONS) {
        if (typeof flag !== 'boolean') {
            console.warn('depthMask - invalid flag, must be true or false, skipping call command');
            return;
        }
    }
    if (this._contextLost) {
        return;
    }
    var key = MapKeys.depthMask;
    var value = this._stateMap.get(key);
    if (value !== flag) {
        this._gl.depthMask(flag);
        this._stateMap.set(key, flag);
    }
};

/**
 * Specifies the depth range mapping from normalized device coordinates to window or viewport coordinates.
 *
 * @param {Number} zNear A GLclampf specifying the mapping of the near clipping plane to window or viewport coordinates.
 * Clamped to the range 0 to 1 and must be less than or equal to zFar. The default value is 0.
 *
 * @param {Number} zFar A GLclampf specifying the mapping of the far clipping plane to window or viewport coordinates.
 * Clamped to the range 0 to 1. The default value is 1.
 */
GLState.prototype.depthRange = function (zNear, zFar) {
    if (!GL_STATE_DISABLE_VALIDATIONS) {
        if (!validate.isClampf(zNear)) {
            console.warn('depthRange - invalid zNear, must be between 0 and 1, skipping call command');
            return;
        }
        if (!validate.isClampf(zFar)) {
            console.warn('depthRange - invalid zFar, must be between 0 and 1, skipping call command');
            return;
        }
    }
    if (this._contextLost) {
        return;
    }
    var key = MapKeys.depthRange;
    var value = this._stateMap.get(key);
    if (!value) {
        this._gl.depthRange(zNear, zFar);
        this._stateMap.set(key, [zNear, zFar]);
    }
    else if (value[0] !== zNear || value[1] !== zFar) {
        this._gl.depthRange(zNear, zFar);
        value[0] = zNear;
        value[1] = zFar;
    }
};

GLState.prototype.detachShader = function (program, shader) {
    if (this._contextLost) {
        return;
    }
    this._gl.detachShader(program, shader);
};

/**
 * Disables specific WebGL capabilities for this context.
 * @param {Number} cap A GLenum specifying which WebGL capability to disable.
 */
GLState.prototype.disable = function (cap) {
    if (!GL_STATE_DISABLE_VALIDATIONS) {
        if (cap !== this.BLEND && cap !== this.CULL_FACE && cap !== this.DEPTH_TEST && cap !== this.DITHER &&
            cap !== this.POLYGON_OFFSET_FILL && cap !== this.SAMPLE_ALPHA_TO_COVERAGE && cap !== this.SAMPLE_COVERAGE &&
            cap !== this.SCISSOR_TEST && cap !== this.STENCIL_TEST) {
            console.warn('disable - invalid cap, skipping call command');
            return;
        }
    }
    if (this._contextLost) {
        return;
    }
    var key = MapKeys.enabled + cap;
    var value = this._stateMap.get(key);
    if (value === true) {
        this._gl.disable(cap);
        this._stateMap.set(key, false);
    }
};

/**
 * Turns the generic vertex attribute array off at a given index position.
 * @param {Number} index A GLuint specifying the index of the vertex attribute to disable.
 */
GLState.prototype.disableVertexAttribArray = function (index) {
    if (!GL_STATE_DISABLE_VALIDATIONS) {
        if (!validate.isUInt(index)) {
            console.warn('disableVertexAttribArray - invalid index, must be a natural number, skipping call command');
            return;
        }
    }
    if (this._contextLost) {
        return;
    }
    var key = MapKeys.vertexAttribArray + index;
    var value = this._stateMap.get(key);
    if (value === true) {
        this._gl.disableVertexAttribArray(index);
        this._stateMap.set(key, false);
    }
};

GLState.prototype.drawArrays = function (mode, first, count) {
    if (this._contextLost) {
        return;
    }
    this._gl.drawArrays(mode, first, count);
};

GLState.prototype.drawElements = function (mode, count, type, offset) {
    if (this._contextLost) {
        return;
    }
    this._gl.drawElements(mode, count, type, offset);
};

/**
 * Enables specific WebGL capabilities for this context.
 * @param {Number} cap A GLenum specifying which WebGL capability to disable.
 */
GLState.prototype.enable = function (cap) {
    if (!GL_STATE_DISABLE_VALIDATIONS) {
        if (cap !== this.BLEND && cap !== this.CULL_FACE && cap !== this.DEPTH_TEST && cap !== this.DITHER &&
            cap !== this.POLYGON_OFFSET_FILL && cap !== this.SAMPLE_ALPHA_TO_COVERAGE && cap !== this.SAMPLE_COVERAGE &&
            cap !== this.SCISSOR_TEST && cap !== this.STENCIL_TEST) {
            console.warn('enable - invalid cap, skipping call command');
            return;
        }
    }
    if (this._contextLost) {
        return;
    }
    var key = MapKeys.enabled + cap;
    var value = this._stateMap.get(key);
    if (!value) {
        this._gl.enable(cap);
        this._stateMap.set(key, true);
    }
};

/**
 * Turns the generic vertex attribute array on at a given index position.
 * @param {Number} index A GLuint specifying the index of the vertex attribute to enable.
 */
GLState.prototype.enableVertexAttribArray = function (index) {
    if (!GL_STATE_DISABLE_VALIDATIONS) {
        if (!validate.isUInt(index)) {
            console.warn('enableVertexAttribArray - invalid index, must be a natural number, skipping call command');
            return;
        }
        if (this._contextLost) {
            return;
        }
    }
    var key = MapKeys.vertexAttribArray + index;
    var value = this._stateMap.get(key);
    if (!value) {
        this._gl.enableVertexAttribArray(index);
        this._stateMap.set(key, true);
    }
};

GLState.prototype.finish = function () {
    if (this._contextLost) {
        return;
    }
    this._gl.finish();
};

GLState.prototype.flush = function () {
    if (this._contextLost) {
        return;
    }
    this._gl.flush();
};

GLState.prototype.framebufferRenderbuffer = function (target, attachment, renderbuffertarget, renderbuffer) {
    if (this._contextLost) {
        return;
    }
    this._gl.framebufferRenderbuffer(target, attachment, renderbuffertarget, renderbuffer);
};

GLState.prototype.framebufferTexture2D = function (target, attachment, textarget, texture, level) {
    if (this._contextLost) {
        return;
    }
    this._gl.framebufferTexture2D(target, attachment, textarget, texture, level);
};

/**
 * Specifies whether polygons are front- or back-facing by setting a winding orientation.
 * @param {Number} mode Sets the winding orientation. The default value is gl.CCW. Possible values:
 * gl.CW: Clock-wise winding
 * gl.CCW: Counter-clock-wise winding
 */
GLState.prototype.frontFace = function (mode) {
    if (!GL_STATE_DISABLE_VALIDATIONS) {
        if (mode !== this.CW && mode !== this.CCW) {
            console.warn('frontFace - invalid mode, must be CW or CCW, skipping call command');
            return;
        }
    }
    if (this._contextLost) {
        return;
    }
    var key = MapKeys.frontFace;
    var value = this._stateMap.get(key);
    if (value !== mode) {
        this._gl.frontFace(mode);
        this._stateMap.set(key, mode);
    }
};

GLState.prototype.generateMipmap = function (target) {
    if (this._contextLost) {
        return;
    }
    this._gl.generateMipmap(target);
};

GLState.prototype.getActiveAttrib = function (program, index) {
    if (this._contextLost) {
        return;
    }
    return this._gl.getActiveAttrib(program, index);
};

GLState.prototype.getActiveUniform = function (program, index) {
    if (this._contextLost) {
        return;
    }
    return this._gl.getActiveUniform(program, index);
};

GLState.prototype.getAttachedShaders = function (program) {
    if (this._contextLost) {
        return;
    }
    return this._gl.getAttachedShaders(program);
};

GLState.prototype.getAttribLocation = function (program, name) {
    if (this._contextLost) {
        return;
    }
    return this._gl.getAttribLocation(program, name);
};

GLState.prototype.getBufferParameter = function (target, pname) {
    if (this._contextLost) {
        return;
    }
    return this._gl.getBufferParameter(target, pname);
};

GLState.prototype.getContextAttributes = function () {
    if (this._contextLost) {
        return;
    }
    return this._gl.getContextAttributes();
};

GLState.prototype.getError = function () {
    if (this._contextLost) {
        return;
    }
    return this._gl.getError();
};

GLState.prototype.getExtension = function (name) {
    if (this._contextLost) {
        return;
    }
    return this._gl.getExtension(name);
};

GLState.prototype.getFramebufferAttachmentParameter = function (target, attachment, pname) {
    if (this._contextLost) {
        return;
    }
    return this._gl.getFramebufferAttachmentParameter(target, attachment, pname);
};

GLState.prototype.getParameter = function (pname) {
    if (this._contextLost) {
        return;
    }
    return this._gl.getParameter(pname);
};

GLState.prototype.getProgramInfoLog = function (program) {
    if (this._contextLost) {
        return;
    }
    return this._gl.getProgramInfoLog(program);
};

GLState.prototype.getProgramParameter = function (program, pname) {
    if (this._contextLost) {
        return;
    }
    return this._gl.getProgramParameter(program, pname);
};

GLState.prototype.getRenderbufferParameter = function (target, pname) {
    if (this._contextLost) {
        return;
    }
    return this._gl.getRenderbufferParameter(target, pname);
};

GLState.prototype.getShaderInfoLog = function (shader) {
    if (this._contextLost) {
        return;
    }
    return this._gl.getShaderInfoLog(shader);
};

GLState.prototype.getShaderParameter = function (shader, pname) {
    if (this._contextLost) {
        return;
    }
    return this._gl.getShaderParameter(shader, pname);
};

GLState.prototype.getShaderPrecisionFormat = function (shaderType, precisionType) {
    if (this._contextLost) {
        return;
    }
    return this._gl.getShaderPrecisionFormat(shaderType, precisionType);
};

GLState.prototype.getShaderSource = function (shader) {
    if (this._contextLost) {
        return;
    }
    return this._gl.getShaderSource(shader);
};

GLState.prototype.getSupportedExtensions = function () {
    if (this._contextLost) {
        return;
    }
    return this._gl.getSupportedExtensions();
};

GLState.prototype.getTexParameter = function (target, pname) {
    if (this._contextLost) {
        return;
    }
    return this._gl.getTexParameter(target, pname);
};

GLState.prototype.getUniform = function (program, location) {
    if (this._contextLost) {
        return;
    }
    return this._gl.getUniform(program, location);
};

GLState.prototype.getUniformLocation = function (program, name) {
    if (this._contextLost) {
        return;
    }
    return this._gl.getUniformLocation(program, name);
};

GLState.prototype.getVertexAttrib = function (index, pname) {
    if (this._contextLost) {
        return;
    }
    return this._gl.getVertexAttrib(index, pname);
};

GLState.prototype.getVertexAttribOffset = function (index, pname) {
    if (this._contextLost) {
        return;
    }
    return this._gl.getVertexAttribOffset(index, pname);
};

GLState.prototype.hint = function (target, mode) {
    if (this._contextLost) {
        return;
    }
    //todo map hints per target
    this._gl.hint(target, mode);
};

GLState.prototype.isBuffer = function (buffer) {
    if (this._contextLost) {
        return;
    }
    return this._gl.isBuffer(buffer);
};

GLState.prototype.isContextLost = function () {
    if (this._contextLost) {
        return;
    }
    return this._gl.isContextLost();
};

GLState.prototype.isEnabled = function (cap) {
    if (this._contextLost) {
        return;
    }
    return this._gl.isEnabled(cap);
};

GLState.prototype.isFramebuffer = function (framebuffer) {
    if (this._contextLost) {
        return;
    }
    return this._gl.isFramebuffer(framebuffer);
};

GLState.prototype.isProgram = function (program) {
    if (this._contextLost) {
        return;
    }
    return this._gl.isProgram(program);
};

GLState.prototype.isRenderbuffer = function (renderbuffer) {
    if (this._contextLost) {
        return;
    }
    return this._gl.isRenderbuffer(renderbuffer);
};

GLState.prototype.isShader = function (shader) {
    if (this._contextLost) {
        return;
    }
    return this._gl.isShader(shader);
};

GLState.prototype.isTexture = function (texture) {
    if (this._contextLost) {
        return;
    }
    return this._gl.isTexture(texture);
};

/**
 * Sets the line width of rasterized lines. Does nothing on Windows.
 * @param {Number} width A GLfloat specifying the width of rasterized lines. Default value: 1.
 */
GLState.prototype.lineWidth = function (width) {
    if (!GL_STATE_DISABLE_VALIDATIONS) {
        if (!validate.isUFloat(width)) {
            console.warn('lineWidth - invalid width, must be a positive float value, skipping call command');
            return;
        }
    }
    if (this._contextLost) {
        return;
    }
    var key = MapKeys.lineWidth;
    var value = this._stateMap.get(key);
    if (value !== width) {
        this._gl.lineWidth(width);
        this._stateMap.set(key, width);
    }
};

GLState.prototype.linkProgram = function (program) {
    if (this._contextLost) {
        return;
    }
    this._gl.linkProgram(program);
};

/**
 * Specifies the pixel storage modes.
 * @param {Number} pname A Glenum specifying which parameter to set
 * @param {Number | Boolean} param A GLint specifying a value to set the pname parameter to
 */
GLState.prototype.pixelStorei = function (pname, param) {
    if (!GL_STATE_DISABLE_VALIDATIONS) {
        if (pname !== this.PACK_ALIGNMENT && pname !== this.UNPACK_ALIGNMENT && pname !== this.UNPACK_FLIP_Y_WEBGL &&
            pname !== this.UNPACK_PREMULTIPLY_ALPHA_WEBGL && pname !== this.UNPACK_COLORSPACE_CONVERSION_WEBGL) {
            console.warn('pixelStorei - invalid pname, skipping call command');
            return;
        }
        if ((pname === this.PACK_ALIGNMENT || pname === this.UNPACK_ALIGNMENT) &&
            (param !== 1 || param !== 2 || param !== 4 || param !== 8)) {
            console.warn('pixelStorei - invalid param for PACK_ALIGNMENT or UNPACK_ALIGNMENT, must be 1, 2, 4 or 8, skipping call command');
            return;
        }
        if ((pname === this.UNPACK_FLIP_Y_WEBGL || pname === this.UNPACK_PREMULTIPLY_ALPHA_WEBGL) &&
            typeof param !== 'boolean') {
            console.warn('pixelStorei - invalid param for UNPACK_FLIP_Y_WEBGL or UNPACK_PREMULTIPLY_ALPHA_WEBGL, must be true or false, skipping call command');
            return;
        }
        if (pname === this.UNPACK_COLORSPACE_CONVERSION_WEBGL &&
            (param !== this.BROWSER_DEFAULT_WEBGL || param !== this.NONE)) {
            console.warn('pixelStorei - invalid param for UNPACK_COLORSPACE_CONVERSION_WEBGL, must be BROWSER_DEFAULT_WEBGL or NONE, skipping call command');
            return;
        }
    }
    if (this._contextLost) {
        return;
    }
    var key = MapKeys.pixelStorei + pname;
    var value = this._stateMap.get(key);
    if (value !== param) {
        this._gl.pixelStorei(pname, param);
        this._stateMap.set(key, param);
    }
};

/**
 * Specifies the scale factors and units to calculate depth values.
 * The offset is added before the depth test is performed and before the value is written into the depth buffer.
 * The default values are 0.
 *
 * @param {Number} factor A GLfloat which sets the scale factor for the variable depth offset for each polygon
 * @param {Number} units A GLfloat which sets the multiplier by which an implementation-specific value is multiplied
 * with to create a constant depth offset
 */
GLState.prototype.polygonOffset = function (factor, units) {
    if (!GL_STATE_DISABLE_VALIDATIONS) {
        if (!validate.isNumeric(factor)) {
            console.warn('polygonOffset - invalid factor, must be a number, skipping call command');
            return;
        }
        if (!validate.isNumeric(units)) {
            console.warn('polygonOffset - invalid units, must be a number, skipping call command');
            return;
        }
    }
    if (this._contextLost) {
        return;
    }
    var key = MapKeys.polygonOffset;
    var value = this._stateMap.get(key);
    if (!value) {
        this._gl.polygonOffset(factor, units);
        this._stateMap.set(key, [factor, units]);
    }
    else if (value[0] !== factor || value[1] !== units) {
        this._gl.polygonOffset(factor, units);
        value[0] = factor;
        value[1] = units;
    }
};

GLState.prototype.readPixels = function (x, y, width, height, format, type, pixels) {
    if (this._contextLost) {
        return;
    }
    this._gl.readPixels(x, y, width, height, format, type, pixels);
};

GLState.prototype.renderbufferStorage = function (target, internalFormat, width, height) {
    if (this._contextLost) {
        return;
    }
    this._gl.renderbufferStorage(target, internalFormat, width, height);
};

/**
 * Specifies multi-sample coverage parameters for anti-aliasing effects.
 *
 * @param {Number} value A GLclampf which sets a single floating-point coverage value clamped to the range [0,1].
 * The default value is 1.0.
 *
 * @param {Boolean} invert A GLboolean which sets whether or not the coverage masks should be inverted.
 * The default value is false.
 */
GLState.prototype.sampleCoverage = function (value, invert) {
    if (!GL_STATE_DISABLE_VALIDATIONS) {
        if (!validate.isClampf(value)) {
            console.warn('sampleCoverage - invalid value, must be between 0 and 1, skipping call command');
            return;
        }
        if (typeof invert !== 'boolean') {
            console.warn('sampleCoverage - invalid invert, must be true or false, skipping call command');
            return;
        }
    }
    if (this._contextLost) {
        return;
    }
    var key = MapKeys.sampleCoverage;
    var val = this._stateMap.get(key);
    if (!val) {
        this._gl.sampleCoverage(value, invert);
        this._stateMap.set(key, [value, invert]);
    }
    else if (val[0] !== value || val[1] !== invert) {
        this._gl.sampleCoverage(value, invert);
        val[0] = value;
        val[1] = invert;
    }
};

/**
 * Sets a scissor box, which limits the drawing to a specified rectangle.
 *
 * @param {Number} x A GLint specifying the horizontal coordinate for the lower left corner of the box. Default value: 0.
 * @param {Number} y A GLint specifying the vertical coordinate for the lower left corner of the box. Default value: 0.
 * @param {Number} width A non-negative Glsizei specifying the width of the scissor box. Default value: width of the canvas.
 * @param {Number} height A non-negative Glsizei specifying the height of the scissor box. Default value: height of the canvas.
 */
GLState.prototype.scissor = function (x, y, width, height) {
    if (!GL_STATE_DISABLE_VALIDATIONS) {
        if (!validate.isUInt(x)) {
            console.warn('scissor - invalid x value, must be a natural number, skipping call command');
            return;
        }
        if (!validate.isUInt(y)) {
            console.warn('scissor - invalid y value, must be a natural number, skipping call command');
            return;
        }
        if (!validate.isUInt(width)) {
            console.warn('scissor - invalid width, must be a natural number, skipping call command');
            return;
        }
        if (!validate.isUInt(height)) {
            console.warn('scissor - invalid height, must be a natural number, skipping call command');
            return;
        }
    }
    if (this._contextLost) {
        return;
    }
    var key = MapKeys.scissor;
    var value = this._stateMap.get(key);
    if (!value) {
        this._gl.scissor(x, y, width, height);
        this._stateMap.set(key, [x, y, width, height]);
    }
    else if (value[0] !== x || value[1] !== y || value[2] !== width || value[3] !== height) {
        this._gl.scissor(x, y, width, height);
        value[0] = x;
        value[1] = y;
        value[2] = width;
        value[3] = height;
    }
};

GLState.prototype.shaderSource = function (shader, source) {
    if (this._contextLost) {
        return;
    }
    this._gl.shaderSource(shader, source);
};

/**
 * Sets the front and back function and reference value for stencil testing.
 *
 * @param {Number} func A GLenum specifying the test function.
 * The default function is gl.ALWAYS.
 * The possible values are:
 * gl.NEVER: Never pass.
 * gl.LESS: Pass if (ref & mask) <  (stencil & mask).
 * gl.EQUAL: Pass if (ref & mask) =  (stencil & mask).
 * gl.LEQUAL: Pass if (ref & mask) <= (stencil & mask).
 * gl.GREATER: Pass if (ref & mask) >  (stencil & mask).
 * gl.NOTEQUAL: Pass if (ref & mask) != (stencil & mask).
 * gl.GEQUAL: Pass if (ref & mask) >= (stencil & mask).
 * gl.ALWAYS: Always pass.
 *
 * @param {Number} ref A GLint specifying the reference value for the stencil test.
 * This value is clamped to the range 0 to 2n -1 where n is the number of bitplanes in the stencil buffer.
 * The default value is 0.
 *
 * @param {Number} mask A GLuint specifying a bit-wise mask that is used to AND the reference value and the stored
 * stencil value when the test is done.
 * The default value is all 1.
 */
GLState.prototype.stencilFunc = function (func, ref, mask) {
    if (!GL_STATE_DISABLE_VALIDATIONS) {
        if (!validate.isValidFunc(func)) {
            console.warn('stencilFunc - invalid func, skipping call command');
            return;
        }
        if (!validate.isUInt(ref)) {
            console.warn('stencilFunc - invalid ref, must be a natural number, skipping call command');
            return;
        }
        if (!validate.isUInt(mask)) {
            console.warn('stencilFunc - invalid mask, must be a natural number, skipping call command');
            return;
        }
    }
    if (this._contextLost) {
        return;
    }
    var key = MapKeys.stencilFunc;
    var value = this._stateMap.get(key);
    if (!value) {
        this._gl.stencilFunc(func, ref, mask);
        this._stateMap.set(key, [func, ref, mask]);
    }
    else if (value[0] !== func || value[1] !== ref || value[2] !== mask) {
        this._gl.stencilFunc(func, ref, mask);
        value[0] = func;
        value[1] = ref;
        value[2] = mask;
    }
};

/**
 * Ssets the front and/or back function and reference value for stencil testing.
 * Stencilling enables and disables drawing on a per-pixel basis.
 * It is typically used in multipass rendering to achieve special effects.
 *
 * @param {Number} face A GLenum specifying whether the front and/or back stencil state is updated.
 * The possible values are:
 * gl.FRONT
 * gl.BACK
 * gl.FRONT_AND_BACK
 *
 * @param {Number} func A GLenum specifying the test function. The default function is gl.ALWAYS.
 * The possible values are:
 * gl.NEVER: Never pass.
 * gl.LESS: Pass if (ref & mask) <  (stencil & mask).
 * gl.EQUAL: Pass if (ref & mask) =  (stencil & mask).
 * gl.LEQUAL: Pass if (ref & mask) <= (stencil & mask).
 * gl.GREATER: Pass if (ref & mask) >  (stencil & mask).
 * gl.NOTEQUAL: Pass if (ref & mask) != (stencil & mask).
 * gl.GEQUAL: Pass if (ref & mask) >= (stencil & mask).
 * gl.ALWAYS: Always pass.
 *
 * @param {Number} ref A GLint specifying the reference value for the stencil test.
 * This value is clamped to the range 0 to 2n -1 where n is the number of bitplanes in the stencil buffer.
 * The default value is 0.
 *
 * @param {Number} mask A GLuint specifying a bit-wise mask that is used to AND the reference value and the stored stencil value when the test is done.
 * The default value is all 1.
 */
GLState.prototype.stencilFuncSeparate = function (face, func, ref, mask) {
    if (!GL_STATE_DISABLE_VALIDATIONS) {
        if (!validate.isValidFace(face)) {
            console.warn('stencilFuncSeparate - invalid face, must be FRONT, BACK or FRONT_AND_BACK, skipping call command');
            return;
        }
        if (!validate.isValidFunc(func)) {
            console.warn('stencilFuncSeparate - invalid func, skipping call command');
            return;
        }
        if (!validate.isUInt(ref)) {
            console.warn('stencilFuncSeparate - invalid ref, must be a natural number, skipping call command');
            return;
        }
        if (!validate.isUInt(mask)) {
            console.warn('stencilFuncSeparate - invalid mask, must be a natural number, skipping call command');
            return;
        }
    }
    if (this._contextLost) {
        return;
    }
    var key = MapKeys.stencilFuncSeparate + face;
    var values = this._stateMap.get(key);
    if (!values) {
        this._gl.stencilFuncSeparate(face, func, ref, mask);
        this._stateMap.set(key, [func, ref, mask]);
    }
    else if (values[0] !== func || values[1] !== ref || values[2] !== mask) {
        this._gl.stencilFuncSeparate(face, func, ref, mask);
        values[0] = func;
        values[1] = ref;
        values[2] = mask;
    }
};

/**
 * Controls enabling and disabling of both the front and back writing of individual bits in the stencil planes.
 * @param {Number} mask A GLuint specifying a bit mask to enable or disable writing of individual bits in the stencil planes.
 * By default, the mask is all 1.
 */
GLState.prototype.stencilMask = function (mask) {
    if (!GL_STATE_DISABLE_VALIDATIONS) {
        if (!validate.isUInt(mask)) {
            console.warn('stencilMask - invalid mask, must be a natural number, skipping call command');
            return;
        }
    }
    if (this._contextLost) {
        return;
    }
    var key = MapKeys.stencilMask;
    var value = this._stateMap.get(key);
    if (value !== mask) {
        this._gl.stencilMask(mask);
        this._stateMap.set(key, mask);
    }
};

/**
 * Controls enabling and disabling of front and/or back writing of individual bits in the stencil planes.
 * The WebGLRenderingContext.stencilMask() method can set both, the front and back stencil writemasks to one value at the same time.
 *
 * @param {Number} face A GLenum specifying whether the front and/or back stencil writemask is updated.
 * The possible values are:
 * gl.FRONT
 * gl.BACK
 * gl.FRONT_AND_BACK
 *
 * @param {Number} mask A GLuint specifying a bit mask to enable or disable writing of individual bits in the stencil planes.
 * By default, the mask is all 1.
 */
GLState.prototype.stencilMaskSeparate = function (face, mask) {
    if (!GL_STATE_DISABLE_VALIDATIONS) {
        if (!validate.isValidFace(face)) {
            console.warn('stencilMaskSeparate - invalid face, must be FRONT, BACK or FRONT_AND_BACK, skipping call command');
            return;
        }
        if (!validate.isUInt(mask)) {
            console.warn('stencilMaskSeparate - invalid mask, must be a natural number, skipping call command');
            return;
        }
    }
    if (this._contextLost) {
        return;
    }
    var key = MapKeys.stencilMaskSeparate + face;
    var value = this._stateMap.get(key);
    if (value !== mask) {
        this._gl.stencilMaskSeparate(face, mask);
        this._stateMap.set(key, mask);
    }
};

/**
 * Sets both the front and back-facing stencil test actions.
 *
 * @param {Number} fail A GLenum specifying the function to use when the stencil test fails.
 * The default value is gl.KEEP.
 *
 * @param {Number} zfail A GLenum specifying the function to use when the stencil test passes, but the depth test fails.
 * The default value is gl.KEEP.
 *
 * @param {Number} zpass A GLenum specifying the function to use when both the stencil test and the depth test pass,
 * or when the stencil test passes and there is no depth buffer or depth testing is disabled.
 * The default value is gl.KEEP.
 */
GLState.prototype.stencilOp = function (fail, zfail, zpass) {
    if (!GL_STATE_DISABLE_VALIDATIONS) {
        if (!validate.isValidStencilOp(fail)) {
            console.warn('stencilOp - invalid fail value, skipping call command');
            return;
        }
        if (!validate.isValidStencilOp(zfail)) {
            console.warn('stencilOp - invalid zfail value, skipping call command');
            return;
        }
        if (!validate.isValidStencilOp(zpass)) {
            console.warn('stencilOp - invalid zpass value, skipping call command');
            return;
        }
    }
    if (this._contextLost) {
        return;
    }
    var key = MapKeys.stencilOp;
    var value = this._stateMap.get(key);
    if (!value) {
        this._gl.stencilOp(fail, zfail, zpass);
        this._stateMap.set(key, [fail, zfail, zpass]);
    }
    else if (value[0] !== fail || value[1] !== zfail || value[2] !== zpass) {
        this._gl.stencilOp(fail, zfail, zpass);
        value[0] = fail;
        value[1] = zfail;
        value[2] = zpass;
    }
};

/**
 * Sets the front and/or back-facing stencil test actions.
 *
 * @param {Number} face A GLenum specifying whether the front and/or back stencil state is updated.
 * The possible values are:
 * gl.FRONT
 * gl.BACK
 * gl.FRONT_AND_BACK
 *
 * @param {Number} fail A GLenum specifying the function to use when the stencil test fails.
 * The default value is gl.KEEP.
 *
 * @param {Number} zfail A GLenum specifying the function to use when the stencil test passes, but the depth test fails.
 * The default value is gl.KEEP.
 *
 * @param {Number} zpass A GLenum specifying the function to use when both the stencil test and the depth test pass,
 * or when the stencil test passes and there is no depth buffer or depth testing is disabled.
 * The default value is gl.KEEP.
 */
GLState.prototype.stencilOpSeparate = function (face, fail, zfail, zpass) {
    if (!GL_STATE_DISABLE_VALIDATIONS) {
        if (!validate.isValidFace(face)) {
            console.warn('stencilOpSeparate - invalid face, must be FRONT, BACK or FRONT_AND_BACK, skipping call command');
            return;
        }
        if (!validate.isValidStencilOp(fail)) {
            console.warn('stencilOpSeparate - invalid fail value, skipping call command');
            return;
        }
        if (!validate.isValidStencilOp(zfail)) {
            console.warn('stencilOpSeparate - invalid zfail value, skipping call command');
            return;
        }
        if (!validate.isValidStencilOp(zpass)) {
            console.warn('stencilOpSeparate - invalid zpass value, skipping call command');
            return;
        }
    }
    if (this._contextLost) {
        return;
    }
    var key = MapKeys.stencilOpSeparate + face;
    var value = this._stateMap.get(key);
    if (!value) {
        this._gl.stencilOpSeparate(face, fail, zfail, zpass);
        this._stateMap.set(key + face, [fail, zfail, zpass]);
    }
    else if (value[0] !== fail || value[1] !== zfail || value[2] !== zpass) {
        this._gl.stencilOp(fail, zfail, zpass);
        value[0] = fail;
        value[1] = zfail;
        value[2] = zpass;
    }
};

GLState.prototype.texImage2D = function (target, level, internalformat, width, height, border, format, type, pixels) {
    if (this._contextLost) {
        return;
    }
    this._gl.texImage2D(target, level, internalformat, width, height, border, format, type, pixels);
};

GLState.prototype.texParameterf = function (target, pname, param) {
    if (this._contextLost) {
        return;
    }
    this._gl.texParameterf(target, pname, param);
};

GLState.prototype.texParameteri = function (target, pname, param) {
    if (this._contextLost) {
        return;
    }
    this._gl.texParameteri(target, pname, param);
};

GLState.prototype.texSubImage2D = function (target, level, xoffset, yoffset, width, height, format, type, pixels) {
    if (this._contextLost) {
        return;
    }
    this._gl.texSubImage2D(target, level, xoffset, yoffset, width, height, format, type, pixels);
};

GLState.prototype.uniform1f = function (location, v0) {
    if (this._contextLost) {
        return;
    }
    this._gl.uniform1f(location, v0);
};

GLState.prototype.uniform1fv = function (location, value) {
    if (this._contextLost) {
        return;
    }
    this._gl.uniform1fv(location, value);
};

GLState.prototype.uniform1i = function (location, v0) {
    if (this._contextLost) {
        return;
    }
    this._gl.uniform1i(location, v0);
};

GLState.prototype.uniform1iv = function (location, value) {
    if (this._contextLost) {
        return;
    }
    this._gl.uniform1iv(location, value);
};

GLState.prototype.uniform2f = function (location, v0, v1) {
    if (this._contextLost) {
        return;
    }
    this._gl.uniform2f(location, v0, v1);
};

GLState.prototype.uniform2fv = function (location, value) {
    if (this._contextLost) {
        return;
    }
    this._gl.uniform2fv(location, value);
};

GLState.prototype.uniform2i = function (location, v0, v1) {
    if (this._contextLost) {
        return;
    }
    this._gl.uniform2i(location, v0, v1);
};

GLState.prototype.uniform2iv = function (location, value) {
    if (this._contextLost) {
        return;
    }
    this._gl.uniform2iv(location, value);
};

GLState.prototype.uniform3f = function (location, v0, v1, v2) {
    if (this._contextLost) {
        return;
    }
    this._gl.uniform3f(location, v0, v1, v2);
};

GLState.prototype.uniform3fv = function (location, value) {
    if (this._contextLost) {
        return;
    }
    this._gl.uniform3fv(location, value);
};

GLState.prototype.uniform3i = function (location, v0, v1, v2) {
    if (this._contextLost) {
        return;
    }
    this._gl.uniform3i(location, v0, v1, v2);
};

GLState.prototype.uniform3iv = function (location, value) {
    if (this._contextLost) {
        return;
    }
    this._gl.uniform3iv(location, value);
};

GLState.prototype.uniform4f = function (location, v0, v1, v2, v3) {
    if (this._contextLost) {
        return;
    }
    this._gl.uniform4f(location, v0, v1, v2, v3);
};

GLState.prototype.uniform4fv = function (location, value) {
    if (this._contextLost) {
        return;
    }
    this._gl.uniform4fv(location, value);
};

GLState.prototype.uniform4i = function (location, v0, v1, v2, v3) {
    if (this._contextLost) {
        return;
    }
    this._gl.uniform4i(location, v0, v1, v2, v3);
};

GLState.prototype.uniform4iv = function (location, value) {
    if (this._contextLost) {
        return;
    }
    this._gl.uniform4iv(location, value);
};

GLState.prototype.uniformMatrix2fv = function (location, transpose, value) {
    if (this._contextLost) {
        return;
    }
    this._gl.uniformMatrix2fv(location, false, value);
};

GLState.prototype.uniformMatrix3fv = function (location, transpose, value) {
    if (this._contextLost) {
        return;
    }
    this._gl.uniformMatrix3fv(location, false, value);
};

GLState.prototype.uniformMatrix4fv = function (location, transpose, value) {
    if (this._contextLost) {
        return;
    }
    this._gl.uniformMatrix4fv(location, false, value);
};

GLState.prototype.useProgram = function (program) {
    if (this._contextLost) {
        return;
    }
    var key = MapKeys.useProgram;
    var value = this._stateMap.get(key);
    if (value !== program) {
        this._gl.useProgram(program);
        this._stateMap.set(key, program);
    }
};

GLState.prototype.validateProgram = function (program) {
    if (this._contextLost) {
        return;
    }
    this._gl.validateProgram(program);
};

GLState.prototype.vertexAttrib1f = function (index, v0) {
    if (this._contextLost) {
        return;
    }
    this._gl.vertexAttrib1f(index, v0);
};

GLState.prototype.vertexAttrib2f = function (index, v0, v1) {
    if (this._contextLost) {
        return;
    }
    this._gl.vertexAttrib2f(index, v0, v1);
};

GLState.prototype.vertexAttrib3f = function (index, v0, v1, v2) {
    if (this._contextLost) {
        return;
    }
    this._gl.vertexAttrib3f(index, v0, v1, v2);
};

GLState.prototype.vertexAttrib4f = function (index, v0, v1, v2, v3) {
    if (this._contextLost) {
        return;
    }
    this._gl.vertexAttrib4f(index, v0, v1, v2, v3);
};

GLState.prototype.vertexAttrib1fv = function (index, value) {
    if (this._contextLost) {
        return;
    }
    this._gl.vertexAttrib1fv(index, value);
};

GLState.prototype.vertexAttrib2fv = function (index, value) {
    if (this._contextLost) {
        return;
    }
    this._gl.vertexAttrib2fv(index, value);
};

GLState.prototype.vertexAttrib3fv = function (index, value) {
    if (this._contextLost) {
        return;
    }
    this._gl.vertexAttrib3fv(index, value);
};

GLState.prototype.vertexAttrib4fv = function (index, value) {
    if (this._contextLost) {
        return;
    }
    this._gl.vertexAttrib4fv(index, value);
};

GLState.prototype.vertexAttribPointer = function (index, size, type, normalized, stride, offset) {
    if (this._contextLost) {
        return;
    }
    this._gl.vertexAttribPointer(index, size, type, normalized, stride, offset);
};

GLState.prototype.viewport = function (x, y, width, height) {
    if (this._contextLost) {
        return;
    }
    this._gl.viewport(x, y, width, height);
};

module.exports = GLState;