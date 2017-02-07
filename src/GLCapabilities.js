/**
 * Created by Florin on 24-Dec-16.
 */

function GLCapabilities(gl) {

    this._extensions = [
        ['ANGLE_instanced_arrays'],
        ['EXT_blend_minmax'],
        ['EXT_color_buffer_half_float'],
        ['EXT_disjoint_timer_query'],
        ['EXT_frag_depth'],
        ['EXT_sRGB'],
        ['EXT_shader_texture_lod'],
        ['EXT_texture_filter_anisotropic', 'MOZ_EXT_texture_filter_anisotropic', 'WEBKIT_EXT_texture_filter_anisotropic'],
        ['OES_element_index_uint'],
        ['OES_standard_derivatives'],
        ['OES_texture_float'],
        ['OES_texture_float_linear'],
        ['OES_texture_half_float'],
        ['OES_texture_half_float_linear'],
        ['OES_vertex_array_object'],
        ['WEBGL_color_buffer_float'], //The OES_texture_float extension implicitly enables this extension. Not true!!!
        ['WEBGL_compressed_texture_atc'], //Adreno GPUs, that are currently only built into Qualcomm Snapdragon devices.
        ['WEBGL_compressed_texture_es3'],
        ['WEBGL_compressed_texture_etc1'],
        ['WEBGL_compressed_texture_pvrtc'], //PowerVR GPUs, iPhones, iPads, some android devices
        ['WEBGL_compressed_texture_s3tc', 'MOZ_WEBGL_compressed_texture_s3tc', 'WEBKIT_WEBGL_compressed_texture_s3tc'],
        ['WEBGL_debug_renderer_info'],
        ['WEBGL_debug_shaders'],
        ['WEBGL_depth_texture', 'MOZ_WEBGL_depth_texture', 'WEBKIT_WEBGL_depth_texture'],
        ['WEBGL_draw_buffers'],
        ['WEBGL_lose_context', 'MOZ_WEBGL_lose_context', 'WEBKIT_WEBGL_lose_context']
    ];

    this.supportedExtensions = gl.getSupportedExtensions();

    for (var i = 0; i < this._extensions.length; i++) {
        var ext = this._extensions[i];
        var key = ext[0];
        if (ext.length === 3) {
            this[key] = gl.getExtension(key) || gl.getExtension(ext[1]) || gl.getExtension(ext[2]);
        }
        else {
            this[key] = gl.getExtension(key)
        }
    }

    this.contextAttributes = gl.getContextAttributes();

    this.MAX_COMBINED_TEXTURE_IMAGE_UNITS = gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS);
    this.MAX_CUBE_MAP_TEXTURE_SIZE = gl.getParameter(gl.MAX_CUBE_MAP_TEXTURE_SIZE);
    this.MAX_FRAGMENT_UNIFORM_VECTORS = gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS);
    this.MAX_RENDERBUFFER_SIZE = gl.getParameter(gl.MAX_RENDERBUFFER_SIZE);
    this.MAX_TEXTURE_IMAGE_UNITS = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
    this.MAX_TEXTURE_SIZE = gl.getParameter(gl.MAX_TEXTURE_SIZE);
    this.MAX_VARYING_VECTORS = gl.getParameter(gl.MAX_VARYING_VECTORS);
    this.MAX_VERTEX_ATTRIBS = gl.getParameter(gl.MAX_VERTEX_ATTRIBS);
    this.MAX_VERTEX_TEXTURE_IMAGE_UNITS = gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS);
    this.MAX_VERTEX_UNIFORM_VECTORS = gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS);
    this.MAX_VIEWPORT_DIMS = gl.getParameter(gl.MAX_VIEWPORT_DIMS);

    this.MAX_ANISOTROPY = this.EXT_texture_filter_anisotropic ?
        gl.getParameter(this.EXT_texture_filter_anisotropic.MAX_TEXTURE_MAX_ANISOTROPY_EXT) : 0;

}

module.exports = GLCapabilities;