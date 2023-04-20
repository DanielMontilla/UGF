import type { Mat4 } from "../types";

/**
 *
 * @copyright https://wikimedia.org/api/rest_v1/media/math/render/svg/1d2af32ec0b29f7819e989e82c91dcee431a9921
 */
export function createOrthographicMatrix(
  right: number,
  bottom: number,
  left: number = 0,
  top: number = 0,
  far: number = 1000,
  near: number = -1000
): Mat4 {
  let mat = create4x4EmptyMatrix();

  mat[0] = 2 / (right - left);
  mat[5] = 2 / (top - bottom), 
  mat[10] = -2 / (far - near);
  mat[12] = -(right + left) / (right - left);
  mat[13] = -(top + bottom) / (top - bottom);
  mat[14] = -(far + near) / (far - near);
  mat[15] = 1;

  return mat;
}

export function create4x4IdentityMatrix(): Mat4 {
  return [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1,
  ]
}

export function create4x4EmptyMatrix(): Mat4 {
  return [
    0, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, 0,
  ]
}