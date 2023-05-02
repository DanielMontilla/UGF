import { Vec2Arr } from "../types";

export class Vec2 {

  public data: Float32Array;

  constructor(x: number, y: number) {
    this.data = new Float32Array(2);
    this.data[0] = x;
    this.data[1] = y;
  };

  get x(): number { return this.data[0] }
  get y(): number { return this.data[1] }

  set x(n: number) { this.data[0] = n }
  set y(n: number) { this.data[1] = n }

  public toArr(): Vec2Arr {
    return [this.x, this.y];
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
  
  public copy(): Vec2 {
    return new Vec2(this.x, this.y);
  }

  public toString(): string {
    return `(${this.x}, ${this.y})`
  }
}

export function vec2(x: number, y: number) { return new Vec2(x, y) };
