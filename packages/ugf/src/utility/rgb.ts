import { Vector3 } from "../math";
import { Vec3 } from "../types";

export default class Rgb extends Vector3 {

  get r(): number { return this.x };
  get g(): number { return this.y };
  get b(): number { return this.z };
  set r(n: number) { this.x = n };
  set g(n: number) { this.y = n };
  set b(n: number) { this.z = n };

  public constructor(
    r: number,
    g: number,
    b: number,
  ) { super(r, g, b); }


  public static FromArr(vec: Vec3) {
    return new Rgb(vec[0], vec[1], vec[2]);
  }

  public static Zero() {
    return new Rgb(0, 0, 0);
  }

  public static All(n: number) {
    return new Rgb(n, n, n);
  }
}