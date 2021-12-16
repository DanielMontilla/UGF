import Surface from "../Core/Surface";
import RGB from "../Util/Classes/RGB";
import Entity from "./Entity";

export default class Rectangle extends Entity {
   public color: RGB;

   constructor(
      surface: Surface,
      x: number = 0,
      y: number = 0,
      width: number = 2 ** 4,
      height: number = 2 ** 4,
      color: rgb = [1, 1, 1]
   ) {
      super(surface, x, y, width, height);
      this.color = RGB.fromArr(color);

      surface.addEntity(this);
   }
}