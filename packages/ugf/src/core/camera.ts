import { Mat4 } from "../math";


export class Camera {

  public readonly viewMatrix: Mat4;

  constructor() {
    this.viewMatrix = Mat4.identity();
  }
}