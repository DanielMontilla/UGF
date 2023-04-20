import { COMPONENT_SIZES as COMPONENT_COUNTS, GL_TYPES } from "../data";

export type ComponentPrimitive =
  'rectangle' | 'sprite' /* | 'polygon' | 'circle' */;

export type GLType = typeof GL_TYPES[number];
export type ComponentCount = typeof COMPONENT_COUNTS[number];

export type Attribute = {
  /** string matching unique shader attribute symbol */
  readonly name: string,

  /** logical index position within shader */
  readonly location: number,

  /** amount of components */
  readonly componentCount: ComponentCount;

  /** total size (in bytes) */
  readonly size: number;

  /** gl type id */
  readonly type: GLType

  /** distance (in bytes) from vertex start */
  readonly offset: number;
}

export type Uniform = {
  id: number,
  location: WebGLUniformLocation,
  type: number,
  size: number
}