import Texture from "../Renderer/Texture";
import Surface from "../Surface";
import { rand } from "../util";
import Entity from "./Entity";

export default class Sprite extends Entity {

   public textureID: string = '';

   public x: number;
   public y: number;
   public width: number;
   public height: number;

   public readonly texture: Texture;
   public frame: number;

   constructor(surface: Surface, x: number, y: number, texture: Texture, frame: number = 0) { 
      super(surface);

      this.texture   = texture;
      this.frame     = this.frameExists(frame) ? frame : 0;

      this.x         = x;
      this.y         = y;
      this.width     = texture.img.width;
      this.height    = texture.img.height;

      surface.addEntity(this);
   }

   public scale = (num: number) => {
      this.width *= num;
      this.height *= num;
      return this;
   }

   public nextFrame = () => {
      if (this.frameExists(this.frame + 1)) {
         this.frame++
      } else {
         this.frame = 0;
      }
   }

   public randomFrame = () => {
      let original = this.frame;
      while (original == this.frame) {
         this.frame = rand(0, this.texture.frameData.length - 1, true);
      }
   }

   private frameExists(frame: number) {
      if (frame < 0 || frame > this.texture.frameData.length - 1) return false;
      return true;
   }
}