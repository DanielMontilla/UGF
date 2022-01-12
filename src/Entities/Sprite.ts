import Texture from "../Renderer/Texture";
import Surface from "../Core/Surface";
import { randInt } from "../Util/math";
import Entity from "./Entity";
import { MANAGERS } from "../Renderer/CONST";

export default class Sprite extends Entity {

   public readonly manager = MANAGERS.sprite;

   public readonly texture: Texture;
   public frame: number;

   constructor(surface: Surface, x: number, y: number, texture: Texture, frame: number = 0) { 
      super(surface, x, y, texture.img.width, texture.img.height);

      this.texture   = texture;
      this.frame     = this.frameExists(frame) ? frame : 0;

      surface.addEntity(this);
   }

   public nextFrame() {
      if (this.frameExists(this.frame + 1)) {
         this.frame++
      } else {
         this.frame = 0;
      }
   }

   public setFrame(n: number) {
      if (this.frameExists(n)) {
         this.frame = n;
      } else {
         console.warn(`this texture does not have frame ${n}`);
      }
   }

   public randomFrame () {
      let original = this.frame;
      while (original == this.frame) {
         this.frame = randInt(0, this.texture.frameData.length - 1);
      }
   }

   private frameExists(frame: number) {
      if (frame < 0 || frame > this.texture.frameData.length - 1) return false;
      return true;
   }

   public getVertexData(): number[] {
      return [];
   }
}