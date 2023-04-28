import { Component, Surface } from "../core";
import { Matrix4 } from "../types";
import { createOrthographicMatrix } from "../functions";
import { Vec2 } from "../math";

export abstract class Renderer {
  public readonly surfaceRef: Surface;
  public projectionMatrix: Matrix4;
  
  get canvas(): HTMLCanvasElement { return this.surfaceRef.canvas };
  get surfaceSize(): Vec2 { return this.surfaceRef.size };
  get viewMatrix(): Matrix4 { return this.surfaceRef.camera.viewMatrix };

  public constructor(surfaceRef: Surface) {
    this.surfaceRef = surfaceRef;
    this.projectionMatrix = createOrthographicMatrix(this.surfaceSize.x, this.surfaceSize.y);
  }

  public abstract draw(components: Component[]): void;
}