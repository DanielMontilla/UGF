import { Vec2 } from "../types";

export default class Vector2 {
  
  get array(): Vec2 { return [this.x, this.y]; }
  
  public constructor(
    public x: number,
    public y: number
  ) {}

  public static FromArr(vec: Vec2) {
    return new Vector2(vec[0], vec[1]);
  }

  public static Zero() {
    return new Vector2(0, 0);
  }

  public static All(n: number) {
    return new Vector2(n, n)
  }
}