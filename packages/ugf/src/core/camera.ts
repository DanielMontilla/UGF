import { create4x4IdentityMatrix } from "../functions";
import { Mat4 } from "../types";

export class Camera {

  public readonly viewMatrix: Mat4;

  constructor() {
    this.viewMatrix = create4x4IdentityMatrix();
  }
}