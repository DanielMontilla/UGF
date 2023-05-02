import { Vec4 } from "../math/vec4";

export class Color extends Vec4 {

  constructor(r: number, g: number, b: number, a: number = 1) {
    super(r, g, b, a);
  }

  get r(): number { return this.data[0] };
  get g(): number { return this.data[1] };
  get b(): number { return this.data[2] };
  get a(): number { return this.data[3] };

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