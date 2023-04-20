import { Surface } from "../core";
import { Mat4, Resolution } from "../types";
import { createOrthographicMatrix } from "../functions";

export default abstract class Renderer {
  public readonly surfaceRef: Surface;
  public projectionMatrix: Mat4;

  abstract readonly context: WebGL2RenderingContext;
  
  get canvas(): HTMLCanvasElement { return this.surfaceRef.canvas };
  get resolution(): Resolution { return this.surfaceRef.resolution };

  public constructor(surfaceRef: Surface) {
    this.surfaceRef = surfaceRef;
    this.projectionMatrix = createOrthographicMatrix(this.resolution.width, this.resolution.width);
  }

  public abstract draw(): void;
}