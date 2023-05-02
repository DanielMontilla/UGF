import { Vec3Arr } from "../types";

export class Vec3 {

  private view: Float32Array;

  constructor(x: number, y: number, z: number) {
    this.view = new Float32Array(3);
    this.view[0] = x;
    this.view[1] = y;
    this.view[2] = z;
  };

  get x(): number { return this.view[0] }
  get y(): number { return this.view[1] }
  get z(): number { return this.view[2] }

  public toArr(): Vec3Arr {
    return [this.x, this.y, this.z];
  }

  static all(n: number) {
    return new Vec3(n, n, n);
  }

  static fromArray(arr: Vec3Arr) {
    return new Vec3(arr[0], arr[1], arr[2]);
  }

  static zero() {
    return new Vec3(0, 0, 0);
  }
  
  public copy(): Vec3 {
    return new Vec3(this.x, this.y, this.z);
  }

  public toString(): string {
    return `(${this.x}, ${this.y}, ${this.z})`
  }
}

export function vec3(x: number, y: number, z: number) { return new Vec3(x, y, z) };
