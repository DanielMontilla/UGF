import Surface from "../Surface";
import { createTexture } from "../webgl-utils";
import Entity from "./Entity";

export default class Sprite extends Entity {

   public x: number;
   public y: number;
   public width: number;
   public height: number;

   public readonly texture: WebGLTexture;

   constructor(surface: Surface, x: number, y: number, source: HTMLImageElement) { 
      super(surface, 'sprite');

      this.x         = x;
      this.y         = y;
      this.width     = source.width;
      this.height    = source.height;

      this.texture   = createTexture(surface.renderer.gl, source);

      surface.addGameObject(this);
   }

   scale = (num: number) => {
      this.width *= num;
      this.height *= num;
   }
}