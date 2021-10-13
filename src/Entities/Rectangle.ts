import Surface from "../Surface";
import { createTexture } from "../webgl-utils";
import Entity from "./Entity";

export default class Rectangle extends Entity {

   public x: number;
   public y: number;
   public width: number;
   public height: number;
   public color: rgb;

   constructor(surface: Surface, x: number, y: number, width: number, height: number, color: rgb) { 
      super(surface);

      this.x         = x;
      this.y         = y;
      this.width     = width;
      this.height    = height;
      this.color     = color;

      surface.addEntity(this);
   }

   scale = (num: number) => {
      this.width *= num;
      this.height *= num;
   };
}