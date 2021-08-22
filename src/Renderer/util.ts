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
