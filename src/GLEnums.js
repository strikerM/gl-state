/**
 * Created by Florin on 31-Dec-16.
 */

function GLEnums() {
}

GLEnums.prototype = {

    constructor: GLEnums,

    //Clearing buffers.
    //Passed to clear
    DEPTH_BUFFER_BIT: 0x00000100, //clear the current depth buffer.
    STENCIL_BUFFER_BIT: 0x00000400, //clear the current stencil buffer.
    COLOR_BUFFER_BIT: 0x00004000, //clear the current color buffer.

    //Rendering primitives.
    //Passed to drawElements or drawArrays
    POINTS: 0x0000, //Draw single points.
    LINES: 0x0001, //Draw lines. Each vertex connects to the one after it.
    LINE_LOOP: 0x0002, //Draw lines. Each set of two vertices is treated as a separate line segment.
    LINE_STRIP: 0x0003, //Draw a connected group of line segments from the first vertex to the last.
    TRIANGLES: 0x0004, //Draw triangles. Each set of three vertices creates a separate triangle.
    TRIANGLE_STRIP: 0x0005, //Draw a connected group of triangles.
    TRIANGLE_FAN: 0x0006, //Draw a connected group of triangles. Each vertex connects to the previous and the first vertex in the fan.

    //Blending modes.
    //Passed to blendFunc or blendFuncSeparate
    ZERO: 0, //turn off a component.
    ONE: 1, //turn on a component.
    SRC_COLOR: 0x0300, //multiply a component by the source elements color.
    ONE_MINUS_SRC_COLOR: 0x0301, //multiply a component by one minus the source elements color.
    SRC_ALPHA: 0x0302, //multiply a component by the source's alpha.
    ONE_MINUS_SRC_ALPHA: 0x0303, //multiply a component by one minus the source's alpha.
    DST_ALPHA: 0x0304, //multiply a component by the destination's alpha.
    ONE_MINUS_DST_ALPHA: 0x0305, //multiply a component by one minus the destination's alpha.
    DST_COLOR: 0x0306, //multiply a component by the destination's color.
    ONE_MINUS_DST_COLOR: 0x0307, //multiply a component by one minus the destination's color.
    SRC_ALPHA_SATURATE: 0x0308, //multiply a component by the minimum of source's alpha or one minus the destination's alpha.
    CONSTANT_COLOR: 0x8001, //specify a constant color blend function.
    ONE_MINUS_CONSTANT_COLOR: 0x8002, //specify one minus a constant color blend function.
    CONSTANT_ALPHA: 0x8003, //specify a constant alpha blend function.
    ONE_MINUS_CONSTANT_ALPHA: 0x8004, //specify one minus a constant alpha blend function.

    //Blending equations. Passed to blendEquation or blendEquationSeparate
    FUNC_ADD: 0x8006, //set an addition blend function.
    FUNC_SUBTRACT: 0x800A, //specify a subtraction blend function (source - destination).
    FUNC_REVERSE_SUBTRACT: 0x800B, //specify a reverse subtraction blend function (destination - source).

    //Getting GL parameter information.
    //Passed to getParameter
    BLEND_EQUATION: 0x8009, //get the current RGB blend function.
    BLEND_EQUATION_RGB: 0x8009, //get the current RGB blend function. Same as BLEND_EQUATION
    BLEND_EQUATION_ALPHA: 0x883D, //get the current alpha blend function. Same as BLEND_EQUATION
    BLEND_DST_RGB: 0x80C8, //get the current destination RGB blend function.
    BLEND_SRC_RGB: 0x80C9, //get the current destination RGB blend function.
    BLEND_DST_ALPHA: 0x80CA, //get the current destination alpha blend function.
    BLEND_SRC_ALPHA: 0x80CB, //get the current source alpha blend function.
    BLEND_COLOR: 0x8005, //return a the current blend color.
    ARRAY_BUFFER_BINDING: 0x8894, //get the array buffer binding.
    ELEMENT_ARRAY_BUFFER_BINDING: 0x8895, //get the current element array buffer.
    LINE_WIDTH: 0x0B21, //get the current lineWidth (set by the lineWidth method).
    ALIASED_POINT_SIZE_RANGE: 0x846D, //get the current size of a point drawn with gl.POINTS
    ALIASED_LINE_WIDTH_RANGE: 0x846E, //get the range of available widths for a line. Returns a length-2 array with the lo value at 0, and hight at 1.
    CULL_FACE_MODE: 0x0B45, //get the current value of cullFace. Should return FRONT, BACK, or FRONT_AND_BACK
    FRONT_FACE: 0x0B46, //determine the current value of frontFace. Should return CW or CCW.
    DEPTH_RANGE: 0x0B70, //return a length-2 array of floats giving the current depth range.
    DEPTH_WRITEMASK: 0x0B72, //determine if the depth write mask is enabled.
    DEPTH_CLEAR_VALUE: 0x0B73, //determine the current depth clear value.
    DEPTH_FUNC: 0x0B74, //get the current depth function. Returns NEVER, ALWAYS, LESS, EQUAL, LEQUAL, GREATER, GEQUAL, or NOTEQUAL.
    STENCIL_CLEAR_VALUE: 0x0B91, //get the value the stencil will be cleared to.
    STENCIL_FUNC: 0x0B92, //get the current stencil function. Returns NEVER, ALWAYS, LESS, EQUAL, LEQUAL, GREATER, GEQUAL, or NOTEQUAL.
    STENCIL_FAIL: 0x0B94, //get the current stencil fail function. Should return KEEP, REPLACE, INCR, DECR, INVERT, INCR_WRAP, or DECR_WRAP.
    STENCIL_PASS_DEPTH_FAIL: 0x0B95, //get the current stencil fail function should the depth buffer test fail. Should return KEEP, REPLACE, INCR, DECR, INVERT, INCR_WRAP, or DECR_WRAP.
    STENCIL_PASS_DEPTH_PASS: 0x0B96, //get the current stencil fail function should the depth buffer test pass. Should return KEEP, REPLACE, INCR, DECR, INVERT, INCR_WRAP, or DECR_WRAP.
    STENCIL_REF: 0x0B97, //get the reference value used for stencil tests.
    STENCIL_VALUE_MASK: 0x0B93,
    STENCIL_WRITEMASK: 0x0B98,
    STENCIL_BACK_FUNC: 0x8800,
    STENCIL_BACK_FAIL: 0x8801,
    STENCIL_BACK_PASS_DEPTH_FAIL: 0x8802,
    STENCIL_BACK_PASS_DEPTH_PASS: 0x8803,
    STENCIL_BACK_REF: 0x8CA3,
    STENCIL_BACK_VALUE_MASK: 0x8CA4,
    STENCIL_BACK_WRITEMASK: 0x8CA5,
    VIEWPORT: 0x0BA2, //Returns an Int32Array with four elements for the current viewport dimensions.
    SCISSOR_BOX: 0x0C10, //Returns an Int32Array with four elements for the current scissor box dimensions.
    COLOR_CLEAR_VALUE: 0x0C22,
    COLOR_WRITEMASK: 0x0C23,
    UNPACK_ALIGNMENT: 0x0CF5,
    PACK_ALIGNMENT: 0x0D05,
    MAX_TEXTURE_SIZE: 0x0D33,
    MAX_VIEWPORT_DIMS: 0x0D3A,
    SUBPIXEL_BITS: 0x0D50,
    RED_BITS: 0x0D52,
    GREEN_BITS: 0x0D53,
    BLUE_BITS: 0x0D54,
    ALPHA_BITS: 0x0D55,
    DEPTH_BITS: 0x0D56,
    STENCIL_BITS: 0x0D57,
    POLYGON_OFFSET_UNITS: 0x2A00,
    POLYGON_OFFSET_FACTOR: 0x8038,
    TEXTURE_BINDING_2D: 0x8069,
    SAMPLE_BUFFERS: 0x80A8,
    SAMPLES: 0x80A9,
    SAMPLE_COVERAGE_VALUE: 0x80AA,
    SAMPLE_COVERAGE_INVERT: 0x80AB,
    COMPRESSED_TEXTURE_FORMATS: 0x86A3,
    VENDOR: 0x1F00,
    RENDERER: 0x1F01,
    VERSION: 0x1F02,
    IMPLEMENTATION_COLOR_READ_TYPE: 0x8B9A,
    IMPLEMENTATION_COLOR_READ_FORMAT: 0x8B9B,
    BROWSER_DEFAULT_WEBGL: 0x9244,

    //Buffers
    STATIC_DRAW: 0x88E4, //Passed to bufferData as a hint about whether the contents of the buffer are likely to be used often and not change often.
    STREAM_DRAW: 0x88E0, //Passed to bufferData as a hint about whether the contents of the buffer are likely to not be used often.
    DYNAMIC_DRAW: 0x88E8, //Passed to bufferData as a hint about whether the contents of the buffer are likely to be used often and change often.
    ARRAY_BUFFER: 0x8892, //	Passed to bindBuffer or bufferData to specify the type of buffer being used.
    ELEMENT_ARRAY_BUFFER: 0x8893, //Passed to bindBuffer or bufferData to specify the type of buffer being used.
    BUFFER_SIZE: 0x8764, //Passed to getBufferParameter to get a buffer's size.
    BUFFER_USAGE: 0x8765, //Passed to getBufferParameter to get the hint for the buffer passed in when it was created.

    //Vertex attributes.
    //Passed to getVertexAttrib()
    CURRENT_VERTEX_ATTRIB: 0x8626, //read back the current vertex attribute.
    VERTEX_ATTRIB_ARRAY_ENABLED: 0x8622,
    VERTEX_ATTRIB_ARRAY_SIZE: 0x8623,
    VERTEX_ATTRIB_ARRAY_STRIDE: 0x8624,
    VERTEX_ATTRIB_ARRAY_TYPE: 0x8625,
    VERTEX_ATTRIB_ARRAY_NORMALIZED: 0x886A,
    VERTEX_ATTRIB_ARRAY_POINTER: 0x8645,
    VERTEX_ATTRIB_ARRAY_BUFFER_BINDING: 0x889F,

    //Culling.
    //Constants passed to WebGLRenderingContext.cullFace()
    CULL_FACE: 0x0B44, //Passed to enable/disable to turn on/off culling. Can also be used with getParameter to find the current culling method.
    FRONT: 0x0404, //Passed to cullFace to specify that only front faces should be drawn.
    BACK: 0x0405, //Passed to cullFace to specify that only back faces should be drawn.
    FRONT_AND_BACK: 0x0408, //Passed to cullFace to specify that front and back faces should be drawn.

    //Enabling and disabling.
    //Constants passed to WebGLRenderingContext.enable() or WebGLRenderingContext.disable().
    BLEND: 0x0BE2, //turn on/off blending. Can also be used with getParameter to find the current blending method.
    DEPTH_TEST: 0x0B71, //turn on/off the depth test. Can also be used with getParameter to query the depth test.
    DITHER: 0x0BD0, //turn on/off dithering. Can also be used with getParameter to find the current dithering method.
    POLYGON_OFFSET_FILL: 0x8037, //turn on/off the polygon offset. Useful for rendering hidden-line images, decals, and or solids with highlighted edges. Can also be used with getParameter to query the scissor test.
    SAMPLE_ALPHA_TO_COVERAGE: 0x809E, //turn on/off the alpha to coverage. Used in multi-sampling alpha channels.
    SAMPLE_COVERAGE: 0x80A0, //turn on/off the sample coverage. Used in multi-sampling.
    SCISSOR_TEST: 0x0C11, //turn on/off the scissor test. Can also be used with getParameter to query the scissor test.
    STENCIL_TEST: 0x0B90, //turn on/off the stencil test. Can also be used with getParameter to query the stencil test.

    //Errors.
    //Constants returned from WebGLRenderingContext.getError().
    NO_ERROR: 0,
    INVALID_ENUM: 0x0500,
    INVALID_VALUE: 0x0501,
    INVALID_OPERATION: 0x0502,
    OUT_OF_MEMORY: 0x0505,
    CONTEXT_LOST_WEBGL: 0x9242,

    //Front face directions.
    //Constants passed to WebGLRenderingContext.frontFace().
    CW: 0x0900, //specify the front face of a polygon is drawn in the clockwise direction
    CCW: 0x0901, //specify the front face of a polygon is drawn in the counter clockwise direction

//Hints.
//Constants passed to WebGLRenderingContext.hint()
    DONT_CARE: 0x1100, //There is no preference for this behavior.
    FASTEST: 0x1101, //The most efficient behavior should be used.
    NICEST: 0x1102, //The most correct or the highest quality option should be used.
    GENERATE_MIPMAP_HINT: 0x8192, //Hint for the quality of filtering when generating mipmap images with WebGLRenderingContext.generateMipmap().

    //Data types
    BYTE: 0x1400,
    UNSIGNED_BYTE: 0x1401,
    SHORT: 0x1402,
    UNSIGNED_SHORT: 0x1403,
    INT: 0x1404,
    UNSIGNED_INT: 0x1405,
    FLOAT: 0x1406,

    //Pixel formats
    DEPTH_COMPONENT: 0x1902,
    ALPHA: 0x1906,
    RGB: 0x1907,
    RGBA: 0x1908,
    LUMINANCE: 0x1909,
    LUMINANCE_ALPHA: 0x190A,

    //Pixel types
    //UNSIGNED_BYTE: 0x1401, //already declared in Data types
    UNSIGNED_SHORT_4_4_4_4: 0x8033,
    UNSIGNED_SHORT_5_5_5_1: 0x8034,
    UNSIGNED_SHORT_5_6_5: 0x8363,

    //Shaders.
    //Constants passed to WebGLRenderingContext.createShader() or WebGLRenderingContext.getShaderParameter()
    FRAGMENT_SHADER: 0x8B30, //Passed to createShader to define a fragment shader.
    VERTEX_SHADER: 0x8B31, //Passed to createShader to define a vertex shader
    COMPILE_STATUS: 0x8B81, //Passed to getShaderParamter to get the status of the compilation. Returns false if the shader was not compiled. You can then query getShaderInfoLog to find the exact error
    DELETE_STATUS: 0x8B80, //Passed to getShaderParamter to determine if a shader was deleted via deleteShader. Returns true if it was, false otherwise.
    LINK_STATUS: 0x8B82, //Passed to getProgramParameter after calling linkProgram to determine if a program was linked correctly. Returns false if there were errors. Use getProgramInfoLog to find the exact error.
    VALIDATE_STATUS: 0x8B83, //Passed to getProgramParameter after calling validateProgram to determine if it is valid. Returns false if errors were found.
    ATTACHED_SHADERS: 0x8B85, //Passed to getProgramParameter after calling attachShader to determine if the shader was attached correctly. Returns false if errors occurred.
    ACTIVE_ATTRIBUTES: 0x8B89, //Passed to getProgramParameter to get the number of attributes active in a program.
    ACTIVE_UNIFORMS: 0x8B86, //Passed to getProgramParamter to get the number of uniforms active in a program.
    MAX_VERTEX_ATTRIBS: 0x8869,
    MAX_VERTEX_UNIFORM_VECTORS: 0x8DFB,
    MAX_VARYING_VECTORS: 0x8DFC,
    MAX_COMBINED_TEXTURE_IMAGE_UNITS: 0x8B4D,
    MAX_VERTEX_TEXTURE_IMAGE_UNITS: 0x8B4C,
    MAX_TEXTURE_IMAGE_UNITS: 0x8872, //Implementation dependent number of maximum texture units. At least 8.
    MAX_FRAGMENT_UNIFORM_VECTORS: 0x8DFD,
    SHADER_TYPE: 0x8B4F,
    SHADING_LANGUAGE_VERSION: 0x8B8C,
    CURRENT_PROGRAM: 0x8B8D,

    //Depth or stencil tests.
    //Constants passed to WebGLRenderingContext.depthFunc() or WebGLRenderingContext.stencilFunc().
    NEVER: 0x0200, //specify depth or stencil tests will never pass. i.e. Nothing will be drawn.
    ALWAYS: 0x0207, //specify depth or stencil tests will always pass. i.e. Pixels will be drawn in the order they are drawn.
    LESS: 0x0201, //specify depth or stencil tests will pass if the new depth value is less than the stored value.
    EQUAL: 0x0202, //specify depth or stencil tests will pass if the new depth value is equals to the stored value.
    LEQUAL: 0x0203, //specify depth or stencil tests will pass if the new depth value is less than or equal to the stored value.
    GREATER: 0x0204, //specify depth or stencil tests will pass if the new depth value is greater than the stored value.
    GEQUAL: 0x0206, //specify depth or stencil tests will pass if the new depth value is greater than or equal to the stored value.
    NOTEQUAL: 0x0205, //specify depth or stencil tests will pass if the new depth value is not equal to the stored value.

    //Stencil actions.
    //Constants passed to WebGLRenderingContext.stencilOp().
    KEEP: 0x1E00,
    REPLACE: 0x1E01,
    INCR: 0x1E02,
    DECR: 0x1E03,
    INVERT: 0x150A,
    INCR_WRAP: 0x8507,
    DECR_WRAP: 0x8508,

    //Textures.
    //Constants passed to WebGLRenderingContext.texParameteri(), WebGLRenderingContext.texParameterf(),
    // WebGLRenderingContext.bindTexture(), WebGLRenderingContext.texImage2D(), and others.
    NEAREST: 0x2600,
    LINEAR: 0x2601,
    NEAREST_MIPMAP_NEAREST: 0x2700,
    LINEAR_MIPMAP_NEAREST: 0x2701,
    NEAREST_MIPMAP_LINEAR: 0x2702,
    LINEAR_MIPMAP_LINEAR: 0x2703,
    TEXTURE_MAG_FILTER: 0x2800,
    TEXTURE_MIN_FILTER: 0x2801,
    TEXTURE_WRAP_S: 0x2802,
    TEXTURE_WRAP_T: 0x2803,
    TEXTURE_2D: 0x0DE1,
    TEXTURE: 0x1702,
    TEXTURE_CUBE_MAP: 0x8513,
    TEXTURE_BINDING_CUBE_MAP: 0x8514,
    TEXTURE_CUBE_MAP_POSITIVE_X: 0x8515,
    TEXTURE_CUBE_MAP_NEGATIVE_X: 0x8516,
    TEXTURE_CUBE_MAP_POSITIVE_Y: 0x8517,
    TEXTURE_CUBE_MAP_NEGATIVE_Y: 0x8518,
    TEXTURE_CUBE_MAP_POSITIVE_Z: 0x8519,
    TEXTURE_CUBE_MAP_NEGATIVE_Z: 0x851A,
    MAX_CUBE_MAP_TEXTURE_SIZE: 0x851C,
    TEXTURE0: 0x84C0,
    TEXTURE31: 0x84DF,
    ACTIVE_TEXTURE: 0x84E0,//The current active texture unit.
    REPEAT: 0x2901,
    CLAMP_TO_EDGE: 0x812F,
    MIRRORED_REPEAT: 0x8370,

    //Uniform types.
    FLOAT_VEC2: 0x8B50,
    FLOAT_VEC3: 0x8B51,
    FLOAT_VEC4: 0x8B52,
    INT_VEC2: 0x8B53,
    INT_VEC3: 0x8B54,
    INT_VEC4: 0x8B55,
    BOOL: 0x8B56,
    BOOL_VEC2: 0x8B57,
    BOOL_VEC3: 0x8B58,
    BOOL_VEC4: 0x8B59,
    FLOAT_MAT2: 0x8B5A,
    FLOAT_MAT3: 0x8B5B,
    FLOAT_MAT4: 0x8B5C,
    SAMPLER_2D: 0x8B5E,
    SAMPLER_CUBE: 0x8B60,

    //Shader precision-specified types.
    LOW_FLOAT: 0x8DF0,
    MEDIUM_FLOAT: 0x8DF1,
    HIGH_FLOAT: 0x8DF2,
    LOW_INT: 0x8DF3,
    MEDIUM_INT: 0x8DF4,
    HIGH_INT: 0x8DF5,

    //Framebuffers and renderbuffers.
    FRAMEBUFFER: 0x8D40,
    RENDERBUFFER: 0x8D41,
    RGBA4: 0x8056,
    RGB5_A1: 0x8057,
    RGB565: 0x8D62,
    DEPTH_COMPONENT16: 0x81A5,
    STENCIL_INDEX: 0x1901,
    STENCIL_INDEX8: 0x8D48,
    DEPTH_STENCIL: 0x84F9,
    RENDERBUFFER_WIDTH: 0x8D42,
    RENDERBUFFER_HEIGHT: 0x8D43,
    RENDERBUFFER_INTERNAL_FORMAT: 0x8D44,
    RENDERBUFFER_RED_SIZE: 0x8D50,
    RENDERBUFFER_GREEN_SIZE: 0x8D51,
    RENDERBUFFER_BLUE_SIZE: 0x8D52,
    RENDERBUFFER_ALPHA_SIZE: 0x8D53,
    RENDERBUFFER_DEPTH_SIZE: 0x8D54,
    RENDERBUFFER_STENCIL_SIZE: 0x8D55,
    FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE: 0x8CD0,
    FRAMEBUFFER_ATTACHMENT_OBJECT_NAME: 0x8CD1,
    FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL: 0x8CD2,
    FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE: 0x8CD3,
    COLOR_ATTACHMENT0: 0x8CE0,
    DEPTH_ATTACHMENT: 0x8D00,
    STENCIL_ATTACHMENT: 0x8D20,
    DEPTH_STENCIL_ATTACHMENT: 0x821A,
    NONE: 0,
    FRAMEBUFFER_COMPLETE: 0x8CD5,
    FRAMEBUFFER_INCOMPLETE_ATTACHMENT: 0x8CD6,
    FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT: 0x8CD7,
    FRAMEBUFFER_INCOMPLETE_DIMENSIONS: 0x8CD9,
    FRAMEBUFFER_UNSUPPORTED: 0x8CDD,
    FRAMEBUFFER_BINDING: 0x8CA6,
    RENDERBUFFER_BINDING: 0x8CA7,
    MAX_RENDERBUFFER_SIZE: 0x84E8,
    INVALID_FRAMEBUFFER_OPERATION: 0x0506,

    //Pixel storage modes.
    //Constants passed to WebGLRenderingContext.pixelStorei().
    UNPACK_FLIP_Y_WEBGL: 0x9240,
    UNPACK_PREMULTIPLY_ALPHA_WEBGL: 0x9241,
    UNPACK_COLORSPACE_CONVERSION_WEBGL: 0x9243,
};

module.exports = GLEnums;
