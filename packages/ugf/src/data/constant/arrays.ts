const gl = WebGL2RenderingContext;

export const GL_UNIT_TYPES = [
  gl.FLOAT,
  gl.INT
] as const;

export const GL_TYPES = [
  ...GL_UNIT_TYPES,
  gl.FLOAT_VEC2,
  gl.FLOAT_VEC3,
  gl.FLOAT_VEC4,
]

export const UNIT_COUNTS = [
  1, 2, 3, 4
] as const;