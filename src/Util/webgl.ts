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
   vertextShader: WebGLShader | 'vertex',
   fragmentShader: WebGLShader | 'fragment'
   ): WebGLProgram => {

   let program = <WebGLProgram>gl.createProgram();

   vertextShader =
      typeof vertextShader == 'string'
         ? createShader(gl, 'vertex', vertextShader)
         : vertextShader;
   
   fragmentShader = 
      typeof fragmentShader == 'string'
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


/**
 * @note a more pragmatic way of setting these values must exist.
 * @param type 
 * @returns 
 */
export const getDataFromType = (
   type: number,
): [unitType: number, units: number, totalSize: number] => {
   let unitType: number;
   let units: number;
   let unitSize: number;
   let totalSize: number;
   let gl = WebGLRenderingContext;

   // TODO: move this elsewhere to use global consts
   let FLOAT_SIZE = 4;

   switch (type) {
      case gl.FLOAT:
         unitType    = gl.FLOAT;
         units       = 1;
         unitSize    = FLOAT_SIZE;
         break;
      
      case gl.FLOAT_VEC2:
         unitType    = gl.FLOAT;
         units       = 2;
         unitSize    = FLOAT_SIZE;
         break;

      case gl.FLOAT_VEC3:
         unitType    = gl.FLOAT;
         units       = 3;
         unitSize    = FLOAT_SIZE;
         break;
   
      default:
         unitType    = -1;
         units       = -1;
         unitSize    = -.5;

         console.warn(`${type} is not a valid WebGL type`)
         break;
   }

   totalSize = units * unitSize;

   return [unitType, units, totalSize];
};

/**
 * @param elems amount of elements that fit in iao
 * @returns iao
 */
export const createQuadIAO = (elems: number): number[] => {
   let arr: number[] = [];
   let step: number;
   let offset: number;

   // TODO: move this elsewhere to use global consts
   let VERTEX_PER_QUAD = 4;
   let INDICES_PER_QUAD = 6;

   for (let i = 0; i < elems; i++) {
      offset   = VERTEX_PER_QUAD * i;
      step     = INDICES_PER_QUAD * i;

      arr[step + 0] = offset + 0;   // v1
      arr[step + 1] = offset + 1;   // v2
      arr[step + 2] = offset + 2;   // v3
      arr[step + 3] = offset + 2;   // v3
      arr[step + 4] = offset + 1;   // v1
      arr[step + 5] = offset + 3;   // v4
   };

   return arr;
}

export const loadImage = async (path: string) => {
   let img = new Image();
   img.src = path;
   await img.decode();
   return img;
};