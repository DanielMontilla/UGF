import { Vec2Arr } from "../types";

export class Vec2 {

  public readonly data: Float32Array;

  constructor(x: number, y: number) {
    this.data = new Float32Array([x, y]);
  };

  get x(): number { return this.data[0] }
  get y(): number { return this.data[1] }

  set x(n: number) { this.data[0] = n }
  set y(n: number) { this.data[1] = n }

  public toArr(): Vec2Arr {
    return [this.x, this.y];
  }

  public negate() {
    return new Vec2(-this.x, -this.y);
  }

  public set(x: number, y: number) {
    this.data.set([x, y], 0);
    this.x = this.x;
  }
  
  public setFrom(other: Vec2) {
    this.data.set(other.data, 0);
    this.x = this.x;
  }

  static all(n: number) {
    return new Vec2(n, n);
  }

  static fromArray(arr: Vec2Arr) {
    return new Vec2(arr[0], arr[1]);
  }

  static zero() {
    return new Vec2(0, 0);
  }
  
  public clone(): Vec2 {
    return new Vec2(this.x, this.y);
  }

  public multiply(other: Vec2): Vec2 {
    return Vec2.multiply(this, other);
  }

  public add(other: Vec2): Vec2 {
    return Vec2.add(this, other);
  }

  public subtract(other: Vec2): Vec2 {
    return Vec2.subtract(this, other);
  }

  public toString(): string {
    return `(${this.x}, ${this.y})`
  }

  /**
   * Multiplies the given vectors element-wise and returns the result as a new Vec2 instance.
   * @param vectors - Required single vector.
   * @param vectors - An array of Vec2 instances to multiply.
   * @returns A new Vec2 instance with the result of the element-wise multiplication.
   */
  public static multiply(vector: Vec2, ...vectors: Vec2[]): Vec2 {
    const result = vector.clone();
    for (const vec of vectors) {
      result.x *= vec.x;
      result.y *= vec.y;
    }
    return result;
  }

  /**
   * Adds the given vectors element-wise and returns the result as a new Vec2 instance.
   * @param vector - The first Vec2 instance to add.
   * @param vectors - The rest of the Vec2 instances to add.
   * @returns A new Vec2 instance with the result of the element-wise addition.
   */
  public static add(vector: Vec2, ...vectors: Vec2[]): Vec2 {
    const result = vector.clone();
    for (const vec of vectors) {
      result.x += vec.x;
      result.y += vec.y;
    }
    return result;
  }

  /**
   * Subtracts the given vectors element-wise and returns the result as a new Vec2 instance.
   * @param vector - The first Vec2 instance to subtract from.
   * @param vectors - The rest of the Vec2 instances to subtract.
   * @returns A new Vec2 instance with the result of the element-wise subtraction.
   */
  public static subtract(vector: Vec2, ...vectors: Vec2[]): Vec2 {
    const result = vector.clone();
    for (const vec of vectors) {
      result.x -= vec.x;
      result.y -= vec.y;
    }
    return result;
  }

  /**
   * Divides the first vector element-wise by the rest of the given vectors and returns the result as a new Vec2 instance.
   * @param vector - The first Vec2 instance to divide.
   * @param vectors - The rest of the Vec2 instances to divide by.
   * @returns A new Vec2 instance with the result of the element-wise division.
   */
  public static divide(vector: Vec2, ...vectors: Vec2[]): Vec2 {
    const result = vector.clone();
    for (const vec of vectors) {
      result.x /= vec.x;
      result.y /= vec.y;
    }
    return result;
  }
}

export function vec2(x: number, y: number) { return new Vec2(x, y) };
