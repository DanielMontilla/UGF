import { UNIT_COUNTS, GL_UNIT_TYPES, GL_TYPES } from "../data";

export type ComponentPrimitive =
  'rectangle' | 'sprite' /* | 'polygon' | 'circle' */;

export type GLUnitType = typeof GL_UNIT_TYPES[number];
export type GLType = typeof GL_TYPES[number];
export type UnitCount = typeof UNIT_COUNTS[number];

export type Attribute = {
  /** string matching unique shader attribute symbol */
  readonly name: string;

  /** logical index position within shader */
  readonly location: number;

  /** amount of components */
  readonly unitCount: UnitCount;

  /** total size (in bytes) */
  readonly size: number;

  /** gl type id */
  readonly type: GLType;

  /** singular gl type id */
  readonly unitType: GLUnitType;

  /** distance (in bytes) from vertex start */
  readonly offset: number;
}

export type Uniform = {
  id: number,
  location: WebGLUniformLocation,
  type: number,
  size: number
}