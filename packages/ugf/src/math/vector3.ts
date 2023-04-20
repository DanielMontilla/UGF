import { Vec3 } from "../types";

export default class Vector3 {
  
  get array(): Vec3 { return [this.x, this.y, this.z]; }
  
  public constructor(
    public x: number,
    public y: number,
    public z: number,
  ) {}

  public static FromArr(vec: Vec3) {
    return new Vector3(vec[0], vec[1], vec[2]);
  }

  public static Zero() {
    return new Vector3(0, 0, 0);
  }

  public static All(n: number) {
    return new Vector3(n, n, n)
  }
}