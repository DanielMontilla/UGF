export const createContext = (canvas: HTMLCanvasElement): WebGLRenderingContext => {
   let gl = canvas.getContext('webgl');
   if (!gl) console.error(`couldn't get webgl context`);
   return <WebGLRenderingContext>gl;
}

/**
 * @param gl webgl rendering context
 * @param type vertex or fragment?
 * @param source GLSL script
 */
 export const createShader = (
   gl: WebGLRenderingContext,
   type: 'vertex' | 'fragment',
   source: string
): WebGLShader => {
   let shaderType = type == 'vertex' ? gl.VERTEX_SHADER : gl.FRAGMENT_SHADER;
   let shader = <WebGLShader>gl.createShader(shaderType);

   gl.shaderSource(shader, source);
   gl.compileShader(shader);

   if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(`Error compiling shader`, gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
   }

   return shader;
};


export const createProgram = (
   gl: WebGLRenderingContext,
   vertextShader: WebGLShader | string,
   fragmentShader: WebGLShader | string
   ): WebGLProgram => {

   let program = <WebGLProgram>gl.createProgram();

   vertextShader =
      typeof vertextShader == 'string'
         ? createShader(gl, 'vertex', vertextShader)
         : vertextShader;
   
   fragmentShader = typeof fragmentShader == 'string'
         ? createShader(gl, 'fragment', fragmentShader)
         : fragmentShader;


   gl.attachShader(program, vertextShader);
   gl.attachShader(program, fragmentShader);

   gl.linkProgram(program);
   gl.validateProgram(program);  // not really sure what this does...

   if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(
         `Error compiling program `,
         gl.getProgramInfoLog(program)
      );
      gl.deleteProgram(program);
   }

   return program;
}

export const setAttribute = (
   gl: WebGLRenderingContext,
   data: Float32Array,
   buffer: WebGLBuffer,
   location: number,
   size: number = 2,
   type: number = gl.FLOAT
) => {
   gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
   gl.enableVertexAttribArray(location);
   gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
   gl.vertexAttribPointer(location, size, type, false, 0, 0);
};

export const setUniform = (
   gl: WebGLRenderingContext,
   data: number[],
   location: WebGLUniformLocation,
   // type: number,
   // size: numebr
) => {
   // TODO
}

export const createCanvas = (width: number, height: number) => {
   let canvas = document.createElement('canvas');
   canvas.width = width;
   canvas.height = height;
   document.body.append(canvas);
   return canvas;
}

/**
 * @param gl WebGLRenderingContext
 * @param source HTMLImageElement
 * @returns WebGLTexture
 */
export const createTexture = (gl: WebGLRenderingContext, source: HTMLImageElement, unit?: number): WebGLTexture => {
   let texture = <WebGLTexture>gl.createTexture();
   unit = (unit) ? unit : 0;

   gl.activeTexture(gl.TEXTURE0 + unit);
   gl.bindTexture(gl.TEXTURE_2D, texture);
   gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
   
   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

   // gl.generateMipmap(gl.TEXTURE_2D);

   return texture;
}

/**
 * 
 * @copyright https://wikimedia.org/api/rest_v1/media/math/render/svg/1d2af32ec0b29f7819e989e82c91dcee431a9921
 */
export const createOrthoMatrix = (
   right: number,
   bottom: number,
   left: number   = 0,
   top: number    = 0,
   far: number    = 1000,
   near: number   = -1000
) => {
   let mat = new Array<number>(4 * 4).fill(0);

   mat[0]   = 2 / (right - left);
   mat[5]   = 2 / (top - bottom),
   mat[10]  = -2 / (far - near);
   mat[12]  = -(right + left) / (right - left);
   mat[13]  = -(top + bottom) / (top - bottom);
   mat[14]  = -(far + near)/(far - near);
   mat[15]  = 1;

   return mat;
}

/**
 * @copyright https://en.wikipedia.org/wiki/Transformation_matrix#Affine_transformations
 */
export const createTranslationMatrix = (x: number, y: number) => [
   1,    0,    0,    0,
   0,    1,    0,    0,
   0,    0,    1,    0,
   x,    y,    0,    1
];
