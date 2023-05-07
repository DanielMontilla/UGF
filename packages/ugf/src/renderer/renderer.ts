import { Component, Surface } from "../core";
import { Texture } from "../core/texture";
import { Vec2 } from "../math";
import { Mat4 } from "../math";

export abstract class Renderer {
  public readonly surfaceRef: Surface;
  public projectionMatrix: Mat4;
  
  get canvas(): HTMLCanvasElement { return this.surfaceRef.canvas };
  get surfaceSize(): Vec2 { return this.surfaceRef.size };
  get viewMatrix(): Mat4 { return this.surfaceRef.camera.viewMatrix };

  public constructor(surfaceRef: Surface) {
    this.surfaceRef = surfaceRef;
    this.projectionMatrix = Mat4.orthographic(this.surfaceSize.x, this.surfaceSize.y);
  }

  public abstract declareTexture(texture: Texture): void;
  public abstract declareTextureRemoved(texture: Texture): void;
  public abstract draw(components: Component[]): void;
}