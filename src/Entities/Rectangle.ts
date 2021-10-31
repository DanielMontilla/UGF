import Surface from "../Surface/Surface";
import Entity from "./Entity";

export default class Rectangle extends Entity {
   public color: rgb;

   constructor(
      surface: Surface,
      x: number = 0,
      y: number = 0,
      width: number = 2 ** 4,
      height: number = 2 ** 4,
      color: rgb = [1, 1, 1]
   ) {
      super(surface, x, y, width, height);
      this.color = color;

      surface.addEntity(this);
   }
}