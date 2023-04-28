export class Color {

  constructor(
    public r: number,
    public g: number,
    public b: number,
    public a: number = 1
  ) {}

  static rgb(r: number, g: number, b: number): Color {
    return new Color(r, g, b);
  }

  static rgba(r: number, g: number, b: number, a: number): Color {
    return new Color(r, g, b, a);
  }

  static black(): Color {
    return new Color(0, 0, 0);
  }

  static white(): Color {
    return new Color(255, 255, 255);
  }
}