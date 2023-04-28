import { create4x4IdentityMatrix } from "../functions";
import { Matrix4 } from "../types";

export class Camera {

  public readonly viewMatrix: Matrix4;

  constructor() {
    this.viewMatrix = create4x4IdentityMatrix();
  }
}