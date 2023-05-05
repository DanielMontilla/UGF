import { Mat4Arr } from "../types";
import { Vec2 } from "../math";

/**
 * Utility class for handeling 4x4 matrices.
 * 
 * The matrix is laid out the following way in memory (column-major order):
 * ```
 * | 0  1  2  3  |
 * | 4  5  6  7  |
 * | 8  9  10 11 |
 * | 12 13 14 15 |
 * ```
 * But the indices are labeled as such:
 */
export class Mat4 {

  public order: 'colum-major' | 'row-major' = 'colum-major';
  public readonly data: Float32Array;

  constructor(array: Mat4Arr) {
    this.data = new Float32Array(array);
  }

  get tx(): number { return this[12] }  set tx(n: number) { this[12] = n }
  get ty(): number { return this[13] }  set ty(n: number) { this[13] = n }
  get tz(): number { return this[11] } set tz(n: number) { this[11] = n}
  get layer(): number { return this.tz } set layer(n: number) { this.tz = n }
  get position(): Vec2 { return new Vec2(this.tx, this.ty) }

  public setFromMat4(other: Mat4) {
    this.data.set(other.data);
  }

  public set set(other: Mat4) {
    this.setFromMat4(other);
  }
  
  /**
   * Gets the value of an element in the matrix at the specified row and column.
   * @param row - The row index (0 to 3) of the element.
   * @param column - The column index (0 to 3) of the element.
   * @returns The value of the element at the specified row and column.
   */
  public getElement(row: number, column: number): number {
    return this[row * 4 + column];
  }

  /**
   * Sets the value of an element in the matrix at the specified row and column.
   * @param row - The row index (0 to 3) of the element.
   * @param column - The column index (0 to 3) of the element.
   * @param value - The value to set the element to.
   */
  public setElement(row: number, column: number, value: number): void {
    this[row * 4 + column] = value;
  }
  
  /**
   * Multiplies this matrix by another matrix (`this * other`) and returns the result as a new Mat4 instance.
   * @param other - The other matrix to multiply with.
   * @returns A new Mat4 instance with the result of the multiplication.
   */
  public multiply(other: Mat4): Mat4 {
    const result = Mat4.empty();
    
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        let sum = 0;
        for (let k = 0; k < 4; k++) {
          sum += this.getElement(i, k) * other.getElement(k, j);
        }
        result.setElement(i, j, sum);
      }
    }
    return result;
  }

  public translateTo(position: Vec2, layer: number = 0) {
    this.tx = position.x;
    this.ty = position.y;
    this.tz = layer;

    return this;
  }

  public translateBy(position: Vec2) {
    this.tx += position.x;
    this.ty += position.y;
    return this;
  }

  public rotateAlongZTo(radians: number): Mat4 {
    const c = Math.cos(radians);
    const s = Math.sin(radians);

    this[0] = c;
    this[1] = s;
    this[4] = -s;
    this[5] = c;

    return this;
  }

  public scaleTo(scale: Vec2) {
    this[0] = scale.x;
    this[5] = scale.y;
  }

  /**
   * Returns a string representation of the matrix with elements formatted in a 4x4 grid.
   * @returns A string representation of the matrix.
   */
  public toString(): string {
    let result = '';

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        // You can adjust the number of decimal places by changing the argument of 'toFixed()'.
        result += this.getElement(row, col).toFixed(2) + (col < 3 ? '\t' : '');
      }
      result += row < 3 ? '\n' : '';
    }
    return result;
  }

  static empty(): Mat4 {
    return new Mat4([
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
    ]);
  }
  
  static identity(): Mat4 {
    return new Mat4([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1,
    ]);
  }
  
  /** @copyright https://wikimedia.org/api/rest_v1/media/math/render/svg/1d2af32ec0b29f7819e989e82c91dcee431a9921 */
  static orthographic(
    right: number,
    bottom: number,
    left: number = 0,
    top: number = 0,
    far: number = 1000,
    near: number = -1000
  ): Mat4 {
    const mat = Mat4.empty();
    
    mat[0] = 2 / (right - left);
    mat[5] = 2 / (top - bottom), 
    mat[10] = -2 / (far - near);
    mat[12] = -(right + left) / (right - left);
    mat[13] = -(top + bottom) / (top - bottom);
    mat[14] = -(far + near) / (far - near);
    mat[15] = 1;
    
    return mat;
  }
    
  [index: number]: number;

  get 0(): number  { return this.data[0]  }
  get 1(): number  { return this.data[1]  }
  get 2(): number  { return this.data[2]  }
  get 3(): number  { return this.data[3]  }
  get 4(): number  { return this.data[4]  }
  get 5(): number  { return this.data[5]  }
  get 6(): number  { return this.data[6]  }
  get 7(): number  { return this.data[7]  }
  get 8(): number  { return this.data[8]  }
  get 9(): number  { return this.data[9]  }
  get 10(): number { return this.data[10] }
  get 11(): number { return this.data[11] }
  get 12(): number { return this.data[12] }
  get 13(): number { return this.data[13] }
  get 14(): number { return this.data[14] }
  get 15(): number { return this.data[15] }
  
  set 0(n: number)  { this.data[0] = n  }
  set 1(n: number)  { this.data[1] = n  }
  set 2(n: number)  { this.data[2] = n  }
  set 3(n: number)  { this.data[3] = n  }
  set 4(n: number)  { this.data[4] = n  }
  set 5(n: number)  { this.data[5] = n  }
  set 6(n: number)  { this.data[6] = n  }
  set 7(n: number)  { this.data[7] = n  }
  set 8(n: number)  { this.data[8] = n  }
  set 9(n: number)  { this.data[9] = n  }
  set 10(n: number) { this.data[10] = n }
  set 11(n: number) { this.data[11] = n }
  set 12(n: number) { this.data[12] = n }
  set 13(n: number) { this.data[13] = n }
  set 14(n: number) { this.data[14] = n }
  set 15(n: number) { this.data[15] = n }
}