export class Vec2 {
  constructor(
    public x: number,
    public y: number
  ) {};

  public toArr(): [x: number, y: number] {
    return [this.x, this.y];
  }

  static all(n: number) {
    return new Vec2(n, n);
  }

  static fromArray(arr: [x: number, y: number]) {
    return new Vec2(arr[0], arr[1]);
  }

  static zero() {
    return new Vec2(0, 0);
  }
}

export function vec2(x: number, y: number) { return new Vec2(x, y) };
