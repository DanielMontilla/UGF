import { Vector2 } from "../math";
import { Vec2 } from "../types";

export default class Size extends Vector2 {

  get width(): number { return this.x };
  get height(): number { return this.y };
  set width(n: number) { this.x = n };
  set height(n: number) { this.y = n };

  public constructor(
    width: number,
    height: number,
  ) { super(width, height); }


  public static FromArr(vec: Vec2) {
    return new Size(vec[0], vec[1]);
  }

  public static Zero() {
    return new Size(0, 0);
  }

  public static All(n: number) {
    return new Size(n, n)
  }
}