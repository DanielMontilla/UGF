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
 * TODO: parameterize texture options. Chech for non power of 2 texture sources
 * @param gl WebGLRenderingContext
 * @param source HTMLImageElement
 * @returns WebGLTexture
 */
export const createTexture = (gl: WebGLRenderingContext, source: HTMLImageElement): WebGLTexture => {
   let texture = <WebGLTexture>gl.createTexture();

   gl.bindTexture(gl.TEXTURE_2D, texture);
   gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
   
   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

   // gl.generateMipmap(gl.TEXTURE_2D);

   return texture;
}
