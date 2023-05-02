import { Vec4Arr } from "../types";

export class Vec4 {

  public data: Float32Array;

  constructor(x: number, y: number, z: number, w: number) {
    this.data = new Float32Array(4);
    this.data[0] = x;
    this.data[1] = y;
    this.data[2] = z;
    this.data[3] = w;
  };

  get x(): number { return this.data[0] }
  get y(): number { return this.data[1] }
  get z(): number { return this.data[2] }
  get w(): number { return this.data[3] }

  public toArr(): Vec4Arr {
    return [this.x, this.y, this.z, this.w];
  }

  static all(n: number) {
    return new Vec4(n, n, n, n);
  }

  static fromArray(arr: Vec4Arr) {
    return new Vec4(arr[0], arr[1], arr[2], arr[3]);
  }

  static zero() {
    return new Vec4(0, 0, 0, 0);
  }
  
  public copy(): Vec4 {
    return new Vec4(this.x, this.y, this.z, this.w);
  }

  public toString(): string {
    return `(${this.x}, ${this.y}, ${this.z}, ${this.w})`
  }
}

export function vec4(x: number, y: number, z: number, w: number) { return new Vec4(x, y, z, w) };
